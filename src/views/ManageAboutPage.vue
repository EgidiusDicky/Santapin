<script setup>
import { ref, onMounted } from 'vue';
import { useAboutPageStore } from '../stores/aboutPageStore';

const aboutPageStore = useAboutPageStore();
const form = ref(JSON.parse(JSON.stringify(aboutPageStore.content))); // Deep copy

// Konversi array ke string dengan newline untuk textarea
form.value.aboutParagraphs = form.value.aboutParagraphs.join('\n\n');
form.value.missionPoints = form.value.missionPoints.join('\n');

function handleSubmit() {
  const contentToSave = JSON.parse(JSON.stringify(form.value));
  
  // Konversi kembali string dari textarea ke array
  contentToSave.aboutParagraphs = contentToSave.aboutParagraphs.split('\n').filter(p => p.trim() !== '');
  contentToSave.missionPoints = contentToSave.missionPoints.split('\n').filter(p => p.trim() !== '');

  aboutPageStore.updateContent(contentToSave);
}

onMounted(() => {
  aboutPageStore.fetchContent();
});
</script>

<template>
  <div class="p-6">
    <h1 class="text-3xl font-bold mb-6 text-gray-800">Pengaturan Halaman About Us</h1>
    <form @submit.prevent="handleSubmit" class="space-y-8">

      <div class="bg-white p-6 rounded-lg shadow-md">
        <h2 class="text-xl font-semibold mb-4">Bagian Hero</h2>
        <div class="space-y-4">
          <div>
            <label class="block font-medium">Judul Hero</label>
            <input type="text" v-model="form.heroTitle" class="w-full mt-1 p-2 border rounded-md">
          </div>
          <div>
            <label class="block font-medium">Subjudul Hero</label>
            <textarea v-model="form.heroSubtitle" rows="3" class="w-full mt-1 p-2 border rounded-md"></textarea>
          </div>
          <div>
            <label class="block font-medium">URL Gambar Latar Hero</label>
            <input type="text" v-model="form.heroImage" class="w-full mt-1 p-2 border rounded-md">
          </div>
        </div>
      </div>
      
      <div class="bg-white p-6 rounded-lg shadow-md">
        <h2 class="text-xl font-semibold mb-4">Bagian Tentang Kami</h2>
        <div class="space-y-4">
           <div>
            <label class="block font-medium">Paragraf Tentang Kami (pisahkan dengan baris kosong)</label>
            <textarea v-model="form.aboutParagraphs" rows="6" class="w-full mt-1 p-2 border rounded-md"></textarea>
          </div>
          <div>
            <label class="block font-medium">URL Gambar Tentang Kami</label>
            <input type="text" v-model="form.aboutImage" class="w-full mt-1 p-2 border rounded-md">
          </div>
        </div>
      </div>

      <div class="bg-white p-6 rounded-lg shadow-md">
        <h2 class="text-xl font-semibold mb-4">Bagian Visi & Misi</h2>
        <div class="space-y-4">
           <div>
            <label class="block font-medium">Visi</label>
            <textarea v-model="form.visionText" rows="4" class="w-full mt-1 p-2 border rounded-md"></textarea>
          </div>
          <div>
            <label class="block font-medium">Misi (satu poin per baris)</label>
            <textarea v-model="form.missionPoints" rows="5" class="w-full mt-1 p-2 border rounded-md"></textarea>
          </div>
        </div>
      </div>

      <div class="bg-white p-6 rounded-lg shadow-md">
        <h2 class="text-xl font-semibold mb-4">Bagian Galeri</h2>
        <p class="text-sm text-gray-500 mb-4">Isi URL gambar dan judulnya untuk ditampilkan di slider galeri.</p>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div v-for="(item, index) in form.gallery" :key="index" class="p-4 border rounded-lg bg-gray-50">
            <h3 class="font-medium mb-2">Gambar {{ index + 1 }}</h3>
            <div class="space-y-2">
              <div>
                <label class="text-sm text-gray-600">URL Gambar</label>
                <input type="text" v-model="item.src" class="w-full mt-1 p-2 border rounded-md" placeholder="Contoh: /asset/gambar.jpeg">
              </div>
              <div>
                <label class="text-sm text-gray-600">Judul / Keterangan Gambar</label>
                <input type="text" v-model="item.title" class="w-full mt-1 p-2 border rounded-md" placeholder="Contoh: Behind the Scenes Kitchen">
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