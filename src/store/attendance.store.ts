import {create} from 'zustand';
import {AttendanceStatus} from '@constants/attendance';
import {DevoteeCategory} from '@constants/categories';

interface PendingMark {
  devoteeId: string;
  devoteeTeamId: string;
  status: AttendanceStatus;
  arrivalTime?: Date;
  notes?: string;
}

interface AttendanceState {
  selectedDate: Date;
  selectedCategory: DevoteeCategory | null;
  pendingMarks: Record<string, PendingMark>;
  isDirty: boolean;

  setSelectedDate: (date: Date) => void;
  setSelectedCategory: (category: DevoteeCategory | null) => void;
  setPendingMark: (devoteeId: string, mark: Omit<PendingMark, 'devoteeId'>) => void;
  getPendingMark: (devoteeId: string) => PendingMark | undefined;
  removePendingMark: (devoteeId: string) => void;
  clearPendingMarks: () => void;
}

export const useAttendanceStore = create<AttendanceState>(set => ({
  selectedDate: new Date(),
  selectedCategory: null,
  pendingMarks: {},
  isDirty: false,

  setSelectedDate: date => set({selectedDate: date}),

  setSelectedCategory: category => set({selectedCategory: category}),

  getPendingMark: devoteeId => useAttendanceStore.getState().pendingMarks[devoteeId],

  setPendingMark: (devoteeId, mark) =>
    set(state => ({
      pendingMarks: {...state.pendingMarks, [devoteeId]: {devoteeId, ...mark}},
      isDirty: true,
    })),

  removePendingMark: devoteeId =>
    set(state => {
      const {[devoteeId]: _, ...rest} = state.pendingMarks;
      return {pendingMarks: rest, isDirty: Object.keys(rest).length > 0};
    }),

  clearPendingMarks: () => set({pendingMarks: {}, isDirty: false}),
}));
