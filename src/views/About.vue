<script setup>
import { computed, onMounted } from 'vue';
import { useTeamStore } from '../stores/teamStore';

// Inisialisasi store
const teamStore = useTeamStore();

// Buat computed property untuk mengakses data tim
const contributors = computed(() => teamStore.teamMembers);

// Ambil data tim saat komponen pertama kali dimuat
onMounted(() => {
  teamStore.fetchTeamMembers();
});
</script>

<template>
  <main class="w-full">

    <!-- Hero Section with Background Image -->
    <section class="relative bg-black text-white py-20 text-center px-6 overflow-hidden">
      <img
        src="/asset/Bangunan_restoran.jpeg"
        alt="Hero background of Indonesian dishes"
        class="absolute inset-0 w-full h-full object-cover z-0"
        loading="eager"
        decoding="async"
        fetchpriority="high"
      />
      <!-- Overlay -->
      <div class="absolute inset-0 bg-black/60 z-10"></div>

      <!-- Hero Content -->
      <div class="relative z-20 w-full max-w-5xl mx-auto">
        <h1 class="text-4xl md:text-5xl font-extrabold mb-4">Tentang Santapin</h1>
        <p class="text-base md:text-lg leading-relaxed opacity-90 max-w-2xl mx-auto">
          Menghubungkan cita rasa tradisional Indonesia dengan kemudahan teknologi modern untuk pengalaman kuliner yang tak terlupakan.
        </p>
      </div>
    </section>

    <!-- Tentang Kami -->
    <section class="bg-white py-16 px-6">
      <div class="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
        <div class="text-justify">
          <h2 class="text-2xl font-bold mb-4 text-black">Tentang Kami</h2>
          <p class="mb-4 text-gray-700">
            Santapin adalah platform kuliner yang lahir dari kecintaan mendalam terhadap kekayaan cita rasa Indonesia. Kami percaya bahwa setiap hidangan memiliki cerita, dan setiap gigitan adalah perjalanan menuju warisan budaya yang kaya.
          </p>
          <p class="mb-4 text-gray-700">
            Dengan menggabungkan resep tradisional yang telah diwariskan turun-temurun dengan inovasi kuliner modern, kami menghadirkan pengalaman makan yang autentik namun tetap relevan dengan gaya hidup masa kini.
          </p>
          <p class="text-gray-700">
            Dari nasi goreng spesial hingga rendang yang kaya rempah, setiap menu di Santapin dibuat dengan penuh cinta dan dedikasi untuk memberikan yang terbaik bagi pelanggan kami.
          </p>
        </div>
        <div class="rounded-lg overflow-hidden shadow-md">
          <img
            src="/asset/Makanan.jpeg"
            alt="Foto dapur tradisional"
            class="w-full h-full object-cover"
          />
        </div>
      </div>
    </section>

    <!-- Visi dan Misi -->
    <section class="bg-[#F9F4EF] py-16 px-6">
      <div class="max-w-6xl mx-auto text-center mb-12">
        <h2 class="text-2xl md:text-3xl font-bold text-black">Visi dan Misi</h2>
      </div>
      <div class="max-w-6xl mx-auto grid md:grid-cols-2 gap-8">
        <div class="bg-[#814C3C] text-white rounded-lg p-6 shadow-md">
          <h3 class="font-bold text-lg mb-2">Visi</h3>
          <p class="text-left">
            Menjadi platform kuliner terdepan yang melestarikan dan memperkenalkan kekayaan cita rasa Indonesia kepada dunia, sambil mendukung ekonomi lokal dan keberlanjutan lingkungan.
          </p>
        </div>
        <div class="bg-[#3D5943] text-white rounded-lg p-6 shadow-md">
          <h3 class="text-center font-bold text-lg mb-2">Misi</h3>
          <ul class="list-disc pl-5 text-left space-y-2">
            <li>Menyajikan hidangan Indonesia autentik dengan kualitas terbaik</li>
            <li>Mendukung petani dan produsen lokal Indonesia</li>
            <li>Memberikan pengalaman kuliner yang mudah dan menyenangkan</li>
            <li>Melestarikan warisan kuliner nusantara untuk generasi mendatang</li>
          </ul>
        </div>
      </div>
    </section>

    <!-- Galeri Foto -->
    <section class="bg-white py-16 px-6 text-center">
      <div class="max-w-6xl mx-auto">
        <h2 class="text-2xl md:text-3xl font-bold text-black mb-10">Galeri</h2>

        <!-- Main Gallery Image -->
        <div class="relative h-80 bg-[#814C3C] rounded-lg overflow-hidden mb-8 shadow-md">
          <img
            src="/asset/Dapur.jpeg"
            alt="Behind the scenes kitchen"
            class="w-full h-full object-cover"
          />
          <div class="absolute inset-0 bg-black/40 flex items-center justify-center text-white text-xl font-semibold">
            Behind the Scenes Kitchen
          </div>
        </div>

        <!-- Image Slider Dots -->
        <div class="flex justify-center space-x-2 mb-6">
          <span class="w-3 h-3 rounded-full bg-[#814C3C]"></span>
          <span class="w-3 h-3 rounded-full bg-gray-300"></span>
          <span class="w-3 h-3 rounded-full bg-gray-300"></span>
          <span class="w-3 h-3 rounded-full bg-gray-300"></span>
          <span class="w-3 h-3 rounded-full bg-[#814C3C]"></span>
        </div>

        <!-- Side Gallery Thumbnails -->
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div class="rounded-lg overflow-hidden shadow">
            <img
              src="/asset/Bumbu.jpeg"
              alt="Spice Market"
              class="w-full h-40 object-cover"
            />
          </div>
          <div class="rounded-lg overflow-hidden shadow">
            <img
              src="/asset/Chef.jpeg"
              alt="Chef at Work"
              class="w-full h-40 object-cover"
            />
          </div>
          <div class="rounded-lg overflow-hidden shadow">
            <img
              src="/asset/Bumbu.jpeg"
              alt="Traditional Tools"
              class="w-full h-40 object-cover"
            />
          </div>
          <div class="rounded-lg overflow-hidden shadow">
            <img
              src="/asset/Dapur.jpeg"
              alt="Food Preparation"
              class="w-full h-40 object-cover"
            />
          </div>
        </div>
      </div>
    </section>

    <!-- Contributors Section -->
    <section class="bg-white py-16 px-6 text-center">
      <div class="max-w-6xl mx-auto">
        <h2 class="text-2xl md:text-3xl font-bold text-[#3D5943] mb-10">Tim Kontributor</h2>
        
        <div v-if="contributors.length" class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10">
          <div
            v-for="person in contributors"
            :key="person.id" class="bg-[#F9F4EF] p-6 rounded-lg shadow-sm hover:shadow-md transition duration-300"
          >
            <img
              :src="person.image"
              :alt="person.name ? 'Foto ' + person.name : 'Foto kontributor'"
              class="w-24 h-24 md:w-32 md:h-32 mx-auto rounded-full object-cover mb-4 border-4 border-white shadow"
              loading="lazy"
            />
            <h3 class="text-xl font-bold text-gray-800">{{ person.name }}</h3>

            <p class="text-base font-semibold text-[#814C3C] mt-1">{{ person.role }}</p>
            <p class="text-sm text-gray-600 mt-2 mb-4 h-16">{{ person.task }}</p>

            <a :href="person.github"
              target="_blank"
              rel="noopener noreferrer"
              :aria-label="`Profil GitHub ${person.name}`"
              class="inline-flex items-center gap-2 text-sm text-[#3D5943] hover:text-[#814C3C] transition"
            >
              <i class="fab fa-github text-lg"></i> GitHub
            </a>
          </div>
        </div>

         <p v-else class="text-gray-500 mt-4">Memuat data kontributor...</p>
      </div>
    </section>

    <section class="bg-[#814C3C] py-12 text-white text-center px-6">
      <div class="max-w-3xl mx-auto">
        <h3 class="text-xl md:text-2xl font-semibold mb-4">Kami harap Anda menikmati pengalaman di Santapin!</h3>
        <router-link
          to="/"
          class="inline-block bg-white text-[#814C3C] font-semibold rounded px-6 py-3 hover:bg-[#3D5943] hover:text-white transition duration-300"
        >
          Kembali ke Beranda
        </router-link> 
      </div>
    </section>
  </main>
</template>


    <!-- Call to Action 
    <section class="bg-[#814C3C] py-12 text-white text-center px-6">
      <div class="max-w-3xl mx-auto">
        <h3 class="text-xl md:text-2xl font-semibold mb-4">Kami harap Anda menikmati pengalaman di Santapin!</h3>
        <router-link
          to="/"
          class="inline-block bg-white text-[#814C3C] font-semibold rounded px-6 py-3 hover:bg-[#3D5943] hover:text-white transition duration-300"
        >
          Kembali ke Beranda
        </router-link>
      </div>
    </section>
  </main>
</template>

<script>
export default {
  name: 'AboutUs',
  data() {
    return {
      contributors: [
        {
          name: 'Egidius Dicky Narendra Baas',
          role: 'Team Leader',
          image: 'https://avatars.githubusercontent.com/u/162414603?v=4',
          github: 'https://github.com/egidiusdicky',
        },
        {
          name: 'Rayan',
          role: 'Frontend Developer',
          image: 'https://avatars.githubusercontent.com/u/87006289?v=4',
          github: 'https://github.com/rayanbersabal',
        },
        {
          name: 'Garda Fitrananda',
          role: 'Frontend Developer',
          image: 'https://avatars.githubusercontent.com/u/202229964?v=4',
          github: 'https://github.com/gardafitrananda',
        },
        {
          name: 'Sauzana',
          role: 'Frontend Developer',
          image: 'https://avatars.githubusercontent.com/u/202231744?v=4',
          github: 'https://github.com/Sauzana1919',
        },
        {
          name: 'Sandi Setiawan',
          role: 'Frontend Developer',
          image: 'https://avatars.githubusercontent.com/u/193219383?v=4',
          github: 'https://github.com/SandiSetiawann',
        },
        {
          name: 'Fahrudiansyah',
          role: 'Frontend Developer',
          image: 'https://avatars.githubusercontent.com/u/202230345?v=4',
          github: 'https://github.com/Fahrudiyansah',
        },
      ],
    };
  },
};
</script>

<style scoped>
/* Add your custom styles here if needed */
</style>
-->