import { useTranscription } from "@/contexts/TranscriptionContext";
import { formatNotes, parseFormattedNotes } from "@/lib/utils";
import { updateConversationNotes } from "@/services/actions/conversation.action";
import { useAuth } from "@clerk/nextjs";
import EditNoteIcon from "@mui/icons-material/EditNote";
import SaveIcon from "@mui/icons-material/Save";
import CircularProgress from "@mui/material/CircularProgress";
import { useEffect, useState } from "react";

interface ConversationAreaProps {
  notes: any;
  loading: boolean;
  pateintId: string;
}

export default function GeneratedSoap({
  notes,
  loading,
  pateintId,
}: ConversationAreaProps) {
  const { loading: transcriptionLoading } = useTranscription();
  const { userId } = useAuth();
  const [parsedNotes, setParsedNotes] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  console.log("notes in Generated Soap Notes===>", notes);

  useEffect(() => {
    try {
      let notesStr = notes.Doctor_Patient_Discussion;

      // Check and remove the ```json``` block if present
      const jsonRegex = /```json\n([\s\S]*?)\n```/;
      const match = notesStr.match(jsonRegex);
      if (match) {
        notesStr = match[1];
      }

      const notesObj = JSON.parse(notesStr);
      const discussionObj = notesObj.Doctor_Patient_Discussion || notesObj;
      const formattedNotes = formatNotes(discussionObj);
      console.log("formattedNotes===>", formattedNotes);
      setParsedNotes(formattedNotes);
    } catch (error) {
      console.error("Error parsing notes:", error);
      setParsedNotes(notes); // Fallback to original string if parsing fails
    }
  }, [notes]);

  const handleEdit = () => {
    setIsEditing(!isEditing);
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setParsedNotes(e.target.value);
  };

  const handleSave = async () => {
    // Implement save functionality here

    try {
      const updatedNotesObj = parseFormattedNotes(parsedNotes);
      const updatedNotesStr = JSON.stringify(updatedNotesObj, null, 2);
      console.log("Updated Notes JSON===>", updatedNotesStr);
      const result = await updateConversationNotes({
        notes: parsedNotes,
        conversationId: notes.id,
        patientId: pateintId,
        clerkId: userId as string,
      });
      console.log("result===>", result);
    } catch (error) {
      console.log("Error saving notes:", error);
    }

    setIsEditing(false);
  };

  return (
    <div className="rounded-md border border-gray-200 bg-[#F9F9F9] p-4 w-full md:w-[50%]">
      <div className="flex justify-between items-center mb-2">
        <h2 className="font-bold text-xl">Generated Soap Notes</h2>
        {isEditing ? (
          <SaveIcon className="cursor-pointer scale-125" onClick={handleSave} />
        ) : (
          <EditNoteIcon
            className="cursor-pointer scale-125"
            onClick={handleEdit}
          />
        )}
      </div>
      {loading ? (
        <div className="flex justify-center items-center h-40">
          <CircularProgress />
        </div>
      ) : (
        <>
          {isEditing ? (
            <textarea
              value={parsedNotes}
              onChange={handleChange}
              className="w-full h-64 p-2 rounded whitespace-pre-wrap"
            />
          ) : (
            <div className="w-full h-64 p-2 rounded overflow-auto whitespace-pre-wrap">
              {parsedNotes?.split("\n").map((line, index) =>
                line.startsWith("**") ? (
                  <p key={index} className="font-bold">
                    {line.replace(/\*\*/g, "")}
                  </p>
                ) : (
                  <p key={index}>{line}</p>
                )
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}
