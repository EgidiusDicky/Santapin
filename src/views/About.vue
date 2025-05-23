<template>
  <main class="w-full">
    <section class="bg-[#3D5943] text-white py-20 text-center px-6">
      <div class="max-w-3xl mx-auto">
        <h1 class="text-3xl md:text-5xl font-extrabold mb-4">Tentang Kami</h1>
        <p class="text-base md:text-lg leading-relaxed opacity-90">
          Website ini adalah hasil kolaborasi kreatif dari tim Santapin yang penuh semangat dan cinta akan kuliner Indonesia.
        </p>
      </div>
    </section>

    <!-- Contributors -->
    <section class="bg-white py-16 px-6 text-center">
      <div class="max-w-6xl mx-auto">
        <h2 class="text-2xl md:text-3xl font-bold text-[#3D5943] mb-10">Tim Kontributor</h2>

        <div v-if="contributors.length" class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10">
          <div
            v-for="person in contributors"
            :key="person.name"
            class="bg-[#F9F4EF] p-6 rounded-lg shadow-sm hover:shadow-md transition duration-300"
          >
            <img
              :src="person.image"
              :alt="person.name ? 'Foto ' + person.name : 'Foto kontributor'"
              class="w-30 h-30 mx-auto rounded-full object-cover mb-4 border-4 border-white shadow"
              loading="lazy"
            />
            <h3 class="text-lg font-semibold text-[#814C3C]">{{ person.name }}</h3>
            <p class="text-sm text-[#3D5943] mb-2">{{ person.role }}</p>
            <a
              :href="person.github"
              target="_blank"
              rel="noopener noreferrer"
              :aria-label="`Profil GitHub ${person.name}`"
              class="inline-flex items-center gap-2 text-sm text-[#3D5943] hover:text-[#814C3C] transition"
            >
              <i class="fab fa-github text-lg"></i> GitHub
            </a>
          </div>
        </div>

        <p v-else class="text-gray-500 mt-4">Belum ada kontributor yang ditampilkan.</p>
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
    }
  },
}
</script>

<style scoped>

</style>
