import clsx from "clsx";

interface ProgressBarProps {
  percentage: number;
  bgGray?: boolean;
}

export const ProgressBar = ({ percentage, bgGray = false }: ProgressBarProps) => {
  const clampedPercentage = Math.min(Math.max(percentage, 0), 100);
  return (
    <div className={clsx("w-full rounded-full overflow-hidden", bgGray ? "bg-gray-300" : "bg-white")}>
      <div
        className={`h-[5px] text-cente bg-gradient-to-r rounded-full from-main-200 to-main-500`}
        style={{
          width: `${clampedPercentage}%`,
        }}
      ></div>
    </div>
  );
};
