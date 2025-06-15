
import { 
  collection, 
  addDoc, 
  getDocs, 
  doc, 
  updateDoc, 
  getDoc,
  query,
  where,
  orderBy,
  Timestamp
} from 'firebase/firestore';
import { db } from './firebase';
import { Interview, Feedback, Transcript } from '../types';
import { COVER_IMAGES } from '../constants';

export const createInterview = async (
  userId: string,
  role: string,
  level: 'junior' | 'mid' | 'senior',
  techStack: string[],
  numberOfQuestions: number
): Promise<string> => {
  try {
    const randomCover = COVER_IMAGES[Math.floor(Math.random() * COVER_IMAGES.length)];
    
    const interview: Omit<Interview, 'id'> = {
      userId,
      role,
      level,
      techStack,
      numberOfQuestions,
      status: 'pending',
      finalized: false,
      createdAt: new Date(),
      coverImage: randomCover
    };
    
    const docRef = await addDoc(collection(db, 'interviews'), interview);
    console.log('Interview created with ID:', docRef.id);
    return docRef.id;
  } catch (error) {
    console.error('Error creating interview:', error);
    throw error;
  }
};

export const getInterviewsByUserId = async (userId: string): Promise<Interview[]> => {
  try {
    // Use a simpler query that doesn't require a composite index
    // We'll fetch by userId only and sort on the client side
    const q = query(
      collection(db, 'interviews'),
      where('userId', '==', userId)
    );
    
    const querySnapshot = await getDocs(q);
    const interviews: Interview[] = [];
    
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      // Convert Firestore Timestamps to Date objects
      const interview = {
        id: doc.id,
        ...data,
        createdAt: data.createdAt?.toDate() || new Date(),
        completedAt: data.completedAt?.toDate() || undefined,
      } as Interview;
      interviews.push(interview);
    });
    
    // Sort by createdAt on the client side (most recent first)
    interviews.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    
    console.log('Loaded interviews:', interviews);
    return interviews;
  } catch (error) {
    console.error('Error fetching interviews:', error);
    throw error;
  }
};

export const updateInterviewTranscript = async (
  interviewId: string,
  transcript: Transcript[]
): Promise<void> => {
  try {
    const interviewRef = doc(db, 'interviews', interviewId);
    await updateDoc(interviewRef, { 
      transcript,
      status: 'in-progress' // Update status when transcript is updated
    });
    console.log('Interview transcript updated:', interviewId);
  } catch (error) {
    console.error('Error updating transcript:', error);
    throw error;
  }
};

export const finalizeInterview = async (
  interviewId: string,
  feedback: Feedback,
  score: number
): Promise<void> => {
  try {
    const interviewRef = doc(db, 'interviews', interviewId);
    await updateDoc(interviewRef, {
      finalized: true,
      status: 'completed',
      completedAt: new Date(),
      feedback,
      score
    });
    console.log('Interview finalized:', interviewId);
  } catch (error) {
    console.error('Error finalizing interview:', error);
    throw error;
  }
};

export const getInterviewById = async (interviewId: string): Promise<Interview | null> => {
  try {
    const interviewDoc = await getDoc(doc(db, 'interviews', interviewId));
    if (interviewDoc.exists()) {
      const data = interviewDoc.data();
      // Convert Firestore Timestamps to Date objects
      const interview = {
        id: interviewDoc.id,
        ...data,
        createdAt: data.createdAt?.toDate() || new Date(),
        completedAt: data.completedAt?.toDate() || undefined,
        // Convert transcript timestamps if they exist
        transcript: data.transcript?.map((entry: any) => ({
          ...entry,
          timestamp: entry.timestamp?.toDate() || new Date()
        })) || undefined
      } as Interview;
      console.log('Interview loaded:', interview);
      return interview;
    }
    console.log('Interview not found:', interviewId);
    return null;
  } catch (error) {
    console.error('Error fetching interview:', error);
    throw error;
  }
};

// Mock AI feedback generation (replace with actual AI service)
export const generateFeedback = (transcript: Transcript[]): Feedback => {
  // This is a mock implementation - replace with actual AI analysis
  const mockScore = Math.floor(Math.random() * 30) + 70; // 70-100
  
  return {
    overallScore: mockScore,
    categories: {
      communication: Math.floor(Math.random() * 20) + 80,
      problemSolving: Math.floor(Math.random() * 25) + 75,
      technicalKnowledge: Math.floor(Math.random() * 30) + 70,
      codeQuality: Math.floor(Math.random() * 25) + 75
    },
    strengths: [
      'Clear communication of thought process',
      'Good understanding of core concepts',
      'Effective problem-solving approach'
    ],
    improvements: [
      'Could improve on explaining edge cases',
      'Consider discussing trade-offs more thoroughly',
      'Practice coding implementation speed'
    ],
    summary: 'Overall strong performance with good technical knowledge and communication skills. Focus on implementation details and edge case handling for improvement.'
  };
};
