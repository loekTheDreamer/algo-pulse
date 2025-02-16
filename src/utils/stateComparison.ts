import type {AccountInfo} from '../api/api';

export function compareAccountStates(
  lastState: AccountInfo,
  newState: AccountInfo,
): boolean {
  return (
    lastState.amount !== newState.amount ||
    lastState['amount-without-pending-rewards'] !==
      newState['amount-without-pending-rewards'] ||
    lastState.assets?.length !== newState.assets?.length ||
    lastState['created-assets']?.length !== newState['created-assets']?.length
  );
}
