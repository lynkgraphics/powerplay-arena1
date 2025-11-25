import React, { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';

interface NavbarProps {
  onOpenBooking: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ onOpenBooking }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      const headerOffset = 85;
      const elementPosition = el.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
      window.scrollTo({ top: offsetPosition, behavior: "smooth" });
    }
    setIsMobileMenuOpen(false);
  };

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${isScrolled || isMobileMenuOpen ? 'bg-bgDark border-b border-white/10' : 'bg-transparent'}`}>
      <div className="container mx-auto px-6 h-20 flex justify-between items-center">
        {/* Logo */}
        <div className="flex items-center cursor-pointer" onClick={() => window.scrollTo(0, 0)}>
           <svg className="h-8 w-auto" viewBox="0 0 955.2 166.319">
             <g>
                <path className="fill-white" d="M253.565,52.011h21.975c6.646,0,11.39,2.147,14.23,6.438,2.839,4.292,4.259,10.568,4.259,18.828s-1.259,14.49-3.775,18.684c-2.517,4.196-7.035,6.292-13.553,6.292h-6.776v32.914h-16.36V52.011ZM270.893,87.249c2,0,3.468-.371,4.405-1.113.935-.741,1.549-1.806,1.839-3.195.291-1.387.436-3.371.436-5.954,0-3.485-.387-6.002-1.162-7.551s-2.323-2.323-4.647-2.323h-1.839v20.136h.968Z"/>
                <path className="fill-white" d="M306.226,129.795c-3.485-4.097-5.228-9.857-5.228-17.28v-39.594c0-7.163,1.743-12.568,5.228-16.215,3.485-3.646,8.583-5.47,15.295-5.47s11.81,1.824,15.295,5.47c3.485,3.646,5.228,9.051,5.228,16.215v39.594c0,7.487-1.743,13.263-5.228,17.328-3.485,4.066-8.584,6.099-15.295,6.099s-11.81-2.048-15.295-6.148ZM324.522,118.711c.516-1.29.774-3.098.774-5.421v-40.658c0-1.806-.242-3.275-.726-4.405-.484-1.128-1.469-1.694-2.953-1.694-2.953-1.694-2.776,0-4.163,2.098-4.163,6.292v40.562c0,2.388.29,4.195.871,5.421.581,1.226,1.646,1.84,3.195,1.84,1.484,0,2.484-.645,3.001-1.937Z"/>
                <path className="fill-white" d="M357.629,135.168l-8.906-83.156h16.263l4.647,52.469,4.647-52.469h15.489l4.453,52.469,4.453-52.469h16.457l-9.1,83.156h-19.942l-4.163-40.078-3.969,40.078h-20.329Z"/>
                <path className="fill-white" d="M422.488,135.168V52.011h33.301v16.07h-16.36v16.166h15.683v15.683h-15.683v19.071h17.425v16.167h-34.366Z"/>
                <path className="fill-white" d="M464.791,52.011h25.557c4.066,0,7.212.919,9.439,2.759,2.226,1.84,3.727,4.421,4.501,7.745.774,3.324,1.162,7.567,1.162,12.73,0,4.712-.614,8.391-1.839,11.036-1.227,2.647-3.357,4.486-6.39,5.518,2.517.517,4.34,1.775,5.47,3.775,1.128,2.001,1.694,4.711,1.694,8.131l-.194,31.462h-16.263v-32.527c0-2.323-.452-3.807-1.355-4.453-.905-.644-2.55-.968-4.937-.968v37.948h-16.844V52.011ZM485.701,82.796c2.323,0,3.485-2.517,3.485-7.551,0-2.193-.097-3.839-.291-4.937-.194-1.096-.549-1.854-1.065-2.275-.517-.419-1.258-.629-2.226-.629h-3.872v15.392h3.969Z"/>
                <path className="fill-white" d="M513.387,52.011h21.975c6.646,0,11.39,2.147,14.23,6.438,2.839,4.292,4.259,10.568,4.259,18.828s-1.259,14.49-3.775,18.684c-2.517,4.196-7.035,6.292-13.553,6.292h-6.776v32.914h-16.36V52.011ZM530.715,87.249c2,0,3.468-.371,4.405-1.113.935-.741,1.549-1.806,1.839-3.195.291-1.387.436-3.371.436-5.954,0-3.485-.387-6.002-1.162-7.551s-2.323-2.323-4.647-2.323h-1.839v20.136h.968Z"/>
                <path className="fill-white" d="M561.498,135.168V52.011h16.651v69.023h17.135v14.133h-33.785Z"/>
                <path className="fill-white" d="M600.123,135.168l8.035-83.156h28.171l7.938,83.156h-15.78l-1.161-13.456h-10.068l-.969,13.456h-16.166ZM618.516,108.45h7.551l-3.678-42.305h-.775l-3.098,42.305Z"/>
                <path className="fill-white" d="M661.786,135.168v-27.396l-13.262-55.761h16.456l4.647,28.171,4.647-28.171h16.456l-13.263,55.761v27.396h-15.683Z"/>
                <path className="fill-white" d="M720.16,135.168l8.035-83.156h28.171l7.938,83.156h-15.78l-1.161-13.456h-10.068l-.969,13.456h-16.166ZM738.553,108.45h7.551l-3.678-42.305h-.775l-3.098,42.305Z"/>
                <path className="fill-white" d="M771.756,52.011h25.557c4.066,0,7.212.919,9.439,2.759,2.226,1.84,3.727,4.421,4.501,7.745.775,3.324,1.162,7.567,1.162,12.73,0,4.712-.615,8.391-1.84,11.036-1.227,2.647-3.356,4.486-6.39,5.518,2.517.517,4.34,1.775,5.469,3.775,1.128,2.001,1.695,4.711,1.695,8.131l-.194,31.462h-16.263v-32.527c0-2.323-.453-3.807-1.355-4.453-.904-.644-2.551-.968-4.937-.968v37.948h-16.845V52.011ZM792.666,82.796c2.324,0,3.485-2.517,3.485-7.551,0-2.193-.096-3.839-.29-4.937-.193-1.096-.549-1.854-1.065-2.275-.517-.419-1.258-.629-2.226-.629h-3.872v15.392h3.969Z"/>
                <path className="fill-white" d="M820.351,135.168V52.011h33.302v16.07h-16.36v16.166h15.683v15.683h-15.683v19.071h17.425v16.167h-34.367Z"/>
                <path className="fill-white" d="M862.654,135.168V52.011h17.135l7.648,39.788v-39.788h16.07v83.156h-16.263l-8.325-41.626v41.626h-16.264Z"/>
                <path className="fill-white" d="M911.057,135.168l8.035-83.156h28.171l7.938,83.156h-15.78l-1.161-13.456h-10.068l-.969,13.456h-16.166ZM929.45,108.45h7.551l-3.678-42.305h-.775l-3.098,42.305Z"/>
                <path className="fill-primary" d="M191.611,7.962c-9.201-5.131-22.118-7.962-38.396-7.962H22.469l30.921,29.386L0,166.215h33.798L87.117,29.371h70.168c19.286,0,31.141,12.916,31.141,36.272,0,14.31-4.344,24.331-11.953,30.093-3.641,2.276-8.126,3.999-13.595,5.249-.949.217-3.812.79-3.812.79l11.537,28.64,2.575-.736c30.166-11.036,47.088-25.384,48.688-64.214,1.1-26.694-11.678-46.888-30.256-57.504Z"/>
                <polygon className="fill-primary" points="123.008 41.615 95.908 41.592 46.138 166.319 81.187 166.312 112.149 138.679 89.887 142.312 109.966 90.122 126.335 135.261 159.252 133.724 123.008 41.615"/>
             </g>
           </svg>
        </div>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center space-x-8">
          <button onClick={() => scrollToSection('experience')} className="text-muted hover:text-white transition-colors font-medium">Experience</button>
          <button onClick={() => scrollToSection('games')} className="text-muted hover:text-white transition-colors font-medium">Games</button>
          <button onClick={() => scrollToSection('pricing')} className="text-muted hover:text-white transition-colors font-medium">Pricing</button>
        </div>

        {/* Desktop Actions */}
        <div className="hidden md:block">
          <button onClick={onOpenBooking} className="bg-primary text-black px-6 py-2 rounded-full font-bold hover:scale-105 transition-transform">
            Book Now
          </button>
        </div>

        {/* Mobile Toggle */}
        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="md:hidden text-white p-2">
          {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <div className={`md:hidden absolute top-20 left-0 w-full bg-bgDark border-b border-white/10 flex flex-col p-6 shadow-2xl transform transition-transform duration-300 ${isMobileMenuOpen ? 'translate-y-0' : '-translate-y-[150%]'}`}>
        <button onClick={() => scrollToSection('experience')} className="py-4 text-muted text-xl font-bold hover:text-white">Experience</button>
        <button onClick={() => scrollToSection('games')} className="py-4 text-muted text-xl font-bold hover:text-white">Games</button>
        <button onClick={() => scrollToSection('pricing')} className="py-4 text-muted text-xl font-bold hover:text-white">Pricing</button>
        <button onClick={() => { setIsMobileMenuOpen(false); onOpenBooking(); }} className="mt-4 w-full bg-primary text-black py-4 rounded-xl font-bold">
          Book Now
        </button>
      </div>
    </nav>
  );
};

export default Navbar;