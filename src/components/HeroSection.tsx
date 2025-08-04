import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Briefcase, Users, TrendingUp } from "lucide-react";

export const HeroSection = () => {
  return (
    <section className="relative min-h-[70vh] flex items-center justify-center overflow-hidden">
      {/* Background blur effects */}
      <div className="absolute inset-0 bg-gradient-hero">
        <div className="absolute top-20 left-20 w-72 h-72 bg-primary/30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-accent/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-primary/20 rounded-full blur-2xl"></div>
      </div>
      
      {/* Content */}
      <div className="relative z-10 text-center max-w-4xl mx-auto px-6">
        <div className="space-y-6">
          <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-primary via-accent to-primary-glow bg-clip-text text-transparent leading-tight">
            Find Your Dream Job
          </h1>
          
          <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Discover thousands of opportunities from top companies. Your next career move starts here.
          </p>
          
          {/* Search Bar */}
          <div className="max-w-2xl mx-auto mt-8">
            <div className="flex flex-col md:flex-row gap-4 p-2 bg-card/50 backdrop-blur-md rounded-2xl border border-border/50 shadow-elegant">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
                <Input 
                  placeholder="Job title, keywords, or company"
                  className="pl-10 border-0 bg-transparent text-lg h-12 focus:ring-0"
                />
              </div>
              <div className="relative flex-1">
                <Input 
                  placeholder="Location"
                  className="border-0 bg-transparent text-lg h-12 focus:ring-0"
                />
              </div>
              <Button variant="hero" size="lg" className="h-12 px-8">
                Search Jobs
              </Button>
            </div>
          </div>
          
          {/* Stats */}
          <div className="flex flex-wrap justify-center gap-8 mt-12">
            <div className="flex items-center space-x-2 text-sm">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Briefcase className="w-5 h-5 text-primary" />
              </div>
              <div>
                <div className="font-semibold text-foreground">10,000+</div>
                <div className="text-muted-foreground">Active Jobs</div>
              </div>
            </div>
            
            <div className="flex items-center space-x-2 text-sm">
              <div className="p-2 bg-accent/10 rounded-lg">
                <Users className="w-5 h-5 text-accent" />
              </div>
              <div>
                <div className="font-semibold text-foreground">5,000+</div>
                <div className="text-muted-foreground">Companies</div>
              </div>
            </div>
            
            <div className="flex items-center space-x-2 text-sm">
              <div className="p-2 bg-primary-glow/10 rounded-lg">
                <TrendingUp className="w-5 h-5 text-primary-glow" />
              </div>
              <div>
                <div className="font-semibold text-foreground">95%</div>
                <div className="text-muted-foreground">Success Rate</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};