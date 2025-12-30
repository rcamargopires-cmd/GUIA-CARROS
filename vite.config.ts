import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  root: './', // Garante que ele olhe na pasta principal
  base: './', // Ajuda a Vercel a encontrar os caminhos dos arquivos
  build: {
    outDir: 'dist',
  }
})
