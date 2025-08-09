import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Edit, 
  Trash2, 
  Plus,
  TrendingUp,
  Users,
  Calendar,
  Database
} from "lucide-react";
import type { FirebaseJob } from "@/services/jobsService";
import { StatsCards } from "@/components/admin/StatsCards";
import { initializeFirebaseData } from "@/utils/initializeData";
import { useToast } from "@/hooks/use-toast";

interface AdminOverviewProps {
  onEditJob: (job: FirebaseJob) => void;
  onDeleteJob: (jobId: string) => void;
  onCreateJob: () => void;
  jobs: FirebaseJob[];
}

export const AdminOverview = ({ onEditJob, onDeleteJob, onCreateJob, jobs }: AdminOverviewProps) => {
  const { toast } = useToast();

  const handleAddSampleData = async () => {
    try {
      await initializeFirebaseData();
      toast({
        title: "Success",
        description: "Sample data added to Firebase successfully!",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add sample data. Please try again.",
        variant: "destructive",
      });
    }
  };
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Dashboard Overview
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Welcome back! Here's what's happening with your job board.
          </p>
        </div>
        <div>
          <Button onClick={onCreateJob} className="mt-4 md:mt-0 mr-2">
            <Plus className="h-4 w-4 mr-2" />
            Post New Job
          </Button>
          {jobs.length === 0 && (
            <Button onClick={handleAddSampleData} variant="outline" className="mt-4 md:mt-0">
              <Database className="h-4 w-4 mr-2" />
              Add Sample Data
            </Button>
          )}
        </div>
      </div>

      {/* Stats Cards */}
      <StatsCards jobs={jobs} />

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="cursor-pointer hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Quick Actions</CardTitle>
            <Plus className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Button variant="outline" size="sm" className="w-full justify-start" onClick={onCreateJob}>
                <Plus className="h-4 w-4 mr-2" />
                Post New Job
              </Button>
              <Button variant="outline" size="sm" className="w-full justify-start">
                <Users className="h-4 w-4 mr-2" />
                View Applications
              </Button>
              <Button variant="outline" size="sm" className="w-full justify-start">
                <TrendingUp className="h-4 w-4 mr-2" />
                Analytics Report
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Recent Activity</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">New applications</span>
                <span className="font-medium">+12</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Jobs posted today</span>
                <span className="font-medium">3</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Profile views</span>
                <span className="font-medium">+47</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Top Performing Jobs</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Frontend Developer</span>
                <span className="font-medium">89 views</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Product Manager</span>
                <span className="font-medium">76 views</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">UX Designer</span>
                <span className="font-medium">54 views</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Jobs */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Job Postings</CardTitle>
          <CardDescription>
            Latest jobs added to your platform
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {jobs.slice(0, 5).map((job) => (
              <div key={job.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                <div className="flex-1">
                  <h3 className="font-semibold">{job.title}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {job.company} • {job.location}
                  </p>
                  <div className="flex gap-2 mt-2">
                    <Badge variant="secondary">{job.type}</Badge>
                    <Badge variant="outline">{job.salary}</Badge>
                    <Badge variant="outline" className="text-xs">
                      {job.postedTime}
                    </Badge>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onEditJob(job)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onDeleteJob(job.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-4 text-center">
            <Button variant="outline">
              View All Jobs
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
