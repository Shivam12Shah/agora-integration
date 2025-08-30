import React, { useEffect, useState } from "react";
import AgoraChat from "agora-chat";

const conn = new AgoraChat.connection({
  appKey: "411391270#1596005", // from Agora Console
});

export default function ChatBox({ user, peer }) {
  const [messages, setMessages] = useState([]);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    conn.open({ user, pwd: "123456" }); // For testing; use token in production

    conn.listen({
      onTextMessage: (message) => {
        setMessages((prev) => [...prev, `${message.from}: ${message.data}`]);
      },
    });
  }, [user]);

  const sendMessage = () => {
    const option = {
      chatType: "singleChat",
      type: "txt",
      to: peer, // recipient
      msg,
    };
    conn.send(option);
    setMessages((prev) => [...prev, `${user}: ${msg}`]);
    setMsg("");
  };

  return (
    <div>
      <h3>Chat</h3>
      <div style={{ border: "1px solid #ccc", height: "200px", overflowY: "scroll", marginBottom: "10px" }}>
        {messages.map((m, i) => (
          <div key={i}>{m}</div>
        ))}
      </div>
      <input value={msg} onChange={(e) => setMsg(e.target.value)} />
      <button onClick={sendMessage}>Send</button>
    </div>
  );
}
