import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': 'http://localhost:5001' // Redirige toutes les requêtes /api vers le backend
    },
    port: 5174 // Fixe le port de Vite
  }
});
