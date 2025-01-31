/*
 * Copyright (C) 2025 Zhiyu Zhou (jimzhouzzy@gmail.com)
 * This file is part of Web-JunQi.
 * Licensed under the GPLv3 License.
 */

import { useEffect, useState } from "react";
import { useSocketContext } from "../contexts/SocketContext";
import { useGameContext } from "../contexts/GameContext";
import { useAuthContext } from "../contexts/AuthContext";

const useChatSocket = () => {
    const { socket } = useSocketContext();
    const [ messages, setMessages ] = useState<{ sender: string, text: string }[]>([{sender: "Server", text: "Welcome to Web-JunQi!"}]);
    const { roomName } = useGameContext();
    const { username } = useAuthContext();

    useEffect(() => {
        if (!socket) {
          console.log("socket is not available");
          return;
        }

        socket.on("chat-message", (msg: { sender: string, text: string }) => {
            setMessages((prev) => [...prev, msg]);
        });
    }, [socket]);

    const emitMessage = (input: string) => {
        if (input.trim() === "" || roomName === undefined) return;
        socket?.emit("chat-message", {sender: username,  text: input}, roomName)
    };

    return { emitMessage, messages };
}

export default useChatSocket;