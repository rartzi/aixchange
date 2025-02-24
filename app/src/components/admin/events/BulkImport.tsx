'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { eventImportSchema, type EventImport } from '@/lib/schemas/eventImport';
import { useSession } from 'next-auth/react';
import { useToast } from '@/components/ui/use-toast';
import { ChevronDown, ChevronUp, X } from 'lucide-react';

type ImportMode = 'transaction' | 'partial';
type PreviewData = {
  events: Array<{
    title: string;
    status: 'valid' | 'invalid';
    errors?: string[];
  }>;
  totalEvents: number;
  validEvents: number;
};

type ImportStatus = {
  success: boolean;
  imported?: number;
  errors?: Array<{ title: string; error: string }>;
  message?: string;
  progress?: number;
};

interface BulkImportProps {
  onImportSuccess: () => void;
}

export function BulkImport({ onImportSuccess }: BulkImportProps) {
  const { data: session } = useSession();
  const { toast } = useToast();
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<ImportStatus | null>(null);
  const [mode, setMode] = useState<ImportMode>('transaction');
  const [preview, setPreview] = useState<PreviewData | null>(null);
  const [importData, setImportData] = useState<EventImport | null>(null);
  const [errorsExpanded, setErrorsExpanded] = useState(true);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setStatus(null);
      setPreview(null);
      setImportData(null);
      await validateAndPreview(selectedFile);
    }
  };

  const validateAndPreview = async (file: File) => {
    try {
      const content = await file.text();
      const jsonData = JSON.parse(content);

      // Add current user as default author
      const dataWithAuthor = {
        ...jsonData,
        defaultAuthorId: session?.user?.id
      };

      // Validate against schema
      const validationResult = eventImportSchema.safeParse(dataWithAuthor);

      if (!validationResult.success) {
        const errors = validationResult.error.errors.map(err => ({
          path: err.path.join('.'),
          message: err.message
        }));

        setPreview({
          events: jsonData.events?.map((evt: any) => ({
            title: evt.title || 'Unnamed Event',
            status: 'invalid',
            errors: errors
              .filter(err => err.path.includes(evt.title))
              .map(err => err.message)
          })) || [],
          totalEvents: jsonData.events?.length || 0,
          validEvents: 0,
        });
        return;
      }

      setImportData(validationResult.data);
      setPreview({
        events: validationResult.data.events.map(evt => ({
          title: evt.title,
          status: 'valid'
        })),
        totalEvents: validationResult.data.events.length,
        validEvents: validationResult.data.events.length,
      });
    } catch (error) {
      console.error('Parse error:', error);
      toast({
        title: "Error",
        description: "Failed to parse JSON file",
        variant: "destructive"
      });
    }
  };

  const handleImport = async () => {
    if (!file || !importData || !session?.user?.id) return;

    setIsLoading(true);
    setStatus({ success: false, progress: 0 });
    setErrorsExpanded(true);

    try {
      const endpoint = mode === 'transaction' 
        ? '/api/admin/events/import'
        : '/api/admin/events/bulk-submission';

      const response = await fetch(endpoint, {
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

      setStatus({
        ...result,
        progress: 100
      });

      toast({
        title: "Success",
        description: result.message
      });

      onImportSuccess();
    } catch (error) {
      setStatus({
        success: false,
        message: error instanceof Error ? error.message : 'Import failed',
        progress: 0
      });

      toast({
        title: "Error",
        description: error instanceof Error ? error.message : 'Import failed',
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const clearStatus = () => {
    setStatus(null);
    setFile(null);
    setPreview(null);
    setImportData(null);
    // Clear the file input
    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  };

  return (
    <Card className="p-6 bg-white dark:bg-gray-800">
      <Tabs defaultValue="import" className="space-y-4">
        <TabsList>
          <TabsTrigger value="import">Import Events</TabsTrigger>
          <TabsTrigger value="mode">Import Mode</TabsTrigger>
        </TabsList>

        <TabsContent value="import" className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-900 dark:text-gray-100">
              Select JSON File
            </label>
            <input
              type="file"
              accept=".json"
              onChange={handleFileChange}
              className="block w-full text-sm text-gray-500 dark:text-gray-400
                file:mr-4 file:py-2 file:px-4
                file:rounded-md file:border-0
                file:text-sm file:font-semibold
                file:bg-blue-50 file:text-blue-700 dark:file:bg-blue-900 dark:file:text-blue-100
                hover:file:bg-blue-100 dark:hover:file:bg-blue-800"
            />
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              Current Mode: {mode === 'transaction' ? 'Transaction (All-or-nothing)' : 'Partial (Continue on error)'}
            </p>
          </div>

          {preview && (
            <Alert className={`${
              preview.validEvents === preview.totalEvents 
                ? 'bg-green-50 dark:bg-green-900/30 text-green-900 dark:text-green-100' 
                : 'bg-yellow-50 dark:bg-yellow-900/30 text-yellow-900 dark:text-yellow-100'
            }`}>
              <AlertTitle>Import Preview</AlertTitle>
              <AlertDescription>
                <div className="space-y-2">
                  <p>Total Events: {preview.totalEvents}</p>
                  <p>Valid Events: {preview.validEvents}</p>
                  {preview.validEvents !== preview.totalEvents && (
                    <div className="mt-2">
                      <p className="font-semibold">Invalid Events:</p>
                      <ul className="list-disc list-inside">
                        {preview.events
                          .filter(s => s.status === 'invalid')
                          .map((s, i) => (
                            <li key={i}>
                              {s.title}
                              {s.errors && (
                                <ul className="ml-4 list-disc">
                                  {s.errors.map((err, j) => (
                                    <li key={j} className="text-sm text-red-600 dark:text-red-400">{err}</li>
                                  ))}
                                </ul>
                              )}
                            </li>
                          ))}
                      </ul>
                    </div>
                  )}
                </div>
              </AlertDescription>
            </Alert>
          )}

          {status?.progress !== undefined && (
            <div className="space-y-2">
              <Progress value={status.progress} />
              <p className="text-sm text-gray-500 dark:text-gray-400">{status.progress}% complete</p>
            </div>
          )}

          <div className="flex gap-2">
            <Button
              onClick={handleImport}
              disabled={!importData || isLoading}
              className="flex-1"
            >
              {isLoading ? 'Importing...' : 'Import Events'}
            </Button>
            {status && (
              <Button
                variant="outline"
                onClick={clearStatus}
                className="px-3"
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>

          {status && (
            <Alert className={`${
              status.success 
                ? 'bg-green-50 dark:bg-green-900/30 text-green-900 dark:text-green-100 border-green-200 dark:border-green-800' 
                : 'bg-red-50 dark:bg-red-900/30 text-red-900 dark:text-red-100 border-red-200 dark:border-red-800'
            }`}>
              <div className="flex justify-between items-start">
                <AlertTitle>{status.success ? 'Success' : 'Error'}</AlertTitle>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setErrorsExpanded(!errorsExpanded)}
                    className="h-6 px-2"
                  >
                    {errorsExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                  </Button>
                </div>
              </div>
              <AlertDescription>
                <p>{status.message}</p>
                {status.errors && status.errors.length > 0 && errorsExpanded && (
                  <div className="mt-2">
                    <p className="font-semibold">Errors:</p>
                    <ul className="list-disc list-inside">
                      {status.errors.map((error, index) => (
                        <li key={index} className="text-red-700 dark:text-red-300">
                          {error.title}: {error.error}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </AlertDescription>
            </Alert>
          )}
        </TabsContent>

        <TabsContent value="mode">
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-medium mb-2 text-gray-900 dark:text-gray-100">Import Mode</h3>
              <div className="space-y-4">
                <div className="flex items-start space-x-2">
                  <input
                    type="radio"
                    id="transaction"
                    value="transaction"
                    checked={mode === 'transaction'}
                    onChange={(e) => setMode(e.target.value as ImportMode)}
                    className="mt-1"
                  />
                  <div>
                    <label htmlFor="transaction" className="font-medium text-gray-900 dark:text-gray-100">Transaction Mode</label>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      All-or-nothing import. If any event fails, the entire import is rolled back.
                      Best for maintaining data consistency.
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-2">
                  <input
                    type="radio"
                    id="partial"
                    value="partial"
                    checked={mode === 'partial'}
                    onChange={(e) => setMode(e.target.value as ImportMode)}
                    className="mt-1"
                  />
                  <div>
                    <label htmlFor="partial" className="font-medium text-gray-900 dark:text-gray-100">Partial Mode</label>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Continues importing even if some events fail. Successfully imported events are kept.
                      Best for large imports where some failures are acceptable.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </Card>
  );
}