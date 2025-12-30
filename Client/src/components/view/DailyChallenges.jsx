import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Flame, CheckCircle2 } from "lucide-react";
import axios from "axios";

const DailyChallenges = () => {
  const [challenges, setChallenges] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

const fetchChallenges = async () => {
    setLoading(true);
    setError("");

    try {

      const res = await axios.get("http://localhost:8000/routes/challengeroutes");
      const data = res.data;

      const formatted = data.map((c, idx) => ({
        id: idx + 1,
        title: c.challenge,
        completed: false,
      }));

      setChallenges(formatted);
    } catch (err) {
      setError("Daily challenges unavailable today");
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleComplete = (id) => {
    setChallenges((prev) =>
      prev.map((c) =>
        c.id === id ? { ...c, completed: true } : c
      )
    );

    setTimeout(() => {
      setChallenges((prev) => prev.filter((c) => c.id !== id));
    }, 300);
  };

  useEffect(() => {
    fetchChallenges();
  }, []);

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-4xl"
    >
      <div className="bg-[#0f0f0f] border border-white/10 rounded-2xl p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Flame className="text-orange-500" size={20} />
            Daily Challenges
          </h2>
          <span className="text-xs font-mono text-gray-500 bg-white/5 px-2 py-1 rounded">
            Resets in 24h
          </span>
        </div>

        {loading && <p className="text-gray-400">Loading challenges…</p>}
        {error && <p className="text-red-500">{error}</p>}

        {/* Challenges */}
        <div className="grid gap-3">
          <AnimatePresence>
            {challenges.map((challenge, idx) => (
              <motion.div
                key={challenge.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: 40 }}
                transition={{ duration: 0.25 }}
                className="bg-[#111] border border-white/5 rounded-xl p-4 hover:border-purple-500/40 transition group flex justify-between items-center"
              >
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="text-gray-600 group-hover:text-green-500 transition" size={20} />
                  <span className="text-sm font-semibold text-gray-200 group-hover:text-purple-300">
                    {challenge.title}
                  </span>
                </div>

                <div className="flex items-center gap-4">
                  <span className="text-[10px] font-bold text-yellow-500 bg-yellow-500/10 px-2 py-0.5 rounded-full">
                    {challenge.reward}
                  </span>

                  {/* Checkbox */}
                  <input
                    type="checkbox"
                    onChange={() => handleComplete(challenge.id)}
                    className="accent-green-500 w-4 h-4 cursor-pointer"
                  />
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Refresh */}
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
