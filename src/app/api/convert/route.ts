import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

console.log("API Key:", process.env.OPENAI_API_KEY); // Debugging API key loading

const openai = new OpenAI({
    apiKey: "your_api_key"});


export const POST = async (req: NextRequest) => {
    try {
        const requestBody = await req.json();
        console.log("Request Body:", requestBody);

        const { cCode } = requestBody;

        if (!cCode) {
            return NextResponse.json(
                { error: "C code input is required." },
            );
        }

        // Call OpenAI API with updated prompt
        const completion = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
                {
                    role: "system",
                    content: "You are a helpful assistant skilled at programming languages.",
                },
                {
                    role: "user",
                    content: `Convert the following Intermediate Representation (IR) of C code to idiomatic and safe Rust code:\n\n${cCode}`,
                },
            ],
        });

        const rustCode = completion.choices[0]?.message?.content?.trim() || "No output generated.";
        console.log("Converted Rust Code:\n", rustCode);

        return NextResponse.json({ rustCode });
    } catch (error) {
        console.error("Error while converting code:", error);

        return NextResponse.json(
            { error: "Failed to process the request. Please try again." },
        );
    }
};
