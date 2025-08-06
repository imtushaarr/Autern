export interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  salary: string;
  type: string;
  postedTime: string;
  description: string;
  keyResponsibilities?: string[];
  requirements?: string[];
  benefits?: string[];
  tags: string[];
  companyLogo?: string;
}

export const jobsData: Job[] = [
  {
    id: "1",
    title: "Senior Frontend Developer",
    company: "TechCorp",
    location: "San Francisco, CA",
    salary: "$120k-150k",
    type: "Full-time",
    postedTime: "2 hours ago",
    description: "We're looking for a senior frontend developer to join our dynamic team. You'll be working on cutting-edge web applications using React, TypeScript, and modern development tools.",
    tags: ["React", "TypeScript", "CSS", "JavaScript", "Tailwind"],
  },
  {
    id: "2",
    title: "Product Manager",
    company: "InnovateLabs",
    location: "New York, NY",
    salary: "$110k-140k",
    type: "Full-time",
    postedTime: "5 hours ago",
    description: "Join our product team to drive the vision and strategy for our next-generation SaaS platform. Work closely with engineering, design, and marketing teams.",
    tags: ["Product Strategy", "Analytics", "Agile", "Leadership"],
  },
  {
    id: "3",
    title: "UX/UI Designer",
    company: "DesignStudio",
    location: "Remote",
    salary: "$80k-100k",
    type: "Remote",
    postedTime: "1 day ago",
    description: "Create beautiful and intuitive user experiences for our mobile and web applications. Collaborate with product managers and developers to bring designs to life.",
    tags: ["Figma", "Sketch", "Prototyping", "User Research", "Design Systems"],
  },
  {
    id: "4",
    title: "Full Stack Engineer",
    company: "StartupXYZ",
    location: "Austin, TX",
    salary: "$95k-125k",
    type: "Full-time",
    postedTime: "3 hours ago",
    description: "Build and maintain our web platform from front to back. Work with React, Node.js, and cloud technologies in a fast-paced startup environment.",
    tags: ["React", "Node.js", "MongoDB", "AWS", "Docker"],
  },
  {
    id: "5",
    title: "Data Scientist",
    company: "DataCorp",
    location: "Seattle, WA",
    salary: "$130k-160k",
    type: "Full-time",
    postedTime: "6 hours ago",
    description: "Analyze large datasets to drive business insights and build machine learning models. Work with Python, SQL, and various data visualization tools.",
    tags: ["Python", "SQL", "Machine Learning", "Pandas", "TensorFlow"],
  },
  {
    id: "6",
    title: "DevOps Engineer",
    company: "CloudTech",
    location: "Denver, CO",
    salary: "$105k-135k",
    type: "Full-time",
    postedTime: "8 hours ago",
    description: "Manage our cloud infrastructure and CI/CD pipelines. Ensure high availability and scalability of our applications across multiple environments.",
    tags: ["AWS", "Docker", "Kubernetes", "Jenkins", "Terraform"],
  },
  {
    id: "7",
    title: "Mobile Developer",
    company: "AppForge",
    location: "Los Angeles, CA",
    salary: "$100k-130k",
    type: "Full-time",
    postedTime: "12 hours ago",
    description: "Develop cross-platform mobile applications using React Native. Work on consumer-facing apps with millions of users.",
    tags: ["React Native", "iOS", "Android", "JavaScript", "Firebase"],
  },
  {
    id: "8",
    title: "Backend Engineer",
    company: "ServerSide Inc",
    location: "Chicago, IL",
    salary: "$110k-140k",
    type: "Full-time",
    postedTime: "1 day ago",
    description: "Build robust and scalable backend services using modern technologies. Design APIs and work with microservices architecture.",
    tags: ["Python", "FastAPI", "PostgreSQL", "Redis", "Microservices"],
  },
  {
    id: "9",
    title: "Quality Assurance Engineer",
    company: "TestLabs",
    location: "Remote",
    salary: "$70k-90k",
    type: "Remote",
    postedTime: "2 days ago",
    description: "Ensure the quality of our software products through comprehensive testing strategies. Develop automated test suites and work closely with development teams.",
    tags: ["Automation Testing", "Selenium", "Jest", "Cypress", "API Testing"],
  },
  {
    id: "10",
    title: "Marketing Manager",
    company: "GrowthCo",
    location: "Boston, MA",
    salary: "$85k-110k",
    type: "Full-time",
    postedTime: "3 days ago",
    description: "Lead our digital marketing efforts and drive customer acquisition. Manage campaigns across multiple channels and analyze performance metrics.",
    tags: ["Digital Marketing", "SEO", "Google Ads", "Analytics", "Content Strategy"],
  }
];