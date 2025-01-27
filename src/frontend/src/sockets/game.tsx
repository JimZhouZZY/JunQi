import { useEffect, useRef, useState } from "react";
import { useAuthContext } from "../contexts/AuthContext";
import { useGameContext } from "../contexts/GameContext";
import { useSocketContext } from "../contexts/SocketContext";
import useGameService from "../services/GameService";
import JunqiGame from "../services/logic/junqiLogic";

const useGameSocket = () => {
    const { username } = useAuthContext(); // Access username from context
    const { gameRef, setGame ,roomName, setRoomName, color, setColor } = useGameContext();
    const { socket, setSocket } = useSocketContext();
    const { newGame, initGame } = useGameService();

    useEffect(() => {
        if (!socket) {
            console.log('socket is not available')
            return;
        }

        console.log(`Initializing game socket.on with socket: ${socket}`);
        
        socket?.on('move', function (move: string, new_jzn: string) {
            console.log(`Client recieved move: ${move}`)
            // TODO: encrypt local jzn
            gameRef.current.jzn = new_jzn;
            console.log(`GameRef color: ${gameRef.current.color}`);
            window.updateBoardFromFEN(gameRef.current.getMaskedJzn(gameRef.current.color));
            console.log(`New Masked JZN: ${gameRef.current.getMaskedJzn(gameRef.current.color)}`);
            console.log(`New JZN: ${new_jzn}`);
        });

        socket?.on('request-layout', function (req_color: string) {
            if (roomName !== undefined) {
                console.log(`${roomName} Recieved color: ${req_color}`);
                console.log(gameRef.current);
                socket.emit('submit-layout', gameRef.current.layout.get(req_color), roomName);
                console.log(`Submitted layout ${gameRef.current.layout.get(req_color)}`)
                newGame(gameRef.current.layout.get(req_color)!, req_color);
                gameRef.current.color = req_color;
                console.log(`gameRef color: ${gameRef.current.color} - req_color: ${req_color}`);
            } else {
                console.log('Room name is undefined, possibly not synced.')
            }
        });

        socket?.on('terminal', function () {
            initGame();
            setColor('0');
            setRoomName('');
        });

        socket?.on('test', () => {
            console.log("gameRef.current.tsx: socket.on test okay")
        })

        return () => {
            //socket?.disconnect();
        };
    }, [socket]);

    const emitMove = (move: string, roomName: string) => {
        socket?.emit('move', move, roomName);
    }

    return { emitMove };
}

export default useGameSocket;

/* ref
// Handle move from the other side
socket.on('move', function (move, new_jzn) {
    console.log(`Client recieved move: ${move}`)
    gameRef.current.applyAction(move);
    // TODO: encrypt local jzn
    gameRef.current.jzn = new_jzn;
    window.jzn = gameRef.current.getMaskedJzn(gameRef.current.color);
    window.updateBoardFromFEN(window.jzn);
    console.log(`New Masked JZN: ${window.jzn}`);
    console.log(`New JZN: ${new_jzn}`);
});
*/