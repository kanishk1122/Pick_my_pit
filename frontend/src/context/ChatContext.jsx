import React, { createContext, useContext, useEffect, useState } from "react";
import io from "socket.io-client";

const ChatContext = createContext();

export const useChatContext = () => useContext(ChatContext);

export const ChatProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [chatRooms, setChatRooms] = useState({});
  const [connectionError, setConnectionError] = useState(null);

  useEffect(() => {
    const connectSocket = () => {
      const newSocket = io("http://localhost:5000", {
        transports: ["websocket", "polling"],
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
        withCredentials: true,
      });

      newSocket.on("connect", () => {
        console.log("Connected to server");
        setSocket(newSocket);
        setConnectionError(null);
      });

      newSocket.on("connect_error", (error) => {
        console.error("Connection error:", error);
        setConnectionError(
          "Unable to connect to chat server. Please try again later."
        );
      });

      newSocket.on("receive_message", ({ roomId, message, sender }) => {
        setChatRooms((prev) => ({
          ...prev,
          [roomId]: [...(prev[roomId] || []), { message, sender }],
        }));
      });

      return newSocket;
    };

    const socket = connectSocket();

    return () => {
      if (socket) socket.close();
    };
  }, []);

  const joinChatRoom = (roomId) => {
    if (socket) {
      socket.emit("join_room", roomId);
      setChatRooms((prev) => ({ ...prev, [roomId]: [] }));
    }
  };

  const leaveChatRoom = (roomId) => {
    if (socket) {
      socket.emit("leave_room", roomId);
      setChatRooms((prev) => {
        const newRooms = { ...prev };
        delete newRooms[roomId];
        return newRooms;
      });
    }
  };

  const sendMessage = (roomId, message, sender) => {
    if (socket) {
      socket.emit("send_message", { roomId, message, sender });
      setChatRooms((prev) => ({
        ...prev,
        [roomId]: [...(prev[roomId] || []), { message, sender }],
      }));
    }
  };

  return (
    <ChatContext.Provider
      value={{
        socket,
        chatRooms,
        joinChatRoom,
        leaveChatRoom,
        sendMessage,
        connectionError,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};
