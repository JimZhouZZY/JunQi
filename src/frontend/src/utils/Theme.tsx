/*
 * Copyright (C) 2025 Zhiyu Zhou (jimzhouzzy@gmail.com)
 * This file is part of Web-JunQi.
 * Licensed under the GPLv3 License.
 */

import { createTheme } from "@mui/material/styles";
import { ThemeOptions } from "@mui/material/styles";

export const themeOptions: ThemeOptions = {
  palette: {
    mode: "light",
    primary: {
      main: "#7D00C2",
    },
    secondary: {
      main: "#f50057",
    },
  },
};

// 创建主题实例
const theme = createTheme(themeOptions);

export default theme;
