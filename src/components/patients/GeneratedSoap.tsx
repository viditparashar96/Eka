import EditNoteIcon from "@mui/icons-material/EditNote";
import SaveIcon from "@mui/icons-material/Save";
import CircularProgress from "@mui/material/CircularProgress";
import { useEffect, useState } from "react";

interface ConversationAreaProps {
  notes: string;
  loading: boolean;
}

export default function GeneratedSoap({
  notes,
  loading,
}: ConversationAreaProps) {
  const [parsedNotes, setParsedNotes] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  useEffect(() => {
    try {
      const notesObj = JSON.parse(notes);
      const discussionObj = notesObj.Doctor_Patient_Discussion || notesObj;
      const formattedNotes = formatNotes(discussionObj);
      setParsedNotes(formattedNotes);
    } catch (error) {
      console.error("Error parsing notes:", error);
      setParsedNotes(notes); // Fallback to original string if parsing fails
    }
  }, [notes]);

  const formatNotes = (obj: any, indent = 0): string => {
    let result = "";
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        const value = obj[key];
        const indentation = "  ".repeat(indent);

        if (indent === 0) {
          result += `**${key}**\n`;
        } else {
          result += `${indentation}${key}:`;
        }

        if (Array.isArray(value)) {
          result +=
            "\n" +
            value
              .map((item) => {
                if (typeof item === "object" && item !== null) {
                  return Object.entries(item)
                    .map(([k, v]) => `${indentation}  • ${k}: ${v}`)
                    .join("\n");
                }
                return `${indentation}  • ${item}`;
              })
              .join("\n") +
            "\n";
        } else if (typeof value === "object" && value !== null) {
          result += "\n" + formatNotes(value, indent + 1);
        } else {
          result += value ? ` ${value}\n` : " Not Provided\n";
        }
      }
    }
    return result;
  };
  const handleEdit = () => {
    setIsEditing(!isEditing);
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setParsedNotes(e.target.value);
  };

  const handleSave = () => {
    // Implement save functionality here
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
              {parsedNotes.split("\n").map((line, index) =>
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
