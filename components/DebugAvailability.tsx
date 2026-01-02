import React, { useEffect, useState } from 'react';
import { generateTimeSlots } from '../services/bookingService';
import { OPERATING_HOURS } from '../constants';

const DebugAvailability: React.FC = () => {
    const [report, setReport] = useState<string>('Generating report...');

    useEffect(() => {
        const runTest = async () => {
            let output = `DEBUG REPORT:\n`;
            output += `Browser Time: ${new Date().toString()}\n`;
            output += `Operating Hours ID 4 (Thu): ${JSON.stringify(OPERATING_HOURS[4])}\n\n`;

            const today = new Date();
            for (let i = 0; i < 7; i++) {
                const d = new Date(today);
                d.setDate(today.getDate() + i);
                d.setHours(0, 0, 0, 0);

                const dayIndex = d.getDay();
                const slots = await generateTimeSlots(d, 20);

                output += `Date: ${d.toDateString()} (Day ${dayIndex})\n`;
                output += `Slots Found: ${slots.length}\n`;
                if (slots.length > 0) {
                    output += `First 3: ${JSON.stringify(slots.slice(0, 3))}\n`;
                }
                output += '---\n';
            }
            setReport(output);
        };
        runTest();
    }, []);

    return (
        <div className="fixed bottom-0 right-0 bg-black/90 text-green-400 p-4 font-mono text-xs z-[9999] max-h-[50vh] overflow-auto border-t-2 border-green-500 w-full md:w-1/3">
            <h3 className="font-bold mb-2">Availability Debugger (Temp)</h3>
            <pre className="whitespace-pre-wrap">{report}</pre>
        </div>
    );
};

export default DebugAvailability;
