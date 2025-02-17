import axios from 'axios';

const BINANCE_API_BASE_URL = 'https://api.binance.com/api/v3';

interface BinanceTickerPrice {
  symbol: string;
  price: string;
}

/**
 * Fetches the current ALGO/USD price from Binance API
 * @returns Promise<number> The current ALGO price in USD
 * @throws Error if the API request fails
 */
export const fetchAlgoPrice = async (): Promise<number> => {
  try {
    // Binance uses USDT as a USD equivalent
    const response = await axios.get<BinanceTickerPrice>(
      `${BINANCE_API_BASE_URL}/ticker/price?symbol=ALGOUSDT`
    );

    return parseFloat(response.data.price);
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(`Failed to fetch ALGO price: ${error.message}`);
    }
    throw error;
  }
};
