import { useEffect } from "react";
import { fetchUserId, fetchUserName } from "./UserProfile";

const useAuthToken = () => {
  const checkAuthToken = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.log("No token found");
      return;
    }

    const response = await fetch("/users/protected-route", {
      method: "GET",
      headers: { Authorization: token },
    });
    const data = await response.json();

    if (response.ok) {
      console.log("User is logged in");
      console.log(data);

      const username_: string = await fetchUserName(data.user.userId);
      console.log(username_);
      return { status: true, username_: username_ };
    } else {
      console.log("Invalid or expired token");
      localStorage.removeItem("token"); // Remove invalid token
      return { status: false, username_: undefined };
    }
  };

  return { checkAuthToken }; // Since this is for checking auth, it doesn't need to render anything
};

export default useAuthToken;
