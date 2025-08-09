import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { 
  Edit, 
  Trash2, 
  MoreHorizontal, 
  Search,
  Filter
} from "lucide-react";
import type { FirebaseJob } from "@/services/jobsService";

interface JobsTableProps {
  jobs: FirebaseJob[];
  onEdit: (job: FirebaseJob) => void;
  onDelete: (jobId: string) => void;
}

export const JobsTable = ({ jobs, onEdit, onDelete }: JobsTableProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");

  const filteredJobs = jobs.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         job.location.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filterType === "all" || job.type.toLowerCase() === filterType.toLowerCase();
    
    return matchesSearch && matchesFilter;
  });

  const getTypeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case 'full-time':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      case 'part-time':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'remote':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300';
      case 'contract':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <CardTitle>Job Listings</CardTitle>
            <p className="text-sm text-muted-foreground">
              Manage all job postings on your platform
            </p>
          </div>
          <div className="flex gap-2 w-full md:w-auto">
            <div className="relative flex-1 md:w-64">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search jobs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  <Filter className="h-4 w-4 mr-2" />
                  Filter
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => setFilterType("all")}>
                  All Types
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilterType("full-time")}>
                  Full-time
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilterType("part-time")}>
                  Part-time
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilterType("remote")}>
                  Remote
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilterType("contract")}>
                  Contract
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Job Title</TableHead>
                <TableHead>Company</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Salary</TableHead>
                <TableHead>Posted</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredJobs.map((job) => (
                <TableRow key={job.id}>
                  <TableCell className="font-medium">
                    <div>
                      <p className="font-semibold">{job.title}</p>
                      <p className="text-sm text-muted-foreground line-clamp-1">
                        {job.description.substring(0, 60)}...
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>{job.company}</TableCell>
                  <TableCell>{job.location}</TableCell>
                  <TableCell>
                    <Badge 
                      variant="secondary" 
                      className={getTypeColor(job.type)}
                    >
                      {job.type}
                    </Badge>
                  </TableCell>
                  <TableCell>{job.salary}</TableCell>
                  <TableCell>{job.postedTime}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => onEdit(job)}>
                          <Edit className="h-4 w-4 mr-2" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => onDelete(job.id)}
                          className="text-red-600"
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          
          {filteredJobs.length === 0 && (
            <div className="text-center py-8">
              <p className="text-muted-foreground">
                {searchTerm || filterType !== "all" 
                  ? "No jobs found matching your criteria" 
                  : "No jobs available"
                }
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
