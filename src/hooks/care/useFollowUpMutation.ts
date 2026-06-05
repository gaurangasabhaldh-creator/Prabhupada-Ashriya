import {useMutation, useQueryClient} from '@tanstack/react-query';
import {
  createFollowUp,
  updateFollowUpStatus,
  addFollowUpNote,
} from '@services/firestore/followup.repository';
import {QUERY_KEYS} from '../queryKeys';
import {useAuth} from '@hooks/auth/useAuth';
import {useUIStore} from '@store/ui.store';
import {FollowUpDocument, FollowUpNote} from '@mytypes/followUp.types';
import {FOLLOW_UP_STATUS, PRIORITY} from '@constants/callStatus';
import {nowTimestamp} from '@utils/date.utils';

export const useCreateFollowUp = () => {
  const {user, organizationId} = useAuth();
  const queryClient = useQueryClient();
  const showToast = useUIStore(s => s.showToast);

  return useMutation({
    mutationFn: async (data: {
      devoteeId: string;
      devoteeName: string;
      devoteeTeamId: string;
      devoteeTeamName: string;
      reason: FollowUpDocument['reason'];
    }) => {
      return createFollowUp({
        ...data,
        organizationId: organizationId!,
        priority: PRIORITY.MEDIUM,
        status: FOLLOW_UP_STATUS.NOT_CONTACTED,
        consecutiveAbsencesAtCreation: 0,
        lastAttendedDateAtCreation: null,
        assignedTo: user!.uid,
        assignedToName: user!.displayName ?? '',
        notes: [],
        lastContactDate: null,
        nextFollowUpDate: null,
        contactAttempts: 0,
        resolvedAt: null,
        resolvedBy: null,
        resolutionNote: null,
        autoCreated: false,
        isActive: true,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: QUERY_KEYS.care.followUps(organizationId ?? '', undefined)});
      showToast({message: 'Follow-up created', type: 'success'});
    },
    onError: (err: Error) => {
      showToast({message: err.message, type: 'error'});
    },
  });
};

export const useUpdateFollowUpStatus = (followUpId: string) => {
  const {user} = useAuth();
  const queryClient = useQueryClient();
  const showToast = useUIStore(s => s.showToast);

  return useMutation({
    mutationFn: async ({
      status,
      noteText,
    }: {
      status: FollowUpDocument['status'];
      noteText: string;
    }) => {
      if (!user) throw new Error('Not authenticated');
      const note: FollowUpNote = {
        note: noteText,
        addedBy: user.uid,
        addedByName: user.displayName ?? '',
        addedAt: nowTimestamp() as any,
      };
      await updateFollowUpStatus(followUpId, status, note);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: QUERY_KEYS.care.followUp(followUpId)});
      showToast({message: 'Status updated', type: 'success'});
    },
    onError: (err: Error) => {
      showToast({message: err.message, type: 'error'});
    },
  });
};

export const useAddFollowUpNote = (followUpId: string) => {
  const {user} = useAuth();
  const queryClient = useQueryClient();
  const showToast = useUIStore(s => s.showToast);

  return useMutation({
    mutationFn: async (noteText: string) => {
      if (!user) throw new Error('Not authenticated');
      const note: FollowUpNote = {
        note: noteText,
        addedBy: user.uid,
        addedByName: user.displayName ?? '',
        addedAt: nowTimestamp() as any,
      };
      await addFollowUpNote(followUpId, note);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: QUERY_KEYS.care.followUp(followUpId)});
      showToast({message: 'Note added', type: 'success'});
    },
    onError: (err: Error) => {
      showToast({message: err.message, type: 'error'});
    },
  });
};
