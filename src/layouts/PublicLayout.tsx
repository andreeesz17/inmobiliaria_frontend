import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function PublicLayout() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-900 dark:text-white flex flex-col">
      <Navbar />
      
      <main className="flex-grow w-full">
        <Outlet />
      </main>

      <Footer />
    </div>
  );
}
