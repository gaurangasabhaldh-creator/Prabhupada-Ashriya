import {create} from 'zustand';
import {CallStatus} from '@constants/callStatus';

interface PendingCallUpdate {
  callRecordId: string;
  status: CallStatus;
  notes: string | null;
}

interface CallingState {
  activeListId: string | null;
  pendingUpdates: Record<string, PendingCallUpdate>;
  isDirty: boolean;

  setActiveListId: (id: string | null) => void;
  setPendingUpdate: (
    callRecordId: string,
    update: Omit<PendingCallUpdate, 'callRecordId'>,
  ) => void;
  clearPendingUpdates: () => void;
}

export const useCallingStore = create<CallingState>(set => ({
  activeListId: null,
  pendingUpdates: {},
  isDirty: false,

  setActiveListId: id => set({activeListId: id}),

  setPendingUpdate: (callRecordId, update) =>
    set(state => ({
      pendingUpdates: {
        ...state.pendingUpdates,
        [callRecordId]: {callRecordId, ...update},
      },
      isDirty: true,
    })),

  clearPendingUpdates: () => set({pendingUpdates: {}, isDirty: false}),
}));
