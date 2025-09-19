import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Avatar,
  Card,
  CardContent,
  CardHeader,
  useTheme,
  Button,
  Stack,
  TextField,
  IconButton,
  CircularProgress,
  Snackbar,
  Alert,
  alpha,
  InputAdornment,
} from '@mui/material';
import { useAuth } from '../context/AuthContext';
import PersonIcon from '@mui/icons-material/Person';
import ChurchIcon from '@mui/icons-material/Church';
import GroupsIcon from '@mui/icons-material/Groups';
import PublicIcon from '@mui/icons-material/Public';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import GoogleIcon from '@mui/icons-material/Google';
import LogoutIcon from '@mui/icons-material/Logout';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents'; // Trophy Icon
import avatarImage from '../assets/avatar.png';
import { Link } from 'react-router-dom';

const rgbGlowKeyframes = {
  '@keyframes rgb-glow': {
    '0%': { boxShadow: '0 0 10px 5px rgba(255, 182, 193, 0.7)' },
    '25%': { boxShadow: '0 0 10px 5px rgba(135, 206, 250, 0.7)' },
    '50%': { boxShadow: '0 0 10px 5px rgba(144, 238, 144, 0.7)' },
    '75%': { boxShadow: '0 0 10px 5px rgba(255, 255, 224, 0.7)' },
    '100%': { boxShadow: '0 0 10px 5px rgba(255, 182, 193, 0.7)' },
  },
};

const goldShineKeyframes = {
    '@keyframes gold-shine': {
        '0%, 100%': { filter: 'drop-shadow(0 0 5px #FFD700) brightness(1.1)' },
        '50%': { filter: 'drop-shadow(0 0 15px #FFD700) brightness(1.3)' },
    },
};

const AccountPage = () => {
  const { user, updateUserProfile, updateGuestName, signInWithGoogle, signOutUser, loading } = useAuth();
  const theme = useTheme();

  const pulseGlowKeyframes = {
    '@keyframes pulse-glow': {
      '0%': { boxShadow: `0 0 8px 4px ${alpha(theme.palette.primary.main, 0)}` },
      '50%': { boxShadow: `0 0 8px 4px ${alpha(theme.palette.primary.main, 0.7)}` },
      '100%': { boxShadow: `0 0 8px 4px ${alpha(theme.palette.primary.main, 0)}` },
    },
  };

  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileData, setProfileData] = useState({ displayName: '', parish: '', deanery: '', diocese: '' });
  const [isEditingGuestName, setIsEditingGuestName] = useState(false);
  const [guestName, setGuestName] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  useEffect(() => {
    if (user) {
      if (user.isLoggedIn) {
        setProfileData({ displayName: user.name || '', parish: user.parish || '', deanery: user.deanery || '', diocese: user.diocese || '' });
      } else {
        setGuestName(user.name || '');
      }
    }
  }, [user]);

  const handleProfileChange = (e) => setProfileData((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleProfileSave = async () => {
    setIsSaving(true);
    try {
      await updateUserProfile(profileData);
      setIsEditingProfile(false);
      setSnackbar({ open: true, message: 'Cập nhật thông tin thành công!', severity: 'success' });
    } catch (error) {
      setSnackbar({ open: true, message: 'Có lỗi xảy ra, vui lòng thử lại.', severity: 'error' });
    } finally {
      setIsSaving(false);
    }
  };

  const handleGuestNameSave = () => {
    if (guestName.trim()) {
      updateGuestName(guestName);
      setIsEditingGuestName(false);
      setSnackbar({ open: true, message: `Tên đã được đổi thành "${guestName}"!`, severity: 'success' });
    }
  };

  if (loading || !user) {
    return <Container sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}><CircularProgress /></Container>;
  }

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Stack spacing={4} alignItems="center">
        <Card sx={{ width: '100%', textAlign: 'center', p: 3, background: `linear-gradient(145deg, ${theme.palette.background.paper}, ${theme.palette.background.default})`, boxShadow: '0 8px 32px 0 rgba(0,0,0,0.1)', borderRadius: '16px' }}>
          <Avatar src={user.photoURL || avatarImage} alt={user.name} sx={{ ...rgbGlowKeyframes, width: 150, height: 150, m: 'auto', mb: 2, border: `4px solid ${theme.palette.divider}`, animation: 'rgb-glow 4s linear infinite' }} />
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
            {isEditingGuestName ? (
              <TextField value={guestName} onChange={(e) => setGuestName(e.target.value)} variant="standard" autoFocus onBlur={handleGuestNameSave} onKeyPress={(e) => e.key === 'Enter' && handleGuestNameSave()} />
            ) : (
              <Typography variant="h4" component="h1" sx={{ fontFamily: 'Lora', fontWeight: 'bold' }}>{user.name}</Typography>
            )}
            {!user.isLoggedIn && (
              <IconButton onClick={() => isEditingGuestName ? handleGuestNameSave() : setIsEditingGuestName(true)} size="small" sx={{ ...pulseGlowKeyframes, borderRadius: '50%', animation: !isEditingGuestName ? 'pulse-glow 2s infinite' : 'none' }}>
                {isEditingGuestName ? <SaveIcon /> : <EditIcon />}
              </IconButton>
            )}
          </Box>
          <Typography variant="body1" color="text.secondary">{user.email || 'Khách'}</Typography>
        </Card>

        {user.isLoggedIn ? (
          <>
            <Card sx={{ p: 2, background: `linear-gradient(90deg, ${alpha(theme.palette.secondary.main, 0.1)}, ${alpha(theme.palette.background.paper, 0.7)})`, width: '100%', borderRadius: '16px' }}>
                <CardContent>
                    <Stack spacing={1} alignItems="center">
                        <EmojiEventsIcon sx={{ ...goldShineKeyframes, fontSize: 80, color: '#FFD700', animation: 'gold-shine 2.5s infinite' }}/>
                        <Typography variant="h6" sx={{ fontFamily: 'Lora', color: theme.palette.text.secondary }}>Điểm cao nhất</Typography>
                        <Typography variant="h3" sx={{ fontWeight: 'bold', color: theme.palette.primary.main, lineHeight: 1.2 }}>{user.highScore?.toLocaleString() || '0'}</Typography>
                    </Stack>
                </CardContent>
            </Card>

            <Card sx={{ p: 2, background: theme.palette.background.paper, width: '100%', borderRadius: '16px' }}>
              <CardHeader
                action={
                  <IconButton onClick={() => isEditingProfile ? handleProfileSave() : setIsEditingProfile(true)} disabled={isSaving} sx={{ ...pulseGlowKeyframes, borderRadius: '50%', animation: !isEditingProfile && !isSaving ? 'pulse-glow 2s infinite' : 'none' }}>
                    {isSaving ? <CircularProgress size={24} /> : (isEditingProfile ? <SaveIcon /> : <EditIcon />)}
                  </IconButton>}
                title={<Typography variant="h5" sx={{ fontFamily: 'Lora' }}>Thông tin cá nhân</Typography>}
              />
              <CardContent>
                <Stack spacing={3}>
                  <TextField label="Tên hiển thị" name="displayName" value={profileData.displayName} onChange={handleProfileChange} disabled={!isEditingProfile} variant={isEditingProfile ? "outlined" : "filled"} InputProps={{ readOnly: !isEditingProfile, startAdornment: <InputAdornment position="start"><PersonIcon /></InputAdornment> }} />
                  <TextField label="Giáo xứ" name="parish" value={profileData.parish} onChange={handleProfileChange} disabled={!isEditingProfile} variant={isEditingProfile ? "outlined" : "filled"} InputProps={{ readOnly: !isEditingProfile, startAdornment: <InputAdornment position="start"><ChurchIcon /></InputAdornment> }} />
                  <TextField label="Giáo hạt" name="deanery" value={profileData.deanery} onChange={handleProfileChange} disabled={!isEditingProfile} variant={isEditingProfile ? "outlined" : "filled"} InputProps={{ readOnly: !isEditingProfile, startAdornment: <InputAdornment position="start"><GroupsIcon /></InputAdornment> }} />
                  <TextField label="Giáo phận" name="diocese" value={profileData.diocese} onChange={handleProfileChange} disabled={!isEditingProfile} variant={isEditingProfile ? "outlined" : "filled"} InputProps={{ readOnly: !isEditingProfile, startAdornment: <InputAdornment position="start"><PublicIcon /></InputAdornment> }} />
                </Stack>
              </CardContent>
            </Card>

            <Card sx={{ p: 2, background: theme.palette.background.paper, width: '100%', borderRadius: '16px' }}>
              <CardContent sx={{ p: '16px !important' }}>
                <Button onClick={signOutUser} variant="contained" color="error" startIcon={<LogoutIcon />} fullWidth>Đăng xuất</Button>
              </CardContent>
            </Card>
          </>
        ) : (
          <Card sx={{ width: '100%', p: 3, textAlign: 'center', background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`, color: theme.palette.primary.contrastText, borderRadius: '16px' }}>
            <Typography variant="h5" component="h2" sx={{ fontWeight: 'bold', mb: 1, fontFamily: 'Lora' }}>Tham gia cộng đồng!</Typography>
            <Typography sx={{ mb: 2 }}>Đăng nhập để lưu hồ sơ, xem lịch sử chơi và tham gia các hoạt động.</Typography>
            <Button onClick={signInWithGoogle} variant="contained" startIcon={<GoogleIcon />} sx={{ bgcolor: 'white', color: 'black', '&:hover': { bgcolor: '#f0f0f0' } }}>Đăng nhập với Google</Button>
          </Card>
        )}

        <Button component={Link} to="/" variant="outlined" color="primary" startIcon={<ArrowBackIcon />}>Trở Về Trang Chủ</Button>
      </Stack>
      <Snackbar open={snackbar.open} autoHideDuration={4000} onClose={() => setSnackbar({ ...snackbar, open: false })} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
        <Alert onClose={() => setSnackbar({ ...snackbar, open: false })} severity={snackbar.severity} sx={{ width: '100%' }} variant="filled">{snackbar.message}</Alert>
      </Snackbar>
    </Container>
  );
};

export default AccountPage;
