import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BulkImport } from './BulkImport';
import { useSession } from 'next-auth/react';
import { useToast } from '@/components/ui/use-toast';

// Mock next-auth
jest.mock('next-auth/react', () => ({
  useSession: jest.fn()
}));

// Mock toast
jest.mock('@/components/ui/use-toast', () => ({
  useToast: jest.fn()
}));

describe('BulkImport', () => {
  const mockSession = {
    data: {
      user: {
        id: 'test-user-id',
        role: 'ADMIN'
      }
    }
  };

  const mockToast = {
    toast: jest.fn()
  };

  beforeEach(() => {
    (useSession as jest.Mock).mockReturnValue(mockSession);
    (useToast as jest.Mock).mockReturnValue(mockToast);
    global.fetch = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders import and mode tabs', () => {
    render(<BulkImport />);
    expect(screen.getByText('File Import')).toBeInTheDocument();
    expect(screen.getByText('Import Mode')).toBeInTheDocument();
  });

  it('handles file selection', async () => {
    render(<BulkImport />);
    
    const file = new File([
      JSON.stringify({
        solutions: [{
          title: 'Test Solution',
          description: 'Test Description',
          category: 'Test',
          provider: 'Test Provider',
          launchUrl: 'https://test.com',
          tags: ['test'],
          tokenCost: 0
        }],
        defaultAuthorId: 'test-user-id'
      })
    ], 'test.json', { type: 'application/json' });

    const input = screen.getByLabelText(/select json file/i);
    fireEvent.change(input, { target: { files: [file] } });

    await waitFor(() => {
      expect(screen.getByText('Import Solutions')).not.toBeDisabled();
    });
  });

  it('shows validation errors for invalid JSON', async () => {
    render(<BulkImport />);
    
    const file = new File([
      JSON.stringify({
        solutions: [{
          // Missing required fields
          title: 'Test Solution'
        }],
        defaultAuthorId: 'test-user-id'
      })
    ], 'test.json', { type: 'application/json' });

    const input = screen.getByLabelText(/select json file/i);
    fireEvent.change(input, { target: { files: [file] } });

    await waitFor(() => {
      expect(screen.getByText(/invalid solutions/i)).toBeInTheDocument();
    });
  });

  it('handles successful import in transaction mode', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({
        success: true,
        imported: 1,
        message: 'Successfully imported 1 solution'
      })
    });

    render(<BulkImport />);
    
    // Select transaction mode
    fireEvent.click(screen.getByText('Import Mode'));
    fireEvent.click(screen.getByLabelText('Transaction Mode'));

    const file = new File([
      JSON.stringify({
        solutions: [{
          title: 'Test Solution',
          description: 'Test Description',
          category: 'Test',
          provider: 'Test Provider',
          launchUrl: 'https://test.com',
          tags: ['test'],
          tokenCost: 0
        }],
        defaultAuthorId: 'test-user-id'
      })
    ], 'test.json', { type: 'application/json' });

    const input = screen.getByLabelText(/select json file/i);
    fireEvent.change(input, { target: { files: [file] } });

    await waitFor(() => {
      const importButton = screen.getByText('Import Solutions');
      expect(importButton).not.toBeDisabled();
      fireEvent.click(importButton);
    });

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        '/api/admin/solutions/import',
        expect.any(Object)
      );
      expect(mockToast.toast).toHaveBeenCalledWith(
        expect.objectContaining({
          title: 'Success'
        })
      );
    });
  });

  it('handles partial success in bulk submission mode', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({
        success: true,
        imported: 1,
        errors: [{
          title: 'Failed Solution',
          error: 'Test error'
        }],
        message: 'Partially imported 1 out of 2 solutions'
      })
    });

    render(<BulkImport />);
    
    // Select partial mode
    fireEvent.click(screen.getByText('Import Mode'));
    fireEvent.click(screen.getByLabelText('Partial Mode'));

    const file = new File([
      JSON.stringify({
        solutions: [{
          title: 'Test Solution 1',
          description: 'Test Description',
          category: 'Test',
          provider: 'Test Provider',
          launchUrl: 'https://test.com',
          tags: ['test'],
          tokenCost: 0
        }, {
          title: 'Test Solution 2',
          description: 'Test Description',
          category: 'Test',
          provider: 'Test Provider',
          launchUrl: 'https://test.com',
          tags: ['test'],
          tokenCost: 0
        }],
        defaultAuthorId: 'test-user-id'
      })
    ], 'test.json', { type: 'application/json' });

    const input = screen.getByLabelText(/select json file/i);
    fireEvent.change(input, { target: { files: [file] } });

    await waitFor(() => {
      const importButton = screen.getByText('Import Solutions');
      expect(importButton).not.toBeDisabled();
      fireEvent.click(importButton);
    });

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        '/api/admin/solutions/bulk-submission',
        expect.any(Object)
      );
      expect(screen.getByText(/partially imported/i)).toBeInTheDocument();
      expect(screen.getByText(/failed solution/i)).toBeInTheDocument();
    });
  });
});