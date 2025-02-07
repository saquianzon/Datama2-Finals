<template>
    <section class="menu">
      <h2>Our Famous Dishes</h2>
      <p>Featuring the famous Chicken Inasal and other Ilonggo delicacies with the true taste of Bacolod in every bite! Kaon nata!</p>
      <div class="menu-grid">
        <div v-for="dish in dishes" :key="dish.id" class="menu-item">
          <img :src="dish.image" :alt="dish.name">
          <h3>{{ dish.name }}</h3>
        </div>
      </div>
    </section>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  
  const dishes = ref([
    { id: 1, name: 'Chicken Pecho', image: '/images/pecho.jpg' },
    { id: 2, name: 'Pork BBQ', image: '/images/bbq.jpg' },
    { id: 3, name: 'Laswa', image: '/images/laswa.jpg' },
    { id: 4, name: 'Bangus', image: '/images/bangus.jpg' },
    { id: 5, name: 'Sisig', image: '/images/sisig.jpg' },
    { id: 5, name: 'Batchoy', image: '/images/batchoy.jpg' }
  ]);
  </script>
  
  <style scoped>
  .menu {
    text-align: center;
    padding: 50px 20px;
  }
  
  .menu-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 20px;
    justify-content: center;
  }
  
  .menu-item img {
    width: 100%;
    border-radius: 10px;
    transition: transform 0.3s;
  }
  
  .menu-item img:hover {
    transform: scale(1.05);
  }
  </style>
  