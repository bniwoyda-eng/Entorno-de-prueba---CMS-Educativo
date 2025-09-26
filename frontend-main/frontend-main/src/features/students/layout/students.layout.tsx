import { useState } from "react";
import { Outlet } from "react-router-dom";
import { Navbar, Sidebar } from "./components";

export const StudentsLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  return (
    <div className="flex h-screen">
      <Sidebar
        isOpen={isSidebarOpen}
        closeSidebar={() => setIsSidebarOpen(false)}
      />

      <div className="flex flex-col flex-1">
        <Navbar toggleSidebar={() => setIsSidebarOpen(true)} />
        <div className="flex-1 overflow-y-auto bg-[#F2F3F8]">
          <Outlet />
        </div>
      </div>

      {/* Fondo oscuro cuando el sidebar está abierto en móviles */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black opacity-50 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
    </div>
  );
};
