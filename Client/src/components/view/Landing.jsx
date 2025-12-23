import { useState } from "react";


const Landing = () => {
    const [user,setUser] = useState({});
  return (
    <div className="landing-container">
      <h1 className="text-4xl font-bold text-center mb-4">Welcome to Play-Wise</h1>
      <p className="text-lg text-center">Your gateway to a world of games and fun!</p>
    </div>
  );
}

export default Landing; 