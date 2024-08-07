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
        const container = await cosmosSingleton.getContainer("Conversation");
        console.log("Cosmos Container===>", container);

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

            const { resource: createdConversation } =
              await container.items.create({
                id: `${patient.id}_${currentPhycian.userId}`, // Unique identifier combining PatientId and PhysicianId
                transcription,
                PatientId: patient.id,
                PhysicianId: currentPhycian.userId,
                type: "conversation",
                dateOfVisit: patient.visitDay,
              });

            console.log("createdConversation===>", createdConversation);

            // Send transcription to frontend
            controller.enqueue(
              encoder.encode(
                JSON.stringify({ transcription: createdConversation })
              )
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

                        text: 'You are an AI assistant designed to assist doctors by transcribing and summarizing medical conversations. Given a conversation between a doctor and a patient, your task is to produce a structured SOAP note in JSON format. The JSON object should follow this structure:\n\n{\n  "soap_note": {\n    "subjective": {\n      "chief_complaint": "",\n      "history_of_present_illness": "",\n      "past_medical_history": "",\n      "family_history": "",\n      "social_history": "",\n      "review_of_systems": ""\n    },\n    "objective": {\n      "vital_signs": {\n        "temperature": "",\n        "blood_pressure": "",\n        "heart_rate": "",\n        "respiratory_rate": "",\n        "oxygen_saturation": ""\n      },\n      "physical_exam": {\n        "general_appearance": "",\n        "head": "",\n        "eyes": "",\n        "ears": "",\n        "nose": "",\n        "throat": "",\n        "neck": "",\n        "cardiovascular": "",\n        "respiratory": "",\n        "gastrointestinal": "",\n        "genitourinary": "",\n        "musculoskeletal": "",\n        "neurological": "",\n        "skin": "",\n        "psychiatric": ""\n      },\n      "lab_results": [],\n      "imaging_results": [],\n      "other_tests": []\n    },\n    "assessment": {\n      "diagnoses": []\n    },\n    "plan": {\n      "treatment": "",\n      "medications": [],\n      "follow_up": "",\n      "patient_education": ""\n    },\n    "medical_codes": {\n      "icd_10": "",\n      "cpt": ""\n    }\n  }\n}\n\nPlease ensure the JSON response is detailed, accurate, and follows the exact structure provided without any additional text.',
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
            const uuid = `${crypto.randomUUID()}|${patient.id}|${
              currentPhycian.userId
            }`;
            const { resource: createdNote } = await container.items.create({
              id: uuid, // Unique identifier combining PatientId and PhysicianId
              Doctor_Patient_Discussion:
                completionResponse.data.choices[0].message.content,
              PatientId: patient.id,
              PhysicianId: currentPhycian.userId,
              type: "note",
              dateOfVisit: patient.visitDay,
            });
            // const noteItem = {
            //   id: `${patient.id}_${currentPhycian.userId}`, // Unique identifier combining PatientId and PhysicianId
            //   Doctor_Patient_Discussion:
            //     completionResponse.data.choices[0].message.content,

            //   PatientId: patient.id,
            //   PhysicianId: currentPhycian.userId,
            //   type: "note",
            // };

            // const { resource: upsertedNote } = await container.items.upsert(
            //   noteItem
            // );

            console.log("createdNote===>", createdNote);

            // Send generated notes to frontend
            controller.enqueue(
              encoder.encode(
                JSON.stringify({
                  patientId: patient.id,
                  Notes: createdNote,
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
