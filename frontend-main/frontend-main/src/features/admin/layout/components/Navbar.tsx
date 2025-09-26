import { useState } from "react";
import { Menu } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../../auth/auth.store";
import { CustomAlert } from "../../../../utils";

export const Navbar = ({ toggleSidebar }: { toggleSidebar: () => void }) => {
  const navigate = useNavigate();

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const logout = useAuthStore((state) => state.logout);
  const user = useAuthStore((state) => state.user);

  const handleLogout = () => {
    logout();
    CustomAlert.toast("info", "You have been logged out successfully!");
  };

  const handleRedirect = (url: string) => {
    navigate(url);
    setIsDropdownOpen(false);
  };

  return (
    <nav className="h-16 flex justify-between items-center bg-white px-5 border-b shadow relative">
      {/* Botón de menú para pantallas pequeñas */}
      <button onClick={toggleSidebar} className="lg:hidden text-2xl">
        <Menu />
      </button>

      <SearchForm />

      <div className="flex items-center justify-center gap-3">
      

        {/* Avatar con dropdown */}
        <div className="relative">
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center gap-3"
          >
            {user && <span>{user.fullName}</span>}
            <img
              src={user?.profilePicture || "/avatar.png"}
              alt="User avatar"
              title="My account"
              className="w-10 h-10 rounded-full cursor-pointer shadow border hover:shadow-lg"
            />
          </button>
          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-lg p-2 border z-50 text-sm">
              <button
                className="w-full text-left px-4 py-2 text-gray-700 hover:bg-main-100"
                onClick={() =>
                  handleRedirect(`/educators/posts/author/${user?.educatorId}`)
                }
                title="Profile"
              >
                Profile
              </button>
              <button
                disabled
                className="w-full text-left px-4 py-2 text-gray-700 hover:bg-main-100"
                onClick={() => handleRedirect("/educators/change-password")}
                title="Change password"
              >
                Change password
              </button>
              <button
                disabled
                className="w-full text-left px-4 py-2 text-gray-700 hover:bg-main-100"
                onClick={() => handleRedirect("#")}
                title="Settings"
              >
                Settings
              </button>
              <button
                className="w-full text-left px-4 py-2 text-gray-700 hover:bg-main-100"
                onClick={handleLogout}
              >
                Log Out
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

const SearchForm = () => {
  return (
    <form className="hidden lg:block w-[410px] h-[41px] rounded-full gap-[16px] py-[8px] px-[16px] border border-[#D6D6D699] ">
      <div className="flex gap-[16px] items-center">
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="m21.875 21.875-4.531-4.531m2.448-5.886a8.333 8.333 0 1 1-16.667 0 8.333 8.333 0 0 1 16.667 0Z"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>

        <input
          type="text"
          placeholder="What do you want to learn?"
          className="text-sm w-full h-full outline-none"
        />
      </div>
    </form>
  );
};
