import { useState } from "react";
import Navbar from "./NavBar";
import Auth from "./Auth";
import Landing from "./Landing";



const MainLan = () => {
    const [currentView, setCurrentView] = useState('landing');
    return (<>
        <Navbar currentView={currentView} onViewChange={setCurrentView} />

        {currentView === 'landing' && <Landing onViewChange={setCurrentView} />}
        {(currentView === 'login' || currentView === 'register') && (
            <Auth initialMode={currentView} onViewChange={setCurrentView} />
        )}
    </>)
}
export default MainLan;