/*
 * Copyright (C) 2025 Zhiyu Zhou (jimzhouzzy@gmail.com)
 * This file is part of Web-JunQi.
 * Licensed under the GPLv3 License.
 */
import io from 'socket.io-client';
import { useSocketContext } from '../contexts/SocketContext';
import useGameSocket from './game'
import useQueueSocket from './game'


const useSocket = () => {
    const { socket, setSocket } = useSocketContext();

    const initSocket = () => {
        if (socket !== undefined) {
            socket.disconnect();
        }
        console.log("Initializing socket");
        setSocket(io());
    }

    return { initSocket };
}

export default useSocket;