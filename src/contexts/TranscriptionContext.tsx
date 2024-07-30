"use client";
import React, { createContext, useContext, useRef, useState } from "react";

interface TranscriptionContextProps {
  isRecording: boolean;
  isPaused: boolean;
  audioBlob: Blob | null;
  file: File | null;
  open: boolean;
  transcription: string;
  patientName: string;
  dob: string;
  loading: boolean;
  status: string;
  notes: string;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  setPatientName: React.Dispatch<React.SetStateAction<string>>;
  setDob: React.Dispatch<React.SetStateAction<string>>;
  setTranscription: React.Dispatch<React.SetStateAction<string>>;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setFile: React.Dispatch<React.SetStateAction<File | null>>;
  startRecording: () => void;
  pauseRecording: () => void;
  resumeRecording: () => void;
  handleDialogOpen: () => void;
  handleDialogClose: (e?: any, reason?: string) => void;
  stopRecording: () => void;
  setAudioBlob: React.Dispatch<React.SetStateAction<Blob | null>>;
  handleGenerateNote: (skip?: boolean) => Promise<void>;
}

const TranscriptionContext = createContext<
  TranscriptionContextProps | undefined
>(undefined);

export const TranscriptionProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [status, setStatus] = useState<string>("");
  const [notes, setNotes] = useState<string>("");

  const [patientName, setPatientName] = useState<string>("");
  const [dob, setDob] = useState<string>("");
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [transcription, setTranscription] = useState<string>("");
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [open, setOpen] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const dataArrayRef = useRef<Uint8Array | null>(null);
  const animationIdRef = useRef<number | null>(null);

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

  const handleDialogOpen = () => {
    setOpen(true);
  };

  const handleDialogClose = (e?: any, reason?: string) => {
    if (reason === "backdropClick" || reason === "escapeKeyDown") return;
    setOpen(false);
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      setIsPaused(false);
    }
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
        setLoading(true);
        setStatus("Generating Transcription...");

        const response = await fetch("/api/transcribe", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        });

        const reader = response.body?.getReader();
        const decoder = new TextDecoder();
        while (true) {
          const result = await reader?.read();
          if (result?.done) break;

          const decodedChunk = decoder.decode(result?.value);
          const parsedChunk = JSON.parse(decodedChunk);

          if (parsedChunk.transcription) {
            setTranscription(parsedChunk.transcription);
            setStatus("Generating Notes...");
          } else if (parsedChunk.Notes) {
            setNotes(parsedChunk.Notes);
            setStatus("Completed");
          } else if (parsedChunk.error) {
            console.log(parsedChunk.error);
            setStatus("Error");
          }
        }

        setFile(null);
        setAudioBlob(null);
      } catch (error) {
        console.error("Error generating note:", error);
        console.log("An error occurred while generating the note.");
        setStatus("Error");
      } finally {
        if (file) {
          setFile(null);
        }
        setLoading(false);
        handleDialogClose();
      }
    };
  };

  return (
    <TranscriptionContext.Provider
      value={{
        isRecording,
        isPaused,
        audioBlob,
        file,
        open,
        transcription,
        patientName,
        dob,
        loading,
        status,
        notes,
        setPatientName,
        setLoading,
        setDob,
        setTranscription,
        setOpen,
        setFile,
        handleDialogClose,
        handleDialogOpen,
        setAudioBlob,
        startRecording,
        pauseRecording,
        resumeRecording,
        stopRecording,
        handleGenerateNote,
      }}
    >
      {children}
    </TranscriptionContext.Provider>
  );
};

export const useTranscription = () => {
  const context = useContext(TranscriptionContext);
  if (!context) {
    throw new Error(
      "useTranscription must be used within a TranscriptionProvider"
    );
  }
  return context;
};
