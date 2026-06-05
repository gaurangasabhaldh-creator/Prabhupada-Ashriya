import {useQuery, useMutation, useQueryClient} from '@tanstack/react-query';
import {QUERY_KEYS} from '../queryKeys';
import {addNewComer, getNewComersForWeek} from '@services/firestore/attendance.repository';
import {useAuth} from '@hooks/auth/useAuth';
import {useUIStore} from '@store/ui.store';
import {toWeekString, toTimestamp} from '@utils/date.utils';
import {formatToE164} from '@utils/phone.utils';
import {parseError} from '@utils/error.utils';

export const useNewComers = (weekString?: string) => {
  const {organizationId} = useAuth();
  const week = weekString ?? toWeekString(new Date());

  return useQuery({
    queryKey: QUERY_KEYS.attendance.newComers(organizationId ?? '', week),
    queryFn: () => getNewComersForWeek(organizationId!, week),
    enabled: !!organizationId,
    staleTime: 2 * 60_000,
  });
};

interface NewComerFormData {
  fullName: string;
  mobileNumber: string;
  email?: string;
  invitedByName?: string;
  notes?: string;
  teamId?: string;
}

export const useAddNewComer = () => {
  const queryClient = useQueryClient();
  const {organizationId, user} = useAuth();
  const {showToast} = useUIStore();
  const weekString = toWeekString(new Date());

  return useMutation({
    mutationFn: (data: NewComerFormData) =>
      addNewComer({
        organizationId: organizationId!,
        teamId: data.teamId ?? null,
        fullName: data.fullName,
        mobileNumber: formatToE164(data.mobileNumber),
        email: data.email ?? null,
        invitedBy: null,
        invitedByName: data.invitedByName ?? null,
        firstVisitDate: toTimestamp(new Date()),
        followUpNotes: data.notes ?? null,
        isConverted: false,
        convertedDevoteeId: null,
        addedBy: user!.uid,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.attendance.newComers(organizationId ?? '', weekString),
      });
      showToast({type: 'success', message: 'New visitor added'});
    },
    onError: err => showToast({type: 'error', message: parseError(err).userMessage}),
  });
};
