import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Users, 
  Briefcase, 
  TrendingUp, 
  Eye 
} from "lucide-react";
import type { FirebaseJob } from "@/services/jobsService";

interface StatsCardsProps {
  jobs: FirebaseJob[];
}

export const StatsCards = ({ jobs }: StatsCardsProps) => {
  // Calculate real-time statistics
  const totalJobs = jobs.length;
  const recentJobs = jobs.filter(job => {
    const posted = job.postedTime;
    return posted.includes('hour') || posted.includes('Just now');
  }).length;

  const jobTypes = jobs.reduce((acc, job) => {
    acc[job.type] = (acc[job.type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const mostPopularType = Object.entries(jobTypes).sort(([,a], [,b]) => b - a)[0];
  
  const stats = [
    {
      title: "Total Jobs",
      value: totalJobs.toString(),
      change: `+${recentJobs} recent`,
      icon: Briefcase,
      color: "text-blue-600"
    },
    {
      title: "Active Applications",
      value: "1,247",
      change: "+12% from last month",
      icon: Users,
      color: "text-green-600"
    },
    {
      title: "Total Views",
      value: "12,543",
      change: "+15% from last month",
      icon: Eye,
      color: "text-purple-600"
    },
    {
      title: "Popular Type",
      value: mostPopularType ? mostPopularType[0] : "N/A",
      change: mostPopularType ? `${mostPopularType[1]} jobs` : "No data",
      icon: TrendingUp,
      color: "text-orange-600"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => {
        const IconComponent = stat.icon;
        return (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <IconComponent className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">
                {stat.change}
              </p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};
