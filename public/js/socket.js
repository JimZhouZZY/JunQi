// import { io } from 'socket.io-client';

const socket = io();

socket.on('move', (move) => {
    console.log(`Client received move: ${move}`);
}); 