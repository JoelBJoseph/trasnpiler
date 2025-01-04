import OpenAI from "openai";

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Method not allowed" });
    }

    try {
        const { cCode } = req.body;

        if (!cCode) {
            return res.status(400).json({ error: "C code input is required." });
        }

        // GPT API Request for Safe Rust Conversion
        const completion = await openai.chat.completions.create({
            model: "gpt-4",
            messages: [
                { role: "system", content: "You are a helpful assistant." },
                {
                    role: "user",
                    content: `Convert the following C code to safe Rust:\n\n${cCode}`,
                },
            ],
        });

        const rustCode = completion.choices[0]?.message?.content || "No output generated.";

        return res.status(200).json({ rustCode });
    } catch (error) {
        console.error("Error in OpenAI API request:", error.message);
        return res.status(500).json({ error: "Internal Server Error" });
    }
}
