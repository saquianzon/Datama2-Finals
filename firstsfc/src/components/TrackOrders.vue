<template>
    <section class="order-container">
      <h2>Track Your Order</h2>
      <label for="email">Enter Your Email:</label>
      <input type="email" v-model="email" required />
      <button @click="fetchOrderDetails">Check Status</button>
  
      <div v-if="order">
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
      
      <p v-if="error" class="error-message">{{ error }}</p>
    </section>
  </template>
  
  <script>
  import { supabase } from '@/lib/supabaseClient';
  
  export default {
    data() {
      return {
        email: '',
        order: null,
        error: ''
      };
    },
    methods: {
      async fetchOrderDetails() {
        if (!this.email) {
          this.error = "Please enter your email.";
          return;
        }
        this.error = '';
        this.order = null;
  
        try {
          const { data: customer, error: custError } = await supabase
            .from('customer')
            .select('c_id')
            .eq('email', this.email)
            .single();
  
          if (custError || !customer) {
            this.error = "No customer found with this email.";
            return;
          }
  
          const { data: orders, error: orderError } = await supabase
            .from('cust_orders')
            .select('o_id, total_amount, payment(pay_status), delivery(deli_status), order_details(d_id, quantity)')
            .eq('c_id', customer.c_id)
            .order('order_date', { ascending: false })
            .limit(1);
  
          if (orderError || !orders || orders.length === 0) {
            this.error = "No orders found for this customer.";
            return;
          }
  
          const order = orders[0];
          const { data: dishesData } = await supabase
            .from('dishes')
            .select('d_id, dish_name')
            .in('d_id', order.order_details.map(d => d.d_id));
  
          order.dishes = order.order_details.map(d => ({
            name: dishesData.find(dish => dish.d_id === d.d_id)?.dish_name || 'Unknown Dish',
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
          this.error = "Something went wrong. Please try again.";
        }
      }
    }
  };
  </script>
  