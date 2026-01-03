const fetch = require('node-fetch');

async function testVRBooking() {
    const bookingData = {
        experience: 'VR Free Roam',
        date: '2026-01-02T06:00:00.000Z',
        timeSlot: '7:00 PM',
        duration: 60,
        guestName: 'VR Test',
        guestEmail: 'vrtest@example.com',
        guestPhone: '1234567890',
        participants: 2
    };

    console.log('Sending VR test booking...');
    try {
        const response = await fetch('http://localhost:3001/api/bookings', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(bookingData)
        });

        const data = await response.json();
        console.log('Response Status:', response.status);
        console.log('Response Data:', data);
    } catch (err) {
        console.error('Fetch Error:', err);
    }
}

testVRBooking();
