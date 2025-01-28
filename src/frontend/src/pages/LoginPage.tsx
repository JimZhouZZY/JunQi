/*
 * Copyright (C) 2025 Zhiyu Zhou (jimzhouzzy@gmail.com)
 * This file is part of Web-JunQi.
 * Licensed under the GPLv3 License.
 */

import * as React from "react";
import { AppProvider } from "@toolpad/core/AppProvider";
import { type AuthProvider, SignInPage } from "@toolpad/core/SignInPage";
import { useTheme } from "@mui/material/styles";
import {
  Box,
  SxProps,
  TextField,
  TextFieldProps,
  Theme,
  Typography,
} from "@mui/material"; // 引入 Box 组件
import { Co2Sharp } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "../contexts/AuthContext";

interface AuthResponse {
  /**
   * The error message if the sign-in failed.
   * @default ''
   */
  error?: string;
  /**
   * The type of error if the sign-in failed.
   * @default ''
   */
  type?: string;
  /**
   * The success notification if the sign-in was successful.
   * @default ''
   * Only used for magic link sign-in.
   * @example 'Check your email for a magic link.'
   */
  success?: string;
  messagge?: string;
  token?: string;
}

const providers = [{ id: "credentials", name: "Email and password" }];

const mergeSlotSx = (
  defaultSx: SxProps<Theme>,
  slotProps?: { sx?: SxProps<Theme> },
) => {
  if (Array.isArray(slotProps?.sx)) {
    return [defaultSx, ...slotProps!.sx];
  }

  if (slotProps?.sx) {
    return [defaultSx, slotProps?.sx];
  }

  return [defaultSx];
};

const getCommonTextFieldProps = (
  theme: Theme,
  baseProps: TextFieldProps = {},
): TextFieldProps => ({
  required: true,
  fullWidth: true,
  ...baseProps,
  slotProps: {
    ...baseProps.slotProps,
    htmlInput: {
      ...baseProps.slotProps?.htmlInput,
      sx: mergeSlotSx(
        {
          paddingTop: theme.spacing(1),
          paddingBottom: theme.spacing(1),
        },
        typeof baseProps.slotProps?.htmlInput === "function"
          ? {}
          : baseProps.slotProps?.htmlInput,
      ),
    },
    inputLabel: {
      ...baseProps.slotProps?.inputLabel,
      sx: mergeSlotSx(
        {
          lineHeight: theme.typography.pxToRem(12),
          fontSize: theme.typography.pxToRem(14),
        },
        typeof baseProps.slotProps?.inputLabel === "function"
          ? {}
          : baseProps.slotProps?.inputLabel,
      ),
    },
  },
});

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const { isLoggedIn, setIsLoggedIn, username, setUsername } = useAuthContext();

  const gridPattern = `
    <svg width="200" height="200" xmlns="http://www.w3.org/2000/svg">
      <rect width="100" height="100" fill="${theme.palette.primary.main}" />
      <rect x="100" width="100" height="100" fill="white" />
      <rect y="100" width="100" height="100" fill="white" />
      <rect x="100" y="100" width="100" height="100" fill="${theme.palette.primary.main}" />
    </svg>
  `;
  const encodedPattern = encodeURIComponent(gridPattern);

  const signIn: (
    provider?: AuthProvider,
    formData?: FormData,
    callbackUrl?: string,
  ) => Promise<AuthResponse> = async (provider, formData, callbackUrl) => {
    /* DEBUG */
    for (const [key, value] of formData!.entries()) {
      console.log(`${key}: ${value}`);
    }
    /* DEBUG */

    if (!formData) {
      throw new Error("Form data is required.");
    }

    const email = formData.get("email");
    const password = formData.get("password");
    const remember = formData.get("remember");

    if (!email || !password) {
      throw new Error("Email and password are required.");
    }

    try {
      // 使用 fetch 发送 POST 请求
      const response = await fetch("/users/login-register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: email,
          password: password,
        }),
      });

      // 检查响应状态
      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }

      // 解析响应数据
      const result: AuthResponse = await response.json();
      console.log(result);
      if (formData.get("remember")) {
        localStorage.setItem("token", result.token!);
      }
      setUsername(email.toString()); // TODO: change variable name 'email' to 'username'
      setIsLoggedIn(true);
      navigate("/");

      return result;
    } catch (error) {
      console.error("Sign-in failed:", error);
      return {
        type: "CredentialsSignin",
        error: "Unknown error.",
      };
    }
  };

  const SignUpLink = () => (
    <Typography align="center" sx={{ mt: 2 }}>
      Don&apos;t have an account?{" "}
      <a href="/signup" style={{ textDecoration: "none", color: "blue" }}>
        Sign Up
      </a>
    </Typography>
  );

  const UsernameField = () => {
    return (
      <TextField
        {...getCommonTextFieldProps(theme, {
          label: "Username",
          placeholder: "Your username",
          id: "email-passkey",
          name: "email",
          type: "text",
          autoComplete: "email-webauthn",
          autoFocus: false,
        })}
      />
    );
  };

  return (
    // preview-start
    <AppProvider theme={theme}>
      <Box
        sx={{
          // 使用SVG格子背景
          backgroundImage: `url("data:image/svg+xml,${encodedPattern}")`, // 使用 SVG 格子背景
          backgroundRepeat: "repeat", // 背景重复
          minHeight: "100vh", // 设置背景的最小高度
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          position: "relative", // 设置位置为相对，这样可以放置绝对定位的遮罩层
        }}
      >
        {/* 添加黑色透明遮罩层，使背景变暗 */}
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0, 0, 0, 0.7)", // 半透明黑色
            zIndex: 0, // 确保遮罩层在后面
          }}
        />
        <SignInPage
          signIn={signIn}
          providers={providers}
          slotProps={{
            rememberMe: {},
          }}
          slots={{
            emailField: UsernameField,
            signUpLink: SignUpLink,
          }}
          sx={{
            zIndex: 1,
          }}
        />
      </Box>
    </AppProvider>
    // preview-end
  );
};

export default LoginPage;
