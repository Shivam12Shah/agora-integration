import React from "react";
import VideoCall from "./components/VideoCall";
import ChatBox from "./components/ChatBox";

function App() {
  // simulate 2 users joining the same channel
  const channelName = "testChannel";

  return (
    <div>
      <h1>1-to-1 Video + Chat</h1>
      <VideoCall channelName={channelName} userId={Math.floor(Math.random() * 10000)} />
      <ChatBox user="user1" peer="user2" />
    </div>
  );
}

export default App;
