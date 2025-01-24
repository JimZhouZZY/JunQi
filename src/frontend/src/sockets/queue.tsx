import { useAuthContext } from '../contexts/AuthContext';  // Assuming your context hook is here
import { useEffect, useState } from 'react';
import { useGameContext } from '../contexts/GameContext';
import { useSocketContext } from '../contexts/SocketContext';

const useQueueSocket = () => {
  const { username } = useAuthContext(); // Access username from context
  const { game, setRoomName } = useGameContext();
  const { socket, setSocket } = useSocketContext();  

  useEffect(() => {
    if (!socket) {
      console.log('socket is not available')
      return;
    }

    console.log(`Initializing queue socket.on with socket: ${socket}`);
    socket?.on('room-name', (roomName: string) => {
      setRoomName(roomName);
      game.game_phase = 'MOVING';
      console.log(`Client started game in room: ${roomName}`)
    });

    socket?.on('test', () => {
      console.log("queue.tsx: socket.on test okay")
    })

    return () => {
      socket?.disconnect();
    };
  }, [socket]);

  // Join queue function
  const joinQueue = async () => {
    if (!username) {
      console.error('Username is not available');
      return;
    }

    const queuename = 'main'; // Queue name, can be dynamic later
    socket?.emit('queues-join', username, queuename);

    // TODO: Handle server response
    // TODO: Handle errors
  };

  // Leave queue function
  const leaveQueue = async () => {
    if (!username) {
      console.error('Username is not available');
      return;
    }

    const queuename = 'main'; // Queue name, can be dynamic later
    socket?.emit('queues-leave', username, queuename);

    // TODO: Handle server response
    // TODO: Handle errors
  };

  return { joinQueue, leaveQueue };
};

export default useQueueSocket;