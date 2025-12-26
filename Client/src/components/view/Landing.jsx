import React, { useState } from 'react';
import { Search, Menu } from 'lucide-react';
import { motion } from "framer-motion";
import axios from "axios";

const Landing = () => {
  const [query, setQuery] = useState('');
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSearch = async () => {
    if (!query) return;

    setLoading(true);
    setError("");
    setRecommendations([]);

    try {
      const res = await axios.post("http://localhost:8000/api/ai/recommend", { userInput: query });
      const data = res.data;
      setRecommendations(data);
    } catch (err) {
      console.error(err);
      setError("Something went wrong. Please try again");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-purple-500/30 overflow-x-hidden">
      {/* Navigation */}
      {/* <nav className="flex border-b border-white items-center justify-between px-6 py-5 max-w-7xl mx-auto w-full">
        <div className="flex items-center gap-3 cursor-pointer">
          <div className="bg-gradient-to-br from-indigo-500 to-purple-600 p-2 rounded-xl shadow-[0_0_20px_rgba(139,92,246,0.4)]">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
              <rect width="20" height="12" x="2" y="6" rx="2" />
              <circle cx="8" cy="12" r="2" />
              <circle cx="16" cy="12" r="2" />
            </svg>
          </div>
          <span className="text-xl font-bold tracking-tight">Play wise</span>
        </div>

        <div className="hidden md:flex gap-10 text-sm font-medium text-gray-400">
          <a href="#" className="hover:text-white text-xl transition-colors">Who we are</a>
          <a href="#" className="hover:text-white text-xl transition-colors">About us</a>
          <a href="#" className="hover:text-white text-xl transition-colors">Community</a>
        </div>

        <div className="md:hidden">
          <Menu className="w-6 h-6 text-gray-300" />
        </div>
      </nav> */}

      {/* Hero Section */}
      <main className="flex flex-col items-center justify-center px-6 pt-20 md:pt-32 pb-20 text-center max-w-5xl mx-auto">
        <motion.h1
          initial={{ opacity: 0, x: 500 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.9 }}
          className="text-4xl sm:text-5xl md:text-7xl font-extrabold tracking-tight mb-6 leading-[1.1] bg-gradient-to-r from-pink-300 via-purple-400 to-indigo-400 bg-clip-text text-transparent"
        >
          Discover Your Next <br className="hidden sm:block" /> Gaming Adventure
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, x: -500 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.9 }}
          className="text-gray-400 text-base md:text-xl max-w-2xl mb-10 md:mb-14 leading-relaxed"
        >
          Explore thousands of games, join communities, and level up your experience.
        </motion.p>

        {/* Search Bar */}
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{
            duration: 0.3,
            scale: { type: "spring", visualDuration: 0.4, bounce: 0.5 },
          }}
          className="relative w-full max-w-2xl group"
        >
          <div className="absolute -inset-1 bg-gradient-to-r from-purple-600/30 to-blue-600/30 rounded-full blur-2xl opacity-75 group-focus-within:opacity-100 transition-opacity"></div>

          <div className="relative flex items-center bg-[#0F0F0F] border border-white/10 rounded-full p-1.5 md:p-2 pl-5 md:pl-7 shadow-2xl">
            <Search className="w-5 h-5 text-gray-500 shrink-0" />
            <input
              type="text"
              placeholder="Search for games..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="bg-transparent border-none outline-none w-full text-sm md:text-base text-gray-200 placeholder:text-gray-600 py-3 px-3"
            />
            <button
              onClick={handleSearch}
              disabled={loading}
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 px-5 md:px-10 py-2.5 md:py-3 rounded-full font-bold text-sm md:text-base transition-all shadow-lg active:scale-95 shrink-0"
            >
              {loading ? "Searching..." : "Search"}
            </button>
          </div>
        </motion.div>

        {error && <p className="text-red-500 mt-4">{error}</p>}

        {/* Recommendations */}
        {recommendations.length > 0 && (
          <div className="mt-10 w-full max-w-3xl flex flex-col gap-4">
            {recommendations.map((game, idx) => (
              <div
                key={game.name || idx}
                className="bg-[#1A1A1A] border border-white/10 rounded-xl p-4 text-left"
              >
                <h3 className="font-bold text-xl mb-1">{game.name}</h3>
                <p className="text-gray-400 mb-1">{game.description}</p>
                <p className="text-yellow-400 font-semibold">Rating: {game.rating}/5</p>
                {game.guide && <p className="text-gray-500 text-sm mt-1">Tips: {game.guide}</p>}
              </div>
            ))}
          </div>
        )}

        {/* Tags */}
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{
            duration: 1.4,
            scale: { type: "spring", visualDuration: 0.4, bounce: 0.5 },
          }}
          className="mt-8 flex flex-wrap justify-center gap-2 md:gap-3"
        >
          {['Action', 'RPG', 'Strategy', 'Horror'].map((tag, index) => (
            <motion.span
              key={tag}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{
                delay: index * 0.5,
                type: "spring",
                stiffness: 300,
              }}
              whileHover={{ scale: 1.1 }}
              className="px-4 py-1.5 bg-white/5 border border-white/10 rounded-full text-xs text-gray-400 hover:border-purple-500/50 cursor-pointer transition-colors"
            >
              {tag}
            </motion.span>
          ))}
        </motion.div>
      </main>
    </div>
  );
};

export default Landing;
