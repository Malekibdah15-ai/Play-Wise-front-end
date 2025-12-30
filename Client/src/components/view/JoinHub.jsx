import React, { useState, useEffect, useRef } from "react";
import socket from "../../socket";
import axios from "axios";
import { useSession } from "../../context/SessionContext";

const JoinHub = () => {
    const [genres, setGenres] = useState([]);
    const [activeGenre, setActiveGenre] = useState(null);
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const { session } = useSession();
    const messagesEndRef = useRef(null);

    // 1️⃣ Profanity filter (manual list)
    const bannedWords = ["shit", "fuck", "bitch", "asshole", "damn"];
    const filterMessage = (message) => {
        let clean = message;
        bannedWords.forEach(word => {
            const regex = new RegExp(`\\b${word}\\b`, "gi");
            clean = clean.replace(regex, "***");
        });
        return clean;
    };

    // 2️⃣ Scroll to bottom on new messages
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    // 3️⃣ Fetch genres on load
    useEffect(() => {
        const fetchGenres = async () => {
            try {
                const res = await axios.get("http://localhost:8000/api/Gener");
                setGenres(res.data);
            } catch (err) {
                console.error("Error fetching genres:", err);
            }
        };
        fetchGenres();
    }, []);

    // 4️⃣ Sync user communities on login
    useEffect(() => {
        const userComms = session.user?.communities;
        if (userComms && userComms.length > 0) {
            socket.emit("sync-my-communities", userComms);
        }
    }, [session.user]);

    // 5️⃣ Message listener
    useEffect(() => {
        const handleMessage = (newMessage) => {
            if (newMessage.genre === activeGenre) {
                setMessages((prev) => [...prev, newMessage]);
            }
        };
        socket.on("receive-message", handleMessage);
        return () => socket.off("receive-message", handleMessage);
    }, [activeGenre]);

    // 6️⃣ Join a community hub
    const joinHub = async (genreSlug) => {
        socket.emit("join-community", {
            genreName: genreSlug,
            userId: session.user._id
        });
        setActiveGenre(genreSlug);

        // Fetch chat history
        try {
            const res = await axios.get(`http://localhost:8000/api/messages/${genreSlug}`);
            setMessages(res.data);
        } catch (err) {
            console.error("History fetch failed", err);
            setMessages([]);
        }
    };

    // 7️⃣ Send message with filter
    const sendMessage = (e) => {
        e.preventDefault();
        if (!input.trim() || !activeGenre) return;

        const cleanMessage = filterMessage(input.trim());

        const messageData = {
            genre: activeGenre,
            content: cleanMessage,
            user_id: session.user?._id || "Guest"
        };

        socket.emit("send-message", messageData);
        setInput("");
    };

    return (
        <div className="community-layout" style={{ display: 'flex', minHeight: '80vh' }}>
            {/* Sidebar */}
            <div className="sidebar" style={{ width: '220px', borderRight: '1px solid #ccc', padding: '20px' }}>
                <h2 className="text-xl font-bold mb-4">Gaming Hubs</h2>
                {genres.map(genre => (
                    <div key={genre.slug} className="genre-card mb-3 flex justify-between items-center">
                        <div>
                            <span className="font-medium">{genre.name}</span>
                            <small className="text-gray-500 ml-2">({genre.memberCount || 0} members)</small>
                        </div>
                        <button
                            onClick={() => joinHub(genre.slug)}
                            className={`px-3 py-1 rounded-md font-semibold transition ${
                                activeGenre === genre.slug ? 'bg-purple-600 text-white' : 'bg-gray-200 text-black'
                            }`}
                        >
                            {activeGenre === genre.slug ? "Viewing" : "Join"}
                        </button>
                    </div>
                ))}
            </div>

            {/* Chat Window */}
            <div className="chat-window" style={{ flex: 1, padding: '20px', display: 'flex', flexDirection: 'column' }}>
                {activeGenre ? (
                    <>
                        <h3 className="text-lg font-bold mb-4">Room: {activeGenre}</h3>
                        <div
                            className="messages flex-1 overflow-y-auto p-4 border border-gray-300 rounded-md mb-4"
                            style={{ background: '#111', color: '#fff' }}
                        >
                            {messages.map((m, i) => (
                                <div key={m._id || i} className="mb-2">
                                    <b>{m.sender?.userName || "User"}:</b> {m.content}
                                </div>
                            ))}
                            <div ref={messagesEndRef} />
                        </div>

                        <form onSubmit={sendMessage} className="flex gap-2">
                            <input
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder="Type your message..."
                                className="flex-1 px-4 py-2 rounded-md bg-gray-900 text-white outline-none border border-gray-700"
                            />
                            <button
                                type="submit"
                                className="px-4 py-2 bg-purple-600 text-white rounded-md font-bold hover:bg-purple-500 transition"
                            >
                                Send
                            </button>
                        </form>
                    </>
                ) : (
                    <p className="text-gray-400">Select a genre to start chatting</p>
                )}
            </div>
        </div>
    );
};

export default JoinHub;
