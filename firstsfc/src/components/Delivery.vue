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
      
      <button v-if="delivery.deli_status !== 'Delivered'" @click="markAsDelivered">Mark as Delivered</button>
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
          .select(`
            o_id, total_amount, 
            payment(pay_status, pay_method), 
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
          pay_method: order.payment?.pay_method || 'Unknown',
          deli_status: order.delivery?.deli_status || 'Pending',
          deli_date: order.delivery?.deli_date || 'Not available'
        };
      } catch (err) {
        console.error("Error fetching delivery details:", err);
        this.error = "Something went wrong. Please try again.";
      }
    },
    async markAsDelivered() {
      if (!this.delivery) return;

      try {
        await supabase.from('delivery').update({ deli_status: 'Delivered' }).eq('o_id', this.delivery.o_id);

        const { data: orderDetails, error: orderDetailsError } = await supabase
          .from('order_details')
          .select('dish_id, quantity')
          .eq('order_id', this.delivery.o_id);

        if (orderDetailsError) throw orderDetailsError;

        for (const order of orderDetails) {
          const { data: dish, error: dishError } = await supabase
            .from('dishes')
            .select('stock_quantity')
            .eq('d_id', order.dish_id)
            .single();

          if (dishError) throw dishError;

          const newStock = Math.max(0, dish.stock_quantity - order.quantity);

          await supabase
            .from('dishes')
            .update({ stock_quantity: newStock })
            .eq('d_id', order.dish_id);
        }

        if (this.delivery.pay_method === 'Cash') {
          await supabase.from('payment').update({ pay_status: 'Completed' }).eq('o_id', this.delivery.o_id);
          this.delivery.pay_status = 'Completed';
        }

        this.delivery.deli_status = 'Delivered';
        alert("Delivery marked as completed, stock updated, and payment status updated if applicable.");
      } catch (err) {
        console.error("Error marking delivery as completed:", err);
        this.error = "Failed to update delivery status.";
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
