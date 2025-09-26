import { useMemo } from "react";
import { Link, NavLink } from "react-router-dom";
import { useAssessments } from "../../admin/hooks/assessments.hooks";
import { ChevronRight, Rocket } from "lucide-react";

export const SectionSelfAssessment = () => {
  const { data: items } = useAssessments();

  // Función para mezclar array (Fisher-Yates shuffle)
  const shuffleArray = <T,>(array: T[]): T[] => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  // Memorizar los items mezclados para evitar re-shuffle en cada render
  const shuffledItems = useMemo(() => {
    if (!items) return [];
    return shuffleArray(items);
  }, [items]);

  return (
    <div className="bg-white rounded-[20px] p-5">
      <div className="flex justify-between items-center">
        <p className="text-lg font-medium">Self assessment</p>
        <Link to="/students/self-assessments" className="text-sm text-main-300">View all</Link>
      </div>

      <div className="grid grid-cols-1 gap-3 mt-3">
        {shuffledItems?.slice(0, 3).map((item) => (
          <NavLink
            key={item.id}
            to={`/students/self-assessments/${item.id}`}
            className={`w-full bg-white border border-[#D6D6D699] flex justify-between items-center p-3 rounded-[20px]  group hover:bg-main-100 hover:text-main active:bg-main-200 transition-colors`}
            title={item.title}
        >
            <div className="w-full flex justify-between items-center gap-[10px] text-start">
              {/* Contenedor del icono y texto */}
              <div className="flex items-center gap-[10px] flex-1 min-w-0">
                <div className="bg-main-400 rounded-[10px] w-[46px] h-[46px] flex justify-center items-center text-white p-[8px] shrink-0">
                  <Rocket />
                </div>
                <div className="flex flex-col flex-1 min-w-0">
                  <p className="truncate">{item.title}</p>
                  <p className="text-xs text-main-300 truncate">
                    {item.description}
                  </p>
                </div>
              </div>

              {/* Flecha SVG con ancho fijo */}
              <ChevronRight />
            </div>
          </NavLink>
        ))}
      </div>
    </div>
  );
};
