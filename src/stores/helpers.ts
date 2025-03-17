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
