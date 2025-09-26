import { useNavigate } from "react-router-dom";
import { BookA, CalendarDays, GraduationCap, LayoutGrid, MessageCircleMore, Shapes, SquareStack, } from "lucide-react";
import NavLinkItem from "../../../../components/NavLinkItem";

interface Item {
  text: string;
  path: string;
  icon: React.ReactElement;
}

const items: Item[] = [
  { text: "Dashboard", path: "/educators", icon: <LayoutGrid /> },
  { text: "Courses", path: "/courses", icon: <GraduationCap /> },
  { text: "Community", path: "/educators/posts", icon: <SquareStack /> },
  { text: "Resources", path: "/educators/resources", icon: <Shapes /> },
  { text: "Reports", path: "/educators/reports", icon: <BookA /> },
  { text: "Communications", path: "/educators/chat", icon: <MessageCircleMore /> },
  { text: "Events", path: "/educators/events", icon: <CalendarDays /> },
];

export const Sidebar = ({
  isOpen,
  closeSidebar,
}: {
  isOpen: boolean;
  closeSidebar: () => void;
}) => {
  const navigate = useNavigate();

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
            {items.map((item, index) => (
              <NavLinkItem
                key={index}
                text={item.text}
                path={item.path}
                icon={item.icon}
                handleNavigate={() => redirect(item.path)}
              />
            ))}
          </section>
        </nav>

      </div>
    </aside>
  );
};
