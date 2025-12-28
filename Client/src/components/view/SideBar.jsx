import { motion } from "framer-motion";
import { Gamepad2, Hash } from "lucide-react";
import { useSession } from "../../context/SessionContext";

const Sidebar = ({ onSelectCommunity }) => {
  const { session } = useSession();

  return (
    <motion.div 
      initial={{ x: -100 }}
      animate={{ x: 0 }}
      className="hidden md:flex flex-col w-20 lg:w-64 h-screen bg-[#0a0a0a] border-r border-white/5 fixed left-0 top-0 z-50"
    >
      <div className="h-20 flex items-center justify-center border-b border-white/5">
        <Gamepad2 className="w-8 h-8 text-purple-500" />
        <span className="ml-3 font-bold text-xl hidden lg:block bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
          FLOWIGN
        </span>
      </div>

      <div className="flex-1 overflow-y-auto py-6 flex flex-col gap-1">
        <p className="px-6 text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] hidden lg:block mb-4">
          Your Communities
        </p>
        
        {session.user?.communities?.map((comm, index) => (
          <button
            key={index}
            onClick={() => onSelectCommunity(comm)}
            className="group flex items-center gap-3 px-4 lg:px-6 py-3 hover:bg-purple-600/10 transition-all border-l-2 border-transparent hover:border-purple-500"
          >
            <Hash size={18} className="text-gray-500 group-hover:text-purple-400" />
            <span className="text-sm font-medium text-gray-400 group-hover:text-white hidden lg:block capitalize">
              {comm} 
            </span>
          </button>
        ))}
      </div>

      <div className="p-4 border-t border-white/5">
        <div className="flex items-center gap-3 bg-[#111] p-2 rounded-xl border border-white/5">
          <img 
            src={`https://ui-avatars.com/api/?name=${session.user?.userName}&background=a855f7&color=fff`} 
            alt="User" 
            className="w-8 h-8 rounded-full border border-purple-500/50"
          />
          <div className="hidden lg:block overflow-hidden">
            <p className="text-xs font-bold text-white truncate">{session.user?.userName}</p>
            <p className="text-[9px] text-purple-400 font-bold uppercase">Pro Player</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Sidebar;