<template>
  <div>
    <div>
      <code>npm install --save vue-virtual-scroller</code>
    </div>
    <vir-selector
      :list="list"
      :fieldId="fieldId"
      :value="value"
      :inputStyle="inputStyle"
      :remote="remote"
      :remoteMethod="remoteMethod"
      @handleSelect="handleVirSelectValue"
    >
    </vir-selector>
  </div>
</template>

<script>
import VirSelector from '@/components/VirtualSelector/virSelector.vue'
import cloneDeep from 'lodash/cloneDeep'
import { selectList } from './config.js'
export default {
  name: 'VirtualSelect',
  components: {
    VirSelector
  },
  data() {
    return {
      list: selectList,
      fieldId: 'test',
      value: '',
      inputStyle: {},
      remote: ''
    }
  },
  methods: {
    remoteMethod(input) {
      const tempList = cloneDeep(selectList)
      const regExp = new RegExp(input, 'g')
      const filteList = tempList.filter(item => {
        return regExp.test(item.value)
      })
      this.list = filteList
    },
    handleVirSelectValue(opt) {
      if (!opt.val) { // 清空时候重新拉取原始值
        this.list = selectList
      }
    }
  }
}
</script>


