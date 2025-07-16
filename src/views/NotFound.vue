<template>
  <div class="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-gray-800">
    <h1 class="text-6xl md:text-9xl font-bold text-red-600 mb-4 animate-bounce">404</h1>
    <h2 class="text-xl md:text-3xl font-semibold mb-6">Halaman Tidak Ditemukan</h2>
    <p class="text-center text-lg mb-8 max-w-md">
      Ups! Halaman yang Anda cari tidak ditemukan. Mungkin halaman tersebut telah dipindahkan atau dihapus.
    </p>
    <router-link to="/" class="px-6 py-3 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition duration-300 ease-in-out transform hover:scale-105">
      Kembali ke Beranda
    </router-link>
  </div>
</template>

<script setup>
// Bagian script ini bisa kosong jika tidak ada logika khusus yang diperlukan
// untuk halaman 404 sederhana.
</script>

<style scoped>
/* Scoped styles khusus untuk komponen ini /
/ Karena Anda menggunakan Tailwind CSS, sebagian besar styling ada di kelas utilitas di template. /

/ Animasi pantul sederhana untuk teks 404 */
@keyframes bounce {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-20px);
  }
}

.animate-bounce {
  animation: bounce 2s infinite;
}
</style>