<template>
  <section class="auth-page">
    <h2>Create an Account</h2>
    <form @submit.prevent="registerUser">
      <label>Email:</label>
      <input type="email" v-model="email" required>

      <label>Password:</label>
      <input type="password" v-model="password" required>

      <button type="submit">Register</button>
    </form>
    <p>Already have an account? <router-link to="/login">Login here</router-link></p>
  </section>
</template>

<script>
import { createClient } from '@supabase/supabase-js';

const supabase = createClient('https://mcxgpcyvptcdbnknusli.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1jeGdwY3l2cHRjZGJua251c2xpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzgyMTY2MzMsImV4cCI6MjA1Mzc5MjYzM30.rui4JE3r_ZetcAwFXVrsChJTEfao4J9tWSqgBvYYVao');

export default {
  data() {
    return {
      email: '',
      password: ''
    };
  },
  methods: {
    async registerUser() {
      const { error } = await supabase.auth.signUp({
        email: this.email,
        password: this.password
      });

      if (error) {
        alert(`Error: ${error.message}`);
      } else {
        alert('Registration successful! Please check your email to confirm.');
        this.$router.push('/login');
      }
    }
  }
};
</script>

<style scoped>
.auth-page {
  max-width: 400px;
  margin: auto;
  text-align: center;
}
</style>
