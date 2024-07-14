import fs from "fs/promises";
import { NextRequest, NextResponse } from "next/server";
import path from "path";

export const GET = async (req: NextRequest) => {
  try {
    const search_params: any = req.nextUrl.searchParams;
    const file = search_params.get("file");
    console.log(file);
    const filePath = path.join(process.cwd(), `${file}.txt`);
    const fileContent = await fs.readFile(filePath, "utf8");
    return NextResponse.json({ content: fileContent }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Error fetching transcription" },
      { status: 500 }
    );
  }
};

export const POST = async (req: NextRequest) => {
  try {
    const { content, file } = await req.json();
    const filePath = path.join(process.cwd(), `${file}.txt`);
    await fs.writeFile(filePath, content);
    return NextResponse.json(
      { message: "Transcription saved" },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Error saving transcription" },
      { status: 500 }
    );
  }
};
