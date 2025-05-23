<script setup>
</script>

<template>
  <div class="space-y-6">
    <h2 class="text-2xl font-bold">Dashboard</h2>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div class="p-4 bg-white rounded shadow">
        <h3 class="font-semibold text-gray-700">Total Pesanan</h3>
        <p class="text-2xl font-bold">120</p>
      </div>
      <div class="p-4 bg-white rounded shadow">
        <h3 class="font-semibold text-gray-700">Pesanan Aktif</h3>
        <p class="text-2xl font-bold">15</p>
      </div>
      <div class="p-4 bg-white rounded shadow">
        <h3 class="font-semibold text-gray-700">Pendapatan Hari Ini</h3>
        <p class="text-2xl font-bold">Rp 1.200.000</p>
      </div>
    </div>

    <div class="bg-white p-4 rounded shadow">
      <h3 class="font-semibold text-gray-700 mb-2">Pesanan Terbaru</h3>
      <ul>
        <li v-for="order in [1, 2, 3]" :key="order" class="border-b py-2">Order #ORD-{{ 1000 + order }}</li>
      </ul>
    </div>
  </div>
</template>

<style scoped>
</style>