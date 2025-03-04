// src/stores/useCoinCapStore.ts
import { defineStore } from 'pinia';
import { ref } from 'vue';
import axios from 'axios';

export interface Asset {
  id: string;
  rank: string;
  symbol: string;
  name: string;
  supply: string;
  maxSupply: string | null;
  marketCapUsd: string;
  volumeUsd24Hr: string;
  priceUsd: string;
  changePercent24Hr: string;
  vwap24Hr: string;
  explorer: string;
}

export interface AssetHistory {
  priceUsd: string;
  time: number;
  date: string;
}

const BASE_URL = 'https://api.coincap.io/v2';
const RATE_LIMIT_STATUS = 429;

export const useCoinCapStore = defineStore('coinCap', () => {
  const assets = ref<Asset[]>([]);
  const asset = ref<{ [key: string]: Asset }>({});
  const history = ref<AssetHistory[]>([]);
  const loading = ref(false);
  const lastFetched = ref<{ [key: string]: number }>({});

  const fetchWithCache = async (url: string, cacheKey: string, expiry: number) => {
    if (lastFetched.value[cacheKey] && Date.now() - lastFetched.value[cacheKey] < expiry) {
      return null;
    }

    try {
      const response = await axios.get(url);
      if (response.status === RATE_LIMIT_STATUS) {
        throw new Error('Rate limit exceeded');
      }
      lastFetched.value[cacheKey] = Date.now();
      return response.data;
    } catch (error) {
      console.error('Error fetching data:', error);
      throw error;
    }
  };

  const fetchAssets = async (limit: number = 100) => {
    loading.value = true;
    try {
      const data = await fetchWithCache(`${BASE_URL}/assets?limit=${limit}`, 'assets', 1_800_000); // 30 minute expiry
      if (data) assets.value = data.data;
    } catch (error) {
      console.error('Error fetching assets:', error);
    } finally {
      loading.value = false;
    }
  };

  const fetchAssetById = async (id: string) => {
    loading.value = true;
    try {
      const data = await fetchWithCache(`${BASE_URL}/assets/${id}`, `asset_${id}`, 600_000); // 10 minute expiry
      if (data) asset.value[id] = data.data;
    } catch (error) {
      console.error(`Error fetching asset ${id}:`, error);
    } finally {
      loading.value = false;
    }
  };

  const fetchAssetHistory = async (id: string, interval: string = 'd1') => {
    loading.value = true;
    try {
      const data = await fetchWithCache(`${BASE_URL}/assets/${id}/history?interval=${interval}`, `history_${id}_${interval}`, 3_600_000); // 1 hour expiry
      if (data) history.value = data.data;
    } catch (error) {
      console.error(`Error fetching history for asset ${id}:`, error);
    } finally {
      loading.value = false;
    }
  };

  const formatCurrency = (value: string | number): string => {
    const numValue = typeof value === 'string' ? parseFloat(value) : value;

    if (isNaN(numValue)) return '$0.00';

    if (numValue >= 1e9) {
      return `$${(numValue / 1e9).toFixed(2)}B`;
    } else if (numValue >= 1e6) {
      return `$${(numValue / 1e6).toFixed(2)}M`;
    } else if (numValue >= 1e3) {
      return `$${(numValue / 1e3).toFixed(2)}K`;
    } else if (numValue >= 1) {
      return `$${numValue.toFixed(2)}`;
    } else {
      // For very small values (less than $1)
      return `$${numValue.toFixed(6)}`;
    }
  };

  const formatPercentage = (value: string): string => {
    const numValue = parseFloat(value);

    if (isNaN(numValue)) return '0.00%';

    return `${numValue >= 0 ? '+' : ''}${numValue.toFixed(2)}%`;
  };

  return {
    assets,
    asset,
    history,
    loading,
    fetchAssets,
    fetchAssetById,
    fetchAssetHistory,
    formatCurrency,
    formatPercentage,
  };
});