<script setup>
import { ref, onMounted, watch, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useCoinCapStore } from '@/stores/coinCapApi';


const coinCapStore = useCoinCapStore();
const { fetchAssetById, fetchAssetHistory, formatCurrency, formatPercentage } = coinCapStore;

const route = useRoute();
const router = useRouter();
const id = route.params.id;
const asset = ref(null);
const history = ref([]);
const loading = ref(true);
const timeOption = ref({ label: '1D', value: 'm5', days: 1 });

const timeOptions = [
  { label: '1H', value: 'm1', days: 0.04 },
  { label: '1D', value: 'm5', days: 1 },
  { label: '1W', value: 'h1', days: 7 },
  { label: '1M', value: 'h12', days: 30 },
  { label: '1Y', value: 'd1', days: 365 },
];

const loadAssetData = async () => {
  try {
    loading.value = true;
    const assetData = await fetchAssetById(id);
    if (assetData) {
      asset.value = assetData;

      const endDate = new Date();
      const startDate = new Date();
      if (timeOption.value.days) {
        startDate.setDate(endDate.getDate() - timeOption.value.days);
      }

      const historyData = await fetchAssetHistory(id, timeOption.value.value);
      const filteredHistory = historyData.filter(
        (item) => new Date(item.date).getTime() >= startDate.getTime()
      );

      history.value = filteredHistory;
    }
  } catch (error) {
    console.error('Failed to fetch asset details:', error);
    toast.error('Failed to load asset details');
  } finally {
    loading.value = false;
  }
};

onMounted(loadAssetData);
watch([id, timeOption], loadAssetData);

const isPositive = computed(() => parseFloat(asset.value.changePercent24Hr) >= 0);
const chartColor = computed(() => (isPositive.value ? '#00CC66' : '#FF3366'));

const chartData = computed(() =>
  history.value.map((point) => ({
    time: new Date(point.time).toLocaleDateString(),
    price: parseFloat(point.priceUsd),
    tooltip: `${new Date(point.time).toLocaleString()}: ${formatCurrency(point.priceUsd)}`,
  }))
);

const setTimeOption = (option) => {
  timeOption.value = option;
};
</script>