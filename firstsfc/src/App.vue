<template>
  <div id="app">
    <NavBar />
    <Hero />
    <Menu @order="openOrders" />
    <Orders v-if="showOrders" :selectedDish="selectedDish" />
    <Footer />
  </div>
</template>

<script>
import { ref } from 'vue';
import NavBar from './components/NavBar.vue';
import Hero from './components/Hero.vue';
import Menu from './components/Menu.vue';
import Orders from './components/Orders.vue';
import Footer from './components/Footer.vue';

export default {
  components: { NavBar, Hero, Menu, Orders, Footer },
  setup() {
    const showOrders = ref(false);
    const selectedDish = ref('');

    const openOrders = (dish) => {
      selectedDish.value = dish;
      showOrders.value = true;
    };

    return { showOrders, selectedDish, openOrders };
  }
};
</script>

<style>
#app {
  font-family: Arial, sans-serif;
  text-align: center;
}
</style>