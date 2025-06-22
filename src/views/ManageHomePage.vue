<script setup>
import { ref, onMounted } from 'vue';
import { useHomePageStore } from '../stores/homePageStore';

const homePageStore = useHomePageStore();
const form = ref(JSON.parse(JSON.stringify(homePageStore.content))); // Deep copy

function handleSubmit() {
  homePageStore.updateContent(form.value);
}

onMounted(() => {
  homePageStore.fetchContent();
});
</script>

<template>
  <div class="p-6">
    <h1 class="text-3xl font-bold mb-6 text-gray-800">Pengaturan Halaman Utama (Home)</h1>
    <form @submit.prevent="handleSubmit" class="space-y-8">

      <div class="bg-white p-6 rounded-lg shadow-md">
        <h2 class="text-xl font-semibold mb-4">Bagian Hero</h2>
        <div class="space-y-4">
          <div>
            <label class="block font-medium">Judul Hero</label>
            <input type="text" v-model="form.hero.title" class="w-full mt-1 p-2 border rounded-md">
          </div>
          <div>
            <label class="block font-medium">Subjudul Hero</label>
            <textarea v-model="form.hero.subtitle" rows="3" class="w-full mt-1 p-2 border rounded-md"></textarea>
          </div>
          <div>
            <label class="block font-medium">URL Gambar Latar Hero</label>
            <input type="text" v-model="form.hero.backgroundImage" class="w-full mt-1 p-2 border rounded-md" placeholder="/asset/nama-gambar.jpg">
          </div>
        </div>
      </div>
      
      <div class="bg-white p-6 rounded-lg shadow-md">
        <h2 class="text-xl font-semibold mb-4">Bagian "Why Us"</h2>
        <div class="space-y-4">
          <div>
            <label class="block font-medium">Judul Section</label>
            <input type="text" v-model="form.whyUs.title" class="w-full mt-1 p-2 border rounded-md">
          </div>
          
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
            <div v-for="(feature, index) in form.whyUs.features" :key="index" class="p-4 border rounded-lg bg-gray-50">
              <h3 class="font-medium mb-2">Fitur {{ index + 1 }}</h3>
              <div class="space-y-2">
                <div>
                  <label class="text-sm">Judul Fitur</label>
                  <input type="text" v-model="feature.title" class="w-full mt-1 p-2 border rounded-md">
                </div>
                <div>
                  <label class="text-sm">Deskripsi Fitur</label>
                  <textarea v-model="feature.description" rows="4" class="w-full mt-1 p-2 border rounded-md"></textarea>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div>
        <button type="submit" class="bg-blue-600 text-white font-bold px-8 py-3 rounded-lg hover:bg-blue-700 transition">Simpan Perubahan</button>
      </div>

    </form>
  </div>
</template>