import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Clock, DollarSign, Building2 } from "lucide-react";

interface JobCardProps {
  id: string;
  title: string;
  company: string;
  location: string;
  salary: string;
  type: string;
  postedTime: string;
  description: string;
  tags: string[];
  companyLogo?: string;
  keyResponsibilities?: string[];
  requirements?: string[];
  benefits?: string[];
}

export const JobCard = ({ 
  id,
  title, 
  company, 
  location, 
  salary, 
  type, 
  postedTime, 
  description, 
  tags,
  companyLogo 
}: JobCardProps) => {
  return (
    <Card className="group hover:shadow-elegant transition-all duration-300 hover:scale-[1.02] bg-gradient-card border-border/50 backdrop-blur-sm cursor-pointer h-full flex flex-col">
      <CardHeader className="flex-shrink-0 space-y-3 pb-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3 flex-1 min-w-0">
            {companyLogo ? (
              <img 
                src={companyLogo} 
                alt={`${company} logo`} 
                className="w-12 h-12 rounded-lg object-cover flex-shrink-0"
              />
            ) : (
              <div className="w-12 h-12 rounded-lg bg-gradient-primary flex items-center justify-center flex-shrink-0">
                <Building2 className="w-6 h-6 text-primary-foreground" />
              </div>
            )}
            <div className="min-w-0 flex-1">
              <CardTitle className="text-lg group-hover:text-primary transition-colors duration-300 line-clamp-2 leading-tight">
                {title}
              </CardTitle>
              <CardDescription className="text-sm font-medium mt-1">
                {company}
              </CardDescription>
            </div>
          </div>
          <Badge variant="secondary" className="bg-accent/10 text-accent border-accent/20 text-xs flex-shrink-0 ml-2">
            {type}
          </Badge>
        </div>
        
        <div className="grid grid-cols-1 gap-2 text-sm text-muted-foreground">
          <div className="flex items-center space-x-2">
            <MapPin className="w-4 h-4 flex-shrink-0" />
            <span className="truncate">{location}</span>
          </div>
          <div className="flex items-center space-x-2">
            <DollarSign className="w-4 h-4 flex-shrink-0" />
            <span className="truncate">{salary}</span>
          </div>
          <div className="flex items-center space-x-2">
            <Clock className="w-4 h-4 flex-shrink-0" />
            <span>{postedTime}</span>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="pt-0 flex flex-col flex-1 min-h-0">
        <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3 mb-4 flex-shrink-0">
          {description}
        </p>
        
        <div className="flex flex-wrap gap-1.5 mt-auto">
          {tags.slice(0, 4).map((tag, index) => (
            <Badge 
              key={index} 
              variant="outline" 
              className="bg-primary/5 text-primary border-primary/20 text-xs px-2 py-1"
            >
              {tag}
            </Badge>
          ))}
          {tags.length > 4 && (
            <Badge variant="outline" className="text-xs px-2 py-1">
              +{tags.length - 4}
            </Badge>
          )}
        </div>
      </CardContent>
    </Card>
  );
};