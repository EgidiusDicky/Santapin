<script setup>
import { ref, onMounted, watch } from 'vue';
import { useTeamStore } from '../stores/teamStore';

const teamStore = useTeamStore();

// State untuk form, digunakan untuk 'tambah' dan 'edit'
// role dan task sekarang adalah string yang akan dipecah/digabung
const memberForm = ref({
    name: '',
    role: '', // Akan diisi sebagai string multi-baris dari textarea
    task: '', // Akan diisi sebagai string multi-baris dari textarea
    image: '',
    github: '',
    nim: '',
});

// State baru untuk melacak mode edit
const isEditing = ref(false);
const editingMemberId = ref(null);

// State untuk pesan status (sukses/error)
const statusMessage = ref('');
const isError = ref(false);

// Watcher untuk memberForm.github: Mengotomatiskan pengambilan avatar GitHub
watch(() => memberForm.value.github, (newGithubUrl) => {
    if (newGithubUrl) {
        try {
            const url = new URL(newGithubUrl);
            // Memeriksa apakah hostname adalah github.com
            if (url.hostname === 'github.com' || url.hostname === 'www.github.com') {
                // Mengambil username dari path URL (misal: /username)
                const pathParts = url.pathname.split('/').filter(Boolean);
                if (pathParts.length > 0) {
                    const githubUsername = pathParts[0];
                    // Membentuk URL avatar GitHub otomatis
                    memberForm.value.image = `https://github.com/${githubUsername}.png?size=200`;
                    statusMessage.value = ''; // Hapus pesan error jika ada
                    isError.value = false;
                } else {
                    memberForm.value.image = '';
                    statusMessage.value = 'Tidak dapat menemukan username GitHub dari URL ini.';
                    isError.value = true;
                }
            } else {
                // Jika bukan URL GitHub, kosongkan image dan beri peringatan
                memberForm.value.image = '';
                statusMessage.value = 'URL GitHub tidak valid. Avatar tidak bisa diambil otomatis.';
                isError.value = true;
            }
        } catch (e) {
            // Menangani error jika format URL tidak valid
            memberForm.value.image = '';
            statusMessage.value = 'Format URL GitHub tidak valid.';
            isError.value = true;
        }
    } else {
        // Jika field GitHub kosong, kosongkan juga image
        memberForm.value.image = '';
        statusMessage.value = '';
        isError.value = false;
    }
});

// Fungsi untuk menangani submit form (bisa untuk tambah atau update)
async function handleSubmit() {
    // Validasi dasar
    if (!memberForm.value.name || !memberForm.value.task) {
        statusMessage.value = 'Nama dan tugas tidak boleh kosong!';
        isError.value = true;
        return;
    }

    // Konversi string multi-baris role dan task dari textarea menjadi array
    // Split berdasarkan baris baru ('\n'), hapus spasi di awal/akhir, dan filter string kosong
    const memberDataToSend = {
        ...memberForm.value,
        role: memberForm.value.role ? memberForm.value.role.split('\n').map(s => s.trim()).filter(s => s) : [],
        task: memberForm.value.task ? memberForm.value.task.split('\n').map(s => s.trim()).filter(s => s) : []
    };

    try {
        statusMessage.value = ''; // Reset pesan status
        isError.value = false;

        if (isEditing.value) {
            // Jika sedang mode edit, panggil aksi update
            await teamStore.updateTeamMember({ id: editingMemberId.value, ...memberDataToSend });
            statusMessage.value = 'Anggota tim berhasil diperbarui!';
        } else {
            // Jika tidak, panggil aksi tambah
            await teamStore.addTeamMember(memberDataToSend);
            statusMessage.value = 'Anggota tim berhasil ditambahkan!';
        }

        // Reset form dan mode edit ke kondisi awal setelah sukses
        cancelEdit();
    } catch (err) {
        // Tangani error dari Pinia Store
        statusMessage.value = teamStore.error || 'Terjadi kesalahan saat menyimpan anggota.';
        isError.value = true;
    }
}

// Fungsi untuk menghapus anggota tim
async function handleDeleteMember(memberId) {
    if (confirm('Apakah Anda yakin ingin menghapus anggota tim ini?')) {
        try {
            statusMessage.value = '';
            isError.value = false;
            await teamStore.deleteTeamMember(memberId);
            statusMessage.value = 'Anggota tim berhasil dihapus!';
        } catch (err) {
            statusMessage.value = teamStore.error || 'Terjadi kesalahan saat menghapus anggota.';
            isError.value = true;
        }
    }
}

// Fungsi ini dipanggil saat tombol 'Edit' diklik
function handleEdit(member) {
    isEditing.value = true;
    editingMemberId.value = member.id;
    // Salin data anggota ke form
    // Saat edit, konversi array role dan task dari store menjadi string multi-baris untuk textarea
    memberForm.value = {
        name: member.name,
        role: Array.isArray(member.role) ? member.role.join('\n') : '', // Gabungkan array menjadi string
        task: Array.isArray(member.task) ? member.task.join('\n') : '', // Gabungkan array menjadi string
        image: member.image || '',
        github: member.github || '',
        nim: member.nim || ''
    };
    statusMessage.value = ''; // Reset pesan status
    isError.value = false;
    window.scrollTo({ top: 0, behavior: 'smooth' }); // Scroll ke atas agar form terlihat
}

// Fungsi untuk membatalkan mode edit
function cancelEdit() {
    isEditing.value = false;
    editingMemberId.value = null;
    // Kosongkan kembali form
    memberForm.value = { name: '', role: '', task: '', image: '', github: '',nim: '' };
    statusMessage.value = ''; // Reset pesan status
    isError.value = false;
}

// Ambil data tim saat komponen dimuat
onMounted(() => {
    teamStore.fetchTeamMembers();
});
</script>

<template>
    <div class="p-6 md:p-8">
        <h1 class="text-3xl font-bold mb-6 text-gray-800">Pengaturan Tim</h1>

        <div v-if="statusMessage" :class="{'bg-green-100 border-green-400 text-green-700': !isError, 'bg-red-100 border-red-400 text-red-700': isError}" class="px-4 py-3 rounded relative mb-4" role="alert">
            <strong class="font-bold">{{ isError ? 'Error!' : 'Sukses!' }}</strong>
            <span class="block sm:inline whitespace-pre-line"> {{ statusMessage }}</span>
        </div>

        <div class="bg-white p-6 rounded-lg shadow-md mb-8">
            <h2 class="text-xl font-semibold mb-4">{{ isEditing ? 'Edit Anggota Tim' : 'Tambah Anggota Tim Baru' }}</h2>
            <form @submit.prevent="handleSubmit" class="space-y-4">
                <div>
                    <label for="memberName" class="block text-gray-700 font-medium mb-1">Nama Anggota</label>
                    <input v-model="memberForm.name" type="text" id="memberName" class="w-full px-4 py-2 border rounded-lg" required>
                </div>

                <div>
                    <label for="memberRole" class="block text-gray-700 font-medium mb-1">Role (Pisahkan dengan Enter)</label>
                    <textarea v-model="memberForm.role" id="memberRole" rows="2" class="w-full px-4 py-2 border rounded-lg" placeholder="Contoh:&#10;Frontend Developer&#10;UI/UX Designer"></textarea>
                </div>

                <div>
                    <label for="memberTask" class="block text-gray-700 font-medium mb-1">Deskripsi Tugas (Pisahkan dengan Enter)</label>
                    <textarea v-model="memberForm.task" id="memberTask" rows="5" class="w-full px-4 py-2 border rounded-lg" placeholder="Jelaskan tugas utama anggota tim&#10;- Mengembangkan antarmuka pengguna&#10;- Memastikan responsivitas"></textarea>
                </div>

                <div>
                    <label for="memberGithub" class="block text-gray-700 font-medium mb-1">Link GitHub Profile</label>
                    <input v-model="memberForm.github" type="url" id="memberGithub" class="w-full px-4 py-2 border rounded-lg" placeholder="https://github.com/username">
                </div>

                <div>
                    <label for="memberNim" class="block text-gray-700 font-medium mb-1">Nomor Induk Mahasiswa (NIM)</label>
                    <input v-model="memberForm.nim" type="text" id="memberNim" class="w-full px-4 py-2 border rounded-lg" placeholder="Contoh: 1234567890">
                </div>

                <div>
                    <label for="memberImage" class="block text-gray-700 font-medium mb-1">URL Gambar Avatar (Otomatis dari GitHub jika valid)</label>
                    <input v-model="memberForm.image" type="url" id="memberImage" class="w-full px-4 py-2 border rounded-lg" placeholder="https://... (URL gambar profil)" :readonly="!isError && memberForm.image && memberForm.github">
                    <p v-if="!isError && memberForm.github && memberForm.image" class="text-sm text-green-600 mt-1">Avatar berhasil diambil otomatis dari GitHub.</p>
                    <p v-if="isError && memberForm.github" class="text-sm text-red-600 mt-1">{{ statusMessage }}</p>
                    <p v-if="memberForm.github && !memberForm.image && !isError" class="text-sm text-gray-500 mt-1">Isi link GitHub untuk otomatis ambil avatar, atau masukkan URL gambar manual.</p>
                </div>

                <div class="flex items-center gap-4 pt-2">
                    <button type="submit" class="bg-[#814C3C] text-white font-bold px-6 py-2 rounded-lg" :disabled="teamStore.loading">
                        {{ teamStore.loading ? 'Memproses...' : (isEditing ? 'Update Anggota' : 'Tambah Anggota') }}
                    </button>
                    <button v-if="isEditing" @click="cancelEdit" type="button" class="bg-gray-200 text-gray-800 font-bold px-6 py-2 rounded-lg" :disabled="teamStore.loading">Batal</button>
                </div>
            </form>
        </div>

        <div class="bg-white p-6 rounded-lg shadow-md">
            <h2 class="text-xl font-semibold mb-4">Daftar Anggota Tim</h2>
            <div v-if="teamStore.loading" class="text-center py-4">Memuat anggota tim...</div>
            <div v-else-if="teamStore.error" class="text-red-600 text-center py-4 whitespace-pre-line">{{ teamStore.error }}</div>
            <div v-else class="space-y-4">
                <div v-for="member in teamStore.teamMembers" :key="member.id" class="flex items-start sm:items-center justify-between p-4 border rounded-lg">
                    <div class="flex items-center gap-4">
                        <img :src="member.image || 'https://via.placeholder.com/50'" :alt="'Foto ' + member.name" class="w-12 h-12 rounded-full object-cover bg-gray-200">
                        <div>
                            <h3 class="font-bold text-lg">{{ member.name }}</h3>
                            <p v-if="member.nim" class="text-sm text-gray-500 mt-1">NIM: {{ member.nim }}</p> 
                            <p class="font-semibold text-sm text-gray-700">
                                <span v-if="member.role && member.role.length > 0">
                                    <span v-for="(role, idx) in member.role" :key="idx">
                                        {{ role }}<span v-if="idx < member.role.length - 1">, </span>
                                    </span>
                                </span>
                                <span v-else class="italic text-gray-500">Tidak ada role</span>
                            </p>
                            <ul v-if="member.task && member.task.length > 0" class="list-disc text-xs text-gray-500 pl-4 mt-1">
                                <li v-for="(task, idx) in member.task" :key="idx">{{ task }}</li>
                            </ul>
                            <p v-else class="text-xs text-gray-500 italic mt-1">Tidak ada tugas</p>
                        </div>
                    </div>
                    <div class="flex items-center gap-3 self-end sm:self-center">
                        <button @click="handleEdit(member)" class="text-blue-600 hover:text-blue-800 font-medium">Edit</button>
                        <button @click="handleDeleteMember(member.id)" class="text-red-500 hover:text-red-700 font-medium">Hapus</button>
                    </div>
                </div>
                <p v-if="!teamStore.teamMembers.length && !teamStore.loading && !teamStore.error" class="text-gray-500 text-center py-4">Belum ada anggota tim ditambahkan.</p>
            </div>
        </div>
    </div>
</template>