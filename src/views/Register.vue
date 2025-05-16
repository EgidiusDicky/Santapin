<script setup>

</script>

<template>
    <!-- Register Form -->
  <div class="flex justify-center items-center py-10">
    <div class="bg-white rounded-xl shadow-md p-8 w-full max-w-md">
      <h2 class="text-center text-lg font-bold text-[#5E1B00] mb-4">Santapin</h2>

      <div class="flex justify-center mb-5 space-x-4">
        <a href="/login" class="border border-[#5E1B00] text-[#5E1B00] px-5 py-1 rounded">Login</a>
        <button class="bg-[#3C5647] text-white px-5 py-1 rounded">Register</button>
      </div>

      <form>
        <div class="mb-4">
          <label class="block text-sm">Email</label>
          <input type="email" class="w-full mt-1 border border-gray-300 px-3 py-2 rounded text-sm" placeholder="Enter your email">
        </div>

        <div class="mb-4">
          <label class="block text-sm">Password</label>
          <input type="password" class="w-full mt-1 border border-gray-300 px-3 py-2 rounded text-sm" placeholder="Enter your password">
        </div>

        <div class="mb-4">
          <label class="block text-sm">Nama lengkap *</label>
          <input type="text" class="w-full mt-1 border border-gray-300 px-3 py-2 rounded text-sm" placeholder="Masukkan nama lengkap anda">
        </div>

        <div class="mb-4">
          <label class="block text-sm">Nomor hp *</label>
          <input type="text" class="w-full mt-1 border border-gray-300 px-3 py-2 rounded text-sm" placeholder="Masukkan nomor hp anda">
        </div>

        <div class="mb-6">
          <label class="block text-sm">Alamat pengantaran *</label>
          <textarea class="w-full mt-1 border border-gray-300 px-3 py-2 rounded text-sm" placeholder="Masukkan alamat domisili anda"></textarea>
        </div>

        <button type="submit" class="w-full bg-[#3C5647] text-white py-2 rounded">Register</button>
      </form>
    </div>
  </div>
</template>

<style scoped>
.text-brown-700 {
  color: #78350f;
}
.bg-brown-700 {
  background-color: #78350f;
}
.hover\:text-brown-600:hover {
  color: #92400e;
}
</style>