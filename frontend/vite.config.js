import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    https: {
      key: "./key.pem",
      cert: "./cert.pem",
    },
    host: true,
    port: 3000, // Ensure this matches your expected port
  },
});
