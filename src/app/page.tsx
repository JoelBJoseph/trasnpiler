"use client";

import React, { useState } from "react";

export default function Home() {
  const [cCode, setCCode] = useState("");
  const [rustCode, setRustCode] = useState("");
  const [error, setError] = useState("");

  const handleTranspile = async () => {
    setError("");
    setRustCode("");

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
        setError(data.error || "Failed to transpile code.");
      }
    } catch (err) {
      setError("An unexpected error occurred.");
    }
  };

  return (
      <div className="container">
        <h1>Transpile C Code to Rust</h1>
        <textarea
            value={cCode}
            onChange={(e) => setCCode(e.target.value)}
            placeholder="Enter your C code here..."
            rows={10}
            className="code-input"
        />
        <button onClick={handleTranspile}>Transpile</button>
        {rustCode && (
            <div>
              <h2>Rust Code:</h2>
              <pre>{rustCode}</pre>
            </div>
        )}
        {error && <p className="error">{error}</p>}
      </div>
  );
}
