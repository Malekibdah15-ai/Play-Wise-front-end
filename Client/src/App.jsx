import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Landing from './components/view/Landing'
import Navbar from './components/view/NavBar'
import Auth from './components/view/Auth'
import { Routes , Route } from 'react-router-dom'
import Home from './components/view/Home'
import MainLan from './components/view/MainLan'


const App = () => {
  const [currentView, setCurrentView] = useState('landing');

  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-purple-500/30 overflow-x-hidden">
      <Routes>
        <Route path="/" element={<MainLan />} />
        <Route path="/Home" element={<Home />} />
      </Routes>
    </div>
  );
};

export default App;