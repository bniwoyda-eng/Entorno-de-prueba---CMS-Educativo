import ReactPlayer from "react-player";
import { useNavigate, useParams } from "react-router-dom";
import { Route, Timer, Pen, ListTodo, Video } from "lucide-react";

import { Button, CardItem, DifficultySpan } from "../../../../components";
import { useCourseProgress } from "../courses.queries";
import { LessonDropdown } from "../components";
import { formatDate, formatSeconds } from "../../../../utils";
import { useLocalStorage } from "../../../../hooks";

export const CoursePage = () => {
  const { courseId } = useParams() as { courseId: string };
  const navigate = useNavigate();
  const { data: course, isLoading } = useCourseProgress(courseId);
  const { getValue } = useLocalStorage<string>(`course-${courseId}`);

  const handleNavigateLastMaterial = () => {
    const lastMaterialId = getValue();
    if (!lastMaterialId) return;
    navigate(`/courses/${courseId}/material/${lastMaterialId}`);
  };

  return (
    <div className="page-base">
      {isLoading ? (
        <div className="loader"></div>
      ) : (
        <>
          {course && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div className="flex flex-col gap-4">
                <div className="bg-white p-4 rounded-xl shadow flex flex-col gap-2">
                  <div className="flex items-center gap-3">
                    <h1 className="text-2xl font-medium">{course.title}</h1>
                    <DifficultySpan difficulty={course.level} />
                  </div>
                  <p className="text-gray-800">
                    Posted on {formatDate(course.creation_date, "MMMM D, YYYY")}
                  </p>
                  <p>{course.description}</p>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm my-2">
                    <div>
                      <span>Lessons</span>
                      <span className="block text-main-400 font-medium mt-1">
                        {course.completedLessons} / {course.totalLessons}
                      </span>
                    </div>
                    <div>
                      <span>Quizzes</span>
                      <span className="block text-main-400 font-medium mt-1">
                        {course.completedQuizzes} / {course.totalQuizzes}
                      </span>
                    </div>
                    <div>
                      <span>Videos</span>
                      <span className="block text-main-400 font-medium mt-1">
                        {course.completedVideos} / {course.totalVideos}
                      </span>
                    </div>
                    <div>
                      <span>Total duration</span>
                      <span className="block text-main-400 font-medium mt-1">
                        {formatSeconds(course.globalDuration, false)}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-5">
                    <Button
                      text="Continue"
                      onClick={handleNavigateLastMaterial}
                    />
                    <Button text="Save" icon="save" transparent disabled />
                  </div>
                </div>
                <div className="bg-white p-4 rounded-xl shadow flex flex-col gap-2">
                  <h4 className="text-lg font-medium text-gray-800">
                    Quarter content
                  </h4>
                  <CardItem
                    icon={<Route />}
                    text={`${course.totalLessons} ${
                      course.totalLessons > 1 ? "lessons" : "lesson"
                    }`}
                    className="text-gray-800"
                  />
                  <CardItem
                    icon={<Video />}
                    text={`${course.totalVideos} ${
                      course.totalVideos > 1 ? "videos" : "video"
                    }`}
                    className="text-gray-800"
                  />
                  <CardItem
                    icon={<ListTodo />}
                    text={`${course.totalQuizzes} ${
                      course.totalQuizzes > 1 ? "quizzes" : "quiz"
                    }`}
                    className="text-gray-800"
                  />
                </div>
                <div className="bg-white p-4 rounded-xl shadow flex flex-col gap-2">
                  <h4 className="text-lg font-medium text-gray-800">
                    You will need
                  </h4>
                  <CardItem
                    icon={<Pen />}
                    text="Paper and pencil"
                    className="text-gray-800"
                  />
                  <CardItem
                    icon={<Timer />}
                    text="1 hour per day"
                    className="text-gray-800"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-4">
                <div className="w-full h-96 rounded-xl overflow-hidden border">
                  <ReactPlayer
                    url={course.videoUrl}
                    controls
                    width="100%"
                    height="100%"
                  />
                </div>
                <div>
                  {course.lessons.map((lesson, index) => (
                    <LessonDropdown
                      key={lesson.id}
                      lesson={lesson}
                      isLast={index === course.lessons.length - 1}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};
