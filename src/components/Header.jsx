import React, { useState, useEffect, useContext, useMemo } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Box,
  useTheme,
  Fade,
  Avatar,
} from '@mui/material';
import { Link } from 'react-router-dom';
import { ColorModeContext } from '../App';
import { useAuth } from '../context/AuthContext';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import avatarImage from '../assets/avatar.png';

const baseMessages = [
  '✝️Bước đi cùng Chúa–Vững tin trọn đời',
  '🌟Đức tin soi đường, tình thương dẫn lối',
  '🙏Một hành trình–Một niềm tin–Một tình yêu',
  '💖Sống Tin–Sống Cậy–Sống Mến',
];


const glowKeyframes = {
  '@keyframes rgb-glow': {
    '0%': { boxShadow: '0 0 3px 2px rgba(255, 182, 193, 0.7)' },
    '25%': { boxShadow: '0 0 3px 2px rgba(135, 206, 250, 0.7)' },
    '50%': { boxShadow: '0 0 3px 2px rgba(144, 238, 144, 0.7)' },
    '75%': { boxShadow: '0 0 3px 2px rgba(255, 255, 224, 0.7)' },
    '100%': { boxShadow: '0 0 3px 2px rgba(255, 182, 193, 0.7)' },
  },
};

const Header = () => {
  const theme = useTheme();
  const colorMode = useContext(ColorModeContext);
  const { user } = useAuth();

  const dynamicMessages = useMemo(() => {
    return user ? [`Xin chào, ${user.name}!`, ...baseMessages] : baseMessages;
  }, [user]);

  const [messageIndex, setMessageIndex] = useState(0);
  const [showText, setShowText] = useState(true);

  useEffect(() => {
    const textChangeInterval = setInterval(() => {
      setShowText(false);
      setTimeout(() => {
        setMessageIndex((prevIndex) => (prevIndex + 1) % dynamicMessages.length);
        setShowText(true);
      }, 500);
    }, 5000);

    return () => clearInterval(textChangeInterval);
  }, [dynamicMessages.length]);

  return (
    <AppBar
      position="static"
      sx={{ 
        background: theme.palette.background.paper, 
        color: theme.palette.text.primary, 
        boxShadow: 'none', 
        borderBottom: `1px solid ${theme.palette.divider}`
      }}
    >
      <Toolbar sx={{ justifyContent: 'space-between', alignItems: 'center' }}>
        {/* Left Section */}
        <Box sx={{ display: 'flex', alignItems: 'center', flexShrink: 0 }}>
          <IconButton sx={{ mr: 1 }} onClick={colorMode.toggleColorMode} color="inherit">
            {theme.palette.mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
          </IconButton>
        </Box>

        {/* Center Section: Dynamic Message */}
        <Box sx={{ flex: 1, minWidth: 0, mx: { xs: 1, sm: 2 }, textAlign: 'center' }}>
            <Fade in={showText} timeout={500}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '2.5rem' }}>
                    <Typography
                        noWrap
                        sx={{
                            width: '100%',
                            fontSize: 'clamp(0.6rem, 2.5vw, 1.25rem)',
                            lineHeight: 1.6,
                            fontWeight: 'bold',
                            fontFamily: 'Lora',
                        }}
                    >
                        {dynamicMessages[messageIndex]}
                    </Typography>
                </Box>
            </Fade>
        </Box>

        {/* Right Section */}
        <Box sx={{ display: 'flex', alignItems: 'center', flexShrink: 0 }}>
          <IconButton component={Link} to="/account" sx={{ p: 0 }}>
              <Avatar 
                alt={user?.name || "User Avatar"}
                src={user?.photoURL || avatarImage} 
                sx={{
                  ...glowKeyframes,
                  animation: 'rgb-glow 4s linear infinite',
                  cursor: 'pointer',
                }}
              />
          </IconButton>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
