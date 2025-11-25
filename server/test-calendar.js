const { google } = require('googleapis');
const path = require('path');
const dotenv = require('dotenv');

// Load env vars
dotenv.config({ path: path.join(__dirname, '../.env.local') });

const KEYFILE_PATH = path.join(__dirname, 'service-account.json');
const CALENDAR_ID = process.env.GOOGLE_CALENDAR_ID;
const SCOPES = ['https://www.googleapis.com/auth/calendar'];

async function testCalendar() {
    console.log("Testing Google Calendar Integration...");

    if (!CALENDAR_ID) {
        console.error("❌ GOOGLE_CALENDAR_ID is missing in .env.local");
        return;
    }

    try {
        const auth = new google.auth.GoogleAuth({
            keyFile: KEYFILE_PATH,
            scopes: SCOPES,
        });

        const calendar = google.calendar({ version: 'v3', auth });

        console.log("✅ Auth initialized. Attempting to list events...");

        const res = await calendar.events.list({
            calendarId: CALENDAR_ID,
            timeMin: new Date().toISOString(),
            maxResults: 1,
            singleEvents: true,
            orderBy: 'startTime',
        });

        const events = res.data.items;
        if (!events || events.length === 0) {
            console.log('No upcoming events found (This is good, it means connection works).');
        } else {
            console.log('Upcoming event found:', events[0].summary);
        }

        console.log("✅ Connection successful!");

    } catch (error) {
        console.error("❌ Connection failed:", error.message);
        if (error.message.includes("ENOENT")) {
            console.error("   -> service-account.json file is missing in server/ directory.");
        }
    }
}

testCalendar();
