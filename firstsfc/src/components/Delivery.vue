<template>
  <section class="delivery-container">
    <h2>Order Delivery Status</h2>
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
      <p><strong>Customer Address:</strong> {{ delivery.address }}</p>
      
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
            delivery(deli_status, deli_date, address)
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
          deli_date: order.delivery?.deli_date || 'Not available',
          address: order.delivery?.address || 'Not available'
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
  background: #f9f9f9;
  padding: 40px;
  border-radius: 16px;
  max-width: 500px;
  margin: 50px auto;
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.1);
  text-align: center;
  font-family: 'Poppins', sans-serif;
}

.delivery-container h2 {
  font-size: 26px;
  font-weight: 700;
  color: #222;
  margin-bottom: 20px;
}

.delivery-container label {
  display: block;
  font-size: 14px;
  font-weight: 500;
  margin-bottom: 8px;
  color: #444;
  text-align: left;
}

.delivery-container input {
  width: 100%;
  padding: 12px;
  border: 2px solid #ddd;
  border-radius: 10px;
  font-size: 16px;
  margin-bottom: 20px;
  transition: 0.3s ease-in-out;
}

.delivery-container input:focus {
  border-color: #07806f;
  box-shadow: 0 0 5px rgba(7, 128, 111, 0.3);
  outline: none;
}

.delivery-container button {
  background: linear-gradient(135deg, #07806f, #045d50);
  color: white;
  border: none;
  padding: 12px 20px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  border-radius: 10px;
  transition: 0.3s;
  width: 100%;
}

.delivery-container button:hover {
  background: #ccae27;
}

.delivery-details {
  background: white;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  text-align: left;
  margin-top: 20px;
}

.delivery-details h3 {
  font-size: 20px;
  font-weight: 600;
  border-bottom: 2px solid #eee;
  padding-bottom: 10px;
  margin-bottom: 15px;
}

.delivery-details p {
  font-size: 16px;
  color: #333;
  margin-bottom: 8px;
}

.delivery-details p strong {
  color: #07806f;
}

.delivered-btn {
  background: #28a745;
  width: 100%;
  color: white;
  padding: 12px;
  font-size: 16px;
  border-radius: 10px;
  cursor: pointer;
  border: none;
  transition: 0.3s;
  margin-top: 15px;
  font-weight: 600;
}

.delivered-btn:hover {
  background: #218838;
}

.error-message {
  color: #d9534f;
  font-weight: 600;
  margin-top: 15px;
  font-size: 14px;
}


</style>
