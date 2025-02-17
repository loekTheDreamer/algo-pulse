export interface AssetHolding {
  amount: number;
  'asset-id': number;
  'is-frozen': boolean;
}

export interface CreatedAsset {
  index: number;
  params: {
    clawback?: string;
    creator: string;
    decimals: number;
    'default-frozen'?: boolean;
    freeze?: string;
    manager?: string;
    'metadata-hash'?: string;
    name?: string;
    'name-b64'?: string;
    reserve?: string;
    total: number;
    'unit-name'?: string;
    'unit-name-b64'?: string;
    url?: string;
    'url-b64'?: string;
  };
}

export interface CreatedApp {
  id: number;
  params: {
    'approval-program': string;
    'clear-state-program': string;
    creator: string;
    'extra-program-pages': number;
    'global-state'?: Array<{
      key: string;
      value: {
        bytes?: string;
        type: number;
        uint?: number;
      };
    }>;
    'global-state-schema': {
      'num-byte-slice': number;
      'num-uint': number;
    };
    'local-state-schema': {
      'num-byte-slice': number;
      'num-uint': number;
    };
  };
}

export interface AccountInfo {
  address: string;
  amount: number;
  'amount-without-pending-rewards': number;
  'apps-total-extra-pages': number;
  'apps-local-state': any[];
  'apps-total-schema': {
    'num-byte-slice': number;
    'num-uint': number;
  };
  assets: AssetHolding[];
  'created-apps': CreatedApp[];
  'created-assets': CreatedAsset[];
  'min-balance': number;
  'pending-rewards': number;
  'reward-base': number;
  rewards: number;
  'total-apps-opted-in': number;
  'total-assets-opted-in': number;
  'total-box-bytes': number;
  'total-boxes': number;
  'total-created-apps': number;
  'total-created-assets': number;
  round: number;
  status: string;
}

export interface WatchAddressResponse {
  data: AccountInfo | null;
  error: string | null;
}
