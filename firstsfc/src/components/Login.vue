<template>
  <section class="auth-page">
    <h2>Login</h2>
    <form @submit.prevent="loginUser">
      <label>Email:</label>
      <input type="email" v-model="email" required>

      <label>Password:</label>
      <input type="password" v-model="password" required>

      <button type="submit">Login</button>
    </form>
    <p>Don't have an account? <router-link to="/register">Register here</router-link></p>
  </section>
</template>

<script>
import { createClient } from '@supabase/supabase-js';

const supabase = createClient('YOUR_SUPABASE_URL', 'YOUR_SUPABASE_ANON_KEY');

export default {
  data() {
    return {
      email: '',
      password: ''
    };
  },
  methods: {
    async loginUser() {
      const { error } = await supabase.auth.signInWithPassword({
        email: this.email,
        password: this.password
      });

      if (error) {
        alert(`Error: ${error.message}`);
      } else {
        alert('Login successful!');
        this.$router.push('/');
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
