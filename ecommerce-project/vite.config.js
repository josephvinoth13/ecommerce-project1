import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'




export default defineConfig({ 
  plugins: [react()],
   server: { proxy: { 
    '/api': { 
      target: 'https://ecommerce-backend-ge1d.onrender.com',
       changeOrigin: true,
        secure: true,
       },
        '/images': { target: 'https://ecommerce-backend-ge1d.onrender.com',
           changeOrigin: true, 
           secure: true, 
          }, 
        },
       },
       })
