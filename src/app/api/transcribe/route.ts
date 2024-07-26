import { env_config } from "@/config/env-config";
import axios from "axios";
import FormData from "form-data";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
  try {
    const contentType = req.headers.get("content-type");

    if (contentType?.includes("application/json")) {
      // Handle audioBlob
      const { audioBlob, patientName, dob } = await req.json();
      console.log("patientName===>", patientName);
      console.log("dob===>", dob);
      if (!audioBlob) {
        return NextResponse.json(
          { error: "No audioBlob found" },
          { status: 400 }
        );
      }

      try {
        const buffer = Buffer.from(audioBlob.split(",")[1], "base64");

        const formData = new FormData();
        formData.append("file", buffer, {
          filename: "audio.wav",
          contentType: "audio/wav",
        });
        const response = await axios.post(
          `${env_config.azure_endpoint}/openai/deployments/${env_config.azure_deployment_name}/audio/transcriptions?api-version=2024-02-01`,
          formData,
          {
            headers: {
              ...formData.getHeaders(),
              "api-key": env_config.openai_key,
            },
          }
        );

        console.log("response===>", response.data);
        return NextResponse.json(response.data);
      } catch (error: any) {
        console.error(error.response?.data || error.message);
        return NextResponse.json(
          { error: "Error creating transcription in azure server" },
          { status: 500 }
        );
      }
    } else {
      return NextResponse.json(
        { error: "Unsupported content type" },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Error creating transcription" },
      { status: 500 }
    );
  }
};
