/* eslint-disable camelcase */
import prisma from "@/config/db-config";
import { WebhookEvent } from "@clerk/nextjs/server";
import { Role } from "@prisma/client";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { Webhook } from "svix";

export async function POST(req: Request) {
  // You can find this in the Clerk Dashboard -> Webhooks -> choose the webhook
  const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET;

  if (!WEBHOOK_SECRET) {
    throw new Error(
      "Please add WEBHOOK_SECRET from Clerk Dashboard to .env or .env.local"
    );
  }

  // Get the headers
  const headerPayload = headers();
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  // If there are no headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response("Error occured -- no svix headers", {
      status: 400,
    });
  }

  // Get the body
  const payload = await req.json();
  const body = JSON.stringify(payload);

  // Create a new Svix instance with your secret.
  const wh = new Webhook(WEBHOOK_SECRET);

  let evt: WebhookEvent;

  // Verify the payload with the headers
  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as WebhookEvent;
  } catch (err) {
    console.error("Error verifying webhook:", err);
    return new Response("Error occured", {
      status: 400,
    });
  }

  // Get the ID and type
  // @ts-ignore
  // const { id } = evt.data;
  const eventType = evt.type;
  console.log("Webhook event type:", eventType);

  // console.log(`Webhook with and ID of ${id} and type of ${eventType}`);
  // console.log("Webhook body:", body);
  if (eventType === "user.created") {
    const { id, email_addresses, first_name, last_name, image_url, username } =
      evt.data;

    console.log("User created event:", evt.data);

    // Create a user in your database
    // const postgresqlUser = await createUser({
    //   clerkId: id,
    //   name: `${first_name} ${last_name ? `${last_name}` : ""}`,
    //   email: email_addresses[0].email_address,
    // });

    const user = await prisma.user.create({
      data: {
        clerkId: id,
        name: `${first_name} ${last_name ? `${last_name}` : ""}`,
        email: email_addresses[0].email_address,
        role: Role.PHYSICIAN,
        physician: {
          create: {
            specialization: "General Physician",
          },
        },
      },

      include: {
        physician: true,
      },
    });
    return NextResponse.json({
      msg: "ok",
      user,
    });
  }

  return new Response("", { status: 200 });
}
