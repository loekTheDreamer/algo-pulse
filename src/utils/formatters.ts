import {CURRENCY} from '@/constants/currency';

/**
 * Formats a wallet address by showing the first and last n characters with ellipsis in between
 * @param address - The wallet address to format
 * @param prefixLength - Number of characters to show at the start (default: 4)
 * @param suffixLength - Number of characters to show at the end (default: 4)
 * @returns Formatted wallet address string
 */
export const formatWalletAddress = (
  address: string,
  prefixLength: number = 4,
  suffixLength: number = 4,
): string => {
  if (!address) {
    return '';
  }
  if (address.length <= prefixLength + suffixLength) {
    return address;
  }

  const prefix = address.slice(0, prefixLength);
  const suffix = address.slice(-suffixLength);

  return `${prefix}...${suffix}`;
};

/**
 * Converts and formats an amount from microAlgos to Algos
 * @param microAlgos - Raw amount from the blockchain in microAlgos (1 ALGO = 1,000,000 microAlgos)
 * @returns Formatted amount in Algos with proper decimal places and symbol (e.g. "1.5 ALGO")
 * @example
 * formatAlgoAmount(1500000) // returns "1.5 ALGO"
 * formatAlgoAmount(1000000) // returns "1 ALGO"
 * formatAlgoAmount(1000) // returns "0.001 ALGO"
 */
export const getAlgoAmount = (microAlgos: number): number => {
  return microAlgos / CURRENCY.ALGORAND.MICRO_UNITS;
};

export const formatAlgoAmount = (microAlgos: number): string => {
  const algos = getAlgoAmount(microAlgos);
  return algos.toLocaleString(undefined, {
    minimumFractionDigits: 0,
    maximumFractionDigits: CURRENCY.ALGORAND.DECIMALS,
  });
};
