import { useState } from "react";
import { motion } from "framer-motion";
import { Sparkles, Gamepad2, Clock, Brain } from "lucide-react";
import { Link } from "react-router-dom";
import AnimatedBackground from "./Animate";

const AiMatchmaker = () => {
  const [form, setForm] = useState({
    mood: "",
    genre: "",
    time: "",
  });

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    if (!form.mood || !form.genre || !form.time) return;

    setLoading(true);
    setResult(null);

    try {
      const res = await fetch("http://localhost:8000/api/ai/matchmaker", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      setResult(data);
    } catch (err) {
      console.error("Matchmaker error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden flex items-center justify-center px-4">

      {/* Animated Background */}
      <AnimatedBackground />

      {/* Dark overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/70 to-black/90 z-0" />

      {/* Home Button */}
      <div className="absolute top-6 left-6 z-10">
        <Link
          to="/home"
          className="bg-purple-600 hover:bg-purple-500 text-white px-5 py-2 rounded-xl font-bold transition shadow-lg"
        >
          ← Home
        </Link>
      </div>

      {/* Main Card */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 w-full max-w-xl bg-[#111]/80 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-2xl"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <Sparkles className="mx-auto text-purple-500 mb-2" size={32} />
          <h1 className="text-3xl font-bold mb-2">AI Game Matchmaker</h1>
          <p className="text-gray-400 text-sm">
            Answer a few questions and let AI find the perfect game for you
          </p>
        </div>

        {/* Form */}
        <div className="space-y-4">
          {/* Mood */}
          <div className="relative">
            <Brain className="absolute left-3 top-3 text-gray-400" size={18} />
            <select
              className="w-full bg-[#0f0f0f] border border-white/10 rounded-lg pl-10 pr-3 py-2 text-gray-200 focus:outline-none focus:border-purple-500"
              onChange={(e) =>
                setForm({ ...form, mood: e.target.value })
              }
            >
              <option value="">Select your mood</option>
              <option>Relaxed</option>
              <option>Competitive</option>
              <option>Strategic</option>
            </select>
          </div>

          {/* Genre */}
          <div className="relative">
            <Gamepad2 className="absolute left-3 top-3 text-gray-400" size={18} />
            <select
              className="w-full bg-[#0f0f0f] border border-white/10 rounded-lg pl-10 pr-3 py-2 text-gray-200 focus:outline-none focus:border-purple-500"
              onChange={(e) =>
                setForm({ ...form, genre: e.target.value })
              }
            >
              <option value="">Select preferred genre</option>
              <option>FPS</option>
              <option>Strategy</option>
              <option>War</option>
              <option>RPG</option>
            </select>
          </div>

          {/* Time */}
          <div className="relative">
            <Clock className="absolute left-3 top-3 text-gray-400" size={18} />
            <select
              className="w-full bg-[#0f0f0f] border border-white/10 rounded-lg pl-10 pr-3 py-2 text-gray-200 focus:outline-none focus:border-purple-500"
              onChange={(e) =>
                setForm({ ...form, time: e.target.value })
              }
            >
              <option value="">Available play time</option>
              <option>30 minutes</option>
              <option>1–2 hours</option>
              <option>Long sessions</option>
            </select>
          </div>

          {/* Button */}
          <button
            onClick={submit}
            disabled={loading}
            className="w-full mt-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:opacity-90 disabled:opacity-50 py-2 rounded-lg font-semibold transition"
          >
            {loading ? "AI is thinking..." : "Find My Game"}
          </button>
        </div>

        {/* Result */}
        {result && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 bg-[#0f0f0f] border border-purple-500/30 rounded-xl p-4"
          >
            {result.name && (
              <h2 className="text-lg font-bold text-purple-400">
                {result.name}
              </h2>
            )}

            {result.reason && (
              <p className="text-gray-300 text-sm mt-2">
                {result.reason}
              </p>
            )}

            {result.rating && (
              <p className="text-yellow-400 mt-2 font-semibold">
                ⭐ {result.rating} / 5
              </p>
            )}

            {result.image && (
              <img
                src={result.image}
                alt={result.name}
                className="w-full h-48 object-cover rounded-xl mt-4"
              />
            )}

            {result.buyLink && (
              <a
                href={result.buyLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block mt-4 bg-green-600 hover:bg-green-500 px-4 py-2 rounded-lg font-semibold"
              >
                Buy on {result.store || "Store"} ({result.price || "View"})
              </a>
            )}
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default AiMatchmaker;
