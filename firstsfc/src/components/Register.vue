<template>
    <section id="register" class="register">
      <h2>Create an Account</h2>
      <form @submit.prevent="registerUser">
        <label for="name">Full Name:</label>
        <input type="text" id="name" v-model="name" required>
  
        <label for="email">Email:</label>
        <input type="email" id="email" v-model="email" required>
  
        <label for="password">Password:</label>
        <input type="password" id="password" v-model="password" required>
  
        <button type="submit">Register</button>
      </form>
      <p>Already have an account? <a href="#login">Login here</a></p>
    </section>
  </template>
  
  <script>
  import { createClient } from '@supabase/supabase-js';
  
  const supabase = createClient('https://mcxgpcyvptcdbnknusli.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1jeGdwY3l2cHRjZGJua251c2xpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzgyMTY2MzMsImV4cCI6MjA1Mzc5MjYzM30.rui4JE3r_ZetcAwFXVrsChJTEfao4J9tWSqgBvYYVao');
  
  export default {
    data() {
      return {
        name: '',
        email: '',
        password: ''
      };
    },
    methods: {
      async registerUser() {
        const { data, error } = await supabase.auth.signUp({
          email: this.email,
          password: this.password,
          options: {
            data: { full_name: this.name }
          }
        });
  
        if (error) {
          alert(`Error: ${error.message}`);
        } else {
          alert('Registration successful! Check your email for confirmation.');
        }
      }
    }
  };
  </script>
  
  <style scoped>
  .register {
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
  