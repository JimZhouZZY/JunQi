import * as React from 'react';
import { AppProvider } from '@toolpad/core/AppProvider';
import {
  SignInPage,
  type AuthProvider,
  type AuthResponse,
} from '@toolpad/core/SignInPage';
import { useTheme } from '@mui/material/styles';
import { Box } from '@mui/material'; // 引入 Box 组件

const providers = [{ id: 'credentials', name: 'Email and password' }];

const signIn: (
  provider: AuthProvider,
  formData?: FormData,
) => Promise<AuthResponse> | void = async (provider, formData) => {
  const promise = new Promise<AuthResponse>((resolve) => {
    setTimeout(() => {
      const email = formData?.get('email');
      const password = formData?.get('password');
      alert(
        `Signing in with "${provider.name}" and credentials: ${email}, ${password}`,
      );
      // preview-start
      resolve({
        type: 'CredentialsSignin',
        error: 'Invalid credentials.',
      });
      // preview-end
    }, 300);
  });
  return promise;
};

const LoginPage: React.FC = () => {
  const theme = useTheme();
  const gridPattern = `
    <svg width="200" height="200" xmlns="http://www.w3.org/2000/svg">
      <rect width="100" height="100" fill="${theme.palette.primary.main}" />
      <rect x="100" width="100" height="100" fill="white" />
      <rect y="100" width="100" height="100" fill="white" />
      <rect x="100" y="100" width="100" height="100" fill="${theme.palette.primary.main}" />
    </svg>
  `;
  const encodedPattern = encodeURIComponent(gridPattern);

  return (
    // preview-start
    <AppProvider theme={theme}>
      <Box
        sx={{
          // 使用SVG格子背景
          backgroundImage: `url("data:image/svg+xml,${encodedPattern}")`, // 使用 SVG 格子背景
          backgroundRepeat: 'repeat', // 背景重复
          minHeight: '100vh', // 设置背景的最小高度
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          position: 'relative', // 设置位置为相对，这样可以放置绝对定位的遮罩层
        }}
      >
        {/* 添加黑色透明遮罩层，使背景变暗 */}
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0, 0, 0, 0.7)', // 半透明黑色
            zIndex: 0, // 确保遮罩层在后面
          }}
        />
        <SignInPage
          signIn={signIn}
          providers={providers}
          slotProps={{ emailField: { autoFocus: false } }}
          sx = {{
            zIndex: 1,
          }}
        />
      </Box>
    </AppProvider>
    // preview-end
  );
}

export default LoginPage;