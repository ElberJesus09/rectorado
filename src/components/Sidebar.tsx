import React, { useEffect, useState } from "react";
import { useSheetService } from "../services/GoogleSheetProvider";

interface SidebarProps {
    isOpen: boolean;
    toggle: () => void;
    currentView: "list" | "calendar";
    onChangeView: (view: "list" | "calendar") => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, currentView, onChangeView }) => {
    const { signOut, userProfile } = useSheetService();
    const isMinimized = !isOpen;

    const [isDark, setIsDark] = useState(
        document.documentElement.classList.contains("dark")
    );

    useEffect(() => {
        if (isDark) {
            document.documentElement.classList.add("dark");
            localStorage.setItem("theme", "dark");
        } else {
            document.documentElement.classList.remove("dark");
            localStorage.setItem("theme", "light");
        }
    }, [isDark]);

    useEffect(() => {
        const saved = localStorage.getItem("theme");
        if (saved === "dark") {
            setIsDark(true);
            document.documentElement.classList.add("dark");
        }
    }, []);

    const sidebarClasses = `
        h-screen bg-white text-slate-700 dark:bg-slate-900 dark:text-slate-300
        flex flex-col p-6 shadow-2xl fixed left-0 top-0 z-30 
        border-r border-slate-200 dark:border-slate-800 transition-all duration-300 overflow-x-hidden
        lg:${isOpen ? "w-64" : "w-20"} 
        ${isOpen ? "translate-x-0 w-64" : "-translate-x-full w-64"}
    `;

    const navButtonClass = (isActive: boolean) =>
        `flex items-center gap-3 py-3 px-4 rounded-xl font-medium transition-all duration-200 ${
            isActive
                ? "bg-indigo-600 text-white shadow-lg shadow-indigo-900/20"
                : "text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-100"
        } ${isMinimized ? "justify-center" : ""}`;

    return (
        <aside className={sidebarClasses}>
            <div className="flex items-center mb-10 overflow-hidden pl-1">
                <img
                    src="/LogoColor.png"
                    alt="Logo Rectorado"
                    className={`w-9 h-9 ${isMinimized ? "mr-0" : "mr-3"} rounded-lg transition-all duration-300 object-contain`}
                />
                <h2
                    className={`text-xl font-bold tracking-tight transition-all duration-300 whitespace-nowrap ${
                        isMinimized ? "opacity-0 w-0 overflow-hidden" : "opacity-100 w-auto"
                    }`}
                >
                    <span className="text-indigo-400">Rectorado</span> Panel
                </h2>
            </div>

            {userProfile && (
                <div
                    className={`flex flex-col border-b border-slate-200 dark:border-slate-800 pb-6 mb-6 transition-all duration-300 ${
                        isMinimized ? "items-center" : "items-start"
                    }`}
                >
                    <div
                        className={`w-full overflow-hidden transition-all duration-300 ${
                            isMinimized ? "opacity-0 h-0 lg:opacity-100 lg:h-auto" : "opacity-100 h-auto"
                        }`}
                    >
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg shadow-inner">
                                {userProfile.name.charAt(0)}
                            </div>
                            <div className={`${isMinimized ? "hidden" : "block"}`}>
                                <p className="font-semibold text-sm truncate max-w-[140px]">
                                    {userProfile.name}
                                </p>
                                <p className="text-xs text-slate-500 truncate max-w-[140px]">
                                    {userProfile.email}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <nav className="flex-grow space-y-2">
                <button
                    className={navButtonClass(currentView === "list")}
                    onClick={() => onChangeView("list")}
                >
                    <span className="text-xl">📄</span>
                    <span className={`${isMinimized ? "hidden" : "block"}`}>
                        Documentos
                    </span>
                </button>

                <button
                    className={navButtonClass(currentView === "calendar")}
                    onClick={() => onChangeView("calendar")}
                >
                    <span className="text-xl">📅</span>
                    <span className={`${isMinimized ? "hidden" : "block"}`}>
                        Calendario
                    </span>
                </button>
            </nav>

            <button
                onClick={() => setIsDark(!isDark)}
                className={`mb-4 flex items-center gap-3 py-3 px-4 rounded-xl transition-all duration-200
                bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700
                ${isMinimized ? "justify-center" : ""}`}
            >
                <span className="text-xl">{isDark ? "🌞" : "🌙"}</span>
                <span className={`${isMinimized ? "hidden" : "block"}`}>
                    {isDark ? "Modo Día" : "Modo Noche"}
                </span>
            </button>

            <button
                onClick={signOut}
                className={`flex items-center justify-center gap-3 py-3 px-4 rounded-xl transition-all duration-200 group
                bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700
                text-red-500 hover:bg-red-100 dark:hover:bg-red-900/20
                ${isMinimized ? "w-12 h-12 p-0" : "w-full"}`}
            >
                <svg
                    className="w-5 h-5 flex-shrink-0"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                    />
                </svg>
                <span className={`${isMinimized ? "hidden" : "block"}`}>
                    Salir
                </span>
            </button>
        </aside>
    );
};

export default Sidebar;
