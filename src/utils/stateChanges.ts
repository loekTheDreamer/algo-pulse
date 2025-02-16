import type {AccountInfo} from '../api/api';

/**
 * Compares two account states and returns true if there are meaningful changes
 */
export function detectStateChanges(
  oldState: AccountInfo,
  newState: AccountInfo,
): boolean {
  // Check if round has increased
  if (newState.round <= oldState.round) {
    return false; // No new changes if round hasn't increased
  }

  // Check for balance changes
  if (
    newState.amount !== oldState.amount ||
    newState['amount-without-pending-rewards'] !==
      oldState['amount-without-pending-rewards'] ||
    newState['pending-rewards'] !== oldState['pending-rewards']
  ) {
    return true;
  }

  // Check for changes in assets
  if (JSON.stringify(newState.assets) !== JSON.stringify(oldState.assets)) {
    return true;
  }

  // Check for changes in created assets
  if (
    JSON.stringify(newState['created-assets']) !==
    JSON.stringify(oldState['created-assets'])
  ) {
    return true;
  }

  // Check for changes in apps state
  if (
    JSON.stringify(newState['apps-local-state']) !==
    JSON.stringify(oldState['apps-local-state'])
  ) {
    return true;
  }

  return false;
}
