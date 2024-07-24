"use client";
import Sidebar from "@/components/common/sidebar";
import { RecordVoiceOver, StopCircleOutlined } from "@mui/icons-material";
import PauseCircleIcon from "@mui/icons-material/PauseCircle";
import PlayCircleIcon from "@mui/icons-material/PlayCircle";
import axios from "axios";
import { useEffect, useRef, useState } from "react";

export default function Home() {
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const dataArrayRef = useRef<Uint8Array | null>(null);
  const animationIdRef = useRef<number | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (canvasRef.current) {
      const canvas = canvasRef.current;
      const canvasCtx = canvas.getContext("2d");

      const draw = () => {
        if (!canvasCtx || !analyserRef.current || !dataArrayRef.current) {
          return;
        }

        const WIDTH = canvas.width;
        const HEIGHT = canvas.height;

        analyserRef.current.getByteFrequencyData(dataArrayRef.current);

        canvasCtx.clearRect(0, 0, WIDTH, HEIGHT);

        const barWidth = (WIDTH / analyserRef.current.frequencyBinCount) * 2.5;
        let barHeight;
        let x = 0;

        for (let i = 0; i < analyserRef.current.frequencyBinCount; i++) {
          barHeight = dataArrayRef.current[i];

          canvasCtx.fillStyle = "rgb(255, 20, 147)";
          canvasCtx.fillRect(
            x,
            HEIGHT - barHeight / 2,
            barWidth,
            barHeight / 2
          );

          x += barWidth + 1;
        }

        animationIdRef.current = requestAnimationFrame(draw);
      };

      draw();
    }

    return () => {
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current);
      }
    };
  }, [isRecording]);

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

      audioContextRef.current = new AudioContext();
      const source = audioContextRef.current.createMediaStreamSource(stream);
      analyserRef.current = audioContextRef.current.createAnalyser();
      analyserRef.current.fftSize = 256;
      const bufferLength = analyserRef.current.frequencyBinCount;
      dataArrayRef.current = new Uint8Array(bufferLength);

      source.connect(analyserRef.current);

      mediaRecorderRef.current.ondataavailable = (event: BlobEvent) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorderRef.current.onstop = () => {
        const blob = new Blob(audioChunksRef.current, { type: "audio/wav" });
        setAudioBlob(blob);
        audioChunksRef.current = [];
        if (audioContextRef.current) {
          audioContextRef.current.close();
        }
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
      style={{ height: "calc(100vh - 64px)" }}
    >
      <Sidebar />
      <div className="flex flex-col items-center justify-center w-full relative">
        <canvas
          ref={canvasRef}
          width={340}
          height={140}
          className="border mt-8"
        ></canvas>
        <div className="mb-8 flex mt-4">
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
