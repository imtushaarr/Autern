import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Filter, SlidersHorizontal, Search, MapPin, Briefcase } from "lucide-react";

interface FilterSectionProps {
  selectedFilters: string[];
  onFilterChange: (filters: string[]) => void;
  searchTerm: string;
  onSearchChange: (search: string) => void;
  locationSearch: string;
  onLocationChange: (location: string) => void;
}

export const FilterSection = ({ 
  selectedFilters, 
  onFilterChange, 
  searchTerm, 
  onSearchChange,
  locationSearch,
  onLocationChange
}: FilterSectionProps) => {
  const jobTypes = ["Full-time", "Part-time", "Contract", "Remote", "Internship"];
  const experienceLevels = ["Entry Level", "Mid Level", "Senior Level", "Executive"];
  const salaryRanges = ["$40k-60k", "$60k-80k", "$80k-100k", "$100k+"];
  const popularLocations = ["San Francisco, CA", "New York, NY", "Remote", "Austin, TX", "Seattle, WA", "Chicago, IL"];
  const popularSkills = ["React", "TypeScript", "JavaScript", "Python", "Node.js", "AWS", "Docker", "Kubernetes"];

  const toggleFilter = (filter: string) => {
    if (selectedFilters.includes(filter)) {
      onFilterChange(selectedFilters.filter(f => f !== filter));
    } else {
      onFilterChange([...selectedFilters, filter]);
    }
  };

  const clearAllFilters = () => {
    onFilterChange([]);
    onSearchChange("");
    onLocationChange("");
  };

  return (
    <Card className="p-6 bg-gradient-card backdrop-blur-sm border-border/50 sticky top-6">
      <div className="flex items-center space-x-2 mb-6">
        <SlidersHorizontal className="w-5 h-5 text-primary" />
        <h3 className="text-lg font-semibold">Search & Filters</h3>
      </div>
      
      <div className="space-y-6">
        {/* Search Input */}
        <div>
          <Label htmlFor="search" className="text-sm font-medium mb-2 block">
            Job Title or Keywords
          </Label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              id="search"
              type="text"
              placeholder="e.g. Frontend Developer, Marketing..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Location Search */}
        <div>
          <Label htmlFor="location" className="text-sm font-medium mb-2 block">
            Location
          </Label>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              id="location"
              type="text"
              placeholder="e.g. San Francisco, Remote..."
              value={locationSearch}
              onChange={(e) => onLocationChange(e.target.value)}
              className="pl-10"
            />
          </div>
          {/* Popular Locations */}
          <div className="mt-2">
            <div className="flex flex-wrap gap-1">
              {popularLocations.slice(0, 4).map((location) => (
                <Badge
                  key={location}
                  variant="outline"
                  className="cursor-pointer text-xs hover:bg-primary/10 transition-colors"
                  onClick={() => onLocationChange(location)}
                >
                  {location}
                </Badge>
              ))}
            </div>
          </div>
        </div>

        {/* Job Type */}
        <div>
          <h4 className="font-medium mb-3 text-foreground flex items-center gap-2">
            <Briefcase className="w-4 h-4" />
            Job Type
          </h4>
          <div className="space-y-2">
            {jobTypes.map((type) => (
              <Badge
                key={type}
                variant={selectedFilters.includes(type) ? "default" : "outline"}
                className="cursor-pointer block w-full text-left justify-start hover:bg-primary/10 transition-colors"
                onClick={() => toggleFilter(type)}
              >
                {type}
              </Badge>
            ))}
          </div>
        </div>

        {/* Popular Skills */}
        <div>
          <h4 className="font-medium mb-3 text-foreground">Popular Skills</h4>
          <div className="flex flex-wrap gap-1.5">
            {popularSkills.map((skill) => (
              <Badge
                key={skill}
                variant={selectedFilters.includes(skill) ? "default" : "outline"}
                className="cursor-pointer text-xs hover:bg-primary/10 transition-colors"
                onClick={() => toggleFilter(skill)}
              >
                {skill}
              </Badge>
            ))}
          </div>
        </div>

        {/* Experience Level */}
        <div>
          <h4 className="font-medium mb-3 text-foreground">Experience Level</h4>
          <div className="space-y-2">
            {experienceLevels.map((level) => (
              <Badge
                key={level}
                variant={selectedFilters.includes(level) ? "default" : "outline"}
                className="cursor-pointer block w-full text-left justify-start hover:bg-primary/10 transition-colors"
                onClick={() => toggleFilter(level)}
              >
                {level}
              </Badge>
            ))}
          </div>
        </div>

        {/* Salary Range */}
        <div>
          <h4 className="font-medium mb-3 text-foreground">Salary Range</h4>
          <div className="space-y-2">
            {salaryRanges.map((range) => (
              <Badge
                key={range}
                variant={selectedFilters.includes(range) ? "default" : "outline"}
                className="cursor-pointer block w-full text-left justify-start hover:bg-primary/10 transition-colors"
                onClick={() => toggleFilter(range)}
              >
                {range}
              </Badge>
            ))}
          </div>
        </div>

        <Button 
          variant="outline" 
          className="w-full"
          onClick={clearAllFilters}
        >
          Clear All Filters
        </Button>
      </div>
    </Card>
  );
};