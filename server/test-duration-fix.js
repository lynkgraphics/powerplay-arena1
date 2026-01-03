const fetch = require('node-fetch');

async function testDuration() {
    const bookingData = {
        experience: 'Sim Racing',
        date: '2026-01-03T06:00:00.000Z',
        timeSlot: '5:00 PM',
        duration: 20,
        guestName: 'Fix Verifier',
        guestEmail: 'fix@example.com',
        guestPhone: '1234567890',
        participants: 1
    };

    console.log('Sending fix verifier booking (11:15 AM - 20 mins)...');
    try {
        const response = await fetch('http://localhost:3001/api/bookings', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(bookingData)
        });

        const data = await response.json();
        console.log('Response Status:', response.status);
        if (data.link) {
            console.log('Booking successful!');
        } else {
            console.log('Error:', data);
        }
    } catch (err) {
        console.error('Fetch Error:', err);
    }
}

testDuration();
