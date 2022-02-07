import { createApp } from 'vue'

createApp({
  name: 'Shopping Cart',
  data: () => ({
    products: [
      { id: 1, name: 'Картофель', price: 20 },
      { id: 2, name: 'Сок', price: 100 },
      { id: 3, name: 'Мясо', price: 500 },
      { id: 4, name: 'Бананы', price: 50 },
    ]
  }),
  methods: {

  }
}).mount('#app')
