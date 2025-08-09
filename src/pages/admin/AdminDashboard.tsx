import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Users, 
  TrendingUp, 
  Eye,
  Plus,
  Briefcase,
  Target,
  Activity
} from "lucide-react";
import { JobForm } from "@/components/admin/JobForm";
import { JobsTable } from "@/components/admin/JobsTable";
import { AdminOverview } from "@/components/admin/AdminOverview";
import { 
  getAllJobs, 
  createJob, 
  updateJob, 
  deleteJob, 
  subscribeToJobs,
  type FirebaseJob 
} from "@/services/jobsService";
import { useToast } from "@/hooks/use-toast";

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [showJobForm, setShowJobForm] = useState(false);
  const [editingJob, setEditingJob] = useState<FirebaseJob | null>(null);
  const [jobs, setJobs] = useState<FirebaseJob[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // Load jobs from Firebase on component mount
  useEffect(() => {
    const unsubscribe = subscribeToJobs((firebaseJobs) => {
      setJobs(firebaseJobs);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleEditJob = (job: FirebaseJob) => {
    setEditingJob(job);
    setShowJobForm(true);
  };

  const handleDeleteJob = async (jobId: string) => {
    try {
      await deleteJob(jobId);
      toast({
        title: "Success",
        description: "Job deleted successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete job",
        variant: "destructive",
      });
    }
  };

  const handleSaveJob = async (jobData: Partial<FirebaseJob>) => {
    try {
      if (editingJob && editingJob.id) {
        // Update existing job
        await updateJob(editingJob.id, jobData);
        toast({
          title: "Success",
          description: "Job updated successfully",
        });
      } else {
        // Create new job
        await createJob(jobData as Omit<FirebaseJob, 'id' | 'createdAt' | 'updatedAt' | 'postedTime'>);
        toast({
          title: "Success", 
          description: "Job created successfully",
        });
      }
      
      setShowJobForm(false);
      setEditingJob(null);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save job",
        variant: "destructive",
      });
    }
  };

  const handleCreateJob = () => {
    setEditingJob(null);
    setShowJobForm(true);
  };

  if (showJobForm) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              {editingJob ? 'Edit Job' : 'Create New Job'}
            </h1>
            <p className="text-muted-foreground">
              {editingJob ? 'Update job details and requirements' : 'Post a new job opportunity'}
            </p>
          </div>
        </div>
        
        <JobForm 
          job={editingJob}
          onSave={handleSaveJob}
          onCancel={() => {
            setShowJobForm(false);
            setEditingJob(null);
          }}
        />
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="h-12 w-12 rounded-full border-4 border-primary/20 border-t-primary animate-spin mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Admin Dashboard
          </h1>
          <p className="text-muted-foreground mt-2">
            Manage your job postings and track performance
          </p>
        </div>
        <Button 
          onClick={handleCreateJob}
          className="bg-gradient-primary hover:scale-105 transition-all duration-200 shadow-glow-primary"
        >
          <Plus className="h-4 w-4 mr-2" />
          Post New Job
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
        <TabsList className="grid w-full grid-cols-4 bg-card/50 backdrop-blur-sm p-1 rounded-xl">
          <TabsTrigger 
            value="overview" 
            className="data-[state=active]:bg-gradient-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-glow-primary transition-all duration-200"
          >
            <Activity className="h-4 w-4 mr-2" />
            Overview
          </TabsTrigger>
          <TabsTrigger 
            value="jobs"
            className="data-[state=active]:bg-gradient-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-glow-primary transition-all duration-200"
          >
            <Briefcase className="h-4 w-4 mr-2" />
            Jobs
          </TabsTrigger>
          <TabsTrigger 
            value="analytics"
            className="data-[state=active]:bg-gradient-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-glow-primary transition-all duration-200"
          >
            <TrendingUp className="h-4 w-4 mr-2" />
            Analytics
          </TabsTrigger>
          <TabsTrigger 
            value="settings"
            className="data-[state=active]:bg-gradient-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-glow-primary transition-all duration-200"
          >
            <Target className="h-4 w-4 mr-2" />
            Settings
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <AdminOverview 
            onEditJob={handleEditJob}
            onDeleteJob={handleDeleteJob}
            onCreateJob={handleCreateJob}
            jobs={jobs}
          />
        </TabsContent>

        <TabsContent value="jobs" className="space-y-6">
          <Card className="bg-card/50 backdrop-blur-sm border-border/50">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Briefcase className="h-5 w-5 text-primary" />
                    Job Management
                  </CardTitle>
                  <CardDescription>
                    Manage all your job postings in one place
                  </CardDescription>
                </div>
                <Button onClick={handleCreateJob} variant="outline">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Job
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <JobsTable 
                jobs={jobs}
                onEdit={handleEditJob}
                onDelete={handleDeleteJob}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="grid gap-6">
            <Card className="bg-card/50 backdrop-blur-sm border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-primary" />
                  Performance Analytics
                </CardTitle>
                <CardDescription>
                  Track your job posting performance and engagement
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="p-6 bg-gradient-to-br from-blue-500/10 to-blue-600/10 rounded-xl border border-blue-500/20">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-2 bg-blue-500/20 rounded-lg">
                        <Eye className="h-5 w-5 text-blue-600" />
                      </div>
                      <span className="font-medium">Total Views</span>
                    </div>
                    <p className="text-3xl font-bold mb-2">2,340</p>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className="bg-green-500/20 text-green-700 border-green-500/30">
                        +12%
                      </Badge>
                      <span className="text-sm text-muted-foreground">from last month</span>
                    </div>
                  </div>
                  
                  <div className="p-6 bg-gradient-to-br from-green-500/10 to-green-600/10 rounded-xl border border-green-500/20">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-2 bg-green-500/20 rounded-lg">
                        <Users className="h-5 w-5 text-green-600" />
                      </div>
                      <span className="font-medium">Applications</span>
                    </div>
                    <p className="text-3xl font-bold mb-2">156</p>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className="bg-green-500/20 text-green-700 border-green-500/30">
                        +8%
                      </Badge>
                      <span className="text-sm text-muted-foreground">from last month</span>
                    </div>
                  </div>
                  
                  <div className="p-6 bg-gradient-to-br from-purple-500/10 to-purple-600/10 rounded-xl border border-purple-500/20">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-2 bg-purple-500/20 rounded-lg">
                        <Target className="h-5 w-5 text-purple-600" />
                      </div>
                      <span className="font-medium">Conversion Rate</span>
                    </div>
                    <p className="text-3xl font-bold mb-2">6.7%</p>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className="bg-green-500/20 text-green-700 border-green-500/30">
                        +2.1%
                      </Badge>
                      <span className="text-sm text-muted-foreground">from last month</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <Card className="bg-card/50 backdrop-blur-sm border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5 text-primary" />
                Admin Settings
              </CardTitle>
              <CardDescription>
                Configure your admin preferences and system settings
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="flex items-center justify-between p-4 bg-gradient-to-r from-primary/5 to-accent/5 rounded-xl border border-primary/20">
                  <div>
                    <h3 className="font-semibold">Email Notifications</h3>
                    <p className="text-sm text-muted-foreground">
                      Get notified about new applications and system updates
                    </p>
                  </div>
                  <Button variant="outline" size="sm">
                    Configure
                  </Button>
                </div>
                
                <div className="flex items-center justify-between p-4 bg-gradient-to-r from-accent/5 to-primary/5 rounded-xl border border-accent/20">
                  <div>
                    <h3 className="font-semibold">API Access</h3>
                    <p className="text-sm text-muted-foreground">
                      Manage API keys, webhooks, and integrations
                    </p>
                  </div>
                  <Button variant="outline" size="sm">
                    Manage
                  </Button>
                </div>

                <div className="flex items-center justify-between p-4 bg-gradient-to-r from-primary/5 to-accent/5 rounded-xl border border-primary/20">
                  <div>
                    <h3 className="font-semibold">Security Settings</h3>
                    <p className="text-sm text-muted-foreground">
                      Two-factor authentication and access controls
                    </p>
                  </div>
                  <Button variant="outline" size="sm">
                    Security
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
