<template>
    <section id="login" class="login">
      <h2>Login to Your Account</h2>
      <form @submit.prevent="loginUser">
        <label for="email">Email:</label>
        <input type="email" id="email" v-model="email" required>
  
        <label for="password">Password:</label>
        <input type="password" id="password" v-model="password" required>
  
        <button type="submit">Login</button>
      </form>
      <p>Don't have an account? <a href="#register">Register here</a></p>
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
      async loginUser() {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: this.email,
          password: this.password
        });
  
        if (error) {
          alert(`Error: ${error.message}`);
        } else {
          alert('Login successful!');
          // Optionally, redirect to another page after login
        }
      }
    }
  };
  </script>
  
  <style scoped>
  .login {
    padding: 30px;
    max-width: 400px;
    margin: auto;
    text-align: center;
  }
  
  form {
    display: flex;
    flex-direction: column;
  }
  
  input {
    margin-bottom: 10px;
    padding: 8px;
    font-size: 1rem;
  }
  
  button {
    background-color: #ffcc00;
    padding: 10px;
    border: none;
    font-size: 1rem;
    cursor: pointer;
  }
  
  button:hover {
    background-color: #ff9900;
  }
  </style>
  