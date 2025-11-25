import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface CalendarProps {
    value: Date | null;
    onChange: (date: Date) => void;
    minDate?: Date;
}

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
];

const Calendar: React.FC<CalendarProps> = ({ value, onChange, minDate }) => {
    const [currentMonth, setCurrentMonth] = useState(value || new Date());

    // Reset to value's month if value changes externally
    useEffect(() => {
        if (value) {
            setCurrentMonth(value);
        }
    }, [value]);

    const getDaysInMonth = (date: Date) => {
        const year = date.getFullYear();
        const month = date.getMonth();
        return new Date(year, month + 1, 0).getDate();
    };

    const getFirstDayOfMonth = (date: Date) => {
        const year = date.getFullYear();
        const month = date.getMonth();
        return new Date(year, month, 1).getDay();
    };

    const handlePrevMonth = () => {
        setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
    };

    const handleNextMonth = () => {
        setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
    };

    const handleDateClick = (day: number) => {
        const newDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
        onChange(newDate);
    };

    const isDateDisabled = (day: number) => {
        if (!minDate) return false;
        const dateToCheck = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
        // Reset time parts for accurate comparison
        const check = new Date(dateToCheck.setHours(0, 0, 0, 0));
        const min = new Date(new Date(minDate).setHours(0, 0, 0, 0));
        return check.getTime() < min.getTime();
    };

    const isSameDate = (d1: Date | null, d2: Date) => {
        if (!d1) return false;
        return (
            d1.getDate() === d2.getDate() &&
            d1.getMonth() === d2.getMonth() &&
            d1.getFullYear() === d2.getFullYear()
        );
    };

    const daysInMonth = getDaysInMonth(currentMonth);
    const firstDay = getFirstDayOfMonth(currentMonth);
    const days = [];

    // Empty slots for days before the 1st
    for (let i = 0; i < firstDay; i++) {
        days.push(<div key={`empty-${i}`} className="h-8 w-8" />);
    }

    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
        const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
        const disabled = isDateDisabled(day);
        const selected = isSameDate(value, date);

        days.push(
            <button
                key={day}
                onClick={(e) => {
                    e.stopPropagation(); // Prevent closing if we want to keep it open, but usually we want to close. 
                    // Actually, let the parent handle closing via onChange if desired, but here we just fire the event.
                    if (!disabled) handleDateClick(day);
                }}
                disabled={disabled}
                className={`h-8 w-8 rounded-full flex items-center justify-center text-sm transition-colors
          ${selected
                        ? 'bg-primary text-black font-bold'
                        : disabled
                            ? 'text-white/20 cursor-not-allowed'
                            : 'text-white hover:bg-white/10 hover:text-primary'
                    }`}
            >
                {day}
            </button>
        );
    }

    return (
        <div className="bg-bgCard border border-white/10 rounded-xl p-4 w-full max-w-[320px] shadow-2xl">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
                <button onClick={(e) => { e.stopPropagation(); handlePrevMonth(); }} className="p-1 hover:bg-white/10 rounded text-white">
                    <ChevronLeft size={20} />
                </button>
                <span className="font-bold text-white">
                    {MONTHS[currentMonth.getMonth()]} {currentMonth.getFullYear()}
                </span>
                <button onClick={(e) => { e.stopPropagation(); handleNextMonth(); }} className="p-1 hover:bg-white/10 rounded text-white">
                    <ChevronRight size={20} />
                </button>
            </div>

            {/* Days Header */}
            <div className="grid grid-cols-7 gap-1 mb-2">
                {DAYS.map(day => (
                    <div key={day} className="h-8 w-8 flex items-center justify-center text-xs text-muted font-bold">
                        {day}
                    </div>
                ))}
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-1">
                {days}
            </div>
        </div>
    );
};

export default Calendar;
