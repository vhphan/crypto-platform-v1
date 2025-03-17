<script setup>
import { computed, onMounted, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { timeOptions, useCoinCapStore } from '@/stores/coinCapStore.ts';
// import LineChart from '../components/LineChart.vue';
import LineChartApex from "@/components/LineChartApex.vue";
import { storeToRefs } from "pinia";


const coinCapStore = useCoinCapStore();
const {fetchAssetById, fetchAssetHistory, formatCurrency, formatPercentage} = coinCapStore;
const {timeOption} = storeToRefs(coinCapStore);
const route = useRoute();
const router = useRouter();
const id = route.params.id;
const loading = ref(true);


const asset = computed(() => coinCapStore.assets.find((asset) => asset.id === id) || {});
const history = computed(() => coinCapStore.history[id]?.[timeOption.value] || []);



const loadAssetData = async () => {
  try {
    loading.value = true;
    await fetchAssetById(id);
    if (asset.value) {
      await fetchAssetHistory(id, timeOption.value);
    }
  } catch (error) {
    console.error('Failed to fetch asset details:', error);
  } finally {
    loading.value = false;
  }
};

onMounted(loadAssetData);

onMounted(() => {
//   if asset is an empty object, redirect to home page
  if (Object.keys(asset.value).length === 0) {
    router.push('/');
  }


})


watch([() => route.params.id, () => timeOption.value], loadAssetData);

const chartData = computed(() =>
    history.value.map((point) => ({
      // time: new Date(point.time).toLocaleString(),
      time: new Date(point.time),
      price: parseFloat(point.priceUsd),
    }))
);

const chartColor = computed(() => (asset.value && parseFloat(asset.value.changePercent24Hr) >= 0 ? '#00CC66' : '#FF3366'));
</script>
<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <v-card class="asset-detail-card">

          <v-card-title class="asset-header">

            <v-row>

              <v-col cols="1">
                <v-avatar :rounded="false" class="rank-avatar">{{ asset.rank }}</v-avatar>
              </v-col>

              <v-col cols="5">
                <div class="asset-name"> {{ asset.name }}</div>
                <div class="asset-symbol"> {{ asset.symbol }}</div>
              </v-col>

              <v-col cols="6">
                <div class="asset-price">{{ formatCurrency(asset.priceUsd) }}</div>
                <div class="asset-price-change"
                     :class="{ 'positive-change': asset.changePercent24Hr > 0, 'negative-change': asset.changePercent24Hr < 0 }">
                  {{ formatPercentage(asset.changePercent24Hr) }}
                </div>
              </v-col>

            </v-row>

            <v-divider style="border-width: 1px; opacity: 0.3;"/>

          </v-card-title>

          <v-card-text>


          </v-card-text>

          <v-card-text>
            <v-row>
              <v-col cols="6">
                <div class="asset-info-box">
                  <div class="asset-info-title">Market Cap</div>
                  <div class="asset-info-value">{{ formatCurrency(asset.marketCapUsd) }}</div>
                </div>
              </v-col>
              <v-col cols="6">
                <div class="asset-info-box">
                  <div class="asset-info-title">Volume (24h)</div>
                  <div class="asset-info-value">{{ formatCurrency(asset.volumeUsd24Hr) }}</div>
                </div>
              </v-col>
              <v-col cols="6">
                <div class="asset-info-box">
                  <div class="asset-info-title">Supply</div>
                  <div class="asset-info-value">{{ asset.supply }} {{ asset.symbol }}</div>
                </div>
              </v-col>
              <v-col cols="6">
                <div class="asset-info-box">
                  <div class="asset-info-title">Max Supply</div>
                  <div class="asset-info-value">{{ asset.maxSupply }} {{ asset.symbol }}</div>
                </div>
              </v-col>
            </v-row>
            <v-btn class="explorer-btn" :href="asset.explorer" target="_blank">View Explorer</v-btn>
          </v-card-text>

        </v-card>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12">
        <v-card class="chart-card">
          <v-card-title>Price Chart</v-card-title>
          <v-card-text>
            <v-btn-toggle v-model="timeOption" class="time-options">
              <v-btn v-for="option in timeOptions" :key="option.value" :value="option.value">{{ option.label }}</v-btn>
            </v-btn-toggle>
            <!-- <line-chart :data="chartData" :color="chartColor"/> -->
            <line-chart-apex :data="chartData" :color="chartColor"/>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>


</template>

<style scoped>
.asset-detail-card {
  border: 2px solid #000;
  box-shadow: 8px 8px 0 #000;
  margin-bottom: 1rem;
}

.rank-avatar {
  background-color: #000;
  color: #fff;
  font-weight: bold;
  margin-right: 1rem;
}

.asset-header {
  display: flex;
  flex-direction: column;
}

.asset-name {
  font-size: 1.5rem;
  font-weight: bold;
}

.asset-symbol {
  color: #666;
}

.asset-price {
  text-align: right;
  font-size: 1.5rem;
  font-weight: bold;
}

.asset-price-change {
  text-align: right;
  font-size: 1.1rem;
  font-weight: bold;
}

.positive-change {
  color: green;
}

.negative-change {
  color: red;
}

.asset-info-box {
  border: 2px solid #000;
  box-shadow: 4px 4px 0 #000;
  padding: 1rem;
  margin-bottom: 1rem;
}

.asset-info-title {
  font-weight: bold;
}

.explorer-btn {
  background-color: #ffcc00;
  color: #000;
  font-weight: bold;
  box-shadow: 4px 4px 0 #000;
}

.chart-card {
  border: 2px solid #000;
  box-shadow: 8px 8px 0 #000;
  margin-bottom: 1rem;
}

.time-options {
  margin-bottom: 1rem;
}
</style>