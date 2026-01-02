const express = require('express');
const cors = require('cors');
const { google } = require('googleapis');
const dotenv = require('dotenv');
const path = require('path');
const { randomUUID } = require('crypto');
const { sendBookingConfirmation } = require('./emailService');


// Use current directory for env if in production/vercel
const envPath = process.env.VERCEL ? path.join(process.cwd(), '.env.local') : path.join(__dirname, '../.env.local');
dotenv.config({ path: envPath });

// Global Error Handlers to prevent silent crashes
process.on('uncaughtException', (err) => {
    console.error('CRITICAL: Uncaught Exception:', err);
});

process.on('unhandledRejection', (reason, promise) => {
    console.error('CRITICAL: Unhandled Rejection at:', promise, 'reason:', reason);
});

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());


// Serve static files from the React app
app.use(express.static(path.join(__dirname, '../dist')));


// Calendar Setup
const SCOPES = ['https://www.googleapis.com/auth/calendar'];
const CALENDAR_ID = process.env.GOOGLE_CALENDAR_ID;

let auth;
console.log('Checking for GOOGLE_SERVICE_ACCOUNT_JSON...');
if (process.env.GOOGLE_SERVICE_ACCOUNT_JSON) {
    console.log('GOOGLE_SERVICE_ACCOUNT_JSON found. Attempting to parse...');
    // Production: Load credentials from environment variable
    try {
        const credentials = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_JSON);
        auth = new google.auth.GoogleAuth({
            credentials,
            scopes: SCOPES,
        });
        console.log('GoogleAuth initialized with environment variable credentials.');
    } catch (error) {
        console.error('Failed to parse GOOGLE_SERVICE_ACCOUNT_JSON:', error);
    }
} else {
    console.log('GOOGLE_SERVICE_ACCOUNT_JSON NOT found. Falling back to file.');
    // Development: Load credentials from file
    const KEYFILE_PATH = process.env.VERCEL
        ? path.join(process.cwd(), 'server', 'service-account.json')
        : path.join(__dirname, 'service-account.json');
    try {
        auth = new google.auth.GoogleAuth({
            keyFile: KEYFILE_PATH,
            scopes: SCOPES,
        });
    } catch (err) {
        console.error('Google Auth File Error:', err.message);
        // Fallback to a dummy auth to prevent immediate crash of google.calendar()
        auth = new google.auth.GoogleAuth({
            scopes: SCOPES
        });
    }
}

const calendar = google.calendar({ version: 'v3', auth });

// Square Setup
const square = require('square');

// Square SDK v40+ uses Client or SquareClient depending on build/import
const SquareConstructor = square.Client || square.SquareClient;
const Env = square.Environment;

const rawToken = process.env.SQUARE_ACCESS_TOKEN || '';
const cleanToken = rawToken.replace(/['"]/g, '').trim();
const appId = (process.env.VITE_SQUARE_APP_ID || '').trim();

// Check BOTH token and App ID for sandbox indicators
const isSandbox = cleanToken.startsWith('sandbox-') || appId.startsWith('sandbox-');

console.log(`Environment Detected: ${isSandbox ? 'SANDBOX' : 'PRODUCTION'}`);

// Health Check
app.get('/api/health', (req, res) => {
    res.json({
        status: 'online',
        mode: isSandbox ? 'SANDBOX' : 'PRODUCTION'
    });
});

if (!SquareConstructor) {
    console.error('CRITICAL: Square Client constructor not found! Keys:', Object.keys(square));
}

const squareClient = SquareConstructor ? new SquareConstructor({
    accessToken: cleanToken,
    environment: isSandbox ? 'https://connect.squareupsandbox.com' : 'https://connect.squareup.com',
}) : null;

app.post('/api/pay', async (req, res) => {
    console.log('--- New Payment Request ---');
    console.log('Request Body:', JSON.stringify(req.body, null, 2));
    const { sourceId, amount, locationId, currency = 'USD' } = req.body;

    try {
        const baseUrl = isSandbox ? 'https://connect.squareupsandbox.com' : 'https://connect.squareup.com';
        console.log(`Using Square API: ${baseUrl}`);
        console.log(`Token Length: ${cleanToken.length}`);
        console.log(`Token Prefix: ${cleanToken.substring(0, 10)}...`);

        if (!sourceId || !locationId || !amount) {
            console.error('Missing required fields:', { sourceId: !!sourceId, locationId: !!locationId, amount: !!amount });
            return res.status(400).json({ error: 'Missing required payment details' });
        }

        const payload = {
            source_id: sourceId,
            location_id: locationId,
            idempotency_key: randomUUID(),
            amount_money: {
                amount: Math.round(Number(amount) * 100),
                currency: currency
            }
        };

        console.log('Sending payload to Square...');

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000);

        const response = await fetch(`${baseUrl}/v2/payments`, {
            method: 'POST',
            signal: controller.signal,
            headers: {
                'Authorization': `Bearer ${cleanToken}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        }).finally(() => clearTimeout(timeoutId));

        console.log('Received response from Square:', response.status);

        const data = await response.json();

        if (!response.ok) {
            console.error('Square API Error:', JSON.stringify(data, null, 2));
            const errorDetail = data.errors ? data.errors[0].detail : 'Unknown Error';
            return res.status(response.status).json({
                error: 'Payment failed',
                details: errorDetail,
                raw: data
            });
        }

        console.log('Payment successful. ID:', data.payment.id);
        res.status(200).json({ success: true, payment: data.payment });

    } catch (error) {
        console.error('Internal Server Error during Payment:', error);
        res.status(500).json({ error: 'Internal Server Error', message: error.message });
    }
});
// Endpoint to check availability
app.get('/api/availability', async (req, res) => {
    try {
        const { date } = req.query;
        console.log(`Availability check for date: ${date}`);

        if (!date) {
            return res.status(400).json({ error: 'Date parameter is required' });
        }

        if (!CALENDAR_ID) {
            console.error("Missing GOOGLE_CALENDAR_ID");
            return res.status(500).json({ error: 'Server configuration error' });
        }

        const startOfDay = new Date(date);
        startOfDay.setHours(0, 0, 0, 0);

        const endOfDay = new Date(date);
        endOfDay.setHours(23, 59, 59, 999);

        console.log(`Fetching events from ${startOfDay.toISOString()} to ${endOfDay.toISOString()}`);

        const response = await calendar.events.list({
            calendarId: CALENDAR_ID,
            timeMin: startOfDay.toISOString(),
            timeMax: endOfDay.toISOString(),
            singleEvents: true,
            orderBy: 'startTime',
        });

        const events = response.data.items || [];
        console.log(`Found ${events.length} events`);

        // Filter events by experience type (Resource Separation)
        const myExperience = (req.query.experience || '').toLowerCase(); // 'vr free roam', 'sim racing', or 'package'

        const busySlots = [];

        events.forEach(event => {
            const summary = (event.summary || '').toLowerCase();
            const description = (event.description || '').toLowerCase();

            // Determine resource type of the EXISTING event
            let isRacing = summary.includes('sim racing') || description.includes('sim racing');
            let isPackage = summary.includes('package') || summary.includes('booking:') || description.includes('package');
            // Note: 'Booking:' is the prefix we use. If it's old data, might just say "Sim Racing".

            // If explicit package, treat as package.
            // If Sim Racing, treat as Racing.
            // Otherwise, assume VR (default).
            if (summary.includes('vr free roam')) {
                isRacing = false;
                isPackage = false; // Explicit VR
            }

            // Determine resource type of the REQUESTED experience
            const reqRacing = myExperience.includes('sim racing');
            const reqPackage = myExperience.includes('package');
            const reqVR = !reqRacing && !reqPackage; // Default

            // CONFLICT RULES:
            // 1. Sim Racing only conflicts with Sim Racing
            // 2. VR conflicts with VR
            // 3. Packages? User said "Party packages... make sure time block varies... each one are different services".
            //    We will treat "Package" as its own bucket for now, UNLESS they share resources. 
            //    Standard practice: Parties usually use VR. But user insists on separation.
            //    We will strictly block only if types match.

            let conflict = false;
            if (reqRacing && isRacing) conflict = true;
            else if (reqVR && !isRacing && !isPackage) conflict = true; // VR blocks VR
            else if (reqPackage && isPackage) conflict = true; // Package blocks Package

            // If types don't match, we IGNORE this event (it doesn't block us).
            if (conflict) {
                busySlots.push({
                    start: event.start.dateTime || event.start.date,
                    end: event.end.dateTime || event.end.date
                });
            }
        });

        res.json({ busySlots });
    } catch (error) {
        console.error('Error fetching availability:', error);
        res.status(500).json({ error: 'Failed to fetch availability', message: error.message });
    }
});

app.post('/api/bookings', async (req, res) => {
    console.log('Received booking request:', JSON.stringify(req.body, null, 2));
    try {
        const {
            experience,
            date,
            timeSlot,
            duration,
            guestName,
            guestEmail,
            guestPhone,
            participants = 1
        } = req.body;

        if (!CALENDAR_ID) {
            console.error("Missing GOOGLE_CALENDAR_ID in .env.local");
            return res.status(500).json({ error: 'Server configuration error' });
        }

        const guestEmailToUse = guestEmail || req.body.email;
        console.log(`[BOOKING] Creating calendar event for ${guestEmailToUse} on ${date} at ${timeSlot} for ${participants} people`);

        // Parse time: "2:30 PM" -> hours: 14, minutes: 30
        const [time, period] = timeSlot.split(' ');
        let [hours, minutes] = time.split(':').map(Number);

        if (period === 'PM' && hours !== 12) hours += 12;
        if (period === 'AM' && hours === 12) hours = 0;

        // Construct a "Floating" ISO string (No Z at the end)
        // date is "YYYY-MM-DD" or similar ISO string
        const datePart = new Date(date).toISOString().split('T')[0];
        const startDateTimeStr = `${datePart}T${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:00`;

        // Calculate end time
        const startDateTime = new Date(`${startDateTimeStr}-06:00`); // Temporary parse to calculate duration
        // Note: -06:00 is a fallback, but we'll use the floating string for the actual API call 
        // to let Google handle the DST transitions correctly based on the 'America/Chicago' zone.
        const endDateTimeTemp = new Date(startDateTime.getTime() + duration * 60000);
        const endHours = endDateTimeTemp.getHours();
        const endMinutes = endDateTimeTemp.getMinutes();
        const endDateTimeStr = `${datePart}T${endHours.toString().padStart(2, '0')}:${endMinutes.toString().padStart(2, '0')}:00`;

        // CHECK FOR CONFLICTS (Using absolute times for conflict check)
        const conflictCheck = await calendar.events.list({
            calendarId: CALENDAR_ID,
            timeMin: startDateTime.toISOString(),
            timeMax: endDateTimeTemp.toISOString(),
            singleEvents: true,
        });

        const conflictingEvents = conflictCheck.data.items || [];
        const actualConflicts = conflictingEvents.filter(event => {
            const eventStart = new Date(event.start.dateTime || event.start.date).getTime();
            const eventEnd = new Date(event.end.dateTime || event.end.date).getTime();
            const newStart = startDateTime.getTime();
            const newEnd = endDateTimeTemp.getTime();

            // Time overlap check
            if (!(newStart < eventEnd && newEnd > eventStart)) return false;

            // Resource Type Check (Copy of logic from availability endpoint)
            const summary = (event.summary || '').toLowerCase();
            const myExp = (experience || '').toLowerCase();

            const isRacingEvent = summary.includes('sim racing');
            const isPackageEvent = summary.includes('package');
            const isVREvent = !isRacingEvent && !isPackageEvent; // Assume VR if not others

            const reqRacing = myExp.includes('sim racing');
            const reqPackage = myExp.includes('package');
            const reqVR = !reqRacing && !reqPackage;

            if (reqRacing && isRacingEvent) return true;
            if (reqVR && isVREvent) return true;
            if (reqPackage && isPackageEvent) return true;

            return false; // Different resource, no conflict
        });

        if (actualConflicts.length > 0) {
            console.warn('Booking conflict detected:', actualConflicts);
            return res.status(409).json({ error: 'Time slot is already booked' });
        }

        console.log('Event Start (Floating):', startDateTimeStr);
        console.log('Event End (Floating):', endDateTimeStr);

        const eventDescription = `Guest: ${guestName}
Email: ${guestEmailToUse}
Phone: ${guestPhone || 'Not provided'}
Experience: ${experience}
Participants: ${participants}`;

        console.log('Generated Event Description:', eventDescription);

        const event = {
            summary: `Booking: ${experience} (${participants} ${participants === 1 ? 'person' : 'people'})`,
            description: eventDescription,
            start: {
                dateTime: startDateTimeStr,
                timeZone: 'America/Chicago',
            },
            end: {
                dateTime: endDateTimeStr,
                timeZone: 'America/Chicago',
            },
        };

        const response = await calendar.events.insert({
            calendarId: CALENDAR_ID,
            resource: event,
        });

        console.log('Event created successfully. Link:', response.data.htmlLink);

        // Send email confirmation and await it to ensure it sends before serverless function freezes
        try {
            await sendBookingConfirmation({
                experience,
                date,
                timeSlot,
                guestName,
                guestEmail: guestEmailToUse,
                participants
            });
        } catch (emailErr) {
            console.error('Email sending failed (non-fatal):', emailErr);
            // We continue to return success because the booking (calendar event) WAS created.
        }

        res.status(200).json({ success: true, link: response.data.htmlLink });

    } catch (error) {
        console.error('Error in bookings endpoint:', error);
        res.status(500).json({
            error: 'Failed to create booking',
            message: error.message,
            stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
        });
    }
});

// Handle React routing, return all requests to React app
app.get('*', (req, res) => {
    // Skip API routes
    if (req.path.startsWith('/api')) {
        return res.status(404).json({ error: 'API endpoint not found' });
    }
    res.sendFile(path.join(__dirname, '../dist', 'index.html'));
});

if (process.env.NODE_ENV !== 'production' || !process.env.VERCEL) {
    app.listen(PORT, () => {
        console.log(`Server running on http://localhost:${PORT}`);
    });
}

module.exports = app;
