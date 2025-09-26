import React from "react";

interface Props {
  text: string;
  icon: React.ReactNode;
  className?: string;
}

export const CardItem = ({ text, icon, className }: Props) => {
  return (
    <div
      className={`w-full bg-transparent flex items-center gap-3 text-start ${className}`}
    >
      {icon && (
        <div className="bg-main-400 rounded-xl w-10 h-10 grid place-items-center text-white p-2 shrink-0">
          {icon}
        </div>
      )}
      <p className="line-clamp-1 flex-1 min-w-0">{text}</p>
    </div>
  );
};
