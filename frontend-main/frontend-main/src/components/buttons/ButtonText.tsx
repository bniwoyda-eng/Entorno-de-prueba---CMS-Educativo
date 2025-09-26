import clsx from "clsx";

interface Props {
  text: string;
  disabled?: boolean;
  icon?: React.ReactNode;
  iconSide?: "left" | "right";
  onClick?: () => void;
  className?: string;
}

export const ButtonText = ({
  text,
  disabled = false,
  icon,
  iconSide,
  onClick,
  className = "",
}: Props) => {
  return (
    <button
      title={text}
      onClick={onClick}
      disabled={disabled}
      className={clsx(
        "flex justify-center items-center gap-2 px-4 text-main-400 hover:text-main-400 disabled:text-gray-400",
        className
      )}
    >
      {iconSide === "left" && icon}
      <span>{text}</span>
      {iconSide === "right" && icon}
    </button>
  );
};
