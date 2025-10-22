// src/Components/LayOuts/AuthLayout.jsx
import React, { useRef, useEffect, useState } from "react";
import { motion, useMotionValue, useTransform } from "framer-motion";
import card_2 from "../../assets/Image/Stuedent.jpg";

const AuthLayout = ({ children, backgroundImage = card_2 }) => {
  const containerRef = useRef(null);
  const [centerPos, setCenterPos] = useState({ x: 0, y: 0 });

  // Track mouse position relative to container
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Opacity transform: closer to center = lower opacity (softer), farther = more visible
  const opacity = useTransform([mouseX, mouseY], ([x, y]) => {
    const dx = x - centerPos.x;
    const dy = y - centerPos.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    const maxDist = Math.sqrt(window.innerWidth ** 2 + window.innerHeight ** 2) / 2;
    return Math.max(0.3, 1 - dist / maxDist);
  });

  useEffect(() => {
    const rect = containerRef.current.getBoundingClientRect();
    setCenterPos({
      x: rect.left + rect.width / 2,
      y: rect.top + rect.height / 2,
    });
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-gray-100"
      onMouseMove={(e) => {
        mouseX.set(e.clientX);
        mouseY.set(e.clientY);
      }}
    >
      {/* Background Image */}
      <motion.img
        src={backgroundImage}
        alt="background"
        className="absolute top-0 left-0 w-full h-full object-cover z-0"
        style={{ opacity }}
      />

      {/* Radial overlay to focus on center */}
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-radial from-white/70 to-transparent z-10 pointer-events-none"></div>

      {/* Floating decorative shapes */}
      <div className="absolute w-96 h-96 rounded-full bg-purple-400 opacity-20 blur-3xl animate-pulse top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute -left-24 -top-24 w-72 h-72 rounded-full bg-indigo-300 opacity-30 blur-2xl rotate-12"></div>
      <div className="absolute right-0 top-1/4 w-40 h-64 rounded-[40px] border-8 border-pink-400 opacity-20 translate-x-12 rotate-6"></div>
      <div className="absolute -right-32 bottom-0 w-96 h-96 rounded-[50px] bg-violet-500 opacity-20 blur-2xl -rotate-6"></div>

      {/* Centered form container */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative z-20 w-full max-w-md px-8 py-12 bg-white/90 backdrop-blur-md rounded-2xl shadow-2xl flex flex-col"
      >
        <header className="mb-6 text-center">
          <h1 className="text-4xl font-bold text-purple-600">EduConnect</h1>
          <p className="text-gray-500 mt-1">Login to your account</p>
        </header>

        <main className="flex-1 flex flex-col justify-center">{children}</main>

        <footer className="mt-6 text-center text-sm text-gray-400">
          © {new Date().getFullYear()} EduConnect
        </footer>
      </motion.div>
    </div>
  );
};

export default AuthLayout;
