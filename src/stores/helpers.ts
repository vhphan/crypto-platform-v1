import axios from "axios";
import {Ref} from "vue";

export const RATE_LIMIT_STATUS = 429;

export const fetchWithCache = async (url: string, cacheKey: string, expiry: number, lastFetched: Ref<{
    [key: string]: number
}>, loading: Ref<boolean>) => {
    loading.value = true;
    try {
        if (lastFetched.value[cacheKey] && Date.now() - lastFetched.value[cacheKey] < expiry) {
            return null;
        }

        const response = await axios.get(url);
        if (response.status === RATE_LIMIT_STATUS) {
            if (lastFetched.value[cacheKey]) {
                return null;
            }
        }
        lastFetched.value[cacheKey] = Date.now();
        return response.data;
    } catch (error) {
        console.error('Error fetching data:', error);
        throw error;
    } finally {
        loading.value = false;
    }
};

export const formatCurrency = (value: string | number): string => {
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

export const formatPercentage = (value: string): string => {
    const numValue = parseFloat(value);

    if (isNaN(numValue)) return '0.00%';

    return `${numValue >= 0 ? '+' : ''}${numValue.toFixed(2)}%`;
};