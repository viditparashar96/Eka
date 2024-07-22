import { env_config } from "@/config/env-config";
import axios from "axios";
import FormData from "form-data";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
  try {
    const { audioBlob } = await req.json();
    if (!audioBlob) {
      return NextResponse.json(
        { error: "No audio file found" },
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
      console;
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
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Error creating transcription" },
      { status: 500 }
    );
  }
};
