<template>
  <div id="app">
    <NavBar />
    <Hero />
    <Menu @order="openOrders" />
    <Orders v-if="showOrders" :selectedDish="selectedDish" />
    <br><br>
    <TrackOrders/>
    <br><br>
    <Delivery/>
    <br><br>
    <Footer />
  </div>
</template>

<script>
import { ref } from 'vue';
import NavBar from './components/NavBar.vue';
import Hero from './components/Hero.vue';
import Menu from './components/Menu.vue';
import Orders from './components/Orders.vue';
import TrackOrders from './components/TrackOrders.vue';
import Delivery from './components/Delivery.vue';
import Footer from './components/Footer.vue';

export default {
  components: { NavBar, Hero, Menu, Orders, TrackOrders, Delivery, Footer },
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

.page-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #e9c37e;
}
</style>