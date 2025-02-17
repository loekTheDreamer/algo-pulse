import type {WatcherListItem} from '../../src/types/watcherList';
import {getSortedWatcherList} from '../../src/utils/watcherListSorter';

describe('WatcherList sorting', () => {
  const mockWatchers: WatcherListItem[] = [
    {
      address: 'JZNDHDIDO64MJX3W2CQBR5MAQQ6YAQS5NSREU7PSI5IOFU3F2MCTABH4ZM',
      amount: 1000000,
      'amount-without-pending-rewards': 990000,
      'apps-total-extra-pages': 0,
      'apps-local-state': [],
      'apps-total-schema': {
        'num-byte-slice': 0,
        'num-uint': 0,
      },
      assets: [],
      'created-apps': [],
      'created-assets': [],
      'min-balance': 100000,
      'pending-rewards': 10000,
      'reward-base': 200,
      rewards: 10000,
      'total-apps-opted-in': 0,
      'total-assets-opted-in': 0,
      'total-box-bytes': 0,
      'total-boxes': 0,
      'total-created-apps': 0,
      'total-created-assets': 0,
      round: 1000,
      status: 'Online',
      dateAdded: '2024-02-17T20:04:42.000Z',
    },
    {
      address: 'E23T55LR5KCVIYCEY2D7TUQNCQ7JHJFCO6IH5Y6CA3AVLMMOSRHCA7OJDE',
      amount: 2000000,
      'amount-without-pending-rewards': 1990000,
      'apps-total-extra-pages': 0,
      'apps-local-state': [],
      'apps-total-schema': {
        'num-byte-slice': 0,
        'num-uint': 0,
      },
      assets: [],
      'created-apps': [],
      'created-assets': [],
      'min-balance': 100000,
      'pending-rewards': 10000,
      'reward-base': 200,
      rewards: 10000,
      'total-apps-opted-in': 0,
      'total-assets-opted-in': 0,
      'total-box-bytes': 0,
      'total-boxes': 0,
      'total-created-apps': 0,
      'total-created-assets': 0,
      round: 1000,
      status: 'Online',
      dateAdded: '2024-02-17T20:04:42.000Z',
    },
  ];

  it('sorts watchers by amount in descending order', () => {
    const sorted = getSortedWatcherList(mockWatchers, 'amount');

    expect(sorted).toHaveLength(2);
    expect(sorted[0].address).toBe(
      'E23T55LR5KCVIYCEY2D7TUQNCQ7JHJFCO6IH5Y6CA3AVLMMOSRHCA7OJDE',
    );
    expect(sorted[0].amount).toBe(2000000);
    expect(sorted[1].address).toBe(
      'JZNDHDIDO64MJX3W2CQBR5MAQQ6YAQS5NSREU7PSI5IOFU3F2MCTABH4ZM',
    );
    expect(sorted[1].amount).toBe(1000000);
  });

  it('sorts watchers by calendar in ascending order', () => {
    const sorted = getSortedWatcherList(mockWatchers, 'calendar');

    expect(sorted).toHaveLength(2);
    // Since both have the same date, order should be preserved
    expect(sorted[0].address).toBe(
      'JZNDHDIDO64MJX3W2CQBR5MAQQ6YAQS5NSREU7PSI5IOFU3F2MCTABH4ZM',
    );
    expect(sorted[1].address).toBe(
      'E23T55LR5KCVIYCEY2D7TUQNCQ7JHJFCO6IH5Y6CA3AVLMMOSRHCA7OJDE',
    );
  });

  it('returns original list for unknown filter type', () => {
    const sorted = getSortedWatcherList(mockWatchers, 'unknown' as any);

    expect(sorted).toHaveLength(2);
    expect(sorted).toEqual(mockWatchers);
  });

  it('handles empty list', () => {
    const sorted = getSortedWatcherList([], 'amount');
    expect(sorted).toHaveLength(0);
  });
});
