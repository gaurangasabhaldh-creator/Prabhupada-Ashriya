import {create} from 'zustand';

type ToastType = 'success' | 'error' | 'info' | 'warning';

interface Toast {
  id: string;
  type: ToastType;
  message: string;
  duration?: number;
}

interface ConfirmModal {
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel?: () => void;
  destructive?: boolean;
}

interface UIState {
  // Toast
  toasts: Toast[];
  showToast: (params: {message: string; type: ToastType; duration?: number}) => void;
  dismissToast: (id: string) => void;

  // Confirm modal
  confirmModal: ConfirmModal | null;
  showConfirm: (modal: ConfirmModal) => void;
  dismissConfirm: () => void;

  // Global loading overlay
  globalLoading: boolean;
  setGlobalLoading: (loading: boolean) => void;
}

export const useUIStore = create<UIState>(set => ({
  toasts: [],
  showToast: ({type, message, duration = 3000}) =>
    set(state => ({
      toasts: [
        ...state.toasts,
        {id: Date.now().toString(), type, message, duration},
      ],
    })),
  dismissToast: id =>
    set(state => ({toasts: state.toasts.filter(t => t.id !== id)})),

  confirmModal: null,
  showConfirm: modal => set({confirmModal: modal}),
  dismissConfirm: () => set({confirmModal: null}),

  globalLoading: false,
  setGlobalLoading: globalLoading => set({globalLoading}),
}));
