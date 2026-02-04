import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig({
  plugins: [react()],
  base: '/',
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        payment: resolve(__dirname, 'payment.html'),
        reports: resolve(__dirname, 'reports.html'),
        admin: resolve(__dirname, 'admin.html'),
        'admin-access': resolve(__dirname, 'admin-access.html'),
        fund: resolve(__dirname, 'fund.html'),
        'about-fund': resolve(__dirname, 'about-fund.html'),
        documents: resolve(__dirname, 'documents.html'),
        contacts: resolve(__dirname, 'contacts.html'),
        companies: resolve(__dirname, 'companies.html'),
        'partner-funds': resolve(__dirname, 'partner-funds.html')
      }
    }
  }
});

