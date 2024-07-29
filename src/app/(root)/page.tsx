"use client";
import PatientInfoDialog from "@/components/common/patientInfoDialog";
import Sidebar from "@/components/common/sidebar";
import Recorder from "@/components/home/Recorder";
import { useTranscription } from "@/contexts/TranscriptionContext";
import { useCallback, useEffect, useRef, useState } from "react";
import { useDropzone } from "react-dropzone";

export default function Home() {
  const { loading, transcription, setAudioBlob, setFile, setOpen } =
    useTranscription();
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [isDragActive, setIsDragActive] = useState<boolean>(false);
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
            HEIGHT - barHeight / 5,
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

  const handleDialogOpen = () => {
    setOpen(true);
  };

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    setFile(file);
    handleDialogOpen();
  }, []);

  const {
    getRootProps,
    getInputProps,
    isDragActive: dropzoneIsActive,
  } = useDropzone({
    noClick: true,
    onDrop,
    onDragEnter: () => setIsDragActive(true),
    onDragLeave: () => setIsDragActive(false),
  });

  useEffect(() => {
    if (!dropzoneIsActive) {
      setIsDragActive(false);
    }
  }, [dropzoneIsActive]);

  return (
    <div
      {...getRootProps()}
      className="relative h-screen w-full"
      style={{ height: "calc(100vh - 64px)" }}
    >
      <input {...getInputProps()} />
      <div className=" flex relative w-full h-full bg-white">
        <Sidebar />
        <div className="flex flex-col items-center justify-center w-full relative">
          {isDragActive && (
            <div
              className="absolute p-2 top-0 left-0 w-full h-full flex items-end justify-center"
              style={{ zIndex: 9999 }}
            >
              <div className="bg-black p-2 bg-opacity-10 border-2 border-dotted border-cyan-500 rounded-lg w-full h-full flex items-end justify-center">
                <div className="p-4 bg-[#3489e5] rounded-xl">
                  <p className="text-white text-sm">
                    Drop audio files here to upload them
                  </p>
                </div>
              </div>
            </div>
          )}

          <Recorder
            loading={loading}
            transcription={transcription}
            isRecording={isRecording}
            isPaused={isPaused}
            handlePlayPause={handlePlayPause}
            canvasRef={canvasRef}
            stopRecording={stopRecording}
            handleDialogOpen={handleDialogOpen}
          />
          {/* {audioBlob && (
            <audio controls>
              <source src={URL.createObjectURL(audioBlob)} type="audio/wav" />
            </audio>
          )} */}
          <PatientInfoDialog />
        </div>
      </div>
    </div>
  );
}
