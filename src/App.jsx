import React, { useState, useMemo, Suspense, lazy, useEffect } from 'react';
import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme, CssBaseline, CircularProgress, Box } from '@mui/material';
import Header from './components/Header';
import HomePage from './pages/HomePage';
import SplashScreen from './components/SplashScreen';
import { lightTheme, darkTheme } from './theme';
import { AuthProvider } from './context/AuthContext';

// Các trang được tải lười (lazy-loaded pages)
const GamePage = lazy(() => import('./pages/GamePage'));
const AccountPage = lazy(() => import('./pages/AccountPage'));

// Hàm để tải trước các module mã nguồn
const preloadPages = () => {
  return Promise.all([
    import('./pages/GamePage'),
    import('./pages/AccountPage')
  ]);
};

export const ColorModeContext = React.createContext({ toggleColorMode: () => {} });

const LoadingFallback = () => (
  <Box display="flex" justifyContent="center" alignItems="center" height="calc(100vh - 64px)">
    <CircularProgress />
  </Box>
);

const AppLayout = () => {
  const location = useLocation();
  const isGamePage = location.pathname.endsWith('/game');

  return (
    <>
      {!isGamePage && <Header />}
      <main>
        <Suspense fallback={<LoadingFallback />}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/game" element={<GamePage />} />
            <Route path="/account" element={<AccountPage />} />
          </Routes>
        </Suspense>
      </main>
    </>
  );
}

function App() {
  const [mode, setMode] = useState('light');
  const [isAppLoading, setIsAppLoading] = useState(true); 

  useEffect(() => {
    const initializeApp = async () => {
      try {
        await preloadPages();
        
        // TĂNG THỜI GIAN CHỜ LÊN 5 GIÂY
        await new Promise(resolve => setTimeout(resolve, 5000)); 

      } catch (error) {
        console.error("Không thể khởi tạo ứng dụng:", error);
      } finally {
        setIsAppLoading(false);
      }
    };

    initializeApp();
  }, []);

  const colorMode = useMemo(
    () => ({
      toggleColorMode: () => {
        setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
      },
    }),
    [],
  );

  const theme = useMemo(() => createTheme(mode === 'light' ? lightTheme : darkTheme), [mode]);

  if (isAppLoading) {
    return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <SplashScreen />
      </ThemeProvider>
    );
  }

  return (
    <ColorModeContext.Provider value={colorMode}>
      <AuthProvider>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <AppLayout />
        </ThemeProvider>
      </AuthProvider>
    </ColorModeContext.Provider>
  );
}

export default App;
