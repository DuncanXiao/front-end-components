<template>
  <div class="custom-table">
    <div style="text-align: left">
      <el-form :inline="true" :model="searchForm" :label-width="labelWidth">
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
    <el-table
      :data="tableData"
      style="width: 100%">
      <el-table-column
        v-for="(column, index) in columnList"
        :key="index"
        v-bind="column"
      >
        <template slot-scope="scope">
          <slot
            :name="column.slotColName"
            :row="scope.row">
            {{scope.row[column.prop]}}
          </slot>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      v-if="hasPagination"
      class="pagination"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      v-bind="pagination"
      layout="total, sizes, prev, pager, next, jumper"
    >
    </el-pagination>
  </div>
</template>

<script>
import cloneDeep from 'lodash/cloneDeep'
export default {
  props: {
    tableData: {
      type: Array,
      default() {
        return []
      }
    },
    columnList: {
      type: Array,
      default() {
        return []
      }
    },
    hasPagination: {
      type: Boolean,
      default: true
    },
    paginationConf: {
      type: Object,
      default: function() {
        return {
          'current-page': 1, // 重 1 开始
          'page-sizes': [100, 200, 300, 400],
          'page-size': 100,
          total: 400
        }
      }
    },
    getList: {
      type: Function,
      default() {
        return () => {}
      }
    },
    labelWidth: {
      type: String,
      default: '100px'
    },
    showBtns: {
      type: Boolean,
      default: true
    },
    showReset: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      pagination: this.paginationConf,
      tableColumns: this.columnList,
      searchForm: {},
      searchColumns: []
    }
  },
  watch: {
    paginationConf: function(newV, oldV) {
      this.pagination = newV
    },
    columnList: {
      handler(newV) {
        if (newV) {
          const tempV = cloneDeep(newV)
          const tempSearchForm = cloneDeep(this.searchForm)
          const tableColumns = []
          const searchForm = {}
          const searchColumns = []
          tempV.forEach((v) => {
            if (v.prop) {
              tableColumns.push({
                prop: v.prop,
                label: v.label
              })
            }
            if (v.searchConfig) {
              if (v.searchConfig.field1) {
                searchForm[v.searchConfig.field1.fieldId] = v.searchConfig.field1.defaultValue || tempSearchForm[v.searchConfig.field1.fieldId]
                searchForm[v.searchConfig.field2.fieldId] = v.searchConfig.field2.defaultValue || ''
              } else if (v.searchConfig.fieldId) {
                searchForm[v.searchConfig.fieldId] = v.searchConfig.defaultValue || ''
              } else {
                searchForm[v.prop] = v.searchConfig.defaultValue || ''
                v.searchConfig.fieldId = v.prop
              }
              searchColumns.push(v.searchConfig)
            }
          })
          this.tableColumns = tableColumns
          // this.searchForm = searchForm
          this.searchForm = {...searchForm, ...tempSearchForm}
          this.searchColumns = searchColumns
        }
      },
      deep: true,
      immediate: true
    }
  },
  methods: {
    handleEdit(index, row) {
      console.log(index, row)
    },
    handleDelete(index, row) {
      console.log(index, row)
    },
    handleSizeChange(val) {
      this.pagination['page-size'] = val
      this.$emit('handlePaginatonChange', this.pagination)
    },
    handleCurrentChange(val) {
      this.pagination['current-page'] = val
      this.$emit('handlePaginatonChange', this.pagination)
    },
    onSearch() {
      const params = {}
      for (let key in this.searchForm) {
        if (typeof this.searchForm[key] === 'string' && !this.searchForm[key]) {
          continue
        }
        params[key] = this.searchForm[key]
      }
      this.$emit('getList', params, null, true)
    },
    onReset() {
      for (let key in this.searchForm) {
        let defaultValue = ''
        for (let c of this.searchColumns) {
          if (c.field1 && c.field1.fieldId === key && c.field1.keepDefaultValue && c.field1.defaultValue) {
            defaultValue = c.field1.defaultValue
            break
          } else if (c.field2 && c.field2.fieldId === key && c.field2.keepDefaultValue && c.field2.defaultValue) {
            defaultValue = c.field2.defaultValue
            break
          } else if (c.filedId === key && c.keepDefaultValue && c.defaultValue) {
            defaultValue = c.defaultValue
            break
          }
        }
        this.searchForm[key] = defaultValue
      }
      this.$emit('handleReset')
    },
    resetFormByKey(key) {
      this.searchForm[key] = ''
    },
    setFormValueByKey(key, value) {
      this.searchForm[key] = value
    }
  }
}
</script>

<style scoped>
.btn-options {
  display: flex;
  justify-content: space-between;
}
.btn-container {
  text-align: right;
  margin-bottom: 30px;
}
.pagination {
  margin-top: 20px;
  text-align: right;
}
</style>
