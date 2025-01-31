/*
 * Copyright (C) 2025 Zhiyu Zhou (jimzhouzzy@gmail.com)
 * This file is part of Web-JunQi.
 * Licensed under the GPLv3 License.
 */

import React, { useState } from "react";
import { Box, Button, TextField, Typography, useTheme } from "@mui/material";
import { useGameContext } from "../contexts/GameContext";
import useChatSocket from "../sockets/chat";
import { useAuthContext } from "../contexts/AuthContext";

function ChatBox() {
  const theme = useTheme();
  const { emitMessage, messages} = useChatSocket(); 
  const { username } = useAuthContext();
  const [input, setInput] = useState<string>("");

  const { roomName } = useGameContext();
  return (
    <Box
      sx={{
        width: "300px",
        height: "400px",
        padding: "10px",
        border: "1px solid #ccc",
        borderRadius: "8px",
        display: "flex",
        flexDirection: "column",
        backgroundColor: theme.palette.background.default,
      }}
    >
      {/* 消息展示区域 */}
      <Box
        sx={{
          flexGrow: 1,
          overflowY: "auto",
          padding: "10px",
          marginBottom: "10px",
          borderRadius: "4px",
          backgroundColor: "#fff",    
          boxShadow: "inset 0 0 5px rgba(0, 0, 0, 0.1)",
        }}
      >
        {messages.map((msg, index) => (
          <Typography
            key={index}
            sx={{
              textAlign: "left",
              color: msg.sender === "Server" ? "red" : (msg.sender === username ? "blue" : "gray"),
              marginBottom: "5px",
            }}
          >
            {msg.sender}: {msg.text}
          </Typography>
        ))}
      </Box>

      {/* 输入框和按钮区域 */}
      <Box sx={{ display: "flex", height: "30px" }}>
        <TextField
          variant="outlined"
          fullWidth
          placeholder="Type a message"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          sx={{
            marginRight: "10px",
            height: "30px",
            "& .MuiOutlinedInput-root": {
              height: "30px", // 设置输入框的高度
              padding: "0px 10px", // 调整 padding，确保输入框内容在 30px 高度内
            },
            "& .MuiInputBase-input": {
              padding: "6px 0px", // 设置输入区域的内边距，保证文字位置合适
              fontSize: "14px", // 可根据需要调整字体大小
            },
          }}
          onKeyDown={(e) => {if (e.key === "Enter")  {emitMessage(input); setInput("");}}}
        />
        <Button
          variant="contained"
          color="primary"
          onClick={() => {emitMessage(input); setInput("");}}
        >
          Send
        </Button>
      </Box>
    </Box>
  );
}

export default ChatBox;
