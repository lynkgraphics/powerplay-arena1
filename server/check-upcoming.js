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

async function checkUpcomingEvents() {
    try {
        const now = new Date();
        const start = now.toISOString();
        const end = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString();

        console.log(`Checking events for ${start} to ${end}`);

        const response = await calendar.events.list({
            calendarId: CALENDAR_ID,
            timeMin: start,
            timeMax: end,
            singleEvents: true,
            orderBy: 'startTime',
        });

        const events = response.data.items || [];
        console.log(`Found ${events.length} upcoming events:`);

        events.forEach(event => {
            console.log(`- [${event.start.dateTime || event.start.date}] ${event.summary}`);
            console.log(`  ID: ${event.id}`);
            console.log(`  Description: ${event.description}`);
        });

    } catch (err) {
        console.error('Error fetching events:', err);
    }
}

checkUpcomingEvents();
