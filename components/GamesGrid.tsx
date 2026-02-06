import React, { useState, useMemo } from 'react';
import { GAMES_DATA, CATEGORIES } from '../constants';
import { Game } from '../types';

interface GamesGridProps {
  onBookGame: (gameName: string) => void;
}

const GamesGrid: React.FC<GamesGridProps> = ({ onBookGame }) => {
  const [activeCategory, setActiveCategory] = useState('All');
  const [visibleCount, setVisibleCount] = useState(8);
  const [selectedGame, setSelectedGame] = useState<Game | null>(null);

  const filteredGames = useMemo(() => {
    return activeCategory === 'All'
      ? GAMES_DATA
      : GAMES_DATA.filter(g => g.category === activeCategory);
  }, [activeCategory]);

  const displayedGames = filteredGames.slice(0, visibleCount);

  return (
    <section id="games" className="py-24 bg-white/5">
      <div className="container mx-auto px-6">
        <div className="mb-12">
          <h2 className="text-4xl font-bold mb-2">The Library</h2>
          <p className="text-muted">Powered by SynthesisVR</p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-2 mb-8 overflow-x-auto pb-2 no-scrollbar">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => { setActiveCategory(cat); setVisibleCount(8); }}
              className={`px-4 py-2 rounded-full text-sm font-medium border transition-all whitespace-nowrap ${activeCategory === cat
                ? 'bg-white text-black border-white'
                : 'bg-bgCard text-muted border-white/5 hover:border-white/30 hover:text-white'
                }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {displayedGames.map(game => (
            <div
              key={game.id}
              className="bg-bgCard border border-white/5 rounded-2xl overflow-hidden group hover:-translate-y-1 hover:border-white/20 transition-all cursor-pointer flex flex-col"
              onClick={() => setSelectedGame(game)}
            >
              <div className="relative pt-[150%] bg-zinc-800">
                <img src={game.image} alt={game.title} className="absolute top-0 left-0 w-full h-full object-cover" loading="lazy" />
                <span className="absolute top-2 right-2 bg-black/80 text-xs font-bold px-2 py-1 rounded text-white">
                  {game.category}
                </span>
              </div>
              <div className="p-5 flex-1 flex flex-col">
                <h3 className="font-bold text-lg mb-2">{game.title}</h3>
                <p className="text-muted text-sm line-clamp-3 mb-4 flex-1">{game.desc}</p>
                <div className="flex justify-between items-center text-sm mt-auto">
                  <span className="border border-white/20 rounded px-2 py-1 text-muted">{game.rating}</span>
                  <span className="text-primary font-bold group-hover:translate-x-1 transition-transform">DETAILS →</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Load More */}
        {visibleCount < filteredGames.length && (
          <div className="text-center mt-12">
            <button
              onClick={() => setVisibleCount(prev => prev + 8)}
              className="bg-primary text-black px-8 py-3 rounded-full font-bold hover:scale-105 transition-transform"
            >
              Show More Games
            </button>
          </div>
        )}
      </div>

      {/* Game Details Modal */}
      {selectedGame && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm" onClick={() => setSelectedGame(null)}>
          <div
            className="bg-bgCard max-w-4xl w-full max-h-[90vh] overflow-y-auto no-scrollbar rounded-2xl border border-white/10 p-6 md:p-8 relative shadow-2xl"
            onClick={e => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedGame(null)}
              className="absolute top-4 right-4 z-10 text-white hover:text-primary bg-black/50 rounded-full w-8 h-8 flex items-center justify-center backdrop-blur-sm transition-colors"
            >
              <div className="text-2xl leading-none">&times;</div>
            </button>
            <div className="space-y-8">
              {/* Top Section: Cover & Video */}
              <div className="flex flex-col md:flex-row gap-6 items-stretch">
                <div className="w-full md:w-1/3 lg:w-1/4">
                  <img src={selectedGame.image} alt={selectedGame.title} className="w-full h-[250px] md:h-full rounded-xl object-cover shadow-lg border border-white/10" />
                </div>
                {selectedGame.trailerUrl ? (
                  <div className="flex-1 w-full flex items-center">
                    <div className="relative w-full pb-[56.25%] overflow-hidden rounded-xl shadow-2xl border border-white/10 bg-black/50">
                      {selectedGame.trailerUrl.includes('youtube.com') || selectedGame.trailerUrl.includes('youtu.be') ? (
                        <iframe
                          src={selectedGame.trailerUrl}
                          title={`${selectedGame.title} trailer`}
                          className="absolute top-0 left-0 w-full h-full border-0"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                          allowFullScreen
                        ></iframe>
                      ) : (
                        <video
                          src={selectedGame.trailerUrl}
                          controls
                          autoPlay
                          muted
                          className="absolute top-0 left-0 w-full h-full object-cover"
                        >
                          Your browser does not support the video tag.
                        </video>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="flex-1 bg-white/5 rounded-xl border border-dashed border-white/10 flex items-center justify-center text-muted italic">
                    Trailer coming soon
                  </div>
                )}
              </div>

              {/* Bottom Section: Info & Booking */}
              <div className="border-t border-white/10 pt-8">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-6">
                  <div>
                    <h2 className="text-3xl font-bold text-primary mb-2">{selectedGame.title}</h2>
                    <div className="flex gap-2">
                      <span className="bg-zinc-800 px-3 py-1 rounded-full text-sm text-white">{selectedGame.category}</span>
                      <span className="border border-white/30 px-3 py-1 rounded-full text-sm text-muted">Rated {selectedGame.rating}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => { setSelectedGame(null); onBookGame(selectedGame.title); }}
                    className="bg-primary text-black px-12 py-3 rounded-xl font-bold hover:scale-105 transition-transform shadow-lg shadow-primary/20"
                  >
                    Book This Game
                  </button>
                </div>
                <p className="text-gray-300 leading-relaxed text-lg max-w-4xl">{selectedGame.desc}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default GamesGrid;
