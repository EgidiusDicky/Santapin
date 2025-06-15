<template>
  <footer class="bg-[#3D5943] text-[#D9D9D9] text-xs md:text-sm py-8 mt-auto">
    <div class="max-w-6xl mx-auto px-6 flex flex-col md:flex-row flex-wrap md:justify-between gap-8 md:gap-0">

      <!-- Santapin Info -->
      <section class="w-full md:w-1/4 text-left px-4">
        <h4 class="font-semibold mb-2">Santapin</h4>
        <address class="not-italic leading-relaxed space-y-1">
          <div>Jl. Makan Enak No. 123</div>
          <div>Jakarta Selatan</div>
          <div>Indonesia</div>
          <div>Tel: (021) 123-4567</div>
          <div>Email: info@santapin.com</div>
        </address>
      </section>

      <!-- Jam Operasional -->
      <section class="w-full md:w-1/4 text-left md:text-center px-4">
        <h4 class="font-semibold mb-2">Jam Operasional</h4>
        <p>Senin - Minggu</p>
        <p>10:00 - 22:00</p>
      </section>

      <!-- About Us Link -->
      <section class="w-full md:w-1/4 text-left md:text-center px-4">
        <h4 class="font-semibold mb-2">Tentang Kami</h4>
        <router-link
          to="/about"
          class="hover:underline hover:text-white transition duration-200"
        >
          Lihat profil tim kami
        </router-link>
      </section>

      <!-- Social Media -->
      <section class="w-full md:w-1/4 text-left md:text-right px-4">
        <h4 class="font-semibold mb-2">Social Media</h4>
        <div class="flex md:justify-end space-x-3 text-lg">
          <a href="#" aria-label="Instagram">
            <i class="fab fa-instagram hover:text-white transition duration-200"></i>
          </a>
          <a href="#" aria-label="Facebook">
            <i class="fab fa-facebook hover:text-white transition duration-200"></i>
          </a>
          <a href="#" aria-label="Community">
            <i class="fas fa-users hover:text-white transition duration-200"></i>
          </a>
        </div>
      </section>
    </div>

    <!-- Copyright -->
    <div class="mt-6 text-center text-xs text-[#D9D9D9]/70">
      &copy; 2025 Santapin. All rights reserved.
    </div>
  </footer>
</template>
