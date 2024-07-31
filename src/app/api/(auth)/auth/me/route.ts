import prisma from "@/config/db-config";
import { getDataFromToken } from "@/lib/utils";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const user = await getDataFromToken(req);

    const user_data = await prisma.user.findUnique({
      where: {
        email: user.email,
      },
      select: {
        email: true,
        id: true,
        role: true,
      },
    });
    if (!user_data) {
      return NextResponse.json(
        { error: "User does not exist" },
        { status: 400 }
      );
    }

    return NextResponse.json({ user: user_data });
  } catch (error: any) {
    return NextResponse.json({ msg: "Something went wrong" }, { status: 500 });
  }
}
