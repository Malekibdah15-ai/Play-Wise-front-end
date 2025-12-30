import { useState } from 'react'
import './App.css'
import { Routes, Route } from 'react-router-dom'
import Home from './components/view/Home'
import MainLan from './components/view/MainLan'
import { useSession } from './context/SessionContext'
import JoinHub from './components/view/JoinHub'
import ProtectedRoute from './components/view/ProtectedRoute'
import AiMatchmaker from './components/view/AiMatchmaker'

const App = () => {
  const [currentView, setCurrentView] = useState('landing');
  const { session } = useSession();
  
return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-purple-500/30 overflow-x-hidden">
      <Routes>
        {!session.isAuthenticated ? (<Route path="/" element={<MainLan />} />) 
        : (<>
            <Route path="/Mes" element={<JoinHub />} />
            <Route path="/home" element={<Home />} />
            <Route path="*" element={<Home />} />
            <Route path="/ai" element={<AiMatchmaker />} />

          </>)}
        {!session.isAuthenticated && (
           <Route path="*" element={<MainLan />} />
        )}
        
      </Routes>
    </div>
  );
};
  

export default App;