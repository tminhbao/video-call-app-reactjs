import React, { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSocket } from "../../providers/socket";

const Home = () => {
  const { socket } = useSocket();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [roomId, setRoomId] = useState("");

  const handleRoomJoined = useCallback(
    ({ roomId }) => {
      navigate(`/room/${roomId} `);
    },
    [navigate]
  );

  useEffect(() => {
    socket.on("joined-room", handleRoomJoined);
    return () => {
      socket.off("joined-room", handleRoomJoined);
    };
  }, [handleRoomJoined, socket]);

  const handleJoinRoom = () => {
    socket.emit("join-room", { roomId, emailId: email });
  };

  return (
    <div className="homepage-container">
      <div className="input-container">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
        />
        <input
          type="text"
          value={roomId}
          onChange={(e) => setRoomId(e.target.value)}
          placeholder="Enter your room code"
        />
        <button onClick={handleJoinRoom}>Enter</button>
      </div>
    </div>
  );
};

export default Home;
