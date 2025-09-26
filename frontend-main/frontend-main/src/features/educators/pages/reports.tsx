import { useState } from "react";
import {
  useCourseList,
  useCourseStatistics,
  useCourseEnrolledStudents,
  useCourseStatisticsForStudent,
} from "../api/educators.queries";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import { Modal } from "../../../components/Modal";
import "react-circular-progressbar/dist/styles.css";

export const Reports = () => {
  const [selectedCourseId, setSelectedCourseId] = useState<string>("");
  const [activeTab, setActiveTab] = useState<"statistics" | "students">(
    "statistics"
  );
  const [selectedStudentId, setSelectedStudentId] = useState<string>("");
  const [isStudentModalOpen, setIsStudentModalOpen] = useState(false);
  const [studentsSortBy, setStudentsSortBy] = useState<
    "name" | "progress-asc" | "progress-desc"
  >("name");

  const {
    data: courses,
    isLoading: isLoadingCourses,
    isError: isErrorCourses,
  } = useCourseList();
  const {
    data: courseStatistics,
    isLoading: isLoadingStatistics,
    isError: isErrorStatistics,
  } = useCourseStatistics(selectedCourseId);
  const {
    data: enrolledStudents,
    isLoading: isLoadingStudents,
    isError: isErrorStudents,
  } = useCourseEnrolledStudents(selectedCourseId, studentsSortBy);
  const { data: studentStatistics, isLoading: isLoadingStudentStats } =
    useCourseStatisticsForStudent(selectedCourseId, selectedStudentId);

  const handleCourseChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCourseId(event.target.value);
    setActiveTab("statistics"); // Reset to first tab when course changes
    setSelectedStudentId(""); // Reset selected student
    setIsStudentModalOpen(false); // Close modal if open
    setStudentsSortBy("name"); // Reset sort
  };

  const handleStudentClick = (student: any) => {
    setSelectedStudentId(student.id);
    setIsStudentModalOpen(true);
  };

  const closeStudentModal = () => {
    setIsStudentModalOpen(false);
    setSelectedStudentId("");
  };

  // Helper function to get progress color
  const getProgressColor = (percentage: number): string => {
    if (percentage >= 80) return "bg-green-500";
    if (percentage >= 60) return "bg-yellow-500";
    if (percentage >= 40) return "bg-orange-500";
    if (percentage >= 20) return "bg-red-400";
    return "bg-red-600";
  };

  // Helper function to get progress text color
  const getProgressTextColor = (percentage: number): string => {
    if (percentage >= 80) return "text-green-700";
    if (percentage >= 60) return "text-yellow-700";
    if (percentage >= 40) return "text-orange-700";
    if (percentage >= 20) return "text-red-600";
    return "text-red-700";
  };

  // Helper function to format duration
  const formatDuration = (totalDurationInSeconds: number): string => {
    const totalMinutes = Math.round(totalDurationInSeconds / 60);

    if (totalMinutes < 60) {
      return `${totalMinutes} min`;
    }

    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;

    if (minutes === 0) {
      return `${hours}h`;
    }

    return `${hours}h ${minutes}m`;
  };

  // Verificar si las estadísticas están disponibles y completas
  const hasValidStatistics =
    courseStatistics &&
    courseStatistics.course &&
    courseStatistics.statistics &&
    courseStatistics.progressDistribution &&
    courseStatistics.quizPerformance &&
    courseStatistics.materialProgress &&
    courseStatistics.mostCompletedMaterial;

  // Preparar datos para gráficos con validaciones
  const progressDistributionData =
    hasValidStatistics && courseStatistics.progressDistribution
      ? Object.entries(courseStatistics.progressDistribution).map(
          ([range, count]) => ({
            range,
            students: count,
          })
        )
      : [];

  const enrollmentData =
    hasValidStatistics && courseStatistics.statistics
      ? [
          {
            name: "Completed",
            value: courseStatistics.statistics.studentsCompleted || 0,
            color: "#22c55e",
          },
          {
            name: "In Progress",
            value:
              (courseStatistics.statistics.studentsWithProgress || 0) -
              (courseStatistics.statistics.studentsCompleted || 0),
            color: "#f59e0b",
          },
          {
            name: "No Progress",
            value:
              (courseStatistics.statistics.totalStudentsEnrolled || 0) -
              (courseStatistics.statistics.studentsWithProgress || 0),
            color: "#ef4444",
          },
        ]
      : [];

  // Preparar datos para las estadísticas del estudiante
  const studentProgressData = studentStatistics
    ? [
        {
          name: "Videos",
          completed: studentStatistics.materialProgress.videos.completed,
          total: studentStatistics.materialProgress.videos.total,
        },
        {
          name: "Quizzes",
          completed: studentStatistics.materialProgress.quizzes.completed,
          total: studentStatistics.materialProgress.quizzes.total,
        },
      ]
    : [];

  const StatCard = ({
    title,
    value,
    subtitle,
    color = "blue",
  }: {
    title: string;
    value: string | number;
    subtitle?: string;
    color?: string;
  }) => (
    <div
      className="bg-white rounded-lg shadow-md p-6 border-l-4"
      style={{
        borderLeftColor:
          color === "blue"
            ? "#3b82f6"
            : color === "green"
            ? "#22c55e"
            : color === "orange"
            ? "#f59e0b"
            : "#ef4444",
      }}
    >
      <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">
        {title}
      </h3>
      <p className="text-2xl font-bold text-gray-900 mt-2">{value}</p>
      {subtitle && <p className="text-sm text-gray-600 mt-1">{subtitle}</p>}
    </div>
  );

  const TabButton = ({
    label,
    isActive,
    onClick,
  }: {
    tab: string;
    label: string;
    isActive: boolean;
    onClick: () => void;
  }) => (
    <button
      onClick={onClick}
      className={`px-4 py-2 font-medium text-sm rounded-t-lg ${
        isActive
          ? "bg-white text-indigo-600 border-t border-l border-r border-gray-300"
          : "bg-gray-100 text-gray-600 hover:bg-gray-200"
      }`}
    >
      {label}
    </button>
  );

  return (
    <div className="page-base">
      <h1 className="text-xl font-medium text-gray-900">Reports</h1>

      <div className="mb-6">
        <label
          htmlFor="course-select"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          Select a course:
        </label>
        <select
          id="course-select"
          value={selectedCourseId}
          onChange={handleCourseChange}
          className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          disabled={isLoadingCourses}
        >
          <option value="">
            {isLoadingCourses ? "Loading courses..." : "Select a course"}
          </option>
          {courses?.map((course) => (
            <option key={course.id} value={course.id}>
              {course.title}
            </option>
          ))}
        </select>

        {isErrorCourses && (
          <p className="mt-2 text-sm text-red-600">Error loading courses</p>
        )}
      </div>

      {selectedCourseId && (
        <div className="space-y-6">
          {/* Tabs */}
          <div className="border-b border-gray-300">
            <div className="flex space-x-1">
              <TabButton
                tab="statistics"
                label="Course Statistics"
                isActive={activeTab === "statistics"}
                onClick={() => setActiveTab("statistics")}
              />
              <TabButton
                tab="students"
                label="Enrolled Students"
                isActive={activeTab === "students"}
                onClick={() => setActiveTab("students")}
              />
            </div>
          </div>

          {/* Tab Content */}
          <div className="bg-white rounded-b-lg rounded-tr-lg border border-t-0 border-gray-300 p-6">
            {activeTab === "statistics" && (
              <div className="space-y-8">
                {isLoadingStatistics && (
                  <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
                    <span className="ml-3 text-gray-600">
                      Loading statistics...
                    </span>
                  </div>
                )}

                {isErrorStatistics && (
                  <div className="bg-red-50 border border-red-200 rounded-md p-4">
                    <p className="text-red-600">Error loading statistics</p>
                  </div>
                )}

                {/* Mostrar mensaje cuando no hay estadísticas válidas */}
                {courseStatistics && !hasValidStatistics && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <svg
                          className="h-5 w-5 text-yellow-400"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                      <div className="ml-3">
                        <h3 className="text-sm font-medium text-yellow-800">
                          Statistics not available
                        </h3>
                        <div className="mt-2 text-sm text-yellow-700">
                          <p>
                            This course doesn't have complete statistics yet or
                            the data is incomplete. Statistics are generated
                            when there is student activity in the course.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {hasValidStatistics && (
                  <>
                    {/* Información del curso */}
                    <div className="bg-white rounded-lg shadow-md p-6">
                      <h2 className="text-2xl font-bold text-gray-900 mb-4">
                        {courseStatistics.course.title || "Title not available"}
                      </h2>
                      <p className="text-gray-600 mb-4">
                        {courseStatistics.course.description ||
                          "Description not available"}
                      </p>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="text-center">
                          <p className="text-2xl font-bold text-indigo-600">
                            {courseStatistics.course.lessonCount || 0}
                          </p>
                          <p className="text-sm text-gray-500">Lessons</p>
                        </div>
                        <div className="text-center">
                          <p className="text-2xl font-bold text-indigo-600">
                            {courseStatistics.course.totalMaterials || 0}
                          </p>
                          <p className="text-sm text-gray-500">Materials</p>
                        </div>
                        <div className="text-center">
                          <p className="text-2xl font-bold text-indigo-600">
                            {courseStatistics.course.totalVideos || 0}
                          </p>
                          <p className="text-sm text-gray-500">Videos</p>
                        </div>
                        <div className="text-center">
                          <p className="text-2xl font-bold text-indigo-600">
                            {formatDuration(
                              courseStatistics.course.totalDuration || 0
                            )}
                          </p>
                          <p className="text-sm text-gray-500">Duration</p>
                        </div>
                      </div>
                    </div>

                    {/* Estadísticas principales */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                      <StatCard
                        title="Enrolled Students"
                        value={
                          courseStatistics.statistics.totalStudentsEnrolled || 0
                        }
                        color="#3b82f6"
                      />
                      <StatCard
                        title="Completion Rate"
                        value={`${(
                          courseStatistics.statistics.courseCompletionRate || 0
                        ).toFixed(1)}%`}
                        color="#22c55e"
                      />
                      <StatCard
                        title="Average Progress"
                        value={`${(
                          courseStatistics.statistics.avgCompletionPercentage ||
                          0
                        ).toFixed(1)}%`}
                        color="#f59e0b"
                      />
                      <StatCard
                        title="Average Quiz Score"
                        value={`${(
                          courseStatistics.quizPerformance.avgQuizScore || 0
                        ).toFixed(1)}%`}
                        color="#8b5cf6"
                      />
                    </div>

                    {/* Gráficos de progreso circular */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="bg-white rounded-lg shadow-md p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4 text-center">
                          Completion Rate
                        </h3>
                        <div className="w-32 h-32 mx-auto">
                          <CircularProgressbar
                            value={
                              courseStatistics.statistics
                                .courseCompletionRate || 0
                            }
                            text={`${(
                              courseStatistics.statistics
                                .courseCompletionRate || 0
                            ).toFixed(1)}%`}
                            styles={buildStyles({
                              textSize: "16px",
                              pathColor: "#22c55e",
                              textColor: "#22c55e",
                              trailColor: "#f3f4f6",
                            })}
                          />
                        </div>
                      </div>

                      <div className="bg-white rounded-lg shadow-md p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4 text-center">
                          Videos Completed
                        </h3>
                        <div className="w-32 h-32 mx-auto">
                          <CircularProgressbar
                            value={
                              courseStatistics.materialProgress
                                .videoCompletionRate || 0
                            }
                            text={`${(
                              courseStatistics.materialProgress
                                .videoCompletionRate || 0
                            ).toFixed(1)}%`}
                            styles={buildStyles({
                              textSize: "16px",
                              pathColor: "#3b82f6",
                              textColor: "#3b82f6",
                              trailColor: "#f3f4f6",
                            })}
                          />
                        </div>
                      </div>

                      <div className="bg-white rounded-lg shadow-md p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4 text-center">
                          Quizzes Completed
                        </h3>
                        <div className="w-32 h-32 mx-auto">
                          <CircularProgressbar
                            value={
                              courseStatistics.materialProgress
                                .quizCompletionRate || 0
                            }
                            text={`${(
                              courseStatistics.materialProgress
                                .quizCompletionRate || 0
                            ).toFixed(1)}%`}
                            styles={buildStyles({
                              textSize: "16px",
                              pathColor: "#f59e0b",
                              textColor: "#f59e0b",
                              trailColor: "#f3f4f6",
                            })}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Gráficos */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      {/* Distribución de progreso */}
                      <div className="bg-white rounded-lg shadow-md p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">
                          Progress Distribution
                        </h3>
                        {progressDistributionData.length > 0 ? (
                          <ResponsiveContainer width="100%" height={250}>
                            <BarChart data={progressDistributionData}>
                              <CartesianGrid strokeDasharray="3 3" />
                              <XAxis dataKey="range" />
                              <YAxis />
                              <Tooltip />
                              <Bar dataKey="students" fill="#3b82f6" />
                            </BarChart>
                          </ResponsiveContainer>
                        ) : (
                          <div className="flex items-center justify-center h-64 text-gray-500">
                            <p>No progress distribution data available</p>
                          </div>
                        )}
                      </div>

                      {/* Estado de inscripciones */}
                      <div className="bg-white rounded-lg shadow-md p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">
                          Student Status
                        </h3>
                        {enrollmentData.some((d) => d.value > 0) ? (
                          <ResponsiveContainer width="100%" height={250}>
                            <PieChart>
                              <Pie
                                data={enrollmentData}
                                cx="50%"
                                cy="50%"
                                outerRadius={80}
                                dataKey="value"
                                label={({ name, value }) => `${name}: ${value}`}
                              >
                                {enrollmentData.map((entry, index) => (
                                  <Cell
                                    key={`cell-${index}`}
                                    fill={entry.color}
                                  />
                                ))}
                              </Pie>
                              <Tooltip />
                            </PieChart>
                          </ResponsiveContainer>
                        ) : (
                          <div className="flex items-center justify-center h-64 text-gray-500">
                            <p>No students enrolled in this course</p>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Material más popular y rendimiento de quizzes */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <div className="bg-white rounded-lg shadow-md p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">
                          Most Completed Material
                        </h3>
                        {courseStatistics.mostCompletedMaterial &&
                        courseStatistics.mostCompletedMaterial.title ? (
                          <div className="border rounded-lg p-4 bg-green-50">
                            <p className="font-medium text-green-800">
                              {courseStatistics.mostCompletedMaterial.title}
                            </p>
                            <p className="text-sm text-green-600">
                              Type:{" "}
                              {courseStatistics.mostCompletedMaterial.type ||
                                "Not specified"}
                            </p>
                            <p className="text-sm text-green-600">
                              Completed by:{" "}
                              {courseStatistics.mostCompletedMaterial
                                .completions || 0}{" "}
                              students
                            </p>
                          </div>
                        ) : (
                          <div className="border rounded-lg p-4 bg-gray-50">
                            <p className="text-gray-600">
                              No completed materials information available
                            </p>
                          </div>
                        )}
                      </div>

                      <div className="bg-white rounded-lg shadow-md p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">
                          Quiz Performance
                        </h3>
                        <div className="space-y-3">
                          {courseStatistics.quizPerformance.bestQuizMaterial &&
                          courseStatistics.quizPerformance.bestQuizMaterial
                            .title ? (
                            <div className="border rounded-lg p-3 bg-green-50">
                              <p className="text-sm font-medium text-green-800">
                                Best Quiz:
                              </p>
                              <p className="text-sm text-green-600">
                                {
                                  courseStatistics.quizPerformance
                                    .bestQuizMaterial.title
                                }
                              </p>
                            </div>
                          ) : (
                            <div className="border rounded-lg p-3 bg-gray-50">
                              <p className="text-sm text-gray-600">
                                Best quiz information not available
                              </p>
                            </div>
                          )}

                          {courseStatistics.quizPerformance.worstQuizMaterial &&
                          courseStatistics.quizPerformance.worstQuizMaterial
                            .title ? (
                            <div className="border rounded-lg p-3 bg-red-50">
                              <p className="text-sm font-medium text-red-800">
                                Most Challenging Quiz:
                              </p>
                              <p className="text-sm text-red-600">
                                {
                                  courseStatistics.quizPerformance
                                    .worstQuizMaterial.title
                                }
                              </p>
                            </div>
                          ) : (
                            <div className="border rounded-lg p-3 bg-gray-50">
                              <p className="text-sm text-gray-600">
                                Most challenging quiz information not available
                              </p>
                            </div>
                          )}

                          <div className="text-center">
                            <p className="text-sm text-gray-600">
                              {courseStatistics.quizPerformance
                                .totalQuizCompletions || 0}{" "}
                              completions out of{" "}
                              {courseStatistics.quizPerformance.totalQuizzes ||
                                0}{" "}
                              quizzes
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>
            )}

            {activeTab === "students" && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-semibold text-gray-900">
                    Enrolled Students
                  </h2>
                  <div className="flex items-center space-x-4">
                    {enrolledStudents && (
                      <span className="text-sm text-gray-600">
                        {enrolledStudents.length} student
                        {enrolledStudents.length !== 1 ? "s" : ""} enrolled
                      </span>
                    )}
                    <select
                      value={studentsSortBy}
                      onChange={(e) =>
                        setStudentsSortBy(
                          e.target.value as
                            | "name"
                            | "progress-asc"
                            | "progress-desc"
                        )
                      }
                      className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    >
                      <option value="name">Sort by Name</option>
                      <option value="progress-asc">
                        Sort by Progress (Ascending)
                      </option>
                      <option value="progress-desc">
                        Sort by Progress (Descending)
                      </option>
                    </select>
                  </div>
                </div>

                {isLoadingStudents && (
                  <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
                    <span className="ml-3 text-gray-600">
                      Loading students...
                    </span>
                  </div>
                )}

                {isErrorStudents && (
                  <div className="bg-red-50 border border-red-200 rounded-md p-4">
                    <p className="text-red-600">Error loading students</p>
                  </div>
                )}

                {enrolledStudents && enrolledStudents.length === 0 && (
                  <div className="bg-gray-50 border border-gray-200 rounded-md p-8 text-center">
                    <p className="text-gray-600">
                      No students enrolled in this course yet.
                    </p>
                  </div>
                )}

                {enrolledStudents && enrolledStudents.length > 0 && (
                  <div className="bg-white rounded-lg shadow overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Student
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Email
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Phone
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Progress
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {enrolledStudents.map((student) => (
                          <tr key={student.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <div className="flex-shrink-0 h-10 w-10">
                                  <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center">
                                    <span className="text-sm font-medium text-indigo-800">
                                      {student.fullName.charAt(0).toUpperCase()}
                                    </span>
                                  </div>
                                </div>
                                <div className="ml-4">
                                  <div className="text-sm font-medium text-gray-900">
                                    {student.fullName}
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {student.email}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {student.whatsappPhone || "N/A"}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center space-x-2">
                                <div className="flex-1">
                                  <div className="w-full bg-gray-200 rounded-full h-2">
                                    <div
                                      className={`h-2 rounded-full ${getProgressColor(
                                        student.progressPercentage || 0
                                      )}`}
                                      style={{
                                        width: `${
                                          student.progressPercentage || 0
                                        }%`,
                                      }}
                                    ></div>
                                  </div>
                                </div>
                                <span
                                  className={`text-sm font-medium ${getProgressTextColor(
                                    student.progressPercentage || 0
                                  )}`}
                                >
                                  {Math.round(student.progressPercentage || 0)}%
                                </span>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                              <button
                                onClick={() => handleStudentClick(student)}
                                className="text-indigo-600 hover:text-indigo-900"
                              >
                                View Progress
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Student Progress Modal */}
      <Modal isOpen={isStudentModalOpen} onClose={closeStudentModal} size="5xl">
        <Modal.Header>
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-semibold text-gray-900">
                Student Progress Report
              </h3>
              {studentStatistics && (
                <p className="text-sm text-gray-600 mt-1">
                  {studentStatistics.student.name} •{" "}
                  {studentStatistics.course.title}
                </p>
              )}
            </div>
          </div>
        </Modal.Header>

        <Modal.Body>
          {isLoadingStudentStats && (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
              <span className="ml-3 text-gray-600">
                Loading student progress...
              </span>
            </div>
          )}

          {studentStatistics && (
            <div className="space-y-6">
              {/* Student Info & Overall Progress */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <StatCard
                  title="Overall Progress"
                  value={`${studentStatistics.progress.overallProgress}%`}
                  color="#22c55e"
                />
                <StatCard
                  title="Materials Completed"
                  value={`${studentStatistics.progress.completedMaterials}/${studentStatistics.progress.totalMaterials}`}
                  color="#3b82f6"
                />
                <StatCard
                  title="Lessons Completed"
                  value={`${studentStatistics.progress.completedLessons}/${studentStatistics.progress.totalLessons}`}
                  color="#f59e0b"
                />
                <StatCard
                  title="Quiz Average"
                  value={`${studentStatistics.quizPerformance.avgScore}%`}
                  color="#8b5cf6"
                />
              </div>

              {/* Progress Circles */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4 text-center">
                    Course Progress
                  </h4>
                  <div className="w-24 h-24 mx-auto">
                    <CircularProgressbar
                      value={studentStatistics.progress.overallProgress}
                      text={`${studentStatistics.progress.overallProgress}%`}
                      styles={buildStyles({
                        textSize: "18px",
                        pathColor: "#22c55e",
                        textColor: "#22c55e",
                        trailColor: "#f3f4f6",
                      })}
                    />
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow-md p-6">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4 text-center">
                    Videos
                  </h4>
                  <div className="w-24 h-24 mx-auto">
                    <CircularProgressbar
                      value={
                        studentStatistics.materialProgress.videos.completionRate
                      }
                      text={`${studentStatistics.materialProgress.videos.completionRate.toFixed(
                        1
                      )}%`}
                      styles={buildStyles({
                        textSize: "18px",
                        pathColor: "#3b82f6",
                        textColor: "#3b82f6",
                        trailColor: "#f3f4f6",
                      })}
                    />
                  </div>
                  <p className="text-center text-sm text-gray-600 mt-2">
                    {studentStatistics.materialProgress.videos.completed}/
                    {studentStatistics.materialProgress.videos.total}
                  </p>
                </div>

                <div className="bg-white rounded-lg shadow-md p-6">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4 text-center">
                    Quizzes
                  </h4>
                  <div className="w-24 h-24 mx-auto">
                    <CircularProgressbar
                      value={
                        studentStatistics.materialProgress.quizzes
                          .completionRate
                      }
                      text={`${studentStatistics.materialProgress.quizzes.completionRate.toFixed(
                        1
                      )}%`}
                      styles={buildStyles({
                        textSize: "18px",
                        pathColor: "#f59e0b",
                        textColor: "#f59e0b",
                        trailColor: "#f3f4f6",
                      })}
                    />
                  </div>
                  <p className="text-center text-sm text-gray-600 mt-2">
                    {studentStatistics.materialProgress.quizzes.completed}/
                    {studentStatistics.materialProgress.quizzes.total}
                  </p>
                </div>
              </div>

              {/* Material Progress Chart */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-4">
                  Material Progress Breakdown
                </h4>
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={studentProgressData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip
                      formatter={(value, name) => [
                        value,
                        name === "completed" ? "Completed" : "Total",
                      ]}
                    />
                    <Bar dataKey="total" fill="#e5e7eb" name="total" />
                    <Bar dataKey="completed" fill="#3b82f6" name="completed" />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Time Estimation */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-blue-50 rounded-lg p-4">
                  <h5 className="font-medium text-blue-900">
                    Estimated Time Remaining
                  </h5>
                  <p className="text-2xl font-bold text-blue-700 mt-1">
                    {formatDuration(
                      studentStatistics.timeEstimation.estimatedTimeRemaining
                    )}
                  </p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <h5 className="font-medium text-gray-900">
                    Materials Remaining
                  </h5>
                  <p className="text-2xl font-bold text-gray-700 mt-1">
                    {studentStatistics.timeEstimation.remainingMaterials}
                  </p>
                </div>
                <div className="bg-purple-50 rounded-lg p-4">
                  <h5 className="font-medium text-purple-900">
                    Best Quiz Score
                  </h5>
                  <p className="text-2xl font-bold text-purple-700 mt-1">
                    {studentStatistics.quizPerformance.bestScore}%
                  </p>
                </div>
              </div>

              {/* Lessons Progress */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-4">
                  Lessons Progress
                </h4>
                <div className="space-y-3">
                  {studentStatistics.lessonsProgress.map((lesson) => (
                    <div key={lesson.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-center mb-2">
                        <h5 className="font-medium text-gray-900">
                          {lesson.title}
                        </h5>
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            lesson.isCompleted
                              ? "bg-green-100 text-green-800"
                              : "bg-yellow-100 text-yellow-800"
                          }`}
                        >
                          {lesson.isCompleted ? "Completed" : "In Progress"}
                        </span>
                      </div>
                      <div className="flex justify-between items-center text-sm text-gray-600">
                        <span>
                          {lesson.completedMaterials}/{lesson.totalMaterials}{" "}
                          materials
                        </span>
                        <span>{lesson.progressPercentage}% complete</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                        <div
                          className="bg-indigo-600 h-2 rounded-full"
                          style={{ width: `${lesson.progressPercentage}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Next Recommended Material */}
              {studentStatistics.recentActivity.nextRecommendedMaterial && (
                <div className="bg-indigo-50 rounded-lg p-6">
                  <h4 className="text-lg font-semibold text-indigo-900 mb-2">
                    Next Recommended
                  </h4>
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-medium text-indigo-800">
                        {
                          studentStatistics.recentActivity
                            .nextRecommendedMaterial.title
                        }
                      </p>
                      <p className="text-sm text-indigo-600">
                        {
                          studentStatistics.recentActivity
                            .nextRecommendedMaterial.lessonTitle
                        }{" "}
                        •
                        {
                          studentStatistics.recentActivity
                            .nextRecommendedMaterial.type
                        }{" "}
                        •
                        {formatDuration(
                          studentStatistics.recentActivity
                            .nextRecommendedMaterial.duration
                        )}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </Modal.Body>

        <Modal.Footer>
          <button
            onClick={closeStudentModal}
            className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition-colors"
          >
            Close
          </button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};
