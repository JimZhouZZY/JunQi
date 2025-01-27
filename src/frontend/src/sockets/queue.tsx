/*
 * Copyright (C) 2025 Zhiyu Zhou (jimzhouzzy@gmail.com)
 * This file is part of Web-JunQi.
 * Licensed under the GPLv3 License.
 */

import { useAuthContext } from "../contexts/AuthContext"; // Assuming your context hook is here
import { useEffect, useState } from "react";
import { useGameContext } from "../contexts/GameContext";
import { useSocketContext } from "../contexts/SocketContext";

const useQueueSocket = () => {
  const { username } = useAuthContext(); // Access username from context
  const { setRoomName, isInQueue, setIsInQueue } = useGameContext();
  const { socket, setSocket } = useSocketContext();

  // Join queue function
  const joinQueue = async () => {
    if (!username) {
      console.error("Username is not available");
      return;
    }

    const queuename = "main"; // Queue name, can be dynamic later
    socket?.emit("queues-join", username, queuename);

    console.log(`User ${username} joined queue ${queuename}.`);
    setIsInQueue(true);
    // TODO: Handle server response
    // TODO: Handle errors
  };

  // Leave queue function
  const leaveQueue = async () => {
    console.log(username);
    if (username === undefined) {
      console.error("Username is not available");
      return;
    }

    const queuename = "main"; // Queue name, can be dynamic later
    socket?.emit("queues-leave", username, queuename);

    console.log(`User ${username} joined queue ${queuename}.`);
    setIsInQueue(false);
    // TODO: Handle server response
    // TODO: Handle errors
  };

  useEffect(() => {
    if (!socket) {
      console.log("socket is not available");
      return;
    }

    console.log(`Initializing queue socket.on with socket: ${socket}`);
    socket?.on("room-name", (roomName: string) => {
      setRoomName(roomName);
      leaveQueue();
      console.log(`Client started game in room: ${roomName}`);
    });

    socket?.on("test", () => {
      console.log("queue.tsx: socket.on test okay");
    });

    return () => {
      // socket?.disconnect();
    };
  }, [socket]);
  return { joinQueue, leaveQueue };
};

export default useQueueSocket;
