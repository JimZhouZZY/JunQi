import { useGameContext } from "../contexts/GameContext";
import JunqiGame from "./logic/junqiLogic";

const useGameService = () => {
    const {
        roomName,
        setRoomName,
        game,
        setGame,
    } = useGameContext();
    
    const initGame = () => {
        const newGame = new JunqiGame();
        newGame.applyLayout('LKJJII0H0HGG0FFF0E0EEDDDBBCCAC'); // Default layout
        newGame.applyLayout('caccbbdddee0e0fff0ggh0h0iijjkl');
        newGame.game_phase = "DEPLOYING";
        newGame.color = 'b';
        setGame(newGame); 
    }

    return { initGame };
}

export default useGameService;