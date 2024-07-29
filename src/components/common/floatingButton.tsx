"use client";
import { useTranscription } from "@/contexts/TranscriptionContext";
import { FileUpload, Mic } from "@mui/icons-material";
import AddIcon from "@mui/icons-material/Add";
import Fab from "@mui/material/Fab";
import { AnimatePresence, motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import PatientInfoDialog from "./patientInfoDialog";
const container = {
  hidden: {
    translateY: 50,
    opacity: 0,
  },
  show: {
    translateY: 0,
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.3,
    },
  },
};

const itemA = {
  hidden: { translateY: 25, opacity: 0 },
  show: { translateY: 0, opacity: 1 },
};

const itemB = {
  hidden: { translateY: 25, opacity: 0 },
  show: { translateY: 0, opacity: 1 },
};

const itemC = {
  hidden: { translateY: 25, opacity: 0 },
  show: { translateY: 0, opacity: 1 },
};
const FloatingButton = () => {
  const router = useRouter();
  const {
    handleDialogClose,
    handleDialogOpen,
    handleGenerateNote,
    open,
    setOpen,
    setFile,
    setPatientName,
    setDob,
    patientName,
    dob,
  } = useTranscription();
  const [isFabEnabled, setIsFabEnabled] = useState(false);

  const toggleFAB = useCallback(() => {
    setIsFabEnabled((prevState) => !prevState);
  }, []);

  const handleFileChange = useCallback((e: any) => {
    const file = e.target.files[0];
    if (file) {
      setFile(file);
      handleDialogOpen();
    }
  }, []);

  return (
    // FAB button container
    <div className=" bg-transparent h-16 w-16 rounded-full p-0.5 rounded-br-md fixed bottom-5 right-5 flex items-center justify-center   cursor-pointer active:scale-95 transition-all ease-in">
      <input
        type="file"
        accept="audio/*"
        id="file"
        onChange={handleFileChange}
        style={{ display: "none" }}
      />

      <div
        onClick={toggleFAB}
        className={`select-none  rounded-full w-full h-full flex items-center justify-center transition-transform ease-in ${
          isFabEnabled ? "rotate-[315deg]" : ""
        }`}
      >
        {/* FAB button icon */}
        <Fab
          size="large"
          color="primary"
          aria-label="add"
          //   className="bg-primary-500"
        >
          <AddIcon />
        </Fab>
      </div>

      {/* FAB button list */}
      <AnimatePresence>
        {isFabEnabled && (
          <motion.ul
            variants={container}
            initial="hidden"
            animate="show"
            exit="hidden"
            className="absolute  bottom-20 flex justify-between flex-col items-center gap-2"
          >
            {/* List item A */}
            <motion.li
              variants={itemA}
              onClick={() => router.push("/")}
              className="h-14 w-14 rounded-full bg-cyan-500 flex items-center justify-center"
            >
              <Mic className="text-white" fontSize="large" color="inherit" />
            </motion.li>

            {/* List item B */}
            <motion.label
              htmlFor="file"
              variants={itemB}
              onClick={() => console.log("List item B clicked")}
              className="h-14 w-14 rounded-full bg-[#F4458D] flex items-center justify-center cursor-pointer  "
            >
              <FileUpload
                className="text-white"
                fontSize="large"
                color="inherit"
              />
            </motion.label>

            {/* List item C */}
            <motion.li
              variants={itemC}
              onClick={() => console.log("List item C clicked")}
              className="h-14 w-14 rounded-full bg-[#0094E8]"
            ></motion.li>
          </motion.ul>
        )}
      </AnimatePresence>
      <PatientInfoDialog />
    </div>
  );
};

export default FloatingButton;
