// src/components/Layout.tsx
import React, { useState } from "react";
import Sidebar from "./Sidebar";

interface LayoutProps {
    children: React.ReactNode;
    currentView: "list" | "calendar";
    onChangeView: (view: "list" | "calendar") => void;
}

const Layout: React.FC<LayoutProps> = ({
    children,
    currentView,
    onChangeView,
}) => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    const toggleSidebar = () => {
        setIsSidebarOpen((prev) => !prev);
    };

    const mainMarginClass = isSidebarOpen
        ? "lg:ml-56 ml-0"
        : "lg:ml-20 ml-0";

    return (
        <div className="flex min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors">
            {/* Sidebar */}
            <Sidebar
                isOpen={isSidebarOpen}
                toggle={toggleSidebar}
                currentView={currentView}
                onChangeView={onChangeView}
            />

            {/* Overlay móvil */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
                    onClick={toggleSidebar}
                    aria-hidden="true"
                />
            )}

            {/* Contenido principal */}
            <main
                className={`flex-1 
                    bg-gray-100 text-gray-900 
                    dark:bg-gray-900 dark:text-gray-100
                    overflow-y-auto transition-all duration-300
                    ${mainMarginClass}`}
            >
                {/* Botón menú móvil */}
                <button
                    onClick={toggleSidebar}
                    className="p-3 fixed top-4 left-4 z-40 
                        bg-white text-gray-900 
                        dark:bg-gray-800 dark:text-gray-100
                        rounded-full shadow-lg lg:hidden"
                    aria-label={
                        isSidebarOpen ? "Cerrar menú" : "Abrir menú"
                    }
                >
                    <svg
                        className="w-6 h-6"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        {isSidebarOpen ? (
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M6 18L18 6M6 6l12 12"
                            />
                        ) : (
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M4 6h16M4 12h16M4 18h16"
                            />
                        )}
                    </svg>
                </button>

                {/* Contenido */}
                <div className="p-4 md:p-8 min-h-screen pt-20 lg:pt-8">
                    {children}
                </div>
            </main>
        </div>
    );
};

export default Layout;
