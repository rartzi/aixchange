"use client";

import { useEffect, useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { BulkImport } from "@/components/admin/BulkImport";
import { AdminSolutionDialog } from "@/components/admin/AdminSolutionDialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Image from "next/image";

interface Solution {
  id: string;
  title: string;
  description: string;
  status: "ACTIVE" | "PENDING" | "INACTIVE";
  createdAt: string;
  updatedAt: string;
  upvotes: number;
  downvotes: number;
  totalVotes: number;
  category: string;
  provider: string;
  launchUrl: string;
  sourceCodeUrl?: string;
  tokenCost: number;
  rating: number;
  tags: string[];
  imageUrl?: string;
  isPublished: boolean;
  author: {
    name: string;
    email: string;
  };
  _count: {
    reviews: number;
  };
}

type SortableFields = keyof Pick<Solution, 
  'title' | 'status' | 'createdAt' | 'updatedAt' | 'totalVotes'
>;

export default function SolutionsAdminPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [solutions, setSolutions] = useState<Solution[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<"ALL" | "ACTIVE" | "PENDING" | "INACTIVE">("ALL");
  const [sortField, setSortField] = useState<SortableFields>("createdAt");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingSolution, setEditingSolution] = useState<Solution | null>(null);
  const [selectedSolutions, setSelectedSolutions] = useState<Set<string>>(new Set());
  const { toast } = useToast();

  useEffect(() => {
    if (status === 'loading') return;
    
    if (!session?.user || session.user.role !== 'ADMIN') {
      router.push('/login?callbackUrl=/admin/solutions');
      return;
    }

    fetchSolutions();
  }, [session, status, router]);

  const fetchSolutions = async () => {
    try {
      const response = await fetch("/api/admin/solutions");
      if (!response.ok) throw new Error("Failed to fetch solutions");
      const data = await response.json();
      setSolutions(data);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load solutions",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveSolution = async (solutionData: Partial<Solution>) => {
    try {
      const isEditing = !!solutionData.id;
      const url = isEditing 
        ? `/api/admin/solutions/${solutionData.id}`
        : '/api/admin/solutions';
      
      const response = await fetch(url, {
        method: isEditing ? 'PATCH' : 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(solutionData),
      });

      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || `Failed to ${isEditing ? 'update' : 'create'} solution`);
      }

      toast({
        title: "Success",
        description: `Solution ${isEditing ? 'updated' : 'created'} successfully`,
      });

      fetchSolutions();
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to save solution",
        variant: "destructive",
      });
      throw error;
    }
  };

  const handleDelete = async (solutionId: string) => {
    if (!confirm("Are you sure you want to delete this solution?")) return;

    try {
      const response = await fetch(`/api/admin/solutions/${solutionId}`, {
        method: "DELETE",
      });

      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || "Failed to delete solution");
      }

      setSolutions((prevSolutions) =>
        prevSolutions.filter((solution) => solution.id !== solutionId)
      );

      toast({
        title: "Success",
        description: "Solution deleted successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to delete solution",
        variant: "destructive",
      });
    }
  };

  const handleBulkStatusUpdate = async (newStatus: "ACTIVE" | "PENDING" | "INACTIVE") => {
    if (!selectedSolutions.size) {
      toast({
        title: "Error",
        description: "No solutions selected",
        variant: "destructive",
      });
      return;
    }

    try {
      const response = await fetch('/api/admin/solutions/bulk-update', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          solutionIds: Array.from(selectedSolutions),
          status: newStatus,
        }),
      });

      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || "Failed to update solutions");
      }

      toast({
        title: "Success",
        description: `Successfully updated ${selectedSolutions.size} solutions`,
      });

      setSelectedSolutions(new Set());
      fetchSolutions();
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update solutions",
        variant: "destructive",
      });
    }
  };

  const handleBulkDelete = async () => {
    if (!selectedSolutions.size) {
      toast({
        title: "Error",
        description: "No solutions selected",
        variant: "destructive",
      });
      return;
    }

    if (!confirm(`Are you sure you want to delete ${selectedSolutions.size} solutions? This action cannot be undone.`)) {
      return;
    }

    try {
      const response = await fetch('/api/admin/solutions/bulk-delete', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          solutionIds: Array.from(selectedSolutions),
        }),
      });

      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || "Failed to delete solutions");
      }

      toast({
        title: "Success",
        description: result.message || `Successfully deleted ${selectedSolutions.size} solutions`,
      });

      setSelectedSolutions(new Set());
      fetchSolutions();
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to delete solutions",
        variant: "destructive",
      });
    }
  };

  const handleEdit = (solution: Solution) => {
    setEditingSolution(solution);
    setDialogOpen(true);
  };

  const handleAdd = () => {
    setEditingSolution(null);
    setDialogOpen(true);
  };

  const toggleSolutionSelection = (solutionId: string) => {
    const newSelection = new Set(selectedSolutions);
    if (newSelection.has(solutionId)) {
      newSelection.delete(solutionId);
    } else {
      newSelection.add(solutionId);
    }
    setSelectedSolutions(newSelection);
  };

  const toggleAllSolutions = () => {
    if (selectedSolutions.size === filteredSolutions.length) {
      setSelectedSolutions(new Set());
    } else {
      setSelectedSolutions(new Set(filteredSolutions.map(s => s.id)));
    }
  };

  const filteredSolutions = solutions
    .filter((solution) => {
      const matchesSearch = 
        solution.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        solution.author.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        solution.author.email.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === "ALL" || solution.status === statusFilter;
      
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      const aValue = a[sortField];
      const bValue = b[sortField];
      const modifier = sortDirection === "asc" ? 1 : -1;
      
      if (!aValue || !bValue) return 0;
      
      if (typeof aValue === "string" && typeof bValue === "string") {
        return aValue.localeCompare(bValue) * modifier;
      }
      
      if (aValue < bValue) return -1 * modifier;
      if (aValue > bValue) return 1 * modifier;
      return 0;
    });

  if (status === 'loading' || isLoading) {
    return <div className="p-8 text-gray-900 dark:text-gray-100">Loading...</div>;
  }

  if (!session?.user || session.user.role !== 'ADMIN') {
    return null;
  }

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-6 px-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Solution Management</h1>
        <Button onClick={handleAdd}>Add Solution</Button>
      </div>
      
      <div className="space-y-8 px-8">
        {/* Bulk Import Section */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Bulk Import</h2>
          <BulkImport />
        </div>

        {/* Solutions Table */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Solutions Overview</h2>
            <div className="flex gap-4">
              <Input
                placeholder="Search solutions..."
                value={searchTerm}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
                className="w-64 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
              />
              <Select
                value={statusFilter}
                onValueChange={(value: "ALL" | "ACTIVE" | "PENDING" | "INACTIVE") => setStatusFilter(value)}
              >
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">All Status</SelectItem>
                  <SelectItem value="ACTIVE">Active</SelectItem>
                  <SelectItem value="PENDING">Pending</SelectItem>
                  <SelectItem value="INACTIVE">Inactive</SelectItem>
                </SelectContent>
              </Select>
              <Select
                value={sortField}
                onValueChange={(value: SortableFields) => setSortField(value)}
              >
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="title">Title</SelectItem>
                  <SelectItem value="status">Status</SelectItem>
                  <SelectItem value="createdAt">Created Date</SelectItem>
                  <SelectItem value="updatedAt">Updated Date</SelectItem>
                  <SelectItem value="totalVotes">Total Votes</SelectItem>
                </SelectContent>
              </Select>
              <Button
                variant="outline"
                onClick={() => setSortDirection(prev => prev === "asc" ? "desc" : "asc")}
                className="bg-white dark:bg-gray-800"
              >
                {sortDirection === "asc" ? "↑" : "↓"}
              </Button>
            </div>
          </div>

          {selectedSolutions.size > 0 && (
            <div className="flex gap-2 items-center">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {selectedSolutions.size} solutions selected
              </span>
              <Select
                onValueChange={(value: "ACTIVE" | "PENDING" | "INACTIVE") => handleBulkStatusUpdate(value)}
              >
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Update Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ACTIVE">Set Active</SelectItem>
                  <SelectItem value="PENDING">Set Pending</SelectItem>
                  <SelectItem value="INACTIVE">Set Inactive</SelectItem>
                </SelectContent>
              </Select>
              <Button
                variant="destructive"
                onClick={handleBulkDelete}
                className="ml-2"
              >
                Delete Selected
              </Button>
            </div>
          )}
          
          <div className="rounded-md border border-gray-200 dark:border-gray-700 overflow-x-auto bg-white dark:bg-gray-800">
            <Table>
              <TableHeader>
                <TableRow className="border-b border-gray-200 dark:border-gray-700">
                  <TableHead className="w-12">
                    <Checkbox
                      checked={selectedSolutions.size === filteredSolutions.length && filteredSolutions.length > 0}
                      onCheckedChange={toggleAllSolutions}
                    />
                  </TableHead>
                  <TableHead className="text-gray-900 dark:text-gray-100">Title</TableHead>
                  <TableHead className="text-gray-900 dark:text-gray-100">Image</TableHead>
                  <TableHead className="text-gray-900 dark:text-gray-100">Author</TableHead>
                  <TableHead className="text-gray-900 dark:text-gray-100">Status</TableHead>
                  <TableHead className="text-gray-900 dark:text-gray-100">Category</TableHead>
                  <TableHead className="text-gray-900 dark:text-gray-100">Created</TableHead>
                  <TableHead className="text-gray-900 dark:text-gray-100">Updated</TableHead>
                  <TableHead className="text-gray-900 dark:text-gray-100">Votes (Up/Down)</TableHead>
                  <TableHead className="text-gray-900 dark:text-gray-100">Reviews</TableHead>
                  <TableHead className="text-gray-900 dark:text-gray-100">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredSolutions.map((solution) => (
                  <TableRow key={solution.id} className="border-b border-gray-200 dark:border-gray-700">
                    <TableCell>
                      <Checkbox
                        checked={selectedSolutions.has(solution.id)}
                        onCheckedChange={() => toggleSolutionSelection(solution.id)}
                      />
                    </TableCell>
                    <TableCell>
                      <div className="font-medium text-gray-900 dark:text-gray-100">{solution.title}</div>
                    </TableCell>
                    <TableCell>
                      {solution.imageUrl ? (
                        <div className="relative w-16 h-16">
                          <Image
                            src={solution.imageUrl}
                            alt={solution.title}
                            fill
                            className="object-cover rounded"
                          />
                        </div>
                      ) : (
                        <span className="text-gray-400 dark:text-gray-500">No image</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium text-gray-900 dark:text-gray-100">{solution.author.name || "N/A"}</div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          {solution.author.email}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        solution.status === "ACTIVE" 
                          ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100"
                          : solution.status === "PENDING"
                          ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100"
                          : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100"
                      }`}>
                        {solution.status}
                      </span>
                    </TableCell>
                    <TableCell className="text-gray-900 dark:text-gray-100">{solution.category}</TableCell>
                    <TableCell className="text-gray-900 dark:text-gray-100">{new Date(solution.createdAt).toLocaleDateString()}</TableCell>
                    <TableCell className="text-gray-900 dark:text-gray-100">{new Date(solution.updatedAt).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <span className="text-green-600 dark:text-green-400">+{solution.upvotes}</span>
                        <span className="text-gray-600 dark:text-gray-400">/</span>
                        <span className="text-red-600 dark:text-red-400">-{solution.downvotes}</span>
                        <span className="text-gray-500 dark:text-gray-400 text-sm">
                          ({solution.totalVotes} total)
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-gray-900 dark:text-gray-100">{solution._count.reviews}</TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(solution)}
                          className="bg-white dark:bg-gray-800"
                        >
                          Edit
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDelete(solution.id)}
                        >
                          Delete
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>

      <AdminSolutionDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        solution={editingSolution}
        onSave={handleSaveSolution}
      />
    </div>
  );
}