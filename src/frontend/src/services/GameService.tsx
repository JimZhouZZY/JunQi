import { useGameContext } from "../contexts/GameContext";

const GameService = () => {
    const {
        roomName,
        setRoomName,
        gamePhase,
        setGamePhase,
        selfColor,
        setSelfColor,
        oppoColor,
        setOppoColor,
        isLoggedIn,
        setIsLoggedIn,
        username,
        setUsername,
        game,
        setGame,
    } = useGameContext();
    
    const initGame = () => {
        newGame = new JunqiGame();
        // Default layout
        newGame.applyLayout('LKJJII0H0HGG0FFF0E0EEDDDBBCCAC');
        newGame.applyLayout('caccbbdddee0e0fff0ggh0h0iijjkl');
        setGame(newGame);    

        setGamePhase("DEPLOYING");
        setOppoColor('red');
    }
}

export default GameService;