// src/stores/useCoinCapStore.ts
import { defineStore } from 'pinia';
import { ref } from 'vue';

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

export const useCoinCapStore = defineStore('coinCap', () => {
  const assets = ref<Asset[]>([]);
  const asset = ref<Asset | null>(null);
  const history = ref<AssetHistory[]>([]);
  const loading = ref(false);

  const fetchAssets = async (limit: number = 20) => {
    loading.value = true;
    try {
      const response = await fetch(`${BASE_URL}/assets?limit=${limit}`);
      const data = await response.json();
      assets.value = data.data;
    } catch (error) {
      console.error('Error fetching assets:', error);
    } finally {
      loading.value = false;
    }
  };

  const fetchAssetById = async (id: string) => {
    loading.value = true;
    try {
      const response = await fetch(`${BASE_URL}/assets/${id}`);
      const data = await response.json();
      asset.value = data.data;
    } catch (error) {
      console.error(`Error fetching asset ${id}:`, error);
    } finally {
      loading.value = false;
    }
  };

  const fetchAssetHistory = async (id: string, interval: string = 'd1') => {
    loading.value = true;
    try {
      const response = await fetch(`${BASE_URL}/assets/${id}/history?interval=${interval}`);
      const data = await response.json();
      history.value = data.data;
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