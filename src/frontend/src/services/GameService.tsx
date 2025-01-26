import { useGameContext } from "../contexts/GameContext";
import JunqiGame from "./logic/junqiLogic";
import { useRef } from "react";

const init_unknown_layout = "###########0#0###0###0#0######" // for red

function reverseString(str: string) {
    return str.split('').reverse().join('');
}

const useGameService = () => {
    const {
        roomName,
        setRoomName,
        game,
        setGame,
        color,
        setColor
    } = useGameContext();
 
    const initGame = (layout: string='LKJJII0H0HGG0FFF0E0EEDDDBBCCAC') => {
        const newGame = new JunqiGame();
        newGame.applyLayout(layout.toLocaleUpperCase()); // Default layout
        newGame.applyLayout(reverseString(layout.toLowerCase()));
        newGame.game_phase = "DEPLOYING";
        newGame.color = 'b';
        setGame(newGame); 
    }

    const startNewGame = (layout: string, req_color: string) => {
        var new_jzn = req_color === 'r' ? (layout + reverseString(init_unknown_layout) + " r 0 0"): (init_unknown_layout + layout + " r 0 0");
        const newGame = new JunqiGame(new_jzn, req_color);
        newGame.applyLayout(layout);
        newGame.game_phase = 'MOVING';
        setGame(newGame);
        console.log(`Updating board with new JZN: ${new_jzn}`)
        window.updateBoardFromFEN(new_jzn);
        setColor(req_color === 'r' ? 'r' : 'b');
    }

    return { initGame, newGame: startNewGame };
}

export default useGameService;
