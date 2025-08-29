import React, { useState, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSocketContext } from "../../context/SocketContext";
import toast from "react-hot-toast";

const CreateCallPage = () => {
  const [email, setEmail] = useState("");
  const [room, setRoom] = useState("");

  const socket = useSocketContext();
  const navigate = useNavigate();

  const handleSubmitForm = useCallback(
    (e) => {
      e.preventDefault();
      if (!email.trim() || !room.trim()) {
        toast.error("Invalid Credentials !");
        return;
      }
      socket.emit("room-join", { email, room });
      //must have same field
    },
    [email, room, socket]
  );

  const handleJoinRoom = useCallback(
    (data) => {
      const { email, room, success } = data;
      navigate(`/call/${room}`);
      console.log(success);
    },
    [navigate]
  );

  useEffect(() => {
    //if joined gotten resp
    socket.on("room-join", handleJoinRoom);
    return () => {
      socket.off("room-join", handleJoinRoom); //clears func
    };
  }, [socket, handleJoinRoom]);
  return (
    <div
      className="h-screen w-screen flex  justify-center
    items-center "
    >
      <div className="flex flex-col  w-[50%] ">
        <h1 className="text-xl font-bold text-center mb-4">Lobby</h1>
        <form onSubmit={handleSubmitForm} className="form gap-2 flex flex-col">
          <input
            type="email"
            className="input  text-white"
            id="email"
            placeholder="write down your @email ... "
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="text"
            className="input  text-white"
            placeholder="write down room id / link ... "
            id="room"
            value={room}
            onChange={(e) => setRoom(e.target.value)}
          />
          <br />
          <button className="rounded-full  btn btn-primary">Join</button>
        </form>
      </div>
    </div>
  );
};

export default CreateCallPage;
