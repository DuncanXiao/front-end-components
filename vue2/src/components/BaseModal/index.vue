
<template>
  <el-dialog
    :title="title"
    :visible.sync="dialogVisible"
    :width="width"
    v-bind="$attrs"
    :close-on-click-modal = closeByModal
    :close-on-press-escape = closeByPress
    :show-close = showClose
    v-on="$listeners"
    >
    <slot name="content">{{contentText}}</slot>
    <div class="footer-container">
      <slot
        name="footer"
      >
        <div class="dialog-footer">
          <el-button
            v-if="submitText"
            :loading="btnLoading"
            type="primary"
            size="medium"
            @click="handleSubmit"
          >{{submitText}}</el-button>
          <el-button
            v-if="cancelText"
            size="medium"
            @click="handleClose"
          >{{cancelText}}</el-button>
        </div>
      </slot>
    </div>
  </el-dialog>
</template>

<script>
export default {
  name: 'BaseModal',
  props: {
    title: {
      type: String,
      default: ''
    },
    width: {
      type: String,
      default: '270px'
    },
    cancelText: {
      type: String,
      default: '取 消'
    },
    submitText: {
      type: String,
      default: '确 认'
    },
    contentText: {
      type: String,
      default: ''
    },
    btnLoading: {
      type: Boolean,
      default: false
    },
    closeByModal: {
      type: Boolean,
      default: false
    },
    closeByPress: {
      type: Boolean,
      default: true
    },
    showClose: {
      type: Boolean,
      default: true
    }
  },
  data: function() {
    return {
      dialogVisible: false
    }
  },
  methods: {
    handleClose() {
      this.$emit('onClose')
    },
    handleSubmit() {
      this.$emit('onSubmit')
    },
    // show
    show() {
      this.dialogVisible = true
    },
    // close
    hide() {
      this.dialogVisible = false
    }
  }
}
</script>

<style scoped>
  .dialog-footer {
    display: flex;
    justify-content: flex-end;
  }
</style>

