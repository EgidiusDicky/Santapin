<script setup>
import { ref, onMounted } from 'vue';
import { useTeamStore } from '../stores/teamStore';

const teamStore = useTeamStore();

// State untuk form, digunakan untuk 'tambah' dan 'edit'
const memberForm = ref({
  name: '',
  role: '', 
  task: '', 
  image: '',
  github: ''
});

// State baru untuk melacak mode edit
const isEditing = ref(false);
const editingMemberId = ref(null);


// Fungsi untuk menangani submit form (bisa untuk tambah atau update)
function handleSubmit() {
  if (!memberForm.value.name || !memberForm.value.task) {
    alert('Nama dan tugas tidak boleh kosong!');
    return;
  }

  if (isEditing.value) {
    // Jika sedang mode edit, panggil aksi update
    teamStore.updateTeamMember({ id: editingMemberId.value, ...memberForm.value });
  } else {
    // Jika tidak, panggil aksi tambah
    teamStore.addTeamMember(memberForm.value);
  }
  
  // Reset form dan mode edit ke kondisi awal
  cancelEdit();
}

// Fungsi untuk menghapus anggota tim
function handleDeleteMember(memberId) {
  if (confirm('Apakah Anda yakin ingin menghapus anggota tim ini?')) {
    teamStore.deleteTeamMember(memberId);
  }
}

// --- FUNGSI UNTUK EDIT ---

// Fungsi ini dipanggil saat tombol 'Edit' diklik
function handleEdit(member) {
  isEditing.value = true;
  editingMemberId.value = member.id;
  // Salin data anggota ke form
  memberForm.value = { 
    name: member.name, 
    role: member.role || '',
    task: member.task || '',
    image: member.image || '',
    github: member.github || ''
  };
  // Scroll ke atas agar form terlihat
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Fungsi untuk membatalkan mode edit
function cancelEdit() {
  isEditing.value = false;
  editingMemberId.value = null;
  // Kosongkan kembali form
  memberForm.value = { name: '', role: '', task: '', image: '', github: '' };
}

onMounted(() => {
  teamStore.fetchTeamMembers();
});
</script>

<template>
  <div class="p-6 md:p-8">
    <h1 class="text-3xl font-bold mb-6 text-gray-800">Pengaturan Tim</h1>

    <div class="bg-white p-6 rounded-lg shadow-md mb-8">
      <h2 class="text-xl font-semibold mb-4">{{ isEditing ? 'Edit Anggota Tim' : 'Tambah Anggota Tim Baru' }}</h2>
      <form @submit.prevent="handleSubmit" class="space-y-4">
        <div>
          <label for="memberName" class="block text-gray-700 font-medium mb-1">Nama Anggota</label>
          <input v-model="memberForm.name" type="text" id="memberName" class="w-full px-4 py-2 border rounded-lg">
        </div>

        <div>
          <label for="memberRole" class="block text-gray-700 font-medium mb-1">Role</label>
          <input v-model="memberForm.role" type="text" id="memberRole" class="w-full px-4 py-2 border rounded-lg" placeholder="Contoh: Frontend Developer">
        </div>
        
        <div>
          <label for="memberTask" class="block text-gray-700 font-medium mb-1">Deskripsi Tugas</label>
          <textarea v-model="memberForm.task" id="memberTask" rows="3" class="w-full px-4 py-2 border rounded-lg" placeholder="Jelaskan tugas utama anggota tim"></textarea>
        </div>

        <div>
          <label for="memberImage" class="block text-gray-700 font-medium mb-1">URL Gambar</label>
          <input v-model="memberForm.image" type="text" id="memberImage" class="w-full px-4 py-2 border rounded-lg" placeholder="https://... (URL gambar profil)">
        </div>
        <div>
          <label for="memberGithub" class="block text-gray-700 font-medium mb-1">Link GitHub</label>
          <input v-model="memberForm.github" type="text" id="memberGithub" class="w-full px-4 py-2 border rounded-lg" placeholder="https://github.com/username">
        </div>
        
        <div class="flex items-center gap-4 pt-2">
          <button type="submit" class="bg-[#814C3C] text-white font-bold px-6 py-2 rounded-lg">
            {{ isEditing ? 'Update Anggota' : 'Tambah Anggota' }}
          </button>
          <button v-if="isEditing" @click="cancelEdit" type="button" class="bg-gray-200 text-gray-800 font-bold px-6 py-2 rounded-lg">Batal</button>
        </div>
      </form>
    </div>

    <div class="bg-white p-6 rounded-lg shadow-md">
      <h2 class="text-xl font-semibold mb-4">Daftar Anggota Tim</h2>
      <div class="space-y-4">
        <div v-for="member in teamStore.teamMembers" :key="member.id" class="flex items-start sm:items-center justify-between p-4 border rounded-lg">
          <div class="flex items-center gap-4">
            <img :src="member.image" alt="" class="w-12 h-12 rounded-full object-cover bg-gray-200">
            <div>
              <h3 class="font-bold text-lg">{{ member.name }}</h3>
              <p class="font-semibold text-sm text-gray-700">{{ member.role }}</p>
              <p class="text-xs text-gray-500">{{ member.task }}</p>
            </div>
          </div>
          <div class="flex items-center gap-3 self-end sm:self-center">
            <button @click="handleEdit(member)" class="text-blue-600 hover:text-blue-800 font-medium">Edit</button>
            <button @click="handleDeleteMember(member.id)" class="text-red-500 hover:text-red-700 font-medium">Hapus</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>