import React, { createContext, useContext, useEffect, useState } from "react";
import useAuthToken from "../utils/AuthToken";

type AuthContextType = {
    isLoggedIn: boolean;
    setIsLoggedIn: (value: boolean) => void;
    username_?: string;
    username?: string;
    setUsername: (value: string | undefined) => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface Props {
    children: React.ReactNode;
}

export const AuthProvider: React.FC<Props> = ({ children }) => {
    const { checkAuthToken } = useAuthToken();
    const [authData, setAuthData] = useState<{ status: boolean; username_: string | undefined } | null | undefined>(null);

    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
    const [username, setUsername] = useState<string | undefined>(undefined);
    useEffect(() => {
        const fetchAuthData = async () => {
            try {
                const data = await checkAuthToken();
                console.log(data);
                setAuthData( (data) ? data : { status: false, username_: undefined } );
                if (data && data.status === true){
                    setIsLoggedIn(true);
                    setUsername(data.username_);
                }
            } catch (error) {
                console.error("Error checking auth token:", error);
            }
        };

        fetchAuthData();
    }, []);

    if (!authData) {
        return <div>Loading...</div>; // You can show a loading state here
    }
    const { status, username_ } = authData;

    return (
        <AuthContext.Provider value={{ isLoggedIn, setIsLoggedIn, username_, username, setUsername }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuthContext = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};