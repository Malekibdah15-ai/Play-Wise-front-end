import React, { useState, useEffect } from 'react';
import socket from '../../socket';
import axios from 'axios';
import { useSession } from '../../context/SessionContext';

const JoinHub = () => {
    const [genres, setGenres] = useState([]);
    const [activeGenre, setActiveGenre] = useState(null);
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const { session } = useSession();

    // 1. Fetching Genres on Load
    useEffect(() => {
        const fetchGenres = async () => {
            try {
                const res = await axios.get('http://localhost:8000/api/Gener');
                setGenres(res.data);
            } catch (err) {
                console.error("Error fetching genres:", err);
            }
        };
        fetchGenres();
    }, []);

    // 2. Auto-Sync all joined communities on login
    useEffect(() => {
        const userComms = session.user?.communities;
        if (userComms && userComms.length > 0) {
            socket.emit("sync-my-communities", userComms);
        }
    }, [session.user]);

    // 3. Message Listener (Corrected with activeGenre dependency)
    useEffect(() => {
        const handleMessage = (newMessage) => {
            if (newMessage.genre === activeGenre) {
                setMessages((prev) => [...prev, newMessage]);
            }
        };

        socket.on("receive-message", handleMessage(newMessage));
        return () => socket.off("receive-message", handleMessage);
    }, [activeGenre]);

    // 4. Join Function (Now with History Fetching!)
    const joinHub = async (genreSlug) => {
        socket.emit("join-community", {
            genreName: genreSlug,
            userId: session.user._id
        });
        setActiveGenre(genreSlug);
        // Fetch history so the chat isn't empty
        try {
            const res = await axios.get(`http://localhost:8000/api/messages/${genreSlug}`);
            setMessages(res.data);
        } catch (err) {
            console.error("History fetch failed", err);
            setMessages([]);
        }
    };

    const sendMessage = (e) => {
        e.preventDefault();
        if (!input.trim() || !activeGenre) return;

        const messageData = {
            genre: activeGenre,
            content: input,
            user_id: session.user?._id || "Guest"
        };

        socket.emit("send-message", messageData);
        setInput("");
    };

    return (
        <div className="community-layout" style={{ display: 'flex' }}>
            <div className="sidebar" style={{ width: '200px', borderRight: '1px solid #ccc' }}>
                <h2>Gaming Hubs</h2>
                {genres.map(genre => (
                    <div key={genre.slug} className="genre-card">
                        <span>{genre.name}</span>
                        {/* Show the count here */}
                        <small style={{ color: 'gray', marginLeft: '10px' }}>
                            ({genre.memberCount || 0} members)
                        </small>
                        <button onClick={() => joinHub(genre.slug)}>
                            {activeGenre === genre.slug ? "Viewing" : "Join"}
                        </button>
                    </div>
                ))}
            </div>

            <div className="chat-window" style={{ flex: 1, padding: '20px' }}>
                {activeGenre ? (
                    <>
                        <h3>Room: {activeGenre}</h3>
                        <div className="messages" style={{ height: '400px', overflowY: 'auto', border: '1px solid #000', padding: '10px' }}>
                            {messages.map((m, i) => (
                                <div key={m._id || i}>
                                    {/* Backend sends sender.userName now! */}
                                    <b>{m.sender?.userName || "User"}:</b> {m.content}
                                </div>
                            ))}
                        </div>
                        <form onSubmit={sendMessage} style={{ marginTop: '10px' }}>
                            <input
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                style={{ width: '80%' }}
                            />
                            <button type="submit">Send</button>
                        </form>
                    </>
                ) : (
                    <p>Select a genre to start chatting</p>
                )}
            </div>
        </div>
    );
};

export default JoinHub;