import prisma from "@/config/db-config";
import { getCurrentPhysician } from "@/lib/utils";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest) => {
  try {
    const clerkId = req.nextUrl.searchParams.get("clerkId") as string;
    console.log("clerkId===>", clerkId);
    const currentPhycian = await getCurrentPhysician(clerkId);
    if (!currentPhycian) {
      return NextResponse.json(
        { error: "No Physician found in db" },
        { status: 404 }
      );
    }

    const patients = await prisma.patient.findMany({
      where: {
        physicianId: currentPhycian.id,
      },
      orderBy: {
        visitDay: "desc",
      },
    });

    return NextResponse.json({ patients }, { status: 200 });
  } catch (error) {
    console.log("error while getting Patients===>", error);
    return NextResponse.json(
      { error: "Error in getting Patients" },
      { status: 500 }
    );
  }
};
