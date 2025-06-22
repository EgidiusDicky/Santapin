<script setup>
import { ref, computed, onMounted } from 'vue';
import { useTeamStore } from '../stores/teamStore';
import { useAboutPageStore } from '../stores/aboutPageStore';

// Inisialisasi store
const teamStore = useTeamStore();
const aboutPageStore = useAboutPageStore();

// Buat computed property untuk mengakses data tim
const contributors = computed(() => teamStore.teamMembers);
const content = computed(() => aboutPageStore.content);

// State untuk melacak gambar mana yang aktif di galeri
const activeImageIndex = ref(0);

// Ambil data tim saat komponen pertama kali dimuat
onMounted(() => {
  teamStore.fetchTeamMembers();
  aboutPageStore.fetchContent();
});
</script>

<template>
  <main class="w-full">
    <section class="relative bg-black text-white py-20 text-center px-6 overflow-hidden">
      <img :src="content.heroImage" alt="Hero background" class="absolute inset-0 w-full h-full object-cover z-0"/>
      <div class="absolute inset-0 bg-black/60 z-10"></div>
      <div class="relative z-20 w-full max-w-5xl mx-auto">
        <h1 class="text-4xl md:text-5xl font-extrabold mb-4">{{ content.heroTitle }}</h1>
        <p class="text-base md:text-lg leading-relaxed opacity-90 max-w-2xl mx-auto">
          {{ content.heroSubtitle }}
        </p>
      </div>
    </section>

    <section class="bg-white py-16 px-6">
      <div class="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
        <div class="text-justify">
          <h2 class="text-2xl font-bold mb-4 text-black">{{ content.aboutTitle }}</h2>
          <p v-for="(paragraph, index) in content.aboutParagraphs" :key="index" class="mb-4 text-gray-700">
            {{ paragraph }}
          </p>
        </div>
        <div class="rounded-lg overflow-hidden shadow-md">
          <img :src="content.aboutImage" alt="Foto tentang kami" class="w-full h-full object-cover"/>
        </div>
      </div>
    </section>

    <section class="bg-[#F9F4EF] py-16 px-6">
      <div class="max-w-6xl mx-auto text-center mb-12">
        <h2 class="text-2xl md:text-3xl font-bold text-black">Visi dan Misi</h2>
      </div>
      <div class="max-w-6xl mx-auto grid md:grid-cols-2 gap-8">
        <div class="bg-[#814C3C] text-white rounded-lg p-6 shadow-md">
          <h3 class="font-bold text-lg mb-2">{{ content.visionTitle }}</h3>
          <p class="text-left">{{ content.visionText }}</p>
        </div>
        <div class="bg-[#3D5943] text-white rounded-lg p-6 shadow-md">
          <h3 class="text-center font-bold text-lg mb-2">{{ content.missionTitle }}</h3>
          <ul class="list-disc pl-5 text-left space-y-2">
            <li v-for="(point, index) in content.missionPoints" :key="index">{{ point }}</li>
          </ul>
        </div>
      </div>
    </section>

     <section class="bg-white py-16 px-6 text-center">
      <div class="max-w-6xl mx-auto">
        <h2 class="text-2xl md:text-3xl font-bold text-black mb-10">Galeri</h2>

         <div v-if="content.gallery && content.gallery.length > 0">
          <div class="relative h-80 bg-gray-200 rounded-lg overflow-hidden mb-4 shadow-lg">
            <img
              :src="content.gallery[activeImageIndex].src"
              :alt="content.gallery[activeImageIndex].title"
              class="w-full h-full object-cover transition-opacity duration-500"
            />
            <div class="absolute inset-0 bg-black/40 flex items-center justify-center p-4">
              <p class="text-white text-xl font-semibold text-center">{{ content.gallery[activeImageIndex].title }}</p>
            </div>
          </div>

          <div class="flex justify-center gap-4 mt-6">
            <button
              v-for="(image, index) in content.gallery"
              :key="'thumb-' + index"
              @click="activeImageIndex = index"
              :aria-label="'Pilih gambar ' + (index + 1)"
              class="rounded-lg overflow-hidden focus:outline-none ring-offset-2 focus:ring-2 ring-[#814C3C] transition-all duration-300"
              :class="{ 'border-4 border-[#814C3C] shadow-lg scale-105': index === activeImageIndex, 'opacity-60 hover:opacity-100': index !== activeImageIndex }"
            >
              <img :src="image.src" :alt="image.title" class="w-24 h-16 object-cover">
            </button>
          </div>

          <div class="flex justify-center space-x-3 mt-6">
            <button
              v-for="(image, index) in content.gallery"
              :key="index"
              @click="activeImageIndex = index"
              :aria-label="'Lihat gambar ' + (index + 1)"
              class="w-3 h-3 rounded-full transition-colors"
              :class="{ 'bg-[#814C3C]': index === activeImageIndex, 'bg-gray-300 hover:bg-gray-400': index !== activeImageIndex }"
            ></button>
          </div>
        </div>
      </div>
    </section>

    <section class="bg-[#F9F4EF] py-16 px-6 text-center">
      <div class="max-w-6xl mx-auto">
        <h2 class="text-2xl md:text-3xl font-bold text-[#3D5943] mb-10">Tim Kontributor</h2>
        <div v-if="contributors.length" class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10">
          <div v-for="person in contributors" :key="person.id" class="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition duration-300">
            <img :src="person.image" :alt="'Foto ' + person.name" class="w-24 h-24 md:w-32 md:h-32 mx-auto rounded-full object-cover mb-4 border-4 border-white shadow" loading="lazy"/>
            <h3 class="text-xl font-bold text-gray-800">{{ person.name }}</h3>
            <p class="text-base font-semibold text-[#814C3C] mt-1">{{ person.role }}</p>
            <p class="text-sm text-gray-600 mt-2 mb-4 h-16">{{ person.task }}</p>
            <a :href="person.github" target="_blank" rel="noopener noreferrer" :aria-label="`Profil GitHub ${person.name}`" class="inline-flex items-center gap-2 text-sm text-[#3D5943] hover:text-[#814C3C] transition">
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
        <router-link to="/" class="inline-block bg-white text-[#814C3C] font-semibold rounded px-6 py-3 hover:bg-[#3D5943] hover:text-white transition duration-300">
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