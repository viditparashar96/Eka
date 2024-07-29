import { useTranscription } from "@/contexts/TranscriptionContext";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from "@mui/material/TextField";
const PatientInfoDialog = () => {
  const {
    open,
    setOpen,
    patientName,
    setPatientName,
    dob,
    setDob,
    handleDialogClose,
    handleGenerateNote,
  } = useTranscription();
  return (
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
        <Button
          onClick={() => {
            setOpen(false);
            handleGenerateNote(true);
          }}
        >
          Skip
        </Button>
        <Button
          onClick={() => {
            setOpen(false);
            handleGenerateNote(false);
          }}
        >
          Generate
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default PatientInfoDialog;
