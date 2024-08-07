// components/ConversationArea.js
import { useTranscription } from "@/contexts/TranscriptionContext";
import EditNoteIcon from "@mui/icons-material/EditNote";
import SaveIcon from "@mui/icons-material/Save";
import CircularProgress from "@mui/material/CircularProgress";
import { useState } from "react";

interface ConversationAreaProps {
  transcription: any;
  loading: boolean;
}
export default function ConversationArea({
  transcription,
  loading,
}: ConversationAreaProps) {
  const { loading: transcriptionLoading } = useTranscription();
  const [isEditing, setIsEditing] = useState(false);
  console.log("transcription===>", transcription);

  // useEffect(() => {
  //   fetchTranscription();
  // }, []);

  // const fetchTranscription = async () => {
  //   const response = await fetch("/api/Transcription?file=dummy_transcription");
  //   const data = await response.json();
  //   setContent(data.content);
  // };

  const handleEdit = () => {
    setIsEditing(!isEditing);
  };

  // const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
  //   setContent(e.target.value);
  // };

  // const handleSave = async () => {
  //   const response = await fetch("/api/Transcription", {
  //     method: "POST",
  //     body: JSON.stringify({ content, file: "dummy_transcription" }),
  //     headers: {
  //       "Content-Type": "application/json",
  //     },
  //   });
  //   const data = await response.json();
  //   console.log(data);
  //   setIsEditing(false);
  // };

  return (
    <div className=" rounded-md border border-gray-200 bg-[#F9F9F9] p-4 w-full md:w-[50%]">
      <div className="flex justify-between items-center mb-2">
        <h2 className=" font-bold text-xl">Conversation</h2>
        {isEditing ? (
          <SaveIcon
            className="cursor-pointer scale-125"
            // onClick={handleSave}
          />
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
              value={transcription?.transcription}
              // onChange={handleChange}
              className="w-full h-64 p-2  rounded  whitespace-pre-wrap"
            />
          ) : (
            <div className="w-full h-64 p-2  rounded overflow-auto  whitespace-pre-wrap">
              {transcription?.transcription}
            </div>
          )}
        </>
      )}
    </div>
  );
}
