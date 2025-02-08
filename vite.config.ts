import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: '/marie/', // Remplace <nom-de-ton-depot> par le nom réel de ton dépôt
});
