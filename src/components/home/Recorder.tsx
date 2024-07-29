import loadingAnimation from "@/lotties/loading.json";
import { Mic, PauseCircle, PlayCircle } from "@mui/icons-material";
import { AnimatePresence, motion } from "framer-motion";
import React from "react";
import Lottie from "react-lottie";
import TranscribeModal from "./TranscribeModal";

interface RecorderProps {
  isRecording: boolean;
  isPaused: boolean;
  canvasRef: React.RefObject<HTMLCanvasElement>;
  handlePlayPause: () => void;
  stopRecording: () => void;
  handleDialogOpen: () => void;
  transcription: string;
  loading: boolean;
}

const Recorder = ({
  isRecording,
  isPaused,
  canvasRef,
  handlePlayPause,
  stopRecording,
  handleDialogOpen,
  transcription,
  loading,
}: RecorderProps) => {
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: loadingAnimation,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };
  return (
    <>
      {loading ? (
        <div className="mb-8 text-center">
          <Lottie options={defaultOptions} height={300} width={300} />
          <p>Generating transcription....</p>
        </div>
      ) : (
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
                <h1 className="text-2xl">Start a new conversation</h1>
                <div className=" flex gap-2 md:flex-row flex-col">
                  <button
                    // disabled={transcription.length > 1}
                    onClick={handlePlayPause}
                    className={`px-4 bg-[#051D2F] text-[12px] flex items-center justify-center gap-1 uppercase text-white py-2 rounded-[100px] shadow hover:bg-[#051D2F] transition-colors duration-300 z-50 `}
                  >
                    <Mic fontSize="small" />
                    Capture conversation
                  </button>
                  {transcription?.length > 1 && (
                    <TranscribeModal transcription={transcription} />
                  )}
                </div>
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
            <div className=" w-[60px] h-[0.2px] opacity-20 bg-black"></div>
            <p className=" text-sm">or</p>
            <div className=" w-[60px] h-[0.2px] opacity-20 bg-black"></div>
          </div>
          <h1 className=" text-center text-sm opacity-60">
            Drag in a pre-recorded visit.
          </h1>
        </div>
      )}
    </>
  );
};

export default Recorder;
