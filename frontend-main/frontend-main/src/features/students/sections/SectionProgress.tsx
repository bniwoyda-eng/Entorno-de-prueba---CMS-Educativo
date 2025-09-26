import { NavLink } from "react-router-dom";
import { Blocks, Frown, Timer } from "lucide-react";

import { FlickingCarousel, InforAlert, ProgressBar } from "../../../components";
import { useGlobalProgress } from "../../common/courses/courses.queries";
import { ICourseProgress } from "../../common/courses/courses.types";
import { formatSeconds } from "../../../utils";

export const SectionProgress = () => {
  const { data: courses, isLoading } = useGlobalProgress();

  return (
    <div>
      {isLoading ? (
        <div className="flex-center h-64">
          <div className="loader"></div>
        </div>
      ) : (
        <div>
          {courses && courses.length > 0 ? (
            <FlickingCarousel title="Courses">
              {courses.map((course, i) => (
                <div
                  key={i}
                  className="w-full  flex justify-center items-center"
                >
                  <CourseProgress key={i} course={course} />
                </div>
              ))}
            </FlickingCarousel>
          ) : (
            <InforAlert message="No courses found. Please contact your teacher or come back later." />
          )}
        </div>
      )}
    </div>
  );
};

const CourseProgress = ({ course }: { course: ICourseProgress }) => {
  const {
    totalLessons,
    completedLessons,
    totalMaterials,
    completedMaterials,
    progressMaterials,
    globalDuration,
    remainingDuration,
    lessons,
  } = course;

  return (
    <div className="flex flex-col xl:flex-row gap-3 w-full">
      {/* CARD CURSO */}
      <div className="py-1">
        <CardCourse course={course} />
      </div>

      {/* CLASES */}
      <div className="w-full flex flex-col justify-between">
        <div className="h-[220px] overflow-y-scroll w-full flex flex-col gap-3 pr-2 py-1">
          {lessons.length > 0 ? (
            lessons.map(
              ({
                id,
                title,
                lessonDuration,
                totalMaterials,
                completedMaterials,
                progressPercentage,
                firstMaterialId,
              }) => (
                <NavLink
                  key={id}
                  to={
                    firstMaterialId
                      ? `/courses/${course.id}/material/${firstMaterialId}`
                      : "#"
                  }
                  className="w-full py-2 px-3 bg-main-100 rounded-2xl shadow flex flex-col gap-2 text-[#1D1B1B] hover:bg-main-200 transition duration-200 ease-in-out"
                >
                  <div className="flex items-end justify-between gap-2">
                    {/* IZQ */}
                    <div className="flex gap-3 items-center w-full">
                      <div className="bg-main-300 w-[40px] rounded-lg flex justify-center items-center text-white p-2">
                        <Blocks />
                      </div>
                      <div className="flex flex-col text-main">
                        <p className="text-dark line-clamp-1">{title}</p>
                        <div className="flex gap-1 items-center text-main-300">
                          <Timer className="w-3 h-3" />

                          <span className="text-[#1D1B1B] text-xs">
                            {lessonDuration > 0
                              ? formatSeconds(lessonDuration, false)
                              : "No duration"}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* DER */}
                    <div className="w-full flex flex-col gap-1 items-end justify-end h-full">
                      <span className="text-[#1D1B1B] text-xs">
                        {completedMaterials} / {totalMaterials} materials
                        completed <span className="mx-1">|</span>{" "}
                        {progressPercentage}%
                      </span>
                      <div className="w-[75%]">
                        <ProgressBar percentage={progressPercentage} />
                      </div>
                    </div>
                  </div>
                </NavLink>
              )
            )
          ) : (
            <div className="h-[210px] shadow border rounded-[16px] w-full py-2 px-4 bg-main-100 flex justify-center items-center text-[#1D1B1B] gap-3">
              <Frown />
              <p className="text-[#1D1B1B]">No lessons found</p>
            </div>
          )}
        </div>

        {/* RESUME (STATISTICS) */}
        <div className="grid grid-cols-3 lg:grid-cols-5 gap-4 justify-between items-center p-2 text-sm">
          <div>
            <p className="text-[#1D1B1B]">Lessons</p>
            <span className="text-main font-medium">
              {completedLessons} / {totalLessons}
            </span>
          </div>
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
            <span className="text-main font-medium">{progressMaterials}%</span>
          </div>
        </div>
      </div>
    </div>
  );
};

interface CardCourseSmallProps {
  course: ICourseProgress;
}

const CardCourse = ({ course }: CardCourseSmallProps) => {
  const { title, imageUrl, totalLessons, completedLessons, progressLessons } =
    course;

  return (
    <NavLink to={`/courses/${course.id}`}>
      <div className="h-full min-w-[222px] w-full rounded-2xl bg-white overflow-hidden shadow">
        <img
          src={imageUrl}
          alt={title}
          className="h-[150px] object-cover w-full"
        />

        <div className="flex flex-col gap-3 px-4 py-3">
          <div>
            <h3 className="leading-tight mb-1 hover:font-medium hover:underline">
              {title}
            </h3>
            <p className="text-xs">{totalLessons} lessons</p>
          </div>
          <div className="flex flex-col justify-center items-start w-full gap-[4px] ">
            <ProgressBar percentage={progressLessons} bgGray />
            <p className="text-[#999999] text-[10px]">
              {completedLessons} / {totalLessons} lessons completed
              <span className="mx-[5px]">|</span>
              {progressLessons} %
            </p>
          </div>{" "}
        </div>
      </div>
    </NavLink>
  );
};
