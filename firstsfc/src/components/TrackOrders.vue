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

#track-orders .success-message {
  color: #28a745;
  font-weight: bold;
  margin-top: 10px;
  text-align: center;
}

#track-orders .orders-container {
  max-width: 600px;
  margin: auto;
  padding: 25px;
  background: #f9f9f9;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transition: 0.3s ease-in-out;
}

#track-orders .orders-container:hover {
  transform: scale(1.02);
}

#track-orders .button-container {
  text-align: center;
  margin-top: 15px;
}

#track-orders .order-btn, 
#track-orders .cancel-btn {
  padding: 12px 20px;
  font-size: 16px;
  font-weight: bold;
  border: none;
  cursor: pointer;
  border-radius: 6px;
  transition: 0.3s ease-in-out;
}

#track-orders .order-btn {
  background: #007bff;
  color: white;
}

#track-orders .order-btn:hover {
  background: #0056b3;
}

#track-orders .cancel-btn {
  background: #dc3545;
  color: white;
  margin-top: 12px;
}

#track-orders .cancel-btn:hover {
  background: #a71d2a;
}

#track-orders .error-message {
  color: #dc3545;
  font-weight: bold;
  text-align: center;
  margin-top: 10px;
}

#track-orders table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 15px;
  background: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

#track-orders td {
  padding: 10px;
  border: 1px solid #ddd;
}

#track-orders tr:nth-child(even) {
  background: #f1f1f1;
}

#track-orders h2, 
#track-orders h3, 
#track-orders h4 {
  text-align: center;
  color: #333;
}

#track-orders ul {
  list-style: none;
  padding: 0;
  margin-top: 10px;
}

#track-orders li {
  background: #e9ecef;
  padding: 8px;
  margin-bottom: 5px;
  border-radius: 5px;
  text-align: center;
}

/* Page Container */
.page-container {
  position: relative;
  min-height: 100vh;
  background-color: #f9f9f9; /* Background */
  overflow: hidden;
}

/* Content Styling */
.content-container {
  position: relative;
  padding: 20px;
  margin: 20px auto;
  max-width: 80%;
  background-color: white;
  border-radius: 10px;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
  z-index: 2;
}

/* Left and Right Sidebars */
.page-container::before,
.page-container::after {
  content: "";
  position: absolute;
  top: 0;
  width: 12%; /* Adjust for sidebar size */
  height: 100%;
  background-color: #ff5c00; /* Change to your preferred sidebar color */
  z-index: 1;
}

/* Left Sidebar */
.page-container::before {
  left: 0;
}

/* Right Sidebar */
.page-container::after {
  right: 0;
}
</style>
