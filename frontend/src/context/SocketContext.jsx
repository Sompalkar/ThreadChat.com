import { createContext, useContext, useEffect, useState } from "react";
import { useRecoilValue } from "recoil";
import io from "socket.io-client";
import userAtom from "../atoms/userAtom";

const SocketContext = createContext();

export const useSocket = () => {
  return useContext(SocketContext);
};

export const SocketContextProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const user = useRecoilValue(userAtom);

  useEffect(() => {
    if (user?._id && !socket) {
      // Only establish a new socket connection if user._id is available and socket is not already set
      const newSocket = io("https://sociomedia-com.onrender.com", {
        query: {
          userId: user._id,
        },
      });

      setSocket(newSocket);

      newSocket.on("getOnlineUsers", (users) => {
        setOnlineUsers(users);
      });

      // Clean up the socket connection when the component unmounts or the user logs out
      return () => newSocket.close();
    }

    // If there's no user._id or the socket is already set, no need to establish a new connection
    return undefined;
  }, [user, socket]); // Add dependencies to the useEffect dependency array

  return (
    <SocketContext.Provider value={{ socket, onlineUsers }}>
      {children}
    </SocketContext.Provider>
  );
};
