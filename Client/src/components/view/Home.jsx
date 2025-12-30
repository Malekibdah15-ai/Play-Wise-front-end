import React, { useState, useEffect } from "react";
import { Search, Tag, Play, ExternalLink, Info, MessageSquare, ArrowLeft } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Skeleton, Box } from "@mui/material";
import Sidebar from "./SideBar";
import DailyChallenges from "./DailyChallenges";
import NewsSection from "./NewsSection";
import Navbar from "./NavBar";
import axios from "axios";
import socket from "../../socket";
import { useSession } from "../../context/SessionContext";

const Home = () => {
    const { session } = useSession();
    const [view, setView] = useState("Home");
    const [activeGenre, setActiveGenre] = useState(null);
    const [query, setQuery] = useState("");
    const [recommendations, setRecommendations] = useState([]);
    const [analysisSummary, setAnalysisSummary] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    // Chat States
    const [messages, setMessages] = useState([]);
    const [chatInput, setChatInput] = useState("");

    // 1. Sync communities on login/mount
    useEffect(() => {
        if (session.user?.communities) {
            socket.emit("sync-my-communities", session.user.communities);
        }
    }, [session.user]);

    // 2. Chat Message Listener
    useEffect(() => {
        const handleMessage = (newMessage) => {
            if (newMessage.genre === activeGenre) {
                setMessages((prev) => [...prev, newMessage]);
            }
        };
        socket.on("receive-message", handleMessage);
        return () => socket.off("receive-message", handleMessage);
    }, [activeGenre]);

    const handleSearch = async (e) => {
        if (e) e.preventDefault();
        if (!query.trim()) return;

        setLoading(true);
        setError("");
        setView("Home");

        try {
            const res = await axios.post("http://localhost:8000/api/ai/recommend", {
                userInput: query,
            });
            setRecommendations(res.data.games || []);
            setAnalysisSummary(res.data.analysis_summary || "");
        } catch (err) {
            setError("Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const joinHub = async (genreSlug) => {
        socket.emit("join-community", {
            genreName: genreSlug,
            userId: session.user?._id
        });
        setActiveGenre(genreSlug);
        setView("Chat");

        try {
            const res = await axios.get(`http://localhost:8000/api/messages/${genreSlug}`);
            setMessages(res.data);
        } catch (err) {
            console.error("History fetch failed", err);
            setMessages([]);
        }
    };

    const sendChatMessage = (e) => {
        e.preventDefault();
        if (!chatInput.trim() || !activeGenre) return;

        const messageData = {
            genre: activeGenre,
            content: chatInput,
            user_id: session.user?._id || "Guest"
        };

        socket.emit("send-message", messageData);
        setChatInput("");
    };

    const formatTrailerUrl = (url) => {
        if (!url) return "";
        if (url.includes("watch?v=")) return url.replace("watch?v=", "embed/");
        return url;
    };

    return (
        <div className="min-h-screen bg-[#050505] text-white font-sans selection:bg-purple-500/30">
            {/* Sidebar with the Logo separated from the community action */}
            <Sidebar onSelectCommunity={(comm) => joinHub(comm)} />

            <div className="md:pl-20 lg:pl-64 transition-all duration-300 relative">

                <Navbar disabled currentView={view} onViewChange={setView} />

                <main className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10 pt-12 pb-20">

                    {view === "Home" ? (
                        <>
                            <header className="relative flex flex-col items-center text-center mb-20">
                                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-80 bg-purple-600/10 blur-[120px] -z-10 rounded-full" />
                                <motion.h1
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="text-5xl md:text-7xl lg:text-8xl font-black mb-8 tracking-tighter leading-tight"
                                >
                                    FIND YOUR NEXT <br />
                                    <span className="bg-gradient-to-r from-purple-400 via-pink-500 to-orange-400 bg-clip-text text-transparent">
                                        OBSESSION.
                                    </span>
                                </motion.h1>

                                <form onSubmit={handleSearch} className="relative w-full max-w-3xl z-10">
                                    <div className="group flex flex-col sm:flex-row items-center bg-white/5 backdrop-blur-xl border border-white/10 focus-within:border-purple-500/50 rounded-2xl sm:rounded-full p-2 transition-all">
                                        <div className="hidden sm:flex pl-6 pr-3 text-gray-400"><Search size={22} /></div>
                                        <input
                                            type="text"
                                            placeholder="e.g. 'A cozy farming sim with a dark twist'..."
                                            value={query}
                                            onChange={(e) => setQuery(e.target.value)}
                                            className="bg-transparent outline-none flex-1 text-white h-14 px-4 sm:px-0 text-lg placeholder:text-gray-500 w-full"
                                        />
                                        <button type="submit" disabled={loading} className="w-full sm:w-auto bg-purple-600 hover:bg-purple-500 text-white px-8 h-12 rounded-xl sm:rounded-full font-bold transition-all active:scale-95 disabled:opacity-50">
                                            {loading ? "Searching..." : "Explore"}
                                        </button>
                                    </div>
                                </form>
                            </header>

                            {/* RESULTS AREA */}
                            <div className="mb-20">
                                <AnimatePresence>
                                    {analysisSummary && !loading && (
                                        <motion.div
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: 'auto' }}
                                            className="mb-10 p-6 bg-gradient-to-br from-purple-900/20 to-transparent border border-purple-500/20 rounded-2xl"
                                        >
                                            <h4 className="flex items-center gap-2 text-purple-400 text-[10px] font-black uppercase mb-2 tracking-[0.2em]">
                                                <Info size={14} /> AI Analysis
                                            </h4>
                                            <p className="text-gray-300 text-base italic leading-relaxed font-medium">"{analysisSummary}"</p>
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                                {/* LOADING STATE (Skeleton) */}
                                {loading && (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                                        {[1, 2, 3].map((i) => (
                                            <Box key={i} sx={{ bgcolor: '#0F0F0F', p: 3, borderRadius: 6, border: '1px solid #1A1A1A' }}>
                                                <Skeleton variant="rectangular" height={200} sx={{ bgcolor: '#1A1A1A', borderRadius: 4, mb: 3 }} />
                                                <Skeleton variant="text" width="60%" height={32} sx={{ bgcolor: '#1A1A1A', mb: 1 }} />
                                                <Skeleton variant="text" width="90%" sx={{ bgcolor: '#1A1A1A' }} />
                                                <Skeleton variant="rectangular" height={50} sx={{ bgcolor: '#1A1A1A', mt: 4, borderRadius: 3 }} />
                                            </Box>
                                        ))}
                                    </div>
                                )}
                                {/* CARDS GRID */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                                    {recommendations.map((game, idx) => (
                                        <motion.div
                                            key={idx}
                                            initial={{ opacity: 0, y: 30 }}
                                            whileInView={{ opacity: 1, y: 0 }}
                                            viewport={{ once: true }}
                                            transition={{ delay: idx * 0.1 }}
                                            className="group bg-[#0F0F0F] border border-white/5 rounded-[2rem] overflow-hidden hover:border-purple-500/40 transition-all duration-500 flex flex-col hover:shadow-[0_0_40px_-10px_rgba(168,85,247,0.2)]"
                                        >
                                            <div className="aspect-video w-full bg-zinc-900 relative overflow-hidden">
                                                {game.trailer_url ? (
                                                    <iframe
                                                        className="w-full h-full"
                                                        src={formatTrailerUrl(game.trailer_url)}
                                                        title={game.name}
                                                        frameBorder="0"
                                                        allowFullScreen
                                                    />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center">
                                                        <Play className="text-white/10" size={56} />
                                                    </div>
                                                )}
                                            </div>

                                            <div className="p-8 flex flex-col flex-1">
                                                <div className="flex justify-between items-start mb-4">
                                                    <h3 className="text-2xl font-bold tracking-tight group-hover:text-purple-400 transition-colors line-clamp-1">{game.name}</h3>
                                                    <span className="shrink-0 bg-yellow-400/10 text-yellow-500 text-xs font-black px-2.5 py-1 rounded-lg">★ {game.rating}</span>
                                                </div>

                                                <div className="flex flex-wrap gap-2 mb-4">
                                                    <motion.button
                                                        whileHover={{ scale: 1.02, backgroundColor: "rgba(168, 85, 247, 0.15)" }}
                                                        whileTap={{ scale: 0.98 }}
                                                        onClick={() => joinHub(game.genre)}
                                                        className="group relative flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 hover:border-purple-500/50 transition-all duration-300 overflow-hidden"
                                                    >
                                                        {/* Glow Layer */}
                                                        <div className="absolute inset-0 bg-gradient-to-r from-purple-600/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />


                                                        <div className="relative flex items-center justify-center">
                                                            <Tag size={13} className="text-purple-500 z-10" />
                                                            <span className="absolute inset-0 animate-ping bg-purple-500/20 rounded-full" />
                                                        </div>

                                                        <div className="flex flex-col items-start leading-tight relative z-10">
                                                            <span className="text-[10px] font-bold uppercase tracking-tight text-gray-200">
                                                                {session.user?.communities?.includes(game.genre)
                                                                    ? "Enter Community"
                                                                    : `Join ${game.genre} Hub`}
                                                            </span>
                                                        </div>


                                                        <motion.div
                                                            initial={{ opacity: 0, x: -3 }}
                                                            whileHover={{ opacity: 1, x: 0 }}
                                                            className="text-purple-400 border-l border-white/10 pl-1.5 ml-0.5"
                                                        >
                                                            <MessageSquare size={11} />
                                                        </motion.div>
                                                    </motion.button>
                                                </div>

                                                <p className="text-gray-400 text-sm mb-6 line-clamp-3">{game.description}</p>

                                                <div className="mt-auto space-y-4">
                                                    <div className="p-4 bg-white/[0.03] rounded-2xl border border-white/5 flex gap-3">
                                                        <Info size={16} className="text-purple-500 shrink-0 mt-0.5" />
                                                        <p className="text-xs text-gray-400 italic leading-snug">{game.detales}</p>
                                                    </div>

                                                    {game.best_deals?.[0] && (
                                                        <div className="flex items-center justify-between p-2 pl-5 bg-white/5 rounded-2xl border border-white/10">
                                                            <div>
                                                                <p className="text-[10px] text-gray-500 uppercase font-black">{game.best_deals[0].store_name}</p>
                                                                <p className="text-xl font-black text-green-400">{game.best_deals[0].price}</p>
                                                            </div>
                                                            <a href={game.best_deals[0].url} target="_blank" rel="noreferrer" className="bg-green-500 hover:bg-green-400 text-black h-12 px-6 rounded-xl font-black flex items-center gap-2">
                                                                GET <ExternalLink size={16} />
                                                            </a>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            </div>
                        </>
                    ) : (
                        /* CHAT VIEW */
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col h-[75vh] bg-[#0F0F0F] rounded-3xl border border-white/5 overflow-hidden">
                            <div className="p-6 border-b border-white/5 flex items-center justify-between bg-white/5">
                                <div className="flex items-center gap-4">
                                    <button onClick={() => setView("Home")} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                                        <ArrowLeft size={20} />
                                    </button>
                                    <div>
                                        <h2 className="text-xl font-bold text-purple-400 uppercase tracking-widest">{activeGenre} Hub</h2>
                                        <p className="text-xs text-gray-500">Live Community Discussion</p>
                                    </div>
                                </div>
                            </div>

                            <div className="flex-1 overflow-y-auto p-6 space-y-4">
                                {messages.map((m, i) => (
                                    <div key={m._id || i} className={`flex flex-col ${m.sender?._id === session.user._id ? "items-end" : "items-start"}`}>
                                        <span className="text-[10px] text-gray-500 mb-1 px-2">{m.sender?.userName || "User"}</span>
                                        <div className={`max-w-[70%] p-3 rounded-2xl ${m.sender?._id === session.user._id ? "bg-purple-600 text-white rounded-tr-none" : "bg-white/10 text-gray-200 rounded-tl-none"}`}>
                                            {m.content}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <form onSubmit={sendChatMessage} className="p-4 bg-white/5 border-t border-white/5 flex gap-2">
                                <input
                                    value={chatInput}
                                    onChange={(e) => setChatInput(e.target.value)}
                                    placeholder={`Message in #${activeGenre}...`}
                                    className="flex-1 bg-[#050505] border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-purple-500 transition-all"
                                />
                                <button type="submit" className="bg-purple-600 p-3 rounded-xl hover:bg-purple-500 transition-all">
                                    <MessageSquare size={20} />
                                </button>
                            </form>
                        </motion.div>
                    )}


                    {/* This is the section for News and Daily Challenges */}
                    <hr className="border-white/5 mb-20" />
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                        <div className="lg:col-span-8"><NewsSection /></div>
                        <div className="lg:col-span-4"><DailyChallenges /></div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default Home;