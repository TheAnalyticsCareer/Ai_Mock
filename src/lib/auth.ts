
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut as firebaseSignOut,
  onAuthStateChanged,
  User as FirebaseUser
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from './firebase';
import { User } from '../types';

export const signUp = async (email: string, password: string): Promise<User> => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    const userData: User = {
      uid: user.uid,
      email: user.email!,
      displayName: user.displayName || undefined,
      createdAt: new Date()
    };
    
    await setDoc(doc(db, 'users', user.uid), userData);
    return userData;
  } catch (error) {
    console.error('Error signing up:', error);
    throw error;
  }
};

export const signIn = async (email: string, password: string): Promise<User> => {
  try {
    console.log('Attempting to sign in with:', email);
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    console.log('Firebase user authenticated:', user.uid);
    
    // Try to get user data, create if doesn't exist
    const userDoc = await getDoc(doc(db, 'users', user.uid));
    if (userDoc.exists()) {
      console.log('User data found in Firestore');
      return userDoc.data() as User;
    } else {
      console.log('User data not found, creating new user document');
      // Create user document if it doesn't exist
      const userData: User = {
        uid: user.uid,
        email: user.email!,
        displayName: user.displayName || undefined,
        createdAt: new Date()
      };
      await setDoc(doc(db, 'users', user.uid), userData);
      return userData;
    }
  } catch (error) {
    console.error('Error signing in:', error);
    throw error;
  }
};

export const signOut = async (): Promise<void> => {
  try {
    await firebaseSignOut(auth);
  } catch (error) {
    console.error('Error signing out:', error);
    throw error;
  }
};

export const getCurrentUser = (): Promise<FirebaseUser | null> => {
  return new Promise((resolve) => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      unsubscribe();
      console.log('Current user check:', user ? user.uid : 'No user');
      resolve(user);
    });
  });
};
