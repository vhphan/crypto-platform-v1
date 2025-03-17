<script setup>
import { useCoinCapStore, timeOptions } from "@/stores/coinCapStore.js";
import { storeToRefs } from "pinia";
import { computed, onMounted } from "vue";

const coinCapStore = useCoinCapStore();

const { history, assetsToDisplay, timeOption } = storeToRefs(coinCapStore);

const fetchRequiredAssetHistory = async () => {
  debugger;
  await Promise.all(assetsToDisplay.value.map((asset) => {
    return coinCapStore.fetchAssetHistory(asset.id, timeOption.value);
  }));
};

const assetsHistory = computed(()=>{

  return assetsToDisplay.value.map((asset) => {
    return {
      id: asset.id,
      data: history.value[asset.id]?.[timeOption.value] || [],
    };
  });
  
})

const chartOptions = computed(() => {
  return assetsToDisplay.value.map((asset) => {
    return {
      id: asset.id,
      group: 'synced',
      type: 'line',
      height: 300,
      color: parseFloat(asset.changePercent24Hr) >= 0 ? "#00CC66" : "#FF3366",
    };
  });
})

const chartSeries = computed(() => {
  return assetsHistory.value.map((asset) => {
    console.log(asset);
    debugger;
    
    return {
      id: asset.id,
      data: asset.data.map((point) => {
        const pointForTimeInterval = point[timeOption]?.value;
        return {
          x: new Date(pointForTimeInterval.time).getTime(),
          y: parseFloat(pointForTimeInterval.priceUsd),
        };
      }),
    };
  });
});

onMounted(() => {
  fetchRequiredAssetHistory().then(()=>{});
});

</script>

<template>
  <!--buttons to change time interval-->
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
      <v-col v-for="(series, idx) in chartSeries" :key="series.id" cols="12" md="4">
        <v-card>
          <v-card-title>{{assetsToDisplay.find((asset) => asset.id === series.id).name}}</v-card-title>
          <v-card-item>
            {{ series }}
            <!-- <apexchart type="line" height="160" :options="chartOptions[idx]" :series="series"></apexchart> -->
          </v-card-item>
        </v-card>
      </v-col>
    </v-row>

  </div>
</template>

<style scoped></style>