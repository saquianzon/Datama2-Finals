<template>
  <section id="orders" class="orders-container">
    <h2>Place Your Order</h2>
    <form @submit.prevent="placeOrder">
      <label for="firstName">First Name:</label>
      <input type="text" id="firstName" v-model="firstName" required />

      <label for="lastName">Last Name:</label>
      <input type="text" id="lastName" v-model="lastName" required />

      <label for="email">Email:</label>
      <input type="email" id="email" v-model="email" required />

      <label for="phone_number">Phone:</label>
      <input type="text" id="phone_number" v-model="phone_number" required />

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
            <option v-for="dish in dishes" :key="dish.d_id" :value="dish">
              {{ dish.dish_name }} - ₱{{ dish.price }} (Stock: {{ dish.stock_quantity }})
            </option>
          </select>
          <input type="number" v-model="order.quantity" min="1" required />
          <span class="price">₱{{ getDishPrice(order.dish) * order.quantity }}</span>
          <button type="button" class="remove-btn" @click="removeOrder(index)">Remove</button>
        </div>
        <button type="button" class="add-btn" @click="addOrder">Add Another Dish</button>
      </div>

      <br />
      <label for="extras">Additional Feedback:</label>
      <input type="text" id="extras" v-model="extras" placeholder="E.g. extra rice, calamansi, vinegar" />

      <h3 class="total-amount">Total Amount: ₱{{ totalAmount }}</h3>

      <div v-if="errorMessage" class="error-message">{{ errorMessage }}</div>

      <div class="button-container">
        <button type="submit" class="order-btn">Order Now</button>
      </div>
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
      phone_number: "",
      address: "",
      paymentMode: "",
      orders: [{ dish: null, quantity: 1 }],
      extras: "",
      dishes: [],
      errorMessage: ""
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
    async fetchDishes() {
      try {
        const { data, error } = await supabase.from("dishes").select("d_id, dish_name, price, stock_quantity");
        if (error) throw error;
        this.dishes = data;
      } catch (error) {
        console.error("Error fetching dishes:", error);
      }
    },
    addOrder() {
      this.orders.push({ dish: null, quantity: 1 });
    },
    removeOrder(index) {
      this.orders.splice(index, 1);
    },
    getDishPrice(dish) {
      return dish ? dish.price : 0;
    },
    async placeOrder() {
      this.errorMessage = "";
      if (!this.firstName || !this.lastName || !this.email || !this.phone_number || !this.address || !this.paymentMode) {
        this.errorMessage = "Please fill in all required fields.";
        return;
      }
      if (this.orders.length === 0 || this.orders.some(order => !order.dish)) {
        this.errorMessage = "Please add at least one dish to your order.";
        return;
      }
      if (!confirm("Are you sure you want to place this order?")) {
        return;
      }

      try {
        const { data: customerData, error: customerError } = await supabase.from("customer").insert([
          {
            first_name: this.firstName,
            last_name: this.lastName,
            email: this.email,
            phone_number: this.phone_number,
            address: this.address
          }
        ]).select();
        if (customerError) throw customerError;
        const customerId = customerData[0].c_id;

        const { data: orderData, error: orderError } = await supabase.from("cust_orders").insert([
          {
            c_id: customerId,
            pay_method: this.paymentMode,
            total_amount: this.totalAmount,
            status: "Pending"
          }
        ]).select();
        if (orderError) throw orderError;
        const orderId = orderData[0].o_id;

        for (const order of this.orders) {
          await supabase.from("order_details").insert([
            {
              o_id: orderId,
              d_id: order.dish.d_id,
              quantity: order.quantity
            }
          ]);
          await supabase.from("dishes").update({ stock_quantity: order.dish.stock_quantity - order.quantity }).eq("d_id", order.dish.d_id);
        }

        if (this.extras) {
          await supabase.from("cust_feedback").insert([
            {
              c_id: customerId,
              feedback_text: this.extras
            }
          ]);
        }

        alert("Order placed successfully!");
        this.resetForm();
      } catch (error) {
        console.error("Error placing order:", error);
        this.errorMessage = "Something went wrong. Please try again.";
      }
    },
    resetForm() {
      this.firstName = "";
      this.lastName = "";
      this.email = "";
      this.phone_number = "";
      this.address = "";
      this.paymentMode = "";
      this.orders = [{ dish: null, quantity: 1 }];
      this.extras = "";
      this.errorMessage = "";
    }
  },
  async created() {
    await this.fetchDishes();
  }
};
</script>


<style>
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

.button-container {
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
}

button {
  color: white;
  border: none;
  padding: 12px 18px;
  cursor: pointer;
  border-radius: 5px;
  flex: 1;
  margin: 5px;
  text-align: center;
  font-size: 18px; /* Enlarged font size for main buttons */
}

.confirm-btn {
  background-color: #d37800;
}
.confirm-btn:hover {
  background-color: #ad6200;
}

.order-btn {
  background-color: #006400;
}
.order-btn:hover {
  background-color: #004d00;
}

.add-btn {
  background-color: #004d99;
}
.add-btn:hover {
  background-color: #003366;
}

/* Keep Remove button as default size */
.remove-btn {
  background-color: #c50808;
  padding: 8px 12px;
  font-size: 14px;
}
.remove-btn:hover {
  background-color: #960606;
}

.error-message {
  color: red;
  font-weight: bold;
  margin-top: 10px;
}
</style>
