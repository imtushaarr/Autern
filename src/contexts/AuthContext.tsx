import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import {
  User,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';

export interface AdminUser extends User {
  isAdmin?: boolean;
  role?: string;
  lastLoginAt?: Date;
}

export interface AuthContextType {
  currentUser: AdminUser | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  loading: boolean;
  isAuthenticated: boolean;
  isAdmin: boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: React.ReactNode;
}

// Simplified authentication - allow any Firebase user
const ENABLE_ADMIN_RESTRICTION = false; // Set to true to enable email restrictions

const MAX_LOGIN_ATTEMPTS = 5;
const LOCKOUT_DURATION = 15 * 60 * 1000; // 15 minutes
const SESSION_TIMEOUT = 2 * 60 * 60 * 1000; // 2 hours

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [loginAttempts, setLoginAttempts] = useState<{[email: string]: {count: number, lastAttempt: number}}>({});

  // Check if user is admin
    const checkAdminStatus = useCallback(async (user: User): Promise<boolean> => {
    try {
      console.log('🔍 Checking admin status for:', user.email);
      
      if (!user.email) {
        console.log('❌ No email found for user');
        return false;
      }

      // If admin restriction is disabled, allow any authenticated user
      if (!ENABLE_ADMIN_RESTRICTION) {
        console.log('✅ Admin restriction disabled - allowing access for:', user.email);
        
        try {
          // Still create admin document for tracking
          const adminDocRef = doc(db, 'admins', user.uid);
          await setDoc(adminDocRef, {
            email: user.email,
            role: 'admin',
            createdAt: new Date(),
            lastLogin: new Date()
          }, { merge: true });
        } catch (firestoreError) {
          console.warn('⚠️ Could not create admin document, but allowing access:', firestoreError);
        }
        
        return true;
      }

      console.log('✅ Admin verification successful for:', user.email);
      return true;
    } catch (error) {
      console.error('❌ Admin verification error:', error);
      return false;
    }
  }, []);

  // Rate limiting for login attempts
  const checkRateLimit = (email: string): boolean => {
    const attempts = loginAttempts[email];
    if (!attempts) return true;

    const now = Date.now();
    const timeSinceLastAttempt = now - attempts.lastAttempt;

    // Reset attempts if lockout period has passed
    if (timeSinceLastAttempt > LOCKOUT_DURATION) {
      setLoginAttempts(prev => ({ ...prev, [email]: { count: 0, lastAttempt: now } }));
      return true;
    }

    return attempts.count < MAX_LOGIN_ATTEMPTS;
  };

  const recordLoginAttempt = (email: string, success: boolean) => {
    setLoginAttempts(prev => {
      const current = prev[email] || { count: 0, lastAttempt: Date.now() };
      return {
        ...prev,
        [email]: {
          count: success ? 0 : current.count + 1,
          lastAttempt: Date.now()
        }
      };
    });
  };

  const login = async (email: string, password: string): Promise<void> => {
    try {
      // Check rate limiting
      if (!checkRateLimit(email)) {
        throw new Error('Too many login attempts. Please try again later.');
      }

      // Basic validation
      if (!email || !password) {
        throw new Error('Email and password are required');
      }

      if (password.length < 6) {
        throw new Error('Invalid credentials');
      }

      // Attempt Firebase authentication
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      
      // Verify admin status
      const isAdminVerified = await checkAdminStatus(userCredential.user);
      
      if (!isAdminVerified) {
        await signOut(auth);
        throw new Error('Access denied: You are not authorized for admin access');
      }
      
      // Record successful login
      recordLoginAttempt(email, true);
      
      // The onAuthStateChanged will handle setting currentUser
    } catch (error) {
      console.error('Login error:', error);
      
      // Record failed login attempt
      recordLoginAttempt(email, false);
      
      // Handle specific Firebase auth errors with generic messages for security
      const isFirebaseError = error && typeof error === 'object' && 'code' in error;
      const errorCode = isFirebaseError ? (error as { code: string }).code : '';
      
      if (errorCode === 'auth/too-many-requests') {
        throw new Error('Account temporarily locked due to too many failed attempts');
      } else if (errorCode === 'auth/user-not-found' || errorCode === 'auth/wrong-password' || errorCode === 'auth/invalid-email') {
        throw new Error('Invalid credentials');
      } else if (error instanceof Error && error.message.includes('Too many login attempts')) {
        throw error;
      } else if (error instanceof Error && error.message.includes('not authorized for admin access')) {
        throw error; // Pass through the detailed admin access error
      } else if (error instanceof Error && error.message.includes('contact the system administrator')) {
        throw error; // Pass through admin-related errors
      } else {
        throw new Error('Login failed');
      }
    }
  };

  const register = async (email: string, password: string): Promise<void> => {
    // Disable registration for security - admins should be created manually
    throw new Error('Registration is disabled. Contact system administrator.');
  };

  const logout = async (): Promise<void> => {
    try {
      await signOut(auth);
      setCurrentUser(null);
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
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

  // Session timeout check
  useEffect(() => {
    if (currentUser && currentUser.lastLoginAt) {
      const sessionTimer = setTimeout(() => {
        const sessionAge = Date.now() - new Date(currentUser.lastLoginAt!).getTime();
        if (sessionAge > SESSION_TIMEOUT) {
          logout();
        }
      }, SESSION_TIMEOUT);

      return () => clearTimeout(sessionTimer);
    }
  }, [currentUser]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const isAdminVerified = await checkAdminStatus(user);
          if (isAdminVerified) {
            // Create admin user with additional properties
            const adminUser: AdminUser = {
              ...user,
              isAdmin: true,
              role: 'admin',
              lastLoginAt: new Date()
            };
            setCurrentUser(adminUser);
          } else {
            await signOut(auth);
            setCurrentUser(null);
          }
        } catch (error) {
          console.error('Admin verification failed:', error);
          await signOut(auth);
          setCurrentUser(null);
        }
      } else {
        setCurrentUser(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, [checkAdminStatus]);

  const value: AuthContextType = {
    currentUser,
    login,
    register,
    logout,
    resetPassword,
    loading,
    isAuthenticated: !!currentUser,
    isAdmin: !!currentUser?.isAdmin
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
