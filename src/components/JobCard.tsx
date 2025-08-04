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
    <Card className="group hover:shadow-elegant transition-all duration-300 hover:scale-[1.02] bg-gradient-card border-border/50 backdrop-blur-sm">
      <CardHeader className="space-y-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            {companyLogo ? (
              <img 
                src={companyLogo} 
                alt={`${company} logo`} 
                className="w-12 h-12 rounded-lg object-cover"
              />
            ) : (
              <div className="w-12 h-12 rounded-lg bg-gradient-primary flex items-center justify-center">
                <Building2 className="w-6 h-6 text-primary-foreground" />
              </div>
            )}
            <div>
              <CardTitle className="text-xl group-hover:text-primary transition-colors duration-300">
                {title}
              </CardTitle>
              <CardDescription className="text-base font-medium">
                {company}
              </CardDescription>
            </div>
          </div>
          <Badge variant="secondary" className="bg-accent/10 text-accent border-accent/20">
            {type}
          </Badge>
        </div>
        
        <div className="flex items-center space-x-4 text-sm text-muted-foreground">
          <div className="flex items-center space-x-1">
            <MapPin className="w-4 h-4" />
            <span>{location}</span>
          </div>
          <div className="flex items-center space-x-1">
            <DollarSign className="w-4 h-4" />
            <span>{salary}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Clock className="w-4 h-4" />
            <span>{postedTime}</span>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <p className="text-muted-foreground leading-relaxed">
          {description}
        </p>
        
        <div className="flex flex-wrap gap-2">
          {tags.map((tag, index) => (
            <Badge 
              key={index} 
              variant="outline" 
              className="bg-primary/5 text-primary border-primary/20 hover:bg-primary/10 transition-colors"
            >
              {tag}
            </Badge>
          ))}
        </div>
        
        <div className="flex space-x-3 pt-2">
          <Button variant="hero" size="sm" className="flex-1">
            Apply Now
          </Button>
          <Button variant="glass" size="sm">
            Save Job
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};