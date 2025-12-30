import { motion } from "framer-motion";
import { useState } from "react";

const AnimatedBackground = () => {
  return (
    <div className="absolute inset-0 overflow-hidden z-0 pointer-events-none">

      {/* Purple blob */}
      <motion.div
        animate={{
          x: [0, 100, 0],
          y: [0, 60, 0],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute top-[-20%] left-[-20%] w-[500px] h-[500px] bg-purple-600/30 rounded-full blur-3xl"
      />

      {/* Pink blob */}
      <motion.div
        animate={{
          x: [0, -80, 0],
          y: [0, -40, 0],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute bottom-[-20%] right-[-20%] w-[450px] h-[450px] bg-pink-600/20 rounded-full blur-3xl"
      />

      {/* Orange glow */}
      <motion.div
        animate={{
          opacity: [0.3, 0.6, 0.3],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute top-1/3 left-1/2 w-[300px] h-[300px] bg-orange-500/20 rounded-full blur-3xl"
      />
    </div>
  );
};
export default AnimatedBackground;