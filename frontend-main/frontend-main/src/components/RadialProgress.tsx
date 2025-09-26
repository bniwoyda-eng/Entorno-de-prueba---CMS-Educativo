import React, { useEffect, useState } from "react";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

interface RadialProgressProps {
  value: number; // por ejemplo: 70
  label: string; // por ejemplo: "Activities"
  displayValue: string; // por ejemplo: "70%" o "7.5 h"
  color: string; // por ejemplo: "#ef4444" (red-500), "#6366f1" (indigo-500)
}

export const RadialProgress: React.FC<RadialProgressProps> = ({
  value,
  label,
  displayValue,
  color,
}) => {
  const [progress, setProgress] = useState(0);

  // Animar el progreso en montaje
  useEffect(() => {
    let start = 0;
    const duration = 700; // ms
    const step = 10; // ms por frame
    const increment = value / (duration / step);

    const interval = setInterval(() => {
      start += increment;
      if (start >= value) {
        setProgress(value);
        clearInterval(interval);
      } else {
        setProgress(start);
      }
    }, step);

    return () => clearInterval(interval);
  }, [value]);

  return (
    <div className="flex flex-col items-center justify-center w-24 sm:w-28 md:w-32">
      <div className="w-full aspect-square">
        <CircularProgressbar
          value={progress}
          text={displayValue}
          strokeWidth={6}
          styles={buildStyles({
            pathColor: color,
            trailColor: "#e5e7eb",
            textColor: "#111827",
            textSize: "12px",
            pathTransition: "none", // Desactivamos animación por defecto
          })}
        />
      </div>
      <div className="mt-2 text-center text-sm text-gray-600">{label}</div>
    </div>
  );
};
