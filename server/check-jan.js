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

async function checkAllEvents() {
    try {
        const start = '2026-01-01T00:00:00Z';
        const end = '2026-02-01T00:00:00Z';

        console.log(`Checking events for Jan 2026...`);

        const response = await calendar.events.list({
            calendarId: CALENDAR_ID,
            timeMin: start,
            timeMax: end,
            singleEvents: true,
            orderBy: 'startTime',
        });

        const events = response.data.items || [];
        console.log(`Found ${events.length} events in Jan:`);

        events.forEach(event => {
            console.log(`- [${event.start.dateTime || event.start.date}] ${event.summary}`);
        });

    } catch (err) {
        console.error('Error fetching events:', err);
    }
}

checkAllEvents();
