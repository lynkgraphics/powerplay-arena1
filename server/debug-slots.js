const OPERATING_HOURS = {
    0: { intervals: [{ start: 10, end: 20 }] }, // Sunday
    1: { intervals: [] }, // Monday (Party Only)
    2: { intervals: [] }, // Tuesday (Party Only)
    3: { intervals: [] }, // Wednesday (Party Only)
    4: { intervals: [{ start: 12, end: 15 }, { start: 16, end: 20 }] }, // Thursday
    5: { intervals: [{ start: 12, end: 15 }, { start: 16, end: 20 }] }, // Friday
    6: { intervals: [{ start: 10, end: 20 }] }, // Saturday
};

function getSlots(dayIndex, durationMinutes) {
    console.log(`Checking Day ${dayIndex} with duration ${durationMinutes}`);
    const schedule = OPERATING_HOURS[dayIndex];
    if (!schedule) {
        console.log("No schedule found");
        return [];
    }

    const slots = [];
    schedule.intervals.forEach(interval => {
        let startHour = interval.start;
        let endHour = interval.end;

        let currentMinutes = startHour * 60;
        const endMinutes = endHour * 60;

        while (currentMinutes + durationMinutes <= endMinutes) {
            const hour = Math.floor(currentMinutes / 60);
            const mins = currentMinutes % 60;
            const timeString = `${hour > 12 ? hour - 12 : hour}:${mins.toString().padStart(2, '0')} ${hour >= 12 ? 'PM' : 'AM'}`;
            slots.push(timeString);
            currentMinutes += 15;
        }
    });
    return slots;
}

// Test all days
for (let i = 0; i < 7; i++) {
    const s = getSlots(i, 20); // 20 min duration
    console.log(`Day ${i}: found ${s.length} slots`);
    if (s.length > 0) console.log('Sample:', s.slice(0, 3));
}
