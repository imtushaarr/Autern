import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { X, Plus, Search, RefreshCw, Image } from "lucide-react";
import { fetchCompanyLogo, generatePlaceholderLogo, type CompanyLogoResult } from "@/services/companyLogoService";
import type { FirebaseJob } from "@/services/jobsService";

interface JobFormProps {
  job?: FirebaseJob | null;
  onSave: (job: Partial<FirebaseJob>) => void;
  onCancel: () => void;
}

export const JobForm = ({ job, onSave, onCancel }: JobFormProps) => {
  const [formData, setFormData] = useState({
    title: job?.title || "",
    company: job?.company || "",
    location: job?.location || "",
    salary: job?.salary || "",
    type: job?.type || "",
    description: job?.description || "",
    tags: job?.tags || [],
    companyLogo: job?.companyLogo || "",
    keyResponsibilities: job?.keyResponsibilities || [],
    requirements: job?.requirements || [],
    benefits: job?.benefits || [],
  });

  const [newTag, setNewTag] = useState("");
  const [newResponsibility, setNewResponsibility] = useState("");
  const [newRequirement, setNewRequirement] = useState("");
  const [newBenefit, setNewBenefit] = useState("");
  
  // Logo-related state
  const [logoLoading, setLogoLoading] = useState(false);
  const [logoSuggestions, setLogoSuggestions] = useState<CompanyLogoResult[]>([]);
  const [showManualInput, setShowManualInput] = useState(false);
  const [logoPreview, setLogoPreview] = useState<string>("");

  const fetchCompanyLogoAutomatically = useCallback(async (companyName: string) => {
    if (formData.companyLogo && formData.companyLogo.trim() !== '') {
      return; // Don't auto-fetch if user has manually set a logo
    }

    setLogoLoading(true);
    try {
      const result = await fetchCompanyLogo(companyName);
      if (result.success && result.logoUrl) {
        setFormData(prev => ({
          ...prev,
          companyLogo: result.logoUrl!
        }));
        setLogoSuggestions([result]);
      } else {
        setLogoSuggestions([]);
        // Set placeholder logo if no logo found
        setFormData(prev => ({
          ...prev,
          companyLogo: generatePlaceholderLogo(companyName)
        }));
      }
    } catch (error) {
      console.error('Error fetching company logo:', error);
      setLogoSuggestions([]);
    } finally {
      setLogoLoading(false);
    }
  }, [formData.companyLogo]);

  // Auto-fetch logo when company name changes
  useEffect(() => {
    const timeoutId = setTimeout(async () => {
      if (formData.company && formData.company.length > 2) {
        await fetchCompanyLogoAutomatically(formData.company);
      }
    }, 500); // Debounce for 500ms

    return () => clearTimeout(timeoutId);
  }, [formData.company, fetchCompanyLogoAutomatically]);

  // Update logo preview when companyLogo changes
  useEffect(() => {
    if (formData.companyLogo) {
      setLogoPreview(formData.companyLogo);
    } else if (formData.company) {
      setLogoPreview(generatePlaceholderLogo(formData.company));
    } else {
      setLogoPreview("");
    }
  }, [formData.companyLogo, formData.company]);

  const handleManualLogoSearch = async () => {
    if (!formData.company) return;
    
    setLogoLoading(true);
    try {
      const result = await fetchCompanyLogo(formData.company);
      if (result.success && result.logoUrl) {
        setFormData(prev => ({
          ...prev,
          companyLogo: result.logoUrl!
        }));
      }
    } catch (error) {
      console.error('Error in manual logo search:', error);
    } finally {
      setLogoLoading(false);
    }
  };

  const handleLogoInputChange = (value: string) => {
    setFormData(prev => ({ ...prev, companyLogo: value }));
  };

  const clearLogo = () => {
    setFormData(prev => ({ ...prev, companyLogo: "" }));
    setLogoPreview("");
  };

  const handleAddTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }));
      setNewTag("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleAddResponsibility = () => {
    if (newResponsibility.trim() && !formData.keyResponsibilities.includes(newResponsibility.trim())) {
      setFormData(prev => ({
        ...prev,
        keyResponsibilities: [...prev.keyResponsibilities, newResponsibility.trim()]
      }));
      setNewResponsibility("");
    }
  };

  const handleRemoveResponsibility = (itemToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      keyResponsibilities: prev.keyResponsibilities.filter(item => item !== itemToRemove)
    }));
  };

  const handleAddRequirement = () => {
    if (newRequirement.trim() && !formData.requirements.includes(newRequirement.trim())) {
      setFormData(prev => ({
        ...prev,
        requirements: [...prev.requirements, newRequirement.trim()]
      }));
      setNewRequirement("");
    }
  };

  const handleRemoveRequirement = (itemToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      requirements: prev.requirements.filter(item => item !== itemToRemove)
    }));
  };

  const handleAddBenefit = () => {
    if (newBenefit.trim() && !formData.benefits.includes(newBenefit.trim())) {
      setFormData(prev => ({
        ...prev,
        benefits: [...prev.benefits, newBenefit.trim()]
      }));
      setNewBenefit("");
    }
  };

  const handleRemoveBenefit = (itemToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      benefits: prev.benefits.filter(item => item !== itemToRemove)
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Filter out empty companyLogo and empty arrays to prevent undefined values
    const submitData = { ...formData };
    if (!submitData.companyLogo || submitData.companyLogo.trim() === '') {
      delete submitData.companyLogo;
    }
    
    // Only include arrays if they have content
    if (submitData.keyResponsibilities.length === 0) {
      delete submitData.keyResponsibilities;
    }
    if (submitData.requirements.length === 0) {
      delete submitData.requirements;
    }
    if (submitData.benefits.length === 0) {
      delete submitData.benefits;
    }
    
    onSave(submitData);
  };

  const jobTypes = [
    "Full-time",
    "Part-time", 
    "Contract",
    "Remote",
    "Internship"
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4">
      <div className="max-w-4xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>
              {job ? "Edit Job Posting" : "Create New Job Posting"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="title">Job Title</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="e.g. Senior Frontend Developer"
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="company">Company</Label>
                  <Input
                    id="company"
                    value={formData.company}
                    onChange={(e) => setFormData(prev => ({ ...prev, company: e.target.value }))}
                    placeholder="e.g. TechCorp"
                    required
                  />
                </div>
                
                <div>
                  <Label>Company Logo</Label>
                  <div className="space-y-3">
                    {/* Logo Preview */}
                    {logoPreview && (
                      <div className="flex items-center gap-3 p-3 border rounded-lg bg-gray-50 dark:bg-gray-800">
                        <div className="w-12 h-12 rounded-lg overflow-hidden bg-white flex items-center justify-center border">
                          <img 
                            src={logoPreview} 
                            alt="Company logo preview" 
                            className="w-10 h-10 object-contain"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.src = generatePlaceholderLogo(formData.company || 'Company');
                            }}
                          />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium">Logo Preview</p>
                          <p className="text-xs text-muted-foreground">
                            {logoSuggestions.length > 0 && logoSuggestions[0].source 
                              ? `Source: ${logoSuggestions[0].source.replace('_', ' ')}`
                              : 'Custom logo'
                            }
                          </p>
                        </div>
                        <Button 
                          type="button" 
                          variant="ghost" 
                          size="sm"
                          onClick={clearLogo}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    )}
                    
                    {/* Auto-detection status */}
                    {logoLoading && (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        Searching for company logo...
                      </div>
                    )}
                    
                    {/* Manual input toggle */}
                    <div className="flex gap-2">
                      <Button 
                        type="button" 
                        variant="outline" 
                        size="sm"
                        onClick={handleManualLogoSearch}
                        disabled={!formData.company || logoLoading}
                      >
                        <Search className="w-4 h-4 mr-2" />
                        Search Logo
                      </Button>
                      
                      <Button 
                        type="button" 
                        variant="outline" 
                        size="sm"
                        onClick={() => setShowManualInput(!showManualInput)}
                      >
                        <Image className="w-4 h-4 mr-2" />
                        Manual URL
                      </Button>
                    </div>
                    
                    {/* Manual URL input */}
                    {showManualInput && (
                      <div className="space-y-2">
                        <Input
                          value={formData.companyLogo}
                          onChange={(e) => handleLogoInputChange(e.target.value)}
                          placeholder="https://example.com/logo.png"
                          type="url"
                        />
                        <p className="text-xs text-muted-foreground">
                          Enter a direct URL to the company logo image
                        </p>
                      </div>
                    )}
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    value={formData.location}
                    onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                    placeholder="e.g. San Francisco, CA"
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="salary">Salary Range</Label>
                  <Input
                    id="salary"
                    value={formData.salary}
                    onChange={(e) => setFormData(prev => ({ ...prev, salary: e.target.value }))}
                    placeholder="e.g. $120k-150k"
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="type">Job Type</Label>
                  <Select 
                    value={formData.type} 
                    onValueChange={(value) => setFormData(prev => ({ ...prev, type: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select job type" />
                    </SelectTrigger>
                    <SelectContent>
                      {jobTypes.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div>
                <Label htmlFor="description">Job Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Describe the job role, requirements, and responsibilities..."
                  rows={6}
                  required
                />
              </div>
              
              <div>
                <Label>Skills & Tags</Label>
                <div className="flex gap-2 mb-2">
                  <Input
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    placeholder="Add a skill or tag"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddTag();
                      }
                    }}
                  />
                  <Button type="button" onClick={handleAddTag} variant="outline">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                
                <div className="flex flex-wrap gap-2">
                  {formData.tags.map((tag, index) => (
                    <Badge key={index} variant="secondary" className="pr-1">
                      {tag}
                      <button
                        type="button"
                        onClick={() => handleRemoveTag(tag)}
                        className="ml-2 hover:text-red-500"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              </div>

              <div>
                <Label>Key Responsibilities</Label>
                <div className="flex gap-2 mb-2">
                  <Input
                    value={newResponsibility}
                    onChange={(e) => setNewResponsibility(e.target.value)}
                    placeholder="Add a key responsibility"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddResponsibility();
                      }
                    }}
                  />
                  <Button type="button" onClick={handleAddResponsibility} variant="outline">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                
                <div className="space-y-2">
                  {formData.keyResponsibilities.map((responsibility, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-800 rounded-md">
                      <span className="text-sm">• {responsibility}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveResponsibility(responsibility)}
                        className="ml-2 hover:text-red-500"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <Label>Requirements</Label>
                <div className="flex gap-2 mb-2">
                  <Input
                    value={newRequirement}
                    onChange={(e) => setNewRequirement(e.target.value)}
                    placeholder="Add a requirement"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddRequirement();
                      }
                    }}
                  />
                  <Button type="button" onClick={handleAddRequirement} variant="outline">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                
                <div className="space-y-2">
                  {formData.requirements.map((requirement, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-800 rounded-md">
                      <span className="text-sm">• {requirement}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveRequirement(requirement)}
                        className="ml-2 hover:text-red-500"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <Label>Benefits</Label>
                <div className="flex gap-2 mb-2">
                  <Input
                    value={newBenefit}
                    onChange={(e) => setNewBenefit(e.target.value)}
                    placeholder="Add a benefit"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddBenefit();
                      }
                    }}
                  />
                  <Button type="button" onClick={handleAddBenefit} variant="outline">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                
                <div className="space-y-2">
                  {formData.benefits.map((benefit, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-800 rounded-md">
                      <span className="text-sm">• {benefit}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveBenefit(benefit)}
                        className="ml-2 hover:text-red-500"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="flex gap-4 pt-6">
                <Button type="submit" className="flex-1">
                  {job ? "Update Job" : "Create Job"}
                </Button>
                <Button type="button" variant="outline" onClick={onCancel} className="flex-1">
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
