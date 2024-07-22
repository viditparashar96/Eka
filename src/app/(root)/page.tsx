"use client";
import Sidebar from "@/components/common/sidebar";
import WaveAnimation from "@/components/WaveAnimation";
import PauseCircleIcon from "@mui/icons-material/PauseCircle";
import PlayCircleIcon from "@mui/icons-material/PlayCircle";
import axios from "axios";
import { useRef, useState } from "react";

export default function Home() {
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const handlePlayPause = () => {
    if (!isRecording) {
      startRecording();
    } else {
      stopRecording();
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);

      mediaRecorderRef.current.ondataavailable = (event: BlobEvent) => {
        console.log("audio chunks===>", event);
        audioChunksRef.current.push(event.data);
      };

      mediaRecorderRef.current.onstop = () => {
        const blob = new Blob(audioChunksRef.current, { type: "audio/wav" });
        console.log("blob===>", blob);
        setAudioBlob(blob);
        audioChunksRef.current = [];
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
    } catch (error) {
      console.error("Error starting recording:", error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const handleGenerateNote = async () => {
    if (!audioBlob) return;
    console.log("audioBlob===>", audioBlob);
    try {
      const reader = new FileReader();
      reader.readAsDataURL(audioBlob);
      reader.onloadend = async () => {
        const base64Audio = reader.result as string;

        const response = await axios.post("/api/transcribe", {
          audioBlob: base64Audio,
        });
        console.log("response===>", response);
        // if (response.status === 200) {
        //   console.log("Note generated:", response.data);
        // }
      };
    } catch (error) {
      console.error("Error generating note:", error);
    }
  };

  return (
    <div
      className="h-screen flex relative w-full bg-white"
      style={{ height: "calc(100vh - 100px)" }}
    >
      <Sidebar />
      <div className="flex flex-col items-center justify-center w-full relative">
        <div className="mb-8 relative w-24 h-24">
          <WaveAnimation isRecording={isRecording} />
          <button
            onClick={handlePlayPause}
            className="w-24 h-24 bg-primary-500 rounded-full flex items-center justify-center shadow-lg hover:bg-blue-600 transition-colors duration-300 relative z-10"
          >
            {isRecording ? (
              <PauseCircleIcon
                style={{ fontSize: 50 }}
                className="text-white"
              />
            ) : (
              <PlayCircleIcon style={{ fontSize: 50 }} className="text-white" />
            )}
          </button>
        </div>
        <p className="text-gray-700 mb-6">
          Press &apos;Play&apos; to capture the visit
        </p>
        {audioBlob && (
          <audio controls>
            <source src={URL.createObjectURL(audioBlob)} type="audio/wav" />
          </audio>
        )}
        <button
          className="px-6 py-2 bg-primary-500 text-white rounded-md shadow hover:bg-blue-600 transition-colors duration-300"
          onClick={handleGenerateNote}
        >
          Generate Note
        </button>
      </div>
    </div>
  );
}
