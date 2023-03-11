import React, { useCallback, useEffect } from "react";
import { usePeer } from "../../providers/peer";
import { useSocket } from "../../providers/socket";

const Room = () => {
  const { socket } = useSocket();
  const { peer, createOffer, createAnswer } = usePeer();
  const handleNewUserJoined = useCallback(
    async (data) => {
      const { emailId } = data;
      console.log("New user join room", emailId);
      const offer = await createOffer();
      socket.emit("call-user", { emailId, offer });
    },
    [createOffer, socket]
  );

  const handleIncomingCall = useCallback(async (data) => {
    const { from, offer } = data;
    console.log("Incoming call from ", from, offer);
    const ans = await createAnswer(offer);
  }, []);

  useEffect(() => {
    socket.on("user-joined", handleNewUserJoined);
    socket.on("incoming-call", handleIncomingCall);
    return () => {
      socket.off("user-joined", handleNewUserJoined);
      socket.off("incoming-call", handleIncomingCall);
    };
  }, [socket, handleNewUserJoined]);
  return <div className="room-page-container">Room</div>;
};

export default Room;
