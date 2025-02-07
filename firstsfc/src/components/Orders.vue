<template>
  <section id="orders">
    <h2>Place Your Order</h2>
    <form id="order-form">
      <label for="dish">Dish:</label>
      <select id="dish" name="dish"></select>
      <label for="quantity">Quantity:</label>
      <input type="number" id="quantity" name="quantity" min="1" required>
      <button type="submit">Order Now</button>
    </form>
  </section>
</template>