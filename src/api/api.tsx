import axios, {AxiosError} from 'axios';
import NetInfo from '@react-native-community/netinfo';

// const ALGO_NODE_URL = 'https://mainnet-api.algonode.cloud';

const ALGO_NODE_URL = 'https://testnet-api.algonode.cloud';

export interface AccountInfo {
  address: string;
  amount: number;
  'amount-without-pending-rewards': number;
  'apps-local-state': any[];
  'apps-total-schema': {
    'num-byte-slice': number;
    'num-uint': number;
  };
  assets: any[];
  'created-apps': any[];
  'created-assets': any[];
  participation: any;
  'pending-rewards': number;
  'reward-base': number;
  rewards: number;
  round: number;
  status: string;
}

export interface WatchAddressResponse {
  data: AccountInfo | null;
  error: string | null;
}

// address with tokens
// CIAFMKNV3IPQJRYCGQ65J7IBPICHXYUOECJ3CPZFSK7DERCRJX2RH32MZA

// large
// J25ABPMWJLJECPMGWWM42BAG6BGILFY3VL732IAKP2YPCLURIE26LV6XYE

// my address
// XKXQJTM2K6Y7UAVKCQEGC5PRG2C24NOXSRSS2EAFAOSGKKHRLB4U4EO3EI
export const watchAddress = async (
  address: string,
): Promise<WatchAddressResponse> => {
  // Check network connectivity first
  const networkState = await NetInfo.fetch();

  if (!networkState.isConnected) {
    return {
      data: null,
      error: 'No internet connection. Please check your network settings.',
    };
  }

  try {
    const response = await axios.get<AccountInfo>(
      `${ALGO_NODE_URL}/v2/accounts/${address}`,
      {
        timeout: 10000, // 10 second timeout
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      },
    );

    return {
      data: response.data,
      error: null,
    };
  } catch (error) {
    const axiosError = error as AxiosError;
    let errorMessage = 'An unexpected error occurred';

    if (axiosError.response) {
      // Server responded with error status
      errorMessage = `Server error: ${axiosError.response.status}`;
    } else if (axiosError.request) {
      // Request made but no response received
      errorMessage = 'No response from server. Please try again.';
    } else if (axiosError.code === 'ECONNABORTED') {
      errorMessage = 'Request timed out. Please try again.';
    }

    return {
      data: null,
      error: errorMessage,
    };
  }
};
