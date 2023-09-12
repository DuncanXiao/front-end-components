<template>
  <div>
    <el-button @click="handleOpenCreateModal">新增</el-button>
    <base-modal
      title="新增菜单"
      ref="createModal"
    >
      <template slot="content">
        aaaa
      </template>
    </base-modal>
  </div>
</template>

<script>
import BaseModal from '@/components/BaseModal/index.vue'
import Table from '@/components/Table/index.vue'

export default {
  name: 'MenuList',
  components: {
    BaseModal,
    Table
  },
  methods: {
    handleOpenCreateModal() {
      this.$refs['createModal'].show();
    }
  }
}
</script>


