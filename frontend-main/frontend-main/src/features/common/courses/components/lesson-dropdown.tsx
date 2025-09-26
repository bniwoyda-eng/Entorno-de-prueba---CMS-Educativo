import { useState } from "react";
import { ICourseLesson } from "../courses.types";
import { ChevronUp, ListTodo, TriangleAlert, Video } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { formatSeconds } from "../../../../utils";
import { useLocalStorage } from "../../../../hooks";

interface Props {
  lesson: ICourseLesson;
  isLast?: boolean;
}

export const LessonDropdown = ({ lesson, isLast }: Props) => {
  const navigate = useNavigate();
  const { courseId } = useParams() as { courseId: string };
  const [collapsed, setCollapsed] = useState(false);
  const { setValue } = useLocalStorage<string>(`course-${courseId}`);

  const videoCount = lesson.materials?.filter((material) => material.type === "video").length || 0;

  const quizCount = lesson.materials?.filter((material) => material.type === "quiz").length || 0;

  const handleRedirectMaterial = (materialId: string) => {
    setValue(materialId);
    navigate(`/courses/${courseId}/material/${materialId}`);
  };

  return (
    <div className={`${!isLast ? "border-b border-[#D6D6D699]" : ""}`}>
      <div
        className="py-3 flex items-center justify-between hover:cursor-pointer"
        onClick={() => setCollapsed((prev) => !prev)}
      >
        <h2 className="text-xl text-main">{lesson.title}</h2>
        <div className="flex items-center gap-3">
          {quizCount > 0 && (
            <span className="border border-main text-main px-2 rounded-lg text-sm">
              {quizCount} {quizCount > 1 ? "assessments" : "assessment"}
            </span>
          )}
          {videoCount > 0 && (
            <span className="border border-main text-main px-2 rounded-lg text-sm">
              {videoCount} {videoCount > 1 ? "videos" : "video"}
            </span>
          )}
          {!quizCount && !videoCount && (
            <span className="border border-main text-main px-2 rounded-lg text-sm">
              Coming soon
            </span>
          )}
          {/* Icono de colapso */}
          <span className="text-main transition-transform duration-300">
            <ChevronUp
              className={`w-5 h-5 transition-transform duration-300 ${
                !collapsed ? "rotate-180" : ""
              }`}
            />
          </span>
        </div>
      </div>

      {/* Contenido colapsable */}
      <div
        className={`overflow-hidden transition-all duration-500 ease-in-out ${
          collapsed ? "opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="text-sm pb-3">
          {/* Aquí podrías mapear los materiales, por ejemplo */}
          {lesson.materials?.map((material) => (
            <div
              key={material.id}
              className="mb-2 bg-white p-2 rounded-lg shadow flex items-center gap-2 hover:bg-main-200 transition-colors duration-300 cursor-pointer"
              onClick={() => handleRedirectMaterial(material.id)}
            >
              <div className="bg-main-400 w-2 h-2 rounded-lg grid place-content-center p-5">
                {material.type === "video" ? (
                  <Video className="text-white" />
                ) : (
                  <ListTodo className="text-white" />
                )}
              </div>
              <div className="flex flex-col text-gray-800">
                <span>{material.title}</span>
                <span className="text-xs">
                  {formatSeconds(material.duration)}
                </span>
              </div>
            </div>
          ))}

          {!lesson.materials?.length && (
            <div className="bg-white p-2 rounded-lg shadow flex items-center gap-2 text-gray-800">
              <TriangleAlert className="text-gray-800 h-4" />
              <span>No materials available yet. Check back later!</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
