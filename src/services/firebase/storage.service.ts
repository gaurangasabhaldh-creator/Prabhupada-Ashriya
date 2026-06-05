import storage from '@react-native-firebase/storage';

const MAX_IMAGE_SIZE_MB = 2;
const MAX_IMAGE_SIZE_BYTES = MAX_IMAGE_SIZE_MB * 1024 * 1024;

export const uploadProfilePhoto = async (
  organizationId: string,
  devoteeId: string,
  localUri: string,
): Promise<string> => {
  const path = `organizations/${organizationId}/devotees/${devoteeId}/profile.jpg`;
  const ref = storage().ref(path);

  await ref.putFile(localUri);
  return ref.getDownloadURL();
};

export const deleteProfilePhoto = async (downloadURL: string): Promise<void> => {
  await storage().refFromURL(downloadURL).delete();
};

export const getUploadProgress = (
  organizationId: string,
  devoteeId: string,
  localUri: string,
  onProgress: (pct: number) => void,
): Promise<string> => {
  const path = `organizations/${organizationId}/devotees/${devoteeId}/profile.jpg`;
  const ref = storage().ref(path);
  const task = ref.putFile(localUri);

  task.on('state_changed', snapshot => {
    const pct = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
    onProgress(Math.round(pct));
  });

  return task.then(() => ref.getDownloadURL());
};

export {MAX_IMAGE_SIZE_BYTES};
