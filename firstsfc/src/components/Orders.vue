<template>
  <section id="orders" class="orders-container">
    <h2>Place Your Order</h2>
    <form @submit.prevent="submitOrder">
      <label for="firstName">First Name:</label>
      <input type="text" id="firstName" v-model="firstName" required />

      <label for="lastName">Last Name:</label>
      <input type="text" id="lastName" v-model="lastName" required />

      <label for="email">Email:</label>
      <input type="email" id="email" required v-model="email" />

      <label for="phone">Phone:</label>
      <input type="text" id="phone" required v-model="phone" />

      <label for="address">Address:</label>
      <input type="text" id="address" required v-model="address" />

      <label for="paymentMode">Mode of Payment:</label>
      <select id="paymentMode" v-model="paymentMode" required>
        <option value="">Select Payment Method</option>
        <option value="Cash">Cash</option>
        <option value="GCash">GCash</option>
      </select>

      <div v-if="paymentMode === 'GCash'">
        <img src="/images/qr.png" alt="GCash Payment" class="payment-image" />
      </div>

      <div class="order-items">
        <h3>Your Order</h3>
        <div v-for="(order, index) in orders" :key="index" class="order-item">
          <select v-model="order.dish">
            <option value="">Select a meal</option>
            <option v-for="dish in dishes" :key="dish.d_id" :value="dish">
              {{ dish.dish_name }} - ₱{{ dish.price }}
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

    <div v-if="orderPlaced && paymentMode === 'GCash'">
      <button @click="confirmPayment" class="confirm-payment-btn">Confirm Payment</button>
      <button @click="cancelOrder" class="cancel-payment-btn">Cancel Order</button>
    </div>
  </section>
</template>

<script>
import { supabase } from "@/lib/supabaseClient";

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
      dishes: [],
      errorMessage: "",
      orderPlaced: false,
      orderId: null,
      paymentId: null,
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
    async fetchDishes() {
      try {
        const { data, error } = await supabase.from("dishes").select("d_id, dish_name, price, stock_quantity");
        if (error) throw error;
        this.dishes = data;
      } catch (error) {
        console.error("Error fetching dishes:", error);
      }
    },
    async submitOrder() {
      this.errorMessage = "";
      if (!this.firstName || !this.lastName || !this.email || !this.phone || !this.address || !this.paymentMode) {
        this.errorMessage = "Please fill in all required fields.";
        return;
      }
      if (this.orders.length === 0 || this.orders.some(order => !order.dish)) {
        this.errorMessage = "Please add at least one dish to your order.";
        return;
      }
      try {
        let { data: existingCustomer } = await supabase.from("customer").select("c_id").eq("email", this.email).single();
        let customerId = existingCustomer ? existingCustomer.c_id : null;

        if (!customerId) {
          const { data: newCustomer } = await supabase.from("customer").insert([{ first_name: this.firstName, last_name: this.lastName, email: this.email, phone_number: this.phone, address: this.address }]).select("c_id").single();
          customerId = newCustomer.c_id;
        }

        const { data: newOrder } = await supabase.from("cust_orders").insert([{ c_id: customerId, total_amount: this.totalAmount, admin_id: 1 }]).select("o_id").single();
        this.orderId = newOrder.o_id;

        const orderDetails = this.orders.map(order => ({ order_id: this.orderId, dish_id: order.dish.d_id, quantity: order.quantity }));
        await supabase.from("order_details").insert(orderDetails);

        const { data: newPayment } = await supabase.from("payment").insert([{ o_id: this.orderId, pay_method: this.paymentMode, amount_paid: this.totalAmount, pay_status: "Pending" }]).select("pay_id").single();
        this.paymentId = newPayment.pay_id;
        await supabase.from("cust_orders").update({ payment_id: this.paymentId }).eq("o_id", this.orderId);

        await supabase.from("delivery").insert([{ o_id: this.orderId, deli_status: "In Transit", pay_id: this.paymentId, admin_id: 1 }]);
        await supabase.from("cust_feedback").insert([{ o_id: this.orderId, remark_text: this.extras }]);
        
        this.orderPlaced = true;
        alert("Order placed successfully!");
      } catch (error) {
        console.error("Error placing order:", error);
        this.errorMessage = "Failed to place order. Please try again.";
      }
    },
    async confirmPayment() {
      if (!this.paymentId) return;

      try {
        await supabase.from("payment").update({ pay_status: "Completed" }).eq("pay_id", this.paymentId);
        alert("Payment confirmed successfully!");
      } catch (error) {
        console.error("Error confirming payment:", error);
        alert("Failed to confirm payment. Please try again.");
      }
    },
    async cancelOrder() {
      if (!this.orderId) return;
      await supabase.from("cust_orders").delete().eq("o_id", this.orderId);
      this.orderPlaced = false;
      alert("Order canceled successfully!");
    }
  },
  async created() {
    await this.fetchDishes();
  }
};
</script>




<style>
.payment-image {
  width: 150px;
  margin: 10px 0;
}
.confirm-payment-btn {
  background-color: green;
  color: white;
  padding: 10px;
  border: none;
  cursor: pointer;
}



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