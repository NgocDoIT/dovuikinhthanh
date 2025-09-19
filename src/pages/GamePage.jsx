import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Paper,
  useTheme,
  Fade,
  LinearProgress,
  Chip,
  Stack,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { questions } from '../data/questions';
import TimerIcon from '@mui/icons-material/Timer';
import AnswerFeedbackModal from '../components/AnswerFeedbackModal';
import GameSummary from '../components/GameSummary';
import './GamePage.css';

const TIME_LIMIT = 15;

const shuffleArray = (array) => {
  const newArr = [...array];
  for (let i = newArr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArr[i], newArr[j]] = [newArr[j], newArr[i]];
  }
  return newArr;
};

const GamePage = () => {
  const theme = useTheme();
  const { user, updateUserHighScore } = useAuth();
  const navigate = useNavigate();

  const [gameState, setGameState] = useState('playing');
  const [shuffledQuestions, setShuffledQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(TIME_LIMIT);
  const [totalPlayTime, setTotalPlayTime] = useState(0);
  const [modalState, setModalState] = useState({ open: false });

  const timerRef = useRef(null);
  const totalTimeRef = useRef(null);

  const startNewGame = useCallback(() => {
    setGameState('playing');
    const shuffled = shuffleArray(questions).map(q => ({ ...q, options: shuffleArray(q.options) }));
    setShuffledQuestions(shuffled);
    setCurrentQuestionIndex(0);
    setScore(0);
    setTotalPlayTime(0);
    setModalState({ open: false });
  }, []);

  useEffect(() => {
    startNewGame();
    return () => {
      clearInterval(timerRef.current);
      clearInterval(totalTimeRef.current);
    };
  }, [startNewGame]);

  const startTimers = useCallback(() => {
    setTimeLeft(TIME_LIMIT);
    clearInterval(timerRef.current);
    clearInterval(totalTimeRef.current);
    timerRef.current = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
    totalTimeRef.current = setInterval(() => setTotalPlayTime(prev => prev + 1), 1000);
  }, []);

  useEffect(() => {
    if (gameState === 'playing' && shuffledQuestions.length > 0) {
      startTimers();
    }
  }, [currentQuestionIndex, gameState, shuffledQuestions, startTimers]);

  const showFeedback = useCallback((isCorrect, reason = null) => {
    clearInterval(timerRef.current);
    clearInterval(totalTimeRef.current);
    let newScore = score + (isCorrect ? 1 : 0);
    setScore(newScore);
    if (user?.isLoggedIn && newScore > (user.highScore || 0)) {
      updateUserHighScore(newScore);
    }
    setGameState('feedback');
    setModalState({
      open: true,
      isCorrect,
      reason,
      correctAnswer: shuffledQuestions[currentQuestionIndex].answer,
      explanation: shuffledQuestions[currentQuestionIndex].explanation, 
      score: newScore,
      highScore: user?.highScore || 0,
      totalTime: totalPlayTime,
      isLastQuestion: currentQuestionIndex === shuffledQuestions.length - 1,
    });
  }, [score, currentQuestionIndex, shuffledQuestions, user, totalPlayTime, updateUserHighScore]);

  useEffect(() => {
    if (timeLeft <= 0 && gameState === 'playing') {
      showFeedback(false, 'timeout');
    }
  }, [timeLeft, gameState, showFeedback]);

  const handleAnswerClick = (option) => {
    if (gameState !== 'playing') return;
    showFeedback(option === shuffledQuestions[currentQuestionIndex].answer);
  };

  const handleContinue = () => {
    setModalState({ open: false });
    if (currentQuestionIndex + 1 < shuffledQuestions.length) {
      setCurrentQuestionIndex(prev => prev + 1);
      setGameState('playing');
    } else {
      setGameState('summary');
    }
  };

  const handleRetry = () => startNewGame();

  if (shuffledQuestions.length === 0) {
    return <Container sx={{ textAlign: 'center', mt: 8 }}><Typography>Đang tải trò chơi...</Typography></Container>;
  }

  if (gameState === 'summary') {
    return <GameSummary score={score} totalTime={totalPlayTime} onRetry={handleRetry} />;
  }

  const currentQuestion = shuffledQuestions[currentQuestionIndex];
  const progress = (timeLeft / TIME_LIMIT) * 100;

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center', 
        gap: theme.spacing(3), 
        minHeight: '100vh',
        py: { xs: 2, sm: 3 },
        px: { xs: 1, sm: 2 },
      }}
    >
      {/* Top Section: Score, Progress, Timer */}
      <Stack spacing={2} alignItems="center" sx={{ width: '100%', maxWidth: '768px' }}>
        <Box className="score-glow-box">
          <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'common.white', fontFamily: 'monospace' }}>
            {score}
          </Typography>
        </Box>
        <Box sx={{ width: '100%' }}>
          <LinearProgress
            variant="determinate"
            value={progress}
            color={progress > 60 ? "success" : progress > 30 ? "warning" : "error"}
            sx={{ height: 10, borderRadius: 5, animation: 'pulse-bg 2s infinite' }}
          />
        </Box>
        <Chip icon={<TimerIcon />} label={`${timeLeft < 0 ? 0 : timeLeft}s`} variant="outlined" />
      </Stack>

      {/* Middle Section: Question Card */}
      <Box sx={{ width: '100%', maxWidth: '768px' }}>
        <Fade in={gameState === 'playing'} key={currentQuestion.id}>
          <Paper elevation={4} className="question-card" sx={{ width: '100%', p: { xs: 2, sm: 3 } }}>
            <Typography
              component="h1"
              sx={{
                fontFamily: 'Lora',
                textAlign: 'center',
                fontWeight: '500',
                fontSize: { xs: '1.2rem', sm: '1.5rem', md: '1.75rem' },
              }}
            >
              {currentQuestion.question}
            </Typography>
          </Paper>
        </Fade>
      </Box>

      {/* Bottom Section: Answer Buttons */}
      <Box sx={{ width: '100%', maxWidth: '768px' }}>
        <Box display="flex" flexWrap="wrap" mx={-1}>
          {currentQuestion.options.map((option) => (
            <Box key={option} width={{ xs: 1, sm: 1 / 2 }} p={1}>
              <Button
                fullWidth
                variant='outlined'
                disabled={gameState !== 'playing'}
                onClick={() => handleAnswerClick(option)}
                sx={{
                  minHeight: '64px',
                  borderRadius: '16px',
                  textTransform: 'none',
                  justifyContent: 'center', // CĂN GIỮA NỘI DUNG
                  p: 2,
                  fontSize: { xs: '0.9rem', sm: '1rem' },
                  boxShadow: '0 4px 6px rgba(0,0,0,0.05)', // Thêm shadow nhẹ
                  transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out', // Thêm transition mượt mà
                  '&:hover': {
                    transform: 'scale(1.03)', // Phóng to khi hover
                    boxShadow: '0 6px 12px rgba(0,0,0,0.1)', // Tăng shadow khi hover
                    backgroundColor: theme.palette.action.hover, // Thêm màu nền nhẹ khi hover
                  },
                  '&:disabled': {
                    boxShadow: 'none',
                  }
                }}
              >
                {option}
              </Button>
            </Box>
          ))}
        </Box>
      </Box>

      <AnswerFeedbackModal {...modalState} onContinue={handleContinue} onRetry={handleRetry} />
    </Box>
  );
};

export default GamePage;
