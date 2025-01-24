import { useEffect, useRef, useState } from "react";
import { useAuthContext } from "../contexts/AuthContext";
import { useGameContext } from "../contexts/GameContext";
import { useSocketContext } from "../contexts/SocketContext";
import useGameService from "../services/GameService";
import JunqiGame from "../services/logic/junqiLogic";

const useGameSocket = () => {
    const { username } = useAuthContext(); // Access username from context
    const { game, setGame ,roomName, setRoomName, color, setColor } = useGameContext();
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
            const newGame = new JunqiGame();
            newGame.jzn = new_jzn;
            setGame(newGame);
            console.log(color);
            window.updateBoardFromFEN(newGame.getMaskedJzn(color));
            console.log(`New Masked JZN: ${newGame.getMaskedJzn(color)}`);
            console.log(`New JZN: ${new_jzn}`);
        });

        socket?.on('request-layout', function (req_color: string) {
            if (roomName !== undefined) {
                console.log(`${roomName} Recieved color: ${req_color}`);
                socket.emit('submit-layout', game.layout.get(req_color), roomName);
                newGame(game.layout.get(req_color)!, req_color);
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
            console.log("game.tsx: socket.on test okay")
        })

        return () => {
            //socket?.disconnect();
        };
    }, [socket, color]);

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
    game.applyAction(move);
    // TODO: encrypt local jzn
    game.jzn = new_jzn;
    window.jzn = game.getMaskedJzn(game.color);
    window.updateBoardFromFEN(window.jzn);
    console.log(`New Masked JZN: ${window.jzn}`);
    console.log(`New JZN: ${new_jzn}`);
});
*/