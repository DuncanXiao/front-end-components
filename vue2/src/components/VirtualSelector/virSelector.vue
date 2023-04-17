<template>
  <virtual-selector
    v-model="selectedvalue"
    :loading="loading"
    label=""
    :placeholder="placeholder"
    :list="list"
    :option="listOption"
    :inputStyle="inputStyle"
    :remote="remote"
    :remoteMethod="remoteMethod"
    @input="handleInput"
    @focus="handleFocus"
    @search="handleSearch"
    @select="handleSelect">
    <div slot="loading">loading...</div>
    <div slot="nodata">未找到匹配项</div>
  </virtual-selector>
</template>

<script>
import VirtualSelector from './virtualSelector.vue'
export default {
  name: 'VirSelector',
  components: {
    VirtualSelector
  },
  mixins: [],
  model: {
    prop: 'value', // 绑定的值，通过父组件传递
    event: 'update' // 自定义名
  },
  props: {
    value: {
      required: true,
      type: [String, Number],
      default: ''
    },
    list: {
      required: true,
      type: Array,
      default: () => []
    },
    listOption: {
      required: false,
      type: Object,
      default: () => {
        return {
          itemNameKey: 'label',
          itemValueKey: 'value',
          itemPageSize: 8,
          itemGap: 5
        }
      }
    },
    placeholder: {
      required: false,
      type: [String, Number],
      default: ''
    },
    fieldId: {
      type: String,
      default: ''
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
      loading: false,
      selectedvalue: {}
    }
  },
  computed: {},
  watch: {
    value: {
      handler(val) {
        if (!val) {
          this.selectedvalue = {}
        }
      }
    }
  },
  created() {
    if (!this.value && this.list.length && !this.placeholder) {
      this.selectedvalue = {}
    } else {
      this.selectedvalue = this.list.find(item => {
        return item[this.listOption.itemNameKey] === this.value || item[this.listOption.itemValueKey] === this.value
      })
    }
  },
  mounted() {
  },
  destroyed() {
  },
  methods: {
    handleInput(input) {
      console.log('Input : ', input)
    },
    handleFocus({ id, focus }) {
      console.log('focus : ', { id, focus })
    },
    handleSearch() {
      // this.$emit('update', { val: opt.select[this.listOption.itemNameKey], fieldId: this.fieldId, ...opt })
      // this.selectedvalue = opt.select
    },
    handleSelect(opt) {
      this.$emit('handleSelect', { val: opt.select[this.listOption.itemValueKey], fieldId: this.fieldId, ...opt })
      this.selectedvalue = opt.select
    }
  }
}
</script>
