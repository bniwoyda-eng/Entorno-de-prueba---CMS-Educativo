interface SliderControllerProps {
  index: number;
  onClickPrev: () => void;
  onClickNext: () => void;
  total: number;
}

export const SliderController = ({
  index,
  onClickPrev,
  onClickNext,
  total,
}: SliderControllerProps) => {
  const isFirst = index === 0;
  const isLast = index === total - 1;

  const getButtonClasses = (disabled: boolean) =>
    `w-[25px] h-[25px] flex justify-center items-center transition-all ${
      disabled ? "text-gray-400" : "bg-main-400 text-white rounded-full"
    }`;

  return (
    <div className="space-x-4">
      {/* Botón Anterior */}
      <button
        onClick={onClickPrev}
        disabled={isFirst}
        aria-label="Anterior"
      >
        <div className={`${getButtonClasses(isFirst)} rotate-180`}>
          <ArrowIcon />
        </div>
      </button>

      {/* Botón Siguiente */}
      <button
        onClick={onClickNext}
        disabled={isLast}
        aria-label="Siguiente"
      >
        <div className={getButtonClasses(isLast)}>
          <ArrowIcon />
        </div>
      </button>
    </div>
  );
};

const ArrowIcon = () => (
  <svg
    width="6"
    height="12"
    viewBox="0 0 8 15"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M1.00005 1.5C1.00005 1.5 6.99999 5.91893 7 7.50005C7.00001 9.08116 1 13.5 1 13.5"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);
