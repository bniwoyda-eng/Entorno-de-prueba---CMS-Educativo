import React from "react";
import { useNavigate } from "react-router-dom";

interface CardGameProps {
  to: string;
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  bgColor?: string;
}

export const CardGame = ({
  to,
  icon,
  title,
  subtitle,
  bgColor,
}: CardGameProps) => {
  const navigate = useNavigate();

  const handleNavigate = () => {
    navigate(to);
  };
  return (
    <div
      className="flex flex-col justify-between h-[245px] rounded-[15px] p-5 flex-grow min-w-[250px]"
      style={{ backgroundColor: bgColor }}
    >
      <div className="flex flex-col items-center gap-2 mt-4">
        <div className="h-16">{icon}</div>
        <div className="text-center">
          <h2 className="text-base font-medium">{title}</h2>
          <p className="text-xs truncate max-w-[180px] ">{subtitle}</p>
        </div>
      </div>
      <button
        className="w-full h-[31px] py-[5px] bg-white text-sm rounded-[8px] shadow-md"
        onClick={handleNavigate}
      >
        Start
      </button>
    </div>
  );
};
