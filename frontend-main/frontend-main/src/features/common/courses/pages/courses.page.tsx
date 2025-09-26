import { Link } from "react-router-dom";
import {
  DifficultySpan,
  InforAlert,
  ProgressBar,
} from "../../../../components";
import { useGlobalProgress } from "../courses.queries";
import { ICourseProgress } from "../courses.types";
import { formatSeconds } from "../../../../utils";

export const CoursesPage = () => {
  const { data: courses, isLoading } = useGlobalProgress();

  if (isLoading || !courses) {
    return (
      <div className="page-base">
        <h1 className="text-xl font-medium mb-3">Courses</h1>
        <div className="flex-center h-64">
          <div className="loader text-center"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="page-base">
      <h1 className="text-xl font-medium mb-3">Courses</h1>
      {courses.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-5">
          {courses.map((course, index) => (
            <CardCourse
              key={course.id}
              index={index}
              course={course}
              variant="description"
            />
          ))}
        </div>
      ) : (
        <InforAlert message="No courses found. Please contact your teacher or come back later." />
      )}
    </div>
  );
};

interface Props {
  index: number;
  variant?: "banner" | "description";
  course: ICourseProgress;
}

const CardCourse = ({ index, variant = "banner", course }: Props) => {
  const {
    title,
    description,
    totalLessons,
    completedLessons,
    progressLessons,
    totalMaterials,
    completedMaterials,
    remainingDuration,
    progressMaterials,
    imageUrl,
    globalDuration,
  } = course;

  const image = imageUrl || "https://placehold.co/1600x200?text=Course";

  return (
    <div className="shadow-md rounded-2xl bg-white h-[300px] overflow-hidden">
      <div className="flex flex-col h-full justify-between">
        {variant === "banner" ? (
          <div>
            <div className="relative h-[125px] mb-3">
              <img
                src={image}
                alt="Banner"
                className="w-full h-full object-cover"
              />
              <span className="absolute bottom-3 left-3 bg-main-100 text-main px-3 py-1 rounded-lg text-sm">
                Course {index + 1}
              </span>
              <span className="absolute bottom-3 right-3">
                <DifficultySpan difficulty={course.level} />
              </span>
            </div>

            <div className="px-3">
              <Link to={`/courses/${course.id}`} title={title}>
                {title}
              </Link>
              <p className="text-xs mt-1">{totalLessons} lessons</p>
              <div className="py-1 flex flex-col justify-center items-start w-full gap-[4px] ">
                <ProgressBar percentage={progressLessons} bgGray />
                <p className="text-[#999999] text-[10px]">
                  {completedLessons} / {totalLessons} lessons completed
                  <span className="mx-[5px]">|</span>
                  {progressLessons} %
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div>
            <div className="p-3">
              <p className="text-base font-semibold text-main-400">
                Course {index + 1}
              </p>
            </div>
            <div className="px-3 flex justify-between items-center mb-1">
              <Link to={`/courses/${course.id}`} title={title}>
                {title}
              </Link>
              <DifficultySpan difficulty={course.level} />
            </div>
            <div className="px-3">
              <p className="text-xs">{totalLessons} lessons</p>
              <div className="py-1 flex flex-col justify-center items-start w-full gap-[4px] ">
                <ProgressBar percentage={progressLessons} bgGray />
                <p className="text-[#999999] text-[10px]">
                  {completedLessons} / {totalLessons} lessons completed
                  <span className="mx-[5px]">|</span>
                  {progressLessons} %
                </p>
              </div>
              {variant === "description" && (
                <div className="text-[#303030] mt-2 overflow-hidden">
                  <p className="text-xs line-clamp-3 xl:line-clamp-5">
                    {description}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* STATISTICS */}
        <div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 justify-between items-center p-3 border-t-2 border-main-100 text-xs">
            <div>
              <p className="text-[#1D1B1B]">Materials</p>
              <span className="text-main font-medium">
                {completedMaterials} / {totalMaterials}
              </span>
            </div>
            <div>
              <p className="text-[#1D1B1B]">Remaining time</p>
              <span className="text-main font-medium">
                {formatSeconds(remainingDuration, false)}
              </span>
            </div>
            <div>
              <p className="text-[#1D1B1B]">Content duration</p>
              <span className="text-main font-medium">
                {formatSeconds(globalDuration, false)}
              </span>
            </div>
            <div>
              <p className="text-[#1D1B1B]">Total completed</p>
              <span className="text-main font-medium">
                {progressMaterials}%
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
