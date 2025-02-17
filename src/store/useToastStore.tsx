import {create} from 'zustand';

import {ToastState, ToastType} from '@/types/toast';

export const useToastStore = create<ToastState>()(set => ({
  message: '',
  type: 'info',
  visible: false,
  showToast: (message: string, type: ToastType = 'info') => {
    set({message, type, visible: true});
    setTimeout(() => {
      set({visible: false});
    }, 3000);
  },
  hideToast: () => set({visible: false}),
}));
