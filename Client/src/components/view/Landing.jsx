import React, { useState } from "react";
import { Search, Lock, Shield, Zap, Users, Gamepad2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Skeleton } from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import socket from '../../socket';

import DailyChallenges from "./Callenge";

const Landing = ({ onViewChange }) => {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isRegistered, setIsRegistered] = useState(false);

  const [deal, setDeal] = useState(null);
  const [dealLoading, setDealLoading] = useState(false);
  const [dealError, setDealError] = useState("");

  const handleSearch = async () => {
    if (!query.trim()) return;
    setLoading(true);
    setError("");
    setRecommendations([]);

    try {
      const res = await axios.post("http://localhost:8000/api/ai/recommend", {
        userInput: query,
      });
      setRecommendations(res.data.games);
    } catch (err) {
      console.log(err);
      const res = await axios.post(
        "http://localhost:8000/api/ai/recommend",
        { userInput: query }
      );
      setRecommendations(res.data);
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { staggerChildren: 0.1, duration: 0.4, ease: "easeOut" }
  const fetchBestDeal = async (gameName) => {
    setDeal(null);
    setDealError("");
    setDealLoading(true);

    try {
      const res = await axios.post(
        "http://localhost:8000/api/ai/deal",
        { gameName }
      );
      setDeal(res.data);
    } catch (err) {
      setDealError("Unable to fetch deal");
    } finally {
      setDealLoading(false);
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.9 },
    visible: { opacity: 1, y: 0, scale: 1 }
  };

  return (
    <div className="min-h-screen bg-black text-white font-sans overflow-x-hidden">
      {/* NAV */}
      <nav className="flex border-b border-white/10 items-center justify-between px-6 py-5 max-w-7xl mx-auto">
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-br from-indigo-500 to-purple-600 p-2 rounded-xl">
            🎮
          </div>
          <span className="text-xl font-bold">Play Wise</span>
        </div>
        <Menu className="md:hidden" />
      </nav>

      {/* HERO */}
      <main className="flex flex-col items-center px-6 pt-24 text-center max-w-5xl mx-auto">
        <motion.h1
          initial={{ opacity: 0, y: -40 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl md:text-7xl font-extrabold mb-6 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent"
        >
          Discover Your Next Gaming Adventure
        </motion.h1>

        <p className="text-gray-400 mb-10 max-w-xl">
          Tell us what kind of game you want, and Gemini AI will recommend the best ones.
        </p>
        <DailyChallenges />

        {/* SEARCH */}
        <div className="relative w-full max-w-2xl">
          <div className="flex items-center bg-[#0F0F0F] border border-white/10 rounded-full px-5 py-3">
            <Search className="text-gray-500 mr-2" />
            <input
              type="text"
              placeholder="search for games..."
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
        </div>

        {loading && <p className="mt-4 text-gray-400">Thinking...</p>}
        {error && <p className="mt-4 text-red-500">{error}</p>}

        {recommendations.length > 0 && (
          <div className="mt-12 w-full max-w-3xl flex flex-col gap-4">
            {recommendations.map((game, idx) => (
              <div
                key={idx}
                className="bg-[#1A1A1A] border border-white/10 rounded-xl p-5 text-left"
              >
                <h3 className="text-xl font-bold">{game.name}</h3>
                <p className="text-gray-400 mt-1">{game.description}</p>
                <p className="text-yellow-400 mt-2">
                  Rating: {game.rating}/5
                </p>

                <button
                  onClick={() => fetchBestDeal(game.name)}
                  className="mt-3 bg-purple-600 hover:bg-purple-500 px-4 py-2 rounded-lg text-sm font-semibold"
                >
                  Find Best Deal
                </button>
              </div>
            ))}
          </div>
        )}

        {/* SEARCH RESULTS */}
        <AnimatePresence>
          {!loading && recommendations.length > 0 && (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="w-full max-w-3xl flex flex-col gap-6 mb-32"
            >
              {recommendations.map((game, idx) => (
                <motion.div
                  key={idx}
                  variants={itemVariants}
                  whileHover={{ scale: 1.01 }}
                  className="bg-[#1A1A1A] border border-white/10 rounded-2xl p-6 text-left relative overflow-hidden shadow-2xl"
                >
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="text-2xl font-bold text-white">{game.name}</h3>
                    <span className="text-yellow-400 font-bold">⭐ {game.rating}/5</span>
                  </div>

                  <div className="flex gap-2 mb-3">
                    {game.genre?.map((g) => (
                      <span key={g} className="text-[10px] px-2 py-1 bg-purple-900/30 text-purple-300 rounded-md border border-purple-500/20 uppercase">
                        {g}
                      </span>
                    ))}
                  </div>

                  <p className="text-gray-400 text-sm line-clamp-2 mb-4">{game.description}</p>

                  <div className="relative mt-4 pt-4 border-t border-white/5">
                    <div className={!isRegistered ? "blur-md select-none pointer-events-none" : ""}>
                      <p className="text-xs text-gray-300 italic mb-4">
                        <span className="text-purple-400 font-semibold">Pro Tip: </span>{game.detales}
                      </p>
                      {/* ... Deals & Trailer (Logic remains same) ... */}
                    </div>

                    {!isRegistered && (
                      <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 backdrop-blur-[2px] rounded-xl z-10">
                        <motion.div
                          initial={{ scale: 0.8 }}
                          animate={{ scale: 1 }}
                          className="flex flex-col items-center"
                        >
                          <Lock className="text-purple-500 mb-3" size={28} />
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => onViewChange("register")} // 3. Redirect Action
                            className="text-white bg-purple-600 px-6 py-2 rounded-full text-sm font-bold shadow-lg shadow-purple-500/40 hover:bg-purple-500 transition-colors"
                          >
                            Register to Unlock Details
                          </motion.button>
                        </motion.div>
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        <hr className="w-full border-white/5 mb-32" />

        {/* ABOUT US SECTION */}
        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="w-full grid grid-cols-1 md:grid-cols-2 gap-12 text-left items-center"
        >
          {/* Comes from Left and slightly Up */}
          <motion.div
            initial={{ opacity: 0, x: -400, y: 0 }}
            whileInView={{ opacity: 1, x: 0, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <h2 className="text-3xl md:text-5xl font-bold mb-6">
              Who <span className="text-purple-500">We Are</span>
            </h2>
            <p className="text-gray-400 leading-relaxed mb-6 text-lg">
              We are a team of passionate gamers and Developers dedicated to solving the ultimate problem:
              <span className="text-white font-medium"> "What should I play next?"</span>
            </p>
            <p className="text-gray-400 leading-relaxed text-lg">
              By leveraging cutting-edge AI, we analyze thousands of titles, player reviews, and real-time
              pricing to give you recommendations that actually matter. No more scrolling—just gaming.
            </p>
          </motion.div>

          {/* Comes from Right and slightly Up */}
          <motion.div
            initial={{ opacity: 0, x: 400, y: 0 }}
            whileInView={{ opacity: 1, x: 0, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="grid grid-cols-2 gap-4"
          >
            <FeatureCard Icon={Zap} title="Fast AI" desc="Instant personalized game suggestions." />
            <FeatureCard Icon={Shield} title="Vetted Data" desc="Verified reviews and store pricing." />
            <FeatureCard Icon={Users} title="Community" desc="Built for gamers, by gamers." />
            <FeatureCard Icon={Gamepad2} title="Deep Library" desc="10k+ titles tracked across platforms." />
          </motion.div>
        </motion.section>

            {deal.buyLink && (
              <a
                href={deal.buyLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block mt-3 text-purple-400 hover:underline"
              >
                Buy Now →
              </a>
            )}
          </div>
        )}
        

      </main>

      <footer className="border-t border-white/5 py-10 text-center text-gray-600 text-sm">
        <p>&copy; 2024 Gaming AI. All rights reserved.</p>
      </footer>
    </div>
  );
};

// Simple helper component for About Us cards
const FeatureCard = ({ Icon, title, desc }) => (
  <div className="p-6 bg-white/5 rounded-2xl border border-white/10 hover:bg-white/10 transition-colors">
    <Icon className="text-purple-500 mb-4" />
    <h4 className="font-bold mb-1">{title}</h4>
    <p className="text-xs text-gray-500">{desc}</p>
  </div>
);

export default Landing;
