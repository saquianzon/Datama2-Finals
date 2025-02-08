<template>
  <section id="orders" class="orders-container">
    <h2>Place Your Order</h2>
    <form @submit.prevent="submitOrder">
      <label for="name">Name:</label>
      <input type="text" id="name" v-model="name" required />

      <label for="phone">Phone:</label>
      <input type="text" id="phone" v-model="phone" required />

      <label for="address">Address:</label>
      <input type="text" id="address" v-model="address" required />

      <div class="order-items">
        <h3>Your Order</h3>
        <div v-for="(order, index) in orders" :key="index" class="order-item">
          <select v-model="order.dish">
            <option v-for="dish in dishes" :key="dish.id" :value="dish.name">{{ dish.name }}</option>
          </select>
          <input type="number" v-model="order.quantity" min="1" required />
          <span class="price">₱{{ getDishPrice(order.dish) * order.quantity }}</span>
          <button type="button" @click="removeOrder(index)">Remove</button>
        </div>
        <button type="button" class="add-btn" @click="addOrder">Add Another Dish</button>
      </div>

      <label for="extras">Additional Feedback:</label>
      <input type="text" id="extras" v-model="extras" placeholder="E.g. extra rice, calamansi, vinegar" />

      <h3 class="total-amount">Total Amount: ₱{{ totalAmount }}</h3>

      <button type="submit" class="order-btn">Order Now</button>
    </form>
  </section>
</template>

<script>
export default {
  props: {
    selectedDish: {
      type: String,
      default: ""
    }
  },
  data() {
    return {
      name: "",
      phone: "",
      address: "",
      orders: [{ dish: this.selectedDish || "", quantity: 1 }],
      extras: "",
      dishes: [
        { id: 1, name: "Amigo 1A Pecho (with Iced Tea)", price: 129 },
        { id: 2, name: "Amigo 1B Paa (with Iced Tea)", price: 119 },
        { id: 3, name: "Chikn Pecho", price: 129 },
        { id: 4, name: "Chikn Paa", price: 119 },
        { id: 5, name: "Laswa", price: 80 },
        { id: 6, name: "Bangus Whole", price: 210 },
        { id: 7, name: "Sisig", price: 150 },
        { id: 8, name: "Batchoy", price: 90 },
        { id: 9, name: "Pork BBQ", price: 40 },
        { id: 10, name: "Pork Liempo", price: 160 }
      ]
    };
  },
  computed: {
    totalAmount() {
      return this.orders.reduce((sum, order) => {
        const dish = this.dishes.find(d => d.name === order.dish);
        return sum + (dish ? dish.price * order.quantity : 0);
      }, 0);
    }
  },
  methods: {
    getDishPrice(dishName) {
      const dish = this.dishes.find(d => d.name === dishName);
      return dish ? dish.price : 0;
    },
    addOrder() {
      this.orders.push({ dish: "", quantity: 1 });
    },
    removeOrder(index) {
      this.orders.splice(index, 1);
    },
    submitOrder() {
      if (!this.name || !this.phone || !this.address || this.orders.some(order => !order.dish)) {
        alert("Please fill in all fields!");
        return;
      }
      console.log("Order placed:", this.name, this.phone, this.address, this.orders, this.extras);
      alert("Order placed successfully!");
    }
  }
};
</script>

<style>
/* Updated background styling */
.orders-container {
  background-color: #f8f9fa;
  padding: 30px;
  border-radius: 10px;
  max-width: 700px; /* Increased width */
  margin: auto;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

form {
  display: flex;
  flex-direction: column;
}

input, select {
  margin: 10px 0;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 5px;
  width: 100%;
}

.order-items {
  margin: 15px 0;
}

.order-item {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap; /* Ensures buttons don’t overflow */
}

button {
  background-color: #006400;
  color: white;
  border: none;
  padding: 10px;
  cursor: pointer;
  border-radius: 5px;
}

button:hover {
  background-color: #004d00;
}

.price {
  font-weight: bold;
}

.total-amount {
  font-size: 18px;
  font-weight: bold;
  margin-top: 15px;
}

.add-btn {
  background-color: #004d99;
}

.add-btn:hover {
  background-color: #003366;
}

.order-btn {
  background-color: #006400;
  font-size: 18px;
}

.order-btn:hover {
  background-color: #004d00;
}
</style>
