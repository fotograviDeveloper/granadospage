import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // ------------------------------------------------------------------
  // CAMBIO CLAVE: Volvemos a la ruta absoluta (/) para la raíz del dominio
  base: '/', 
  // ------------------------------------------------------------------
})