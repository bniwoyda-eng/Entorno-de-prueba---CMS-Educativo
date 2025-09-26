import clsx from "clsx";
import { Bookmark, Check, ChevronsLeft, ChevronsRight, Pencil } from "lucide-react";

const iconsMap: Record<string, React.ReactNode> = {
  save: <Bookmark className="h-4" />,
  chevronsLeft: <ChevronsLeft className="h-4" />,
  chevronsRight: <ChevronsRight className="h-4" />,
  check: <Check className="h-4" />,
  edit: <Pencil className="h-4" />,
};

interface ButtonProps {
  icon?: string;
  iconSide?: "left" | "right";
  text: string;
  transparent?: boolean;
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
}

export const Button = ({
  icon,
  iconSide = "left",
  text,
  transparent = false,
  onClick,
  className,
  disabled = false,
}: ButtonProps) => {
  const IconComponent = icon ? iconsMap[icon] : null;

  return (
    <button
      className={clsx(
        "rounded-lg py-1 px-6 flex items-center justify-center border-2 border-main-400 hover:border-main-300 active:border-main-500 ",
        transparent
          ? "text-main-400 hover:text-main-300 active:text-main-500"
          : "text-white bg-main-400 hover:bg-main-300 active:bg-main-500",
        disabled && "opacity-50 cursor-not-allowed pointer-events-none",
        className
      )}
      onClick={onClick}
      disabled={disabled}
    >
      {iconSide === "left" && IconComponent}
      <span className="mx-2">{text}</span>
      {iconSide === "right" && IconComponent}
    </button>
  );
};
