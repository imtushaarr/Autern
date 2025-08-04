import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { HeroSection } from "@/components/HeroSection";
import { JobCard } from "@/components/JobCard";
import { FilterSection } from "@/components/FilterSection";
import { jobsData } from "@/data/jobs";

const Index = () => {
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  const navigate = useNavigate();
  
  const filteredJobs = jobsData.filter(job => {
    if (selectedFilters.length === 0) return true;
    
    return selectedFilters.some(filter => 
      job.type === filter || 
      job.tags.includes(filter) ||
      (filter.includes('$') && job.salary.includes(filter.split('-')[0].replace('$', '').replace('k', '')))
    );
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
              />
            </div>
            
            {/* Jobs List */}
            <div className="lg:col-span-3">
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredJobs.map((job) => (
                  <div 
                    key={job.id}
                    onClick={() => navigate(`/job/${job.id}`)}
                  >
                    <JobCard {...job} />
                  </div>
                ))}
              </div>
              
              {filteredJobs.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-lg text-muted-foreground">
                    No jobs found matching your filters. Try adjusting your search criteria.
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
