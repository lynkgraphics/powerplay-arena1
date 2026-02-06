import { Game, OperatingHours, ExperienceType } from './types';

// --- Square Configuration ---
const rawAppId = import.meta.env.VITE_SQUARE_APP_ID || '';
const rawLocId = import.meta.env.VITE_SQUARE_LOCATION_ID || '';

export const SQUARE_APP_ID = rawAppId.replace(/['"]/g, '').trim();
export const SQUARE_LOCATION_ID = rawLocId.replace(/['"]/g, '').trim();

export const TAX_RATE = 0.05; // Wisconsin Sales Tax


// --- Game Data ---
export const GAMES_DATA: Game[] = [
  // --- SHOOTERS ---
  { id: 1, title: "Arizona Sunshine 2", category: "Shooter", rating: "M", image: "https://cdn.cloudflare.steamstatic.com/steam/apps/1540210/library_600x900.jpg", desc: "The next chapter in zombie-slaying action. Team up to survive the intense Arizona sun and endless hordes.", trailerUrl: "https://www.youtube.com/embed/j8afR1UeR6I?si=P87N_0qzaKy2wOXo" },
  { id: 2, title: "After the Fall", category: "Shooter", rating: "M", image: "https://cdn.cloudflare.steamstatic.com/steam/apps/751630/library_600x900.jpg", desc: "Co-op FPS action set in a frozen, post-apocalyptic LA. Fight massive Snowbreed creatures.", trailerUrl: "https://res.cloudinary.com/dvrjiurf8/video/upload/v1770410171/after_the_fall_trailer_snjgvc.mp4" },
  { id: 3, title: "Holybots Arena", category: "Shooter", rating: "T", image: "https://res.cloudinary.com/dvrjiurf8/image/upload/f_auto,q_auto/v1764090617/PPA_game_card_holybots_arena_wqt36j.jpg", desc: "High-octane PvP action! Pilot service robots turned battle machines in a chaotic free-for-all.", trailerUrl: "https://res.cloudinary.com/dvrjiurf8/video/upload/v1770410843/holy_bots_trailer_zdkhqk.webm" },
  { id: 4, title: "Elven Assassin", category: "Shooter", rating: "T", image: "https://cdn.cloudflare.steamstatic.com/steam/apps/503770/library_600x900.jpg", desc: "Grab your bow and defend your village against hordes of orcs and dragons." },
  { id: 5, title: "Gang Of Dummizz", category: "Shooter", rating: "T", image: "https://res.cloudinary.com/dvrjiurf8/image/upload/f_auto,q_auto/v1764094313/PPA_game_card_gang-of-dummizz_nxzu2x.jpg", desc: "A hilarious shooter where you battle hordes of clumsy, colorful dummies." },
  { id: 6, title: "Cops vs Robbers", category: "Shooter", rating: "T", image: "https://res.cloudinary.com/dvrjiurf8/image/upload/f_auto,q_auto/v1764094313/PPA_game_card_cops_vs_robbers_ca8fc6.jpg", desc: "Team-based PvP shooter: join the police or the criminals and fight for control." },
  { id: 7, title: "Overrun", category: "Shooter", rating: "M", image: "https://res.cloudinary.com/dvrjiurf8/image/upload/v1767396275/overrun_m55eof.jpg", desc: "A fast-paced survival shooter. Defend your position against endless waves of enemies." },
  { id: 8, title: "RevolVR 3", category: "Shooter", rating: "T", image: "https://res.cloudinary.com/dvrjiurf8/image/upload/v1767397064/RevolVR-3_xtffpx.jpg", desc: "Wild West-themed multiplayer shooter. Duel opponents in fast-paced competitive matches." },
  { id: 9, title: "Toon Strike", category: "Shooter", rating: "E", image: "https://placehold.co/600x900/333/fff?text=TOON%20STRIKE", desc: "Cartoony, lighthearted shooting game with colorful graphics and simple objectives." },
  { id: 10, title: "Virtual Arena", category: "Shooter", rating: "T", image: "https://placehold.co/600x900/333/fff?text=VIRTUAL%20ARENA", desc: "Engage in fast-paced multiplayer combat within a variety of futuristic environments." },
  { id: 11, title: "Island 359", category: "Shooter", rating: "M", image: "https://cdn.cloudflare.steamstatic.com/steam/apps/476700/library_600x900.jpg", desc: "Survival FPS where you hunt dinosaurs on a remote, mysterious island." },

  // --- RACING ---

  { id: 13, title: "RaceRoom", category: "Racing", rating: "E", image: "https://cdn.cloudflare.steamstatic.com/steam/apps/211500/library_600x900.jpg", desc: "Authentic race simulation with officially licensed cars and tracks." },

  // --- ESCAPE ROOMS ---
  { id: 14, title: "Escape Quest: Espionage", category: "Escape Room", rating: "E10+", image: "https://placehold.co/600x900/333/fff?text=ESCAPE%20QUEST", desc: "A fast-paced digital escape room. Disarm the bomb on a moving train." },
  { id: 15, title: "Nevrosa: Escape", category: "Escape Room", rating: "M", image: "https://cdn.cloudflare.steamstatic.com/steam/apps/563550/library_600x900.jpg", desc: "A mysterious puzzle game with a dark atmosphere. Find a way out of a strange laboratory." },
  { id: 16, title: "The Parvus Box", category: "Escape Room", rating: "E", image: "https://placehold.co/600x900/333/fff?text=PARVUS%20BOX", desc: "Shrink down to solve puzzles within a giant box in this family-friendly adventure." },
  { id: 17, title: "EscapeVR: The Basement", category: "Escape Room", rating: "T", image: "https://cdn.cloudflare.steamstatic.com/steam/apps/552060/library_600x900.jpg", desc: "Solve the chilling mysteries of the basement before time runs out." },
  { id: 18, title: "B Block Breakout", category: "Escape Room", rating: "T", image: "https://placehold.co/600x900/333/fff?text=B%20BLOCK", desc: "Work together to solve puzzles and stage your daring breakout from a high-security prison." },
  { id: 19, title: "Escape First 2", category: "Escape Room", rating: "T", image: "https://cdn.cloudflare.steamstatic.com/steam/apps/1094060/library_600x900.jpg", desc: "Complex, multi-layered puzzles in new environments." },

  // --- KIDS & FAMILY ---
  { id: 20, title: "Rec Room", category: "Kids", rating: "E", image: "https://cdn.cloudflare.steamstatic.com/steam/apps/471710/library_600x900.jpg", desc: "A social club where you play games, build rooms, and hang out with friends." },
  { id: 21, title: "Acron: Squirrels!", category: "Kids", rating: "E", image: "https://cdn.cloudflare.steamstatic.com/steam/apps/1094870/library_600x900.jpg", desc: "A party game where one player is a tree defending acorns from a team of squirrels." },
  { id: 22, title: "The Smurfs: Battle", category: "Kids", rating: "E", image: "https://placehold.co/600x900/333/fff?text=SMURFS", desc: "Throw blueberries to defeat Gargamel and save the Smurf Village." },
  { id: 23, title: "Ghost Patrol", category: "Kids", rating: "E", image: "https://placehold.co/600x900/333/fff?text=GHOST%20PATROL", desc: "Grab your proton pack and catch some friendly ghosts!" },
  { id: 24, title: "Sweet Escape VR", category: "Kids", rating: "E", image: "https://placehold.co/600x900/333/fff?text=SWEET%20ESCAPE", desc: "A charming escape room built for younger players in a candy-themed world." },

  // --- HORROR ---
  { id: 25, title: "Metro Awakening", category: "Horror", rating: "M", image: "https://cdn.cloudflare.steamstatic.com/steam/apps/2669310/library_600x900.jpg", desc: "A gripping story-driven horror adventure set in the dark metro tunnels beneath Moscow." },
  { id: 26, title: "The Raft", category: "Horror", rating: "M", image: "https://placehold.co/600x900/333/fff?text=THE%20RAFT", desc: "A terrifying co-op horror survival game. Stranded on a raft in a mutant-infested world." },
  { id: 27, title: "Mansion of Death", category: "Horror", rating: "M", image: "https://placehold.co/600x900/333/fff?text=MANSION%20DEATH", desc: "Enter a haunted mansion and uncover its dark secrets." },
  { id: 28, title: "Nevrosa: Prelude", category: "Horror", rating: "T", image: "https://cdn.cloudflare.steamstatic.com/steam/apps/598070/library_600x900.jpg", desc: "An atmospheric and unsettling introduction to the Nevrosa lore and puzzles." },

  // --- SPORTS & RHYTHM ---
  { id: 29, title: "Racket: Nx", category: "Sports", rating: "E", image: "https://cdn.cloudflare.steamstatic.com/steam/apps/428080/library_600x900.jpg", desc: "Racquetball meets pinball. Hit the ball against a huge dome in this futuristic sport." },
  { id: 30, title: "HunterVR", category: "Sports", rating: "T", image: "https://placehold.co/600x900/333/fff?text=HUNTER%20VR", desc: "Experience the thrill of virtual bow hunting in a remote forest setting." },
  { id: 31, title: "Rhythmatic 2", category: "Experience", rating: "E", image: "https://placehold.co/600x900/333/fff?text=RHYTHMATIC%202", desc: "Hit targets to the beat of pulse-pounding electronic music." },
  { id: 32, title: "Beat Blaster", category: "Experience", rating: "E10+", image: "https://placehold.co/600x900/333/fff?text=BEAT%20BLASTER", desc: "Shoot targets in time with the music as you navigate futuristic tunnels." },
  { id: 33, title: "Dodgeball Trainer", category: "Sports", rating: "E", image: "https://placehold.co/600x900/333/fff?text=DODGEBALL", desc: "Practice your reflexes and throwing skills in this fun virtual dodgeball game." },
  { id: 34, title: "Dragon Fist: Kung Fu", category: "Sports", rating: "T", image: "https://cdn.cloudflare.steamstatic.com/steam/apps/1481780/library_600x900.jpg", desc: "Master the ancient art of Kung Fu in this physics-based fighting game." },

  // --- EXPERIENCE ---
  { id: 35, title: "Walk The Plank", category: "Experience", rating: "E", image: "https://cdn.cloudflare.steamstatic.com/steam/apps/517160/library_600x900.jpg", desc: "Face your fear of heights on a plank 80 stories up! A short, high-impact experience." },
  { id: 36, title: "theBlu", category: "Experience", rating: "E", image: "https://cdn.cloudflare.steamstatic.com/steam/apps/453000/library_600x900.jpg", desc: "Dive into stunning underwater moments. A serene and beautiful experience." },
  { id: 37, title: "Solar System Trip", category: "Experience", rating: "E", image: "https://placehold.co/600x900/333/fff?text=SOLAR%20SYSTEM", desc: "Take a stunning educational tour through our solar system." },
  { id: 38, title: "World Of Diving", category: "Experience", rating: "E", image: "https://placehold.co/600x900/333/fff?text=WORLD%20DIVING", desc: "Explore the deep sea, discover shipwrecks, and document marine life." },
  { id: 39, title: "Aerospace Flight", category: "Experience", rating: "E", image: "https://placehold.co/600x900/333/fff?text=AERO%20FLIGHT", desc: "Build and test aircraft designs, then take them for a realistic flight." },
  { id: 40, title: "Eclipse", category: "Experience", rating: "E", image: "https://cdn.cloudflare.steamstatic.com/steam/apps/1077530/library_600x900.jpg", desc: "A peaceful exploration and puzzle adventure game on a strange, abandoned planet." }
];

export const CATEGORIES = ['All', 'Shooter', 'Racing', 'Escape Room', 'Kids', 'Horror', 'Sports', 'Experience'];

// --- Operating Hours ---
// Mon - Fri: 12 PM - 3 PM (12-15), 4 PM - 8 PM (16-20)
// Sat & Sun: 10 AM - 8 PM (10-20)
// Regular Hours
export const OPERATING_HOURS: OperatingHours = {
  0: { intervals: [{ start: 10, end: 20 }] }, // Sunday
  1: { intervals: [] }, // Monday (Party Only)
  2: { intervals: [] }, // Tuesday (Party Only)
  3: { intervals: [] }, // Wednesday (Party Only)
  4: { intervals: [{ start: 12, end: 15 }, { start: 16, end: 20 }] }, // Thursday
  5: { intervals: [{ start: 12, end: 15 }, { start: 16, end: 20 }] }, // Friday
  6: { intervals: [{ start: 10, end: 20 }] }, // Saturday
};

// Party Hours - Parties available Mon-Fri with 3-4 PM gap, weekends 10-8 PM
export const PARTY_HOURS: OperatingHours = {
  0: { intervals: [{ start: 10, end: 20 }] }, // Sunday
  1: { intervals: [{ start: 12, end: 15 }, { start: 16, end: 20 }] }, // Monday
  2: { intervals: [{ start: 12, end: 15 }, { start: 16, end: 20 }] }, // Tuesday
  3: { intervals: [{ start: 12, end: 15 }, { start: 16, end: 20 }] }, // Wednesday
  4: { intervals: [{ start: 12, end: 15 }, { start: 16, end: 20 }] }, // Thursday
  5: { intervals: [{ start: 12, end: 15 }, { start: 16, end: 20 }] }, // Friday
  6: { intervals: [{ start: 10, end: 20 }] }, // Saturday
};

// --- Pricing ---
// Base logic derived from site:
// VR: $35/60min, $20/30min
// Racing: $15/20min

export const DURATION_OPTIONS = [20, 30, 40, 60];

export const getDurationOptions = (experience: ExperienceType): number[] => {
  if (experience === 'Sim Racing') {
    return [20, 40, 60];
  }
  // VR Free Roam
  return [30, 60];
};

export const calculatePrice = (experience: ExperienceType, duration: number): number => {
  if (experience === 'Sim Racing') {
    // Racing is $15 per 20 mins
    // 20 -> 15, 40 -> 30, 60 -> 45
    return Math.ceil((duration / 20) * 15);

  } else {
    // VR Pricing Tiers
    if (duration <= 30) return 20;
    return 35; // 60 mins

  }
};