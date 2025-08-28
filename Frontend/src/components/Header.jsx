import React from "react";
import { useTheme } from "./ThemeContext";

const Header = () => {
  const { theme, toggleTheme } = useTheme();
  return (
    <header className="bg-blue-600 text-white p-4 shadow-md dark:bg-gray-800">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-2xl font-bold">Weather App</h1>
        <button
          onClick={toggleTheme}
          className="ml-4 px-3 py-1 rounded bg-white text-blue-600 dark:bg-gray-700 dark:text-white border border-blue-600 dark:border-gray-500 transition"
        >
          {theme === "light" ? "🌙 Dark" : "☀️ Light"}
        </button>
      </div>
    </header>
  );
};

export default Header;
