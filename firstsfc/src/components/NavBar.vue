<template>
  <header class="navbar">
    <div class="logo">
      <img src="/images/logo.png" alt="Dodoy's Grill Logo">
    </div>
    <nav>
      <ul>
        <li><a href="#home">Home</a></li>
        <li><a href="#menu">Menu</a></li>
        <li><a href="#orders">Orders</a></li>
        <li><a href="#login">Login</a></li>
      </ul>
    </nav>
  </header>
</template>

<style scoped>
.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #222;
  padding: 15px 30px;
}

.logo {
  display: flex;
  align-items: center;
}

.logo img {
  width: 140px; /* Adjust size as needed */
  height: auto;
  margin-right: 10px;
}

.logo span {
  color: white;
  font-size: 1.5rem;
  font-weight: bold;
}

nav ul {
  list-style: none;
  display: flex;
  gap: 20px;
}

nav ul li {
  display: inline;
}

nav ul li a {
  color: white;
  text-decoration: none;
  font-size: 1rem;
  font-weight: 500;
}

nav ul li a:hover {
  color: #ffcc00;
}
</style>
