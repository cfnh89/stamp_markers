import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, User, Trash2, Trophy, Star, Settings2, Check } from 'lucide-react';
import { Kid, AppState, ThemeId } from './types';
import { THEMES, MAX_STAMPS } from './constants';

export default function App() {
  const [state, setState] = useState<AppState>(() => {
    const saved = localStorage.getItem('kids_stamps_app');
    if (saved) return JSON.parse(saved);
    return { kids: [], currentKidId: null };
  });

  const [showAddKid, setShowAddKid] = useState(false);
  const [newKidName, setNewKidName] = useState('');
  const [newKidTheme, setNewKidTheme] = useState<ThemeId>('hellokitty');
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    localStorage.setItem('kids_stamps_app', JSON.stringify(state));
  }, [state]);

  const currentKid = state.kids.find(k => k.id === state.currentKidId);

  const addKid = () => {
    if (!newKidName.trim()) return;
    const newKid: Kid = {
      id: Date.now().toString(),
      name: newKidName,
      stamps: 0,
      theme: newKidTheme
    };
    setState(prev => ({
      ...prev,
      kids: [...prev.kids, newKid],
      currentKidId: prev.currentKidId || newKid.id
    }));
    setNewKidName('');
    setShowAddKid(false);
  };

  const deleteKid = (id: string) => {
    setState(prev => {
      const newKids = prev.kids.filter(k => k.id !== id);
      return {
        ...prev,
        kids: newKids,
        currentKidId: prev.currentKidId === id ? (newKids[0]?.id || null) : prev.currentKidId
      };
    });
  };

  const addStamp = () => {
    if (!currentKid) return;
    if (currentKid.stamps >= MAX_STAMPS) return;

    setState(prev => ({
      ...prev,
      kids: prev.kids.map(k => 
        k.id === currentKid.id 
          ? { ...k, stamps: k.stamps + 1 } 
          : k
      )
    }));

    if (currentKid.stamps + 1 === MAX_STAMPS) {
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 5000);
    }
  };

  const resetStamps = () => {
    if (!currentKid) return;
    if (!confirm(`Are you sure you want to reset ${currentKid.name}'s stamps?`)) return;
    setState(prev => ({
      ...prev,
      kids: prev.kids.map(k => 
        k.id === currentKid.id 
          ? { ...k, stamps: 0 } 
          : k
      )
    }));
  };

  const theme = currentKid ? THEMES[currentKid.theme] : THEMES.hellokitty;

  return (
    <div 
      className="min-h-screen flex flex-col p-6 overflow-hidden"
      style={{ 
        background: currentKid ? theme.gradient : '#FFF0F5',
        fontFamily: "'Inter', sans-serif" 
      }}
    >
      <div className="max-w-[1200px] mx-auto w-full flex-1 flex flex-col">
        {/* Header Section */}
        <header className="flex justify-between items-center mb-6">
          <div>
            <h1 
              className="text-4xl font-black flex items-center gap-2"
              style={{ color: theme.headerColor }}
            >
              <span>✨</span> STAMP ADVENTURE <span>✨</span>
            </h1>
            <p className="font-bold opacity-80" style={{ color: theme.secondary }}>
              Collect 100 stamps to win your prize!
            </p>
          </div>

          <div className="flex gap-3 bg-white p-2 rounded-2xl shadow-sm border-2" style={{ borderColor: theme.color }}>
            {Object.entries(THEMES).map(([id, t]) => (
              <div 
                key={id}
                onClick={() => currentKid && setState(prev => ({
                  ...prev,
                  kids: prev.kids.map(k => k.id === currentKid.id ? { ...k, theme: id as ThemeId } : k)
                }))}
                className={`flex flex-col items-center px-4 border-r last:border-r-0 border-pink-50 cursor-pointer transition-opacity ${currentKid?.theme === id ? 'opacity-100' : 'opacity-30'}`}
              >
                <span className="text-2xl">{t.stampIcon}</span>
                <span className="text-[10px] font-bold uppercase" style={{ color: theme.headerColor }}>{t.name.split(' ')[0]}</span>
              </div>
            ))}
          </div>
        </header>

        {/* Kids Tabs */}
        <nav className="flex gap-1">
          {state.kids.map(kid => (
            <button
              key={kid.id}
              onClick={() => setState(s => ({ ...s, currentKidId: kid.id }))}
              className={`
                px-8 py-3 font-bold rounded-t-2xl transition-all border-t-4 border-x-2 relative
                ${state.currentKidId === kid.id 
                  ? 'bg-white shadow-none z-10 -mb-[4px]' 
                  : 'opacity-60 hover:opacity-100 hover:bg-white/50 border-transparent shadow-inner'
                }
              `}
              style={{ 
                color: state.currentKidId === kid.id ? theme.headerColor : 'white',
                backgroundColor: state.currentKidId === kid.id ? 'white' : theme.color,
                borderColor: state.currentKidId === kid.id ? theme.color : 'transparent'
              }}
            >
              {kid.name}'s Board {THEMES[kid.theme].character}
            </button>
          ))}
          <button 
            onClick={() => setShowAddKid(true)}
            className="px-6 py-3 bg-white/30 text-white font-bold rounded-t-2xl hover:bg-white/50 transition-all ml-2"
          >
            <Plus size={20} className="inline mr-1" /> New
          </button>
        </nav>

        {/* Main Content Area */}
        {currentKid ? (
          <div className="flex-1 bg-white rounded-b-3xl rounded-tr-3xl border-4 p-6 shadow-2xl flex gap-8 min-h-0" style={{ borderColor: theme.color }}>
            
            {/* Left: Stamp Grid (10x10 High Density) */}
            <div className="flex-1 grid grid-cols-10 grid-rows-10 gap-2 h-full min-h-[500px]">
              {Array.from({ length: 100 }).map((_, i) => {
                const isEarned = i < currentKid.stamps;
                const isNext = i === currentKid.stamps;
                
                return (
                  <motion.button
                    key={i}
                    whileHover={isNext ? { scale: 1.05 } : {}}
                    whileTap={isNext ? { scale: 0.95 } : {}}
                    onClick={isNext ? addStamp : undefined}
                    disabled={!isNext}
                    className={`
                      aspect-square rounded-lg flex items-center justify-center text-xl transition-all duration-200 relative
                      ${isEarned 
                        ? 'border-2 shadow-sm' 
                        : isNext 
                          ? 'bg-white ring-2 ring-offset-1 cursor-pointer animate-pulse border-2 border-dashed' 
                          : 'bg-gray-50/50 border-2 border-dashed border-gray-100'
                      }
                    `}
                    style={{ 
                      backgroundColor: isEarned ? theme.color + '33' : undefined,
                      borderColor: isEarned ? theme.color : isNext ? theme.color : '#f3f4f6',
                      ringColor: isNext ? theme.color : undefined
                    }}
                  >
                    {isEarned && (
                      <motion.span 
                        initial={{ scale: 0, rotate: -45 }}
                        animate={{ scale: 1, rotate: 0 }}
                      >
                        {theme.stampIcon}
                      </motion.span>
                    )}
                    {!isEarned && (
                      <span className="text-[10px] text-gray-300 font-bold">{i + 1}</span>
                    )}
                  </motion.button>
                );
              })}
            </div>

            {/* Right: Sidebar Stats */}
            <div className="w-80 flex flex-col gap-5">
              <div className="bg-gray-50/50 border-2 rounded-2xl p-5" style={{ borderColor: theme.color + '44' }}>
                <h3 className="text-[10px] font-black uppercase tracking-widest mb-3 opacity-60" style={{ color: theme.headerColor }}>Current Progress</h3>
                <div className="flex items-end gap-2 mb-2">
                  <span className="text-6xl font-black" style={{ color: theme.secondary }}>
                    {currentKid.stamps.toString().padStart(2, '0')}
                  </span>
                  <span className="text-xl font-bold text-gray-300 mb-2">/ 100</span>
                </div>
                <div className="w-full h-4 bg-white rounded-full border border-gray-100 overflow-hidden shadow-inner">
                  <motion.div 
                    className="h-full rounded-full"
                    style={{ backgroundColor: theme.color }}
                    initial={{ width: 0 }}
                    animate={{ width: `${currentKid.stamps}%` }}
                  />
                </div>
              </div>

              <div className="bg-white border-4 border-dashed rounded-3xl p-6 flex-1 flex flex-col items-center justify-center text-center" style={{ borderColor: theme.color }}>
                <div className="w-28 h-28 bg-blue-50 rounded-full flex items-center justify-center text-6xl mb-4 shadow-inner border-2 border-blue-100 animate-pulse">
                  {currentKid.stamps >= MAX_STAMPS ? '🎁' : '❓'}
                </div>
                <h2 className="text-2xl font-black text-gray-800">MYSTERY GIFT!</h2>
                <p className="text-sm text-gray-500 font-medium px-4 mt-2">
                  {currentKid.stamps >= MAX_STAMPS 
                    ? "HOORAY! You unlocked the Mystery Gift! Time to see what's inside!" 
                    : "Collect all 100 stamps to unlock your super special mystery surprise!"}
                </p>
                <button 
                  onClick={addStamp}
                  disabled={currentKid.stamps >= MAX_STAMPS}
                  className="mt-8 w-full py-4 text-white font-black rounded-2xl shadow-lg transform active:scale-95 transition-all disabled:opacity-50"
                  style={{ backgroundColor: theme.color }}
                >
                  I FINISHED A TASK! ✨
                </button>
              </div>

              <div className="flex justify-between px-2">
                 <button onClick={resetStamps} className="text-[10px] font-bold text-gray-400 uppercase hover:text-red-400 transition-colors">Reset progress</button>
                 <button onClick={() => deleteKid(currentKid.id)} className="text-[10px] font-bold text-gray-400 uppercase hover:text-red-600 transition-colors">Delete Profile</button>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex-1 bg-white rounded-3xl border-4 p-6 shadow-2xl flex flex-col items-center justify-center text-center space-y-6" style={{ borderColor: theme.color }}>
             <div className="w-40 h-40 bg-pink-50 rounded-full flex items-center justify-center text-6xl border-4 border-pink-100 shadow-inner">✨</div>
             <h2 className="text-4xl font-black text-gray-800">Ready for an Adventure?</h2>
             <p className="text-gray-500 max-w-sm font-bold">Create a profile and choose your favorite friend to start collecting stamps!</p>
             <button 
               onClick={() => setShowAddKid(true)}
               className="bg-pink-500 text-white px-10 py-5 rounded-3xl font-black text-2xl shadow-2xl hover:scale-105 active:scale-95 transition-all"
             >
               Let's Go! 🚀
             </button>
          </div>
        )}

        {/* Bottom Decorative Bar */}
        <footer className="mt-4 flex justify-between items-center opacity-60 text-sm font-bold" style={{ color: theme.secondary }}>
          <div className="flex gap-6">
            <span className="cursor-pointer hover:underline">🎀 Settings</span>
            <span className="cursor-pointer hover:underline">🏠 My House</span>
            <span className="cursor-pointer hover:underline">🏆 Hall of Fame</span>
          </div>
          <div className="italic">
            {currentKid ? `"You're doing amazing, ${currentKid.name}!"` : "Let's start your journey!"}
          </div>
        </footer>
      </div>

      {/* Add Kid Modal */}
      <AnimatePresence>
        {showAddKid && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowAddKid(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-md"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative bg-white rounded-[3rem] p-8 w-full max-w-md shadow-2xl overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-20 bg-gray-50" />
              <div className="relative z-10 space-y-6 pt-4">
                <div className="flex items-center gap-4 mb-2">
                  <div className="w-16 h-16 bg-pink-100 rounded-3xl flex items-center justify-center text-3xl">💝</div>
                  <h3 className="text-3xl font-black text-gray-900">New Profile</h3>
                </div>
                
                <div className="space-y-2">
                  <label className="text-xs uppercase font-black text-gray-400 tracking-widest pl-2">What's your name?</label>
                  <input 
                    autoFocus
                    placeholder="Type your name..."
                    value={newKidName}
                    onChange={(e) => setNewKidName(e.target.value)}
                    className="w-full bg-gray-50 border-4 border-gray-100 rounded-[1.5rem] px-6 py-4 text-xl font-bold focus:outline-none focus:border-pink-200 transition-all placeholder:text-gray-300"
                  />
                </div>

                <div className="space-y-4">
                  <label className="text-xs uppercase font-black text-gray-400 tracking-widest pl-2">Choose your theme!</label>
                  <div className="grid grid-cols-2 gap-4">
                    {Object.entries(THEMES).map(([id, t]) => (
                      <button
                        key={id}
                        onClick={() => setNewKidTheme(id as ThemeId)}
                        className={`
                          p-4 rounded-[1.5rem] border-4 transition-all flex flex-col items-center gap-2 relative overflow-hidden
                          ${newKidTheme === id ? 'border-pink-400 bg-pink-50' : 'border-gray-100 bg-white hover:border-gray-200'}
                        `}
                      >
                        <span className="text-3xl relative z-10">{t.character}</span>
                        <span className="font-bold relative z-10">{t.name}</span>
                        {newKidTheme === id && (
                           <div className="absolute top-2 right-2 bg-pink-400 text-white rounded-full p-1">
                             <Check size={12} strokeWidth={4} />
                           </div>
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex gap-4 pt-4">
                  <button 
                    onClick={() => setShowAddKid(false)}
                    className="flex-1 px-6 py-4 rounded-[1.5rem] font-bold text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={addKid}
                    disabled={!newKidName.trim()}
                    className="flex-1 bg-pink-500 text-white px-6 py-4 rounded-[1.5rem] font-black text-xl shadow-lg hover:bg-pink-600 shadow-pink-200/50 disabled:opacity-50 transition-all"
                  >
                    Start!
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Reward Confetti Placeholder */}
      {showConfetti && (
        <div className="fixed inset-0 z-[100] pointer-events-none flex items-center justify-center overflow-hidden">
           {Array.from({ length: 50 }).map((_, i) => (
             <motion.div
               key={i}
               initial={{ 
                 top: '50%', 
                 left: '50%',
                 scale: 0,
                 rotate: 0,
                 opacity: 1
               }}
               animate={{ 
                 top: `${Math.random() * 100}%`,
                 left: `${Math.random() * 100}%`,
                 scale: [0, 1.5, 0],
                 rotate: 360,
                 opacity: 0
               }}
               transition={{ 
                 duration: 3,
                 repeat: Infinity,
                 repeatDelay: Math.random() * 2
               }}
               className="absolute text-4xl"
             >
               {['✨', '🎉', '🌟', '🦄', '💝', '🍭'][i % 6]}
             </motion.div>
           ))}
           <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="bg-white p-12 rounded-[3.5rem] shadow-2xl border-8 border-yellow-300 relative z-10 text-center space-y-4"
           >
             <div className="text-8xl">🏆</div>
             <h2 className="text-6xl font-black text-gray-800">AMAZING!</h2>
             <p className="text-2xl font-bold text-gray-500">You reached 100 stamps!</p>
           </motion.div>
        </div>
      )}

      <style>{`
        .scroller-hidden::-webkit-scrollbar {
          display: none;
        }
        .scroller-hidden {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}
