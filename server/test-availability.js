const http = require('http');

const BASE_URL = 'http://localhost:3001';

function request(method, path, body = null) {
    return new Promise((resolve, reject) => {
        const options = {
            hostname: 'localhost',
            port: 3001,
            path: path,
            method: method,
            headers: {
                'Content-Type': 'application/json'
            }
        };

        const req = http.request(options, (res) => {
            let data = '';
            res.on('data', (chunk) => data += chunk);
            res.on('end', () => {
                try {
                    const parsed = JSON.parse(data);
                    resolve({ status: res.statusCode, data: parsed });
                } catch (e) {
                    console.log('Raw response:', data);
                    resolve({ status: res.statusCode, data: data });
                }
            });
        });

        req.on('error', reject);

        if (body) {
            req.write(JSON.stringify(body));
        }
        req.end();
    });
}

async function runTests() {
    const date = new Date().toISOString().split('T')[0];
    console.log(`--- Testing Availability for ${date} ---`);

    try {
        const avail = await request('GET', `/api/availability?date=${date}`);
        console.log('Availability Status:', avail.status);
        console.log('Busy Slots:', JSON.stringify(avail.data.busySlots, null, 2));

        if (avail.data.busySlots && avail.data.busySlots.length > 0) {
            const busy = avail.data.busySlots[0];
            console.log('\n--- Testing Conflict ---');
            console.log('Attempting to book busy slot:', busy);

            const busyStart = new Date(busy.start);
            const hours = busyStart.getHours();
            const minutes = busyStart.getMinutes();
            const timeSlot = `${hours > 12 ? hours - 12 : hours}:${minutes.toString().padStart(2, '0')} ${hours >= 12 ? 'PM' : 'AM'}`;

            const booking = {
                experience: 'Test Conflict',
                date: date,
                timeSlot: timeSlot,
                duration: 30,
                guestName: 'Test User',
                guestEmail: 'test@example.com'
            };

            const bookRes = await request('POST', '/api/bookings', booking);
            console.log('Booking Status:', bookRes.status);
            console.log('Booking Response:', bookRes.data);

            if (bookRes.status === 409) {
                console.log('SUCCESS: Conflict detected correctly.');
            } else {
                console.log('FAILURE: Expected 409, got', bookRes.status);
            }
        } else {
            console.log('\nNo busy slots found. Creating a booking to establish a busy slot...');
            const timeSlot = "2:00 PM";
            const booking = {
                experience: 'Test Initial',
                date: date,
                timeSlot: timeSlot,
                duration: 30,
                guestName: 'Test User',
                guestEmail: 'test@example.com'
            };

            const createRes = await request('POST', '/api/bookings', booking);
            console.log('Initial Booking Status:', createRes.status);

            if (createRes.status === 200) {
                console.log('Initial booking created. Now trying to double book...');
                const doubleBookRes = await request('POST', '/api/bookings', booking);
                console.log('Double Booking Status:', doubleBookRes.status);
                if (doubleBookRes.status === 409) {
                    console.log('SUCCESS: Double booking prevented.');
                } else {
                    console.log('FAILURE: Double booking allowed (Status ' + doubleBookRes.status + ')');
                }
            } else {
                console.log('Failed to create initial booking:', createRes.data);
            }
        }

    } catch (e) {
        console.error('Test failed:', e);
    }
}

runTests();
