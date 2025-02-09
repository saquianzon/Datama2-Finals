<template>
  <section id="orders" class="orders-container">
    <h2>Place Your Order</h2>
    <form @submit.prevent="submitOrder">
      <label for="firstName">First Name:</label>
      <input type="text" id="firstName" v-model="firstName" required />

      <label for="lastName">Last Name:</label>
      <input type="text" id="lastName" v-model="lastName" required />

      <label for="email">Email:</label>
      <input type="email" id="email" v-model="email" required />

      <label for="phone">Phone:</label>
      <input type="text" id="phone" v-model="phone" required />

      <label for="address">Address:</label>
      <input type="text" id="address" v-model="address" required />

      <label for="paymentMode">Mode of Payment:</label>
      <select id="paymentMode" v-model="paymentMode" required>
        <option value="">Select Payment Method</option>
        <option value="Cash">Cash</option>
        <option value="GCash">GCash</option>
      </select>

      <div class="order-items">
        <h3>Your Order</h3>
        <div v-for="(order, index) in orders" :key="index" class="order-item">
          <select v-model="order.dish">
            <option v-for="dish in dishes" :key="dish.id" :value="dish">{{ dish.name }}</option>
          </select>
          <input type="number" v-model="order.quantity" min="1" required />
          <span class="price">₱{{ getDishPrice(order.dish) * order.quantity }}</span>
          <button type="button" @click="removeOrder(index)">Remove</button>
        </div>
        <button type="button" class="add-btn" @click="addOrder">Add Another Dish</button>
      </div>

      <br>
      <label for="extras">Additional Feedback:</label>
      <input type="text" id="extras" v-model="extras" placeholder="E.g. extra rice, calamansi, vinegar" />

      <h3 class="total-amount">Total Amount: ₱{{ totalAmount }}</h3>

      <button type="submit" class="order-btn">Order Now</button>
    </form>
  </section>
</template>

<script>
import { supabase } from '@/lib/supabaseClient';

export default {
  data() {
    return {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      address: "",
      paymentMode: "",
      orders: [{ dish: null, quantity: 1 }],
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
        return sum + (order.dish ? order.dish.price * order.quantity : 0);
      }, 0);
    }
  },
  methods: {
    getDishPrice(dish) {
      return dish ? dish.price : 0;
    },
    addOrder() {
      this.orders.push({ dish: null, quantity: 1 });
    },
    removeOrder(index) {
      this.orders.splice(index, 1);
    },
    async submitOrder() {
      try {
        if (!this.firstName || !this.lastName || !this.email || !this.phone || !this.address || !this.paymentMode || this.orders.some(order => !order.dish)) {
          alert("Please fill in all fields!");
          return;
        }
        
        console.log("Submitting order...");

        const { data: customer, error: custError } = await supabase
          .from('customer')
          .insert([{ first_name: this.firstName, last_name: this.lastName, email: this.email, phone_number: this.phone, address: this.address }])
          .select();

        if (custError) throw custError;
        if (!customer || customer.length === 0) throw new Error("Customer insertion failed");
        const customerId = customer[0].c_id;

        const { data: order, error: orderError } = await supabase
          .from('cust_orders')
          .insert([{ c_id: customerId, total_amount: this.totalAmount, admin_id: 1, payment_id: null, order_date: new Date().toISOString() }])
          .select();

        if (orderError) throw orderError;
        const orderId = order[0].o_id;

        const { data: payment, error: paymentError } = await supabase
          .from('payment')
          .insert([{ o_id: orderId, pay_method: this.paymentMode, amount_paid: this.totalAmount, pay_status: 'Pending' }])
          .select();

        if (paymentError) throw paymentError;
        const paymentId = payment[0].pay_id;

        await supabase.from('cust_orders').update({ payment_id: paymentId }).eq('o_id', orderId);

        for (let orderItem of this.orders) {
          await supabase.from('order_details').insert([{ order_id: orderId, dish_id: orderItem.dish.id, quantity: orderItem.quantity }]);
        }

        alert("Order placed successfully!");
      } catch (error) {
        console.error("Error placing order:", error);
        alert("Failed to place order. Please try again.");
      }
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
  max-width: 700px;
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
  flex-wrap: wrap;
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