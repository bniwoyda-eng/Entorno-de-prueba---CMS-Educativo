import { useState, useEffect, useCallback } from "react";
import { NavLink } from "react-router-dom";
import useEmblaCarousel from "embla-carousel-react";

interface EmblaCarouselProps {
  children: React.ReactNode;
  title: string;
  href?: string;
}

export const EmblaCarousel = ({
  children,
  title,
  href,
}: EmblaCarouselProps) => {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    containScroll: "trimSnaps",
    dragFree: false,
    align: "start",
  });
  const [isPrevDisabled, setIsPrevDisabled] = useState(true);
  const [isNextDisabled, setIsNextDisabled] = useState(true);
  const [isAnimating, setIsAnimating] = useState(false);

  const updateNavButtons = useCallback(() => {
    if (!emblaApi) return;
    setIsPrevDisabled(!emblaApi.canScrollPrev());
    setIsNextDisabled(!emblaApi.canScrollNext());
  }, [emblaApi]);

  const handlePrev = () => {
    if (!isAnimating && emblaApi) {
      emblaApi.scrollPrev();
    }
  };

  const handleNext = () => {
    if (!isAnimating && emblaApi) {
      emblaApi.scrollNext();
    }
  };

  useEffect(() => {
    if (!emblaApi) return;

    updateNavButtons();
    emblaApi.on("select", updateNavButtons);
    emblaApi.on("scroll", () => setIsAnimating(true));
    emblaApi.on("settle", () => setIsAnimating(false));

    return () => {
      emblaApi?.off("select", updateNavButtons);
    };
  }, [emblaApi, updateNavButtons]);

  const getButtonClasses = (disabled: boolean) =>
    `w-[25px] h-[25px] flex justify-center items-center transition-all ${
      disabled ? "text-gray-400" : "bg-main-400 text-white rounded-full"
    }`;

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        {href ? (
          <NavLink
            to={href}
            className="text-lg font-medium hover:text-gray-600"
          >
            {title}
          </NavLink>
        ) : (
          <h2 className="text-lg font-medium">{title}</h2>
        )}

        <div className="space-x-4">
          <button
            onClick={handlePrev}
            disabled={isPrevDisabled}
            aria-label="Previous"
          >
            <div className={`${getButtonClasses(isPrevDisabled)} rotate-180`}>
              <ArrowIcon />
            </div>
          </button>

          <button
            onClick={handleNext}
            disabled={isNextDisabled}
            aria-label="Next"
          >
            <div className={getButtonClasses(isNextDisabled)}>
              <ArrowIcon />
            </div>
          </button>
        </div>
      </div>

      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex">
          {Array.isArray(children)
            ? children.map((child, idx) => (
                <div key={idx} className="">
                  {child}
                </div>
              ))
            : children}
        </div>
      </div>
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
