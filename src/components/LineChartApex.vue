<template>
  <div class="apex-chart">
    <apexchart type="line" :options="chartOptions" :series="series" :height="chartHeight"/>
  </div>
</template>

<script setup>
import { ref, watch, computed } from 'vue';

const props = defineProps({
    data: Array,
    color: String,
});

const series = computed(() => [{
    name: 'Price',
    data: props.data.map((point) => {

        console.log(typeof(point.time));
        return { x: point.time.getTime(), y: point.price.toFixed(0) };

    }),
}]);

const chartHeight = computed(() => {
  const chartDiv = document.querySelector('.apex-chart');
  return chartDiv ? chartDiv.clientHeight : 300;
});

const chartOptions = ref({
    chart: {
        type: 'line',
    },
    xaxis: {
        type: 'datetime',
        title: {
            text: 'Date',
        },
    },
    yaxis: {
        title: {
            text: 'Price (USD)',
        },
    },
    stroke: {
        curve: 'smooth',
    },
    colors: [props.color],
});

watch(chartHeight, (newHeight) => {
  chartOptions.value.chart.height = newHeight;
});

</script>

<style scoped>
.apex-chart {
    width: 100%;
    max-height: 50vh;
}
</style>