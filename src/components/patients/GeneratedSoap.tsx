// components/ConversationArea.js
import EditNoteIcon from "@mui/icons-material/EditNote";
import SaveIcon from "@mui/icons-material/Save";
import { useEffect, useState } from "react";
export default function GeneratedSoap() {
  const [content, setContent] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    fetchTranscription();
  }, []);

  const fetchTranscription = async () => {
    const response = await fetch("/api/Transcription?file=dummy_medical_note", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await response.json();
    setContent(data.content);
  };

  const handleEdit = () => {
    setIsEditing(!isEditing);
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
  };

  const handleSave = async () => {
    const response = await fetch("/api/Transcription", {
      method: "POST",
      body: JSON.stringify({ content, file: "dummy_medical_note" }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await response.json();
    console.log(data);
    setIsEditing(false);
  };

  const formatContent = (text: string) => {
    return text.split("\n").map((line, index) => {
      const [speaker, ...rest] = line.split(":");
      if (rest.length > 0) {
        return (
          <div key={index}>
            <strong>{speaker}:</strong>
            {rest.join(":")}
          </div>
        );
      }
      return (
        <div key={index}>
          {line} {"\n"}
        </div>
      );
    });
  };

  return (
    <div className=" rounded-md border border-gray-200 bg-[#F9F9F9] p-4 w-full md:w-[50%]">
      <div className="flex justify-between items-center mb-2">
        <h2 className=" font-bold text-xl">Generated Soap Notes</h2>
        {isEditing ? (
          <SaveIcon className="cursor-pointer scale-125" onClick={handleSave} />
        ) : (
          <EditNoteIcon
            className="cursor-pointer scale-125"
            onClick={handleEdit}
          />
        )}
      </div>
      {isEditing ? (
        <textarea
          value={content}
          onChange={handleChange}
          className="w-full h-64 p-2  rounded  whitespace-pre-wrap"
        />
      ) : (
        <div className="w-full h-64 p-2  rounded overflow-auto  whitespace-pre-wrap">
          {formatContent(content)}
        </div>
      )}
    </div>
  );
}
