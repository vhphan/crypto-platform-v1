<template>
  <div>
    <canvas ref="canvas"></canvas>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

const props = defineProps({
  data: Array,
  color: String,
});

const canvas = ref(null);
let chart = null;

const createChart = () => {
  if (chart) chart.destroy();

  chart = new Chart(canvas.value, {
    type: 'line',
    data: {
      labels: props.data.map((point) => point.time),
      datasets: [
        {
          label: 'Price',
          data: props.data.map((point) => point.price),
          borderColor: props.color,
          fill: false,
        },
      ],
    },
    options: {
      responsive: true,
      scales: {
        x: {
          display: true,
          title: {
            display: true,
            text: 'Date',
          },
        },
        y: {
          display: true,
          title: {
            display: true,
            text: 'Price (USD)',
          },
        },
      },
    },
  });
};

onMounted(createChart);
watch(() => props.data, createChart, { deep: true });
</script>

<style scoped>
canvas {
  width: 100%;
  max-height: min(50vh, 350px);
}
</style>
