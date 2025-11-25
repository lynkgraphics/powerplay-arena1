const express = require('express');
const cors = require('cors');
const { google } = require('googleapis');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../.env.local') });

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Root Route for Status Check
app.get('/api/health', (req, res) => {
    res.send('PowerPlay Arena Backend is Running! 🚀');
});

// Serve static files from the React app
app.use(express.static(path.join(__dirname, '../dist')));

// Handle React routing, return all requests to React app
app.get('*', (req, res) => {
    // Skip API routes
    if (req.path.startsWith('/api')) {
        return res.status(404).json({ error: 'API endpoint not found' });
    }
    res.sendFile(path.join(__dirname, '../dist', 'index.html'));
});

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
    const KEYFILE_PATH = path.join(__dirname, 'service-account.json');
    auth = new google.auth.GoogleAuth({
        keyFile: KEYFILE_PATH,
        scopes: SCOPES,
    });
}

const calendar = google.calendar({ version: 'v3', auth });

// Square Setup
const square = require('square');
const { SquareClient } = square;
const { randomUUID } = require('crypto');

const squareClient = new SquareClient({
    token: process.env.SQUARE_ACCESS_TOKEN,
    baseUrl: 'https://connect.squareup.com',
});

app.post('/api/pay', async (req, res) => {
    console.log('Received payment request:', JSON.stringify(req.body, null, 2));
    const { sourceId, amount, currency = 'USD' } = req.body;

    try {
        console.log('Calling Square API...');
        const response = await squareClient.payments.create({
            sourceId,
            idempotencyKey: randomUUID(),
            amountMoney: {
                amount: BigInt(Math.round(amount * 100)), // Amount in cents
                currency,
            },
        });

        console.log('Square API Response:', JSON.stringify(response, (key, value) =>
            typeof value === 'bigint' ? value.toString() : value
            , 2));

        if (response.payment) {
            console.log('Payment successful. ID:', response.payment.id);
        } else {
            console.log('Payment response missing payment object:', response);
        }

        // Convert BigInt values to strings for JSON serialization
        const paymentData = JSON.parse(JSON.stringify(response.payment, (key, value) =>
            typeof value === 'bigint' ? value.toString() : value
        ));

        res.status(200).json({ success: true, payment: paymentData });
    } catch (error) {
        console.error('Payment failed:', error);
        if (error.errors) {
            console.error('Square Error Details:', JSON.stringify(error.errors, null, 2));
        }
        res.status(500).json({ error: 'Payment failed', details: error.message });
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

        const busySlots = events.map(event => ({
            start: event.start.dateTime || event.start.date,
            end: event.end.dateTime || event.end.date
        }));

        res.json({ busySlots });
    } catch (error) {
        console.error('Error fetching availability:', error);
        res.status(500).json({ error: 'Failed to fetch availability' });
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
            guestPhone
        } = req.body;

        if (!CALENDAR_ID) {
            console.error("Missing GOOGLE_CALENDAR_ID in .env.local");
            return res.status(500).json({ error: 'Server configuration error' });
        }

        console.log(`Creating calendar event for ${guestEmail} on ${date} at ${timeSlot}`);

        // Parse date and time
        const dateObj = new Date(date);
        const [time, period] = timeSlot.split(' ');
        let [hours, minutes] = time.split(':').map(Number);

        if (period === 'PM' && hours !== 12) hours += 12;
        if (period === 'AM' && hours === 12) hours = 0;

        const startDateTime = new Date(dateObj);
        startDateTime.setHours(hours, minutes, 0, 0);

        const endDateTime = new Date(startDateTime.getTime() + duration * 60000);

        // CHECK FOR CONFLICTS
        const conflictCheck = await calendar.events.list({
            calendarId: CALENDAR_ID,
            timeMin: startDateTime.toISOString(),
            timeMax: endDateTime.toISOString(),
            singleEvents: true,
        });

        const conflictingEvents = conflictCheck.data.items || [];
        // Filter out events that end exactly when this one starts or start exactly when this one ends
        // (though timeMin/timeMax are inclusive, so we should be careful)
        const actualConflicts = conflictingEvents.filter(event => {
            const eventStart = new Date(event.start.dateTime || event.start.date).getTime();
            const eventEnd = new Date(event.end.dateTime || event.end.date).getTime();
            const newStart = startDateTime.getTime();
            const newEnd = endDateTime.getTime();

            return (newStart < eventEnd && newEnd > eventStart);
        });

        if (actualConflicts.length > 0) {
            console.warn('Booking conflict detected:', actualConflicts);
            return res.status(409).json({ error: 'Time slot is already booked' });
        }

        console.log('Event Start:', startDateTime.toISOString());
        console.log('Event End:', endDateTime.toISOString());

        const eventDescription = `Guest: ${guestName}\nEmail: ${guestEmail}\nPhone: ${guestPhone || 'Not provided'}\nExperience: ${experience}`;
        console.log('Generated Event Description:', eventDescription);

        const event = {
            summary: `Booking: ${experience}`,
            description: eventDescription,
            start: {
                dateTime: startDateTime.toISOString(),
                timeZone: 'America/Chicago', // Adjust as needed
            },
            end: {
                dateTime: endDateTime.toISOString(),
                timeZone: 'America/Chicago',
            },
        };

        const response = await calendar.events.insert({
            calendarId: CALENDAR_ID,
            resource: event,
        });

        console.log('Event created successfully. Link:', response.data.htmlLink);
        res.status(200).json({ success: true, link: response.data.htmlLink });

    } catch (error) {
        console.error('Error creating event:', error);
        res.status(500).json({ error: 'Failed to create booking', details: error.message });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
