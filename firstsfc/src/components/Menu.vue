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
  background: #f8f8f8;
}

.menu h2 {
  font-size: 28px;
  font-weight: bold;
  color: #333;
  margin-bottom: 10px;
}

.menu p {
  font-size: 16px;
  color: #555;
  max-width: 600px;
  margin: 0 auto 30px;
}

.menu-container {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 25px;
}

.menu-item {
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  width: 320px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  transition: transform 0.3s ease-in-out, box-shadow 0.3s;
}

.menu-item:hover {
  transform: translateY(-5px);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
}

.menu-image {
  width: 100%;
  height: 200px;
  object-fit: cover;
}

.menu-details {
  padding: 20px;
}

.menu-name {
  font-size: 20px;
  font-weight: bold;
  color: #222;
}

.menu-description {
  font-size: 14px;
  color: #666;
  margin: 8px 0 12px;
}

.menu-price {
  font-size: 18px;
  font-weight: bold;
  color: #6a0dad;
  margin-bottom: 12px;
}

.order-button {
  background: #6a0dad;
  color: white;
  padding: 10px 18px;
  font-size: 14px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.3s ease-in-out;
}

.order-button:hover {
  background: #520b9b;
}

/* Responsive Design */
@media (max-width: 768px) {
  .menu-container {
    flex-direction: column;
    align-items: center;
  }
  
  .menu-item {
    width: 90%;
  }
}
</style>
