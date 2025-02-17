import { SolutionImport } from '@/components/admin/SolutionImport';

export default async function ImportSolutionsPage() {
  // TODO: Re-enable authentication checks
  const _session = {
    user: {
      id: 'temp-admin-id',
      role: 'ADMIN'
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Import Solutions</h1>
          <p className="text-gray-600 mt-2">
            Upload a JSON file containing solution data for bulk import.
          </p>
        </div>

        <SolutionImport />

        <div className="mt-8 bg-blue-50 p-4 rounded-md">
          <h3 className="font-semibold text-blue-800 mb-2">Import Format</h3>
          <p className="text-sm text-blue-700 mb-4">
            The JSON file should follow this structure:
          </p>
          <pre className="bg-white p-4 rounded text-sm overflow-x-auto">
{`{
  "solutions": [
    {
      "title": "Solution Title",
      "description": "Solution Description",
      "version": "1.0.0",
      "isPublished": false,
      "tags": ["tag1", "tag2"],
      "resources": [
        {
          "name": "Resource Name",
          "type": "document",
          "url": "https://example.com/resource"
        }
      ]
    }
  ]
}`}
          </pre>
        </div>
      </div>
    </div>
  );
}