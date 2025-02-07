<template>
  <NavBar />
  <Hero />
  <Menu />
  <Orders />
  <Register />
  <Login />
  <Footer />
</template>

<script>
import NavBar from './components/NavBar.vue';
import Hero from './components/Hero.vue';
import Menu from './components/Menu.vue';
import Orders from './components/Orders.vue';
import Footer from './components/Footer.vue';

export default {
  components: {
    NavBar,
    Hero,
    Menu,
    Orders,
    Footer
  }
};
</script>
