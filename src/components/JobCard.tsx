import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Clock, DollarSign, Building2 } from "lucide-react";

interface JobCardProps {
  id: number;
  title: string;
  company: string;
  location: string;
  salary: string;
  type: string;
  postedTime: string;
  description: string;
  tags: string[];
  companyLogo?: string;
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
    <Card className="group hover:shadow-elegant transition-all duration-300 hover:scale-[1.02] bg-gradient-card border-border/50 backdrop-blur-sm cursor-pointer aspect-square flex flex-col">
      <CardHeader className="flex-1 space-y-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            {companyLogo ? (
              <img 
                src={companyLogo} 
                alt={`${company} logo`} 
                className="w-10 h-10 rounded-lg object-cover"
              />
            ) : (
              <div className="w-10 h-10 rounded-lg bg-gradient-primary flex items-center justify-center">
                <Building2 className="w-5 h-5 text-primary-foreground" />
              </div>
            )}
            <div className="min-w-0 flex-1">
              <CardTitle className="text-lg group-hover:text-primary transition-colors duration-300 line-clamp-2">
                {title}
              </CardTitle>
              <CardDescription className="text-sm font-medium">
                {company}
              </CardDescription>
            </div>
          </div>
          <Badge variant="secondary" className="bg-accent/10 text-accent border-accent/20 text-xs">
            {type}
          </Badge>
        </div>
        
        <div className="grid grid-cols-1 gap-2 text-xs text-muted-foreground">
          <div className="flex items-center space-x-1">
            <MapPin className="w-3 h-3" />
            <span className="truncate">{location}</span>
          </div>
          <div className="flex items-center space-x-1">
            <DollarSign className="w-3 h-3" />
            <span>{salary}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Clock className="w-3 h-3" />
            <span>{postedTime}</span>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="pt-0 flex flex-col">
        <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3 mb-3">
          {description}
        </p>
        
        <div className="flex flex-wrap gap-1 mb-4">
          {tags.slice(0, 3).map((tag, index) => (
            <Badge 
              key={index} 
              variant="outline" 
              className="bg-primary/5 text-primary border-primary/20 text-xs px-2 py-0.5"
            >
              {tag}
            </Badge>
          ))}
          {tags.length > 3 && (
            <Badge variant="outline" className="text-xs px-2 py-0.5">
              +{tags.length - 3}
            </Badge>
          )}
        </div>
      </CardContent>
    </Card>
  );
};