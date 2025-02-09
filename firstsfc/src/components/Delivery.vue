<template>
    <section class="delivery-container">
      <h2>Track Your Delivery</h2>
      <label for="email">Enter Your Email:</label>
      <input type="email" v-model="email" required />
      <button @click="fetchDeliveryDetails">Check Status</button>
  
      <div v-if="delivery">
        <h3>Delivery Details</h3>
        <p><strong>Order ID:</strong> {{ delivery.o_id }}</p>
        <p><strong>Total Amount:</strong> ₱{{ delivery.total_amount }}</p>
        <p><strong>Payment Status:</strong> {{ delivery.pay_status }}</p>
        <p><strong>Delivery Status:</strong> {{ delivery.deli_status }}</p>
        <p><strong>Delivery Date:</strong> {{ delivery.deli_date }}</p>
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
        delivery: null,
        error: ''
      };
    },
    methods: {
      async fetchDeliveryDetails() {
        if (!this.email) {
          this.error = "Please enter your email.";
          return;
        }
        this.error = '';
        this.delivery = null;
  
        try {
          // Get Customer ID from email
          const { data: customer, error: custError } = await supabase
            .from('customer')
            .select('c_id')
            .eq('email', this.email)
            .single();
  
          if (custError || !customer) {
            this.error = "No customer found with this email.";
            return;
          }
  
          // Get latest order with delivery details
          const { data: orders, error: orderError } = await supabase
            .from('cust_orders')
            .select(`
              o_id, total_amount, 
              payment(pay_status), 
              delivery(deli_status, deli_date)
            `)
            .eq('c_id', customer.c_id)
            .order('order_date', { ascending: false })
            .limit(1);
  
          if (orderError || !orders || orders.length === 0) {
            this.error = "No deliveries found for this customer.";
            return;
          }
  
          const order = orders[0];
  
          this.delivery = {
            o_id: order.o_id,
            total_amount: order.total_amount,
            pay_status: order.payment?.pay_status || 'Unknown',
            deli_status: order.delivery?.deli_status || 'Pending',
            deli_date: order.delivery?.deli_date || 'Not available'
          };
        } catch (err) {
          console.error("Error fetching delivery details:", err);
          this.error = "Something went wrong. Please try again.";
        }
      }
    }
  };
  </script>
  
  
  <style>
  .delivery-container {
    background-color: #f8f9fa;
    padding: 30px;
    border-radius: 10px;
    max-width: 600px;
    margin: auto;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }
  
  input {
    width: 100%;
    padding: 8px;
    margin: 10px 0;
    border: 1px solid #ccc;
    border-radius: 5px;
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
  
  .error-message {
    color: red;
    margin-top: 10px;
  }
  </style>
  