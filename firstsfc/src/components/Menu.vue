<template>
  <section class="menu">
    <h2>Our Famous Dishes</h2>
    <p>Featuring the famous Chicken Inasal and other Ilonggo delicacies with the true taste of Bacolod in every bite! Kaon nata!</p>
    
    <div class="menu-container">
      <div v-for="dish in dishes" :key="dish.id" class="menu-item">
        <img :src="dish.image" :alt="dish.name" class="menu-image">
        <div class="menu-details">
          <h3 class="menu-name">{{ dish.name }}</h3>
          <p class="menu-description">{{ dish.description }}</p>
          <p class="menu-price">₱{{ dish.price.toFixed(2) }}</p>
          <button class="order-button" @click="orderDish(dish.name)">Order Now</button>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, defineEmits } from 'vue';

const emit = defineEmits(['order']);

const dishes = ref([
  { id: 1, name: 'Chicken Pecho', image: '/images/pecho.jpg', description: 'Pecho chicken inasal is a popular Filipino dish featuring marinated chicken breast (pecho) grilled over hot coals.', price: 129 },
  { id: 2, name: 'Chicken Paa', image: '/images/paa.jpg', description: 'Paa chicken inasal is grilled, marinated chicken leg flavored with a savory mix of vinegar, calamansi, lemongrass, garlic, ginger, and annatto oil.', price: 119 },
  { id: 3, name: 'Laswa', image: '/images/laswa.jpg', description: 'Laswa is a healthy and light Filipino vegetable soup from the Visayas region. The dish is simple, nutritious, and naturally sweet from the vegetables.', price: 79 },
  { id: 4, name: 'Bangus Whole', image: '/images/bangus.jpg', description: 'Bangus, or milkfish, is a staple in Filipino cuisine, prepared in various ways. It is known for its mild and sweet flavor, served with rice and a vinegar-based dipping sauce.', price: 210 },
  { id: 5, name: 'Sisig', image: '/images/sisig.jpg', description: 'Chicken sisig is a Filipino dish made from chopped grilled or fried pork, seasoned with onions, chili, calamansi, and mayonnaise.', price: 210 },
  { id: 6, name: 'Batchoy', image: '/images/batchoy.jpg', description: 'Batchoy is a rich and flavorful Filipino noodle soup from Iloilo. It features miki noodles in a savory pork or beef broth, topped with pork slices, liver and chicharon.', price: 109 },
  { id: 7, name: 'Pork BBQ', image: '/images/bbq.jpg', description: 'Filipino pork BBQ is a popular street food made of marinated pork slices skewered on bamboo sticks and grilled over charcoal', price: 40 },
  { id: 8, name: 'Pork Liempo', image: '/images/liempo.jpg', description: 'Grilled or fried pork belly dish known for its crispy skin and juicy, tender meat. Marinated in a mix of soy sauce and spices, then cooked until golden brown and served with vinegar.', price: 129 }
]);

const orderDish = (dishName) => {
  emit('order', dishName);
};
</script>

<style scoped>
.menu {
  text-align: center;
  padding: 50px 20px;
}

.menu-container {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 20px;
}

.menu-item {
  background: white;
  border-radius: 10px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  width: 300px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.menu-image {
  width: 100%;
  height: 180px;
  object-fit: cover;
}

.menu-details {
  padding: 15px;
}

.menu-name {
  font-size: 18px;
  font-weight: bold;
}

.menu-description {
  font-size: 14px;
  color: #666;
  margin: 5px 0;
}

.menu-price {
  font-size: 16px;
  font-weight: bold;
  color: #000;
}

.order-button {
  background: #6a0dad;
  color: white;
  padding: 8px 15px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: 0.3s;
}

.order-button:hover {
  background: #520b9b;
}
</style>
