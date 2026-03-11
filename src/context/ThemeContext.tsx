import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

type Theme = "light" | "dark";

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function getTimeBasedTheme(): Theme {
  const now = new Date();
  const timeInMinutes = now.getHours() * 60 + now.getMinutes();
  const startLight = 7 * 60 + 30; // 7:30 AM = 450 minutes
  const endLight = 19 * 60 + 30; // 7:30 PM = 1170 minutes
  return timeInMinutes >= startLight && timeInMinutes < endLight
    ? "light"
    : "dark";
}

const VALID_THEMES: Theme[] = ["light", "dark"];

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [theme, setTheme] = useState<Theme>("dark");

  useEffect(() => {
    const themeSource = localStorage.getItem("theme-source");
    const rawSavedTheme = localStorage.getItem("theme");
    const savedTheme: Theme | null =
      rawSavedTheme && VALID_THEMES.includes(rawSavedTheme as Theme)
        ? (rawSavedTheme as Theme)
        : null;
    if (themeSource === "manual" && savedTheme) {
      setTheme(savedTheme);
    } else {
      setTheme(getTimeBasedTheme());
    }
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prevTheme) => {
      const newTheme = prevTheme === "light" ? "dark" : "light";
      localStorage.setItem("theme-source", "manual");
      localStorage.setItem("theme", newTheme);
      return newTheme;
    });
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};
