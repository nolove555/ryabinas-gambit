import { Outlet } from "react-router-dom";
import Sidebar from "../components/layout/Sidebar";

function MainLayout() {
  return (
    <div className="min-h-screen bg-black text-white">
      <Sidebar />

      <main className="ml-80 min-h-screen">
        <Outlet />
      </main>
    </div>
  );
}

export default MainLayout;