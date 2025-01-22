import React, { createContext, useContext, useState } from "react";

type AuthContextType = {
    isLoggedIn: boolean;
    setIsLoggedIn: (value: boolean) => void;
    username?: string;
    setUsername: (value: string | undefined) => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface Props {
    children: React.ReactNode;
}

export const AuthProvider: React.FC<Props> = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
    const [username, setUsername] = useState<string | undefined>(undefined);

    return (
        <AuthContext.Provider value={{ isLoggedIn, setIsLoggedIn, username, setUsername}}>
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