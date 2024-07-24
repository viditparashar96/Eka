"use client";
import Sidebar from "@/components/common/sidebar";
import { RecordVoiceOver, StopCircleOutlined } from "@mui/icons-material";
import PauseCircleIcon from "@mui/icons-material/PauseCircle";
import PlayCircleIcon from "@mui/icons-material/PlayCircle";
import axios from "axios";
import { useRef, useState } from "react";

export default function Home() {
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const handlePlayPause = () => {
    if (!isRecording) {
      startRecording();
    } else if (isPaused) {
      resumeRecording();
    } else {
      pauseRecording();
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);

      mediaRecorderRef.current.ondataavailable = (event: BlobEvent) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorderRef.current.onstop = () => {
        const blob = new Blob(audioChunksRef.current, { type: "audio/wav" });
        setAudioBlob(blob);
        audioChunksRef.current = [];
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
    } catch (error) {
      console.error("Error starting recording:", error);
    }
  };

  const pauseRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.pause();
      setIsPaused(true);
    }
  };

  const resumeRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.resume();
      setIsPaused(false);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      setIsPaused(false);
    }
  };

  const handleGenerateNote = async () => {
    if (!audioBlob) return;
    try {
      const reader = new FileReader();
      reader.readAsDataURL(audioBlob);
      reader.onloadend = async () => {
        const base64Audio = reader.result as string;

        const response = await axios.post("/api/transcribe", {
          audioBlob: base64Audio,
        });
        console.log("response===>", response);
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
        <div className="mb-8">
          <button
            onClick={handlePlayPause}
            className="w-24 h-24 bg-primary-500 rounded-full flex items-center justify-center shadow-lg hover:bg-blue-600 transition-colors duration-300 z-50"
          >
            {isRecording ? (
              isPaused ? (
                <PlayCircleIcon
                  style={{ fontSize: 50 }}
                  className="text-white"
                />
              ) : (
                <PauseCircleIcon
                  style={{ fontSize: 50 }}
                  className="text-white"
                />
              )
            ) : (
              <RecordVoiceOver
                style={{ fontSize: 50 }}
                className="text-white"
              />
            )}
          </button>
          {isRecording && (
            <button
              onClick={stopRecording}
              className="w-24 h-24 bg-red-500 rounded-full flex items-center justify-center shadow-lg hover:bg-red-700 transition-colors duration-300 z-50 ml-4"
            >
              <StopCircleOutlined
                style={{ fontSize: 50 }}
                className="text-white"
              />
            </button>
          )}
        </div>
        <p className="text-gray-700 mb-6">
          Press &apos;Record&apos; to capture the visit
        </p>
        {audioBlob && (
          <audio controls>
            <source src={URL.createObjectURL(audioBlob)} type="audio/wav" />
          </audio>
        )}
        <button
          onClick={handleGenerateNote}
          className="px-6 py-2 bg-primary-500 text-white rounded-md shadow hover:bg-blue-600 transition-colors duration-300 z-50"
        >
          Generate Note
        </button>
      </div>
    </div>
  );
}
