<template>
  <div
    v-show="node.visible"
    ref="node"
    class="el-tree-node"
    :class="{
      'is-expanded': expanded,
      'is-current': node.isCurrent,
      'is-hidden': !node.visible,
      'is-focusable': !node.disabled,
      'is-checked': !node.disabled && node.checked
    }"
    role="treeitem"
    tabindex="-1"
    :aria-expanded="expanded"
    :aria-disabled="node.disabled"
    :aria-checked="node.checked"
    :draggable="tree.draggable"
    @click.stop="handleClick"
    @contextmenu="$event => handleContextMenu($event)"
    @dragstart.stop="handleDragStart"
    @dragover.stop="handleDragOver"
    @dragend.stop="handleDragEnd"
    @drop.stop="handleDrop"
  >
    <div
      class="el-tree-node__content"
      :style="{ 'padding-left': (node.level - 1) * tree.indent + 'px' }">
      <span
        :class="[
          { 'is-leaf': node.isLeaf, expanded: !node.isLeaf && expanded },
          'el-tree-node__expand-icon',
          tree.iconClass ? tree.iconClass : 'el-icon-caret-right'
        ]"
        @click.stop="handleExpandIconClick"
      ></span>
      <!-- eslint-disable -->
      <el-checkbox
        v-if="showCheckbox"
        v-model="node.checked"
        :indeterminate="node.indeterminate"
        :disabled="!!node.disabled"
        @click.native.stop
        @change="handleCheckChange"
      ></el-checkbox>
      <span
        v-if="node.loading"
        class="el-tree-node__loading-icon el-icon-loading"></span>
      <node-content :node="node"></node-content>
    </div>
    <el-collapse-transition>
      <div
        v-if="!renderAfterExpand || childNodeRendered"
        v-show="expanded"
        class="el-tree-node__children"
        role="group"
        :aria-expanded="expanded">
        <el-tree-node
          v-for="child in node.childNodes"
          :key="getNodeKey(child)"
          :render-content="renderContent"
          :render-after-expand="renderAfterExpand"
          :show-checkbox="showCheckbox"
          :node="child"
          @node-expand="handleChildNodeExpand"
        ></el-tree-node>
      </div>
    </el-collapse-transition>
  </div>
</template>

<script type="text/jsx">
/* eslint-disable */
import ElCollapseTransition from 'element-ui/src/transitions/collapse-transition'
import ElCheckbox from 'element-ui/packages/checkbox'
import emitter from 'element-ui/src/mixins/emitter'
import mixinNode from './mixin/node'
import { getNodeKey } from './model/util'

export default {
  name: 'ElTreeNode',

  componentName: 'ElTreeNode',

  components: {
    ElCollapseTransition,
    ElCheckbox,
    NodeContent: {
      props: {
        node: {
          required: true
        }
      },
      render(h) {
        const parent = this.$parent
        const tree = parent.tree
        const node = this.node
        const { data, store } = node
        return (
          parent.renderContent
            ? parent.renderContent.call(parent._renderProxy, h, { _self: tree.$vnode.context, node, data, store })
            : tree.$scopedSlots.default
              ? tree.$scopedSlots.default({ node, data })
              : <span class='el-tree-node__label'>{ node.label }</span>
        )
      }
    }
  },

  mixins: [emitter, mixinNode],

  props: {
    node: {
      default() {
        return {}
      }
    },
    props: {},
    renderContent: Function,
    renderAfterExpand: {
      type: Boolean,
      default: true
    },
    showCheckbox: {
      type: Boolean,
      default: false
    }
  },

  data() {
    return {
      tree: null,
      expanded: false,
      childNodeRendered: false,
      oldChecked: null,
      oldIndeterminate: null
    }
  },

  watch: {
    'node.indeterminate'(val) {
      this.handleSelectChange(this.node.checked, val)
    },

    'node.checked'(val) {
      this.handleSelectChange(val, this.node.indeterminate)
    },

    'node.expanded'(val) {
      this.$nextTick(() => this.expanded = val)
      if (val) {
        this.childNodeRendered = true
      }
    }
  },

  created() {
    const parent = this.$parent
    this.creator(parent, 'node')
  },

  methods: {
    getNodeKey(node) {
      return getNodeKey(this.tree.nodeKey, node.data)
    },

    handleDragStart(event) {
      if (!this.tree.draggable) return
      this.tree.$emit('tree-node-drag-start', event, this)
    },

    handleDragOver(event) {
      if (!this.tree.draggable) return
      this.tree.$emit('tree-node-drag-over', event, this)
      event.preventDefault()
    },

    handleDrop(event) {
      event.preventDefault()
    },

    handleDragEnd(event) {
      if (!this.tree.draggable) return
      this.tree.$emit('tree-node-drag-end', event, this)
    }
  }
}
</script>
