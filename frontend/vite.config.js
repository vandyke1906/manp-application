import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import svgr from 'vite-plugin-svgr';
import dotenv from "dotenv";

dotenv.config();
// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), svgr()],
})
