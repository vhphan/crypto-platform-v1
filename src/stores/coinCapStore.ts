// src/stores/useCoinCapStore.ts
import {defineStore} from 'pinia';
import {computed, ref} from 'vue';
import {fetchWithCache} from "@/stores/helpers";

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

// The Rest API base URL has changed from api.coincap.io/v2/ to: rest.coincap.io/v3/

// const BASE_URL = 'https://api.coincap.io/v2';
const BASE_URL = 'http://localhost:3000/api/coin-cap';
export const timeOptions = [
    {label: '1H', value: 'm1'},
    {label: '1D', value: 'm5'},
    {label: '1W', value: 'h1'},
    {label: '1M', value: 'h12'},
    {label: '1Y', value: 'd1'},
];


export const useCoinCapStore = defineStore('coinCap', () => {
    const assets = ref<Asset[]>([]);
    const asset = ref<{ [key: string]: Asset }>({});
    const history = ref<{ [key: string]: { [interval: string]: AssetHistory[] } }>({});
    const loading = ref(false);
    const lastFetched = ref<{ [key: string]: number }>({});
    const numberOfAssets = ref<number>(9);
    const timeOption = ref<string>('m5');

    // create getter called assetsToDisplay
    const assetsToDisplay = computed(() => {
        return assets.value.slice(0, numberOfAssets.value);
    })


    const fetchAssets = async (limit: number = 100) => {
        try {
            const data = await fetchWithCache(`${BASE_URL}/assets?limit=${limit}`, 'assets', 1_800_000, lastFetched, loading); // 30 minute expiry
            if (data) assets.value = data.data;
        } catch (error) {
            console.error('Error fetching assets:', error);
        }
    };

    const fetchAssetById = async (id: string) => {
        try {
            const data = await fetchWithCache(`${BASE_URL}/assets/${id}`, `asset_${id}`, 1_800_000, lastFetched, loading);
            if (data) asset.value[id] = data.data;
        } catch (error) {
            console.error(`Error fetching asset ${id}:`, error);
        }
    };

    const fetchAssetHistory = async (id: string, interval: string = 'd1') => {
        try {
            const data = await fetchWithCache(`${BASE_URL}/assets/${id}/history?interval=${interval}`, `history_${id}_${interval}`, 3_600_000, lastFetched, loading); // 1 hour expiry
            if (data) {
                if (!history.value[id]) history.value[id] = {};
                history.value[id][interval] = data.data;
            }
        } catch (error) {
            console.error(`Error fetching history for asset ${id}:`, error);
        }
    };




    return {
        assets,
        assetsToDisplay,
        asset,
        history,
        loading,
        fetchAssets,
        fetchAssetById,
        fetchAssetHistory,
        timeOption
    };
});