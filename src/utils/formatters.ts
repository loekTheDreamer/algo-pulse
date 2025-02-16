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
  suffixLength: number = 4
): string => {
  if (!address) return '';
  if (address.length <= prefixLength + suffixLength) return address;
  
  const prefix = address.slice(0, prefixLength);
  const suffix = address.slice(-suffixLength);
  
  return `${prefix}...${suffix}`;
};
