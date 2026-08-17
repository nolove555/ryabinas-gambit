// src/layouts/MainLayout.tsx — full replace
import { Outlet } from "react-router-dom";
import Sidebar from "../components/layout/Sidebar";

function MainLayout() {
  return (
    <div className="min-h-screen bg-black text-white">
      <Sidebar />

      <main className="min-h-screen md:ml-80">
        <Outlet />
      </main>
    </div>
  );
}

export default MainLayout;