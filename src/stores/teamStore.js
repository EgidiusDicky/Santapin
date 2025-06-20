import { defineStore } from 'pinia'

const STORAGE_KEY = 'santapin_team_members';

export const useTeamStore = defineStore('team', {
  state: () => {
    const savedTeam = localStorage.getItem(STORAGE_KEY);
    
    //  gunakan data dari About.vue Anda sebagai data awal yang lebih relevan
    const initialTeam = [
      { id: 1, name: 'Egidius Dicky Narendra Baas', role: 'Team Leader', task: 'Mengkoordinasikan tim dan arsitektur proyek.', image: 'https://avatars.githubusercontent.com/u/162414603?v=4', github: 'https://github.com/egidiusdicky' },
      { id: 2, name: 'Rayan', role: 'Frontend Developer', task: 'Mengembangkan antarmuka pengguna dan pengalaman interaktif.', image: 'https://avatars.githubusercontent.com/u/87006289?v=4', github: 'https://github.com/rayanbersabal' },
      { id: 3, name: 'Garda Fitrananda', role: 'Frontend Developer', task: 'Implementasi desain dan memastikan responsivitas.', image: 'https://avatars.githubusercontent.com/u/202229964?v=4', github: 'https://github.com/gardafitrananda' },
      { id: 4, name: 'Sauzana', role: 'Frontend Developer', task: 'Manajemen state dan integrasi dengan komponen.', image: 'https://avatars.githubusercontent.com/u/202231744?v=4', github: 'https://github.com/Sauzana1919' },
      { id: 5, name: 'Sandi Setiawan', role: 'Frontend Developer', task: 'Optimasi performa dan fungsionalitas UI.', image: 'https://avatars.githubusercontent.com/u/193219383?v=4', github: 'https://github.com/SandiSetiawann' },
      { id: 6, name: 'Fahrudiansyah', role: 'Frontend Developer', task: 'Membangun komponen UI yang reusable dan logis.', image: 'https://avatars.githubusercontent.com/u/202230345?v=4', github: 'https://github.com/Fahrudiyansah' },
    ];

    return {
      teamMembers: savedTeam ? JSON.parse(savedTeam) : initialTeam
    }
  },
  actions: {
    // Aksi-aksi lain (fetch, add, update, delete) tidak perlu diubah.
    // Mereka sudah cukup fleksibel untuk menangani properti baru.
    fetchTeamMembers() {
      console.log('Team members loaded from state/localStorage.');
    },
    addTeamMember(member) {
      const newMember = { id: Date.now(), ...member };
      this.teamMembers.push(newMember);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.teamMembers));
    },
    updateTeamMember(updatedMember) {
      const index = this.teamMembers.findIndex(member => member.id === updatedMember.id);
      if (index !== -1) {
        this.teamMembers[index] = updatedMember;
        localStorage.setItem(STORAGE_KEY, JSON.stringify(this.teamMembers));
      }
    },
    deleteTeamMember(memberId) {
      this.teamMembers = this.teamMembers.filter(member => member.id !== memberId);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.teamMembers));
    }
  }
})