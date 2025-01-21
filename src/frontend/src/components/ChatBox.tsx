import React from 'react';
import { Box, Button, TextField, Typography } from '@mui/material';

function ChatBox() {
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
        backgroundColor: '#f9f9f9',
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
          System: Welcome to the chat!
        </Typography>
        <Typography
          sx={{
            textAlign: 'right',
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
      <Box sx={{ display: 'flex' }}>
        <TextField
          variant="outlined"
          fullWidth
          placeholder="Type a message"
          sx={{ marginRight: '10px' }}
        />
        <Button variant="contained" color="primary">
          Send
        </Button>
      </Box>
    </Box>
  );
}

export default ChatBox;