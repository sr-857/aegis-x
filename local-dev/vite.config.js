import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "path";
export default defineConfig({
    plugins: [react()],
    resolve: {
        alias: [
            { find: "@", replacement: resolve(__dirname, "src") },
        ],
    },
    server: {
        port: 5173,
        host: true,
        strictPort: false,
        hmr: {
            overlay: true,
        },
        proxy: {
            "/api": {
                target: "http://localhost:8000",
                changeOrigin: true,
                rewrite: function (p) { return p.replace(/^\/api/, ""); },
            },
            "/ws": {
                target: "ws://localhost:8000",
                ws: true,
                rewrite: function (p) { return p.replace(/^\/ws/, ""); },
            },
        },
    },
    build: {
        outDir: "dist",
        sourcemap: true,
        rollupOptions: {
            output: {
                manualChunks: {
                    vendor: ["react", "react-dom", "react-router-dom"],
                    ui: ["recharts", "framer-motion"],
                    state: ["zustand", "@tanstack/react-query"],
                },
            },
        },
    },
    optimizeDeps: {
        include: ["react", "react-dom", "zustand", "@tanstack/react-query"],
    },
    define: {
        "process.env": {},
    },
});
