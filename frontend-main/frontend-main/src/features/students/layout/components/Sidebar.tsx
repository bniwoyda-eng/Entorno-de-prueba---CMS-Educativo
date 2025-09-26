import { useNavigate } from "react-router-dom";
import NavLinkItem from "../../../../components/NavLinkItem";

import { LogoQuarters } from "../../../../icons";
import { LayoutGrid, TabletSmartphone } from "lucide-react";
import { useEnrollments } from "../../../common/courses/courses.queries";
import { EnrollmentSidebarItem } from "./EnrollmentSidebarItem";

export const Sidebar = ({
  isOpen,
  closeSidebar,
}: {
  isOpen: boolean;
  closeSidebar: () => void;
}) => {
  const navigate = useNavigate();
  const { data: enrollments } = useEnrollments();

  const redirect = (url: string) => {
    closeSidebar();
    navigate(url);
  };

  return (
    <aside
      className={`sidebar fixed lg:static top-0 left-0 w-64 h-full bg-white border transition-transform duration-300  pt-4
        ${isOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0`}
    >
      {/* Botón para cerrar en móviles */}
      <button
        onClick={closeSidebar}
        className="lg:hidden absolute top-4 right-4 text-2xl"
      >
        ✕
      </button>

      <div className="flex items-center justify-center h-[80px] mt-2">
        <div className="app-icon bg-[image:var(--icon-url)] w-24 h-24 bg-contain bg-no-repeat"></div>
      </div>

      <div className="flex flex-col flex-grow justify-between items-center p-4 h-[calc(100%-89px)]">
        <nav className="flex flex-col justify-center items-center h-max bg-white">
          <section className="flex flex-col justify-start items-center gap-2 bg-white">
            <NavLinkItem
              text="Home"
              path="/students"
              icon={<LayoutGrid />}
              handleNavigate={redirect}
            />

            <div className="w-[216px] overflow-hidden">
              <NavLinkItem
                text="Courses"
                path="/courses"
                icon={<LogoQuarters />}
                handleNavigate={redirect}
              />

              {enrollments && enrollments.length > 0 && (
                <div className="mx-2 mt-3 max-h-[300px] overflow-y-auto">
                  {enrollments.map(({ course }, index, array) => (
                    <EnrollmentSidebarItem
                      key={index}
                      courseId={course.id}
                      lessons={course.lessonCount}
                      text={course.title}
                      lastBorder={index === array.length - 1}
                    />
                  ))}
                </div>
              )}
            </div>

            <NavLinkItem
              text="Events"
              path="/students/upcoming-events"
              icon={<TabletSmartphone />}
              handleNavigate={redirect}
            />
          </section>
        </nav>

      </div>
    </aside>
  );
};
