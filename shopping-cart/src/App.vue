<template>
	<!--
		Два элемента (h1, section) в корне компоненте т.к пишу на Vue 3.x
		Знаком с тем что на Vue 2.x нельзя использовать более одного элемента в корне компонента
	-->
	<h1>
		Корзина
	</h1>
	<section class="cart">
		<button class="cart__add-button"> Добавить </button>
		<table class="cart__table">
			<thead>
				<tr>
					<td> Товар </td>
					<td> Стоимость </td>
					<td> Количество </td>
					<td/>
				</tr>
			</thead>
			<tbody>
				<tr v-for="item of cart" :key="item.id">
					<td>
						todo select
					</td>
					<td>
						{{ item.price }}
					</td>
					<td></td>
					<td></td>
				</tr>
				<tr>
					<td></td>
					<td></td>
					<td></td>
					<td></td>
				</tr>
			</tbody>
		</table>
	</section>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import IProduct from '@/models/product'

export default defineComponent({
  name: 'App',
	data: (): { [key: string]: IProduct[] } => ({
    products: [
      { id: 1, name: 'Картофель', price: 20 },
      { id: 2, name: 'Сок', price: 100 },
      { id: 3, name: 'Мясо', price: 500 },
      { id: 4, name: 'Бананы', price: 50 },
    ],
		cart: []
  }),
	computed: {
    total (): number {
      return this.cart.reduce((prev: number, curr: IProduct) => {
        return prev + curr.price
			}, 0)
		}
	},
	methods: {

	}
})
</script>

<style lang="scss" scoped>

</style>
