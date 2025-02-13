<template>
  <footer>
    <div class="footer-container">
      <div class="footer-section">
        <h3>Payment Options</h3>
        <div class="payment-icons">
          <img src="/images/gcash.png" alt="GCash" />
        </div>
      </div>

      <div class="footer-section">
        <h3>Address</h3>
        <p>245 P. Ocampo Ave., Corner Primo Rivera St., Brgy. Lapaz, Makati, Philippines</p>
        <p><strong>Business Hours:</strong> 11am - 10pm</p>
        <p><strong>Contact Phone:</strong> 0977-039-160</p>
        <p><strong>Email:</strong> dodoysgrill@gmail.com</p>
        <p><strong>Facebook Page:</strong> 
          <a href="https://www.facebook.com/dodoysgrill" target="_blank" rel="noopener noreferrer">
            Dodoy's Grill House
          </a>
        </p>
      </div>


      <div class="footer-section">
        <h3>About Us</h3>
        <p>We assure you will enjoy the authentic Chicken Inasal and other Ilonggo delicacies with the true taste of Bacolod in every bite! Kaon nata!</p>
      </div>
    </div>
  </footer>
</template>

<style>
footer {
  background: #0a0a0a;
  color: white;
  padding: 30px 0;
}

p {
  font-family: Arial, sans-serif;
  font-size: 15px
}

.footer-container {
  display: flex;
  justify-content: space-around;
  flex-wrap: wrap;
  max-width: 1200px;
  margin: 0 auto;
}

.footer-section {
  max-width: 300px;
  text-align: left;
}

.footer-section h3 {
  margin-bottom: 10px;
  font-size: 1.2em;
  border-bottom: 2px solid #ffffff;
  display: inline-block;
  padding-bottom: 5px;
}

.payment-icons img {
  width: 40px;
  margin-right: 10px;
  filter: brightness(1.2);
}

.footer-section a {
    color: #ffc400; /* Change this to your desired color */
    text-decoration: none; /* Removes the underline */
}

.footer-section a:hover {
    color: #71dafa; /* Change color when hovered */
    text-decoration: underline; /* Adds underline on hover */
}

</style>
