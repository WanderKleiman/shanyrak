import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: '/',
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: {
        main: 'index.html',
        payment: 'payment.html',
        reports: 'reports.html',
        admin: 'admin.html',
        'admin-access': 'admin-access.html',
        fund: 'fund.html',
        'about-fund': 'about-fund.html',
        documents: 'documents.html',
        contacts: 'contacts.html',
        companies: 'companies.html',
        'partner-funds': 'partner-funds.html'
      }
    }
  }
});
