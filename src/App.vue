<template>
	<!--
		Два элемента (h1, section) в корне компоненте т.к пишу на Vue 3.x
		Знаком с тем что на Vue 2.x нельзя использовать более одного элемента в корне компонента
	-->
	<h1>
		Корзина
	</h1>
	<section class="cart">
		<button class="cart__add-button"
            @click="add">
			Добавить
		</button>
		<table class="cart__table">
			<thead>
				<tr>
					<td>
            Товар
          </td>
					<td>
            Стоимость
          </td>
					<td>
            Количество
          </td>
					<td/>
				</tr>
			</thead>
			<tbody>
				<tr v-for="item of cart" :key="item.id">
					<td>
            <span>
              Товар
            </span>
            <base-select :options="products"
                         :key="'name'"
                         :default="products.indexOf(products.find((product) => product.name === item.name))"
                         @select="select(item, $event)">
              <template #selected="selected">
                <div class="select__selected-option">
                  {{ selected.selected.name }}
                </div>
              </template>
              <template #option="option">
                  {{ option.option.name }}
              </template>
            </base-select>
					</td>
					<td>
            <span>
              Стоимость
            </span>
						{{ item.price }}
					</td>
					<td>
            <span>
              Количество
            </span>
            <input type="number" @input="setAmount(item, $event)" :value="item.amount" min="1" max="2147483647" step="1">
          </td>
					<td>
            <button @click="remove(item.id)">
              Удалить
            </button>
          </td>
				</tr>
        <tr v-if="!cart.length">
          <td> Пусто </td>
          <td>
            -
          </td>
          <td>
            <input type="number" style="width: 113px; visibility: hidden">
          </td>
          <td>
            <button style="visibility: hidden">
              Удалить
            </button>
          </td>
        </tr>
				<tr>
					<td/>
					<td>
            Итого:
          </td>
					<td>
            {{ total }}
          </td>
					<td/>
				</tr>
			</tbody>
		</table>
	</section>
  <button class="theme-button" @click="toggleTheme">
    <img :src="theme === 'dark'
               ? require('@/assets/icons/theme/dark.svg')
               : require('@/assets/icons/theme/light.svg')"
         alt="theme">
  </button>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { IProduct, IItem } from '@/models/product'
import BaseSelect from '@/components/BaseSelect.vue'

export default defineComponent({
  name: 'App',
  components: { BaseSelect },
  data: (): { products: IProduct[], cart: IItem[], theme: string } => ({
    products: [
      { id: 1, name: 'Картофель', price: 20 },
      { id: 2, name: 'Сок', price: 100 },
      { id: 3, name: 'Мясо', price: 500 },
      { id: 4, name: 'Бананы', price: 50 },
    ],
		cart: [],
    theme: 'light'
  }),
	computed: {
    total (): number {
      return this.cart.reduce((prev, curr) => {
        return prev + (curr.price * curr.amount)
			}, 0)
		}
	},
	methods: {
		add (): void {
      this.cart.push({
        ...this.products[0],
        id: this.cart.length,
        amount: 1
      })
      this.saveCart()
		},
    select (item: IItem, selected: IProduct): void {
      item.name = selected.name
      item.price = selected.price
      this.saveCart()
    },
		recalculateCartIds (from = 0): void {
      for (let i = from; i < this.cart.length; i++) {
        this.cart[i].id = i;
			}
		},
		remove (id: number): void {
      this.cart = this.cart.filter((item) => item.id !== id)
			this.recalculateCartIds(id)
      this.saveCart()
		},
    toggleTheme () {
      localStorage.setItem('darkTheme', this.theme = (this.theme === 'light' ? 'dark' : 'light'))
      document.documentElement.dataset.theme = this.theme
    },
    saveCart () {
      localStorage.setItem('cart', JSON.stringify(this.cart))
    },
    setAmount (item: IItem, event: InputEvent) {
      const target = (event.target as HTMLInputElement)

      if (target?.value) {
        const value = Number(target.value)

        if (target.value.includes('-')) {
          target.value = String(item.amount)
        }
        item.amount = value > 0 ? value : 1
      }
      this.saveCart()
    }
	},
  created () {
    const localCart = localStorage.getItem('cart')
    const localTheme = localStorage.getItem('darkTheme')
    if (localCart) {
      this.cart = JSON.parse(localCart)
    }
    if (localTheme) {
      this.theme = localTheme
      document.documentElement.dataset.theme = this.theme
    }
  }
})
</script>

<style lang="scss">
@import '~@/style/_main.scss';

button {
  margin: 6px 0;
}

.theme-button {
  position:  absolute;
  right:     max(calc((100vw - 1008px) / 2), 8px);
  top:       12px;
  padding:   3px;
  min-width: 32px;
  height:    32px;

  & img {
    width:  24px;
    height: 24px;
  }
}

.cart {
  display:          flex;
  flex-flow:        column;
  background-color: var(--card-background);
  border:           var(--card-border);
  padding:          11px 15px;
  box-shadow:       0 6px 12px #00000044;
  max-width:        100%;
  gap:              8px;

  &__add-button {
    width: fit-content;
  }

  &__table {
    background-color: var(--table);
    width:            100%;
    border:           1px solid var(--table-border);
    border-collapse:  collapse;

    tr,
    td, {
      border:          1px solid var(--table-border);
      border-collapse: collapse;
      align-items:     center;
      padding:         4px 12px;

      .select {
        display: inline-flex;
      }
      span {
        display: none;
      }
    }

    td:not(:first-child) {
      width: 0;
    }

    thead {
      background-color: var(--table-header);
      font-size:        14px;
    }

    tbody {
      tr:nth-child(2n) {
        background-color: var(--table-nth-child);
      }

      tr:last-child {
        background-color: var(--table-header);
        font-size:        14px;
      }
    }
  }
}

@media screen and (max-width: 639px) {
  .cart {

    &__table {
      display:   flex;
      flex-flow: column;
      border:    none;
      gap:       8px;

      thead {
        display: none;
      }

      tbody {
        display:   flex;
        flex-flow: column;
        border:    none;
        gap:       8px;

        tr {
          display:          flex;
          flex-flow:        column;
          gap:              8px;
          background-color: var(--table);
          border:           1px solid var(--table-border);
          border-radius:    6px;
          padding:          8px 12px;

          td {
            display: flex;
            width:   100%;
            border:  none;
            padding: 0;

            span {
              display:   inline;
              min-width: 80px;
            }
          }

          td:not(:first-child) {
            width: 100%;
          }

          td:last-child {
            flex-flow: row-reverse;
          }
        }

        tr:last-child {
          td:last-child,
          td:first-child {
            display: none;
          }
        }
      }
    }
  }
}
</style>
