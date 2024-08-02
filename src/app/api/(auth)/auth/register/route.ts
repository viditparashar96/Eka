import prisma from "@/config/db-config";
import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";
export const POST = async (req: NextRequest) => {
  try {
    const { email, password, specialization } = await req.json();

    if (!email || !password || !specialization) {
      return NextResponse.json(
        { error: "All Fields are Required" },
        { status: 400 }
      );
    }

    // Check if user already exists

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

    // create user (Physician)
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    // const new_user = await prisma.user.create({
    //   data: {
    //     email: email,
    //     password: hashedPassword,
    //     role: Role.PHYSICIAN,
    //     physician: {
    //       create: {
    //         specialization: specialization,
    //       },
    //     },
    //   },
    //   select: {
    //     id: true,
    //     email: true,
    //     role: true,
    //     physician: true,
    //   },
    // });
    return NextResponse.json({
      message: "User Registered Successfully",
    });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "An error occurred While Registering" },
      { status: 500 }
    );
  }
};
