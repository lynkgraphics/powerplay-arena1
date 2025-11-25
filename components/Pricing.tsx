import React from 'react';
import { Check } from 'lucide-react';
import { ExperienceType } from '../types';

interface PricingProps {
  onSelectPackage: (exp: ExperienceType) => void;
}

const Pricing: React.FC<PricingProps> = ({ onSelectPackage }) => {
  return (
    <section id="pricing" className="py-24">
      <div className="container mx-auto px-6">
        {/* INDIVIDUAL PACKAGES */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">Pricing Packages</h2>
          <p className="text-muted max-w-2xl mx-auto">Choose the perfect package for solo play, groups, or corporate events.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-20">

          {/* VR 30 */}
          <div className="bg-bgCard/50 border border-white/10 rounded-3xl p-8 hover:border-primary transition-all flex flex-col relative group">
            <h3 className="text-xl font-bold text-white mb-4">VR Standard</h3>
            <div className="text-4xl font-bold mb-2 text-white">$17<span className="text-base font-normal text-muted">/30min</span></div>
            <p className="text-muted text-sm mb-6">Perfect for a quick reality escape.</p>

            <ul className="space-y-4 mb-8 flex-1 text-muted text-sm">
              <li className="flex gap-3"><Check size={18} className="text-primary shrink-0" /> 1 VR Station</li>
              <li className="flex gap-3"><Check size={18} className="text-primary shrink-0" /> Access to Library</li>
              <li className="flex gap-3"><Check size={18} className="text-primary shrink-0" /> Multiplayer Capable</li>
            </ul>

            <button onClick={() => onSelectPackage('VR Free Roam')} className="w-full py-3 rounded-xl border border-primary text-primary font-bold hover:bg-primary/10 transition-colors">
              Select 30 Min
            </button>
          </div>

          {/* VR 60 */}
          <div className="bg-primary/5 border border-primary/50 rounded-3xl p-8 flex flex-col relative group shadow-[0_0_30px_rgba(43,211,224,0.1)]">
            <div className="absolute top-0 right-0 bg-primary text-black text-xs font-bold px-4 py-1 rounded-bl-xl">POPULAR</div>
            <h3 className="text-xl font-bold text-white mb-4">VR Extended</h3>
            <div className="text-4xl font-bold mb-2 text-white">$28<span className="text-base font-normal text-muted">/60min</span></div>
            <p className="text-muted text-sm mb-6">Full immersion experience.</p>

            <ul className="space-y-4 mb-8 flex-1 text-muted text-sm">
              <li className="flex gap-3"><Check size={18} className="text-primary shrink-0" /> Best Value</li>
              <li className="flex gap-3"><Check size={18} className="text-primary shrink-0" /> Shareable Headset</li>
              <li className="flex gap-3"><Check size={18} className="text-primary shrink-0" /> Full Access</li>
            </ul>

            <button onClick={() => onSelectPackage('VR Free Roam')} className="w-full py-3 rounded-xl bg-primary text-black font-bold hover:scale-105 transition-transform">
              Select 60 Min
            </button>
          </div>

          {/* Sim Racing */}
          <div className="bg-bgCard/50 border border-white/10 rounded-3xl p-8 hover:border-secondary transition-all flex flex-col relative overflow-hidden group">
            <div className="absolute top-0 right-0 bg-secondary text-white text-xs font-bold px-4 py-1 rounded-bl-xl">RACING</div>
            <h3 className="text-xl font-bold text-white mb-4">Driving Simulation</h3>
            <div className="text-4xl font-bold mb-2 text-white">$10<span className="text-base font-normal text-muted">/20min</span></div>
            <p className="text-muted text-sm mb-6">Pro-grade force feedback wheels.</p>

            <ul className="space-y-4 mb-8 flex-1 text-muted text-sm">
              <li className="flex gap-3"><Check size={18} className="text-secondary shrink-0" /> option of vr or flat screen</li>
              <li className="flex gap-3"><Check size={18} className="text-secondary shrink-0" /> Motion Platforms</li>
              <li className="flex gap-3"><Check size={18} className="text-secondary shrink-0" /> Assetto Corsa</li>
            </ul>

            <button onClick={() => onSelectPackage('Sim Racing')} className="w-full py-3 rounded-xl bg-secondary text-white font-bold hover:scale-105 transition-transform">
              Start Engine
            </button>
          </div>
        </div>

        {/* PARTY PACKAGES */}
        <h3 className="text-3xl font-bold text-center mb-12">Party Packages</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">

          {/* TEAM */}
          <div className="bg-bgCard border border-white/10 rounded-2xl p-6 flex flex-col hover:border-white/30 transition-colors">
            <h4 className="text-xl font-bold mb-2">TEAM</h4>
            <div className="text-3xl font-bold text-primary mb-4">$235</div>
            <ul className="space-y-2 text-sm text-muted flex-1 mb-6">
              <li className="flex gap-2"><span className="text-primary">•</span> 4 VR Stations for 1 Hour</li>
              <li className="flex gap-2"><span className="text-primary">•</span> 2 Xbox & 2 PlayStation stations</li>
              <li className="flex gap-2"><span className="text-primary">•</span> Best for small groups</li>
            </ul>
            <button onClick={() => onSelectPackage('Team Package')} className="w-full py-2 border border-white/20 rounded-lg hover:bg-white/10 transition-colors font-bold">Select Team</button>
          </div>

          {/* CREW */}
          <div className="bg-primary/5 border border-primary/50 rounded-2xl p-6 flex flex-col relative">
            <div className="absolute top-0 right-0 bg-primary text-black text-xs font-bold px-3 py-1 rounded-bl-lg">POPULAR</div>
            <h4 className="text-xl font-bold mb-2">CREW</h4>
            <div className="text-3xl font-bold text-primary mb-4">$305</div>
            <ul className="space-y-2 text-sm text-muted flex-1 mb-6">
              <li className="flex gap-2"><span className="text-primary">•</span> 6 VR Stations for 1 Hour</li>
              <li className="flex gap-2"><span className="text-primary">•</span> 2 Xbox & 2 PlayStation stations</li>
              <li className="flex gap-2"><span className="text-primary">•</span> 5 Free Race Simulator Sessions</li>
            </ul>
            <button onClick={() => onSelectPackage('Crew Package')} className="w-full py-2 bg-primary text-black rounded-lg hover:brightness-110 transition-colors font-bold">Select Crew</button>
          </div>

          {/* SQUAD */}
          <div className="bg-bgCard border border-white/10 rounded-2xl p-6 flex flex-col hover:border-white/30 transition-colors">
            <h4 className="text-xl font-bold mb-2">SQUAD</h4>
            <div className="text-3xl font-bold text-primary mb-4">$375</div>
            <ul className="space-y-2 text-sm text-muted flex-1 mb-6">
              <li className="flex gap-2"><span className="text-primary">•</span> 8 VR Stations for 1 Hour</li>
              <li className="flex gap-2"><span className="text-primary">•</span> 2 Xbox & 2 PlayStation stations</li>
              <li className="flex gap-2"><span className="text-primary">•</span> Unlimited Racing Simulator Access</li>
            </ul>
            <button onClick={() => onSelectPackage('Squad Package')} className="w-full py-2 border border-white/20 rounded-lg hover:bg-white/10 transition-colors font-bold">Select Squad</button>
          </div>

          {/* CORPORATE */}
          <div className="bg-secondary/5 border border-secondary/50 rounded-2xl p-6 flex flex-col hover:bg-secondary/10 transition-colors">
            <h4 className="text-xl font-bold mb-2">CORPORATE</h4>
            <div className="text-3xl font-bold text-secondary mb-4">$600</div>
            <ul className="space-y-2 text-sm text-muted flex-1 mb-6">
              <li className="flex gap-2"><span className="text-secondary">•</span> Exclusive Private Use of Entire Arcade</li>
              <li className="flex gap-2"><span className="text-secondary">•</span> 120 Minutes Total Event Time</li>
              <li className="flex gap-2"><span className="text-secondary">•</span> 60 Min VR Escape Room Experience</li>
              <li className="flex gap-2"><span className="text-secondary">•</span> Unlimited Racing Simulator Access</li>
            </ul>
            <button onClick={() => onSelectPackage('Corporate Package')} className="w-full py-2 bg-secondary text-white rounded-lg hover:brightness-110 transition-colors font-bold">Select Corporate</button>
          </div>

        </div>

        {/* ADD-ONS */}
        <div className="mt-16">
          <h3 className="text-2xl font-bold mb-8">Add-On Pricing (Per Extra Player)</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-bgCard border border-white/10 p-6 rounded-xl flex justify-between items-center">
              <span className="font-medium">Additional VR Player</span>
              <span className="font-bold text-lg">+$35 / person</span>
            </div>
            <div className="bg-bgCard border border-white/10 p-6 rounded-xl flex justify-between items-center">
              <span className="font-medium">Extra Time (30 Mins)</span>
              <span className="font-bold text-lg">+$50</span>
            </div>
            <div className="bg-bgCard border border-white/10 p-6 rounded-xl flex justify-between items-center">
              <span className="font-medium">Additional Non-VR Guest</span>
              <span className="font-bold text-lg text-primary">Free</span>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};

export default Pricing;