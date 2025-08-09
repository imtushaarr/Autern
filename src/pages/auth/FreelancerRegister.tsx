import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Loader2, Users, Eye, EyeOff, X, Plus } from 'lucide-react';
import { useUserAuth } from '@/hooks/useUserAuth';

export const FreelancerRegister = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    displayName: '',
    title: '',
    description: '',
    hourlyRate: '',
  });
  const [skills, setSkills] = useState<string[]>([]);
  const [newSkill, setNewSkill] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { register } = useUserAuth();
  const navigate = useNavigate();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const addSkill = () => {
    if (newSkill.trim() && !skills.includes(newSkill.trim())) {
      setSkills([...skills, newSkill.trim()]);
      setNewSkill('');
    }
  };

  const removeSkill = (skillToRemove: string) => {
    setSkills(skills.filter(skill => skill !== skillToRemove));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addSkill();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!formData.email || !formData.password || !formData.displayName) {
      setError('Please fill in all required fields');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    if (skills.length === 0) {
      setError('Please add at least one skill');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const additionalInfo = {
        displayName: formData.displayName,
        title: formData.title,
        description: formData.description,
        hourlyRate: formData.hourlyRate ? parseFloat(formData.hourlyRate) : undefined,
        skills
      };

      await register(formData.email, formData.password, 'freelancer', additionalInfo);
      navigate('/freelancer');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-primary/5 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center space-x-2">
            <div className="h-10 w-10 rounded-lg bg-gradient-primary flex items-center justify-center">
              <Users className="h-6 w-6 text-primary-foreground" />
            </div>
            <Link to="/" className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Autern
            </Link>
          </div>
          <div className="space-y-1">
            <h1 className="text-2xl font-bold">Join as a Freelancer</h1>
            <p className="text-muted-foreground">
              Create your freelancer profile and start finding projects
            </p>
          </div>
        </div>

        {/* Registration Form */}
        <Card className="border-0 shadow-xl">
          <CardHeader className="space-y-1">
            <CardTitle className="text-xl">Create your account</CardTitle>
            <CardDescription>
              Fill in your details to get started as a freelancer
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              
              {/* Basic Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="your.email@example.com"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    disabled={loading}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="displayName">Full Name *</Label>
                  <Input
                    id="displayName"
                    name="displayName"
                    type="text"
                    placeholder="John Doe"
                    value={formData.displayName}
                    onChange={handleInputChange}
                    required
                    disabled={loading}
                  />
                </div>
              </div>
              
              {/* Password Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="password">Password *</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter password"
                      value={formData.password}
                      onChange={handleInputChange}
                      required
                      disabled={loading}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}
                      disabled={loading}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm Password *</Label>
                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      name="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Confirm password"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      required
                      disabled={loading}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      disabled={loading}
                    >
                      {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>
              </div>
              
              {/* Professional Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Professional Title</Label>
                  <Input
                    id="title"
                    name="title"
                    type="text"
                    placeholder="Full Stack Developer"
                    value={formData.title}
                    onChange={handleInputChange}
                    disabled={loading}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="hourlyRate">Hourly Rate ($)</Label>
                  <Input
                    id="hourlyRate"
                    name="hourlyRate"
                    type="number"
                    placeholder="50"
                    min="0"
                    step="0.01"
                    value={formData.hourlyRate}
                    onChange={handleInputChange}
                    disabled={loading}
                  />
                </div>
              </div>
              
              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="description">Professional Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  placeholder="Describe your experience, expertise, and what makes you unique as a freelancer..."
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={3}
                  disabled={loading}
                />
              </div>
              
              {/* Skills */}
              <div className="space-y-2">
                <Label htmlFor="skills">Skills *</Label>
                <div className="flex space-x-2">
                  <Input
                    id="skills"
                    type="text"
                    placeholder="Add a skill (e.g., React, Node.js, Python)"
                    value={newSkill}
                    onChange={(e) => setNewSkill(e.target.value)}
                    onKeyPress={handleKeyPress}
                    disabled={loading}
                    className="flex-1"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={addSkill}
                    disabled={loading || !newSkill.trim()}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                
                {skills.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {skills.map((skill, index) => (
                      <Badge key={index} variant="secondary" className="flex items-center space-x-1">
                        <span>{skill}</span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="h-auto p-0 hover:bg-transparent"
                          onClick={() => removeSkill(skill)}
                          disabled={loading}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
              
              <Button
                type="submit"
                className="w-full"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating account...
                  </>
                ) : (
                  'Create Account'
                )}
              </Button>
            </form>
            
            <div className="mt-6 text-center text-sm">
              <span className="text-muted-foreground">Already have an account? </span>
              <Link
                to="/freelancer/login"
                className="text-primary hover:underline font-medium"
              >
                Sign in
              </Link>
            </div>
            
            <div className="mt-4 text-center text-sm">
              <span className="text-muted-foreground">Looking to hire? </span>
              <Link
                to="/client/register"
                className="text-primary hover:underline font-medium"
              >
                Join as client
              </Link>
            </div>
          </CardContent>
        </Card>
        
        {/* Footer */}
        <div className="text-center text-sm text-muted-foreground">
          <p>
            By creating an account, you agree to our{' '}
            <Link to="/terms" className="text-primary hover:underline">
              Terms of Service
            </Link>{' '}
            and{' '}
            <Link to="/privacy" className="text-primary hover:underline">
              Privacy Policy
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};
