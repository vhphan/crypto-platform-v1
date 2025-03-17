<script setup>
import { computed, onMounted, ref } from 'vue';
import { storeToRefs } from 'pinia';
import { useRouter } from 'vue-router';
import { useCoinCGeckoStore } from "@/stores/coiGeckoStore.js";
import { formatCurrency, formatPercentage } from "../stores/helpers.js";

const coinGeckoStore = useCoinCGeckoStore();
const {cryptocurrencies: assets} = storeToRefs(coinGeckoStore);
const router = useRouter();
const search = ref('');

onMounted(coinGeckoStore.fetchCryptoData);

const goToAsset = (id) => {
  router.push(`/asset/${id}`);
};

const filteredAssets = computed(() => {
  return assets.value.filter((asset) =>
      asset.name.toLowerCase().includes(search.value.toLowerCase()) ||
      asset.symbol.toLowerCase().includes(search.value.toLowerCase())
  );
});
</script>

<template>
  <v-container>
    <v-text-field
        v-model="search"
        label="Search for an asset"
        prepend-icon="mdi-magnify"
        class="mb-4"
    ></v-text-field>
    <v-row>
      <v-col cols="12" md="6" lg="4" v-for="(asset, index) in filteredAssets" :key="asset.id">
        <v-card class="asset-card" @click="goToAsset(asset.id)">
          <v-card-title>
            <v-avatar class="rank-avatar">{{ index + 1 }}</v-avatar>
            <div class="v-row mt-2">

              <div class="asset-info col-6">
                <div class="asset-name">{{ asset.name }}</div>
                <div class="asset-symbol">{{ asset.symbol }}</div>
              </div>

              <div class="asset-price col-6">
                {{ formatCurrency(asset.current_price) }}
                <div
                    :class="{ 'positive-change': asset.price_change_percentage_24h > 0, 'negative-change': asset.price_change_percentage_24h < 0 }">
                  {{ formatPercentage(asset.price_change_percentage_24h) }}
                </div>
              </div>

            </div>
          </v-card-title>
          <v-divider class="ma-2" color="black" thickness="1px" opacity="1"></v-divider>
          <v-card-text>
            <div>Market Cap: {{ formatCurrency(asset.market_cap) }}</div>
            <div>Volume (24h): {{ formatCurrency(asset.total_volume) }}</div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<style scoped>
.asset-card {
  border: 2px solid #000;
  box-shadow: 8px 8px 0 #000;
  margin-bottom: 1rem;
  cursor: pointer;
}

.asset-card:hover {
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  transform: translate(-5px, -5px);
  box-shadow: 16px 16px 0 #000;
}

.rank-avatar {
  background-color: #000;
  color: #fff;
  font-weight: bold;
  margin-right: 1rem;
}

.asset-info {
  flex-grow: 1;
}

.asset-name {
  font-weight: bold;
}

.asset-symbol {
  color: #666;
}

.asset-price {
  text-align: right;
}

.positive-change {
  color: green;
}

.negative-change {
  color: red;
}
</style>
