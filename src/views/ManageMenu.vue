<template>
  <div class="space-y-6">
    <h2 class="text-2xl font-bold">Kelola Menu</h2>

    <div v-for="item in ['Nasi Goreng', 'Ayam Bakar', 'Es Teh']" :key="item" class="bg-white p-4 rounded shadow mb-2">
      <div class="flex justify-between items-center">
        <div>
          <h3 class="font-semibold text-lg">{{ item }}</h3>
          <p class="text-sm text-gray-500">Rp 20.000</p>
        </div>
        <button class="text-blue-600 hover:underline">Edit</button>
      </div>
    </div>
  </div>
</template>