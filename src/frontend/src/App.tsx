/*
 * Copyright (C) 2025 Zhiyu Zhou (jimzhouzzy@gmail.com)
 * This file is part of Web-JunQi.
 * Licensed under the GPLv3 License.
 */

import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import { ThemeProvider } from '@mui/material/styles';
import theme from './utils/Theme';
import { AuthProvider } from './contexts/AuthContext';
import { AuthToken } from './utils/AuthToken'
import io from './sockets/socket'
import { GameProvider } from './contexts/GameContext';


const App: React.FC = () => {
  return (
    <AuthProvider>
      <GameProvider>
        <ThemeProvider theme={theme}>
          <AuthToken />
          <Router>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/login" element={<LoginPage />} />
            </Routes>
          </Router>
        </ThemeProvider>
      </GameProvider>
    </AuthProvider>
  );
};

export default App;
