import { CreateSolutionForm } from '@/components/features/solutions/CreateSolutionForm';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Create New Solution',
  description: 'Create a new solution in the AIXchange platform',
};

export default function CreateSolutionPage() {
  return (
    <div className="container mx-auto py-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Create New Solution</h1>
          <p className="text-gray-600 mt-2">
            Share your solution with the community. Provide clear details and add relevant tags to help others find your solution.
          </p>
        </div>
        
        <CreateSolutionForm />
      </div>
    </div>
  );
}