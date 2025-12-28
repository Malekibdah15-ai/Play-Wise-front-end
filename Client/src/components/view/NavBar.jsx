import { useNavigate } from 'react-router-dom';
import { useSession } from '../../context/SessionContext';

const Navbar = ({ currentView, onViewChange }) => {
    const { session,logout } = useSession();

    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        onViewChange('landing');
        navigate('/');
    };

    return (
        <nav className="flex border-b border-white/10 items-center justify-between px-6 py-5 max-w-7xl mx-auto w-full backdrop-blur-sm sticky top-0 z-50 bg-black/50">
            {currentView === 'Home' && (
                <div 
                className="flex items-center gap-3 cursor-pointer group"
                onClick={() => onViewChange('Home')}
            >
                <div className={"bg-gradient-to-br from-indigo-500 to-purple-600 p-2 rounded-xl shadow-[0_0_20px_rgba(139,92,246,0.4)] transition-transform group-hover:scale-105"}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 text-white">
                        <rect width="20" height="12" x="2" y="6" rx="2" />
                        <circle cx="8" cy="12" r="2" />
                        <circle cx="16" cy="12" r="2" />
                    </svg>
                </div>
                
                <span className="text-xl font-bold tracking-tight text-white group-hover:text-purple-400 transition-colors">Play wise</span>
            </div>
            )}
            {currentView !== 'Home' && (
            <div 
                className="flex items-center gap-3 cursor-pointer group"
                onClick={() => onViewChange('landing')}
            >
                <div className={"bg-gradient-to-br from-indigo-500 to-purple-600 p-2 rounded-xl shadow-[0_0_20px_rgba(139,92,246,0.4)] transition-transform group-hover:scale-105"}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 text-white">
                        <rect width="20" height="12" x="2" y="6" rx="2" />
                        <circle cx="8" cy="12" r="2" />
                        <circle cx="16" cy="12" r="2" />
                    </svg>
                </div>
                
                <span className="text-xl font-bold tracking-tight text-white group-hover:text-purple-400 transition-colors">Play wise</span>
            </div>
        )}
            <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-400">
                {/* Show only on landing */}
                {currentView === 'landing' ? (
                    <div className="flex items-center gap-4 ml-4">
                        <button 
                            onClick={() => onViewChange('login')}
                            className="text-white hover:text-purple-400 transition-colors"
                        >
                            Log in
                        </button>
                        <button 
                            onClick={() => onViewChange('register')}
                            className="bg-white text-black px-5 py-2 rounded-full font-semibold hover:bg-gray-200 transition-colors"
                        >
                            Sign Up
                        </button>
                    </div>
                ) : (
                    !['login', 'register'].includes(currentView) && (
                        <button 
                            onClick={handleLogout}
                            className="flex items-center gap-2 border border-white/20 text-white px-4 py-2 rounded-lg hover:bg-red-500/10 hover:border-red-500/50 transition-all"
                        >
                            <span>Logout</span>
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                                <polyline points="16 17 21 12 16 7" />
                                <line x1="21" y1="12" x2="9" y2="12" />
                            </svg>
                        </button>
                    )
                )}
            </div>
        </nav>
    );
};

export default Navbar;