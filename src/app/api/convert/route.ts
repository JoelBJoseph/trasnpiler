import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

console.log("api key: " + process.env.OPENAI_API_KEY);
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const POST = async (req: NextRequest, res: NextResponse) => {
  const requestBody = await req.json();
  console.log("requestBody", requestBody);

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content:
            "You are a code converter chat assistant. Your goal is to convert the C code given by role user to a Rust code. Do not give title to your response or explanation of the code. Just return the rust code.",
        },
        {
          role: "user",
          content: `Convert the following C code to idiomatic and safe Rust:\n\n${requestBody.cCode}`,
        },
      ],
    });

    const rustCode = completion?.choices[0].message.content;

    return Response.json({ rustCode: rustCode });
  } catch (error) {
    console.error("Error while converting code:", error);
  }
  return Response.json({});
};
