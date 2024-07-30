import { env_config } from "@/config/env-config";
import axios from "axios";
import FormData from "form-data";
import { NextRequest } from "next/server";

// export const POST = async (req: NextRequest) => {
//   try {
//     const contentType = req.headers.get("content-type");

//     if (contentType?.includes("application/json")) {
//       // Handle audioBlob
//       const { audioBlob, patientName, dob } = await req.json();
//       console.log("patientName===>", patientName);
//       console.log("dob===>", dob);
//       if (!audioBlob) {
//         return NextResponse.json(
//           { error: "No audioBlob found" },
//           { status: 400 }
//         );
//       }

//       try {
//         const buffer = Buffer.from(audioBlob.split(",")[1], "base64");

//         const formData = new FormData();
//         formData.append("file", buffer, {
//           filename: "audio.wav",
//           contentType: "audio/wav",
//         });
//         const response = await axios.post(
//           `${env_config.azure_endpoint}/openai/deployments/${env_config.azure_deployment_name}/audio/transcriptions?api-version=2024-02-01`,
//           formData,
//           {
//             headers: {
//               ...formData.getHeaders(),
//               "api-key": env_config.openai_key,
//             },
//           }
//         );

//         console.log("response===>", response.data);
//         const transcription = response.data.text;

//         // caling the api to genrate the note

//         const completionResponse: any = await axios.post(
//           `${env_config.azure_endpoint}/openai/deployments/eka-gpt4o/chat/completions?api-version=2024-04-01-preview`,
//           {
//             messages: [
//               {
//                 role: "system",
//                 content: [
//                   {
//                     type: "text",
//                     text: 'You are an AI assistant designed to assist doctors by transcribing and summarizing medical conversations. Given a conversation between a doctor and a patient, your task is to produce a structured medical note in the following JSON format:\n\n{\n    "Doctor_Patient_Discussion": {\n        "Initial_Observation": {\n            "Symptoms": [],\n            "Initial_Assessment": ""\n        },\n        "Medical_Examination": {\n            "Temperature":"",\n            "Blood_Pressure":"",\n            "Doctor_Assessment": "",\n            "Diagnosis": ""\n        },\n        "Treatment_Plan": {\n            "Prescription": []\n        }\n    }\n}\n\nPlease ensure the notes are detailed and accurate based on the conversation provided.',
//                   },
//                 ],
//               },
//               {
//                 role: "user",
//                 content: [
//                   {
//                     type: "text",
//                     text: "Hello Mr. Johnson. What brings you here today?Hi Doctor Strange. I haven't been feeling too well. I think I might have the flu. I'm so sorry to hear that. When did it first start?Two days ago.It definitely looks like the flu. I recommend that you drink lots of fluids, rest, and take Ibuprofen if you experience any sore throat or headaches. Then let's have you come back in 2 weeks and see how you're doing. Does that sound good?That sounds great doctor. Thank you for seeing me today.Goodbye",
//                   },
//                 ],
//               },
//             ],
//           },
//           {
//             headers: {
//               "Content-Type": "application/json",
//               "api-key": env_config.openai_key,
//             },
//           }
//         );
//         console.log("completionResponse===>", completionResponse);

//         return NextResponse.json({
//           Notes: completionResponse.data.choices[0].message.content,
//         });
//       } catch (error: any) {
//         console.error(error.response?.data || error.message);
//         return NextResponse.json(
//           { error: "Error creating transcription in azure server" },
//           { status: 500 }
//         );
//       }
//     } else {
//       return NextResponse.json(
//         { error: "Unsupported content type" },
//         { status: 400 }
//       );
//     }
//   } catch (error) {
//     console.error(error);
//     return NextResponse.json(
//       { error: "Error creating transcription" },
//       { status: 500 }
//     );
//   }
// };

export const POST = async (req: NextRequest) => {
  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller) {
      try {
        const contentType = req.headers.get("content-type");

        if (contentType?.includes("application/json")) {
          const { audioBlob, patientName, dob } = await req.json();
          console.log("patientName===>", patientName);
          console.log("dob===>", dob);

          if (!audioBlob) {
            controller.enqueue(
              encoder.encode(JSON.stringify({ error: "No audioBlob found" }))
            );
            controller.close();
            return;
          }

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
            const completionResponse: any = await axios.post(
              `${env_config.azure_endpoint}/openai/deployments/eka-gpt4o/chat/completions?api-version=2024-04-01-preview`,
              {
                messages: [
                  {
                    role: "system",
                    content: [
                      {
                        type: "text",
                        text: 'You are an AI assistant designed to assist doctors by transcribing and summarizing medical conversations. Given a conversation between a doctor and a patient, your task is to produce a structured medical note in the following JSON format:\n\n{\n    "Doctor_Patient_Discussion": {\n        "Initial_Observation": {\n            "Symptoms": [],\n            "Initial_Assessment": ""\n        },\n        "Medical_Examination": {\n            "Temperature":"",\n            "Blood_Pressure":"",\n            "Doctor_Assessment": "",\n            "Diagnosis": ""\n        },\n        "Treatment_Plan": {\n            "Prescription": []\n        }\n    }\n}\n\nPlease ensure the notes are detailed and accurate based on the conversation provided.',
                      },
                    ],
                  },
                  {
                    role: "user",
                    content: [
                      {
                        type: "text",
                        text: "Hello Mr. Johnson. What brings you here today?Hi Doctor Strange. I haven't been feeling too well. I think I might have the flu. I'm so sorry to hear that. When did it first start?Two days ago.It definitely looks like the flu. I recommend that you drink lots of fluids, rest, and take Ibuprofen if you experience any sore throat or headaches. Then let's have you come back in 2 weeks and see how you're doing. Does that sound good?That sounds great doctor. Thank you for seeing me today.Goodbye",
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
