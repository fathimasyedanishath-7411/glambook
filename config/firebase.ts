import { initializeApp } from 'firebase/app';
import { getFirestore, setLogLevel } from 'firebase/firestore';
import fs from 'fs';
import path from 'path';

let db: any = null;
let firebaseApp: any = null;

// Suppress Firestore verbose debug, info, and warning logging (such as gRPC connection-idle disconnect streams) to keep logs pristine and clean.
try {
  setLogLevel('error');
} catch (e) {
  console.warn("Failed to set Firestore log-level:", e);
}

try {
  const configPath = path.join(process.cwd(), 'firebase-applet-config.json');
  if (fs.existsSync(configPath)) {
    const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
    firebaseApp = initializeApp(config);
    db = getFirestore(firebaseApp, config.firestoreDatabaseId || 'default');
    console.log("Server side Firebase connected to project:", config.projectId);
  } else {
    console.log("No firebase-applet-config.json found, running Express backend in Mock Mode.");
  }
} catch (error) {
  console.error("Firebase server initialization error. Working in standalone fallback mode.", error);
}

export { db, firebaseApp };
