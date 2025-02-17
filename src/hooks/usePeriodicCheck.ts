import {useEffect} from 'react';
import {useWatcherListStore} from '@/store/useWatcherListStore';

export const usePeriodicCheck = () => {
  const {startPeriodicCheck, stopPeriodicCheck, _hasHydrated} =
    useWatcherListStore();

  useEffect(() => {
    if (_hasHydrated) {
      startPeriodicCheck();

      return () => {
        stopPeriodicCheck();
      };
    }
  }, [startPeriodicCheck, stopPeriodicCheck, _hasHydrated]);
};
