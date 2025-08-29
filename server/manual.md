## Steps

- p2p connection making
- signaling through STUN servers to interconnect p2p
- cause NAT (network action transaction ) of routers changes ip constantly
- ICE helps to establish and stabilize ip connection with STUN

- ICE candidates (avaiable ports/ip by each peer)
- saved on DB by server to maintain connectivity

# Basicos

---

# 🔹 1. What is WebRTC?

**WebRTC (Web Real-Time Communication)** is an open-source standard that allows browsers, mobile apps, and servers to do:

- **Peer-to-peer video/audio calls** (like Google Meet, Zoom, WhatsApp).
- **Data channels** → send arbitrary data (chat messages, game sync, files).
- **Low-latency streaming** (Twitch-like apps with ultra-low delay).

👉 The main **killer feature**: No plugins needed, works in browsers directly, with **latency in milliseconds** (unlike HLS/DASH video streams with seconds of delay).

---

# 🔹 2. The Core Pieces of WebRTC

To really understand WebRTC, you need to know the 4 moving parts:

1. **PeerConnection**

   - Represents a connection between two peers.
   - Handles sending/receiving **audio, video, data**.

2. **MediaStream (getUserMedia)**

   - Lets you capture camera, mic, or screen.
   - Example: `navigator.mediaDevices.getUserMedia({ video: true, audio: true })`.

3. **ICE Candidates (STUN/TURN)**

   - WebRTC needs to know _how peers can reach each other_.
   - Internet is messy (firewalls, NAT, private IPs).
   - **STUN server** → tells the peer its public IP.
   - **TURN server** → relays traffic when direct P2P is blocked (heavy but reliable).

4. **Signaling Server**

   - WebRTC itself does **NOT** handle signaling.
   - You need a backend (e.g. Node.js with Socket.IO) to exchange:

     - Offers
     - Answers
     - ICE Candidates

   - After that → peers connect **directly**, backend steps out.

---

```
Internet Structure Problem:
┌─────────────────┐    ┌─────────────────┐
│   Private Net   │    │   Private Net   │
│ 192.168.1.100   │    │ 192.168.1.200   │
│      (Bob)      │    │     (Alice)     │
└─────────┬───────┘    └─────────┬───────┘
          │                      │
    ┌─────▼─────┐          ┌─────▼─────┐
    │ NAT/Router│          │ NAT/Router│
    │Public IP: │          │Public IP: │
    │ 203.0.1.1 │          │ 198.51.100.1│
    └─────┬─────┘          └─────┬─────┘
          │                      │
          └──────────┬───────────┘
                     │
              ┌─────▼─────┐
              │ Internet  │
              └───────────┘
```

**_The Problem:_** Bob can't directly connect to Alice because:

- Both are behind NATs with private IP addresses
- NATs block unsolicited incoming connections
- Bob doesn't know Alice's real network path

**WebRTC's Solution:** Uses ICE (Interactive Connectivity Establishment) protocol with STUN/TURN servers to discover network paths and establish direct connections.

## WebRTC Protocol Stack

```
Application Layer
├── MediaStream API (getUserMedia)
├── RTCPeerConnection API
└── RTCDataChannel API
    │
Media Layer
├── Audio Codecs (Opus, G.722, G.711)
├── Video Codecs (VP8, VP9, H.264, AV1)
└── Data Channel (SCTP over DTLS)
    │
Transport Layer
├── SRTP (Secure Real-time Transport Protocol)
├── SRTCP (Secure RTP Control Protocol)
└── DTLS (Datagram Transport Layer Security)
    │
Network Layer
├── ICE (Interactive Connectivity Establishment)
├── STUN (Session Traversal Utilities for NAT)
└── TURN (Traversal Using Relays around NAT)
    │
Physical Layer
└── UDP/TCP (Usually UDP for media)
```

# 🔹 3. WebRTC Flow (Step by Step)

1. User A opens app → captures camera/mic.
2. User A creates an **offer** (SDP = Session Description Protocol blob with codec info).
3. Offer is sent via **signaling server** to User B.
4. User B receives offer → creates an **answer**.
5. Answer goes back to User A through signaling server.
6. Both peers exchange **ICE candidates** until connection established.
7. Boom → direct audio/video/data channel is set up.

👉 Backend is only needed for **signaling** + **TURN relay** in case of firewalls.

---

# 🔹 4. Industry Standard Stack

- **Frontend**: React (hooks to manage camera, PeerConnection, etc.).
- **Backend**: Node.js/TypeScript + Socket.IO (signaling).
- **STUN/TURN**: Google STUN servers (`stun:stun.l.google.com:19302`) for dev, [Coturn](https://github.com/coturn/coturn) for prod.
- **Optional scaling**: mediasoup, Janus, LiveKit, Jitsi (for >10 peers or large streams).

---

# 🔹 5. Minimal Example (React + TS Backend)

---

### 📌 Backend (TypeScript + Express + Socket.IO)

```ts
// backend/server.ts
import express from "express";
import http from "http";
import { Server } from "socket.io";

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

// Handle socket connections
io.on("connection", (socket) => {
  console.log("New client connected:", socket.id);

  // Forward "offer" SDP from one client to another
  socket.on("offer", (data) => {
    // data: { offer, to }
    io.to(data.to).emit("offer", { offer: data.offer, from: socket.id });
  });

  // Forward "answer" SDP
  socket.on("answer", (data) => {
    io.to(data.to).emit("answer", { answer: data.answer, from: socket.id });
  });

  // Forward ICE candidates
  socket.on("ice-candidate", (data) => {
    io.to(data.to).emit("ice-candidate", {
      candidate: data.candidate,
      from: socket.id,
    });
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
  });
});

server.listen(5000, () => console.log("Signaling server running on :5000"));
```

---

### 📌 Frontend (React + Hooks)

```tsx
// frontend/VideoChat.tsx
import React, { useEffect, useRef, useState } from "react";
import io from "socket.io-client";

const socket = io("http://localhost:5000"); // connect to signaling server

const VideoChat: React.FC = () => {
  const localVideo = useRef<HTMLVideoElement>(null);
  const remoteVideo = useRef<HTMLVideoElement>(null);
  const peerConnection = useRef<RTCPeerConnection | null>(null);

  const [remoteId, setRemoteId] = useState<string>("");

  useEffect(() => {
    // 1. Get local camera/mic
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((stream) => {
        if (localVideo.current) localVideo.current.srcObject = stream;

        // Create peer connection
        peerConnection.current = new RTCPeerConnection({
          iceServers: [{ urls: "stun:stun.l.google.com:19302" }], // use STUN
        });

        // Add local stream tracks
        stream
          .getTracks()
          .forEach((track) => peerConnection.current?.addTrack(track, stream));

        // When remote stream arrives
        peerConnection.current.ontrack = (event) => {
          if (remoteVideo.current)
            remoteVideo.current.srcObject = event.streams[0];
        };

        // Handle ICE candidates
        peerConnection.current.onicecandidate = (event) => {
          if (event.candidate && remoteId) {
            socket.emit("ice-candidate", {
              candidate: event.candidate,
              to: remoteId,
            });
          }
        };
      });

    // Listen for signaling messages
    socket.on("offer", async ({ offer, from }) => {
      setRemoteId(from);
      await peerConnection.current?.setRemoteDescription(
        new RTCSessionDescription(offer)
      );
      const answer = await peerConnection.current?.createAnswer();
      await peerConnection.current?.setLocalDescription(answer!);
      socket.emit("answer", { answer, to: from });
    });

    socket.on("answer", async ({ answer }) => {
      await peerConnection.current?.setRemoteDescription(
        new RTCSessionDescription(answer)
      );
    });

    socket.on("ice-candidate", async ({ candidate }) => {
      try {
        await peerConnection.current?.addIceCandidate(
          new RTCIceCandidate(candidate)
        );
      } catch (err) {
        console.error("Error adding ICE candidate:", err);
      }
    });
  }, [remoteId]);

  // Create and send offer to another peer
  const callUser = async (id: string) => {
    setRemoteId(id);
    const offer = await peerConnection.current?.createOffer();
    await peerConnection.current?.setLocalDescription(offer!);
    socket.emit("offer", { offer, to: id });
  };

  return (
    <div className="flex flex-col items-center">
      <video
        ref={localVideo}
        autoPlay
        playsInline
        muted
        className="w-1/3 border"
      />
      <video ref={remoteVideo} autoPlay playsInline className="w-1/3 border" />
      <input
        type="text"
        placeholder="Enter remote socket ID"
        value={remoteId}
        onChange={(e) => setRemoteId(e.target.value)}
        className="border p-2 mt-2"
      />
      <button
        onClick={() => callUser(remoteId)}
        className="bg-blue-500 text-white p-2 mt-2"
      >
        Call
      </button>
    </div>
  );
};

export default VideoChat;
```

---

# 🔹 6. Key Notes (Theory + Practice)

- **WebRTC ≠ Streaming Protocol** → It’s for _real-time communication_. For huge live streams, you’d still integrate with HLS/DASH.
- **STUN/TURN servers are mandatory** for real-world usage. Otherwise, users behind NAT/firewalls can’t connect.
- **Security**: Everything is encrypted (SRTP/DTLS).
- **Browser APIs only work on HTTPS** (or `localhost` for dev).
- **Scaling**: For >10 people calls, use an SFU (like mediasoup or Janus).

---
