import socket from './socket';  // Assuming socket is initialized elsewhere
import { useAuthContext } from '../contexts/AuthContext';  // Assuming your context hook is here
import { useEffect } from 'react';

const useQueueSocket = () => {
  const { username } = useAuthContext(); // Access username from context

  // Join queue function
  const joinQueue = async () => {

    useEffect(() => {
        socket.on('room-name', (roomName: string) => {
            roomName = roomName;
            window.game_phase == 'MOVING';
            console.log(`Client started game in room: ${roomName}`)
        });
    
        return () => {
          socket.disconnect();
        };
      }, []);

    if (!username) {
      console.error('Username is not available');
      return;
    }

    const queuename = 'main'; // Queue name, can be dynamic later
    socket.emit('queues-join', username, queuename);

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
    socket.emit('queues-leave', username, queuename);

    // TODO: Handle server response
    // TODO: Handle errors
  };

  return { joinQueue, leaveQueue };
};

export default useQueueSocket;