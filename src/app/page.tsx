import { useState } from "react";

export default function TranspilerPage() {
  const [cCode, setCCode] = useState(""); // User-provided C code
  const [rustCode, setRustCode] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleTranspile = async () => {
    if (!cCode.trim()) {
      setError("Please provide valid C code.");
      return;
    }

    setLoading(true);
    setError(null);
    setRustCode(null);

    try {
      const response = await fetch("/api/transpile", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ code: cCode }),
      });

      const data = await response.json();

      if (response.ok) {
        setRustCode(data.result);
      } else {
        setError(data.error || "Failed to transpile the code.");
      }
    } catch {
      setError("An unexpected error occurred. Please try again.");
    }
  };

  return (
      <div className="min-h-screen bg-gray-100 flex flex-col justify-center items-center p-6">
        <h1 className="text-3xl font-bold mb-6">C to Rust Transpiler</h1>

        <div className="w-full max-w-3xl">
          {/* Input Area */}
          <label htmlFor="cCode" className="block text-lg font-semibold mb-2">
            Enter C Code:
          </label>
          <textarea
              id="cCode"
              value={cCode}
              onChange={(e) => setCCode(e.target.value)}
              className="w-full h-40 p-4 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="#include <stdio.h>\nint main() {\n    int a, b, c;\n    c = a + b;\n    printf('Sum: %d', c);\n    return 0;\n}"
          ></textarea>

          {/* Transpile Button */}
          <button
              onClick={handleTranspile}
              disabled={loading}
              className={`mt-4 px-6 py-3 font-semibold rounded-lg ${
                  loading
                      ? "bg-gray-400 text-gray-700 cursor-not-allowed"
                      : "bg-blue-500 text-white hover:bg-blue-600"
              }`}
          >
            {loading ? "Transpiling..." : "Transpile to Rust"}
          </button>
        </div>

        {/* Output Section */}
        <div className="w-full max-w-3xl mt-8">
          {error && (
              <div className="p-4 bg-red-100 text-red-700 rounded-lg">
                Error: {error}
              </div>
          )}

          {rustCode && (
              <div>
                <h2 className="text-lg font-semibold mb-2">Transpiled Rust Code:</h2>
                <pre className="w-full p-4 bg-gray-900 text-white rounded-lg overflow-x-auto">
              {rustCode}
            </pre>
              </div>
          )}
        </div>
      </div>
  );
}
