/*
 * Copyright (C) 2025 Zhiyu Zhou (jimzhouzzy@gmail.com)
 * This file is part of Web-JunQi.
 * Licensed under the GPLv3 License.
 */

import React, { useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import { ThemeProvider } from "@mui/material/styles";
import theme from "./utils/Theme";
import { AuthProvider } from "./contexts/AuthContext";
import useAuthToken from "./utils/AuthToken";
import { GameProvider } from "./contexts/GameContext";
import { SocketProvider } from "./contexts/SocketContext";

const App: React.FC = () => {
  return (
    <AuthProvider>
      <SocketProvider>
        <GameProvider>
          <ThemeProvider theme={theme}>
            <Router>
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/login" element={<LoginPage />} />
              </Routes>
            </Router>
          </ThemeProvider>
        </GameProvider>
      </SocketProvider>
    </AuthProvider>
  );
};

export default App;
