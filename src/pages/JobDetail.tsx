import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  ArrowLeft, 
  MapPin, 
  Clock, 
  DollarSign, 
  Building2, 
  Users, 
  Calendar,
  Share2,
  Heart,
  Send
} from "lucide-react";
import { jobsData } from "@/data/jobs";

export const JobDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const job = jobsData.find(j => j.id === parseInt(id || ""));
  
  if (!job) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Job Not Found</h1>
          <Button onClick={() => navigate("/")} variant="hero">
            Back to Jobs
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <Button 
          variant="ghost" 
          onClick={() => navigate("/")}
          className="mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Jobs
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Job Header */}
            <Card className="bg-gradient-card border-border/50 backdrop-blur-sm">
              <CardHeader>
                <div className="flex items-start justify-between flex-wrap gap-4">
                  <div className="flex items-center space-x-4">
                    {job.companyLogo ? (
                      <img 
                        src={job.companyLogo} 
                        alt={`${job.company} logo`} 
                        className="w-16 h-16 rounded-xl object-cover"
                      />
                    ) : (
                      <div className="w-16 h-16 rounded-xl bg-gradient-primary flex items-center justify-center">
                        <Building2 className="w-8 h-8 text-primary-foreground" />
                      </div>
                    )}
                    <div>
                      <CardTitle className="text-2xl md:text-3xl mb-2">{job.title}</CardTitle>
                      <p className="text-lg text-muted-foreground font-medium">{job.company}</p>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="glass" size="sm">
                      <Share2 className="w-4 h-4" />
                    </Button>
                    <Button variant="glass" size="sm">
                      <Heart className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4">
                  <div className="flex items-center space-x-2 text-muted-foreground">
                    <MapPin className="w-4 h-4" />
                    <span className="text-sm">{job.location}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-muted-foreground">
                    <DollarSign className="w-4 h-4" />
                    <span className="text-sm">{job.salary}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-muted-foreground">
                    <Clock className="w-4 h-4" />
                    <span className="text-sm">{job.postedTime}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-muted-foreground">
                    <Users className="w-4 h-4" />
                    <span className="text-sm">{job.type}</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 pt-4">
                  {job.tags.map((tag, index) => (
                    <Badge 
                      key={index} 
                      variant="outline" 
                      className="bg-primary/5 text-primary border-primary/20"
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>
              </CardHeader>
            </Card>

            {/* Job Description */}
            <Card className="bg-gradient-card border-border/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle>Job Description</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="font-semibold mb-3">About the Role</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {job.description}
                  </p>
                </div>

                <Separator />

                <div>
                  <h3 className="font-semibold mb-3">Key Responsibilities</h3>
                  <ul className="space-y-2 text-muted-foreground">
                    <li>• Design and develop high-quality software solutions</li>
                    <li>• Collaborate with cross-functional teams to deliver projects</li>
                    <li>• Write clean, maintainable, and well-documented code</li>
                    <li>• Participate in code reviews and technical discussions</li>
                    <li>• Stay updated with latest industry trends and technologies</li>
                  </ul>
                </div>

                <Separator />

                <div>
                  <h3 className="font-semibold mb-3">Requirements</h3>
                  <ul className="space-y-2 text-muted-foreground">
                    <li>• Bachelor's degree in Computer Science or related field</li>
                    <li>• 3+ years of experience in software development</li>
                    <li>• Proficiency in {job.tags.slice(0, 3).join(", ")}</li>
                    <li>• Strong problem-solving and analytical skills</li>
                    <li>• Excellent communication and teamwork abilities</li>
                  </ul>
                </div>

                <Separator />

                <div>
                  <h3 className="font-semibold mb-3">Benefits</h3>
                  <ul className="space-y-2 text-muted-foreground">
                    <li>• Competitive salary and equity package</li>
                    <li>• Comprehensive health, dental, and vision insurance</li>
                    <li>• Flexible working hours and remote work options</li>
                    <li>• Professional development opportunities</li>
                    <li>• Modern office with great amenities</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Apply Card */}
            <Card className="bg-gradient-primary text-primary-foreground sticky top-24">
              <CardContent className="p-6 text-center">
                <h3 className="text-xl font-bold mb-4">Ready to Apply?</h3>
                <p className="mb-6 opacity-90">
                  Join {job.company} and take your career to the next level.
                </p>
                <Button 
                  variant="secondary" 
                  size="lg" 
                  className="w-full bg-white text-primary hover:bg-white/90"
                >
                  <Send className="w-4 h-4 mr-2" />
                  Apply Now
                </Button>
                <Button 
                  variant="ghost" 
                  className="w-full mt-3 text-primary-foreground hover:bg-white/10"
                >
                  Save for Later
                </Button>
              </CardContent>
            </Card>

            {/* Company Info */}
            <Card className="bg-gradient-card border-border/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle>About {job.company}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground text-sm">
                  {job.company} is a leading technology company focused on innovation and excellence. We're committed to creating amazing products and fostering a collaborative work environment.
                </p>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Industry:</span>
                    <span>Technology</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Company Size:</span>
                    <span>1000+ employees</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Founded:</span>
                    <span>2010</span>
                  </div>
                </div>
                <Button variant="glass" className="w-full">
                  View Company Profile
                </Button>
              </CardContent>
            </Card>

            {/* Similar Jobs */}
            <Card className="bg-gradient-card border-border/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle>Similar Jobs</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {jobsData.slice(0, 3).filter(j => j.id !== job.id).map((similarJob) => (
                    <div 
                      key={similarJob.id}
                      className="p-3 rounded-lg border border-border/50 hover:bg-muted/20 transition-colors cursor-pointer"
                      onClick={() => navigate(`/job/${similarJob.id}`)}
                    >
                      <h4 className="font-medium text-sm mb-1">{similarJob.title}</h4>
                      <p className="text-xs text-muted-foreground mb-2">{similarJob.company}</p>
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>{similarJob.location}</span>
                        <span>{similarJob.salary}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};