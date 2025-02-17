'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import type { SolutionImport } from '@/lib/schemas/solutionImport';
import { useSession } from 'next-auth/react';

type ImportStatus = {
  success: boolean;
  imported?: number;
  errors?: Array<{ title: string; error: string }>;
  message?: string;
};

export function SolutionImport() {
  // TODO: Re-enable session check
  const session = {
    user: {
      id: 'temp-admin-id'
    }
  };
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<ImportStatus | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setStatus(null);
    }
  };

  const handleImport = async () => {
    if (!file || !session?.user?.id) return;

    setIsLoading(true);
    setStatus(null);

    try {
      // Read and parse the JSON file
      const content = await file.text();
      const jsonData = JSON.parse(content);

      // Add the current admin user as the default author
      const importData = {
        ...jsonData,
        defaultAuthorId: session.user.id
      };

      // Send to API
      const response = await fetch('/api/admin/solutions/import', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(importData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Import failed');
      }

      setStatus(result);
    } catch (error) {
      setStatus({
        success: false,
        message: error instanceof Error ? error.message : 'Import failed'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="p-6">
      <h2 className="text-2xl font-bold mb-4">Import Solutions</h2>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">
            Select JSON File
          </label>
          <input
            type="file"
            accept=".json"
            onChange={handleFileChange}
            className="block w-full text-sm text-gray-500
              file:mr-4 file:py-2 file:px-4
              file:rounded-md file:border-0
              file:text-sm file:font-semibold
              file:bg-blue-50 file:text-blue-700
              hover:file:bg-blue-100"
          />
        </div>

        <Button
          onClick={handleImport}
          disabled={!file || isLoading}
          className="w-full"
        >
          {isLoading ? 'Importing...' : 'Import Solutions'}
        </Button>

        {status && (
          <div className={`mt-4 p-4 rounded-md ${
            status.success ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
          }`}>
            <p className="font-medium">{status.message}</p>
            {status.errors && status.errors.length > 0 && (
              <div className="mt-2">
                <p className="font-medium">Errors:</p>
                <ul className="list-disc list-inside">
                  {status.errors.map((error, index) => (
                    <li key={index}>
                      {error.title}: {error.error}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>
    </Card>
  );
}