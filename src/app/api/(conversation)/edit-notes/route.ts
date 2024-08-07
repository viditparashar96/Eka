import cosmosSingleton from "@/lib/cosmos/cosmos";
import { getCurrentPhysician } from "@/lib/utils";
import { NextRequest, NextResponse } from "next/server";

export const PATCH = async (req: NextRequest) => {
  try {
    const { notes, conversationId, patientId, clerkId } = await req.json();
    await cosmosSingleton.initialize();
    const container = await cosmosSingleton.getContainer("Conversation");

    const currentPhycian = await getCurrentPhysician(clerkId);

    if (!currentPhycian) {
      return NextResponse.json(
        { error: "No Physician found in db" },
        { status: 404 }
      );
    }

    if (!conversationId || !patientId) {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }

    if (!notes) {
      return NextResponse.json(
        { error: "Notes are required" },
        { status: 400 }
      );
    }

    const querySpec = {
      query: "SELECT * from c WHERE c.id = @conversationId",
      parameters: [{ name: "@conversationId", value: conversationId }],
    };

    const { resources: conversation } = await container.items
      .query(querySpec)
      .fetchAll();

    if (conversation.length === 0) {
      return NextResponse.json(
        { error: "No conversation found with given id" },
        { status: 404 }
      );
    }

    const conversationObj = conversation[0];
    conversationObj.Doctor_Patient_Discussion = notes;

    await container.items.upsert(conversationObj);

    return NextResponse.json(
      { success: true, msg: "Conversation updated!!" },
      { status: 200 }
    );
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
};
