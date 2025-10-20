import React from "react";

const StatsInfoCard = ({ icon, label, value, color = "bg-primary" }) => {
  return (
    <div className="flex items-center gap-4 bg-white p-4 rounded-xl shadow-md border border-gray-100 z-10 min-w-[220px]">
      <div className={`w-12 h-12 flex items-center justify-center text-white rounded-full drop-shadow-md ${color}`}>
        {icon}
      </div>
      <div className="flex flex-col">
        <span className="text-xs text-gray-400">{label}</span>
        <strong className="text-lg">USD {value}</strong>
      </div>
    </div>
  );
};

export default StatsInfoCard;
