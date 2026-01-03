const { google } = require('googleapis');
const dotenv = require('dotenv');
const path = require('path');

const envPath = path.join(__dirname, '../.env.local');
dotenv.config({ path: envPath });

const SCOPES = ['https://www.googleapis.com/auth/calendar'];
const CALENDAR_ID = process.env.GOOGLE_CALENDAR_ID;

const auth = new google.auth.GoogleAuth({
    keyFile: path.join(__dirname, 'service-account.json'),
    scopes: SCOPES,
});

const calendar = google.calendar({ version: 'v3', auth });

async function checkRecentEvents() {
    try {
        const now = new Date();
        const start = new Date(now.setHours(0, 0, 0, 0)).toISOString();
        const end = new Date(now.setHours(23, 59, 59, 999)).toISOString();

        console.log(`Checking events for ${start} to ${end}`);

        const response = await calendar.events.list({
            calendarId: CALENDAR_ID,
            timeMin: start,
            timeMax: end,
            singleEvents: true,
            orderBy: 'startTime',
        });

        const events = response.data.items || [];
        console.log(`Found ${events.length} events today:`);

        events.forEach(event => {
            console.log(`- [${event.start.dateTime || event.start.date}] ${event.summary}`);
            console.log(`  ID: ${event.id}`);
        });

    } catch (err) {
        console.error('Error fetching events:', err);
    }
}

checkRecentEvents();
