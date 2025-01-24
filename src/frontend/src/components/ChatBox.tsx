import React from 'react';
import { Box, Button, TextField, Typography, useTheme} from '@mui/material';
import { useGameContext } from '../contexts/GameContext';

function ChatBox() {
    const theme = useTheme();

    const { roomName } = useGameContext();
    return (
        <Box
            sx={{
                width: '300px',
                height: '400px',
                padding: '10px',
                border: '1px solid #ccc',
                borderRadius: '8px',
                display: 'flex',
                flexDirection: 'column',
                backgroundColor: theme.palette.background.default,
            }}
        >
            {/* 消息展示区域 */}
            <Box
                sx={{
                    flexGrow: 1,
                    overflowY: 'auto',
                    padding: '10px',
                    marginBottom: '10px',
                    borderRadius: '4px',
                    backgroundColor: '#fff',
                    boxShadow: 'inset 0 0 5px rgba(0, 0, 0, 0.1)',
                }}
            >
                <Typography
                    sx={{
                        textAlign: 'left',
                        color: 'gray',
                        marginBottom: '5px',
                    }}
                >
                    System: Welcome to the chat! Room: {roomName}.
                </Typography>
                <Typography
                    sx={{
                        textAlign: 'left',
                        color: 'blue',
                        marginBottom: '5px',
                    }}
                >
                    User: Hi there!
                </Typography>
                <Typography
                    sx={{
                        textAlign: 'left',
                        color: 'gray',
                        marginBottom: '5px',
                    }}
                >
                    System: Your message has been received.
                </Typography>
            </Box>

            {/* 输入框和按钮区域 */}
            <Box sx={{ display: 'flex', height: '30px' }}>
                <TextField
                    variant="outlined"
                    fullWidth
                    placeholder="Type a message"
                    sx={{
                        marginRight: '10px',
                        height: '30px',
                        '& .MuiOutlinedInput-root': {
                            height: '30px', // 设置输入框的高度
                            padding: '0px 10px', // 调整 padding，确保输入框内容在 30px 高度内
                        },
                        '& .MuiInputBase-input': {
                            padding: '6px 0px', // 设置输入区域的内边距，保证文字位置合适
                            fontSize: '14px', // 可根据需要调整字体大小
                        },
                    }}
                />
                <Button variant="contained" color="primary" style={{ textDecoration: 'line-through' }}>
                    Send
                </Button>
            </Box>
        </Box>
    );
}

export default ChatBox;