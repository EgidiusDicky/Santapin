<script setup>
import { computed, onMounted } from 'vue';
import { useHomePageStore } from '../stores/homePageStore';

const homePageStore = useHomePageStore();
const content = computed(() => homePageStore.content);

onMounted(() => {
  homePageStore.fetchContent();
});
</script>

<template>
  <main class="w-full">
    <section class="relative pt-[64px] md:py-20 min-h-[50vh] flex items-center bg-black">
      <img
        :src="content.hero.backgroundImage"
        alt="Hero background"
        width="1280"
        height="720"
        class="absolute inset-0 w-full h-full object-cover z-0"
        decoding="async"
        loading="eager"
        fetchpriority="high"
      />
      <div class="absolute inset-0 bg-black/50 z-10"></div>
      <div class="relative z-20 w-full max-w-6xl mx-auto px-6 md:px-8 lg:px-12">
        <div class="text-left max-w-2xl px-4 md:px-0">
          <h1 class="text-white font-extrabold text-3xl md:text-5xl mb-4 leading-tight">
            {{ content.hero.title }}
          </h1>
          <p class="text-white text-sm md:text-base mb-6 leading-relaxed max-w-md">
            {{ content.hero.subtitle }}
          </p>
          <router-link
            to="/menu"
            class="bg-[#814C3C] text-white text-sm md:text-base font-semibold rounded px-5 py-3 hover:bg-[#3D5943] transition-colors duration-300"
          >
            Lihat Menu
          </router-link>
        </div>
      </div>
    </section>

    <section class="bg-[#E6D5C4] px-6 py-6 md:py-8 text-center">
      <div class="max-w-6xl mx-auto">
        <h2 class="font-extrabold text-[#814C3C] text-base md:text-lg mb-4">
          {{ content.whyUs.title }}
        </h2>
        <div class="flex flex-col md:flex-row justify-center gap-6">
          <div v-for="(feature, index) in content.whyUs.features" :key="index" class="bg-white rounded-lg p-4 md:p-6 max-w-xs mx-auto text-left shadow-md">
            <h3 class="font-bold text-sm md:text-base mb-2">{{ feature.title }}</h3>
            <p class="text-xs md:text-sm leading-relaxed">
              {{ feature.description }}
            </p>
          </div>
        </div>
      </div>
    </section>
  </main>
</template>
