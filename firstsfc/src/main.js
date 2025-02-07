import HeaderComponent from './components/Header.vue';
import HeroComponent from './components/Hero.vue';
import MenuComponent from './components/Menu.vue';
import OrdersComponent from './components/Orders.vue';
import FooterComponent from './components/Footer.vue';

export default {
  components: {
    HeaderComponent,
    HeroComponent,
    MenuComponent,
    OrdersComponent,
    FooterComponent
  }
};

const app = createApp(App);
app.mount('#app')