<template>
  <div
    :id="vsId"
    class="virtual-selector"
  >
    <span
      class="virtual-selector__label"
      :class="{none: !label}"
    >{{ label }}</span>
    <div class="virtual-selector__input-wrapper">
      <input
        v-model="selected[option.itemNameKey]"
        class="virtual-selector__input"
        :placeholder="placeholder"
        :style="inputStyle"
        @keyup="handleKeyup"
        @input="handleInput"
        @focus="handleFocus($event)"
        @select="handleInputSelect($event)"
        @mousemove="handleMousemove"
      />
      <i
        class="virtual-selector__arrow"
        :style="hideArrow && 'display: none'">
        <svg
          viewBox="64 64 896 896"
          data-icon="down"
          width="1em"
          height="1em"
          fill="currentColor"
          aria-hidden="true"
          focusable="false"
          class=""
        >
          <path
            d="M884 256h-75c-5.1 0-9.9 2.5-12.9 6.6L512 654.2 227.9 262.6c-3-4.1-7.8-6.6-12.9-6.6h-75c-6.5 0-10.3 7.4-6.5 12.7l352.6 486.1c12.8 17.6 39 17.6 51.7 0l352.6-486.1c3.9-5.3.1-12.7-6.4-12.7z"></path>
        </svg>
      </i>
      <i
        class="el-icon-circle-close clear-btn"
        :style="hideArrow && 'display: block'"
        @click="clearValue"></i>
      <div
        v-if="loading"
        class="virtual-selector__loading"
      >
        <slot name="loading"></slot>
      </div>
      <div
        v-if="flist.length===0"
        class="virtual-selector__dropdown"
        style="text-align: center;"
      >
        <slot name="nodata"></slot>
      </div>
      <recycle-scroller
        v-if="flist.length > 0"
        v-slot="{ item }"
        class="virtual-selector__scroller virtual-selector__dropdown"
        :items="flist"
        :item-size="itemSize"
        :key-field="option.id"
      >
        <div
          class="virtual-selector__dropdown-item"
          :class="{
            'virtual-selector__dropdown-item--selected':
              item[option.itemValueKey] === selected[option.itemValueKey],
          }"
          @click="handleItemSelect($event, item)"
        >
          <slot
            v-if="$scopedSlots.item"
            name="item"
            :item="item"
          ></slot>
          <slot v-else>{{ item[option.itemNameKey] }}</slot>
        </div>
      </recycle-scroller>
    </div>
  </div>
</template>

<script>
import { RecycleScroller } from 'vue-virtual-scroller'
import 'vue-virtual-scroller/dist/vue-virtual-scroller.css'

function debounce(fn, delay) {
  let timer

  return function() {
    const context = this
    const args = arguments

    clearTimeout(timer)

    timer = setTimeout(function() {
      fn.apply(context, args)
    }, delay)
  }
}
const defaultItemPageSize = 8
const defaultItemGap = 0
const dropdownActiveClassName = 'virtual-selector__input-wrapper--active'
export default {
  name: 'VirtualSelector',
  components: { RecycleScroller },
  props: {
    loading: {
      type: Boolean,
      default: false
    },
    label: {
      type: String,
      default: ''
    },
    placeholder: {
      type: String,
      default: ''
    },
    value: {
      type: Object,
      default: () => {
      }
    },
    list: {
      type: Array,
      required: true,
      default: () => []
    },
    option: {
      type: Object,
      required: true,
      default: () => {
      }
    },
    inputStyle: {
      type: Object,
      default() {
        return {}
      }
    },
    remote: {
      type: Boolean,
      default: false
    },
    remoteMethod: {
      type: Function,
      default() {
        return () => {}
      }
    }
  },
  data() {
    return {
      id: new Date().getTime(),
      flist: [],
      selected: {},
      itemSize: 32 + ((this.option && this.option.itemGap) || defaultItemGap),
      hideArrow: false
    }
  },
  computed: {
    vsId() {
      return `virtual-selector-${this.id}`
    }
  },
  watch: {
    list: {
      immediate: true,
      handler() {
        this.init()
      }
    },
    value: {
      immediate: true,
      handler(val) {
        if (val && !Object.keys(val).length) {
          this.selected = {}
        }
      },
      deep: true
    }
  },
  mounted: function() {
    this.mount()
  },
  beforeDestroy: function() {
    this.unmount()
  },
  methods: {
    init() {
      if (!this.list || this.list.length === 0) return
      if (
        !this.option ||
        !this.option.itemNameKey ||
        !this.option.itemValueKey
      ) {
        throw new Error(
          '请指定列表选项“itemNameKey”或“itemValueKey”'
        )
      }
      this.flist = [...this.list]
      this.value instanceof Object &&
      (this.selected = {
        [this.option.itemNameKey]: this.value[this.option.itemNameKey],
        [this.option.itemValueKey]: this.value[this.option.itemValueKey]
      })
      this.$nextTick(() => {
        if (document.getElementById(this.vsId)) {
          document.getElementById(this.vsId).querySelector('.virtual-selector__scroller').style.maxHeight =
            (this.option.itemPageSize || defaultItemPageSize) * this.itemSize +
            4 +
            'px'
        }
      })
    },
    mount() {
      document.addEventListener('click', this.handleGlobalClick, true)
    },
    unmount() {
      document.removeEventListener('click', this.handleGlobalClick, true)
    },
    handleKeyup: debounce(function() {
      const input = this.selected[this.option.itemNameKey]
      this.option.itemNameKey !== this.option.itemValueKey && (this.selected[this.option.itemValueKey] = '')
      if (this.remote) {
        this.remoteMethod(input)
      } else if (!input) {
        this.flist = [...this.list]
        this.$emit('search', {
          id: this.vsId,
          search: { [this.option.itemNameKey]: input }
        })
      } else {
        this.flist = this.list.filter((item) => {
          if (item[this.option.itemNameKey].toLowerCase() === input.toLowerCase()) {
            this.selected[this.option.itemValueKey] = item[this.option.itemValueKey]
            this.$nextTick(() => {
              this.$emit('select', {
                id: this.vsId,
                select: { ...this.selected }
              })
            })
          }
          return item[this.option.itemNameKey].toString().toLowerCase().includes(input.toLowerCase())
        })
        this.$emit('search', {
          id: this.vsId,
          search: { [this.option.itemNameKey]: input }
        })
      }
    }, 1000),
    handleInput() {
      this.$emit('input', {
        [this.option.itemNameKey]: this.selected[this.option.itemNameKey]
      })
    },
    handleFocus(e) {
      e.target.offsetParent.classList.toggle(dropdownActiveClassName)
      this.$emit('focus', {
        id: this.vsId,
        focus: { event: e }
      })
    },
    handleInputSelect(e) {
      e.target.offsetParent.classList.add(dropdownActiveClassName)
    },
    handleItemSelect(e, item) {
      this.selected = {
        ...item,
        [this.option.itemNameKey]: e.target.innerText
      }
      this.$emit('select', {
        id: this.vsId,
        select: { ...this.selected }
      })
    },
    handleGlobalClick(e) {
      Array.from(document.querySelectorAll('.virtual-selector')).forEach((el) => {
        el.querySelector('.virtual-selector__input-wrapper').classList.remove(
          dropdownActiveClassName
        )
      })
      if (e.target.className === 'virtual-selector__input') {
        e.target.offsetParent.classList.add(
          dropdownActiveClassName
        )
      }
    },
    clearValue() {
      this.selected = {}
      this.$emit('select', {
        id: this.vsId,
        select: { ...this.selected }
      })
    },
    handleMousemove() {
      if (this.selected[this.option.itemNameKey]) {
        this.hideArrow = true
      } else {
        this.hideArrow = false
      }
    }
  }
}
</script>

<style scoped>
.virtual-selector {
  display: inline-flex;
  align-items: center;
  box-sizing: border-box;
}

.virtual-selector__label {
  line-height: 1.5;
  font-size: 14px;
  white-space: nowrap;
  color: #333;
}

.virtual-selector__label::after {
  position: relative;
  top: -0.5px;
  content: ":";
  margin: 0 8px 0 2px;
}

.virtual-selector__label.none::after {
  display: none;
}

.virtual-selector__input-wrapper {
  position: relative;
  flex: 1;
}

.virtual-selector__input {
  display: block;
  width: 100%;
  height: 32px;
  padding: 0 34px 0 11px;
  border: 1px solid #DCDFE6;
  border-radius: 5px;
  background-color: #fff;
  color: rgba(0, 0, 0, 0.65);
  font-size: 14px;
  box-sizing: border-box;
  outline: none;
  transition: all 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
  cursor: text;
}

.virtual-selector__input::placeholder,
.virtual-selector__input::-webkit-input-placeholder {
  color: rgba(0, 0, 0, 0.65);
}

.virtual-selector__input:hover {
  border-color: #346fdf;
}

.virtual-selector__arrow {
  position: absolute;
  top: 10px;
  right: 11px;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 12px;
  height: 12px;
  transition: transform 0.3s, -webkit-transform 0.3s;
  pointer-events: none;
}

.virtual-selector__arrow svg {
  color: rgba(0, 0, 0, 0.25);
}

.virtual-selector__loading {
  position: absolute;
  top: 1px;
  left: 1px;
  width: calc(100% - 2px);
  height: 30px;
  line-height: 30px;
  font-size: 12px;
  text-align: center;
  color: rgba(0, 0, 0, 0.65);
  background-color: #fff;
}

.virtual-selector__input-wrapper--active input {
  border-color: #409eff;
  /*box-shadow: 0 0 0 2px rgba(15, 72, 179, 0.2);*/
}

.virtual-selector__input-wrapper--active .virtual-selector__arrow {
  transform: rotate(180deg);
}

.virtual-selector__input-wrapper--active .virtual-selector__dropdown {
  display: block;
}

.virtual-selector__dropdown {
  display: none;
  position: absolute;
  min-width: 100%;
  padding: 4px 0;
  margin: 5px 0 0;
  border-radius: 5px;
  box-sizing: border-box;
  line-height: 1.5;
  list-style: none;
  font-size: 14px;
  background-color: #fff;
  color: rgba(0, 0, 0, 0.65);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  outline: none;
  z-index: 1050;
  overflow-y: auto;
  transform: translateZ(0px);
}

.virtual-selector__scroller {
  max-height: 252px;
}

.virtual-selector__scroller::-webkit-scrollbar {
   width: 6px;
   height: 6px;
   background: transparent;
 }

.virtual-selector__scroller::-webkit-scrollbar-thumb {
  background: transparent;
  border-radius: 5px;
}

.virtual-selector__scroller::-webkit-scrollbar-thumb {
  background: hsla(0, 0%, 53%, 0.4);
}

.virtual-selector__dropdown-item {
  display: block;
  padding: 5px 12px;
  line-height: 22px;
  font-weight: 400;
  font-size: 14px;
  color: rgba(0, 0, 0, 0.65);
  text-align: left;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  cursor: pointer;
  transition: background 0.3s ease;
}

.virtual-selector__dropdown-item:hover {
  background-color: #F5F7FA;
}

.virtual-selector__dropdown-item--selected {
  font-weight: 600;
  color: #1B52A1;
}

.clear-btn {
  color: #DCDFE6;
  position: absolute;
  top: 10px;
  right: 11px;
  display: none;
  cursor: pointer;
}
</style>
