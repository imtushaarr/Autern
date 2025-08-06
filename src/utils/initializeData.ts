import { createJob, getAllJobs } from '@/services/jobsService';
import { jobsData } from '@/data/jobs';

export const initializeFirebaseData = async () => {
  try {
    // Check if data already exists
    const existingJobs = await getAllJobs();
    
    if (existingJobs.length > 0) {
      console.log('Firebase already has job data');
      return;
    }

    console.log('Initializing Firebase with sample data...');
    
    // Add sample jobs to Firebase
    for (const job of jobsData) {
      const firebaseJobData = {
        title: job.title,
        company: job.company,
        location: job.location,
        salary: job.salary,
        type: job.type,
        description: job.description,
        tags: job.tags,
        companyLogo: job.companyLogo
      };
      
      await createJob(firebaseJobData);
    }
    
    console.log('Sample data added to Firebase successfully!');
  } catch (error) {
    console.error('Error initializing Firebase data:', error);
  }
};
