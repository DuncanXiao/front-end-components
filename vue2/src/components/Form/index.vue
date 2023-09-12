<template>
  <div>
    <el-form :inline="inline" :model="searchForm" :label-width="labelWidth" v-bind="$attrs" v-on="$listeners">
      <el-form-item
        v-for="(item, index) in searchColumns"
        :key="index"
        :label="item.label"
      >
        <el-select
          v-if="item.type === 'select'"
          v-model="searchForm[item.fieldId]"
          v-bind="item"
        >
          <el-option
            v-for="(opt, optIndex) in item.selectList"
            :key="optIndex"
            :label="opt.label"
            :value="opt.value"
            :disabled="opt.disabled"
          >
          </el-option>
        </el-select>
        <slot v-else-if="item.type === 'custom'" :name="item.slotName" :item="item" :searchForm="searchForm"></slot>
        <el-date-picker
          v-else-if="'year/month/date/week/datetime/datetimerange/daterange'.includes(item.type)"
          v-model="searchForm[item.fieldId]"
          v-bind="item"
        />
        <el-radio-group
          v-else-if="item.type === 'radio'"
          v-model="searchForm[item.fieldId]"
          v-bind="item"
        >
          <el-radio
            v-for="(val, radioIndex) in item.radioList"
            :key="radioIndex"
            :label="val"
          ></el-radio>
        </el-radio-group>
        <el-input
          v-else
          v-model="searchForm[item.fieldId]"
          v-bind="item"
        />
      </el-form-item>
    </el-form>
    <div v-if="showBtns" class='btn-options'>
      <div class='options'>
        <slot name='options'></slot>
      </div>
      <div class='btn-container'>
        <el-button type="primary" @click="onSearch">查询</el-button>
        <el-button type="primary" @click="onReset" v-show="showReset">重置</el-button>
        <slot name='buttons'></slot>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Form',
  props: {
    inline: {
      type: Boolean,
      default: true
    },
    labelWidth: {
      type: String,
      default: '100px'
    },
    searchColumns: {
      type: Array,
      default: []
    },
    showBtns: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      searchForm: {},
    }
  }
}
</script>

