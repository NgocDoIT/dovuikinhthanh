import React, { useState } from 'react';
import {
    Container,
    Typography,
    Paper,
    Box,
    Button,
    Avatar,
    Grow,
    Tooltip,
    IconButton,
    Chip
} from '@mui/material';
import {
    Link
} from 'react-router-dom';
import {
    PlayCircleFilled as PlayIcon,
    EmojiEvents, // SỬA LỖI: Import trực tiếp, không đổi tên
    AccountCircle as ProfileIcon,
    Login as LoginIcon,
    Stars as StarsIcon
} from '@mui/icons-material';
import LeaderboardModal from '../components/LeaderboardModal';
import { useAuth } from '../context/AuthContext';
import './HomePage.css';

const HomePage = () => {
    const { user, getLeaderboardData } = useAuth();
    const [leaderboardOpen, setLeaderboardOpen] = useState(false);
    const [leaderboardData, setLeaderboardData] = useState([]);
    const [loading, setLoading] = useState(false);

    const handleOpenLeaderboard = async () => {
        setLeaderboardOpen(true);
        setLoading(true);
        try {
            const data = await getLeaderboardData();
            setLeaderboardData(data);
        } catch (error) {
            console.error("Lỗi khi lấy dữ liệu bảng xếp hạng:", error);
            setLeaderboardData([]);
        } finally {
            setLoading(false);
        }
    };

    const handleCloseLeaderboard = () => {
        setLeaderboardOpen(false);
    };

    // Hàm quyết định thông điệp khuyến khích
    const getIncentiveMessage = () => {
        if (!user) {
            return {
                text: "Đăng nhập bằng Google để tham gia đua top!",
                icon: <LoginIcon fontSize="small" sx={{ mr: 0.5 }}/>,
                color: "secondary"
            };
        }
        if (user.highScore < 30) {
            return {
                text: `Cố lên! Bạn cần thêm ${30 - user.highScore} điểm nữa để vào bảng xếp hạng.`,
                icon: <StarsIcon fontSize="small" sx={{ mr: 0.5 }}/>,
                color: "warning"
            };
        }
        return {
            text: "Chúc mừng bạn đã có tên trong danh sách đua top!",
            icon: <EmojiEvents fontSize="small" sx={{ mr: 0.5 }}/>, // Bây giờ sẽ hoạt động
            color: "success"
        };
    };

    const incentive = getIncentiveMessage();

    return (
        <div className="home-container">
            <Grow in={true} timeout={800}>
                <Paper className="home-card">
                    {/* Profile Section */}
                    <Box className="profile-section">
                        <Avatar 
                            alt={user ? user.displayName : "Guest"}
                            src={user ? user.photoURL : '/src/assets/avatar.png'} 
                            className="profile-avatar"
                        />
                        <Typography variant="h5" component="h2" sx={{ fontWeight: 'bold' }}>
                            {user ? user.displayName : 'Khách'}
                        </Typography>
                        <Typography variant="body1" color="text.secondary">
                            Điểm Cao Nhất: {user ? user.highScore.toLocaleString() : 0}
                        </Typography>
                    </Box>

                    {/* Game Title Section */}
                    <Typography variant="h1" className="game-title">
                        Hành Trình Đức Tin
                    </Typography>
                    <Typography variant="h6" className="game-subtitle">
                        Khám phá và củng cố kiến thức đức tin của bạn.
                    </Typography>

                    {/* DYNAMIC INCENTIVE MESSAGE */}
                    <Chip 
                        icon={incentive.icon}
                        label={incentive.text}
                        color={incentive.color}
                        variant="outlined"
                        sx={{ mt: 2, mb: 2, p: 2, fontSize: '1rem'}} // Tăng padding và font size
                    />

                    {/* Main Action Button */}
                    <Box className="action-buttons">
                        <Button
                            component={Link}
                            to="/game"
                            variant="contained"
                            className="play-button"
                            startIcon={<PlayIcon />}
                        >
                            Chơi Ngay!
                        </Button>
                    </Box>
                    
                    {/* Secondary Action Buttons */}
                    <Box className="secondary-action-buttons">
                        <Tooltip title="Bảng Xếp Hạng">
                            <IconButton color="primary" onClick={handleOpenLeaderboard}>
                                <EmojiEvents fontSize="large" /> 
                            </IconButton>
                        </Tooltip>
                        <Tooltip title="Hồ Sơ Của Bạn">
                            <IconButton color="secondary" component={Link} to="/account">
                                <ProfileIcon fontSize="large" />
                            </IconButton>
                        </Tooltip>
                    </Box>

                </Paper>
            </Grow>

            <LeaderboardModal
                open={leaderboardOpen}
                onClose={handleCloseLeaderboard}
                leaderboardData={leaderboardData}
                loading={loading}
                user={user}
            />
        </div>
    );
};

export default HomePage;
