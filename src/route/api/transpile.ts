import { NextApiRequest, NextApiResponse } from "next";

type TranspileRequest = {
    code: string;
};

type TranspileResponse = {
    result?: string;
    error?: string;
};

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<TranspileResponse>
) {
    if (req.method === "POST") {
        const { code } = req.body as TranspileRequest;

        if (!code) {
            return res.status(400).json({ error: "Code is required." });
        }

        const url =
            "https://api.edenai.run/v2/workflow/71a489a8-d724-4728-a1be-234e2612f3e9/execution/";
        const payload = {
            Text: code,
            Output_language: "Rust",
        };

        try {
            const response = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiMjk5NDdmZDktYjg0YS00NjY3LTliNzUtNzk5MGJhODdlZTAzIiwidHlwZSI6ImFwaV90b2tlbiJ9.lnJqRcZN_5igbjaLQRW5PdooQSp4HyPl4AoHWBcsv4A"
                },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                const errorText = await response.text();
                return res.status(response.status).json({ error: errorText });
            }

            const result = await response.json();
            res.status(200).json({ result: result.result });
        } catch (error) {
            console.error("Error transpiling code:", error);
            res.status(500).json({ error: "An unexpected error occurred." });
        }
    } else {
        res.setHeader("Allow", ["POST"]);
        res.status(405).json({ error: `Method ${req.method} Not Allowed` });
    }
}