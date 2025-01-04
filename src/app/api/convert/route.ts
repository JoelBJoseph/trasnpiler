import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

console.log('api key: ' + process.env.OPENAI_API_KEY);
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

export const POST = async (req: NextRequest, res: NextResponse) => {
  const requestBody = await req.json();
  console.log("requestBody", requestBody);

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "You are a helpful assistant.",
        },
        {
          role: "user",
          content: `Convert the following C code to idiomatic and safe Rust:\n\n${requestBody.cCode}`,
        },
      ],
    });

    console.log("Response from OpenAi" + completion);

    const rustCode = completion?.data?.choices[0].message.content.trim();
    console.log("Converted Rust Code:\n", rustCode);
  } catch (error) {
    console.error("Error while converting code:", error);
  }

  return Response.json(requestBody);
};

