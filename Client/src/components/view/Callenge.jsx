import { useEffect, useState } from "react";
import { motion } from "framer-motion";

const DailyChallenges = () => {
  const [challenges, setChallenges] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchChallenges = async () => {
    setLoading(true);
    setError("");

    try {
      const res = await fetch("http://localhost:8000/api/ai/challenges");
      if (!res.ok) throw new Error("Failed to load");

      const data = await res.json();
      setChallenges(data);
    } catch (err) {
      setError("Daily challenges unavailable today");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchChallenges();
  }, []);

  return (
    <motion.section
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-4xl mb-16"
    >
      <div className="bg-gradient-to-br from-[#141414] to-[#0c0c0c] border border-white/10 rounded-2xl p-6">
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
          🎯 Daily Gaming Challenges
        </h2>

        {loading && (
          <p className="text-gray-400">Loading today’s challenges…</p>
        )}

        {error && (
          <p className="text-red-500">{error}</p>
        )}

        <ul className="space-y-3">
          {challenges.map((c, i) => (
            <li
              key={i}
              className="bg-[#1a1a1a] border border-white/5 rounded-xl px-4 py-3 text-gray-200 hover:border-purple-500/40 transition"
            >
              {c.challenge}
            </li>
          ))}
        </ul>

        <button
          onClick={fetchChallenges}
          disabled={loading}
          className="mt-6 bg-purple-600 hover:bg-purple-500 disabled:opacity-50 px-5 py-2 rounded-full font-semibold"
        >
          Refresh Challenges
        </button>
      </div>
    </motion.section>
  );
};

export default DailyChallenges;
