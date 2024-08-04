import prisma from "@/config/db-config";
import { env_config } from "@/config/env-config";
import cosmosSingleton from "@/lib/cosmos/cosmos";
import { getCurrentPhysician } from "@/lib/utils";
import axios from "axios";
import FormData from "form-data";
import { NextRequest } from "next/server";

export const POST = async (req: NextRequest) => {
  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller) {
      try {
        await cosmosSingleton.initialize();
        const contentType = req.headers.get("content-type");
        const container = cosmosSingleton.getContainer();
        if (contentType?.includes("application/json")) {
          const { audioBlob, patientName, dob, clerkId } = await req.json();
          console.log("patientName===>", patientName);
          console.log("dob===>", dob);
          console.log("clerkId===>", clerkId);

          if (!audioBlob) {
            controller.enqueue(
              encoder.encode(JSON.stringify({ error: "No audioBlob found" }))
            );
            controller.close();
            return;
          }

          const currentPhycian = await getCurrentPhysician(clerkId);
          console.log("currentPhycian===>", currentPhycian);
          if (!currentPhycian) {
            controller.enqueue(
              encoder.encode(
                JSON.stringify({ error: "No Physician found in db" })
              )
            );
            controller.close();
            return;
          }
          const patient = await prisma.patient.create({
            data: {
              name: patientName || "Unknown",
              dateOfBirth: new Date(dob) || new Date(),
              physicianId: currentPhycian.id,
            },
          });

          if (!patient) {
            controller.enqueue(
              encoder.encode(
                JSON.stringify({ error: "Error in creating patient" })
              )
            );
            controller.close();
            return;
          }

          controller.enqueue(encoder.encode(JSON.stringify({ user: patient })));

          try {
            const buffer = Buffer.from(audioBlob.split(",")[1], "base64");

            const formData = new FormData();
            formData.append("file", buffer, {
              filename: "audio.wav",
              contentType: "audio/wav",
            });

            // Whisper API call
            const response = await axios.post(
              `${env_config.azure_endpoint}/openai/deployments/${env_config.azure_deployment_name}/audio/transcriptions?api-version=2024-02-01`,
              formData,
              {
                headers: {
                  ...formData.getHeaders(),
                  "api-key": env_config.openai_key,
                },
              }
            );

            const transcription = response.data.text;

            // Send transcription to frontend
            controller.enqueue(
              encoder.encode(JSON.stringify({ transcription }))
            );

            // Chat completion API call
            const completionResponse = await axios.post(
              `${env_config.azure_endpoint}/openai/deployments/eka-gpt4o/chat/completions?api-version=2024-04-01-preview`,
              {
                messages: [
                  {
                    role: "system",
                    content: [
                      {
                        type: "text",
                        text: 'You are an AI assistant designed to assist doctors by transcribing and summarizing medical conversations. Given a conversation between a doctor and a patient, your task is to produce a structured medical note in the following JSON format:\n\n{\n    "Doctor_Patient_Discussion": {\n        "Initial_Observation": {\n            "Symptoms": [],\n            "Initial_Assessment": ""\n        },\n        "Medical_Examination": {\n            "Temperature":"",\n            "Blood_Pressure":"",\n            "Doctor_Assessment": "",\n            "Diagnosis": ""\n        },\n        "Treatment_Plan": {\n            "Prescription": []\n        }\n    }\n}\n\nPlease ensure the notes are detailed and accurate based on the conversation provided and do to inclued ```json in response i just need json so that i can easily parsed.',
                      },
                    ],
                  },
                  {
                    role: "user",
                    content: [
                      {
                        type: "text",
                        text: transcription,
                      },
                    ],
                  },
                ],
              },
              {
                headers: {
                  "Content-Type": "application/json",
                  "api-key": env_config.openai_key,
                },
              }
            );

            console.log(
              "completionResponse===>",
              completionResponse.data.choices[0].message.content
            );

            // Create a new note in CosmosDB
            // const { resource: createdNote } = await container.items.create({
            //   Doctor_Patient_Discussion: JSON.parse(
            //     completionResponse.data.choices[0].message.content
            //   ),
            //   PatientId: patient.id,
            //   PhysicianId: currentPhycian.userId,
            // });
            const noteItem = {
              id: `${patient.id}_${currentPhycian.userId}`, // Unique identifier combining PatientId and PhysicianId
              Doctor_Patient_Discussion:
                completionResponse.data.choices[0].message.content,

              PatientId: patient.id,
              PhysicianId: currentPhycian.userId,
              type: "note",
            };

            const { resource: upsertedNote } = await container.items.upsert(
              noteItem
            );

            console.log("createdNote===>", upsertedNote);

            // Send generated notes to frontend
            controller.enqueue(
              encoder.encode(
                JSON.stringify({
                  Notes: completionResponse.data.choices[0].message.content,
                })
              )
            );
          } catch (error: any) {
            console.error(error.response?.data || error.message);
            controller.enqueue(
              encoder.encode(
                JSON.stringify({
                  error: "Error creating transcription or generating notes",
                })
              )
            );
          }
        } else {
          controller.enqueue(
            encoder.encode(
              JSON.stringify({
                error: "Unsupported content type",
              })
            )
          );
        }
      } catch (error) {
        console.error(error);
        controller.enqueue(
          encoder.encode(
            JSON.stringify({
              error: "Error processing request",
            })
          )
        );
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
};
