<template>
  <div>
    <div id="pdf">通过一个element打印</div>
    <el-button @click="handlePrintByDom">通过元素内容打印pdf</el-button>
    <el-button @click="handlePrintByNetwork">通过pdf路径打印pdf</el-button>
  </div>
</template>

<script>
import { printPartialHtml, printPdfList } from '../../../../../utils/print/index.js'

export default {
  name: 'PrintPdfByHtml',
  data() {
    return {
    }
  },
  methods: {
    handlePrintByDom() {
      printPartialHtml(document.getElementById('pdf'))
    },
    handlePrintByNetwork() {
      printPdfList([location.origin + '/test.pdf', location.origin + '/test.pdf'])
    }
  }
}
</script>
