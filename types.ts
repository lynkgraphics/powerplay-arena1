export type Category = 'All' | 'Shooter' | 'Racing' | 'Escape Room' | 'Kids' | 'Horror' | 'Sports' | 'Experience';

export interface Game {
  id: number;
  title: string;
  category: Category;
  rating: string;
  image: string;
  desc: string;
}

export type ExperienceType = 'VR Free Roam' | 'Sim Racing';

export interface PricingRule {
  price: number; // Price in dollars
  duration: number; // Duration in minutes
}

export interface BookingSlot {
  time: string; // "14:00"
  available: boolean;
}

export interface DaySchedule {
  intervals: { start: number; end: number }[]; // 24h format, e.g., 12 to 15 (12pm to 3pm)
}

export interface OperatingHours {
  [key: number]: DaySchedule; // 0 = Sunday, 1 = Monday, etc.
}

export interface BookingDetails {
  experience: ExperienceType;
  date: Date | null;
  duration: number | null; // minutes
  timeSlot: string | null;
  price: number;
  participants: number;
  guestName: string;
  guestEmail: string;
  guestPhone: string;
  paymentToken?: string; // Square payment token
}

// --- Square SDK Types ---
declare global {
  interface Window {
    Square?: {
      payments: (appId: string, locationId: string) => SquarePayments;
    };
  }
}

export interface SquarePayments {
  card: () => Promise<SquareCard>;
}

export interface SquareCard {
  attach: (selector: string) => Promise<void>;
  tokenize: () => Promise<TokenResult>;
  destroy: () => Promise<void>;
}

export interface TokenResult {
  status: 'OK' | 'Error';
  token?: string;
  errors?: { message: string }[];
}