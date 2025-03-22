<script setup>
import { useCoinGeckoStore, timeOptions } from "@/stores/coinGeckoStore";
import { storeToRefs } from "pinia";
import { computed, onMounted, ref, watch } from "vue";
import LWChart from "../components/LWChart.vue";

const coinGeckoStore = useCoinGeckoStore();

const { historicalData, timeOption } = storeToRefs(coinGeckoStore);

const assetsToDisplay = computed(() => {
  const assets = coinGeckoStore.cryptocurrencies.filter((asset) => asset.id);
  // limit to 6
  return assets.slice(0, 3);
});

const fetchRequiredAssetHistory = async () => {
  // await Promise.all(assetsToDisplay.value.map((asset) => {
  //   return coinGeckoStore.fetchHistoricalData(asset.id);
  // }));

  // fetch one by one
  for (const asset of assetsToDisplay.value) {
    await coinGeckoStore.fetchHistoricalData(asset.id);
    // wait 300ms
    await new Promise((resolve) => setTimeout(resolve, 300));
  }

};

const assetsHistory = computed(() => {

  return assetsToDisplay.value.map((asset) => {
    return {
      id: asset.id,
      data: historicalData.value[asset.id]?.[timeOption.value] || [],
    };
  });

})

// const chartOptions = computed(() => {
//   return assetsToDisplay.value.map((asset) => {
//     return {
//       id: asset.id,
//       group: 'synced',
//       type: 'line',
//       height: 300,
//       color: parseFloat(asset.changePercent24Hr) >= 0 ? "#00CC66" : "#FF3366",
//     };
//   });
// })

// const chartSeries = computed(() => {
//   return assetsHistory.value.map((asset) => {
//     console.log(asset);
//     const prices = asset.data['prices'] || [];
//     return {
//       name: asset.id,
//       data: prices.map((price) => {
//         return {
//           x: price[0],
//           y: parseFloat(price[1]).toFixed(2),
//         };
//       }),
//     };
//   });
// });
//
//
// const options = computed(() => {
//       return assetsHistory.value.map((asset) => {
//         return {
//           chart: { type: 'line', group: 'social', id: asset.id },
//           xaxis: { type: 'datetime', title: { text: 'Date' }, convertedCatToNumeric: false },
//           yaxis: { title: { text: 'Price (USD)' }, labels: {minWidth: 40} },
//           stroke: { width: 1, curve: 'straight' },
//           colors: ["#0754ef"],
//         //   yaxis.labels.minWidth
//
//         }
//       })
//     }
// )

// uPlot

const chartDataArray = computed(() => {
  return assetsHistory.value.map((asset) => {
    console.log(asset);
    const prices = asset.data['prices'] || [];
    return prices.map((price) => {
      return {
        time: price[0] / 1000,
        value: parseFloat(price[1]),
      }
    })
  });
});

const seriesOptions = ref({
  color: 'rgb(45, 77, 205)',
});

const chartType = ref('line');

// const lwChart = ref();
const lwCharts = ref(assetsToDisplay.value.map(() => ref(null)));


onMounted(async () => {
  if (coinGeckoStore.cryptocurrencies.length === 0) {
    await coinGeckoStore.fetchCryptoData();
  }
  await fetchRequiredAssetHistory();
});

watch(()=>timeOption.value, async () => {
  await fetchRequiredAssetHistory();
})

</script>

<template>
  <!--buttons to change time inteurval-->
  <div>
    <v-card>
      <v-card-title>Time Interval</v-card-title>
      <v-card-text>
        <v-btn-toggle v-model="timeOption" class="time-options">
          <v-btn v-for="option in timeOptions" :key="option.value" :value="option.value">{{ option.label }}</v-btn>
        </v-btn-toggle>
      </v-card-text>
    </v-card>

    <!-- {{ assetsHistory }} -->

    <!--chart components-->
    <v-row>
      <v-col v-for="(chartData, idx) in chartDataArray" :key="assetsToDisplay[idx].id" cols="12" md="6">
        <v-card variant="outlined">
          <v-card-title style="background-color: darkblue; color: white;">{{ assetsToDisplay[idx].id}}</v-card-title>
          <v-card-item>
            <!--            {{ chartData }}-->
            <l-w-chart :data="chartData" :type="chartType" :seriesOptions="seriesOptions"
                       :ref="lwCharts[idx]"
            />
          </v-card-item>
        </v-card>
      </v-col>
    </v-row>

  </div>
</template>

<style scoped></style>