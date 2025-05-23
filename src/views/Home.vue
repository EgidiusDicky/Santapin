<template>
  <main class="w-full">
    <section 
    class="relative pt-[64px] md:py-20 min-h-[50vh] flex items-center bg-cover bg-center"
    style="background-image: url('src/asset/bg1.jpeg');"
    >
    <div class="absolute inset-0 bg-black/50 z-0"></div>

      <div class="relative z-10 w-full max-w-6xl mx-auto px-6 md:px-8 lg:px-12">
        <div class="text-left max-w-2xl px-4 md:px-0">
          <h1 class="md:whitespace-nowrap text-white font-extrabold text-3xl md:text-5xl mb-4 leading-tight transform transition-transform duration-500 hover:scale-105 animate-fade-in delay-100">
            Seperti rasa yang pernah ada
          </h1>
          <p class="text-white text-sm md:text-base mb-6 leading-relaxed max-w-md opacity-0 animate-fade-in delay-100">
            Nikmati hidangan autentik Indonesia yang dibuat dengan cinta dan bahan-bahan berkualitas terbaik.
          </p>
          <div>
          <router-link
            to="/menu"
            class="bg-[#814C3C] text-white text-sm md:text-base font-semibold rounded px-5 py-3 hover:bg-[#3D5943] transition duration-300"
          >
            Lihat Menu
          </router-link>
          </div>
        </div>
      </div>
    </section>


    <section class="bg-[#E6D5C4] px-6 py-6 md:py-8 text-center rounded-none">
      <div class="max-w-6xl mx-auto">
        <h2 class="font-extrabold text-[#814C3C] text-base md:text-lg mb-4 transform transition-transform duration-500 hover:scale-105 animate-fade-in delay-100">Kenapa Santapin?</h2>
        <div class="flex flex-col md:flex-row justify-center gap-6">
          <div class="bg-white rounded-lg p-4 md:p-6 max-w-xs mx-auto text-left shadow-md transform transition-transform duration-300 hover:scale-105 animate-fade-in delay-100">
            <h3 class="font-bold text-sm md:text-base mb-2">Bahan Lokal</h3>
            <p class="text-xs md:text-sm leading-relaxed opacity-0 animate-fade-in delay-200">
              Kami menggunakan bahan-bahan segar dari petani lokal untuk mendukung ekonomi daerah.
            </p>
          </div>
          <div class="bg-white rounded-lg p-4 md:p-6 max-w-xs mx-auto text-left shadow-md transform transition-transform duration-300 hover:scale-105 animate-fade-in delay-100">
            <h3 class="font-bold text-sm md:text-base mb-2">Rasa Tradisional</h3>
            <p class="text-xs md:text-sm leading-relaxed opacity-0 animate-fade-in delay-300">
              Setiap hidangan diolah dengan resep warisan yang telah diwariskan dari generasi ke generasi.
            </p>
          </div>
          <div class="bg-white rounded-lg p-4 md:p-6 max-w-xs mx-auto text-left shadow-md transform transition-transform duration-300 hover:scale-105 animate-fade-in delay-100">
            <h3 class="font-bold text-sm md:text-base mb-2">Harga Bersahabat</h3>
            <p class="text-xs md:text-sm leading-relaxed opacity-0 animate-fade-in delay-400">
              Kami menawarkan pengalaman kuliner berkualitas dengan harga yang terjangkau.
            </p>
          </div>
        </div>
      </div>
    </section>
  </main>
</template>

<style scoped>
@keyframes fade-in {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

.animate-fade-in {
  animation: fade-in 0.5s ease-out forwards;
}
</style>