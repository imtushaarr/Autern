import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { JobCard } from "@/components/JobCard";
import { FilterSection } from "@/components/FilterSection";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Job } from "@/data/jobs";
import { subscribeToJobs, FirebaseJob } from "@/services/jobsService";
import { Clock, TrendingUp, Calendar, ArrowLeft } from "lucide-react";

const LatestJobs = () => {
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [locationSearch, setLocationSearch] = useState("");
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Convert Firebase job to local job format
  const convertFirebaseJobToJob = (firebaseJob: FirebaseJob): Job => ({
    id: firebaseJob.id || Math.random().toString(),
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

  useEffect(() => {
    // Subscribe to real-time updates
    const unsubscribe = subscribeToJobs((firebaseJobs) => {
      const convertedJobs = firebaseJobs.map(convertFirebaseJobToJob);
      setJobs(convertedJobs);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Filter for latest jobs (posted in last 7 days or marked as recent)
  const latestJobs = jobs.filter(job => {
    const postedTime = job.postedTime.toLowerCase();
    return postedTime.includes('hour') || 
           postedTime.includes('minute') || 
           postedTime.includes('just now') ||
           postedTime.includes('1 day') ||
           postedTime.includes('2 day') ||
           postedTime.includes('3 day') ||
           postedTime.includes('4 day') ||
           postedTime.includes('5 day') ||
           postedTime.includes('6 day') ||
           postedTime.includes('1 week');
  });

  const filteredJobs = latestJobs.filter(job => {
    // Search term filter
    const matchesSearch = searchTerm === "" || 
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));

    // Location filter
    const matchesLocation = locationSearch === "" ||
      job.location.toLowerCase().includes(locationSearch.toLowerCase());

    // Filter tags/categories
    const matchesFilters = selectedFilters.length === 0 || selectedFilters.some(filter => {
      if (job.type === filter) return true;
      if (job.tags.includes(filter)) return true;
      
      if (filter.includes('$')) {
        const range = filter.replace('$', '').replace('k', '000').replace('+', '');
        if (range.includes('-')) {
          const [min, max] = range.split('-').map(Number);
          const jobSalary = job.salary.replace(/[$k,-]/g, '');
          const jobMin = parseInt(jobSalary.split('-')[0]) * 1000;
          const jobMax = parseInt(jobSalary.split('-')[1] || jobSalary) * 1000;
          return jobMin >= min * 1000 && jobMax <= max * 1000;
        } else {
          const minSalary = parseInt(range) * 1000;
          const jobSalary = job.salary.replace(/[$k,-]/g, '');
          const jobMin = parseInt(jobSalary.split('-')[0]) * 1000;
          return jobMin >= minSalary;
        }
      }

      return false;
    });

    return matchesSearch && matchesLocation && matchesFilters;
  });

  // Get trending job types from latest jobs
  const trendingTypes = latestJobs.reduce((acc, job) => {
    acc[job.type] = (acc[job.type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const topTrendingTypes = Object.entries(trendingTypes)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 3);

  return (
    <div className="min-h-screen bg-background">
      {/* Header Section */}
      <section className="py-12 px-6 bg-gradient-to-br from-primary/5 via-accent/5 to-background">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-4 mb-6">
            <Button 
              variant="ghost" 
              onClick={() => navigate("/")}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to All Jobs
            </Button>
          </div>
          
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Clock className="w-6 h-6 text-primary" />
              <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Latest Jobs
              </h1>
            </div>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Discover the newest job opportunities posted in the last week. Stay ahead with fresh openings from top companies.
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card className="bg-gradient-card backdrop-blur-sm border-border/50">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Latest Jobs</CardTitle>
                <TrendingUp className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{latestJobs.length}</div>
                <p className="text-xs text-muted-foreground">
                  Posted this week
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-card backdrop-blur-sm border-border/50">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Today's Posts</CardTitle>
                <Calendar className="h-4 w-4 text-accent" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {latestJobs.filter(job => 
                    job.postedTime.includes('hour') || 
                    job.postedTime.includes('minute') || 
                    job.postedTime.includes('just now')
                  ).length}
                </div>
                <p className="text-xs text-muted-foreground">
                  Posted today
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-card backdrop-blur-sm border-border/50">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Trending</CardTitle>
                <TrendingUp className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-lg font-bold">
                  {topTrendingTypes[0] ? topTrendingTypes[0][0] : 'N/A'}
                </div>
                <p className="text-xs text-muted-foreground">
                  Most popular type
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Trending Job Types */}
          {topTrendingTypes.length > 0 && (
            <div className="mb-8">
              <h3 className="text-lg font-semibold mb-4">Trending Job Types</h3>
              <div className="flex flex-wrap gap-2">
                {topTrendingTypes.map(([type, count]) => (
                  <Badge 
                    key={type}
                    variant="secondary" 
                    className="bg-primary/10 text-primary border-primary/20 cursor-pointer hover:bg-primary/20 transition-colors"
                    onClick={() => setSelectedFilters([type])}
                  >
                    {type} ({count})
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>
      
      {/* Jobs Section */}
      <section className="py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Filters Sidebar */}
            <div className="lg:col-span-1">
              <FilterSection 
                selectedFilters={selectedFilters}
                onFilterChange={setSelectedFilters}
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
                locationSearch={locationSearch}
                onLocationChange={setLocationSearch}
              />
            </div>
            
            {/* Jobs List */}
            <div className="lg:col-span-3">
              {loading ? (
                <div className="flex items-center justify-center h-64">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                    <p className="mt-2 text-muted-foreground">Loading latest jobs...</p>
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-semibold">
                      {filteredJobs.length} Latest Jobs Found
                    </h2>
                    <div className="text-sm text-muted-foreground">
                      Updated in real-time
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 2xl:grid-cols-3 gap-6">
                    {filteredJobs.map((job) => (
                      <div 
                        key={job.id}
                        onClick={() => navigate(`/job/${job.id}`)}
                        className="h-full"
                      >
                        <JobCard {...job} />
                      </div>
                    ))}
                  </div>
                </>
              )}
              
              {!loading && filteredJobs.length === 0 && (
                <div className="text-center py-12">
                  <Clock className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-lg text-muted-foreground mb-2">
                    {latestJobs.length === 0 
                      ? "No new jobs posted recently. Check back soon!" 
                      : "No latest jobs found matching your filters."
                    }
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Try adjusting your search criteria or check back later for new postings.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
      
      {/* Background decorative blur effects */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
        <div className="absolute top-1/4 left-10 w-64 h-64 bg-primary/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-10 w-80 h-80 bg-accent/5 rounded-full blur-3xl"></div>
      </div>
    </div>
  );
};

export default LatestJobs;
