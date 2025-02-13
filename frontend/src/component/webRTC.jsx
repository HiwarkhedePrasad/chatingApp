import { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";

const socket = io("https://172.31.7.161:5000", {
  secure: true,
  rejectUnauthorized: false,
});

export default function WebRTCComponent() {
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const overlayCanvasRef = useRef(null);
  const peerConnection = useRef(null);
  const [roomId, setRoomId] = useState("");

  useEffect(() => {
    if (!roomId) return;

    socket.emit("join-room", roomId);
    console.log(`User ${socket.id} joined room ${roomId}`);

    const handleAnalysisResults = (results) => {
      const canvas = overlayCanvasRef.current;
      if (!canvas) {
        console.log("error");
        return;
      }
      const ctx = canvas.getContext("2d");

      // Ensure canvas size matches the video feed
      if (remoteVideoRef.current) {
        canvas.width = remoteVideoRef.current.videoWidth;
        canvas.height = remoteVideoRef.current.videoHeight;
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      results.faces.forEach((face) => {
        ctx.strokeStyle = "red";
        ctx.lineWidth = 2;
        ctx.strokeRect(face.x, face.y, face.width, face.height);
      });

      results.hands.forEach((hand) => {
        ctx.strokeStyle = "blue";
        ctx.lineWidth = 2;
        ctx.strokeRect(hand.x, hand.y, hand.width, hand.height);
      });

      results.objects.forEach((object) => {
        ctx.strokeStyle = "green";
        ctx.lineWidth = 2;
        ctx.strokeRect(object.x, object.y, object.width, object.height);

        ctx.fillStyle = "green";
        ctx.font = "14px Arial";
        ctx.fillText(object.class, object.x, object.y - 10);
      });
    };

    const handleOffer = async ({ offer }) => {
      if (!peerConnection.current) initPeerConnection();
      await peerConnection.current.setRemoteDescription(
        new RTCSessionDescription(offer)
      );
      const answer = await peerConnection.current.createAnswer();
      await peerConnection.current.setLocalDescription(answer);
      socket.emit("answer", { answer, room: roomId });
    };

    const handleAnswer = async ({ answer }) => {
      if (peerConnection.current) {
        await peerConnection.current.setRemoteDescription(
          new RTCSessionDescription(answer)
        );
      }
    };

    const handleCandidate = ({ candidate }) => {
      if (peerConnection.current) {
        peerConnection.current.addIceCandidate(new RTCIceCandidate(candidate));
      }
    };

    socket.on("analysis-results", handleAnalysisResults);
    socket.on("offer", handleOffer);
    socket.on("answer", handleAnswer);
    socket.on("candidate", handleCandidate);

    return () => {
      socket.off("analysis-results", handleAnalysisResults);
      socket.off("offer", handleOffer);
      socket.off("answer", handleAnswer);
      socket.off("candidate", handleCandidate);

      if (peerConnection.current) {
        peerConnection.current.close();
        peerConnection.current = null;
      }
    };
  }, [roomId]);

  const initPeerConnection = () => {
    peerConnection.current = new RTCPeerConnection({
      iceServers: [
        { urls: "stun:stun.l.google.com:19302" },
        {
          urls: "turn:openrelay.metered.ca:80",
          username: "openrelayproject",
          credential: "openrelayproject",
        },
      ],
    });

    peerConnection.current.onicecandidate = (event) => {
      if (event.candidate) {
        socket.emit("candidate", { candidate: event.candidate, room: roomId });
      }
    };

    peerConnection.current.ontrack = (event) => {
      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = event.streams[0];
      }
    };
  };

  const startCall = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      localVideoRef.current.srcObject = stream;
      if (!peerConnection.current) initPeerConnection();
      stream
        .getTracks()
        .forEach((track) => peerConnection.current.addTrack(track, stream));
      const offer = await peerConnection.current.createOffer();
      await peerConnection.current.setLocalDescription(offer);
      socket.emit("offer", { offer, room: roomId });
    } catch (error) {
      console.error("Error accessing media devices:", error);
      alert(
        "Could not access camera/microphone. Please check permissions and close other apps."
      );
    }
  };
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-800 to-gray-900 text-white p-6">
      <h1 className="text-3xl md:text-4xl font-extrabold mb-6 text-center">
        WebRTC Video Chat
      </h1>

      <div className="flex flex-col items-center space-y-4 w-full max-w-md">
        <input
          type="text"
          placeholder="Enter Room ID"
          value={roomId}
          onChange={(e) => setRoomId(e.target.value)}
          className="w-full p-3 rounded-lg text-gray-900 bg-white shadow-md focus:ring-2 focus:ring-blue-400"
        />

        <button
          onClick={() => socket.emit("join-room", roomId)}
          disabled={!roomId}
          className={`w-full px-4 py-2 rounded-lg font-semibold transition ${
            roomId
              ? "bg-green-500 hover:bg-green-600"
              : "bg-gray-500 cursor-not-allowed"
          }`}
        >
          Join Room
        </button>
      </div>

      {/* Video Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6 w-full max-w-3xl">
        <div className="relative border border-gray-700 rounded-lg overflow-hidden">
          <video
            ref={localVideoRef}
            autoPlay
            playsInline
            muted
            className="w-full h-auto bg-black"
          />
        </div>
        <div className="relative border border-gray-700 rounded-lg overflow-hidden">
          <video
            ref={remoteVideoRef}
            autoPlay
            playsInline
            className="w-full h-auto bg-black"
          />
          <canvas
            ref={overlayCanvasRef}
            className="absolute top-0 left-0 w-full h-full pointer-events-none"
          />
        </div>
      </div>

      <button
        onClick={startCall}
        disabled={!roomId}
        className={`mt-6 w-full max-w-md px-4 py-2 rounded-lg font-semibold transition ${
          roomId
            ? "bg-blue-500 hover:bg-blue-600"
            : "bg-gray-500 cursor-not-allowed"
        }`}
      >
        Start Call
      </button>
    </div>
  );
}
