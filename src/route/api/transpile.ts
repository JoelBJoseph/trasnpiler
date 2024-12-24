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
            "https://api.edenai.run/v2/workflow/ceef28b2-fdbe-4a56-8ab5-8f6c4a347808/execution/";
        const payload = {"c_code": "#include <stdio.h>\nint main() {\n    int a, b, c;\n    c = a + b;\n    printf('Sum: %d', c);\n    return 0;\n}"};

        try {
            const response = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiZmFkYjIyMGItNmUzNy00ODZiLWJiMzQtN2JlNjY1Yzc5YmFlIiwidHlwZSI6ImFwaV90b2tlbiJ9.sfIvYUnrqdgXWs2l7ZtfSUW1W7Wj-cfDp8sMc3gH0MI"
                },
                body: JSON.stringify(payload),
            });

            console.log(response)
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