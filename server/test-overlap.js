const fetch = require('node-fetch');

async function testRacingOverlap() {
    const bookingData = {
        experience: 'Sim Racing',
        date: '2026-01-02T06:00:00.000Z',
        timeSlot: '7:00 PM',
        duration: 30, // Should end at 7:30 PM. Overlaps with Fred (Ends 7:15).
        guestName: 'Overlap Test',
        guestEmail: 'overlap@example.com',
        guestPhone: '1234567890',
        participants: 1
    };

    console.log('Sending Racing test booking (overlapping with Fred)...');
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

testRacingOverlap();
