<template>
  <section id="track-orders" class="orders-container">
    <h2>Track Your Order</h2>
    <form @submit.prevent="fetchOrderDetails">
      <label for="firstName">First Name:</label>
      <input type="text" id="firstName" v-model="firstName" required />

      <label for="lastName">Last Name:</label>
      <input type="text" id="lastName" v-model="lastName" required />

      <label for="email">Email:</label>
      <input type="email" id="email" v-model="email" required />

      <div class="button-container">
        <button type="submit" class="order-btn">Check Status</button>
      </div>
    </form>
    
    <div v-if="order" class="order-details">
      <h3>Order Details</h3>
      <p><strong>Order ID:</strong> {{ order.o_id }}</p>
      <p><strong>Total Amount:</strong> ₱{{ order.total_amount }}</p>
      <p><strong>Payment Status:</strong> {{ order.pay_status }}</p>
      <p><strong>Delivery Status:</strong> {{ order.delivery_status }}</p>
      <h4>Ordered Dishes:</h4>
      <ul>
        <li v-for="dish in order.dishes" :key="dish.id">{{ dish.name }} - Qty: {{ dish.quantity }}</li>
      </ul>
    </div>
    
    <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
  </section>
</template>

<script>
import { supabase } from '@/lib/supabaseClient';

export default {
  data() {
    return {
      firstName: '',
      lastName: '',
      email: '',
      order: null,
      errorMessage: ''
    };
  },
  methods: {
    async fetchOrderDetails() {
      if (!this.firstName || !this.lastName || !this.email) {
        this.errorMessage = "Please fill in all required fields.";
        return;
      }
      this.errorMessage = '';
      this.order = null;

      try {
        const { data: customer, error: custError } = await supabase
          .from('customer')
          .select('c_id')
          .eq('email', this.email)
          .eq('first_name', this.firstName)
          .eq('last_name', this.lastName)
          .single();

        if (custError || !customer) {
          this.errorMessage = "No customer found with these details.";
          return;
        }

        const { data: orders, error: orderError } = await supabase
          .from('cust_orders')
          .select(`
            o_id, 
            total_amount, 
            order_date,
            payment(pay_status),
            delivery(deli_status),
            order_details(dish_id, quantity)
          `)
          .eq('c_id', customer.c_id)
          .order('order_date', { ascending: false })
          .limit(1);

        if (orderError || !orders || orders.length === 0) {
          this.errorMessage = "No orders found for this customer.";
          return;
        }

        const order = orders[0];

        const dishIds = order.order_details.map(d => d.dish_id);
        const { data: dishesData, error: dishesError } = await supabase
          .from('dishes')
          .select('d_id, dish_name')
          .in('d_id', dishIds);

        if (dishesError) {
          console.error("Error fetching dishes:", dishesError);
          this.errorMessage = "Error fetching dish details.";
          return;
        }

        order.dishes = order.order_details.map(d => ({
          name: dishesData.find(dish => dish.d_id === d.dish_id)?.dish_name || 'Unknown Dish',
          quantity: d.quantity
        }));

        this.order = {
          o_id: order.o_id,
          total_amount: order.total_amount,
          pay_status: order.payment?.pay_status || 'Unknown',
          delivery_status: order.delivery?.deli_status || 'Pending',
          dishes: order.dishes
        };
      } catch (err) {
        console.error("Error fetching order details:", err);
        this.errorMessage = "Something went wrong. Please try again.";
      }
    }
  }
};
</script>

<style>
.orders-container {
  max-width: 600px;
  margin: auto;
  padding: 20px;
  background: #fff;
  border-radius: 10px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}
.button-container {
  text-align: center;
  margin-top: 10px;
}
.order-btn {
  padding: 10px 20px;
  background: #28a745;
  color: white;
  border: none;
  cursor: pointer;
  border-radius: 5px;
}
.error-message {
  color: red;
  margin-top: 10px;
}
</style>
