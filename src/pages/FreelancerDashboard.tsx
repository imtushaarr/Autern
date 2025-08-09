import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Star, 
  MapPin, 
  Clock, 
  DollarSign, 
  Briefcase, 
  Edit,
  Plus,
  Eye,
  MessageCircle,
  TrendingUp,
  Calendar,
  Award,
  User
} from 'lucide-react';
import { FreelancerProfile, Project, Proposal } from '@/types/freelancing';
import { freelancerService, projectService, proposalService } from '@/services/freelancingService';
import { useAuth } from '@/hooks/useAuth';

const FreelancerDashboard = () => {
  const { currentUser } = useAuth();
  const [profile, setProfile] = useState<FreelancerProfile | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  const loadFreelancerData = useCallback(async () => {
    if (!currentUser) return;
    
    try {
      setLoading(true);
      
      // Load freelancer profile
      const freelancerProfile = await freelancerService.getProfileByUserId(currentUser.uid);
      setProfile(freelancerProfile);
      
      // Load proposals
      if (freelancerProfile) {
        const userProposals = await proposalService.getFreelancerProposals(freelancerProfile.id);
        setProposals(userProposals);
      }
      
      // Load available projects (for browsing)
      const { projects: availableProjects } = await projectService.searchProjects({}, undefined, 5);
      setProjects(availableProjects);
      
    } catch (error) {
      console.error('Error loading freelancer data:', error);
    } finally {
      setLoading(false);
    }
  }, [currentUser]);

  useEffect(() => {
    if (currentUser) {
      loadFreelancerData();
    }
  }, [currentUser, loadFreelancerData]);

  const OverviewTab = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {/* Stats Cards */}
      <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border-blue-200 dark:border-blue-800">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Active Proposals</CardTitle>
          <Briefcase className="h-4 w-4 text-blue-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-blue-600">
            {proposals.filter(p => p.status === 'pending').length}
          </div>
          <p className="text-xs text-muted-foreground">
            +2 from last month
          </p>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 border-green-200 dark:border-green-800">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Completed Projects</CardTitle>
          <Award className="h-4 w-4 text-green-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-600">
            {profile?.completedProjects || 0}
          </div>
          <p className="text-xs text-muted-foreground">
            98% success rate
          </p>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 border-purple-200 dark:border-purple-800">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Earnings</CardTitle>
          <DollarSign className="h-4 w-4 text-purple-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-purple-600">
            ${((profile?.completedProjects || 0) * (profile?.hourlyRate || 0) * 20).toLocaleString()}
          </div>
          <p className="text-xs text-muted-foreground">
            This month
          </p>
        </CardContent>
      </Card>

      {/* Profile Summary */}
      <Card className="md:col-span-2 lg:col-span-3">
        <CardHeader>
          <CardTitle>Profile Summary</CardTitle>
        </CardHeader>
        <CardContent>
          {profile ? (
            <div className="flex items-start space-x-4">
              <Avatar className="h-16 w-16">
                <AvatarImage src={profile.profileImage} />
                <AvatarFallback>
                  <User className="h-8 w-8" />
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <h3 className="text-xl font-semibold">{profile.title}</h3>
                <p className="text-muted-foreground mb-3">{profile.description}</p>
                <div className="flex flex-wrap gap-2 mb-3">
                  {profile.skills.slice(0, 5).map((skill, index) => (
                    <Badge key={index} variant="secondary">{skill}</Badge>
                  ))}
                  {profile.skills.length > 5 && (
                    <Badge variant="outline">+{profile.skills.length - 5} more</Badge>
                  )}
                </div>
                <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                  <div className="flex items-center">
                    <Star className="h-4 w-4 text-yellow-500 mr-1" />
                    {profile.rating.toFixed(1)} ({profile.completedProjects} reviews)
                  </div>
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 mr-1" />
                    {profile.location}
                  </div>
                  <div className="flex items-center">
                    <DollarSign className="h-4 w-4 mr-1" />
                    ${profile.hourlyRate}/hr
                  </div>
                </div>
              </div>
              <Button variant="outline" size="sm">
                <Edit className="h-4 w-4 mr-2" />
                Edit Profile
              </Button>
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-muted-foreground mb-4">Complete your freelancer profile to start receiving projects</p>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Create Profile
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card className="md:col-span-2 lg:col-span-3">
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {proposals.slice(0, 3).map((proposal) => (
              <div key={proposal.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <h4 className="font-medium">Proposal submitted</h4>
                  <p className="text-sm text-muted-foreground">
                    Project: {proposal.projectId} • ${proposal.proposedRate}/hr
                  </p>
                </div>
                <Badge 
                  variant={proposal.status === 'pending' ? 'default' : 
                           proposal.status === 'accepted' ? 'default' : 'secondary'}
                  className={proposal.status === 'accepted' ? 'bg-green-100 text-green-800' : ''}
                >
                  {proposal.status}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const ProjectsTab = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Available Projects</h2>
        <div className="flex space-x-2">
          <Input placeholder="Search projects..." className="w-64" />
          <Button variant="outline">Filters</Button>
        </div>
      </div>

      <div className="grid gap-6">
        {projects.map((project) => (
          <Card key={project.id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">{project.title}</CardTitle>
                  <CardDescription className="mt-2">{project.description}</CardDescription>
                </div>
                <Badge variant={project.experienceLevel === 'expert' ? 'default' : 'secondary'}>
                  {project.experienceLevel}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex flex-wrap gap-2">
                  {project.skillsRequired.map((skill, index) => (
                    <Badge key={index} variant="outline">{skill}</Badge>
                  ))}
                </div>
                
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center">
                      <DollarSign className="h-4 w-4 mr-1" />
                      ${project.budget.min} - ${project.budget.max}
                    </div>
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-1" />
                      {project.duration}
                    </div>
                    <div className="flex items-center">
                      <Briefcase className="h-4 w-4 mr-1" />
                      {project.proposals?.length || 0} proposals
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm">
                      <Eye className="h-4 w-4 mr-2" />
                      View Details
                    </Button>
                    <Button size="sm">
                      Submit Proposal
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  const ProposalsTab = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">My Proposals</h2>
        <div className="flex space-x-2">
          <Select defaultValue="all">
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="accepted">Accepted</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid gap-4">
        {proposals.map((proposal) => (
          <Card key={proposal.id}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">Project: {proposal.projectId}</CardTitle>
                  <CardDescription className="mt-2">
                    Proposed Rate: ${proposal.proposedRate}/hr • Duration: {proposal.estimatedDuration}
                  </CardDescription>
                </div>
                <Badge 
                  variant={proposal.status === 'pending' ? 'default' : 
                           proposal.status === 'accepted' ? 'default' : 'secondary'}
                  className={proposal.status === 'accepted' ? 'bg-green-100 text-green-800' : 
                            proposal.status === 'rejected' ? 'bg-red-100 text-red-800' : ''}
                >
                  {proposal.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">{proposal.coverLetter}</p>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">
                  Submitted {new Date(proposal.createdAt).toLocaleDateString()}
                </span>
                <div className="flex space-x-2">
                  {proposal.status === 'accepted' && (
                    <Button size="sm" variant="outline">
                      <MessageCircle className="h-4 w-4 mr-2" />
                      Message Client
                    </Button>
                  )}
                  <Button variant="outline" size="sm">
                    View Details
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Freelancer Dashboard</h1>
        <p className="text-muted-foreground">Manage your freelancing career</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="projects">Find Projects</TabsTrigger>
          <TabsTrigger value="proposals">My Proposals</TabsTrigger>
          <TabsTrigger value="profile">Profile</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-6">
          <OverviewTab />
        </TabsContent>

        <TabsContent value="projects" className="mt-6">
          <ProjectsTab />
        </TabsContent>

        <TabsContent value="proposals" className="mt-6">
          <ProposalsTab />
        </TabsContent>

        <TabsContent value="profile" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Profile Settings</CardTitle>
              <CardDescription>Update your freelancer profile</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="title">Professional Title</Label>
                  <Input 
                    id="title" 
                    placeholder="e.g., Full Stack Developer" 
                    value={profile?.title || ''} 
                  />
                </div>
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea 
                    id="description" 
                    placeholder="Describe your skills and experience..." 
                    value={profile?.description || ''} 
                  />
                </div>
                <div>
                  <Label htmlFor="hourlyRate">Hourly Rate ($)</Label>
                  <Input 
                    id="hourlyRate" 
                    type="number" 
                    placeholder="50" 
                    value={profile?.hourlyRate || ''} 
                  />
                </div>
                <Button>Save Changes</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default FreelancerDashboard;
