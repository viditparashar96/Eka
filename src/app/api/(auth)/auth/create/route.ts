import prisma from "@/config/db-config";
import { Role } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest): Promise<NextResponse> => {
  try {
    const { email, name, clerkId } = await req.json();
    console.log(email, name, clerkId, "in create user API");
    if (!email || !name || !clerkId) {
      return NextResponse.json(
        { error: "All Fields are Required" },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });

    if (user) {
      return NextResponse.json(
        { error: "User Already Exists" },
        { status: 400 }
      );
    }

    const newUser = await prisma.user.create({
      data: {
        email,
        name,
        clerkId,
        role: Role.PHYSICIAN,
        physician: {
          create: {
            specialization: "General Physician",
            clerkId,
          },
        },
      },
      include: {
        physician: true,
      },
    });

    return NextResponse.json(
      {
        message: "User Created Successfully",
        data: newUser,
      },
      { status: 201 }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      {
        error: "Server Error in creating user",
      },
      { status: 500 }
    );
  }
};
