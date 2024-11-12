import react from "@vitejs/plugin-react"
import { defineConfig } from "vitest/config"

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: { "@/": new URL("./", import.meta.url).pathname },
  },
  test: {
    environment: "jsdom",
    setupFiles: [".test.setup.ts"],
    globals: true,
  },
})
