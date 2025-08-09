import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { 
  Search, 
  Filter, 
  Star, 
  MapPin, 
  Grid3X3, 
  List,
  SlidersHorizontal
} from 'lucide-react';
import { FreelancerProfile } from '@/types/freelancing';
import { freelancerService } from '@/services/freelancingService';
import FreelancerCard from '@/components/FreelancerCard';

const categories = [
  'Web Development',
  'Mobile Development',
  'UI/UX Design',
  'Data Science',
  'Digital Marketing',
  'Writing & Translation',
  'Video & Animation',
  'Music & Audio',
  'Programming & Tech',
  'Business'
];

const skills = [
  'React', 'Node.js', 'Python', 'JavaScript', 'TypeScript', 'PHP', 'Java',
  'UI/UX Design', 'Figma', 'Adobe Creative Suite', 'WordPress', 'Shopify',
  'SEO', 'Content Writing', 'Social Media', 'Data Analysis', 'Machine Learning'
];

const FreelancerBrowsePage = () => {
  const [freelancers, setFreelancers] = useState<FreelancerProfile[]>([]);
  const [filteredFreelancers, setFilteredFreelancers] = useState<FreelancerProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);
  
  // Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [hourlyRateRange, setHourlyRateRange] = useState([0, 200]);
  const [minRating, setMinRating] = useState(0);
  const [availability, setAvailability] = useState('');
  const [location, setLocation] = useState('');

  const applyFilters = useCallback(() => {
    let filtered = [...freelancers];

    // Search term filter
    if (searchTerm) {
      filtered = filtered.filter(freelancer =>
        freelancer.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        freelancer.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        freelancer.skills.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Skills filter
    if (selectedSkills.length > 0) {
      filtered = filtered.filter(freelancer =>
        selectedSkills.some(skill => freelancer.skills.includes(skill))
      );
    }

    // Hourly rate filter
    filtered = filtered.filter(freelancer =>
      freelancer.hourlyRate >= hourlyRateRange[0] && freelancer.hourlyRate <= hourlyRateRange[1]
    );

    // Rating filter
    if (minRating > 0) {
      filtered = filtered.filter(freelancer => freelancer.rating >= minRating);
    }

    // Availability filter
    if (availability && availability !== 'any') {
      filtered = filtered.filter(freelancer => freelancer.availability === availability);
    }

    // Location filter
    if (location) {
      filtered = filtered.filter(freelancer =>
        freelancer.location.toLowerCase().includes(location.toLowerCase())
      );
    }

    setFilteredFreelancers(filtered);
  }, [searchTerm, selectedSkills, hourlyRateRange, minRating, availability, location, freelancers]);

  useEffect(() => {
    loadFreelancers();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [applyFilters]);

    const loadFreelancers = async () => {
    try {
      setLoading(true);
      
      // Try to load from Firebase first
      try {
        const data = await freelancerService.searchFreelancers({});
        setFreelancers(data.freelancers);
      } catch (error) {
        console.warn('Could not load from Firebase, using sample data:', error);
        
        // Use sample data as fallback
        const sampleData: FreelancerProfile[] = [
          {
            id: '1',
            userId: 'user1',
            title: 'Full Stack Developer',
            description: 'Experienced developer with React and Node.js',
            skills: ['React', 'Node.js', 'TypeScript'],
            hourlyRate: 75,
            availability: 'available' as const,
            rating: 4.8,
            completedProjects: 32,
            portfolio: [],
            languages: [],
            education: [],
            experience: [],
            location: 'San Francisco, CA',
            responseTime: 'within 1 hour',
            createdAt: new Date(),
            updatedAt: new Date()
          },
          {
            id: '2',
            userId: 'user2',
            title: 'UI/UX Designer',
            description: 'Creative designer specializing in modern interfaces',
            skills: ['Figma', 'Adobe XD', 'Prototyping'],
            hourlyRate: 65,
            availability: 'available' as const,
            rating: 4.9,
            completedProjects: 28,
            portfolio: [],
            languages: [],
            education: [],
            experience: [],
            location: 'New York, NY',
            responseTime: 'within 2 hours',
            createdAt: new Date(),
            updatedAt: new Date()
          },
          {
            id: '3',
            userId: 'user3',
            title: 'Data Scientist',
            description: 'Machine learning expert with Python and R',
            skills: ['Python', 'Machine Learning', 'TensorFlow'],
            hourlyRate: 85,
            availability: 'busy' as const,
            rating: 4.7,
            completedProjects: 22,
            portfolio: [],
            languages: [],
            education: [],
            experience: [],
            location: 'Seattle, WA',
            responseTime: 'within 4 hours',
            createdAt: new Date(),
            updatedAt: new Date()
          }
        ];
        
        setFreelancers(sampleData);
      }
    } catch (error) {
      console.error('Error loading freelancers:', error);
    } finally {
      setLoading(false);
    }
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedCategory('');
    setSelectedSkills([]);
    setHourlyRateRange([0, 200]);
    setMinRating(0);
    setAvailability('any');
    setLocation('');
  };

  const toggleSkill = (skill: string) => {
    setSelectedSkills(prev =>
      prev.includes(skill)
        ? prev.filter(s => s !== skill)
        : [...prev, skill]
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto py-8">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-primary/10 via-accent/10 to-background border-b">
        <div className="container mx-auto py-12">
          <div className="max-w-3xl mx-auto text-center space-y-4">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Find Top Freelancers
            </h1>
            <p className="text-xl text-muted-foreground">
              Connect with skilled professionals for your next project
            </p>
            
            {/* Search Bar */}
            <div className="relative max-w-2xl mx-auto">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                placeholder="Search freelancers by skills, title, or expertise..."
                className="pl-12 pr-4 py-3 text-lg border-border/50 bg-background/80 backdrop-blur-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto py-8">
        <div className="flex gap-8">
          {/* Filters Sidebar */}
          <div className={`w-80 space-y-6 ${showFilters ? 'block' : 'hidden lg:block'}`}>
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Filters</CardTitle>
                  <Button variant="ghost" size="sm" onClick={clearFilters}>
                    Clear All
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Category Filter */}
                <div>
                  <Label className="text-sm font-medium">Category</Label>
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger className="mt-2">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map(category => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Skills Filter */}
                <div>
                  <Label className="text-sm font-medium">Skills</Label>
                  <div className="mt-2 flex flex-wrap gap-2 max-h-32 overflow-y-auto">
                    {skills.map(skill => (
                      <Badge
                        key={skill}
                        variant={selectedSkills.includes(skill) ? 'default' : 'outline'}
                        className="cursor-pointer"
                        onClick={() => toggleSkill(skill)}
                      >
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Hourly Rate Filter */}
                <div>
                  <Label className="text-sm font-medium">
                    Hourly Rate: ${hourlyRateRange[0]} - ${hourlyRateRange[1]}
                  </Label>
                  <Slider
                    value={hourlyRateRange}
                    onValueChange={setHourlyRateRange}
                    max={200}
                    min={0}
                    step={5}
                    className="mt-3"
                  />
                </div>

                {/* Rating Filter */}
                <div>
                  <Label className="text-sm font-medium">Minimum Rating</Label>
                  <Select value={minRating.toString()} onValueChange={(value) => setMinRating(Number(value))}>
                    <SelectTrigger className="mt-2">
                      <SelectValue placeholder="Any rating" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0">Any rating</SelectItem>
                      <SelectItem value="3">3+ stars</SelectItem>
                      <SelectItem value="4">4+ stars</SelectItem>
                      <SelectItem value="4.5">4.5+ stars</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Availability Filter */}
                <div>
                  <Label className="text-sm font-medium">Availability</Label>
                  <Select value={availability} onValueChange={setAvailability}>
                    <SelectTrigger className="mt-2">
                      <SelectValue placeholder="Any availability" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="any">Any availability</SelectItem>
                      <SelectItem value="available">Available</SelectItem>
                      <SelectItem value="busy">Busy</SelectItem>
                      <SelectItem value="unavailable">Unavailable</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Location Filter */}
                <div>
                  <Label className="text-sm font-medium">Location</Label>
                  <Input
                    placeholder="Enter location"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="mt-2"
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Results Header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold">
                  {filteredFreelancers.length} Freelancers Found
                </h2>
                <p className="text-muted-foreground">
                  Showing results for your search criteria
                </p>
              </div>
              
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowFilters(!showFilters)}
                  className="lg:hidden"
                >
                  <SlidersHorizontal className="h-4 w-4 mr-2" />
                  Filters
                </Button>
                
                <div className="flex border rounded-md">
                  <Button
                    variant={viewMode === 'grid' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setViewMode('grid')}
                    className="rounded-r-none"
                  >
                    <Grid3X3 className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={viewMode === 'list' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setViewMode('list')}
                    className="rounded-l-none"
                  >
                    <List className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Freelancers Grid/List */}
            {filteredFreelancers.length > 0 ? (
              <div className={
                viewMode === 'grid' 
                  ? 'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6'
                  : 'space-y-4'
              }>
                {filteredFreelancers.map((freelancer) => (
                  <FreelancerCard
                    key={freelancer.id}
                    freelancer={freelancer}
                    onViewProfile={(freelancer) => console.log('View profile:', freelancer)}
                    onContact={(freelancer) => console.log('Contact:', freelancer)}
                    onHire={(freelancer) => console.log('Hire:', freelancer)}
                  />
                ))}
              </div>
            ) : (
              <Card className="text-center py-12">
                <CardContent>
                  <div className="space-y-4">
                    <div className="w-16 h-16 mx-auto rounded-full bg-muted flex items-center justify-center">
                      <Search className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold">No freelancers found</h3>
                      <p className="text-muted-foreground">
                        Try adjusting your search criteria or filters
                      </p>
                    </div>
                    <Button onClick={clearFilters}>Clear Filters</Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FreelancerBrowsePage;
