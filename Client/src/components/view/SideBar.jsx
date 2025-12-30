import { motion } from "framer-motion";
import { Gamepad2, Hash, Search, Plus } from "lucide-react";
import { useSession } from "../../context/SessionContext";
import { useEffect, useState } from "react";
import axios from "axios";

const Sidebar = ({ onSelectCommunity }) => {
  const { session } = useSession();
  const [allCommunities, setAllCommunities] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchAllCommunities = async () => {
      try {
        const res = await axios.get('http://localhost:8000/api/Gener');
        setAllCommunities(res.data);
      } catch (err) {
        console.error("Error fetching communities:", err);
      }
    };
    fetchAllCommunities();
  }, []);

  /**
   * Helper: Checks if the user's community array contains this community.
   * Since you store data as strings like "rpg", we compare lowercase 
   * to avoid "RPG" vs "rpg" issues.
   */
  const isJoined = (commName) => {
    if (!session?.user?.communities) return false;

    // Normalizing both to lowercase for a perfect match
    return session.user.communities.some(
      (c) => c.toLowerCase() === commName.toLowerCase()
    );
  };

  // Logic: 
  // 1. If searching: show all matches from the DB.
  // 2. If NOT searching: show ONLY communities found in session.user.communities.
  const displayedCommunities = allCommunities.filter((comm) => {
    const matchesSearch = comm.name.toLowerCase().includes(searchTerm.toLowerCase());

    if (searchTerm.trim() !== "") {
      return matchesSearch;
    }
    return isJoined(comm.name);
  });

  return (
    <motion.div
      initial={{ x: -100 }}
      animate={{ x: 0 }}
      className="hidden md:flex flex-col w-20 lg:w-64 h-screen bg-[#0a0a0a] border-r border-white/5 fixed left-0 top-0 z-50"
    >
      {/* Header */}
      <div className="h-20 flex items-center justify-center border-b border-white/5 px-4">
        <Gamepad2 className="w-8 h-8 text-purple-500" />
        <span className="ml-3 font-bold text-lg hidden lg:block bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
          Network
        </span>
      </div>

      {/* Search Section */}
      <div className="px-4 py-4 hidden lg:block">
        <div className="relative group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input
            type="text"
            placeholder="Search all communities..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[#111] border border-white/5 rounded-lg py-2 pl-9 pr-4 text-xs text-white focus:outline-none focus:border-purple-500"
          />
        </div>
      </div>

      {/* List Section */}
      <div className="flex-1 overflow-y-auto py-2 flex flex-col gap-1 custom-scrollbar">
        <p className="px-6 text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] hidden lg:block mb-2">
          {searchTerm ? "Search Results" : "Your Communities"}
        </p>

        {displayedCommunities.map((comm) => (
          <button
            key={comm._id}
            onClick={() => onSelectCommunity(comm.name)}
            className="group flex items-center justify-between px-4 lg:px-6 py-3 hover:bg-white/5 transition-all border-l-2 border-transparent hover:border-purple-500"
          >
            <div className="flex items-center gap-3 overflow-hidden">
              <Hash
                size={18}
                className={isJoined(comm.name) ? "text-purple-500" : "text-gray-600"}
              />
              <div className="hidden lg:flex flex-col items-start overflow-hidden">
                <span className="text-sm font-medium text-gray-400 group-hover:text-white capitalize truncate">
                  {comm.name}
                </span>
                <span className="text-[10px] text-gray-600">
                  {/* --- CHANGE STARTS HERE --- */}
                  {isJoined(comm.name)
                    ? (comm.memberCount || 0) + 1
                    : (comm.memberCount || 0)} members
                  {/* --- CHANGE ENDS HERE --- */}
                </span>
              </div>
            </div>

            {!isJoined(comm.name) && (
              <Plus size={14} className="hidden lg:block text-gray-600 group-hover:text-purple-400" />
            )}
          </button>
        ))}

        {/* Empty State */}
        {displayedCommunities.length === 0 && (
          <div className="px-6 py-4 text-center">
            <p className="text-xs text-gray-600 italic">
              {searchTerm ? "No matches found" : "Join a community to see it here!"}
            </p>
          </div>
        )}
      </div>

      {/* Footer Profile */}
      <div className="p-4 border-t border-white/5">
        <div className="flex items-center gap-3 bg-[#111] p-2 rounded-xl border border-white/5">
          <img
            src={`https://ui-avatars.com/api/?name=${session?.user?.userName || 'User'}&background=a855f7&color=fff`}
            alt="User"
            className="w-8 h-8 rounded-full border border-purple-500/50"
          />
          <div className="hidden lg:block">
            <p className="text-xs font-bold text-white truncate">{session?.user?.userName}</p>
            <p className="text-[9px] text-purple-400 font-bold uppercase">Member</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Sidebar;