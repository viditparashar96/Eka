import cosmosSingleton from "@/lib/cosmos/cosmos";
import { getCurrentPhysician } from "@/lib/utils";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest) => {
  try {
    await cosmosSingleton.initialize();
    const container = await cosmosSingleton.getContainer("Conversation");
    console.log("Cosmos Container in get conversation===>", container);

    const search_params = req.nextUrl.searchParams;
    const clerkId = search_params.get("clerkId") as string;
    const patientId = Number(search_params.get("patientId")) as number;
    console.log("Type of patientId: ", typeof patientId);
    const currentPhycian = await getCurrentPhysician(clerkId);
    if (!currentPhycian) {
      return NextResponse.json(
        { error: "No Physician found in db" },
        { status: 404 }
      );
    }
    console.log("currentPhycian===>", currentPhycian.userId);
    const querySpec = {
      query:
        "SELECT * from c WHERE c.PhysicianId = @physicianId AND c.PatientId = @patientId",
      parameters: [
        { name: "@physicianId", value: currentPhycian?.userId },
        { name: "@patientId", value: Number(patientId) },
      ],
    };

    const { resources: conversations } = await container.items
      .query(querySpec)
      .fetchAll();
    return NextResponse.json({ conversations }, { status: 200 });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
};
