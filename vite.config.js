import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // Vite defaults the output directory to 'dist', but Firebase Hosting 
  // typically expects 'build' or 'public'. You may need to update your
  // firebase.json hosting path if you keep this default.
  build: {
    outDir: 'public', // Force output directory to 'build' for Firebase compatibility
    sourcemap: true,
  }
});