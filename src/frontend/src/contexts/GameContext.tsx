import React, { createContext, useContext, useState } from "react";

type GameContextType = {
    roomName: string;
    setRoomName: (value: string) => void;
    gamePhase: 'MOVING' | 'DEPLOYING';
    setGamePhase: (value: 'MOVING' | 'DEPLOYING') => void;
    oppoColor: 'red' | 'blue';
    setOppoColor: (value: 'red' | 'blue') => void;
    isLoggedIn: boolean;
    setIsLoggedIn: (value: boolean) => void;
    username: string | undefined;
    setUsername: (value: string | undefined) => void;
};

const GameContext = createContext<GameContextType | undefined>(undefined);

interface Props {
    children: React.ReactNode;
}

export const GameProvider: React.FC<Props> = ({ children }) => {
    const [roomName, setRoomName] = useState<string>('');
    const [gamePhase, setGamePhase] = useState<'MOVING' | 'DEPLOYING'>('MOVING');
    const [oppoColor, setOppoColor] = useState<'red' | 'blue'>('red');
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
    const [username, setUsername] = useState<string | undefined>(undefined);

    return (
        <GameContext.Provider value={{ roomName, setRoomName, gamePhase, setGamePhase, oppoColor, setOppoColor, isLoggedIn, setIsLoggedIn, username, setUsername }}>
            {children}
        </GameContext.Provider>
    );
};

export const useGameContext = () => {
    const context = useContext(GameContext);
    if (!context) {
        throw new Error("useGameContext must be used within a GameProvider");
    }
    return context;
};