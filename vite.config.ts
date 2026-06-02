import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true, // bind 0.0.0.0 so cloud IDEs (CodeSandbox/StackBlitz) can reach it
    // Vite 5.4.12+ blocks requests whose Host header isn't allow-listed (a CVE
    // fix). CodeSandbox proxies arrive as *.csb.app, so allow them through —
    // otherwise the dev server 403s and the proxy reports a 502 Bad Gateway.
    allowedHosts: true,
  },
});
