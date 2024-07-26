"use client";
import Sidebar from "@/components/common/sidebar";
import { Mic, PauseCircle, PlayCircle } from "@mui/icons-material";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from "@mui/material/TextField";
import axios from "axios";
import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";
import { useDropzone } from "react-dropzone";

export default function Home() {
  const [open, setOpen] = useState(false);
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [isDragActive, setIsDragActive] = useState<boolean>(false);
  const [file, setFile] = useState<File | null>(null);
  const [patientName, setPatientName] = useState<string>("");
  const [dob, setDob] = useState<string>("");

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

  const handleDialogClose = (e?: any, reason?: string) => {
    if (reason === "backdropClick" || reason === "escapeKeyDown") return;
    setOpen(false);
  };

  const handleGenerateNote = async (skip: boolean = false) => {
    if (!audioBlob && !file) return;
    const reader = new FileReader();
    const blob = audioBlob || file;
    reader.readAsDataURL(blob!);
    reader.onloadend = async () => {
      const base64Audio = reader.result as string;
      const payload = {
        audioBlob: base64Audio,
        patientName: skip ? "" : patientName,
        dob: skip ? "" : dob,
      };
      try {
        const response = await axios.post("/api/transcribe", payload);
        if (response.data) {
          setFile(null);
          setAudioBlob(null);
        }
        console.log("Response:", response.data);
      } catch (error) {
        console.error("Error generating note:", error);
      }
      handleDialogClose();
    };
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
          <div className=" mb-8 ">
            <AnimatePresence mode="wait">
              {!isRecording ? (
                <motion.div
                  key="capture"
                  className="flex flex-col items-center justify-center space-y-4"
                  initial={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -40 }}
                  transition={{ duration: 0.5 }}
                >
                  <h1 className="text-2xl">Start a visit</h1>
                  <button
                    onClick={handlePlayPause}
                    className="px-4 bg-[#051D2F] text-[12px] flex items-center justify-center gap-1 uppercase text-white py-2 rounded-[100px] shadow hover:bg-[#051D2F] transition-colors duration-300 z-50"
                  >
                    <Mic fontSize="small" />
                    Capture visit
                  </button>
                </motion.div>
              ) : (
                <motion.div
                  key="listening"
                  className="flex flex-col items-center justify-center space-y-4"
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 1 }}
                >
                  <p className="text-xl">Listening...</p>
                </motion.div>
              )}
            </AnimatePresence>
            {isRecording && (
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 1 }}
              >
                <canvas
                  ref={canvasRef}
                  width={300}
                  height={40}
                  className=" mt-8"
                />
                <div className="flex gap-4 mt-4 items-center justify-center">
                  <button
                    onClick={() => {
                      stopRecording();
                      handleDialogOpen();
                    }}
                    className="px-4 bg-[#051D2F] text-[12px] flex items-center justify-center gap-1 uppercase text-white py-2 rounded-[100px] shadow hover:bg-[#051D2F] transition-colors duration-300 z-50"
                  >
                    <Mic fontSize="small" />
                    End Visit
                  </button>
                  <button
                    onClick={handlePlayPause}
                    className="px-4 bg-[#051D2F] text-[12px] flex items-center justify-center gap-1 uppercase text-white py-2 rounded-[100px] shadow hover:bg-[#051D2F] transition-colors duration-300 z-50"
                  >
                    {isPaused ? (
                      <PlayCircle fontSize="small" />
                    ) : (
                      <PauseCircle fontSize="small" />
                    )}
                    {isPaused ? "Resume" : "Pause"}
                  </button>
                </div>
              </motion.div>
            )}
            <div className=" flex items-center justify-center mt-4 gap-2">
              <div className=" w-[60px] h-[0.2px] bg-black"></div>
              <p className=" text-sm">or</p>
              <div className=" w-[60px] h-[0.2px] bg-black"></div>
            </div>
            <h1 className=" text-center text-sm opacity-60">
              Drag in a pre-recorded visit.
            </h1>
          </div>

          {audioBlob && (
            <audio controls>
              <source src={URL.createObjectURL(audioBlob)} type="audio/wav" />
            </audio>
          )}

          <Dialog open={open} onClose={handleDialogClose} fullWidth>
            <DialogTitle>Patient Information</DialogTitle>
            <DialogContent>
              <DialogContentText>
                Please enter the patient&apos;s name and date of birth.
              </DialogContentText>
              <TextField
                autoFocus
                required
                margin="dense"
                id="name"
                label="Patient Name"
                type="text"
                fullWidth
                variant="standard"
                value={patientName}
                onChange={(e) => setPatientName(e.target.value)}
              />
              <TextField
                required
                margin="dense"
                id="dob"
                label="Date of Birth"
                type="date"
                fullWidth
                variant="standard"
                value={dob}
                onChange={(e) => setDob(e.target.value)}
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={() => handleGenerateNote(true)}>Skip</Button>
              <Button onClick={() => handleGenerateNote(false)}>
                Generate
              </Button>
            </DialogActions>
          </Dialog>
        </div>
      </div>
    </div>
  );
}
