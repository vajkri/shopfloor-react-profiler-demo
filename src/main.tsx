import { createRoot } from "react-dom/client";
import App from "./App";
import { ThemeProvider } from "./theme/ThemeContext";
import "./styles.css";

// NOTE: <StrictMode> is intentionally LEFT OUT for this hackathon.
// StrictMode double-invokes renders in development, which doubles the commits
// you see in the Profiler and muddies the "why did this render?" story for
// people meeting the tool for the first time. Re-enabling it afterwards (and
// discussing why it double-renders) makes a great follow-up. See FACILITATOR.md.
createRoot(document.getElementById("root")!).render(
  <ThemeProvider>
    <App />
  </ThemeProvider>,
);
