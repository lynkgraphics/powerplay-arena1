import React, { useState, useEffect } from 'react';
import { X, Calendar as CalendarIcon, Clock, CreditCard, CheckCircle, ChevronRight, ArrowLeft } from 'lucide-react';
import Calendar from './Calendar';
import { ExperienceType, BookingSlot, BookingDetails, SquareCard } from '../types';
import { DURATION_OPTIONS, calculatePrice, SQUARE_APP_ID, SQUARE_LOCATION_ID, getDurationOptions } from '../constants';
import { generateTimeSlots, createCalendarEvent } from '../services/bookingService';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialExperience?: ExperienceType;
}

type BookingStep = 'EXPERIENCE' | 'DATE_DURATION' | 'TIME' | 'DETAILS' | 'PAYMENT' | 'CONFIRMATION';

const BookingModal: React.FC<BookingModalProps> = ({ isOpen, onClose, initialExperience }) => {
  const [step, setStep] = useState<BookingStep>('EXPERIENCE');
  const [bookingData, setBookingData] = useState<BookingDetails>({
    experience: initialExperience || 'VR Free Roam',
    date: null,
    duration: null,
    timeSlot: null,
    price: 0,
    guestName: '',
    guestEmail: '',
    guestPhone: ''
  });
  const [availableSlots, setAvailableSlots] = useState<BookingSlot[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [paymentProcessing, setPaymentProcessing] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);
  const [calendarPos, setCalendarPos] = useState({ top: 0, left: 0 });
  const dateButtonRef = React.useRef<HTMLButtonElement>(null);

  // Square State
  const [card, setCard] = useState<SquareCard | null>(null);
  const [paymentError, setPaymentError] = useState<string | null>(null);
  const [sdkLoaded, setSdkLoaded] = useState(false);

  // Reset on open
  useEffect(() => {
    if (isOpen) {
      setStep(initialExperience ? 'DATE_DURATION' : 'EXPERIENCE');
      setBookingData(prev => ({ ...prev, experience: initialExperience || 'VR Free Roam' }));
      setPaymentError(null);
    }
  }, [isOpen, initialExperience]);

  // Check if SDK script is loaded
  useEffect(() => {
    if (typeof window !== 'undefined' && window.Square) {
      setSdkLoaded(true);
    } else {
      const checkInterval = setInterval(() => {
        if (window.Square) {
          setSdkLoaded(true);
          clearInterval(checkInterval);
        }
      }, 500);
      return () => clearInterval(checkInterval);
    }
  }, []);

  // Initialize Square Payment Form when entering PAYMENT step
  useEffect(() => {
    let cardInstance: SquareCard | null = null;

    if (step === 'PAYMENT' && sdkLoaded) {
      const initSquare = async () => {
        if (!window.Square) return;

        setPaymentError(null);

        try {
          const payments = window.Square.payments(SQUARE_APP_ID, SQUARE_LOCATION_ID);
          cardInstance = await payments.card();
          await cardInstance.attach('#card-container');
          setCard(cardInstance);
        } catch (e) {
          console.error("Square Initialization Error:", e);
          setPaymentError("Could not load payment form. Please check the App ID configuration.");
        }
      };

      // Initial delay to allow DOM render
      setTimeout(initSquare, 100);
    }

    return () => {
      if (cardInstance) {
        cardInstance.destroy();
      }
      setCard(null);
    };
  }, [step, sdkLoaded]);

  // Handle Package Durations
  useEffect(() => {
    if (bookingData.experience.includes('Package')) {
      let duration = 60;
      if (bookingData.experience === 'Corporate Package') duration = 120;

      if (bookingData.duration !== duration) {
        setBookingData(prev => ({ ...prev, duration }));
      }
    }
  }, [bookingData.experience]);

  // Fetch slots when Date and Duration change
  useEffect(() => {
    if (bookingData.date && bookingData.duration) {
      setLoadingSlots(true);
      generateTimeSlots(bookingData.date, bookingData.duration).then(slots => {
        setAvailableSlots(slots);
        setLoadingSlots(false);
      });

      // Update price
      // For packages, price is fixed in the selection, but here we might need a way to pass it.
      // For now, we'll assume the price is set elsewhere or we need to look it up.
      // Actually, for packages, the price is fixed. Let's handle that.
      let newPrice = 0;
      if (bookingData.experience === 'Team Package') newPrice = 235;
      else if (bookingData.experience === 'Crew Package') newPrice = 305;
      else if (bookingData.experience === 'Squad Package') newPrice = 375;
      else if (bookingData.experience === 'Corporate Package') newPrice = 600;
      else {
        newPrice = calculatePrice(bookingData.experience, bookingData.duration);
      }

      setBookingData(prev => ({ ...prev, price: newPrice }));
    }
  }, [bookingData.date, bookingData.duration, bookingData.experience]);

  if (!isOpen) return null;

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const date = new Date(e.target.value);
    setBookingData({ ...bookingData, date, timeSlot: null });
  };

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!card) return;

    setPaymentProcessing(true);
    setPaymentError(null);

    try {
      // 0. Re-check availability before payment
      if (bookingData.date && bookingData.duration && bookingData.timeSlot) {
        const slots = await generateTimeSlots(bookingData.date, bookingData.duration);
        const selectedSlot = slots.find(s => s.time === bookingData.timeSlot);

        if (!selectedSlot || !selectedSlot.available) {
          setPaymentError("This time slot is no longer available. Please select another time.");
          setPaymentProcessing(false);
          return;
        }
      }

      const result = await card.tokenize();

      if (result.status === 'OK' && result.token) {
        console.log("Payment Token:", result.token);

        // 1. Process Payment
        try {
          const payResponse = await fetch('/api/pay', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              sourceId: result.token,
              amount: bookingData.price
            })
          });

          const payData = await payResponse.json();

          if (!payResponse.ok) {
            throw new Error(payData.error || 'Payment failed at server');
          }

          console.log("Payment Successful:", payData);
          setBookingData(prev => ({ ...prev, paymentToken: result.token }));

          // 2. Create Calendar Event (Only if payment succeeds)
          try {
            await createCalendarEvent({
              ...bookingData,
              paymentToken: result.token,
              paymentId: payData.payment.id
            });
            console.log("Calendar event created successfully");
          } catch (calError) {
            console.error("Failed to create calendar event, but payment succeeded:", calError);
            // TODO: Handle edge case where payment succeeds but booking fails (e.g. refund or alert admin)
          }

          setPaymentProcessing(false);
          setStep('CONFIRMATION');

        } catch (payError: any) {
          console.error("Payment Processing Error:", payError);
          setPaymentError(payError.message || "Payment processing failed.");
          setPaymentProcessing(false);
        }
      } else {
        setPaymentError(result.errors ? result.errors[0].message : 'Payment Failed');
        setPaymentProcessing(false);
      }
    } catch (e) {
      console.error(e);
      setPaymentError("An unexpected error occurred.");
      setPaymentProcessing(false);
    }
  };

  const renderStepContent = () => {
    switch (step) {
      case 'EXPERIENCE':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button
              onClick={() => { setBookingData({ ...bookingData, experience: 'VR Free Roam' }); setStep('DATE_DURATION'); }}
              className="p-6 bg-bgDark border border-white/10 rounded-xl hover:border-primary hover:bg-primary/10 transition-all text-left group"
            >
              <h3 className="text-xl font-bold text-white mb-2 group-hover:text-primary">VR Free Roam</h3>
              <p className="text-muted text-sm">Untethered multiplayer action in a 2000sqft arena.</p>
            </button>
            <button
              onClick={() => { setBookingData({ ...bookingData, experience: 'Sim Racing' }); setStep('DATE_DURATION'); }}
              className="p-6 bg-bgDark border border-white/10 rounded-xl hover:border-secondary hover:bg-secondary/10 transition-all text-left group"
            >
              <h3 className="text-xl font-bold text-white mb-2 group-hover:text-secondary">Sim Racing</h3>
              <p className="text-muted text-sm">Pro-grade force feedback wheels and motion platforms.</p>
            </button>
          </div>
        );

      case 'DATE_DURATION':
        const isPackage = bookingData.experience.includes('Package');
        const durationOptions = getDurationOptions(bookingData.experience);

        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-muted mb-2">Select Date</label>
              <div className="relative">
                <button
                  ref={dateButtonRef}
                  onClick={() => {
                    if (!showCalendar && dateButtonRef.current) {
                      const rect = dateButtonRef.current.getBoundingClientRect();
                      setCalendarPos({
                        top: rect.bottom + 8,
                        left: rect.left
                      });
                    }
                    setShowCalendar(!showCalendar);
                  }}
                  className={`w-full bg-bgDark border ${showCalendar ? 'border-primary' : 'border-white/10'} rounded-lg p-3 text-white flex items-center justify-between hover:border-primary transition-colors`}
                >
                  <span className={bookingData.date ? 'text-white' : 'text-muted'}>
                    {bookingData.date ? bookingData.date.toLocaleDateString() : 'mm/dd/yyyy'}
                  </span>
                  <CalendarIcon size={20} className="text-muted" />
                </button>

                {showCalendar && (
                  <>
                    <div className="fixed inset-0 z-[110]" onClick={() => setShowCalendar(false)} />
                    <div
                      className="fixed z-[120]"
                      style={{ top: calendarPos.top, left: calendarPos.left }}
                    >
                      <Calendar
                        value={bookingData.date}
                        onChange={(date) => {
                          setBookingData({ ...bookingData, date, timeSlot: null });
                          setShowCalendar(false);
                        }}
                        minDate={new Date()}
                      />
                    </div>
                  </>
                )}
              </div>
              <p className="text-xs text-muted mt-2">Open Mon-Fri (12-3, 4-8) & Sat-Sun (10-8)</p>
            </div>

            {!isPackage && (
              <div>
                <label className="block text-sm font-bold text-muted mb-2">Duration (Minutes)</label>
                <div className="flex flex-wrap gap-3">
                  {durationOptions.map(mins => (
                    <button
                      key={mins}
                      onClick={() => setBookingData({ ...bookingData, duration: mins, timeSlot: null })}
                      className={`px-4 py-2 rounded-full border transition-all ${bookingData.duration === mins
                        ? 'bg-white text-black border-white font-bold'
                        : 'bg-transparent border-white/20 text-muted hover:border-white hover:text-white'
                        }`}
                    >
                      {mins} mins
                    </button>
                  ))}
                </div>
              </div>
            )}

            <button
              disabled={!bookingData.date || !bookingData.duration}
              onClick={() => setStep('TIME')}
              className="w-full bg-primary text-black py-3 rounded-lg font-bold disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Find Time Slots
            </button>
          </div>
        );

      case 'TIME':
        return (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-lg">Available Slots</h3>
              <span className="text-primary font-bold">${bookingData.price}</span>
            </div>
            {loadingSlots ? (
              <div className="text-center py-8 text-muted">Checking Google Calendar...</div>
            ) : availableSlots.length === 0 ? (
              <div className="text-center py-8 text-red-400">No slots available for this date/duration.</div>
            ) : (
              <div className="grid grid-cols-3 gap-2 max-h-60 overflow-y-auto">
                {availableSlots.map((slot, idx) => (
                  <button
                    key={idx}
                    disabled={!slot.available}
                    onClick={() => { setBookingData({ ...bookingData, timeSlot: slot.time }); setStep('DETAILS'); }}
                    className={`py-2 px-1 rounded text-sm border ${slot.available
                      ? 'border-white/20 hover:bg-white/10 text-white'
                      : 'border-transparent bg-white/5 text-white/30 cursor-not-allowed line-through'
                      }`}
                  >
                    {slot.time}
                  </button>
                ))}
              </div>
            )}
          </div>
        );

      case 'DETAILS':
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-white">Guest Details</h3>
            <input
              type="text"
              placeholder="Full Name"
              className="w-full bg-bgDark border border-white/10 rounded-lg p-3 text-white focus:border-primary outline-none"
              value={bookingData.guestName}
              onChange={(e) => setBookingData({ ...bookingData, guestName: e.target.value })}
            />
            <input
              type="email"
              placeholder="Email Address"
              className="w-full bg-bgDark border border-white/10 rounded-lg p-3 text-white focus:border-primary outline-none"
              value={bookingData.guestEmail}
              onChange={(e) => setBookingData({ ...bookingData, guestEmail: e.target.value })}
            />
            <input
              type="tel"
              placeholder="Phone Number"
              className="w-full bg-bgDark border border-white/10 rounded-lg p-3 text-white focus:border-primary outline-none"
              value={bookingData.guestPhone}
              onChange={(e) => setBookingData({ ...bookingData, guestPhone: e.target.value })}
            />
            <button
              disabled={!bookingData.guestName || !bookingData.guestEmail || !bookingData.guestPhone}
              onClick={() => setStep('PAYMENT')}
              className="w-full bg-primary text-black py-3 rounded-lg font-bold mt-4 disabled:opacity-50"
            >
              Proceed to Payment
            </button>
          </div>
        );

      case 'PAYMENT':
        return (
          <form onSubmit={handlePayment} className="space-y-4">
            <div className="bg-bgDark p-4 rounded-lg border border-white/10 mb-4">
              <div className="flex justify-between text-sm mb-1">
                <span className="text-muted">Experience:</span>
                <span className="text-white">{bookingData.experience}</span>
              </div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-muted">Date/Time:</span>
                <span className="text-white">{bookingData.date?.toLocaleDateString()} @ {bookingData.timeSlot}</span>
              </div>
              {!bookingData.experience.includes('Package') && (
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-muted">Duration:</span>
                  <span className="text-white">{bookingData.duration} Minutes</span>
                </div>
              )}
              <div className="border-t border-white/10 my-2 pt-2 flex justify-between font-bold">
                <span className="text-white">Total:</span>
                <span className="text-primary text-xl">${bookingData.price}</span>
              </div>
            </div>

            {/* SQUARE PAYMENT CONTAINER */}
            <div className="bg-white rounded-lg p-4 text-black min-h-[150px]">
              <div className="flex items-center justify-between mb-4 border-b pb-2">
                <span className="font-bold text-gray-700 flex items-center gap-2"><CreditCard size={16} /> Secure Payment</span>
                <div className="text-xs text-gray-400">Powered by Square</div>
              </div>

              {/* The Square SDK attaches the iframe here */}
              <div id="card-container"></div>
            </div>

            {paymentError && (
              <div className="text-red-400 text-sm text-center bg-red-500/10 p-2 rounded">
                {paymentError}
              </div>
            )}

            <button
              type="submit"
              disabled={paymentProcessing || !card}
              className="w-full bg-primary text-black py-3 rounded-lg font-bold mt-4 disabled:opacity-70 flex justify-center items-center gap-2"
            >
              {paymentProcessing ? 'Processing...' : `Pay $${bookingData.price}`}
            </button>
          </form>
        );

      case 'CONFIRMATION':
        return (
          <div className="text-center py-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-500/20 text-green-500 mb-4">
              <CheckCircle size={32} />
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">Booking Confirmed!</h3>
            <p className="text-muted mb-6">We've sent a confirmation email to {bookingData.guestEmail}.</p>
            <div className="bg-bgDark p-4 rounded-lg inline-block text-left min-w-[250px]">
              <p className="text-white"><span className="text-primary">●</span> {bookingData.experience}</p>
              <p className="text-muted text-sm mt-1">{bookingData.date?.toDateString()}</p>
              <p className="text-white font-bold mt-1">{bookingData.timeSlot}</p>
            </div>
            <button onClick={onClose} className="block w-full mt-8 bg-white/10 text-white py-2 rounded-lg hover:bg-white/20">
              Close
            </button>
          </div>
        );
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="bg-bgCard w-full max-w-lg rounded-2xl border border-white/10 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-4 border-b border-white/10 flex justify-between items-center bg-bgDark">
          <div className="flex items-center gap-2">
            {step !== 'EXPERIENCE' && step !== 'CONFIRMATION' && (
              <button onClick={() => setStep(prev => {
                if (step === 'DATE_DURATION') return 'EXPERIENCE';
                if (step === 'TIME') return 'DATE_DURATION';
                if (step === 'DETAILS') return 'TIME';
                if (step === 'PAYMENT') return 'DETAILS';
                return 'EXPERIENCE';
              })} className="text-muted hover:text-white">
                <ArrowLeft size={20} />
              </button>
            )}
            <h2 className="text-xl font-bold text-white">
              {step === 'EXPERIENCE' ? 'Select Experience' :
                step === 'DATE_DURATION' ? (bookingData.experience.includes('Package') ? 'Select Date' : 'Select Date & Duration') :
                  step === 'TIME' ? (bookingData.experience.includes('Package') ? 'Select Start Time' : 'Select Time') :
                    step === 'DETAILS' ? 'Your Details' :
                      step === 'PAYMENT' ? 'Secure Payment' : 'Success'}
            </h2>
          </div>
          <button onClick={onClose} className="text-muted hover:text-white"><X size={24} /></button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto flex-1">
          {renderStepContent()}
        </div>

        {/* Progress Indicator */}
        {step !== 'CONFIRMATION' && (
          <div className="p-2 bg-bgDark flex justify-center gap-2">
            {['EXPERIENCE', 'DATE_DURATION', 'TIME', 'DETAILS', 'PAYMENT'].map((s, i) => {
              const steps = ['EXPERIENCE', 'DATE_DURATION', 'TIME', 'DETAILS', 'PAYMENT'];
              const currentIndex = steps.indexOf(step);
              const stepIndex = steps.indexOf(s);
              return (
                <div key={s} className={`h-1 w-8 rounded-full ${stepIndex <= currentIndex ? 'bg-primary' : 'bg-white/10'}`} />
              )
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default BookingModal;