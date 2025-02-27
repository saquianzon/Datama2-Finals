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

/* Add border around the whole section after Menu.vue */
.content-container {
  border: 3px solid #007bff; /* Blue border */
  border-radius: 10px; /* Rounded corners */
  padding: 20px; /* Add spacing inside */
  margin: 20px auto; /* Center and add margin */
  max-width: 80%; /* Set a max width */
  background-color: #f9f9f9; /* Light background */
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1); /* Soft shadow */
}
</style>
