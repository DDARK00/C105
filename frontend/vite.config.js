import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc"; // SWC 버전의 플러그인 사용
import compression from "vite-plugin-compression";

export default defineConfig({
  plugins: [
    react(),
    compression({
      algorithm: "brotliCompress", // Brotli 압축 알고리즘 사용
      ext: ".br", // 확장자 설정
      threshold: 10240, // 압축할 파일 크기 (바이트 단위), 10KB 이상의 파일만 압축
      deleteOriginFile: false, // 원본 파일 유지
    }),
  ],
  server: {
    host: "0.0.0.0",
    hmr: {
      protocol: "ws",
    },
    proxy: {
      "/api": {
        target: "http://localhost:8080",
        changeOrigin: true,
      },
      "/ws": {
        target: "ws://localhost:8080",
        ws: true,
      },
    },
  },
});
