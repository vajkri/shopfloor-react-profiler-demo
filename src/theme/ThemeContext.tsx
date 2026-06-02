import {
  createContext,
  useContext,
  useState,
  type ReactNode,
} from "react";

export type Theme = "light" | "dark";

interface ThemeContextValue {
  theme: Theme;
  /** Accent color for the current theme — read by lots of components. */
  accent: string;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>("light");

  const toggleTheme = () =>
    setTheme((t) => (t === "light" ? "dark" : "light"));

  const accent = theme === "light" ? "#7b3fe4" : "#c9a7ff";

  // 🐞 ISSUE #5 (context value churn / too broad):
  // This object is rebuilt on every render of the provider, so its identity
  // changes every time. EVERY component that calls useTheme() — including all
  // ~600 ProductRows — re-renders whenever this value changes. Flip the theme
  // and watch the Profiler: the entire catalog commits in one go, just to
  // change an accent colour that CSS could have handled for free.
  return (
    <ThemeContext.Provider value={{ theme, accent, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within <ThemeProvider>");
  return ctx;
}
