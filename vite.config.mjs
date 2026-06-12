import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  optimizeDeps: {
    noDiscovery: true,
    include: [],
  },
  plugins: [react()],
});
