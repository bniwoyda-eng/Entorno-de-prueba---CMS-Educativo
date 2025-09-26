import { Outlet } from "react-router-dom";

export const AuthLayout = () => {
  return (
    <main
      className="w-full h-screen flex justify-center items-center"
      style={{
        backgroundImage: "url(/login-image.png)",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="w-full h-full flex justify-center px-8 py-40 xl:justify-end xl:px-40">
        <div className="bg-white p-8 rounded-2xl shadow-lg max-w-[450px] w-full flex flex-col gap-5 items-center justify-center">
          <div className="app-icon bg-[image:var(--icon-url)] w-32 h-32 bg-contain bg-no-repeat my-8"></div>
          <Outlet />
        </div>
      </div>
    </main>
  );
};
