import { useEffect, useState } from "react";
import { CircleCheck, ListTodo, Video } from "lucide-react";
import { Link, useNavigate, useParams } from "react-router-dom";

import { ICourseMaterial, ICourseProgress } from "../courses.types";
import { CourseQuiz, CourseVideoPlayer } from "../components";
import { useCourseProgress } from "../courses.queries";
import { useLocalStorage } from "../../../../hooks";
import { formatSeconds } from "../../../../utils";
import { Button } from "../../../../components";

export const CourseMaterialPage = () => {
  const { courseId, materialId } = useParams() as {
    courseId: string;
    materialId: string;
  };

  const navigate = useNavigate();

  const { data: course, isLoading } = useCourseProgress(courseId);
  const { setValue } = useLocalStorage<string>(`course-${courseId}`);
  const [materialProgress, setMaterialProgress] = useState<Map<string, number>>(
    new Map()
  );

  useEffect(() => {
    if (course && !materialId) {
      const materials = flattenMaterials(course);
      if (materials.length > 0) {
        navigate(`/course/${courseId}/material/${materials[0].id}`, {
          replace: true,
        });
      }
    }
  }, [course, materialId, courseId, navigate]);

  useEffect(() => {
    if (course) {
      const progressMap = new Map<string, number>();
      course.lessons.forEach((lesson) => {
        if (!lesson.materials) return;
        lesson.materials.forEach((material) => {
          const progress = material.completed ? 100 : 0;
          progressMap.set(material.id, progress);
        });
      });
      setMaterialProgress(progressMap);
    }
  }, [course]);

  if (!course || isLoading) {
    return (
      <div className="page-base">
        <div className="loader"></div>
      </div>
    );
  }

  const materials = flattenMaterials(course);
  const currentIndex = materials.findIndex((m) => m.id === materialId);
  const currentMaterial = materials[currentIndex];
  const nextMaterial = materials[currentIndex + 1];

  const handleNavigateNext = () => {
    if (nextMaterial) {
      setValue(nextMaterial.id);
      navigate(`/courses/${courseId}/material/${nextMaterial.id}`);
    }
  };

  const handleNavigateMaterial = (materialId: string) => {
    setValue(materialId);
    navigate(`/courses/${courseId}/material/${materialId}`);
  };

  const updateMaterialCompletion = (
    materialId: string,
    isCompleted: boolean
  ) => {
    setMaterialProgress((prev) => {
      const updated = new Map(prev);
      updated.set(materialId, isCompleted ? 100 : 0);
      return updated;
    });
  };

  return (
    <div className="page-base">
      {/* BANNER SUPERIOR */}
      <div className="mb-4 bg-main-100 rounded-xl p-4 shadow">
        <div className="flex flex-col lg:flex-row items-start lg:items-center lg:justify-between w-full gap-4">
          <div>
            <Link to={`/courses/${course.id}`} className="text-lg font-medium text-gray-800">
              {course.title}
            </Link>
            <p className="text-gray-500">
              <span>{currentMaterial.title}</span>
            </p>
          </div>

          <Button
            text="Next class"
            iconSide="right"
            icon="chevronsRight"
            onClick={handleNavigateNext}
            disabled={!nextMaterial}
          />
        </div>
      </div>

      {/* VIDEO O QUIZ */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="col-span-1 lg:col-span-2">
          {currentMaterial?.type === "video" ? (
            <CourseVideoPlayer
              materialId={currentMaterial.id}
              url={currentMaterial.url}
              title={currentMaterial.title}
              progress={materialProgress.get(currentMaterial.id) || 0}
              onEnded={handleNavigateNext}
              updateMaterialCompletion={updateMaterialCompletion}
            />
          ) : (
            <div className="bg-white rounded-xl shadow overflow-hidden">
              {currentMaterial?.type === "quiz" ? (
                <CourseQuiz
                  materialId={currentMaterial.id}
                  handleNavigateNext={handleNavigateNext}
                  updateMaterialCompletion={updateMaterialCompletion}
                />
              ) : (
                <div className="text-gray-500 p-3">
                  No quiz available yet. Coming soon!
                </div>
              )}
            </div>
          )}
        </div>

        {/* LISTADO DE CLASES */}
        <div className="max-h-[735px] overflow-y-auto p-5 box-content bg-white rounded-xl shadow">
          <h2 className="text-lg font-semibold mb-4">Course content</h2>
          {course.lessons.map((lesson) => (
            <div key={lesson.id} className="mb-6">
              <h3 className="font-medium text-gray-800 mb-3">{lesson.title}</h3>

              {lesson.materials && lesson.materials.length > 0 ? (
                <ul className="space-y-3 text-sm text-gray-800">
                  {lesson.materials.map((material, index) => (
                    <li key={material.id} className="relative flex gap-2">
                      {/* Columna izquierda: ícono y línea */}
                      <div className="flex flex-col items-center w-10 relative">
                        {/* Ícono */}
                        <div className="z-10 w-7 h-7 flex items-center justify-center rounded-full">
                          {materialProgress.get(material.id) === 100 ? (
                            <CircleCheck
                              fill="var(--color-main-400)"
                              className="text-white w-7 h-7"
                              strokeWidth={1.5}
                            />
                          ) : (
                            <CircleCheck
                              fill="gray"
                              className="text-white w-7 h-7"
                              strokeWidth={1.5}
                            />
                          )}
                        </div>

                        {/* Línea vertical */}
                        {index < lesson.totalMaterials - 1 && (
                          <div
                            className={`flex-1 w-[2px] ${
                              materialProgress.get(material.id) === 100
                                ? "bg-main-400"
                                : "bg-gray-300"
                            }`}
                          ></div>
                        )}
                      </div>

                      {/* Contenido del material */}
                      <button
                        onClick={() => handleNavigateMaterial(material.id)}
                        className={`${
                          material.id === materialId
                            ? "bg-indigo-100 text-indigo-800 font-medium"
                            : "hover:bg-gray-100"
                        } border p-2 rounded-xl flex items-center gap-2 w-full transition-colors duration-300`}
                      >
                        <div className="bg-main-400 w-2 h-2 rounded-lg grid place-content-center p-5">
                          {material.type === "video" ? (
                            <Video className="text-white" />
                          ) : (
                            <ListTodo className="text-white" />
                          )}
                        </div>

                        <div className="text-left gap-2 w-full">
                          <p className="line-clamp-1">{material.title}</p>
                          <span className="text-xs text-gray-500">
                            {formatSeconds(material.duration)}
                          </span>
                        </div>
                      </button>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="text-gray-500 text-sm">
                  No materials available yet. Coming soon!
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

function flattenMaterials(course: ICourseProgress): ICourseMaterial[] {
  return course.lessons.flatMap((lesson) => {
    if (!lesson.materials) {
      return [];
    }
    return lesson.materials.map((material) => ({
      ...material,
    }));
  });
}
