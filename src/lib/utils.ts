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