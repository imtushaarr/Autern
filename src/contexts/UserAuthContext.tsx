import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  User,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail
} from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';

export interface UserProfile {
  uid: string;
  email: string;
  displayName?: string;
  userType: 'freelancer' | 'client';
  createdAt: Date;
  lastLoginAt: Date;
  profileCompleted: boolean;
  avatar?: string;
  // Freelancer specific fields
  skills?: string[];
  hourlyRate?: number;
  title?: string;
  description?: string;
  portfolio?: string[];
  // Client specific fields
  companyName?: string;
  companySize?: string;
  industry?: string;
}

export interface AdditionalUserInfo {
  displayName?: string;
  companyName?: string;
  companySize?: string;
  industry?: string;
  skills?: string[];
  hourlyRate?: number;
  title?: string;
  description?: string;
}

export interface UserAuthContextType {
  currentUser: User | null;
  userProfile: UserProfile | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, userType: 'freelancer' | 'client', additionalInfo?: AdditionalUserInfo) => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updateProfile: (profileData: Partial<UserProfile>) => Promise<void>;
  loading: boolean;
  isAuthenticated: boolean;
  userType: 'freelancer' | 'client' | null;
}

export const UserAuthContext = createContext<UserAuthContextType | undefined>(undefined);

interface UserAuthProviderProps {
  children: React.ReactNode;
}

export const UserAuthProvider: React.FC<UserAuthProviderProps> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  // Load user profile from Firestore
  const loadUserProfile = async (user: User): Promise<UserProfile | null> => {
    try {
      const userDocRef = doc(db, 'users', user.uid);
      const userDoc = await getDoc(userDocRef);
      
      if (userDoc.exists()) {
        const profileData = userDoc.data();
        return {
          uid: user.uid,
          email: user.email!,
          ...profileData,
          createdAt: profileData.createdAt?.toDate() || new Date(),
          lastLoginAt: profileData.lastLoginAt?.toDate() || new Date()
        } as UserProfile;
      }
      return null;
    } catch (error) {
      console.error('Error loading user profile:', error);
      return null;
    }
  };

  // Create user profile in Firestore
  const createUserProfile = async (
    user: User, 
    userType: 'freelancer' | 'client',
    additionalInfo: AdditionalUserInfo = {}
  ): Promise<UserProfile> => {
    const userProfile: UserProfile = {
      uid: user.uid,
      email: user.email!,
      displayName: user.displayName || additionalInfo.displayName || '',
      userType,
      createdAt: new Date(),
      lastLoginAt: new Date(),
      profileCompleted: false,
      ...additionalInfo
    };

    const userDocRef = doc(db, 'users', user.uid);
    await setDoc(userDocRef, userProfile);
    
    return userProfile;
  };

  const login = async (email: string, password: string): Promise<void> => {
    try {
      if (!email || !password) {
        throw new Error('Email and password are required');
      }

      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      // Load user profile
      const profile = await loadUserProfile(user);
      
      if (!profile) {
        await signOut(auth);
        throw new Error('User profile not found. Please contact support.');
      }
      
      // Update last login time
      const userDocRef = doc(db, 'users', user.uid);
      await updateDoc(userDocRef, {
        lastLoginAt: new Date()
      });
      
      setUserProfile({ ...profile, lastLoginAt: new Date() });
    } catch (error) {
      console.error('Login error:', error);
      
      if (error instanceof Error) {
        if (error.message.includes('auth/user-not-found') || 
            error.message.includes('auth/wrong-password') || 
            error.message.includes('auth/invalid-email')) {
          throw new Error('Invalid email or password');
        } else if (error.message.includes('auth/too-many-requests')) {
          throw new Error('Too many failed attempts. Please try again later.');
        } else if (error.message.includes('User profile not found')) {
          throw error;
        }
      }
      
      throw new Error('Login failed. Please try again.');
    }
  };

  const register = async (
    email: string, 
    password: string, 
    userType: 'freelancer' | 'client',
    additionalInfo: AdditionalUserInfo = {}
  ): Promise<void> => {
    try {
      if (!email || !password || !userType) {
        throw new Error('Email, password, and user type are required');
      }

      if (password.length < 6) {
        throw new Error('Password must be at least 6 characters');
      }

      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      // Create user profile
      const profile = await createUserProfile(user, userType, additionalInfo);
      setUserProfile(profile);
      
    } catch (error) {
      console.error('Registration error:', error);
      
      if (error instanceof Error) {
        if (error.message.includes('auth/email-already-in-use')) {
          throw new Error('An account with this email already exists');
        } else if (error.message.includes('auth/weak-password')) {
          throw new Error('Password is too weak');
        } else if (error.message.includes('auth/invalid-email')) {
          throw new Error('Invalid email address');
        }
      }
      
      throw new Error('Registration failed. Please try again.');
    }
  };

  const logout = async (): Promise<void> => {
    try {
      await signOut(auth);
      setCurrentUser(null);
      setUserProfile(null);
    } catch (error) {
      console.error('Logout error:', error);
      throw new Error('Logout failed');
    }
  };

  const resetPassword = async (email: string): Promise<void> => {
    try {
      await sendPasswordResetEmail(auth, email);
    } catch (error) {
      console.error('Password reset error:', error);
      throw new Error('Password reset failed');
    }
  };

  const updateProfile = async (profileData: Partial<UserProfile>): Promise<void> => {
    try {
      if (!currentUser || !userProfile) {
        throw new Error('User not authenticated');
      }

      const userDocRef = doc(db, 'users', currentUser.uid);
      await updateDoc(userDocRef, profileData);
      
      setUserProfile(prev => prev ? { ...prev, ...profileData } : null);
    } catch (error) {
      console.error('Profile update error:', error);
      throw new Error('Failed to update profile');
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setCurrentUser(user);
        const profile = await loadUserProfile(user);
        setUserProfile(profile);
      } else {
        setCurrentUser(null);
        setUserProfile(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value: UserAuthContextType = {
    currentUser,
    userProfile,
    login,
    register,
    logout,
    resetPassword,
    updateProfile,
    loading,
    isAuthenticated: !!currentUser && !!userProfile,
    userType: userProfile?.userType || null
  };

  return (
    <UserAuthContext.Provider value={value}>
      {!loading && children}
    </UserAuthContext.Provider>
  );
};
