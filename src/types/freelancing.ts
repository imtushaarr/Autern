export interface FreelancerProfile {
  id: string;
  userId: string;
  title: string;
  description: string;
  skills: string[];
  hourlyRate: number;
  availability: 'available' | 'busy' | 'unavailable';
  rating: number;
  completedProjects: number;
  profileImage?: string;
  portfolio: PortfolioItem[];
  languages: Language[];
  education: Education[];
  experience: Experience[];
  location: string;
  responseTime: string; // e.g., "within 1 hour"
  createdAt: Date;
  updatedAt: Date;
}

export interface PortfolioItem {
  id: string;
  title: string;
  description: string;
  images: string[];
  tags: string[];
  projectUrl?: string;
  completedAt: Date;
}

export interface Language {
  name: string;
  proficiency: 'basic' | 'conversational' | 'fluent' | 'native';
}

export interface Education {
  degree: string;
  institution: string;
  year: number;
  description?: string;
}

export interface Experience {
  title: string;
  company: string;
  duration: string;
  description: string;
}

export interface Project {
  id: string;
  clientId: string;
  freelancerId?: string;
  title: string;
  description: string;
  category: string;
  subcategory: string;
  skillsRequired: string[];
  budget: {
    type: 'fixed' | 'hourly';
    min: number;
    max: number;
  };
  duration: string;
  experienceLevel: 'entry' | 'intermediate' | 'expert';
  status: 'open' | 'in_progress' | 'completed' | 'cancelled';
  attachments: string[];
  proposals: Proposal[];
  milestones?: Milestone[];
  createdAt: Date;
  updatedAt: Date;
  deadline?: Date;
}

export interface Proposal {
  id: string;
  projectId: string;
  freelancerId: string;
  coverLetter: string;
  proposedRate: number;
  estimatedDuration: string;
  milestones?: ProposedMilestone[];
  attachments: string[];
  status: 'pending' | 'accepted' | 'rejected' | 'withdrawn';
  createdAt: Date;
}

export interface ProposedMilestone {
  title: string;
  description: string;
  amount: number;
  duration: string;
}

export interface Milestone {
  id: string;
  projectId: string;
  title: string;
  description: string;
  amount: number;
  dueDate: Date;
  status: 'pending' | 'in_progress' | 'completed' | 'disputed';
  submittedAt?: Date;
  approvedAt?: Date;
  feedback?: string;
}

export interface ChatMessage {
  id: string;
  chatId: string;
  senderId: string;
  senderType: 'client' | 'freelancer';
  content: string;
  type: 'text' | 'file' | 'image' | 'milestone' | 'contract';
  attachments?: string[];
  timestamp: Date;
  isRead: boolean;
  editedAt?: Date;
}

export interface ChatRoom {
  id: string;
  projectId: string;
  clientId: string;
  freelancerId: string;
  lastMessage?: string;
  lastMessageAt?: Date;
  unreadCount: {
    client: number;
    freelancer: number;
  };
  isActive: boolean;
  createdAt: Date;
}

export interface UserProfile {
  id: string;
  userId: string;
  displayName: string;
  email: string;
  avatar?: string;
  userType: 'client' | 'freelancer' | 'both';
  isVerified: boolean;
  joinedAt: Date;
  lastSeen: Date;
  timezone: string;
  contactInfo: {
    phone?: string;
    address?: string;
    website?: string;
    linkedin?: string;
  };
}

export interface Review {
  id: string;
  projectId: string;
  reviewerId: string;
  revieweeId: string;
  rating: number;
  comment: string;
  skills: { [skill: string]: number }; // skill-specific ratings
  createdAt: Date;
}

export interface Contract {
  id: string;
  projectId: string;
  proposalId: string;
  clientId: string;
  freelancerId: string;
  title: string;
  description: string;
  totalAmount: number;
  paymentType: 'fixed' | 'hourly';
  hourlyRate?: number;
  estimatedHours?: number;
  milestones: Milestone[];
  startDate: Date;
  endDate?: Date;
  status: 'active' | 'completed' | 'cancelled' | 'disputed';
  terms: string;
  createdAt: Date;
  completedAt?: Date;
}

export interface Payment {
  id: string;
  contractId: string;
  milestoneId?: string;
  payerId: string;
  payeeId: string;
  amount: number;
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'refunded';
  paymentMethod: string;
  transactionId?: string;
  createdAt: Date;
  processedAt?: Date;
}
