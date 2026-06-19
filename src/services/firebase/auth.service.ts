import auth, {FirebaseAuthTypes} from '@react-native-firebase/auth';

export type FirebaseUser = FirebaseAuthTypes.User;

export const signIn = async (
  email: string,
  password: string,
): Promise<FirebaseUser> => {
  const {user} = await auth().signInWithEmailAndPassword(email, password);
  return user;
};

export const signUp = async (
  email: string,
  password: string,
): Promise<FirebaseUser> => {
  const {user} = await auth().createUserWithEmailAndPassword(email, password);
  return user;
};

export const signOut = async (): Promise<void> => {
  await auth().signOut();
};

export const sendPasswordReset = async (email: string): Promise<void> => {
  await auth().sendPasswordResetEmail(email);
};

export const updatePassword = async (newPassword: string): Promise<void> => {
  const currentUser = auth().currentUser;
  if (!currentUser) throw new Error('No authenticated user');
  await currentUser.updatePassword(newPassword);
};

export const onAuthStateChanged = (
  callback: (user: FirebaseUser | null) => void,
): (() => void) => auth().onAuthStateChanged(callback);

export const getCurrentUser = (): FirebaseUser | null => auth().currentUser;
