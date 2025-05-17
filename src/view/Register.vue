<template>
  <div class="auth-container">
    <div class="auth-card">
      <h2>Santapin</h2>
      <div class="tab-switch">
        <router-link to="/login" class="tab-button-link">
          <button :class="{ active: !isRegister }">Login</button>
        </router-link>
        <router-link to="/register" class="tab-button-link">
          <button :class="{ active: isRegister }">Register</button>
        </router-link>
      </div>
      <form @submit.prevent="handleRegister">
        <label>Email</label>
        <input
          v-model="email"
          type="email"
          placeholder="Enter your email"
          required
        />

        <label>Password</label>
        <input
          v-model="password"
          type="password"
          placeholder="Enter your password"
          required
        />
        <p v-if="password.length > 0 && password.length < 6" class="error">
          Password too short
        </p>

        <label>Nama Lengkap *</label>
        <input
          v-model="fullName"
          type="text"
          placeholder="Masukkan nama lengkap anda"
          required
        />

        <label>Nomor HP *</label>
        <input
          v-model="phone"
          type="text"
          placeholder="Masukkan nomor HP anda"
          required
        />

        <label>Alamat Pengantaran *</label>
        <textarea
          v-model="address"
          placeholder="Masukkan alamat domisili anda"
          required
        ></textarea>

        <button type="submit">Register</button>
      </form>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      email: "",
      password: "",
      fullName: "",
      phone: "",
      address: "",
    };
  },
  computed: {
    isRegister() {
      return this.$route.path === "/register";
    },
  },
  methods: {
    handleRegister() {
      alert("Register UI only. No backend connected.");
    },
  },
};
</script>

<style scoped>
.auth-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #3d5640;
  padding: 1rem;
}

.auth-card {
  background: white;
  padding: 2rem;
  border-radius: 1rem;
  width: 400px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  text-align: center;
}

.auth-card h2 {
  color: #7d4b3f;
  font-weight: bold;
  font-size: 1.5rem;
  margin-bottom: 1.5rem;
}

.tab-switch {
  display: flex;
  justify-content: space-between;
  margin-bottom: 1.5rem;
}

.tab-button-link {
  width: 48%;
}

.tab-button-link button {
  width: 100%;
  padding: 0.75rem;
  border-radius: 0.5rem;
  border: 1px solid #7d4b3f;
  background-color: white;
  color: #7d4b3f;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.2s ease;
}

.tab-button-link button.active {
  background-color: #7d4b3f;
  color: white;
}

form {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  text-align: left;
}

label {
  font-size: 0.8rem;
  color: #333;
  font-weight: 600;
}

input,
textarea {
  padding: 0.6rem;
  border-radius: 5px;
  border: 1px solid #ccc;
  font-size: 0.9rem;
  width: 100%;
}

textarea {
  resize: none;
  min-height: 60px;
}

button[type="submit"] {
  margin-top: 1rem;
  background-color: #3d5640;
  color: white;
  border: none;
  font-weight: bold;
  padding: 0.75rem;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

button[type="submit"]:hover {
  background-color: #2f4231;
}

.error {
  color: red;
  font-size: 0.75rem;
}
</style>
