import { motion } from "framer-motion";
import { Flame, CheckCircle2, Circle } from "lucide-react";

const challenges = [
  { id: "1", title: "Play an RPG for 2 hours", reward: "500 XP", progress: 60, total: 120, current: 72, unit: "mins" },
  { id: "2", title: "Complete 3 Raids", reward: "Gold Chest", progress: 33, total: 3, current: 1, unit: "raids" },
  { id: "3", title: "Win a Match in PvP", reward: "Rare Skin", progress: 0, total: 1, current: 0, unit: "wins" },
];

const DailyChallenges = () => {
  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <Flame className="text-orange-500" fill="currentColor" size={20} />
          Daily Challenges
        </h2>
        <span className="text-xs font-mono text-gray-500 bg-white/5 px-2 py-1 rounded">Resets in 4h 20m</span>
      </div>

      <div className="grid gap-3">
        {challenges.map((challenge, idx) => (
          <motion.div
            key={challenge.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="bg-[#111] border border-white/5 rounded-xl p-4 hover:border-white/10 transition-colors group"
          >
            <div className="flex justify-between items-start mb-2">
              <h3 className="text-sm font-semibold text-gray-200 group-hover:text-purple-300 transition-colors">
                {challenge.title}
              </h3>
              <span className="text-[10px] font-bold text-yellow-500 bg-yellow-500/10 px-2 py-0.5 rounded-full">
                {challenge.reward}
              </span>
            </div>

            <div className="flex items-center gap-3">
              {challenge.progress >= 100 ? (
                <CheckCircle2 className="text-green-500" size={20} />
              ) : (
                <Circle className="text-gray-600" size={20} />
              )}
              
              <div className="flex-1">
                <div className="flex justify-between text-[10px] text-gray-500 mb-1">
                  <span>Progress</span>
                  <span>{challenge.current}/{challenge.total} {challenge.unit}</span>
                </div>
                <div className="h-1.5 w-full bg-[#222] rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${challenge.progress}%` }}
                    className="h-full bg-gradient-to-r from-orange-500 to-pink-500"
                  />
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default DailyChallenges;