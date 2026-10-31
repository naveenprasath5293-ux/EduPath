import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import AppRoutes from './routes/AppRoutes';
import ScrollToTop from './routes/ScrollToTop';

export default function App() {
  return (
    <AuthProvider>
      <ScrollToTop />
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: '#FFFFFF',
            color: '#3F3A35',
            border: '1px solid #F3E8D3',
            borderRadius: '12px',
          },
          success: { iconTheme: { primary: '#84CC16', secondary: '#FFFFFF' } },
          error: { iconTheme: { primary: '#D97706', secondary: '#FFFFFF' } },
        }}
      />
      <AppRoutes />
    </AuthProvider>
  );
}
