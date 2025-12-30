import React, { useState, useEffect } from "react";
import { Search, Lock, Shield, Zap, Users, Gamepad2, Flame, TrendingUp, ChevronDown, ExternalLink, Play, Tag, Info } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Skeleton } from "@mui/material";
import axios from "axios";

const Landing = ({ onViewChange }) => {
  const [query, setQuery] = useState("");
  const [recommendations, setRecommendations] = useState([]);
  const [trendyGames, setTrendyGames] = useState([]);
  const [visibleCount, setVisibleCount] = useState(5);
  const [loading, setLoading] = useState(false);
  const [loadingTrendy, setLoadingTrendy] = useState(true);
  const [error, setError] = useState("");
  const [isRegistered, setIsRegistered] = useState(false);


  // Load saved search results from localStorage
  useEffect(() => {
    const savedResults = localStorage.getItem("last_search_results");
    const savedQuery = localStorage.getItem("last_query");

    if (savedResults) {
      try {
        setRecommendations(JSON.parse(savedResults));
        if (savedQuery) setQuery(savedQuery);
      } catch (err) {
        console.error("Failed to parse stored results", err);
        localStorage.removeItem("last_search_results");
      }
    }
  }, []);
  // 1. Fetch 20 trendy games on mount
  useEffect(() => {
    const fetchTrendy = async () => {
      try {
        const res = await axios.get("http://localhost:8000/api/ai/games");
        setTrendyGames(res.data.trendyGames || []);
      } catch (err) {
        console.error("Failed to fetch trendy games:", err);
      } finally {
        setLoadingTrendy(false);
      }
    };
    fetchTrendy();
  }, []);

  const handleSeeMore = () => setVisibleCount((prev) => prev + 5);

  const formatTrailerUrl = (url) => {
    if (!url) return "";
    if (url.includes("watch?v=")) return url.replace("watch?v=", "embed/");
    return url;
  };

  const handleSearch = async () => {
    if (!query.trim()) return;
    setLoading(true);
    setError("");

    try {
      const res = await axios.post("http://localhost:8000/api/ai/recommend", {
        userInput: query,
      });
      const games = res.data.games;
      setRecommendations(games);
      localStorage.setItem("last_search_results", JSON.stringify(games));
      localStorage.setItem("last_query", query);
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white font-sans overflow-x-hidden">
      <main className="flex flex-col items-center px-6 pt-24 text-center max-w-6xl mx-auto pb-20">

        {/* HERO SECTION */}
        <motion.h1
          initial={{ opacity: 0, y: -40 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl md:text-7xl font-extrabold mb-6 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent"
        >
          Discover Your Next Gaming Adventure
        </motion.h1>

        {/* SEARCH BAR */}
        <div className="relative w-full max-w-2xl mb-16">
          <div className="flex items-center bg-[#0F0F0F] border border-white/10 rounded-full px-5 py-3 shadow-lg shadow-purple-500/5 transition-all focus-within:border-purple-500/50">
            <Search className="text-gray-500 mr-2" />
            <input
              type="text"
              placeholder="Search for games..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              className="bg-transparent outline-none flex-1 text-gray-200"
            />
            <button
              onClick={handleSearch}
              className="bg-purple-600 hover:bg-purple-500 px-6 py-2 rounded-full font-semibold transition-all active:scale-95"
            >
              Search
            </button>
          </div>
          {error && <p className="text-red-500 text-xs mt-2">{error}</p>}
        </div>

        {/* UPDATED SEARCH RESULTS AREA */}
        <AnimatePresence>
          {loading && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full mb-20 text-left">
              {[1, 2].map((i) => (
                <div key={i} className="bg-[#0F0F0F] border border-white/5 rounded-[2rem] p-6">
                  <Skeleton variant="rectangular" height={200} sx={{ bgcolor: '#1A1A1A', borderRadius: 4, mb: 3 }} />
                  <Skeleton variant="text" width="60%" height={32} sx={{ bgcolor: '#1A1A1A', mb: 1 }} />
                  <Skeleton variant="text" width="90%" sx={{ bgcolor: '#1A1A1A' }} />
                </div>
              ))}
            </div>
          )}

          {!loading && recommendations.length > 0 && (
            <div className="w-full mb-20">
              <div className="flex items-center justify-between mb-8 px-2">
                <h2 className="text-2xl font-black uppercase italic tracking-tighter">Results for you</h2>
                <button onClick={() => setRecommendations([])} className="text-xs text-gray-500 hover:text-white">Clear</button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
                {recommendations.map((game, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="group bg-[#0F0F0F] border border-white/10 rounded-[2.5rem] overflow-hidden flex flex-col hover:border-purple-500/40 transition-all duration-500"
                  >
                    {/* Media Header */}
                    <div className="aspect-video w-full bg-zinc-900 relative">
                      {game.trailer_url ? (
                        <iframe className="w-full h-full" src={formatTrailerUrl(game.trailer_url)} title={game.name} frameBorder="0" allowFullScreen />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center font-black text-white/5 text-4xl italic">PREVIEW</div>
                      )}
                    </div>

                    <div className="p-8 flex flex-col flex-1">
                      <div className="flex justify-between items-start mb-4">
                        <h3 className="text-2xl font-black uppercase italic tracking-tighter">{game.name}</h3>
                        <span className="bg-yellow-400/10 text-yellow-500 text-xs font-black px-2.5 py-1 rounded-lg">★ {game.rating}</span>
                      </div>

                      <div className="flex items-center gap-2 mb-4">
                        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20">
                          <Tag size={12} className="text-purple-500" />
                          <span className="text-[10px] font-black uppercase text-purple-300">{game.genre}</span>
                        </div>
                      </div>

                      <p className="text-gray-400 text-sm mb-6 line-clamp-3 leading-relaxed">{game.description}</p>

                      <div className="mt-auto space-y-4">
                        {/* Blurred Pro Tips */}
                        <div className="relative group/lock rounded-2xl overflow-hidden cursor-pointer" onClick={() => onViewChange("register")}>
                          <div className="p-4 bg-white/5 blur-md select-none opacity-40">
                            <p className="text-[10px] italic leading-snug">{game.detales || "Hidden strategy guide and advanced tips for the pro players..."}</p>
                          </div>
                          <div className="absolute inset-0 bg-purple-600/10 border border-purple-500/20 backdrop-blur-md flex items-center justify-center gap-2">
                            <Lock size={14} className="text-purple-400" />
                            <span className="text-[10px] font-black uppercase tracking-widest text-purple-400">Unlock Details</span>
                          </div>
                        </div>

                        {/* Blurred Deals */}
                        {game.best_deals?.[0] && (
                          <div className="relative rounded-2xl overflow-hidden cursor-pointer" onClick={() => onViewChange("register")}>
                            <div className="flex justify-between items-center p-4 bg-white/5 blur-lg opacity-30 select-none">
                              <div className="h-6 w-20 bg-white/10 rounded"></div>
                              <div className="h-8 w-24 bg-green-500/20 rounded"></div>
                            </div>
                            <div className="absolute inset-0 bg-green-500/5 border border-green-500/20 backdrop-blur-xl flex items-center justify-center">
                              <div className="bg-green-500 text-black px-6 py-2 rounded-xl font-black text-[10px] flex items-center gap-2">
                                <Lock size={12} /> REVEAL BEST PRICE
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}
        </AnimatePresence>

        {/* TRENDY GAMES SECTION */}
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="w-full mb-32"
        >
          <div className="flex items-center justify-start gap-2 mb-8 ml-2">
            <Flame className="text-orange-500 fill-orange-500" size={24} />
            <h2 className="text-2xl font-bold uppercase tracking-wider">Trending Right Now</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4">
            {loadingTrendy ? (
              [1, 2, 3, 4, 5].map((i) => (
                <Skeleton key={i} variant="rectangular" height={280} sx={{ bgcolor: '#0F0F0F', borderRadius: 4 }} />
              ))
            ) : (
              trendyGames.slice(0, visibleCount).map((game, idx) => (
                <motion.div
                  key={game.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: (idx % 5) * 0.1 }}
                  whileHover={{ y: -8 }}
                  className="group flex flex-col bg-[#0F0F0F] border border-white/5 rounded-2xl overflow-hidden cursor-pointer shadow-xl hover:border-purple-500/30 transition-all"
                >
                  <div className="h-40 overflow-hidden relative">
                    <img
                      src={game.image}
                      alt={game.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 opacity-80 group-hover:opacity-100"
                    />
                    <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-md px-2 py-0.5 rounded text-[10px] font-bold text-yellow-500">
                      ⭐ {game.rating}
                    </div>
                  </div>
                  <div className="p-4 text-left flex flex-col flex-1">
                    <h4 className="font-bold text-xs truncate mb-1">{game.name}</h4>
                    <p className="text-[10px] text-gray-500 mb-4">{game.released?.split('-')[0]}</p>

                    <div className="mt-auto pt-3 border-t border-white/5 flex flex-wrap gap-2">
                      {game.stores?.slice(0, 2).map((s, i) => (
                        <div
                          key={i}
                          className="flex items-center gap-1 text-[9px] bg-white/5 border border-white/10 px-2 py-1 rounded text-gray-300"
                        >
                          <ExternalLink size={10} />
                          {s.name}
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </div>

          {/* SEE MORE BUTTON */}
          {!loadingTrendy && visibleCount < trendyGames.length && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleSeeMore}
              className="mt-12 px-10 py-2.5 bg-white/5 border border-white/10 rounded-full text-xs font-bold text-gray-400 hover:text-white hover:bg-white/10 transition-all flex items-center gap-2 mx-auto"
            >
              SEE MORE TRENDY GAMES
              <ChevronDown size={14} />
            </motion.button>
          )}
        </motion.section>

        <hr className="w-full border-white/5 mb-32" />

        {/* WHO WE ARE / ABOUT US SECTION */}
        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="w-full grid grid-cols-1 md:grid-cols-2 gap-12 text-left items-center pb-20"
        >
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-3xl md:text-5xl font-bold mb-6">
              Who <span className="text-purple-500">We Are</span>
            </h2>
            <p className="text-gray-400 leading-relaxed mb-6 text-lg">
              We are a team of passionate gamers and developers dedicated to solving the ultimate problem:
              <span className="text-white font-medium"> "What should I play next?"</span>
            </p>
            <p className="text-gray-400 leading-relaxed text-lg">
              By leveraging cutting-edge AI, we analyze thousands of titles to give you recommendations that actually matter. No more scrolling—just gaming.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="grid grid-cols-2 gap-4"
          >
            <FeatureCard Icon={Zap} title="Fast AI" desc="Instant suggestions." />
            <FeatureCard Icon={Shield} title="Vetted Data" desc="Verified reviews." />
            <FeatureCard Icon={Users} title="Community" desc="Built for gamers." />
            <FeatureCard Icon={Gamepad2} title="Library" desc="10k+ titles." />
          </motion.div>
        </motion.section>
      </main>

      <footer className="border-t border-white/5 py-10 text-center text-gray-600 text-sm">
        <p>&copy; 2024 Gaming AI. All rights reserved.</p>
      </footer>
    </div>
  );
};

const FeatureCard = ({ Icon, title, desc }) => (
  <div className="p-6 bg-white/5 rounded-2xl border border-white/10 hover:bg-white/10 transition-all group">
    <Icon className="text-purple-500 mb-4 group-hover:scale-110 transition-transform" size={24} />
    <h4 className="font-bold text-sm mb-1">{title}</h4>
    <p className="text-[10px] text-gray-500 uppercase tracking-tighter">{desc}</p>
  </div>
);

export default Landing;