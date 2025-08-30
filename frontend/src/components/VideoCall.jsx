import React, { useEffect, useRef } from "react";
import AgoraRTC from "agora-rtc-sdk-ng";

export default function VideoCall({ channelName, userId }) {
console.log("useridasdadasd", userId);

  const localRef = useRef(null);
  const remoteRef = useRef(null);

  useEffect(() => {
    const client = AgoraRTC.createClient({ mode: "rtc", codec: "vp8" });
    let localTracks = [];

    const init = async () => {
      // 1. Fetch token
      const res = await fetch(
        `http://localhost:3000/access_token?channelName=${channelName}&uid=${userId}`
      );
      const data = await res.json();

      // 2. Join channel
      await client.join(data.appId, channelName, data.token, data.uid);

      // 3. Create local tracks
      const micTrack = await AgoraRTC.createMicrophoneAudioTrack();
      const camTrack = await AgoraRTC.createCameraVideoTrack();
      localTracks = [micTrack, camTrack];

      // 4. Play local video
      camTrack.play(localRef.current);

      // 5. Publish
      await client.publish(localTracks);

      // 6. Handle remote user
      client.on("user-published", async (user, mediaType) => {
        await client.subscribe(user, mediaType);
        if (mediaType === "video" && remoteRef.current) {
          user.videoTrack.play(remoteRef.current);
        }
        if (mediaType === "audio") {
          user.audioTrack.play();
        }
      });

      client.on("user-unpublished", () => {
        if (remoteRef.current) {
          remoteRef.current.innerHTML = "";
        }
      });
    };

    init();

    return () => {
      localTracks.forEach((track) => track.close());
      client.leave();
    };
  }, [channelName, userId]);

  return (
    <div style={{ display: "flex", gap: "20px" }}>
      <div
        ref={localRef}
        style={{ width: "300px", height: "200px", background: "black" }}
      />
      <div
        ref={remoteRef}
        style={{ width: "300px", height: "200px", background: "gray" }}
      />
    </div>
  );
}
