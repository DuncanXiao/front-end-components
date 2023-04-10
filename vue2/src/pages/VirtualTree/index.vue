<template>
  <div>
    <h1>虚拟tree，用于数据列表过大的时候用。</h1>
    <el-virtual-tree
      ref='virtual-tree'
      :style="{width:'100%'}"
      :data="data"
      node-key="id"
      :height="maxHeight"
      lazy
      :expand-on-click-node="false"
      :props="defaultProps"
      :load="loadNode"
      @node-click="handleNodeClick"
      >
      <span slot-scope="{ data }">
          <el-tooltip
            placement="top"
            effect="light"
            :content="data.label">
              <span :style="{display:'flex',maxWidth:'132px'}">
                <span class="text-ono-line node-label">{{data.label}}</span>
                <span class="node-num">（{{data.num}}）</span>
              </span>
          </el-tooltip>
      </span>
    </el-virtual-tree>
  </div>
</template>

<script>
import ElVirtualTree from '@/components/el-virtual-tree/tree.vue'
import nodeList from './config.js'
export default {
  name: 'VirtualTree',
  components: {
    ElVirtualTree
  },
  data() {
    return {
      defaultProps: {
        children: 'children',
        label: 'label',
        isLeaf: 'leaf'
      },
      data: nodeList,
      maxWidth: '300px',
      maxHeight: '400px',
      hasDevider: false,
    }
  },
  methods: {
    loadNode(node, resolve) {
      // ajax
      if (node.level === 0) {
        resolve(this.data)
      } else {
        // this.$emit('handleMoreClick', node, resolve)
        resolve(node.data.children)
      }
      // resolve(node.data.children)
    },
    // 节点点击
    handleNodeClick(data) {
      this.$emit('handleNodeClick', data, this.$refs['virtual-tree'])
    }
  }
}
</script>
