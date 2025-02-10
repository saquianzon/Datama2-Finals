<template>
  <section id="track-orders" class="orders-container">
    <h2>Track Your Order</h2>
    <form @submit.prevent="fetchOrderDetails">
      <label for="firstName">First Name:</label>
      <input type="text" id="firstName" v-model="firstName" required />

      <label for="lastName">Last Name:</label>
      <input type="text" id="lastName" v-model="lastName" required />

      <label for="email">Email:</label>
      <input type="email" id="email" required v-model="email" />

      <div class="button-container">
        <button type="submit" class="order-btn">Check Status</button>
      </div>
    </form>
    
    <div v-if="order" class="order-details">
      <h3>Order Details</h3>
      <table>
        <tr>
          <td><strong>Order ID:</strong></td>
          <td>{{ order.o_id }}</td>
        </tr>
        <tr>
          <td><strong>Total Amount:</strong></td>
          <td>₱{{ order.total_amount }}</td>
        </tr>
        <tr>
          <td><strong>Payment Status:</strong></td>
          <td>{{ order.pay_status }}</td>
        </tr>
        <tr>
          <td><strong>Delivery Status:</strong></td>
          <td>{{ order.delivery_status }}</td>
        </tr>
      </table>
      
      <h4>Ordered Dishes:</h4>
      <ul>
        <li v-for="dish in order.dishes" :key="dish.id">{{ dish.name }} - Qty: {{ dish.quantity }}</li>
      </ul>
      
      <button v-if="order.pay_status === 'Pending'" @click="cancelOrder" class="cancel-btn">Cancel Order</button>
    </div>
    
    <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
    <p v-if="orderCancelledMessage" class="success-message">{{ orderCancelledMessage }}</p>
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
      errorMessage: '',
      orderCancelledMessage: ''
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
      this.orderCancelledMessage = '';

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
    },
    async cancelOrder() {
      if (!this.order || this.order.pay_status !== 'Pending') {
        this.errorMessage = "Only pending orders can be canceled.";
        return;
      }

      try {
        // Update payment status
        const { error: paymentError } = await supabase
          .from('payment')
          .update({ pay_status: 'Failed' })
          .eq('o_id', this.order.o_id);

        if (paymentError) {
          console.error("Error cancelling payment:", paymentError);
          this.errorMessage = "Failed to cancel payment.";
          return;
        }

        // Update delivery status
        const { error: deliveryError } = await supabase
          .from('delivery')
          .update({ deli_status: 'Cancelled' })
          .eq('o_id', this.order.o_id);

        if (deliveryError) {
          console.error("Error updating delivery status:", deliveryError);
          this.errorMessage = "Failed to update delivery status.";
          return;
        }

        this.order.pay_status = 'Failed';
        this.order.delivery_status = 'Cancelled';
        this.orderCancelledMessage = "Your order has been successfully cancelled.";
      } catch (err) {
        console.error("Error cancelling order:", err);
        this.errorMessage = "Something went wrong. Please try again.";
      }
    }
  }
};
</script>

<style>
.success-message {
  color: green;
  margin-top: 10px;
}

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
.cancel-btn {
  padding: 10px 20px;
  background: #dc3545;
  color: white;
  border: none;
  cursor: pointer;
  border-radius: 5px;
  margin-top: 10px;
}
.error-message {
  color: red;
  margin-top: 10px;
}
table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 10px;
}
td {
  padding: 5px;
  border: 1px solid #ddd;
}
</style>
