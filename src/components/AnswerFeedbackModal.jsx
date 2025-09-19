import React from 'react';
import { Modal, Box, Typography, Button, Paper, Stack, Divider, Chip } from '@mui/material';
import { CheckCircle, Cancel, AlarmOn, EmojiEvents, Schedule, Help } from '@mui/icons-material';
import { Link } from 'react-router-dom';
import './AnswerFeedbackModal.css';

const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: { xs: '90%', sm: 500 },
  bgcolor: 'background.paper',
  borderRadius: '16px',
  boxShadow: 24,
  p: 4,
  outline: 'none',
};

const getFeedbackDetails = (isCorrect, reason) => {
  if (isCorrect) {
    return {
      icon: <CheckCircle className="feedback-icon correct" />,
      title: 'Chính xác!',
      color: 'success.main',
    };
  }
  if (reason === 'timeout') {
    return {
      icon: <AlarmOn className="feedback-icon incorrect" />,
      title: 'Hết giờ!',
      color: 'error.main',
    };
  }
  return {
    icon: <Cancel className="feedback-icon incorrect" />,
    title: 'Sai rồi!',
    color: 'error.main',
  };
};

const AnswerFeedbackModal = ({
  open,
  isCorrect,
  reason,
  correctAnswer,
  explanation,
  score,
  highScore,
  totalTime,
  onContinue,
  onRetry,
  isLastQuestion,
}) => {
  if (!open) return null;

  const { icon, title, color } = getFeedbackDetails(isCorrect, reason);

  return (
    <Modal open={open} aria-labelledby="feedback-modal-title">
      <Box sx={modalStyle} className="feedback-modal-content">
        <Paper elevation={0} sx={{ textAlign: 'center' }}>
          {icon}
          <Typography id="feedback-modal-title" variant="h3" component="h2" sx={{ fontWeight: 'bold', color, fontFamily: 'Lora' }}>
            {title}
          </Typography>

          <Divider sx={{ my: 2 }} />

          {/* === KHỐI GIẢI THÍCH ĐÃ ĐƯỢC CẬP NHẬT === */}
          <Stack spacing={2} sx={{ my: 2 }}>
            {!isCorrect && (
              <Typography component="div" sx={{ textAlign: 'left' }}>
                <strong>Đáp án đúng:</strong>
                <Chip label={correctAnswer} color="success" variant="outlined" sx={{ ml: 1 }} />
              </Typography>
            )}

            {/* Bố cục giải thích mới, căn giữa */}
            <Box sx={{ textAlign: 'center', mt: 2 }}>
              <Stack direction="row" alignItems="center" justifyContent="center" spacing={1}>
                <Help sx={{ color: 'info.main' }} />
                <Typography variant="h6" component="div" sx={{ fontWeight: 'bold' }}>
                  Giải thích
                </Typography>
              </Stack>
              <Typography variant="body1" sx={{ mt: 1 }}>
                {explanation}
              </Typography>
            </Box>
          </Stack>

          {/* Stats only shown for incorrect/timeout */}
          {!isCorrect && (
            <>
              <Divider sx={{ my: 2 }} />
              <Stack direction="row" justifyContent="space-around" spacing={2} my={2}>
                <Box textAlign="center">
                  <Typography variant="caption" color="text.secondary">Điểm vòng này</Typography>
                  <Typography sx={{ fontWeight: 'bold' }}>{score.toLocaleString()}</Typography>
                </Box>
                <Box textAlign="center">
                  <Typography variant="caption" color="text.secondary">Điểm cao nhất</Typography>
                  <Typography sx={{ fontWeight: 'bold', color: 'primary.main', display: 'flex', alignItems: 'center' }}>
                    <EmojiEvents fontSize="small" sx={{ mr: 0.5 }} /> {highScore.toLocaleString()}
                  </Typography>
                </Box>
                <Box textAlign="center">
                  <Typography variant="caption" color="text.secondary">Thời gian</Typography>
                  <Typography sx={{ fontWeight: 'bold', display: 'flex', alignItems: 'center' }}>
                    <Schedule fontSize="small" sx={{ mr: 0.5 }} /> {totalTime}s
                  </Typography>
                </Box>
              </Stack>
            </>
          )}

          <Divider sx={{ my: 2 }} />

          {/* Action Buttons */}
          <Box mt={3}>
            {isCorrect ? (
              <Button onClick={onContinue} variant="contained" size="large" autoFocus>
                {isLastQuestion ? 'Hoàn thành' : 'Tiếp tục'}
              </Button>
            ) : (
              <Stack direction="row" spacing={2} justifyContent="center">
                <Button onClick={onRetry} variant="outlined" color="secondary">
                  Chơi lại
                </Button>
                <Button component={Link} to="/" variant="contained">
                  Về Trang Chủ
                </Button>
              </Stack>
            )}
          </Box>
        </Paper>
      </Box>
    </Modal>
  );
};

export default AnswerFeedbackModal;
