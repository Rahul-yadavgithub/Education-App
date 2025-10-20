import React from "react";
import { LuTrendingUpDown } from "react-icons/lu";
import StatsInfoCard from "../Commans/StatsInfoCard";
import card_2 from "../../assets/Image/card.png";

const AuthLayOut = ({ children }) => {
  return (
    <div className="min-h-screen flex bg-white">
      {/* ---------- Left column: Signup + header ---------- */}
      <div className="w-full md:w-1/2 px-8 py-8 flex flex-col relative z-20">
        <header className="mb-6">
          <h2 className="text-3xl font-extrabold text-purple-600">
            Expense Tracker
          </h2>
        </header>

        <main className="flex-1 flex items-center justify-center">
          {children}
        </main>

        <footer className="text-xs text-gray-400 mt-6">
          © {new Date().getFullYear()} Your Company
        </footer>
      </div>

      {/* ---------- Right visual panel ---------- */}
      <div className="hidden md:flex md:w-1/2 items-center justify-center relative overflow-hidden bg-gradient-to-br from-purple-50 to-violet-50">
        {/* softly glowing shapes for depth */}
        <div className="absolute -left-24 -top-24 w-96 h-96 rounded-[50px] bg-purple-400 opacity-20 blur-3xl rotate-12"></div>
        <div className="absolute right-0 top-1/4 w-40 h-64 rounded-[40px] border-8 border-fuchsia-500 opacity-20 translate-x-12 rotate-6"></div>
        <div className="absolute -right-32 bottom-0 w-96 h-96 rounded-[50px] bg-violet-500 opacity-20 blur-2xl -rotate-6"></div>

        {/* ======= Full-height chart image ======= */}
        <img
          src={card_2}
          alt="chart"
          className="
            absolute inset-0
            w-full h-full object-contain
            drop-shadow-2xl
            transform hover:scale-105 transition-transform duration-700
          "
        />

        {/* ======= Floating USD card – upper-center ======= */}
        <div
          className="
            absolute
            top-1  /* position about 20% from the top */
            left-1/2  /* horizontal center */
            -translate-x-1/2
            -translate-y-1
            z-30
          "
        >
          <StatsInfoCard
            icon={<LuTrendingUpDown />}
            label="Track Your Income & Expenses Easily"
            value="USD 430,000"
            color="bg-gradient-to-br from-purple-600 to-violet-500"
          />
        </div>
      </div>
    </div>
  );
};

export default AuthLayOut;
