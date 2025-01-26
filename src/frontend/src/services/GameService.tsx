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
        gameRef,
        setGame,
        color,
        setColor
    } = useGameContext();
 
    const initGame = (layout: string='LKJJII0H0HGG0FFF0E0EEDDDBBCCAC') => {
        // TODO: gameRef.current.reset();
        gameRef.current.jzn = '0'.repeat(60) + ' r 0 0';
        gameRef.current.color = '0';
        gameRef.current.game_phase = 'DEPLOYING';
        gameRef.current.applyLayout(layout.toLocaleUpperCase()); // Default layout
        console.log(layout.toLocaleUpperCase());
        gameRef.current.applyLayout(reverseString(layout.toLowerCase()));
        console.log(reverseString(layout.toLowerCase())); 
        gameRef.current.game_phase = "DEPLOYING";
        gameRef.current.color = 'b';
        console.log(gameRef.current.jzn);
    }

    const startNewGame = (layout: string, req_color: string) => {
        var new_jzn = req_color === 'r' ? (layout + reverseString(init_unknown_layout) + " r 0 0"): (init_unknown_layout + layout + " r 0 0");
        gameRef.current.applyLayout(layout);
        gameRef.current.game_phase = 'MOVING';
        console.log(`Updating board with new JZN: ${new_jzn}`)
        window.updateBoardFromFEN(new_jzn);
        setColor(req_color === 'r' ? 'r' : 'b');
    }

    return { initGame, newGame: startNewGame };
}

export default useGameService;
