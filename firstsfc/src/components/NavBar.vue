<template>
  <header>
    <div class="logo">
      <img src="/images/logo.png" alt="Dodoy's Grill Logo">
    </div>
    <nav>
      <ul>
        <li><router-link to="/">Home</router-link></li>
        <li><router-link to="/menu">Menu</router-link></li>
        <li><router-link to="/orders">Orders</router-link></li>
      </ul>
    </nav>
    <div class="auth-buttons">
      <router-link to="/login" class="btn">Login</router-link>
      <router-link to="/register" class="btn">Register</router-link>
    </div>
  </header>
</template>

<style scoped>
header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 20px;
  background: #222;
  color: white;
}

.logo img {
  width: 120px;
}

nav ul {
  list-style: none;
  display: flex;
  gap: 20px;
}

.auth-buttons .btn {
  padding: 8px 15px;
  background: #ffcc00;
  color: black;
  border-radius: 5px;
  text-decoration: none;
  font-weight: bold;
}

.auth-buttons .btn:hover {
  background: #ff9900;
}
</style>
