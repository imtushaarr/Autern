import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Navigate } from 'react-router-dom';
import { Clock, MapPin, DollarSign, Building, Building2, User, Users, Share2, Heart, Twitter, Linkedin, Facebook, Copy, ArrowLeft, Send } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/hooks/useAuth';
import { getJobById, subscribeToJobs } from '@/services/jobsService';
import type { FirebaseJob } from '@/services/jobsService';

const JobDetail: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState<FirebaseJob | null>(null);
  const [loading, setLoading] = useState(true);
  const [allJobs, setAllJobs] = useState<FirebaseJob[]>([]);
  const [showShareMenu, setShowShareMenu] = useState(false);
  
  // Convert Firebase job to local job format (remove conversion for now)
  const convertFirebaseJobToJob = (firebaseJob: FirebaseJob): FirebaseJob => firebaseJob;

  // Close share menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (showShareMenu && !target.closest('.share-menu-container')) {
        setShowShareMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showShareMenu]);

  useEffect(() => {
    const fetchJob = async () => {
      if (!id) return;
      
      setLoading(true);
      try {
        const firebaseJob = await getJobById(id);
        if (firebaseJob) {
          setJob(convertFirebaseJobToJob(firebaseJob));
        }
      } catch (error) {
        console.error('Error fetching job:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchJob();
  }, [id]);

  useEffect(() => {
    // Subscribe to all jobs for similar jobs section
    const unsubscribe = subscribeToJobs((firebaseJobs) => {
      const convertedJobs = firebaseJobs.map(convertFirebaseJobToJob);
      setAllJobs(convertedJobs);
    });

    return () => unsubscribe();
  }, []);

  const handleShare = (platform: string) => {
    if (!job) return;
    
    const url = window.location.href;
    const title = `${job.title} at ${job.company}`;
    const description = `Check out this ${job.type} opportunity: ${job.title} at ${job.company} in ${job.location}. ${job.description.substring(0, 100)}...`;
    
    const shareUrls = {
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}&hashtags=jobs,career,${job.tags.slice(0, 2).join(',')}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}&t=${encodeURIComponent(title)}`,
      whatsapp: `https://wa.me/?text=${encodeURIComponent(`${title} - ${url}`)}`,
      telegram: `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`
    };

    if (platform === 'copy') {
      navigator.clipboard.writeText(url).then(() => {
        alert('Link copied to clipboard!');
      });
    } else if (shareUrls[platform as keyof typeof shareUrls]) {
      window.open(shareUrls[platform as keyof typeof shareUrls], '_blank', 'width=600,height=400');
    }
    
    setShowShareMenu(false);
  };

  const toggleShareMenu = () => {
    setShowShareMenu(!showShareMenu);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Loading job details...</p>
        </div>
      </div>
    );
  }
  
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
                    <div className="relative share-menu-container">
                      <Button 
                        variant="glass" 
                        size="sm"
                        onClick={toggleShareMenu}
                      >
                        <Share2 className="w-4 h-4" />
                      </Button>
                      
                      {showShareMenu && (
                        <div className="absolute top-full right-0 mt-2 w-56 bg-white dark:bg-gray-800 border border-border rounded-lg shadow-lg z-10">
                          <div className="p-2">
                            <div className="text-sm font-medium text-muted-foreground mb-2 px-2">Share this job</div>
                            
                            <button
                              onClick={() => handleShare('linkedin')}
                              className="flex items-center gap-3 w-full px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors"
                            >
                              <Linkedin className="w-4 h-4 text-blue-600" />
                              Share on LinkedIn
                            </button>
                            
                            <button
                              onClick={() => handleShare('twitter')}
                              className="flex items-center gap-3 w-full px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors"
                            >
                              <Twitter className="w-4 h-4 text-blue-400" />
                              Share on Twitter
                            </button>
                            
                            <button
                              onClick={() => handleShare('facebook')}
                              className="flex items-center gap-3 w-full px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors"
                            >
                              <Facebook className="w-4 h-4 text-blue-700" />
                              Share on Facebook
                            </button>
                            
                            <button
                              onClick={() => handleShare('whatsapp')}
                              className="flex items-center gap-3 w-full px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors"
                            >
                              <div className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                                <span className="text-white text-xs font-bold">W</span>
                              </div>
                              Share on WhatsApp
                            </button>
                            
                            <button
                              onClick={() => handleShare('telegram')}
                              className="flex items-center gap-3 w-full px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors"
                            >
                              <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                                <span className="text-white text-xs font-bold">T</span>
                              </div>
                              Share on Telegram
                            </button>
                            
                            <div className="border-t border-border my-2"></div>
                            
                            <button
                              onClick={() => handleShare('copy')}
                              className="flex items-center gap-3 w-full px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors"
                            >
                              <Copy className="w-4 h-4 text-gray-600" />
                              Copy Link
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                    
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
                  {job.keyResponsibilities && job.keyResponsibilities.length > 0 ? (
                    <ul className="space-y-2 text-muted-foreground">
                      {job.keyResponsibilities.map((responsibility, index) => (
                        <li key={index}>• {responsibility}</li>
                      ))}
                    </ul>
                  ) : (
                    <ul className="space-y-2 text-muted-foreground">
                      <li>• Design and develop high-quality software solutions</li>
                      <li>• Collaborate with cross-functional teams to deliver projects</li>
                      <li>• Write clean, maintainable, and well-documented code</li>
                      <li>• Participate in code reviews and technical discussions</li>
                      <li>• Stay updated with latest industry trends and technologies</li>
                    </ul>
                  )}
                </div>

                <Separator />

                <div>
                  <h3 className="font-semibold mb-3">Requirements</h3>
                  {job.requirements && job.requirements.length > 0 ? (
                    <ul className="space-y-2 text-muted-foreground">
                      {job.requirements.map((requirement, index) => (
                        <li key={index}>• {requirement}</li>
                      ))}
                    </ul>
                  ) : (
                    <ul className="space-y-2 text-muted-foreground">
                      <li>• Bachelor's degree in Computer Science or related field</li>
                      <li>• 3+ years of experience in software development</li>
                      <li>• Proficiency in {job.tags.slice(0, 3).join(", ")}</li>
                      <li>• Strong problem-solving and analytical skills</li>
                      <li>• Excellent communication and teamwork abilities</li>
                    </ul>
                  )}
                </div>

                <Separator />

                <div>
                  <h3 className="font-semibold mb-3">Benefits</h3>
                  {job.benefits && job.benefits.length > 0 ? (
                    <ul className="space-y-2 text-muted-foreground">
                      {job.benefits.map((benefit, index) => (
                        <li key={index}>• {benefit}</li>
                      ))}
                    </ul>
                  ) : (
                    <ul className="space-y-2 text-muted-foreground">
                      <li>• Competitive salary and equity package</li>
                      <li>• Comprehensive health, dental, and vision insurance</li>
                      <li>• Flexible working hours and remote work options</li>
                      <li>• Professional development opportunities</li>
                      <li>• Modern office with great amenities</li>
                    </ul>
                  )}
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
                  {allJobs.slice(0, 3).filter(j => j.id !== job?.id).map((similarJob) => (
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

export default JobDetail;