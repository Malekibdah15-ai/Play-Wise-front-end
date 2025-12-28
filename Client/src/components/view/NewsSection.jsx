import { motion } from "framer-motion";
import { Newspaper, ArrowRight, TrendingUp, Clock, Share2 } from "lucide-react";

const newsItems = [
  { id: "1", title: "The Future of VR Gaming: What to Expect in 2025", category: "Technology", image: "https://picsum.photos/800/600?random=10", date: "10m ago" },
  { id: "2", title: "Patch 5.2 Notes: Major Balance Changes", category: "Update", image: "https://picsum.photos/800/600?random=11", date: "1h ago" },
  { id: "3", title: "Global Championship Finals: Team Liquid Wins", category: "Esports", image: "https://picsum.photos/800/600?random=12", date: "3h ago" },
  { id: "4", title: "Hidden Gems: Indie Games You Missed", category: "Reviews", image: "https://picsum.photos/800/600?random=13", date: "5h ago" },
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemAnim = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

const NewsSection = () => {
  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold flex items-center gap-3 text-white">
          <div className="p-2 bg-blue-500/10 rounded-lg">
            <Newspaper className="text-blue-400" size={24} />
          </div>
          Latest Headlines
        </h2>
        <motion.button 
          whileHover={{ x: 5 }}
          className="text-sm text-gray-400 hover:text-white transition-colors flex items-center gap-2 group"
        >
          View All News <ArrowRight size={14} className="group-hover:text-blue-400 transition-colors"/>
        </motion.button>
      </div>

      <motion.div 
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-2 gap-4"
      >
        {newsItems.map((item, idx) => (
          <motion.div
            key={item.id}
            variants={itemAnim}
            whileHover={{ y: -5 }}
            className="group relative h-64 rounded-2xl overflow-hidden cursor-pointer border border-white/5 bg-[#111]"
          >
            {/* Background Image with Zoom Effect */}
            <div className="absolute inset-0 overflow-hidden">
                <motion.img 
                  src={item.image} 
                  alt={item.title} 
                  className="w-full h-full object-cover"
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.6 }}
                />
            </div>
            
            {/* Dark Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent opacity-90 group-hover:opacity-95 transition-all duration-300" />

            {/* Content */}
            <div className="absolute inset-0 p-5 flex flex-col justify-end">
              
              {/* Top Tags */}
              <div className="absolute top-4 left-4 flex gap-2">
                 <span className="backdrop-blur-md bg-white/10 text-white text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-md border border-white/10">
                  {item.category}
                </span>
                {idx === 0 && (
                   <span className="backdrop-blur-md bg-red-500/20 text-red-400 text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-md flex items-center gap-1">
                    <TrendingUp size={10} /> HOT
                  </span>
                )}
              </div>

              {/* Share Button (Shows on Hover) */}
              <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform translate-y-2 group-hover:translate-y-0">
                <button className="p-2 bg-white/10 hover:bg-white/20 rounded-full backdrop-blur-md text-white transition-colors">
                    <Share2 size={14} />
                </button>
              </div>

              {/* Text Info */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-xs text-gray-300">
                    <Clock size={12} />
                    <span>{item.date}</span>
                </div>
                <h3 className="text-lg font-bold text-white leading-tight group-hover:text-blue-300 transition-colors">
                    {item.title}
                </h3>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

export default NewsSection;