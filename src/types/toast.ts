export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface ToastState {
  message: string;
  type: ToastType;
  visible: boolean;
  showToast: (message: string, type?: ToastType) => void;
  hideToast: () => void;
}
