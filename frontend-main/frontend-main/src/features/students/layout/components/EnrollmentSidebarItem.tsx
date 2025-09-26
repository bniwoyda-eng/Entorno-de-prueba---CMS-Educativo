import { NavLink, useLocation } from "react-router-dom";

interface Props {
  courseId: string;
  text: string;
  lessons: number;
  lastBorder: boolean;
}
export const EnrollmentSidebarItem = ({
  courseId,
  text,
  lessons = 0,
  lastBorder,
}: Props) => {
  const location = useLocation();
  const splits = location.pathname.split("/");
  const isActive = splits.includes(courseId);

  return (
    <NavLink
      to={`/courses/${courseId}`}
      className="flex justify-start items-start gap-2 pb-[3px] px-2 w-[190px]"
    >
      <div className="flex flex-col justify-center items-center gap-2 w-[24px] pt-[6px]">
        <div className="w-[8px] h-[8px] rounded-full bg-main-400"></div>
        {!lastBorder && <div className="w-[2px] h-[50px] bg-main"></div>}
      </div>
      <div
        className={`flex flex-col justify-center text-dark items-start group hover:text-main-300 transition-colors max-w-[145px] ${
          isActive && "text-main-400"
        }`}
      >
        <p className="text-sm">{text}</p>
        <span className="text-xs text-gray-600">{lessons} lessons</span>
      </div>
    </NavLink>
  );
};
