<template>
  <nav class="navbar">
    <div class="logo">Santapin</div>
    <ul class="nav-links">
      <li><router-link to="/">Home</router-link></li>
      <li><router-link to="/menu">Menu</router-link></li>
      <li><router-link to="/pesanan">Pesanan</router-link></li>
      <li><router-link to="/keranjang">Keranjang</router-link></li>
    </ul>
    <router-link to="/login" class="login-button">Login</router-link>
  </nav>
</template>

<style scoped>
.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  background-color: white;
  font-family: "Poppins", sans-serif;
}

.logo {
  font-size: 1.5rem;
  font-weight: 600;
  color: #7a4c3b;
}

.nav-links {
  display: flex;
  list-style: none;
  gap: 1.5rem;
}

.nav-links a {
  text-decoration: none;
  color: #7a4c3b;
  font-weight: 500;
}

.login-button {
  background-color: #7a4c3b;
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  text-decoration: none;
}
</style>
