import {
  createContext,
  useCallback,
  useContext,
  useMemo,
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

  // ✅ FIX #5 (hygiene): a stable toggler + a memoized value object so the
  // provider doesn't hand out a fresh identity on unrelated re-renders. The
  // bigger win, though, was upstream: rows no longer consume this context for
  // styling (see ProductRow / styles.css), so a theme flip re-renders nothing
  // in the catalog.
  const toggleTheme = useCallback(
    () => setTheme((t) => (t === "light" ? "dark" : "light")),
    [],
  );

  const accent = theme === "light" ? "#7b3fe4" : "#c9a7ff";

  const value = useMemo(
    () => ({ theme, accent, toggleTheme }),
    [theme, accent, toggleTheme],
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within <ThemeProvider>");
  return ctx;
}
