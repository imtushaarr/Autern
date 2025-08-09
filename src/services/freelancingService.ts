import { 
  collection, 
  doc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  getDoc, 
  getDocs, 
  query, 
  where, 
  orderBy, 
  limit, 
  startAfter,
  onSnapshot,
  writeBatch,
  serverTimestamp,
  Timestamp,
  QueryDocumentSnapshot,
  DocumentData
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { db, storage } from '@/lib/firebase';
import { 
  FreelancerProfile, 
  Project, 
  Proposal, 
  UserProfile,
  ChatRoom,
  ChatMessage,
  Contract,
  Review,
  Milestone 
} from '@/types/freelancing';

// Freelancer Profile Services
export const freelancerService = {
  async createProfile(profile: Omit<FreelancerProfile, 'id' | 'createdAt' | 'updatedAt'>) {
    const docRef = await addDoc(collection(db, 'freelancers'), {
      ...profile,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    return docRef.id;
  },

  async getProfile(freelancerId: string): Promise<FreelancerProfile | null> {
    const docRef = doc(db, 'freelancers', freelancerId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as FreelancerProfile;
    }
    return null;
  },

  async getProfileByUserId(userId: string): Promise<FreelancerProfile | null> {
    const q = query(
      collection(db, 'freelancers'), 
      where('userId', '==', userId),
      limit(1)
    );
    const querySnapshot = await getDocs(q);
    
    if (!querySnapshot.empty) {
      const doc = querySnapshot.docs[0];
      return { id: doc.id, ...doc.data() } as FreelancerProfile;
    }
    return null;
  },

  async updateProfile(freelancerId: string, updates: Partial<FreelancerProfile>) {
    const docRef = doc(db, 'freelancers', freelancerId);
    await updateDoc(docRef, {
      ...updates,
      updatedAt: serverTimestamp()
    });
  },

  async searchFreelancers(filters: {
    skills?: string[];
    category?: string;
    minRating?: number;
    maxHourlyRate?: number;
    availability?: string;
    location?: string;
  }, lastDoc?: QueryDocumentSnapshot<DocumentData>, limitCount: number = 10) {
    let q = query(collection(db, 'freelancers'));

    if (filters.skills?.length) {
      q = query(q, where('skills', 'array-contains-any', filters.skills));
    }
    
    if (filters.minRating) {
      q = query(q, where('rating', '>=', filters.minRating));
    }
    
    if (filters.maxHourlyRate) {
      q = query(q, where('hourlyRate', '<=', filters.maxHourlyRate));
    }
    
    if (filters.availability) {
      q = query(q, where('availability', '==', filters.availability));
    }

    q = query(q, orderBy('rating', 'desc'), limit(limitCount));
    
    if (lastDoc) {
      q = query(q, startAfter(lastDoc));
    }

    const querySnapshot = await getDocs(q);
    const freelancers = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as FreelancerProfile[];

    return {
      freelancers,
      lastDoc: querySnapshot.docs[querySnapshot.docs.length - 1] || null
    };
  }
};

// Project Services
export const projectService = {
  async createProject(project: Omit<Project, 'id' | 'createdAt' | 'updatedAt' | 'proposals'>) {
    const docRef = await addDoc(collection(db, 'projects'), {
      ...project,
      proposals: [],
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    return docRef.id;
  },

  async getProject(projectId: string): Promise<Project | null> {
    const docRef = doc(db, 'projects', projectId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as Project;
    }
    return null;
  },

  async updateProject(projectId: string, updates: Partial<Project>) {
    const docRef = doc(db, 'projects', projectId);
    await updateDoc(docRef, {
      ...updates,
      updatedAt: serverTimestamp()
    });
  },

  async searchProjects(filters: {
    category?: string;
    skills?: string[];
    budgetMin?: number;
    budgetMax?: number;
    experienceLevel?: string;
    status?: string;
  }, lastDoc?: QueryDocumentSnapshot<DocumentData>, limitCount: number = 10) {
    let q = query(collection(db, 'projects'), where('status', '==', 'open'));

    if (filters.category) {
      q = query(q, where('category', '==', filters.category));
    }
    
    if (filters.skills?.length) {
      q = query(q, where('skillsRequired', 'array-contains-any', filters.skills));
    }
    
    if (filters.experienceLevel) {
      q = query(q, where('experienceLevel', '==', filters.experienceLevel));
    }

    q = query(q, orderBy('createdAt', 'desc'), limit(limitCount));
    
    if (lastDoc) {
      q = query(q, startAfter(lastDoc));
    }

    const querySnapshot = await getDocs(q);
    const projects = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Project[];

    return {
      projects,
      lastDoc: querySnapshot.docs[querySnapshot.docs.length - 1] || null
    };
  },

  async getClientProjects(clientId: string) {
    const q = query(
      collection(db, 'projects'),
      where('clientId', '==', clientId),
      orderBy('createdAt', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Project[];
  }
};

// Proposal Services
export const proposalService = {
  async submitProposal(proposal: Omit<Proposal, 'id' | 'createdAt'>) {
    const batch = writeBatch(db);
    
    // Add proposal to proposals collection
    const proposalRef = doc(collection(db, 'proposals'));
    batch.set(proposalRef, {
      ...proposal,
      createdAt: serverTimestamp()
    });
    
    // Update project with proposal reference
    const projectRef = doc(db, 'projects', proposal.projectId);
    batch.update(projectRef, {
      updatedAt: serverTimestamp()
    });
    
    await batch.commit();
    return proposalRef.id;
  },

  async getProposal(proposalId: string): Promise<Proposal | null> {
    const docRef = doc(db, 'proposals', proposalId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as Proposal;
    }
    return null;
  },

  async getProjectProposals(projectId: string) {
    const q = query(
      collection(db, 'proposals'),
      where('projectId', '==', projectId),
      orderBy('createdAt', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Proposal[];
  },

  async getFreelancerProposals(freelancerId: string) {
    const q = query(
      collection(db, 'proposals'),
      where('freelancerId', '==', freelancerId),
      orderBy('createdAt', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Proposal[];
  },

  async updateProposalStatus(proposalId: string, status: Proposal['status']) {
    const docRef = doc(db, 'proposals', proposalId);
    await updateDoc(docRef, { status });
  }
};

// Chat Services
export const chatService = {
  async createChatRoom(room: Omit<ChatRoom, 'id' | 'createdAt'>) {
    const docRef = await addDoc(collection(db, 'chatRooms'), {
      ...room,
      createdAt: serverTimestamp()
    });
    return docRef.id;
  },

  async getChatRoom(chatId: string): Promise<ChatRoom | null> {
    const docRef = doc(db, 'chatRooms', chatId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as ChatRoom;
    }
    return null;
  },

  async getUserChatRooms(userId: string) {
    const q = query(
      collection(db, 'chatRooms'),
      where('clientId', '==', userId)
    );
    
    const q2 = query(
      collection(db, 'chatRooms'),
      where('freelancerId', '==', userId)
    );
    
    const [clientRooms, freelancerRooms] = await Promise.all([
      getDocs(q),
      getDocs(q2)
    ]);
    
    const rooms = [
      ...clientRooms.docs.map(doc => ({ id: doc.id, ...doc.data() })),
      ...freelancerRooms.docs.map(doc => ({ id: doc.id, ...doc.data() }))
    ] as ChatRoom[];
    
    return rooms.sort((a, b) => {
      const aTime = a.lastMessageAt instanceof Timestamp ? a.lastMessageAt.toDate() : 
                   a.lastMessageAt instanceof Date ? a.lastMessageAt : 
                   a.createdAt instanceof Timestamp ? a.createdAt.toDate() : new Date(a.createdAt);
      const bTime = b.lastMessageAt instanceof Timestamp ? b.lastMessageAt.toDate() : 
                   b.lastMessageAt instanceof Date ? b.lastMessageAt : 
                   b.createdAt instanceof Timestamp ? b.createdAt.toDate() : new Date(b.createdAt);
      return bTime.getTime() - aTime.getTime();
    });
  },

  async sendMessage(message: Omit<ChatMessage, 'id' | 'timestamp'>) {
    const batch = writeBatch(db);
    
    // Add message
    const messageRef = doc(collection(db, 'messages'));
    batch.set(messageRef, {
      ...message,
      timestamp: serverTimestamp()
    });
    
    // Update chat room
    const chatRef = doc(db, 'chatRooms', message.chatId);
    const unreadField = message.senderType === 'client' 
      ? 'unreadCount.freelancer' 
      : 'unreadCount.client';
    
    batch.update(chatRef, {
      lastMessage: message.content,
      lastMessageAt: serverTimestamp(),
      [unreadField]: serverTimestamp() // Will be incremented by client
    });
    
    await batch.commit();
    return messageRef.id;
  },

  async getChatMessages(chatId: string, lastDoc?: QueryDocumentSnapshot<DocumentData>, limitCount: number = 50) {
    let q = query(
      collection(db, 'messages'),
      where('chatId', '==', chatId),
      orderBy('timestamp', 'desc'),
      limit(limitCount)
    );
    
    if (lastDoc) {
      q = query(q, startAfter(lastDoc));
    }
    
    const querySnapshot = await getDocs(q);
    const messages = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as ChatMessage[];
    
    return {
      messages: messages.reverse(),
      lastDoc: querySnapshot.docs[querySnapshot.docs.length - 1] || null
    };
  },

  subscribeToChatMessages(chatId: string, callback: (messages: ChatMessage[]) => void) {
    const q = query(
      collection(db, 'messages'),
      where('chatId', '==', chatId),
      orderBy('timestamp', 'asc'),
      limit(50)
    );
    
    return onSnapshot(q, (snapshot) => {
      const messages = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as ChatMessage[];
      callback(messages);
    });
  },

  async markMessagesAsRead(chatId: string, userId: string, userType: 'client' | 'freelancer') {
    const batch = writeBatch(db);
    
    // Update messages
    const q = query(
      collection(db, 'messages'),
      where('chatId', '==', chatId),
      where('senderId', '!=', userId),
      where('isRead', '==', false)
    );
    
    const querySnapshot = await getDocs(q);
    querySnapshot.docs.forEach(doc => {
      batch.update(doc.ref, { isRead: true });
    });
    
    // Reset unread count
    const chatRef = doc(db, 'chatRooms', chatId);
    const unreadField = userType === 'client' 
      ? 'unreadCount.client' 
      : 'unreadCount.freelancer';
    
    batch.update(chatRef, {
      [unreadField]: 0
    });
    
    await batch.commit();
  }
};

// File Upload Service
export const fileService = {
  async uploadFile(file: File, path: string): Promise<string> {
    const storageRef = ref(storage, path);
    const snapshot = await uploadBytes(storageRef, file);
    return await getDownloadURL(snapshot.ref);
  },

  async deleteFile(url: string) {
    const fileRef = ref(storage, url);
    await deleteObject(fileRef);
  }
};

// User Profile Services
export const userService = {
  async createUserProfile(profile: Omit<UserProfile, 'id' | 'joinedAt'>) {
    const docRef = await addDoc(collection(db, 'userProfiles'), {
      ...profile,
      joinedAt: serverTimestamp()
    });
    return docRef.id;
  },

  async getUserProfile(userId: string): Promise<UserProfile | null> {
    const q = query(
      collection(db, 'userProfiles'),
      where('userId', '==', userId),
      limit(1)
    );
    
    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
      const doc = querySnapshot.docs[0];
      return { id: doc.id, ...doc.data() } as UserProfile;
    }
    return null;
  },

  async updateUserProfile(profileId: string, updates: Partial<UserProfile>) {
    const docRef = doc(db, 'userProfiles', profileId);
    await updateDoc(docRef, {
      ...updates,
      lastSeen: serverTimestamp()
    });
  }
};
