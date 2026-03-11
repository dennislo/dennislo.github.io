import { useTheme } from "../../context/ThemeContext";
import TablerMoon from "../icons/TablerMoon";
import TablerSun from "../icons/TablerSun";

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      className="fixed bottom-6 right-6 z-50 flex items-center justify-center w-10 h-10 rounded-full bg-white dark:bg-gray-800 shadow-md border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:shadow-lg transition-all duration-300"
      onClick={toggleTheme}
      aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
      title={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
    >
      {theme === "light" ? (
        <TablerMoon className="h-5 w-5" />
      ) : (
        <TablerSun className="h-5 w-5" />
      )}
    </button>
  );
};

export default ThemeToggle;
