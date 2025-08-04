import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Filter, SlidersHorizontal } from "lucide-react";

interface FilterSectionProps {
  selectedFilters: string[];
  onFilterChange: (filters: string[]) => void;
}

export const FilterSection = ({ selectedFilters, onFilterChange }: FilterSectionProps) => {
  const jobTypes = ["Full-time", "Part-time", "Contract", "Remote", "Internship"];
  const experienceLevels = ["Entry Level", "Mid Level", "Senior Level", "Executive"];
  const salaryRanges = ["$40k-60k", "$60k-80k", "$80k-100k", "$100k+"];

  const toggleFilter = (filter: string) => {
    if (selectedFilters.includes(filter)) {
      onFilterChange(selectedFilters.filter(f => f !== filter));
    } else {
      onFilterChange([...selectedFilters, filter]);
    }
  };

  return (
    <Card className="p-6 bg-gradient-card backdrop-blur-sm border-border/50 sticky top-6">
      <div className="flex items-center space-x-2 mb-6">
        <SlidersHorizontal className="w-5 h-5 text-primary" />
        <h3 className="text-lg font-semibold">Filters</h3>
      </div>
      
      <div className="space-y-6">
        {/* Job Type */}
        <div>
          <h4 className="font-medium mb-3 text-foreground">Job Type</h4>
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
          onClick={() => onFilterChange([])}
        >
          Clear All Filters
        </Button>
      </div>
    </Card>
  );
};