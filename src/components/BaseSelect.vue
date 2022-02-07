<template>
  <div class="select"
       tabindex="0"
       @comment_wheel="scroll($event)"
       @click="openDropdown"
       @keyup="(event) => {
         event.key === ' ' || event.key === 'Enter'
         ? openDropdown(event)
         : scroll(event)
       }">
    <slot name="selected" :selected="selected">
      <div class="select__selected-option">
        {{ selected }}
      </div>
    </slot>
    <div class="select__icon">
      <img src="@/assets/elements/triangle.svg" alt="Dropdown">
    </div>
    <div class="select__options" ref="divOptions" v-show="open" @click.stop @keyup.stop.esc="openDropdown($event)">
      <div class="select__option"
           tabindex="0"
           v-for="option of options"
           :key="key ? option[key] : option"
           @keydown.enter.space="select(option)"
           @click="select(option); openDropdown($event)">
        <slot name="option" :option="option">
          {{ option }}
        </slot>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'BaseSelect',
  data: (): { open: boolean, selected: unknown } => ({
    open: false,
    selected: ''
  }),
  props: {
    default: {
      type: [ String, Number ],
      default: 0
    },
    options: {
      type: Array,
      default: () => ([])
    },
    key: {
      type: String,
      default: ''
    }
  },
  methods: {
    select (selected: unknown): void {
      this.selected = selected
      this.$emit('select', selected)
    },
    openDropdownHandler (): void {
      this.open = false
    },
    openDropdown (event: MouseEvent): void {
      event.stopImmediatePropagation()
      this.open = !this.open
      if (this.open) {
        document.addEventListener('click', this.openDropdownHandler, { once: true })
      } else {
        document.removeEventListener('click', this.openDropdownHandler)
      }
    },
    scroll (event: WheelEvent & KeyboardEvent) {
      if (this.options && this.options.length) {
        const index = this.options.indexOf(this.selected)

        if (event.type === 'wheel') {
          if (event.deltaY < 0) {
            this.select(this.options[index - 1 >= 0 ? index - 1 : this.options.length - 1])
          } else {
            this.select(this.options[index + 1 < this.options.length ? index + 1 : 0])
          }
        } else if (event.type === 'keyup') {
          if (event.key === 'ArrowUp') {
            this.select(this.options[index - 1 >= 0 ? index - 1 : this.options.length - 1])
          } else if (event.key === 'ArrowDown') {
            this.select(this.options[index + 1 < this.options.length ? index + 1 : 0])
          }
        }
      }
    }
  },
  emits: ['select'],
  created () {
    if (this.options && this.options.length) {
      this.selected = typeof this.default === 'number' ? this.options[this.default] : this.default
    }
  }
})
</script>

<style lang="scss">
.select {
  position:         relative;
  display:          flex;
  align-items:      center;
  width:            fit-content;
  min-width:        72px;
  height:           24px;
  border:           var(--button-border);
  outline:          0 solid transparent;
  background-color: var(--button);
  border-radius:    3px;
  user-select:      none;

  &:focus {
    border:  var(--button-border-focus);
    outline: var(--button-outline);
  }

  &:disabled {
    color:            var(--disabled);
    outline:          0 solid transparent;
    background-color: var(--button-disabled);
  }

  &__icon {
    width:       22px;
    height:      22px;
    padding:     3px;
    border-left: var(--button-border);
  }

  &__options {
    display:          flex;
    flex-direction:   column;
    position:         absolute;
    background-color: var(--button);
    border:           var(--button-border);
    padding:          4px 0;
    gap:              1px;
    height:           fit-content;
    max-height:       500%;
    top:              calc(100%);
    left:             -1px;
    min-width:        calc(100% + 2px);
    z-index:          1;
  }

  &__option {
    display:          flex;
    padding:          0 12px;
    align-items:      center;
    height:           22px;
    background-color: var(--button);
    outline:          none;

    &:hover,
    &:focus {
      background-color: var(--button-disabled);
    }
  }

  &__selected-option {
    margin: 0 12px;
  }
}
</style>
