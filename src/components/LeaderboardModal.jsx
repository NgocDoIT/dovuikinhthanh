import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Typography,
  Box,
  List,
  ListItem,
  ListItemAvatar,
  Avatar,
  ListItemText,
  useTheme,
  CircularProgress,
  Button,
  Divider
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import LoginIcon from '@mui/icons-material/Login';
import { useNavigate } from 'react-router-dom';

const LeaderboardModal = ({ open, onClose, leaderboardData, loading, user }) => {
  const theme = useTheme();
  const navigate = useNavigate();

  const handleNavigateToAccount = () => {
    onClose(); 
    navigate('/account'); 
  };

  const rankColors = {
    1: '#FFD700', // Gold
    2: '#C0C0C0', // Silver
    3: '#CD7F32'  // Bronze
  };

  // Helper function to format location string
  const formatLocation = (parish, diocese) => {
    const parishText = parish ? `Giáo xứ ${parish}` : '';
    const dioceseText = diocese ? `Giáo phận ${diocese}` : '';

    if (parishText && dioceseText) {
      return `${parishText}, ${dioceseText}`;
    }
    return parishText || dioceseText || 'Chưa cập nhật thông tin';
  };

  return (
    <Dialog 
        open={open} 
        onClose={onClose} 
        fullWidth 
        maxWidth="sm" 
        PaperProps={{ sx: { borderRadius: '16px' } }}
    >
      <DialogTitle sx={{ m: 0, p: 2, display: 'flex', alignItems: 'center' }}>
        <EmojiEventsIcon sx={{ color: rankColors[1], mr: 1.5, alignSelf: 'flex-start', mt: 0.5 }}/>
        <Box sx={{ flexGrow: 1 }}>
            <Typography variant="h6" component="div">
                Bảng Vinh Danh
            </Typography>
            <Typography variant="body2" color="text.secondary">
                Chúc mừng top 20 người chơi có điểm số cao nhất trong thời gian ngắn nhất
            </Typography>
        </Box>
        <IconButton aria-label="close" onClick={onClose} sx={{ color: (theme) => theme.palette.grey[500], alignSelf: 'flex-start' }}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers sx={{ p: 0 }}>
        {user ? (
            loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', my: 4}}>
                    <CircularProgress />
                </Box>
            ) : leaderboardData && leaderboardData.length > 0 ? (
              <List sx={{ py: 0 }}>
                {leaderboardData.map((player, index) => (
                  <React.Fragment key={player.uid}>
                    <ListItem sx={{ py: 1.5 }}>
                      <Typography sx={{ fontWeight: 'bold', width: '40px', textAlign: 'center', color: rankColors[index + 1] }}>
                        {index + 1}
                      </Typography>
                      <ListItemAvatar sx={{ ml: 1 }}>
                          <Avatar alt={player.displayName} src={player.photoURL} />
                      </ListItemAvatar>
                      <ListItemText 
                          primary={player.displayName}
                          primaryTypographyProps={{ fontWeight: '500' }}
                          secondary={formatLocation(player.parish, player.diocese)}
                      />
                      <Typography sx={{ fontWeight: 'bold', color: theme.palette.primary.main }}>
                        {player.highScore} điểm
                      </Typography>
                    </ListItem>
                    {index < leaderboardData.length - 1 && <Divider variant="inset" component="li" />}
                  </React.Fragment>
                ))}
              </List>
            ) : (
                <Typography sx={{ textAlign: 'center', my: 4 }}>
                    Chưa có ai trên bảng xếp hạng. Hãy là người đầu tiên!
                </Typography>
            )
        ) : (
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', py: 4, px: 2}}>
                <Typography variant="h6" gutterBottom>
                    Tham gia Bảng Vinh Danh!
                </Typography>
                <Typography sx={{ mb: 3 }}>
                    Vui lòng đăng nhập bằng tài khoản Google để tên của bạn được vinh danh và xem thứ hạng của mọi người.
                </Typography>
                <Button 
                    variant="contained" 
                    startIcon={<LoginIcon />} 
                    onClick={handleNavigateToAccount}
                >
                    Đăng nhập / Đăng ký
                </Button>
            </Box>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default LeaderboardModal;
