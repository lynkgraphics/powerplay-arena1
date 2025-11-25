import React from 'react';

interface HeroProps {
  onOpenBooking: () => void;
}

const Hero: React.FC<HeroProps> = ({ onOpenBooking }) => {
  return (
    <header className="relative h-[90vh] flex items-center justify-center text-center overflow-hidden mt-[-80px] pt-[80px]">
      {/* Background Image Layer */}
      <div className="absolute inset-0 w-full h-full">
        <img 
          src="https://images.unsplash.com/photo-1626379953822-baec19c3accd?auto=format&fit=crop&q=80&w=2000" 
          alt="VR Hero" 
          className="w-full h-full object-cover opacity-40"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-bgDark to-transparent"></div>
      </div>

      {/* Content Layer - z-10 ensures it sits above the background */}
      <div className="container mx-auto px-4 relative z-10">
        <div className="inline-block border border-white/10 bg-white/5 rounded-full px-4 py-1 mb-6 backdrop-blur-sm">
          <span className="text-green-400 mr-2">●</span>
          <span className="text-sm text-white">Now Open in Sheboygan, WI</span>
        </div>
        
        <h1 className="text-5xl md:text-7xl font-extrabold mb-6 tracking-tight bg-gradient-to-b from-white to-gray-400 bg-clip-text text-transparent">
          Reality,<br/>Redefined.
        </h1>
        
        <p className="text-muted text-lg max-w-2xl mx-auto mb-8">
          Experience the next generation of free-roam VR and professional racing simulation. Your new reality awaits.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button 
            onClick={onOpenBooking} 
            className="bg-primary text-black px-8 py-3 rounded-full font-bold hover:scale-105 transition-transform"
          >
            Book Your Session
          </button>
          <button 
            onClick={() => document.getElementById('games')?.scrollIntoView({ behavior: 'smooth' })}
            className="border border-white/10 bg-white/5 text-white px-8 py-3 rounded-full font-bold hover:bg-white/10 transition-colors"
          >
            View Games
          </button>
        </div>
      </div>
    </header>
  );
};

export default Hero;