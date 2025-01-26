import React, { createContext, useContext, useRef, useState } from "react";
import JunqiGame from "../services/logic/junqiLogic";

type GameContextType = {
    roomName: string;
    setRoomName: (value: string) => void;
    game: JunqiGame;
    setGame: (game: JunqiGame) => void;
    color: 'r' | 'b' | '0'
    setColor: (color: 'r' | 'b' | '0') => void;
    gamePhase: 'MOVING' | 'DEPLPYING';
    setGamePhase: (gamePhase: 'MOVING' | 'DEPLPYING') => void;
    isInQueue: boolean;
    setIsInQueue: (value: boolean) => void;
    gameRef: React.RefObject<JunqiGame>;
};

const GameContext = createContext<GameContextType | undefined>(undefined);

interface Props {
    children: React.ReactNode;
}

export const GameProvider: React.FC<Props> = ({ children }) => {
    const [roomName, setRoomName] = useState<string>('');
    const [game, setGame] = useState<JunqiGame>(new JunqiGame(undefined, undefined, 'DEPLOYING'));
    const [color, setColor] = useState<'r' | 'b' | '0'>('0');
    const [gamePhase, setGamePhase] = useState<'MOVING' | 'DEPLPYING'> ('DEPLPYING');
    const [isInQueue, setIsInQueue] = useState(false);

    const gameRef = useRef(game);

    return (
        <GameContext.Provider value={{ roomName, setRoomName, game, setGame, color, setColor, gamePhase, setGamePhase, isInQueue, setIsInQueue, gameRef}}>
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