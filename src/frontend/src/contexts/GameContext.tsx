import React, { createContext, useContext, useState } from "react";
import JunqiGame from "../services/logic/junqiLogic";

type GameContextType = {
    roomName: string;
    setRoomName: (value: string) => void;
    game: JunqiGame;
    setGame: (game: JunqiGame) => void;
};

const GameContext = createContext<GameContextType | undefined>(undefined);

interface Props {
    children: React.ReactNode;
}

export const GameProvider: React.FC<Props> = ({ children }) => {
    const [roomName, setRoomName] = useState<string>('');
    const [game, setGame] = useState<JunqiGame>(new JunqiGame());

    return (
        <GameContext.Provider value={{ roomName, setRoomName, game, setGame}}>
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