<template>
  <div id="app">
    <NavBar />
    <Hero />
    <Menu @order="openOrders" />
    
    <!-- Container with border -->
    <div class="content-container">
      <Orders v-if="showOrders" :selectedDish="selectedDish" />
      <br><br>
      <TrackOrders />
      <br><br>
      <Delivery />
      <br><br>
    </div>
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
/* Full-page background effect */
#app {
  font-family: Arial, sans-serif;
  text-align: center;
  position: relative;
  overflow: hidden;
  background-color: #f9f9f9; /* Main background */
}

/* Content container */
.content-container {
  position: relative;
  padding: 20px;
  margin: 20px auto;
  max-width: 80%;
  background-color: white;
  border-radius: 10px;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
  z-index: 2;
}

/* Left and Right Sidebars */
#app::before,
#app::after {
  content: "";
  position: absolute;
  top: 0;
  width: 12%; /* Adjust width for sidebar size */
  height: 100%;
  background-color: #dda427; /* Change to your preferred sidebar color */
  z-index: 1;
}

/* Left Sidebar */
#app::before {
  left: 0;
}

/* Right Sidebar */
#app::after {
  right: 0;
}

</style>
