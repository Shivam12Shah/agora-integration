const express = require('express');
const cors = require('cors');
const { RtcTokenBuilder, RtcRole } = require("agora-access-token");



const app = express();
app.use(cors());






const APP_ID = "d27d05d2df064deda545c8644a9c14a2";
const APP_CERTIFICATE = "6fc96cf8fcb249bfbc6c32fcba18f792";

app.get("/access_token", (req, res) => {
  const channelName = req.query.channelName;
  if (!channelName) {
    return res.status(400).json({ error: "channelName is required" });
  }

  console.log("sdasda",RtcRole);
  
  const uid = req.query.uid || 0; // UID of user
  const role = RtcRole.PUBLISHER; // can be SUBSCRIBER if only viewer
  const expireTime = 3600; // 1 hour

  const token = RtcTokenBuilder.buildTokenWithUid(
    APP_ID,
    APP_CERTIFICATE,
    channelName,
    uid,
    role,
    Math.floor(Date.now() / 1000) + expireTime
  );

  return res.json({ token, appId: APP_ID, channelName, uid });
});



app.listen(3000,()=>{
    console.log("Server is running on port 3000");
})