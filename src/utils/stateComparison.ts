import type {AccountInfo} from '@/types/algorand';

export function compareAccountStates(
  lastState: AccountInfo,
  newState: AccountInfo,
): boolean {
  // Check basic balance and rewards changes
  if (
    lastState.amount !== newState.amount ||
    lastState['amount-without-pending-rewards'] !==
      newState['amount-without-pending-rewards'] ||
    lastState['pending-rewards'] !== newState['pending-rewards']
  ) {
    return true;
  }

  // Check asset-related changes
  if (
    lastState.assets?.length !== newState.assets?.length ||
    lastState['created-assets']?.length !==
      newState['created-assets']?.length ||
    lastState['total-assets-opted-in'] !== newState['total-assets-opted-in']
  ) {
    return true;
  }

  // Check individual asset changes
  const hasAssetChanges = lastState.assets?.some((lastAsset, index) => {
    const newAsset = newState.assets?.[index];
    return (
      lastAsset.amount !== newAsset?.amount ||
      lastAsset['is-frozen'] !== newAsset?.['is-frozen'] ||
      lastAsset['asset-id'] !== newAsset?.['asset-id']
    );
  });

  if (hasAssetChanges) {
    return true;
  }

  // Check application-related changes
  if (
    lastState['total-apps-opted-in'] !== newState['total-apps-opted-in'] ||
    lastState['total-created-apps'] !== newState['total-created-apps'] ||
    lastState['created-apps']?.length !== newState['created-apps']?.length
  ) {
    return true;
  }

  // Check box storage changes
  if (
    lastState['total-box-bytes'] !== newState['total-box-bytes'] ||
    lastState['total-boxes'] !== newState['total-boxes']
  ) {
    return true;
  }

  return false;
}
