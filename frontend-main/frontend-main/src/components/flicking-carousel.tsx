import { useRef, useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import Flicking from "@egjs/react-flicking";
import "@egjs/react-flicking/dist/flicking.css";

interface FlickingCarouselProps {
  children: React.ReactNode;
  title: string;
  href?: string;
}

export const FlickingCarousel = ({
  children,
  title,
  href,
}: FlickingCarouselProps) => {
  const flickingRef = useRef<Flicking>(null);
  const [isFirstPanel, setIsFirstPanel] = useState(true);
  const [isLastPanel, setIsLastPanel] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  const updateNavState = () => {
    const flicking = flickingRef.current;
    if (flicking) {
      const visiblePanels = flicking.visiblePanels;
      if (visiblePanels.length > 0) {
        const firstVisibleIndex = visiblePanels[0].index;
        const lastVisibleIndex = visiblePanels[visiblePanels.length - 1].index;

        setIsFirstPanel(firstVisibleIndex === 0);
        setIsLastPanel(lastVisibleIndex === flicking.panels.length - 1);
      }
    }
  };

  useEffect(() => {
    const timeout = setTimeout(() => {
      updateNavState();
    }, 50); // pequeño delay para asegurar que los children se renderizaron

    return () => clearTimeout(timeout);
  }, [children]);

  const handlePrev = () => {
    if (!isAnimating) {
      flickingRef.current?.prev();
    }
  };

  const handleNext = () => {
    if (!isAnimating) {
      flickingRef.current?.next();
    }
  };

  const getButtonClasses = (disabled: boolean) =>
    `w-[25px] h-[25px] flex justify-center items-center transition-all ${
      disabled ? "text-gray-400" : "bg-main-400 text-white rounded-full"
    }`;

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
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
          {/* Botón Anterior */}
          <button
            onClick={handlePrev}
            disabled={isFirstPanel}
            aria-label="Previous"
          >
            <div className={`${getButtonClasses(isFirstPanel)} rotate-180`}>
              <ArrowIcon />
            </div>
          </button>

          {/* Botón Siguiente */}
          <button onClick={handleNext} disabled={isLastPanel} aria-label="Next">
            <div className={getButtonClasses(isLastPanel)}>
              <ArrowIcon />
            </div>
          </button>
        </div>
      </div>

      <Flicking
        renderOnlyVisible={true}
        ref={flickingRef}
        align="prev"
        bound={true}
        duration={500}
        onReady={updateNavState}
        onChanged={() => {
          updateNavState();
          setIsAnimating(false);
        }}
        onMoveStart={() => {
          setIsAnimating(true);
        }}
        inputType={[]}
      >
        {children}
      </Flicking>
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
