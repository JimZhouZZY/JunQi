import { useEffect, useRef, useState } from "react";
import { useAuthContext } from "../contexts/AuthContext";
import { useGameContext } from "../contexts/GameContext";
import { useSocketContext } from "../contexts/SocketContext";
import JunqiBoard, { JunqiBoardRef } from '../components/JunqiBoard';
import useGameService from "../services/GameService";

const useGameSocket = () => {
    const { username } = useAuthContext(); // Access username from context
    const { game, roomName } = useGameContext();
    const { socket, setSocket } = useSocketContext();
    const junqiBoardRef = useRef<JunqiBoardRef>(null);
    const { newGame } = useGameService();

    useEffect(() => {
        if (!socket) {
            console.log('socket is not available')
            return;
        }

        console.log(`Initializing game socket.on with socket: ${socket}`);
        socket?.on('move', function (move: string, new_jzn: string) {
            console.log(`Client recieved move: ${move}`)
            game.applyAction(move);
            // TODO: encrypt local jzn
            game.jzn = new_jzn;
            junqiBoardRef.current?.updateBoardFromFEN(game.getMaskedJzn(game.color));
            console.log(`New Masked JZN: ${game.getMaskedJzn(game.color)}`);
            console.log(`New JZN: ${new_jzn}`);
        });

        socket?.on('request-layout', function (color: string) {
            if (roomName !== undefined) {
                console.log(`${roomName} Recieved color: ${color}`);
                socket.emit('submit-layout', game.layout.get(color), roomName);
                newGame(game.layout.get(color)!, color);
            } else {
                console.log('Room name is undefined, possibly not synced.')
            }
        });

        socket?.on('test', () => {
            console.log("game.tsx: socket.on test okay")
        })

        return () => {
            socket?.disconnect();
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
    game.applyAction(move);
    // TODO: encrypt local jzn
    game.jzn = new_jzn;
    window.jzn = game.getMaskedJzn(game.color);
    window.updateBoardFromFEN(window.jzn);
    console.log(`New Masked JZN: ${window.jzn}`);
    console.log(`New JZN: ${new_jzn}`);
});
*/