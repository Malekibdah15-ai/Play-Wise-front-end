import React, { useState } from "react";
import { Search, Menu } from "lucide-react";
import { motion } from "framer-motion";
import axios from "axios";
import DailyChallenges from "./Callenge";

const Landing = () => {
  const [query, setQuery] = useState("");
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [deal, setDeal] = useState(null);
  const [dealLoading, setDealLoading] = useState(false);
  const [dealError, setDealError] = useState("");

  const handleSearch = async () => {
    if (!query) return;

    setLoading(true);
    setError("");
    setRecommendations([]);
    setDeal(null);

    try {
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
              className="bg-transparent outline-none flex-1 text-gray-200"
            />
            <button
              onClick={handleSearch}
              className="bg-purple-600 hover:bg-purple-500 px-6 py-2 rounded-full font-semibold"
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

       
        {dealLoading && (
          <p className="mt-6 text-gray-400">Searching for best deal...</p>
        )}

        {dealError && (
          <p className="mt-6 text-red-500">{dealError}</p>
        )}

        {deal && (
          <div className="mt-6 bg-[#111] border border-purple-500/30 rounded-xl p-5 max-w-xl text-left">
            <h3 className="text-xl font-bold mb-2">
              Best Deal for {deal.game}
            </h3>
            <p className="text-gray-300">
              Platform: <span className="font-semibold">{deal.platform}</span>
            </p>
            <p className="text-green-400 font-semibold">
              Price: {deal.price}
            </p>

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
    </div>
  );
};

export default Landing;

