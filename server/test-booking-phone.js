const fetch = require('node-fetch');

async function testBooking() {
    const bookingData = {
        experience: 'Sim Racing',
        date: new Date().toISOString(),
        timeSlot: '2:00 PM',
        duration: 20,
        guestName: 'Test User',
        guestEmail: 'test@example.com',
        guestPhone: '555-0199'
    };

    try {
        const response = await fetch('http://localhost:3001/api/bookings', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(bookingData)
        });

        const data = await response.json();
        console.log('Status:', response.status);
        console.log('Response:', data);

        if (response.ok) {
            console.log('✅ Booking test passed!');
        } else {
            console.error('❌ Booking test failed:', data.error);
        }
    } catch (error) {
        console.error('❌ Test error:', error);
    }
}

testBooking();
