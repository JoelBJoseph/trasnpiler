import {NextApiRequest, NextApiResponse} from "next";
import {NextRequest} from "next/server";


export function extractRustCode(jsonData: any) {
    try {
        // Navigate to the `results` field
        const results = jsonData.content?.results || {};
        for (const key in results) {
            const nodeResults = results[key]?.results || [];
            for (const result of nodeResults) {
                const generatedText = result.generated_text || "";
                if (generatedText.includes("```rust")) {
                    // Extract the Rust code block
                    const start = generatedText.indexOf("```rust") + "```rust\n".length;
                    const end = generatedText.indexOf("```", start);
                    const rustCode = generatedText.slice(start, end).trim();
                    return rustCode;
                }
            }
        }
        return "Rust code not found.";
    } catch (error: any) {
        return `Error extracting Rust code: ${error.message}`;
    }
}

export async function POST(request: NextRequest,  res: NextApiResponse) {
    const body = await request.json();
    const { code } = body;

    if (!code) {
        return new Response(JSON.stringify({ error: 'Code is required' }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' },
        });
    }

    const url =
        "https://api.edenai.run/v2/workflow/ceef28b2-fdbe-4a56-8ab5-8f6c4a347808/execution/8f726c32-b5c6-4d4b-b791-783d9022fec4";
    const payload = {"c_code": code};

    try {
        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiZmFkYjIyMGItNmUzNy00ODZiLWJiMzQtN2JlNjY1Yzc5YmFlIiwidHlwZSI6ImFwaV90b2tlbiJ9.sfIvYUnrqdgXWs2l7ZtfSUW1W7Wj-cfDp8sMc3gH0MI"
            },
            body: JSON.stringify(payload),
        });

        const transpiledResponse = await response.json();
        console.log(transpiledResponse)

        const rustCode = extractRustCode(transpiledResponse);
        console.log('Rust Code ', rustCode);
        if (!response.ok) {
            const errorText = await response.text();
            return res.status(response.status).json({ error: errorText });
        }

        const result = rustCode;
        return new Response(JSON.stringify({ result }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (error) {
        console.error("Error transpiling code:", error);
        return new Response(JSON.stringify({ error: 'Error during transpilation' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}
