const http = require('http');

function postRequest(path, data) {
    const options = {
        hostname: 'localhost',
        port: 3001,
        path: path,
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': data.length
        }
    };

    const req = http.request(options, (res) => {
        console.log(`STATUS: ${res.statusCode}`);
        res.setEncoding('utf8');
        res.on('data', (chunk) => {
            console.log(`BODY: ${chunk}`);
        });
    });

    req.on('error', (e) => {
        console.error(`problem with request: ${e.message}`);
    });

    req.write(data);
    req.end();
}

const paymentData = JSON.stringify({
    sourceId: 'cnon:card-nonce-ok',
    amount: 100,
    currency: 'USD'
});

console.log('Testing Payment API...');
postRequest('/api/pay', paymentData);

const bookingData = JSON.stringify({
    experience: 'VR Free Roam',
    date: '2025-11-25',
    timeSlot: '12:00 PM',
    duration: 30,
    guestName: 'Test User',
    guestEmail: 'damilarecart@gmail.com'
});

setTimeout(() => {
    console.log('\nTesting Booking API...');
    postRequest('/api/bookings', bookingData);
}, 2000);
