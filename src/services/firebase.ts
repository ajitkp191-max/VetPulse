import { initializeApp, getApps, getApp } from 'firebase/app';
import { initializeFirestore, getFirestore, Firestore, memoryLocalCache, setLogLevel } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import firebaseConfig from '../../firebase-applet-config.json';

// Suppress benign offline/reconnection warning notices in sandboxed iframe previews
setLogLevel('error');

// Initialize Firebase App
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Initialize Firestore with force long polling and clean memory cache for sandboxed preview iframe
let db: Firestore;
try {
  db = initializeFirestore(
    app,
    {
      experimentalForceLongPolling: true,
      localCache: memoryLocalCache(),
    },
    firebaseConfig.firestoreDatabaseId || undefined
  );
} catch {
  db = getFirestore(app, firebaseConfig.firestoreDatabaseId || undefined);
}

export { db };
export const auth = getAuth(app);
export default app;
