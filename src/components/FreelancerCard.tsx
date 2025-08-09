import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Star, 
  MapPin, 
  DollarSign, 
  MessageCircle, 
  Eye,
  Clock,
  User,
  Briefcase
} from 'lucide-react';
import { FreelancerProfile } from '@/types/freelancing';

interface FreelancerCardProps {
  freelancer: FreelancerProfile;
  onViewProfile?: (freelancer: FreelancerProfile) => void;
  onContact?: (freelancer: FreelancerProfile) => void;
  onHire?: (freelancer: FreelancerProfile) => void;
}

const FreelancerCard = ({ freelancer, onViewProfile, onContact, onHire }: FreelancerCardProps) => {
  return (
    <Card className="hover:shadow-lg transition-all duration-200 hover:scale-[1.02] bg-card/80 backdrop-blur-sm border-border/50">
      <CardHeader className="pb-4">
        <div className="flex items-start space-x-4">
          <Avatar className="h-16 w-16 ring-2 ring-primary/10">
            <AvatarImage src={freelancer.profileImage} alt={freelancer.title} />
            <AvatarFallback className="bg-gradient-primary text-primary-foreground">
              <User className="h-8 w-8" />
            </AvatarFallback>
          </Avatar>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-semibold text-lg leading-tight">{freelancer.title}</h3>
                <div className="flex items-center space-x-3 mt-2">
                  <div className="flex items-center">
                    <Star className="h-4 w-4 text-yellow-500 mr-1" />
                    <span className="text-sm font-medium">{freelancer.rating.toFixed(1)}</span>
                    <span className="text-xs text-muted-foreground ml-1">
                      ({freelancer.completedProjects} reviews)
                    </span>
                  </div>
                  <Badge 
                    variant={freelancer.availability === 'available' ? 'default' : 'secondary'}
                    className={
                      freelancer.availability === 'available' 
                        ? 'bg-green-100 text-green-800 hover:bg-green-200' 
                        : freelancer.availability === 'busy'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-gray-100 text-gray-800'
                    }
                  >
                    {freelancer.availability}
                  </Badge>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed">
          {freelancer.description}
        </p>
        
        {/* Skills */}
        <div className="flex flex-wrap gap-1.5">
          {freelancer.skills.slice(0, 4).map((skill, index) => (
            <Badge key={index} variant="outline" className="text-xs font-normal">
              {skill}
            </Badge>
          ))}
          {freelancer.skills.length > 4 && (
            <Badge variant="outline" className="text-xs">
              +{freelancer.skills.length - 4} more
            </Badge>
          )}
        </div>
        
        {/* Key Info */}
        <div className="grid grid-cols-2 gap-3 text-sm text-muted-foreground">
          <div className="flex items-center">
            <MapPin className="h-4 w-4 mr-2 text-primary/60" />
            <span>{freelancer.location}</span>
          </div>
          <div className="flex items-center">
            <DollarSign className="h-4 w-4 mr-2 text-primary/60" />
            <span className="font-medium">${freelancer.hourlyRate}/hr</span>
          </div>
          <div className="flex items-center">
            <Briefcase className="h-4 w-4 mr-2 text-primary/60" />
            <span>{freelancer.completedProjects} projects</span>
          </div>
          <div className="flex items-center">
            <Clock className="h-4 w-4 mr-2 text-primary/60" />
            <span>{freelancer.responseTime}</span>
          </div>
        </div>
        
        {/* Action Buttons */}
        <div className="flex space-x-2 pt-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="flex-1"
            onClick={() => onViewProfile?.(freelancer)}
          >
            <Eye className="h-4 w-4 mr-2" />
            View Profile
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            className="flex-1"
            onClick={() => onContact?.(freelancer)}
          >
            <MessageCircle className="h-4 w-4 mr-2" />
            Contact
          </Button>
          {freelancer.availability === 'available' && (
            <Button 
              size="sm" 
              className="flex-1 bg-gradient-primary hover:scale-105 transition-all"
              onClick={() => onHire?.(freelancer)}
            >
              Hire Now
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default FreelancerCard;
