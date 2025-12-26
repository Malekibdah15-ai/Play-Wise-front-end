import { Menu } from 'lucide-react';

const Navbar = ({ currentView, onViewChange }) => {
    return (
        <nav className="flex border-b border-white/10 items-center justify-between px-6 py-5 max-w-7xl mx-auto w-full backdrop-blur-sm sticky top-0 z-50 bg-black/50">
            <div 
                className="flex items-center gap-3 cursor-pointer group"
                onClick={() => onViewChange('landing')}
            >
                <div className={"bg-gradient-to-br from-indigo-500 to-purple-600 p-2 rounded-xl shadow-[0_0_20px_rgba(139,92,246,0.4)] transition-transform group-hover:scale-105"}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 text-white"><rect width="20" height="12" x="2" y="6" rx="2" /><circle cx="8" cy="12" r="2" /><circle cx="16" cy="12" r="2" /></svg>
                </div>
                <span className="text-xl font-bold tracking-tight text-white group-hover:text-purple-400 transition-colors">Play wise</span>
            </div>

            <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-400">
                <button onClick={() => onViewChange('landing')} className="hover:text-white transition-colors">Who we are</button>
                <button onClick={() => onViewChange('landing')} className="hover:text-white transition-colors">About us</button>
                <button onClick={() => onViewChange('landing')} className="hover:text-white transition-colors">Community</button>
                
                {/* Auth Buttons */}
                {currentView === 'landing' && (
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
                )}
            </div>

            {/* Mobile Menu Icon */}
            <div className="md:hidden">
                <Menu className="w-6 h-6 text-gray-300" />
            </div>
        </nav>
    );
};

export default Navbar;