import { Outlet } from "react-router-dom";

export default function AppLayout() {
    return (
        <div className="min-h-screen w-full bg-slate-50 text-slate-900 dark:bg-slate-900 dark:text-white">
            <div className="w-full">
                <Outlet />
            </div>
        </div>
    );
}