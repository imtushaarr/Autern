import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { HeroSection } from "@/components/HeroSection";
import { JobCard } from "@/components/JobCard";
import { FilterSection } from "@/components/FilterSection";
import { Job } from "@/data/jobs";
import { subscribeToJobs, FirebaseJob } from "@/services/jobsService";

const Index = () => {
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
  
  const filteredJobs = jobs.filter(job => {
    // Search term filter (title, company, description, tags)
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
      // Job type filter
      if (job.type === filter) return true;
      
      // Tags/skills filter
      if (job.tags.includes(filter)) return true;
      
      // Salary range filter
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

  return (
    <div className="min-h-screen bg-background">..
      {/* Hero Section */}
      <HeroSection />
      
      {/* Jobs Section */}
      <section className="py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Latest Job Opportunities
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Discover amazing career opportunities from top companies around the world
            </p>
          </div>
          
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
                    <p className="mt-2 text-muted-foreground">Loading jobs...</p>
                  </div>
                </div>
              ) : (
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
              )}
              
              {!loading && filteredJobs.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-lg text-muted-foreground">
                    {jobs.length === 0 
                      ? "No jobs available yet. Check back soon!" 
                      : "No jobs found matching your filters. Try adjusting your search criteria."
                    }
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

export default Index;
