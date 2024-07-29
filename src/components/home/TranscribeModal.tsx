import { RemoveRedEye } from "@mui/icons-material";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import * as React from "react";

export default function TranscribeModal({
  transcription,
}: {
  transcription: string;
}) {
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <React.Fragment>
      <button
        onClick={handleClickOpen}
        className="px-4 bg-[#051D2F] text-[12px] flex items-center justify-center gap-1 uppercase text-white py-2 rounded-[100px] shadow hover:bg-[#051D2F] transition-colors duration-300 z-50"
      >
        <RemoveRedEye fontSize="small" />
        View transcribe
      </button>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        fullWidth
      >
        <DialogTitle id="alert-dialog-title">{"Transcription"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {transcription}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>close</Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}
