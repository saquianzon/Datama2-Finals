<template>
  <div id="app">
    <NavBar />
    <Hero />
    <Menu @order="openOrders" />

    <div class="page-container">
    <Orders v-if="showOrders" :selectedDish="selectedDish" />
    <br><br>
    <TrackOrders/>
    <br><br>
    <Delivery/>
    <br><br>
    <Footer />
    </div>
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
  background-color: #f9f9f9;
}

.sidebar {
  width: 12%;
  background-color: #e9a30e;
  height: 100vh;
  position: absolute;
  top: 0;
}

.left {
  left: 0;
}

.right {
  right: 0;
}

.content-container {
  flex: 1;
  max-width: 80%;
  padding: 20px;
  background-color: white;
  border-radius: 10px;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
}
</style>