import React from 'react';
import { Box, CircularProgress, Typography, keyframes } from '@mui/material';
// Import icon từ 'react-icons/fa6' (Font Awesome 6)
import { FaBookBible } from "react-icons/fa6";

// Hiệu ứng Fade-in
const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

// Hiệu ứng "glow" cho icon
const glow = keyframes`
  0%, 100% {
    text-shadow: 0 0 5px #fff, 0 0 10px #fff, 0 0 15px #FFD700, 0 0 20px #FFD700;
  }
  50% {
    text-shadow: 0 0 10px #fff, 0 0 20px #FFD700, 0 0 30px #FFD700, 0 0 40px #FFD700;
  }
`;

const SplashScreen = () => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        backgroundColor: 'background.default',
        color: 'text.primary',
        textAlign: 'center',
        animation: `${fadeIn} 1.5s ease-in-out`,
      }}
    >
      {/* Sử dụng icon FaBookBible từ Font Awesome */}
      <FaBookBible 
        size={80} 
        style={{ 
          marginBottom: '24px',
          color: '#FFD700', // Màu vàng gold
          animation: `${glow} 2.5s infinite`
        }} 
      />
      <Typography 
        variant="h4" 
        component="h1" 
        gutterBottom
        sx={{ 
          fontWeight: 'bold',
          letterSpacing: '1px'
        }}
      >
        Đố Vui Kinh Thánh
      </Typography>
      <CircularProgress color="primary" sx={{ marginTop: '20px' }} />
      <Typography variant="caption" sx={{ marginTop: '16px', fontStyle: 'italic' }}>
        Đang tải... Xin chờ trong giây lát
      </Typography>
    </Box>
  );
};

export default SplashScreen;
