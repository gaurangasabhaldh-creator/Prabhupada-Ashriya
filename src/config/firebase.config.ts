import firestore from '@react-native-firebase/firestore';

// Enable offline persistence with unlimited cache.
// Must be called before any other Firestore operation.
firestore().settings({
  persistence: true,
  cacheSizeBytes: firestore.CACHE_SIZE_UNLIMITED,
});

// Re-export service accessors so the rest of the app
// imports from this file rather than directly from the package.
export {default as firebaseAuth} from '@react-native-firebase/auth';
export {default as firebaseFirestore} from '@react-native-firebase/firestore';
export {default as firebaseStorage} from '@react-native-firebase/storage';
export {default as firebaseMessaging} from '@react-native-firebase/messaging';
