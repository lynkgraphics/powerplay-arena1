import React, { useState, useRef, useEffect } from 'react';

const GiftCard: React.FC = () => {
    const [rotate, setRotate] = useState({ x: 0, y: 0 });
    const [isVisible, setIsVisible] = useState(false);
    const cardRef = useRef<HTMLDivElement>(null);
    const sectionRef = useRef<HTMLElement>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                }
            },
            { threshold: 0.2 }
        );

        if (sectionRef.current) {
            observer.observe(sectionRef.current);
        }

        return () => {
            if (sectionRef.current) {
                observer.unobserve(sectionRef.current);
            }
        };
    }, []);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!cardRef.current) return;

        const rect = cardRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = ((y - centerY) / centerY) * -15; // Max 15 degrees tilt
        const rotateY = ((x - centerX) / centerX) * 15;

        setRotate({ x: rotateX, y: rotateY });
    };

    const handleMouseLeave = () => {
        setRotate({ x: 0, y: 0 });
    };

    return (
        <section id="gift-card" ref={sectionRef} className="py-24 bg-black/40 overflow-hidden">
            <div className="container mx-auto px-6">
                <div className="flex flex-col lg:flex-row items-center gap-16">
                    <div className="flex-1 text-center lg:text-left">
                        <h2 className="text-4xl font-bold mb-6">Give the Gift of Adventure</h2>
                        <p className="text-muted text-lg mb-8 max-w-xl">
                            Perfect for birthdays, holidays, or just because. Our gift cards unlock a world of immersive
                            V-Sports, Sim Racing, and Free Roam VR experiences.
                        </p>
                        <div className="space-y-4">
                            <div className="flex items-center gap-3 justify-center lg:justify-start text-white/80">
                                <span className="w-2 h-2 rounded-full bg-primary shadow-[0_0_10px_#A3FF00]"></span>
                                <span>Instant Digital Delivery</span>
                            </div>
                            <div className="flex items-center gap-3 justify-center lg:justify-start text-white/80">
                                <span className="w-2 h-2 rounded-full bg-secondary shadow-[0_0_10px_#00F0FF]"></span>
                                <span>No Expiration Date</span>
                            </div>
                            <div className="flex items-center gap-3 justify-center lg:justify-start text-white/80">
                                <span className="w-2 h-2 rounded-full bg-primary shadow-[0_0_10px_#A3FF00]"></span>
                                <span>Valid for all Experiences</span>
                            </div>
                        </div>
                        <a
                            href="https://app.squareup.com/gift/MLB7C3J7CVWZ2/order"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-block mt-12 bg-primary text-black px-10 py-4 rounded-full font-bold hover:scale-105 transition-transform"
                        >
                            BUY A GIFT CARD
                        </a>
                    </div>

                    <div className="flex-1 perspective-[1000px] w-full max-w-md mx-auto">
                        <div
                            ref={cardRef}
                            onMouseMove={handleMouseMove}
                            onMouseLeave={handleMouseLeave}
                            style={{
                                transform: isVisible
                                    ? `rotateX(${rotate.x}deg) rotateY(${rotate.y}deg)`
                                    : 'rotateX(20deg) rotateY(-180deg) scale(0.8)',
                                transition: isVisible
                                    ? (rotate.x === 0 && rotate.y === 0 ? 'all 1.5s cubic-bezier(0.34, 1.56, 0.64, 1)' : 'transform 0.1s ease-out, opacity 0.5s ease-out')
                                    : 'all 0.5s ease-out',
                                opacity: isVisible ? 1 : 0
                            }}
                            className="relative aspect-[1.586/1] w-full rounded-[20px] shadow-2xl preserve-3d cursor-pointer group"
                        >
                            {/* Card Face */}
                            <div className="absolute inset-0 rounded-[20px] overflow-hidden bg-gradient-to-br from-[#7B1FA2] via-[#512DA8] to-[#00BCD4] p-8 flex flex-col justify-between border border-white/20 shadow-[0_0_50px_rgba(0,0,0,0.5)]">

                                {/* Glossy Overlay */}
                                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-white/10 opacity-50"></div>

                                {/* Logo & Type */}
                                <div className="flex justify-between items-start relative z-10">
                                    <div className="font-bold text-2xl tracking-widest text-white/90 drop-shadow-md">GIFT CARD</div>
                                    <div className="flex items-center gap-2">
                                        <div className="text-right">
                                            <div className="font-black text-xs leading-none">POWERPLAY</div>
                                            <div className="text-[10px] tracking-[0.2em] font-light">ARENA</div>
                                        </div>
                                    </div>
                                </div>

                                {/* EMV Chip */}
                                <div className="relative z-10 w-14 h-11 bg-gradient-to-br from-[#E6B151] via-[#D99A2B] to-[#B37F1E] rounded-md border border-black/10 flex flex-col justify-around p-1 overflow-hidden shadow-inner">
                                    <div className="w-full h-[1px] bg-black/10"></div>
                                    <div className="w-full h-[1px] bg-black/10"></div>
                                    <div className="w-full h-[1px] bg-black/10"></div>
                                    <div className="absolute left-1/2 top-0 bottom-0 w-[1px] bg-black/10"></div>
                                </div>

                                {/* Card Info */}
                                <div className="relative z-10">
                                    <div className="font-mono text-2xl tracking-[0.2em] text-white/90 drop-shadow-lg mb-4">
                                        1234 4568 1234 4568
                                    </div>
                                    <div className="flex justify-between items-end">
                                        <div className="font-mono text-[10px] text-white/60">
                                            1234
                                        </div>
                                        <div className="flex flex-col items-end">
                                            <div className="text-[8px] text-white/50 uppercase tracking-tighter">valid thru</div>
                                            <div className="font-mono text-lg text-white/90">00/00</div>
                                        </div>
                                    </div>
                                </div>

                                {/* Reflective stripes (matching original) */}
                                <div className="absolute top-0 right-[15%] w-[10%] h-[150%] bg-white/5 -rotate-[25deg] pointer-events-none"></div>
                                <div className="absolute top-0 right-[28%] w-[5%] h-[150%] bg-white/5 -rotate-[25deg] pointer-events-none"></div>
                            </div>

                            {/* Backglow */}
                            <div className="absolute -inset-4 bg-gradient-to-br from-primary/20 to-secondary/20 blur-2xl rounded-[30px] -z-10 group-hover:from-primary/30 group-hover:to-secondary/30 transition-colors"></div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default GiftCard;
