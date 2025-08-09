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
  Plus,
  Eye,
  MessageCircle,
  TrendingUp,
  Users,
  Search,
  Filter,
  User
} from 'lucide-react';
import { FreelancerProfile, Project, Proposal } from '@/types/freelancing';
import { freelancerService, projectService, proposalService } from '@/services/freelancingService';
import { useAuth } from '@/hooks/useAuth';

const ClientDashboard = () => {
  const { currentUser } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [freelancers, setFreelancers] = useState<FreelancerProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [searchTerm, setSearchTerm] = useState('');

  const loadClientData = useCallback(async () => {
    if (!currentUser) return;
    
    try {
      setLoading(true);
      
      // Load client's projects
      const clientProjects = await projectService.getClientProjects(currentUser.uid);
      setProjects(clientProjects);
      
      // Load freelancers for browsing
      const { freelancers: topFreelancers } = await freelancerService.searchFreelancers({}, undefined, 8);
      setFreelancers(topFreelancers);
      
    } catch (error) {
      console.error('Error loading client data:', error);
    } finally {
      setLoading(false);
    }
  }, [currentUser]);

  useEffect(() => {
    if (currentUser) {
      loadClientData();
    }
  }, [currentUser, loadClientData]);

  const OverviewTab = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {/* Stats Cards */}
      <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border-blue-200 dark:border-blue-800">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Active Projects</CardTitle>
          <Briefcase className="h-4 w-4 text-blue-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-blue-600">
            {projects.filter(p => p.status === 'in_progress').length}
          </div>
          <p className="text-xs text-muted-foreground">
            +2 from last month
          </p>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 border-green-200 dark:border-green-800">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Proposals</CardTitle>
          <Users className="h-4 w-4 text-green-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-600">
            {projects.reduce((acc, project) => acc + (project.proposals?.length || 0), 0)}
          </div>
          <p className="text-xs text-muted-foreground">
            Across all projects
          </p>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 border-purple-200 dark:border-purple-800">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Budget Spent</CardTitle>
          <DollarSign className="h-4 w-4 text-purple-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-purple-600">
            ${projects.filter(p => p.status === 'completed').reduce((acc, p) => acc + p.budget.max, 0).toLocaleString()}
          </div>
          <p className="text-xs text-muted-foreground">
            This year
          </p>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 border-orange-200 dark:border-orange-800">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
          <TrendingUp className="h-4 w-4 text-orange-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-orange-600">98%</div>
          <p className="text-xs text-muted-foreground">
            Project completion
          </p>
        </CardContent>
      </Card>

      {/* Recent Projects */}
      <Card className="md:col-span-2 lg:col-span-4">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Recent Projects</CardTitle>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Post New Project
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {projects.slice(0, 3).map((project) => (
              <div key={project.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex-1">
                  <h4 className="font-medium">{project.title}</h4>
                  <p className="text-sm text-muted-foreground">{project.description.substring(0, 100)}...</p>
                  <div className="flex items-center space-x-4 mt-2 text-sm text-muted-foreground">
                    <span>${project.budget.min} - ${project.budget.max}</span>
                    <span>{project.proposals?.length || 0} proposals</span>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge 
                    variant={project.status === 'open' ? 'default' : 
                             project.status === 'in_progress' ? 'secondary' : 'outline'}
                  >
                    {project.status}
                  </Badge>
                  <Button variant="outline" size="sm">
                    <Eye className="h-4 w-4 mr-2" />
                    View
                  </Button>
                </div>
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
        <h2 className="text-2xl font-bold">My Projects</h2>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Post New Project
        </Button>
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
                <Badge 
                  variant={project.status === 'open' ? 'default' : 
                           project.status === 'in_progress' ? 'secondary' : 'outline'}
                >
                  {project.status}
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
                      <Users className="h-4 w-4 mr-1" />
                      {project.proposals?.length || 0} proposals
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm">
                      View Proposals
                    </Button>
                    {project.status === 'in_progress' && (
                      <Button variant="outline" size="sm">
                        <MessageCircle className="h-4 w-4 mr-2" />
                        Message Freelancer
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  const FreelancersTab = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Find Freelancers</h2>
        <div className="flex space-x-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search by skills..." 
              className="pl-10 w-64"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button variant="outline">
            <Filter className="h-4 w-4 mr-2" />
            Filters
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {freelancers.map((freelancer) => (
          <Card key={freelancer.id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex items-start space-x-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage src={freelancer.profileImage} />
                  <AvatarFallback>
                    <User className="h-8 w-8" />
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <CardTitle className="text-lg">{freelancer.title}</CardTitle>
                  <div className="flex items-center space-x-2 mt-1">
                    <div className="flex items-center">
                      <Star className="h-4 w-4 text-yellow-500 mr-1" />
                      <span className="text-sm">{freelancer.rating.toFixed(1)}</span>
                    </div>
                    <Badge 
                      variant={freelancer.availability === 'available' ? 'default' : 'secondary'}
                      className={freelancer.availability === 'available' ? 'bg-green-100 text-green-800' : ''}
                    >
                      {freelancer.availability}
                    </Badge>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                {freelancer.description}
              </p>
              
              <div className="flex flex-wrap gap-1 mb-3">
                {freelancer.skills.slice(0, 3).map((skill, index) => (
                  <Badge key={index} variant="outline" className="text-xs">{skill}</Badge>
                ))}
                {freelancer.skills.length > 3 && (
                  <Badge variant="outline" className="text-xs">+{freelancer.skills.length - 3}</Badge>
                )}
              </div>
              
              <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                <div className="flex items-center">
                  <MapPin className="h-4 w-4 mr-1" />
                  {freelancer.location}
                </div>
                <div className="flex items-center">
                  <DollarSign className="h-4 w-4 mr-1" />
                  ${freelancer.hourlyRate}/hr
                </div>
              </div>
              
              <div className="flex space-x-2">
                <Button variant="outline" size="sm" className="flex-1">
                  View Profile
                </Button>
                <Button size="sm" className="flex-1">
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Contact
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  const PostProjectTab = () => (
    <div className="max-w-2xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Post a New Project</CardTitle>
          <CardDescription>Describe your project to attract the best freelancers</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <Label htmlFor="title">Project Title</Label>
            <Input id="title" placeholder="e.g., Build a React Dashboard" />
          </div>
          
          <div>
            <Label htmlFor="category">Category</Label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="web-development">Web Development</SelectItem>
                <SelectItem value="mobile-development">Mobile Development</SelectItem>
                <SelectItem value="design">Design</SelectItem>
                <SelectItem value="writing">Writing</SelectItem>
                <SelectItem value="marketing">Marketing</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="description">Project Description</Label>
            <Textarea 
              id="description" 
              placeholder="Describe your project in detail..."
              className="min-h-[100px]"
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="budget-type">Budget Type</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select budget type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="fixed">Fixed Price</SelectItem>
                  <SelectItem value="hourly">Hourly Rate</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="experience">Experience Level</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="entry">Entry Level</SelectItem>
                  <SelectItem value="intermediate">Intermediate</SelectItem>
                  <SelectItem value="expert">Expert</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="budget-min">Budget Range (Min)</Label>
              <Input id="budget-min" type="number" placeholder="500" />
            </div>
            <div>
              <Label htmlFor="budget-max">Budget Range (Max)</Label>
              <Input id="budget-max" type="number" placeholder="2000" />
            </div>
          </div>
          
          <div>
            <Label htmlFor="duration">Project Duration</Label>
            <Input id="duration" placeholder="e.g., 2-3 weeks" />
          </div>
          
          <div>
            <Label htmlFor="skills">Required Skills</Label>
            <Input id="skills" placeholder="React, Node.js, MongoDB (comma separated)" />
          </div>
          
          <Button className="w-full">
            Post Project
          </Button>
        </CardContent>
      </Card>
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
        <h1 className="text-3xl font-bold">Client Dashboard</h1>
        <p className="text-muted-foreground">Manage your projects and find talented freelancers</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="projects">My Projects</TabsTrigger>
          <TabsTrigger value="freelancers">Find Talent</TabsTrigger>
          <TabsTrigger value="post">Post Project</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-6">
          <OverviewTab />
        </TabsContent>

        <TabsContent value="projects" className="mt-6">
          <ProjectsTab />
        </TabsContent>

        <TabsContent value="freelancers" className="mt-6">
          <FreelancersTab />
        </TabsContent>

        <TabsContent value="post" className="mt-6">
          <PostProjectTab />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ClientDashboard;
