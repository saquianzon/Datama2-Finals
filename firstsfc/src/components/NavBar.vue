<template>
  <nav class="navbar">
    <div class="logo">
      <img src="/images/logo.png" alt="Dodoy's Grill Logo" />
      <span></span>
    </div>
    <ul>
      <li><a href="#home">Home</a></li>
      <li><a href="#menu">Menu</a></li>
      <li><a href="#orders">Order Now</a></li>
    </ul>
  </nav>
</template>

<style scoped>
.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px;
  background-color: #333;
  color: white;
}

.logo {
  display: flex;
  align-items: center;
}

.logo img {
  height: 40px;
  margin-right: 10px;
}

ul {
  list-style: none;
  display: flex;
}

li {
  margin: 0 15px;
}

a {
  color: white;
  text-decoration: none;
}
</style>
