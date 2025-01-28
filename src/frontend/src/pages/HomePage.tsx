/*
 * Copyright (C) 2025 Zhiyu Zhou (jimzhouzzy@gmail.com)
 * This file is part of Web-JunQi.
 * Licensed under the GPLv3 License.
 */

import React, { useEffect, useRef, useState } from "react";
import AppBar from "../components/AppBar";
import Button from "@mui/material/Button";
import { useNavigate } from "react-router-dom";
import Grid from "@mui/material/Grid2";
import Box from "@mui/material/Box";
import { VerticalAlignBottom } from "@mui/icons-material";
import Paper from "@mui/material/Paper";
import { styled, useTheme } from "@mui/material/styles";
import ChatBox from "../components/ChatBox";
import { useAuthContext } from "../contexts/AuthContext";
import useQueueSocket from "../sockets/queue";
import useGameService from "../services/GameService";
import useGameHandler from "../services/GameHandler";
import useSocket from "../sockets/socket";
import { useSocketContext } from "../contexts/SocketContext";
import JunqiBoard from "../components/JunqiBoard";
import { useGameContext } from "../contexts/GameContext";
import useAuthToken from "../utils/AuthToken";

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "center",
  color: theme.palette.text.secondary,
  ...theme.applyStyles("dark", {
    backgroundColor: "#1A2027",
  }),
  width: "100%",
}));

const ItemWithoutPadding = styled(Paper)(({ theme }) => ({
  backgroundColor: "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(0),
  textAlign: "center",
  color: theme.palette.text.secondary,
  ...theme.applyStyles("dark", {
    backgroundColor: "#1A2027",
  }),
  width: "100%",
}));

const HomePage: React.FC = () => {
  useEffect(() => {
    const onPageLoad = () => {
      console.log("Initializing game...");
      initSocket();
      initGame();
    };

    // Check if the page has already loaded
    if (document.readyState === "complete") {
      onPageLoad();
    } else {
      window.addEventListener("load", onPageLoad, false);
      // Remove the event listener when component unmounts
      return () => window.removeEventListener("load", onPageLoad);
    }
  }, []);

  const { checkAuthToken } = useAuthToken();
  useEffect(() => {
    // Check token when the component mounts
    checkAuthToken();
  }, []); // This ensures it runs once

  type GamePhase = "DEPLOYING" | "MOVING";
  const [gamePhase, setGamePhase] = useState<GamePhase>("DEPLOYING");
  const { isLoggedIn, setIsLoggedIn } = useAuthContext();
  const { joinQueue, leaveQueue } = useQueueSocket();
  const { initGame } = useGameService();
  const { initSocket } = useSocket();
  const { socket } = useSocketContext();
  const { roomName, gameRef, isInQueue, setIsInQueue } = useGameContext();
  const { skipHandler, surrenderHandler } = useGameHandler();

  const theme = useTheme();
  const navigate = useNavigate();

  function ClickRouter(event: React.MouseEvent<HTMLButtonElement>) {
    const buttonId = (event.target as Element).id;
    console.log("Clicked button with ID:", buttonId);
    if (!isLoggedIn) {
      navigate("/login");
    } else {
      switch (buttonId) {
        case "button-start":
          joinQueue();
          setIsInQueue(true);
          break;
        case "button-cancle":
          leaveQueue();
          setIsInQueue(false);
          break;
        case "button-save_layout":
          handleSaveLayout();
          break;
        case "button-load_layout":
          handleLoadLayout();
          break;
        case "button-draw":
          break;       
        case "button-skip":
          handleSkip();
          break;
        case "button-surrender":
          handleSurrender();
          break;
        default:
          break;
      }
    }
  }

  const renderButtonGrid = () => {
    if (gameRef.current.game_phase === "DEPLOYING") {
      return (
        <Item>
          <Grid
            container
            columns={1}
            rowSpacing={1}
            wrap="nowrap"
            direction={"column"}
          >
            {isInQueue ? (
              <Button
                id="button-cancle"
                variant="contained"
                sx={{ width: "100%", maxWidth: "1000px" }}
                onClick={ClickRouter}
              >
                Cancle
              </Button>
            ) : (
              <Button
                id="button-start"
                variant="contained"
                sx={{ width: "100%", maxWidth: "1000px" }}
                onClick={ClickRouter}
              >
                Start
              </Button>
            )}
            <Grid
              container
              width={"100%"}
              columns={2}
              rowSpacing={1}
              columnSpacing={{ xs: 0.25, sm: 0.5, md: 0.75 }}
              wrap="nowrap"
              direction={"row"}
            >
              <ItemWithoutPadding>
                <Button
                  id="button-save_layout"
                  variant="contained"
                  sx={{ width: "100%", maxWidth: "1000px" }}
                  onClick={ClickRouter}
                >
                  Save Layout
                </Button>
              </ItemWithoutPadding>
              <ItemWithoutPadding>
                <Button
                  id="button-load_layout"
                  variant="contained"
                  sx={{ width: "100%", maxWidth: "1000px" }}
                  onClick={ClickRouter}
                >
                  Load Layout
                </Button>
              </ItemWithoutPadding>
            </Grid>
          </Grid>
        </Item>
      );
    } else if (gameRef.current.game_phase === "MOVING") {
      return (
        <Item>
          <Grid
            container
            columns={1}
            rowSpacing={1}
            wrap="nowrap"
            direction={"column"}
          >
            <Grid
              container
              width={"100%"}
              columns={2}
              rowSpacing={1}
              columnSpacing={{ xs: 0.25, sm: 0.5, md: 0.75 }}
              wrap="nowrap"
              direction={"row"}
            >
              <ItemWithoutPadding>
                <Button
                  id="button-draw"
                  style={{ textDecoration: "line-through" }}
                  variant="contained"
                  sx={{ width: "100%", maxWidth: "1000px" }}
                  onClick={ClickRouter}
                >
                  Draw
                </Button>
              </ItemWithoutPadding>
              <ItemWithoutPadding>
                <Button
                  id="button-skip"
                  variant="contained"
                  sx={{ width: "100%", maxWidth: "1000px" }}
                  onClick={ClickRouter}
                >
                  Skip
                </Button>
              </ItemWithoutPadding>
            </Grid>
            <Grid
              container
              width={"100%"}
              columns={2}
              rowSpacing={1}
              columnSpacing={{ xs: 0.25, sm: 0.5, md: 0.75 }}
              wrap="nowrap"
              direction={"row"}
            >
              <ItemWithoutPadding>
                <Button
                  id="button-save_layout"
                  variant="contained"
                  sx={{ width: "100%", maxWidth: "1000px" }}
                  onClick={ClickRouter}
                >
                  Save Layout
                </Button>
              </ItemWithoutPadding>
              <ItemWithoutPadding>
                <Button
                  id="button-surrender"
                  variant="contained"
                  sx={{ width: "100%", maxWidth: "1000px" }}
                  onClick={ClickRouter}
                >
                  Surrender
                </Button>
              </ItemWithoutPadding>
            </Grid>
          </Grid>
        </Item>
      );
    }
  };

  const [fileContent, setFileContent] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null); // 用来引用文件输入框
  const isFirstRender = useRef(true);
  useEffect(() => {
    if (isFirstRender.current === true) {
      isFirstRender.current = false;
      return;
    } else {
      console.log(`Read layout: ${fileContent}`);
      const layout = fileContent;
      initGame(layout);
      window.updateBoardFromFEN("0".repeat(30) + layout);
    }
  }, [fileContent]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // 检查文件后缀
    if (!file.name.endsWith(".lyt")) {
      alert("请选择一个 .lyt 文件！");
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      if (typeof e.target?.result === "string") {
        setFileContent(e.target.result.trimEnd().trimStart()); // 将文件内容设置为状态变量
      }
    };
    reader.onerror = (e) => {
      console.error("文件读取失败", e);
      alert("文件读取失败，请重试！");
    };

    reader.readAsText(file); // 以文本形式读取文件内容
  };

  const handleLoadLayout = () => {
    fileInputRef.current?.click();
  };

  const handleSaveLayout = () => {
    // 创建一个 Blob 对象，用于存储要保存的布局数据
    const blob = new Blob(
      [gameRef.current.layout.get(gameRef.current.color)?.toUpperCase()!],
      { type: "text/plain" },
    );

    // 创建一个链接，模拟下载
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "layout.lyt"; // 设置文件名为 layout.lyt

    // 触发点击事件开始下载
    link.click();

    // 清理 URL 对象
    URL.revokeObjectURL(link.href);
  };

  const handleSkip = ()=> {
    skipHandler();
  }

  const handleSurrender = () => {
    surrenderHandler();
  }

  return (
    <div
      style={{
        textAlign: "center",
        marginTop: "0px",
        backgroundColor: "#f0f0f0",
        minHeight: "100vh",
      }}
    >
      <AppBar />
      <Grid
        container
        columns={2}
        rowSpacing={1}
        columnSpacing={{ xs: 1, sm: 2, md: 3 }}
        wrap="nowrap"
        justifyContent="center" // Center horizontally
        alignItems="flex-start" // Center vertically
        sx={{ marginTop: "20px" }}
      >
        <Grid columns={1} size={1}>
          <Item>
            <JunqiBoard />
          </Item>
        </Grid>

        <Grid
          columns={1}
          rowSpacing={1}
          columnSpacing={{ xs: 1, sm: 2, md: 3 }}
          wrap="nowrap"
          direction={"column"}
        >
          {renderButtonGrid()}
          <input
            type="file"
            ref={fileInputRef}
            accept=".lyt"
            onChange={handleFileChange}
            style={{ display: "none" }}
          />
          <Item>
            <div style={{ borderBottom: "1px solid #333" }}></div>
          </Item>
          <Item>
            <Grid
              container
              columns={1}
              rowSpacing={1}
              wrap="nowrap"
              direction={"column"}
            >
              <ChatBox></ChatBox>
            </Grid>
          </Item>
        </Grid>
      </Grid>
    </div>
  );
};

export default HomePage;
