import { OPERATING_HOURS } from '../constants';
import { BookingSlot } from '../types';

// Fetch busy slots from the backend
export const fetchBookedSlotsFromGoogleCalendar = async (date: Date): Promise<{ start: string, end: string }[]> => {
  try {
    const dateString = date.toISOString().split('T')[0];
    const response = await fetch(`/api/availability?date=${dateString}`);
    if (!response.ok) {
      throw new Error('Failed to fetch availability');
    }
    const data = await response.json();
    return data.busySlots; // Array of { start: ISOString, end: ISOString }
  } catch (error) {
    console.error("Error fetching availability:", error);
    return []; // Fail safe: assume no bookings if error (or handle differently)
  }
};

export const generateTimeSlots = async (date: Date, durationMinutes: number): Promise<BookingSlot[]> => {
  const dayOfWeek = date.getDay();
  const schedule = OPERATING_HOURS[dayOfWeek];

  if (!schedule) {
    console.warn(`[BookingService] No schedule found for day ${dayOfWeek} (Date: ${date.toDateString()})`);
    return [];
  }

  console.log(`[BookingService] Generating slots for ${date.toDateString()} (Day ${dayOfWeek}). Duration: ${durationMinutes}. Schedule:`, schedule);

  const slots: BookingSlot[] = [];
  const busySlots = await fetchBookedSlotsFromGoogleCalendar(date);

  schedule.intervals.forEach(interval => {
    let startHour = interval.start;
    let endHour = interval.end;

    // Convert hours to minutes for easier loop
    let currentMinutes = startHour * 60;
    const endMinutes = endHour * 60;

    while (currentMinutes + durationMinutes <= endMinutes) {
      const hour = Math.floor(currentMinutes / 60);
      const mins = currentMinutes % 60;

      const timeString = `${hour > 12 ? hour - 12 : hour}:${mins.toString().padStart(2, '0')} ${hour >= 12 ? 'PM' : 'AM'}`;

      // Calculate slot start and end times for comparison
      const slotStart = new Date(date);
      slotStart.setHours(hour, mins, 0, 0);
      const slotEnd = new Date(slotStart.getTime() + durationMinutes * 60000);

      // Check for overlap with any busy slot
      const isBlocked = busySlots.some(busy => {
        const busyStart = new Date(busy.start).getTime();
        const busyEnd = new Date(busy.end).getTime();
        const thisStart = slotStart.getTime();
        const thisEnd = slotEnd.getTime();

        return (thisStart < busyEnd && thisEnd > busyStart);
      });

      slots.push({
        time: timeString,
        available: !isBlocked
      });

      // Increment by 15 mins for flexible booking
      currentMinutes += 15;
    }
  });

  return slots;
};

export const createCalendarEvent = async (bookingDetails: any): Promise<string> => {
  try {
    const response = await fetch('/api/bookings', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(bookingDetails),
    });

    if (!response.ok) {
      throw new Error('Failed to create calendar event');
    }

    const data = await response.json();
    return data.link;
  } catch (error) {
    console.error("Calendar Event Creation Error:", error);
    // We don't want to fail the whole booking flow if just the calendar part fails, 
    // but we should probably log it or alert the admin.
    // For now, we'll rethrow so the UI can decide.
    throw error;
  }
};
