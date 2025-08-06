import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  onSnapshot,
  serverTimestamp,
  Timestamp
} from 'firebase/firestore';
import { db } from '@/lib/firebase';

export interface FirebaseJob {
  id?: string;
  title: string;
  company: string;
  location: string;
  salary: string;
  type: string;
  description: string;
  keyResponsibilities?: string[];
  requirements?: string[];
  benefits?: string[];
  tags: string[];
  companyLogo?: string;
  postedTime?: string;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}

const JOBS_COLLECTION = 'jobs';

// Get all jobs
export const getAllJobs = async (): Promise<FirebaseJob[]> => {
  try {
    const jobsQuery = query(
      collection(db, JOBS_COLLECTION),
      orderBy('createdAt', 'desc')
    );
    const querySnapshot = await getDocs(jobsQuery);
    
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      postedTime: formatPostedTime(doc.data().createdAt)
    } as FirebaseJob));
  } catch (error) {
    console.error('Error getting jobs:', error);
    
    const firebaseError = error as { code?: string };
    if (firebaseError.code === 'permission-denied') {
      console.error('🔥 Firestore Permission Error: Please check your Firestore rules');
      console.error('💡 Ensure the jobs collection allows read access');
    }
    
    // Return empty array for graceful degradation
    return [];
  }
};

// Get a single job by ID
export const getJobById = async (jobId: string): Promise<FirebaseJob | null> => {
  try {
    const jobDoc = await getDoc(doc(db, JOBS_COLLECTION, jobId));
    
    if (jobDoc.exists()) {
      return {
        id: jobDoc.id,
        ...jobDoc.data(),
        postedTime: formatPostedTime(jobDoc.data().createdAt)
      } as FirebaseJob;
    }
    
    return null;
  } catch (error) {
    console.error('Error getting job:', error);
    throw error;
  }
};

// Create a new job
export const createJob = async (jobData: Omit<FirebaseJob, 'id' | 'createdAt' | 'updatedAt' | 'postedTime'>): Promise<string> => {
  try {
    // Filter out undefined values to prevent Firebase errors
    const cleanJobData = Object.fromEntries(
      Object.entries(jobData).filter(([_, value]) => value !== undefined)
    );
    
    const docRef = await addDoc(collection(db, JOBS_COLLECTION), {
      ...cleanJobData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    
    return docRef.id;
  } catch (error) {
    console.error('Error creating job:', error);
    throw error;
  }
};

// Update an existing job
export const updateJob = async (jobId: string, jobData: Partial<FirebaseJob>): Promise<void> => {
  try {
    // Filter out undefined values to prevent Firebase errors
    const cleanJobData = Object.fromEntries(
      Object.entries(jobData).filter(([_, value]) => value !== undefined)
    );
    
    const jobRef = doc(db, JOBS_COLLECTION, jobId);
    await updateDoc(jobRef, {
      ...cleanJobData,
      updatedAt: serverTimestamp()
    });
  } catch (error) {
    console.error('Error updating job:', error);
    throw error;
  }
};

// Delete a job
export const deleteJob = async (jobId: string): Promise<void> => {
  try {
    await deleteDoc(doc(db, JOBS_COLLECTION, jobId));
  } catch (error) {
    console.error('Error deleting job:', error);
    throw error;
  }
};

// Subscribe to real-time jobs updates
export const subscribeToJobs = (callback: (jobs: FirebaseJob[]) => void): (() => void) => {
  const jobsQuery = query(
    collection(db, JOBS_COLLECTION),
    orderBy('createdAt', 'desc')
  );
  
  return onSnapshot(jobsQuery, (snapshot) => {
    const jobs = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      postedTime: formatPostedTime(doc.data().createdAt)
    } as FirebaseJob));
    
    callback(jobs);
  }, (error) => {
    console.error('Error in jobs subscription:', error);
    
    // Provide helpful error messages
    if (error.code === 'permission-denied') {
      console.error('🔥 Firestore Permission Error: Please update your Firestore rules');
      console.error('💡 Go to Firebase Console > Firestore > Rules and allow read access to jobs collection');
    }
    
    // For development, you can provide empty array to prevent app crash
    callback([]);
  });
};

// Helper function to format posted time
const formatPostedTime = (timestamp: Timestamp | undefined): string => {
  if (!timestamp) return 'Just now';
  
  const now = new Date();
  const posted = timestamp.toDate();
  const diffInHours = Math.floor((now.getTime() - posted.getTime()) / (1000 * 60 * 60));
  
  if (diffInHours < 1) return 'Just now';
  if (diffInHours < 24) return `${diffInHours} hours ago`;
  
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays === 1) return '1 day ago';
  if (diffInDays < 7) return `${diffInDays} days ago`;
  
  const diffInWeeks = Math.floor(diffInDays / 7);
  if (diffInWeeks === 1) return '1 week ago';
  if (diffInWeeks < 4) return `${diffInWeeks} weeks ago`;
  
  return posted.toLocaleDateString();
};
