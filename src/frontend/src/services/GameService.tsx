import { useGameContext } from "../contexts/GameContext";
import JunqiGame from "./logic/junqiLogic";
import JunqiBoard, { JunqiBoardRef } from '../components/JunqiBoard';
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
    } = useGameContext();

    const junqiBoardRef = useRef<JunqiBoardRef>(null);
    
    const initGame = () => {
        const newGame = new JunqiGame();
        newGame.applyLayout('LKJJII0H0HGG0FFF0E0EEDDDBBCCAC'); // Default layout
        newGame.applyLayout('caccbbdddee0e0fff0ggh0h0iijjkl');
        newGame.game_phase = "DEPLOYING";
        newGame.color = 'b';
        setGame(newGame); 
    }

    const newGame = (layout: string, color: string) => {
        var new_jzn = color === 'r' ? (layout + reverseString(init_unknown_layout) + " r 0 0"): (init_unknown_layout + layout + " r 0 0");
        const newGame = new JunqiGame(new_jzn, color);
        newGame.applyLayout(layout);
        console.log(`Updating board with new JZN: ${new_jzn}`)
        junqiBoardRef.current!.updateBoardFromFEN(new_jzn);
        newGame.game_phase = 'MOVING';
        setGame(newGame);
    }

    return { initGame, newGame };
}

export default useGameService;
