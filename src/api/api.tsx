import type {AccountInfo, WatchAddressResponse} from '@/types/algorand';

import axios, {AxiosError} from 'axios';
import NetInfo from '@react-native-community/netinfo';

// const ALGO_NODE_URL = 'https://mainnet-api.algonode.cloud';
const ALGO_NODE_URL = 'https://testnet-api.algonode.cloud';

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
      errorMessage = 'Please enter a valid Algorand address';
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
