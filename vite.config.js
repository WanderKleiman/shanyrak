import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig({
  plugins: [react()],
  base: '/',
  build: {
    outDir: 'dist',
    minify: 'terser',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: resolve('index.html'),
        payment: resolve('payment.html'),
        reports: resolve('reports.html'),
        admin: resolve('admin.html'),
        'admin-access': resolve('admin-access.html'),
        fund: resolve('fund.html'),
        'about-fund': resolve('about-fund.html'),
        documents: resolve('documents.html'),
        contacts: resolve('contacts.html'),
        companies: resolve('companies.html'),
        'partner-funds': resolve('partner-funds.html')
      }
    }
  }
});
