import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Users, 
  TrendingUp, 
  Eye
} from "lucide-react";
import { Job } from "@/data/jobs";
import { JobForm } from "@/components/admin/JobForm";
import { JobsTable } from "@/components/admin/JobsTable";
import { AdminOverview } from "@/components/admin/AdminOverview";
import { 
  getAllJobs, 
  createJob, 
  updateJob, 
  deleteJob, 
  subscribeToJobs,
  FirebaseJob 
} from "@/services/jobsService";
import { useToast } from "@/hooks/use-toast";

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [showJobForm, setShowJobForm] = useState(false);
  const [editingJob, setEditingJob] = useState<Job | null>(null);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // Convert Firebase job to local job format
  const convertFirebaseJobToJob = (firebaseJob: FirebaseJob): Job => ({
    id: firebaseJob.id ? firebaseJob.id : Math.random().toString(),
    title: firebaseJob.title,
    company: firebaseJob.company,
    location: firebaseJob.location,
    salary: firebaseJob.salary,
    type: firebaseJob.type,
    description: firebaseJob.description,
    keyResponsibilities: firebaseJob.keyResponsibilities,
    requirements: firebaseJob.requirements,
    benefits: firebaseJob.benefits,
    tags: firebaseJob.tags,
    companyLogo: firebaseJob.companyLogo,
    postedTime: firebaseJob.postedTime || 'Just now'
  });

  // Convert local job to Firebase job format
  const convertJobToFirebaseJob = (job: Partial<Job>): Omit<FirebaseJob, 'id' | 'createdAt' | 'updatedAt' | 'postedTime'> => ({
    title: job.title || '',
    company: job.company || '',
    location: job.location || '',
    salary: job.salary || '',
    type: job.type || '',
    description: job.description || '',
    keyResponsibilities: job.keyResponsibilities || [],
    requirements: job.requirements || [],
    benefits: job.benefits || [],
    tags: job.tags || [],
    companyLogo: job.companyLogo
  });

  useEffect(() => {
    // Subscribe to real-time updates
    const unsubscribe = subscribeToJobs((firebaseJobs) => {
      const convertedJobs = firebaseJobs.map(convertFirebaseJobToJob);
      setJobs(convertedJobs);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleEditJob = (job: Job) => {
    setEditingJob(job);
    setShowJobForm(true);
  };

  const handleCreateJob = () => {
    setEditingJob(null);
    setShowJobForm(true);
  };

  const handleSaveJob = async (jobData: Partial<Job>) => {
    try {
      const firebaseJobData = convertJobToFirebaseJob(jobData);
      
      if (editingJob?.id) {
        // Update existing job
        await updateJob(editingJob.id, firebaseJobData);
        toast({
          title: "Success",
          description: "Job updated successfully",
        });
      } else {
        // Create new job
        await createJob(firebaseJobData);
        toast({
          title: "Success",
          description: "Job created successfully",
        });
      }
      
      setShowJobForm(false);
      setEditingJob(null);
    } catch (error) {
      console.error('Error saving job:', error);
      toast({
        title: "Error",
        description: "Failed to save job. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteJob = async (jobId: string) => {
    if (!confirm("Are you sure you want to delete this job?")) {
      return;
    }

    try {
      await deleteJob(jobId);
      toast({
        title: "Success",
        description: "Job deleted successfully",
      });
    } catch (error) {
      console.error('Error deleting job:', error);
      toast({
        title: "Error",
        description: "Failed to delete job. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (showJobForm) {
    return (
      <JobForm 
        job={editingJob}
        onSave={handleSaveJob}
        onCancel={() => {
          setShowJobForm(false);
          setEditingJob(null);
        }}
      />
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Loading jobs...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="jobs">Jobs</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <AdminOverview 
            onEditJob={handleEditJob}
            onDeleteJob={handleDeleteJob}
            onCreateJob={handleCreateJob}
            jobs={jobs}
          />
        </TabsContent>

        <TabsContent value="jobs">
          <JobsTable 
            jobs={jobs}
            onEdit={handleEditJob}
            onDelete={handleDeleteJob}
          />
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Job Views</CardTitle>
                <Eye className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">12,543</div>
                <p className="text-xs text-muted-foreground">
                  +15% from last month
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Applications</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">1,247</div>
                <p className="text-xs text-muted-foreground">
                  +8% from last month
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">9.8%</div>
                <p className="text-xs text-muted-foreground">
                  +2.1% from last month
                </p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Performance Analytics</CardTitle>
              <CardDescription>
                Detailed insights coming soon...
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64 flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg">
                <p className="text-gray-500">Analytics charts will be implemented here</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings">
          <Card>
            <CardHeader>
              <CardTitle>Settings</CardTitle>
              <CardDescription>
                Manage your platform settings and preferences
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Auto-approve jobs</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Automatically approve new job postings
                    </p>
                  </div>
                  <Button variant="outline" size="sm">
                    Configure
                  </Button>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Email notifications</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Get notified about new applications
                    </p>
                  </div>
                  <Button variant="outline" size="sm">
                    Configure
                  </Button>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">API access</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Manage API keys and webhooks
                    </p>
                  </div>
                  <Button variant="outline" size="sm">
                    Configure
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminDashboard;
