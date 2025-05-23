<template>
  <div class="space-y-6">
    <h2 class="text-2xl font-bold">Feedback Pelanggan</h2>

    <div v-for="(feedback, index) in [
      { name: 'Budi', message: 'Makanannya enak!', rating: 5 },
      { name: 'Sari', message: 'Pengiriman cepat.', rating: 4 },
      { name: 'Andi', message: 'Pelayanan bagus.', rating: 5 },
    ]" :key="index" class="bg-white p-4 rounded shadow mb-2">
      <p class="font-semibold">{{ feedback.name }}</p>
      <p class="text-gray-600 text-sm">"{{ feedback.message }}"</p>
      <p class="text-yellow-500">Rating: {{ feedback.rating }}/5</p>
    </div>
  </div>
</template>