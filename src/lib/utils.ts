import prisma from "@/config/db-config";
import jwt from "jsonwebtoken";
import { NextRequest } from "next/server";
export const getDataFromToken = (req: NextRequest) => {
  try {
    const token = req.cookies.get("token")?.value || "";
    const decodedToken: any = jwt.verify(token, process.env.TOKEN_SECRET!);
    return decodedToken;
  } catch (error) {
    console.log(error);
    throw new Error("Invalid Token");
  }
};

export const getCurrentPhysician = async (clerkId: string) => {
  try {
    const currentPhycian = await prisma.physician.findUnique({
      where: {
        clerkId,
      },
      include: {
        user: true,
      },
    });
    return currentPhycian;
  } catch (error) {
    console.log(error);
    throw new Error("ClerkId not found");
  }
};

export const formatDateTime = (isoString: string) => {
  const date = new Date(isoString);

  // Extract the day, month, and year
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are zero-based
  const year = date.getFullYear();

  // Extract the time components
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const seconds = String(date.getSeconds()).padStart(2, "0");

  // Format date and time
  const formattedDate = `${day}/${month}/${year}`;
  const formattedTime = `${hours}:${minutes}:${seconds}`;

  return `${formattedDate} ${formattedTime}`;
};

export const formatNotes = (obj: any, indent = 0): string => {
  let result = "";
  const indentation = "  ".repeat(indent);

  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      const value = obj[key];
      const formattedKey = key.replace(/_/g, " ");

      if (indent === 0) {
        result += `\n**${formattedKey.toUpperCase()}**\n\n`;
      } else if (indent === 1) {
        result += `**${formattedKey}:**\n`;
      } else {
        result += `${indentation}${formattedKey}: `;
      }

      if (Array.isArray(value)) {
        result +=
          "\n" +
          value
            .map((item) => {
              if (typeof item === "object" && item !== null) {
                return (
                  Object.entries(item)
                    .map(
                      ([k, v]) =>
                        `${indentation}  • ${k.replace(/_/g, " ")}: ${
                          v || "Not Provided"
                        }`
                    )
                    .join("\n") + "\n"
                );
              }
              return `${indentation}  • ${item}`;
            })
            .join("\n") +
          "\n";
      } else if (typeof value === "object" && value !== null) {
        result += "\n" + formatNotes(value, indent + 1) + "\n";
      } else {
        result += value ? `${value}\n` : "Not Provided\n";
      }
    }
  }
  return result;
};
export const parseFormattedNotes = (formattedNotes: string): any => {
  const lines = formattedNotes.split("\n").filter((line) => line.trim() !== "");
  const result: any = {};
  let currentSection: string | null = null;
  let currentSubSection: string | null = null;

  lines.forEach((line) => {
    if (line.startsWith("**") && line.endsWith("**")) {
      currentSection = line.slice(2, -2).toLowerCase().replace(/ /g, "_");
      result[currentSection] = {};
    } else if (line.startsWith("**") && currentSection) {
      currentSubSection = line.slice(2, -2).toLowerCase().replace(/ /g, "_");
      result[currentSection][currentSubSection] = {};
    } else if (line.startsWith("  •") && currentSubSection && currentSection) {
      const [key, value] = line.slice(3).split(": ");
      result[currentSection][currentSubSection][key.replace(/ /g, "_")] =
        value || "Not Provided";
    } else if (currentSection) {
      const [key, value] = line.split(": ");
      if (currentSubSection) {
        result[currentSection][currentSubSection][key.replace(/ /g, "_")] =
          value || "Not Provided";
      } else {
        result[currentSection][key.replace(/ /g, "_")] =
          value || "Not Provided";
      }
    }
  });

  return result;
};
