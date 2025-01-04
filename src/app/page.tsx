'use client';

import { useState } from 'react';

export default function Home() {
    const [cCode, setCCode] = useState('');
    const [rustCode, setRustCode] = useState('');
    const [loading, setLoading] = useState(false);

    const handleConvert = async () => {
        setLoading(true);
        try {
            const response = await fetch('/api/route', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ cCode }),
            });

            if (!response.ok) {
                throw new Error('Failed to convert code');
            }

            const data = await response.json();
            setRustCode(data.rustCode);
        } catch (error: any) {
            console.error('Error converting code:', error.message);
            alert('Conversion failed.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl w-full bg-white p-8 rounded-lg shadow-lg">
                <h1 className="text-3xl font-semibold text-center text-gray-800 mb-6">C to Safe Rust Transpiler</h1>

                <div className="mb-6">
                    <label htmlFor="cCode" className="block text-lg font-medium text-gray-700 mb-2">
                        Enter C Code:
                    </label>
                    <textarea
                        id="cCode"
                        value={cCode}
                        onChange={(e) => setCCode(e.target.value)}
                        placeholder="Enter your C code here..."
                        rows={10}
                        className="w-full p-4 border border-gray-300 rounded-lg text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                <button
                    onClick={handleConvert}
                    disabled={loading}
                    className={`w-full py-3 mt-4 text-lg font-medium text-white rounded-lg focus:outline-none ${
                        loading ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'
                    }`}
                >
                    {loading ? 'Converting...' : 'Converted to Safe Rust'}
                </button>

                {rustCode && (
                    <div className="mt-6">
                        <h2 className="text-2xl font-semibold text-gray-800 mb-2">Generated Safe Rust Code:</h2>
                        <pre className="bg-gray-100 p-4 rounded-lg border border-gray-300 text-sm text-gray-800 whitespace-pre-wrap break-words">
              {rustCode}
            </pre>
                    </div>
                )}
            </div>
        </div>
    );
}
