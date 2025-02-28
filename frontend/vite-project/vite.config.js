import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react"; // Ensure this is imported

export default defineConfig({
  plugins: [
    react(), // Add this plugin
    tailwindcss(),
  ],
});
