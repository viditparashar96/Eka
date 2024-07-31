import prisma from "@/config/db-config";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { NextRequest, NextResponse } from "next/server";
export const POST = async (req: NextRequest) => {
  try {
    const { email, password } = await req.json();
    if (!email || !password) {
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
    if (!user) {
      return NextResponse.json(
        { error: "User Does Not Exist" },
        { status: 400 }
      );
    }
    // Check if password is correct
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return NextResponse.json({ error: "Invalid Password" }, { status: 400 });
    }
    // Create and assign a token
    const token = jwt.sign(
      { email: user.email, id: user.id },
      process.env.TOKEN_SECRET!,
      {
        expiresIn: "30d",
      }
    );

    const response = NextResponse.json(
      {
        message: "User Logged In Successfully",
        token,
      },
      {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type, Authorization",
        },
      }
    );
    // Set cookie
    response.cookies.set("token", token, {
      httpOnly: true,
      maxAge: 60 * 60 * 24 * 30,
    });

    return response;
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "An error occurred While Login" },
      { status: 500 }
    );
  }
};
