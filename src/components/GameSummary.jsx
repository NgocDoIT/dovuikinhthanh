import React from 'react';
import {
  Container,
  Paper,
  Typography,
  Box,
  Button,
  Stack,
  Divider,
  useTheme,
} from '@mui/material';
import { Link } from 'react-router-dom';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import ReplayIcon from '@mui/icons-material/Replay';
import HomeIcon from '@mui/icons-material/Home';
import CelebrationIcon from '@mui/icons-material/Celebration';

const GameSummary = ({ score, totalTime, onRetry }) => {
  const theme = useTheme();

  return (
    <Container maxWidth="sm" sx={{ textAlign: 'center', mt: { xs: 4, sm: 8 } }}>
      <Paper 
        elevation={5} 
        sx={{
          p: 4, 
          borderRadius: '16px',
          background: `linear-gradient(145deg, ${theme.palette.background.paper}, ${theme.palette.background.default})`,
          border: `1px solid ${theme.palette.divider}`
        }}
      >
        <CelebrationIcon sx={{ fontSize: 70, color: 'warning.main' }} />
        <Typography variant="h3" sx={{ fontFamily: 'Lora', fontWeight: 'bold', color: theme.palette.primary.main, my: 1 }}>
          Vòng chơi kết thúc!
        </Typography>
        <Typography variant="h6" color="text.secondary">
          Bạn đã hoàn thành tất cả các câu hỏi.
        </Typography>

        <Divider sx={{ my: 3 }} />

        <Stack direction={{xs: 'column', sm: 'row'}} justifyContent="space-around" spacing={2}>
          <Box>
            <Typography variant="button" color="text.secondary">Điểm cuối cùng</Typography>
            <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
              {score}
            </Typography>
          </Box>
          <Box>
            <Typography variant="button" color="text.secondary">Tổng thời gian</Typography>
            <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
              {totalTime}s
            </Typography>
          </Box>
        </Stack>

        <Divider sx={{ my: 3 }} />

        <Stack direction={{xs: 'column', sm: 'row'}} spacing={2} justifyContent="center">
          <Button onClick={onRetry} variant="outlined" startIcon={<ReplayIcon />}>
            Chơi lại
          </Button>
          <Button component={Link} to="/" variant="contained" startIcon={<HomeIcon />}>
            Về Trang Chủ
          </Button>
        </Stack>
      </Paper>
    </Container>
  );
};

export default GameSummary;
