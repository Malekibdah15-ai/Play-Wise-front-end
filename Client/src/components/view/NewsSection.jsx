import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { Newspaper, ArrowRight, TrendingUp, Clock, Share2, ChevronUp } from "lucide-react";
import { useEffect, useState } from "react";
import { useSession } from "../../context/SessionContext";

const NewsSection = () => {
  const { session } = useSession();
  const [news, setNews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  // State to toggle between preview and full view
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    const getnews = async () => {
      try {
        setIsLoading(true);
        const res = await axios.post("http://localhost:8000/api/ai/news", { 
          communities: session.user.communities 
        });
        
        if (res.data && res.data.newsItems) {
          setNews(res.data.newsItems);
        }
      } catch (err) {
        console.error("Failed to fetch news:", err);
      } finally {
        setIsLoading(false);
      }
    };

    if (session?.user?.communities) {
      getnews();
    }
  }, [session?.user?.communities]);

  // Determine which items to show: all of them or just the first 2
  const displayedNews = showAll ? news : news.slice(0, 2);

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemAnim = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1 }
  };

  if (isLoading) return <div className="text-white animate-pulse p-10">Loading latest news...</div>;

  return (
    <div className="w-full">
      {/* Header Section */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold flex items-center gap-3 text-white">
          <div className="p-2 bg-blue-500/10 rounded-lg">
            <Newspaper className="text-blue-400" size={24} />
          </div>
          Latest Headlines
        </h2>
        
        {news.length > 2 && (
          <motion.button
            onClick={() => setShowAll(!showAll)}
            whileHover={{ x: 5 }}
            className="text-sm text-gray-400 hover:text-white transition-colors flex items-center gap-2 group"
          >
            {showAll ? "Show Less" : "View All News"} 
            <ArrowRight 
              size={14} 
              className={`group-hover:text-blue-400 transition-transform duration-300 ${showAll ? '-rotate-90' : ''}`} 
            />
          </motion.button>
        )}
      </div>

      {/* News Grid */}
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        layout // Smoothly animates the grid resizing
        className="grid grid-cols-1 md:grid-cols-2 gap-4"
      >
        <AnimatePresence mode="popLayout">
          {displayedNews.map((item, idx) => (
            <motion.a
              layout
              key={item.Link || idx} // Use Link as key if unique
              href={item.Link}
              target="_blank"
              rel="noopener noreferrer"
              variants={itemAnim}
              initial="hidden"
              animate="show"
              exit={{ opacity: 0, scale: 0.95 }}
              whileHover={{ y: -5 }}
              className="group relative h-64 rounded-2xl overflow-hidden cursor-pointer border border-white/5 bg-[#111]"
            >
              {/* Background Image */}
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

                {/* Share Button */}
                <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform translate-y-2 group-hover:translate-y-0">
                  <button 
                    onClick={(e) => {
                      e.preventDefault(); 
                      if (navigator.share) {
                        navigator.share({ title: item.title, url: item.Link });
                      } else {
                        navigator.clipboard.writeText(item.Link);
                        alert("Link copied to clipboard!");
                      }
                    }}
                    className="p-2 bg-white/10 hover:bg-white/20 rounded-full backdrop-blur-md text-white transition-colors"
                  >
                    <Share2 size={14} />
                  </button>
                </div>

                {/* Text Info */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-xs text-gray-300">
                    <Clock size={12} />
                    <span>{item.data}</span>
                  </div>
                  <h3 className="text-lg font-bold text-white leading-tight group-hover:text-blue-300 transition-colors line-clamp-2">
                    {item.title}
                  </h3>
                </div>
              </div>
            </motion.a>
          ))}
        </AnimatePresence>
      </motion.div>
      
      {/* Optional: Bottom toggle for mobile or long lists */}
      {showAll && (
        <div className="flex justify-center mt-6">
           <button 
            onClick={() => {
              setShowAll(false);
              window.scrollTo({ top: 0, behavior: 'smooth' }); // Optional scroll up
            }}
            className="flex items-center gap-2 text-gray-500 hover:text-white transition-colors text-sm"
           >
             <ChevronUp size={16} /> Show Less
           </button>
        </div>
      )}
    </div>
  );
};

export default NewsSection;