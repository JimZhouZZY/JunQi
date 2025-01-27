import React, { createContext, useContext, useState } from "react";

type SocketContextType = {
  socket?: SocketIOClient.Socket;
  setSocket: (socket: SocketIOClient.Socket) => void;
};

const SocketContext = createContext<SocketContextType | undefined>(undefined);

interface Props {
  children: React.ReactNode;
}

export const SocketProvider: React.FC<Props> = ({ children }) => {
  const [socket, setSocket] = useState<SocketIOClient.Socket | undefined>(
    undefined,
  );

  return (
    <SocketContext.Provider value={{ socket, setSocket }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocketContext = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
