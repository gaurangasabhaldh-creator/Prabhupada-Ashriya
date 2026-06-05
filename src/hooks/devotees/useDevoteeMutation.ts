import {useMutation, useQueryClient} from '@tanstack/react-query';
import {QUERY_KEYS} from '../queryKeys';
import {
  createDevotee,
  updateDevotee,
  deleteDevotee,
  checkMobileExists,
} from '@services/firestore/devotees.repository';
import {uploadProfilePhoto} from '@services/firebase/storage.service';
import {useAuth} from '@hooks/auth/useAuth';
import {useUIStore} from '@store/ui.store';
import {parseError} from '@utils/error.utils';
import {CreateDevoteePayload, UpdateDevoteePayload} from '@mytypes/devotee.types';

interface CreateInput {
  payload: CreateDevoteePayload;
  photoUri?: string;
}

interface UpdateInput {
  id: string;
  updates: UpdateDevoteePayload;
  photoUri?: string;
}

export const useCreateDevotee = () => {
  const queryClient = useQueryClient();
  const {organizationId} = useAuth();
  const {showToast} = useUIStore();

  return useMutation({
    mutationFn: async ({payload, photoUri}: CreateInput) => {
      // Duplicate mobile check
      const exists = await checkMobileExists(organizationId!, payload.mobileNumber);
      if (exists) throw new Error('DUPLICATE_MOBILE');

      const id = await createDevotee({...payload, organizationId: organizationId!});

      // Upload photo after doc created
      if (photoUri) {
        const url = await uploadProfilePhoto(organizationId!, id, photoUri);
        await updateDevotee(id, {photoURL: url});
      }

      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: QUERY_KEYS.devotees.all});
      showToast({type: 'success', message: 'Devotee added successfully'});
    },
    onError: err => {
      const msg =
        (err as Error).message === 'DUPLICATE_MOBILE'
          ? 'A devotee with this mobile number already exists.'
          : parseError(err).userMessage;
      showToast({type: 'error', message: msg});
    },
  });
};

export const useUpdateDevotee = () => {
  const queryClient = useQueryClient();
  const {organizationId} = useAuth();
  const {showToast} = useUIStore();

  return useMutation({
    mutationFn: async ({id, updates, photoUri}: UpdateInput) => {
      // Check mobile uniqueness if changed
      if (updates.mobileNumber) {
        const exists = await checkMobileExists(organizationId!, updates.mobileNumber, id);
        if (exists) throw new Error('DUPLICATE_MOBILE');
      }

      if (photoUri) {
        const url = await uploadProfilePhoto(organizationId!, id, photoUri);
        updates = {...updates, photoURL: url};
      }

      return updateDevotee(id, updates);
    },
    onSuccess: (_data, {id}) => {
      queryClient.invalidateQueries({queryKey: QUERY_KEYS.devotees.detail(id)});
      queryClient.invalidateQueries({queryKey: QUERY_KEYS.devotees.all});
      showToast({type: 'success', message: 'Profile updated'});
    },
    onError: err => {
      const msg =
        (err as Error).message === 'DUPLICATE_MOBILE'
          ? 'A devotee with this mobile number already exists.'
          : parseError(err).userMessage;
      showToast({type: 'error', message: msg});
    },
  });
};

export const useDeleteDevotee = () => {
  const queryClient = useQueryClient();
  const {showToast} = useUIStore();

  return useMutation({
    mutationFn: (id: string) => deleteDevotee(id),
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: QUERY_KEYS.devotees.all});
      showToast({type: 'success', message: 'Devotee removed'});
    },
    onError: err => showToast({type: 'error', message: parseError(err).userMessage}),
  });
};

