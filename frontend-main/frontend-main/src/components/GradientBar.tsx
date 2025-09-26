import React from "react";
import classNames from "clsx";

type Gradient = "red_to_green" | "green_to_red" | "not_defined";
type Direction = "horizontal" | "vertical";

interface GradientBarProps {
  gradient: Gradient;
  direction: Direction;
}

export const GradientBar: React.FC<GradientBarProps> = ({
  gradient,
  direction,
}) => {
  if (gradient === "not_defined") {
    return;
  }

  const getGradientClass = () => {
    if (direction === "horizontal") {
      return gradient === "red_to_green"
        ? "bg-gradient-to-r from-red-500 to-green-500"
        : "bg-gradient-to-r from-green-500 to-red-500";
    } else {
      return gradient === "red_to_green"
        ? "bg-gradient-to-b from-red-500 to-green-500"
        : "bg-gradient-to-b from-green-500 to-red-500";
    }
  };

  const containerClass = classNames("rounded-md", {
    "w-full h-3": direction === "horizontal",
    "w-3 h-full": direction === "vertical",
  });

  return <div className={`${containerClass} ${getGradientClass()}`} />;
};
