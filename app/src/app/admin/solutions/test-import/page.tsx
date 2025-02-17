'use client';

import { useState } from 'react';

export default function TestImportPage() {
  const [result, setResult] = useState<string>('');

  const handleTestImport = async () => {
    try {
      const response = await fetch('/api/admin/solutions/import', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          solutions: [
            {
              title: "Test Solution 1",
              description: "A test solution for import validation",
              version: "1.0.0",
              isPublished: false,
              tags: ["test", "import"],
              resources: [
                {
                  name: "Test Resource",
                  type: "document",
                  url: "https://example.com/test-resource"
                }
              ]
            },
            {
              title: "Test Solution 2",
              description: "Another test solution",
              version: "1.0.1",
              isPublished: true,
              tags: ["test", "demo"],
              resources: []
            }
          ],
          defaultAuthorId: "cm789e7n10000kvsl1442"
        }),
      });
      
      const data = await response.json();
      setResult(JSON.stringify(data, null, 2));
    } catch (error) {
      setResult(error instanceof Error ? error.message : 'An error occurred');
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Test Solutions Import</h1>
      <button 
        onClick={handleTestImport}
        className="bg-blue-500 text-white px-6 py-3 rounded-lg text-lg font-semibold hover:bg-blue-600 mb-4"
      >
        Test Import
      </button>
      {result && (
        <pre className="mt-4 p-4 bg-gray-100 rounded-lg overflow-auto max-h-96 border">
          {result}
        </pre>
      )}
    </div>
  );
}