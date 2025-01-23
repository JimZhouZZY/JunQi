import { useEffect } from 'react';
import { useAuthContext } from './AuthContext';
import { fetchUserId, fetchUserName } from './UserProfile';

export const AuthToken = () => {
  const { isLoggedIn, setIsLoggedIn, username, setUsername } = useAuthContext();

  useEffect(() => {
    const checkAuthToken = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        console.log('No token found');
        return;
      }

      const response = await fetch('/users/protected-route', {
        method: 'GET',
        headers: { 'Authorization': token },
      });
      const data = await response.json();

      if (response.ok) {
        console.log('User is logged in');
        console.log(data);
        setIsLoggedIn(true);
        const username_ = await fetchUserName(data.user.userId);
        setUsername(username_);
      } else {
        console.log('Invalid or expired token');
        localStorage.removeItem('token'); // Remove invalid token
      }
    };

    checkAuthToken();
  }, [setIsLoggedIn, setUsername]); // Dependencies to ensure it only runs on initial render

  return null; // Since this is for checking auth, it doesn't need to render anything
};