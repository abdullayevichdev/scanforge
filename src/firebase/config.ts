import { initializeApp, getApps, getApp, type FirebaseApp } from 'firebase/app';
import { 
  initializeFirestore, 
  getFirestore, 
  persistentLocalCache, 
  persistentMultipleTabManager,
  memoryLocalCache,
  type Firestore 
} from 'firebase/firestore';

export const firebaseConfig = {
  apiKey: "AIzaSyBnZOWCoHiKv7aU9yIlibwVTvav6heXnzI",
  authDomain: "scandesign-aaa700.firebaseapp.com",
  databaseURL: "https://scandesign-aaa700-default-rtdb.firebaseio.com",
  projectId: "scandesign-aaa700",
  storageBucket: "scandesign-aaa700.firebasestorage.app",
  messagingSenderId: "132191035328",
  appId: "1:132191035328:web:723d622085691ea6bdf225",
  measurementId: "G-KCZT0MMNTZ"
};

// Initialize Firebase App singleton
export const app: FirebaseApp = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

// Initialize Firestore with modern persistent cache configuration (Firebase v9.8.0+ / v12.19.0+)
// Replaces deprecated enableIndexedDbPersistence() with FirestoreSettings.localCache
function initFirestoreInstance(): Firestore {
  try {
    if (typeof window !== 'undefined') {
      return initializeFirestore(app, {
        localCache: persistentLocalCache({
          tabManager: persistentMultipleTabManager()
        })
      });
    } else {
      return initializeFirestore(app, {
        localCache: memoryLocalCache()
      });
    }
  } catch {
    // If instance was already initialized with settings, return existing instance
    return getFirestore(app);
  }
}

export const db: Firestore = initFirestoreInstance();
