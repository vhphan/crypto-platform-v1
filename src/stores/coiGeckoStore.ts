import {defineStore} from "pinia";
import {ref} from "vue";
import Axios from "axios";
import {setupCache} from 'axios-cache-interceptor';

const instance = Axios.create();
const axios = setupCache(instance);

const BASE_URL = 'https://api.coingecko.com/api/v3';

export interface Cryptocurrency {
    id: string;
    symbol: string;
    name: string;
    image: string;
    current_price: number;
    price_change_percentage_24h: number;
    market_cap: number;
}

export const useCoinCGeckoStore = defineStore('coinGecko', () => {

    const cryptocurrencies = ref<Cryptocurrency[]>([]);
    const loading = ref(false);
    const error = ref('');

    const fetchCryptoData = async (pageNum: number = 1, perPage: number = 20): Promise<void> => {
        try {
            loading.value = true;
            const response = await axios.get(
                `${BASE_URL}/coins/markets`,
                {
                    params: {
                        vs_currency: 'usd',
                        order: 'market_cap_desc',
                        per_page: perPage,
                        page: pageNum,
                        sparkline: false
                    }
                }
            );
            cryptocurrencies.value = response.data;
        } catch (e) {
            error.value = 'Failed to fetch cryptocurrency data';
            console.error('Error fetching cryptocurrency data:', e);
        } finally {
            loading.value = false;
        }
    };

    return {
        cryptocurrencies,
        loading,
        error,
        fetchCryptoData
    }
});