<template>
  <div>
    <div id="doc">根据某个element然后去静态下载成doc文档</div>
    <el-button @click="handleExportDocx">下载docx文档</el-button>
    <el-button @click="handleDownloadByUrl">通过url下载文件</el-button>
    <el-button @click="handleDownloadByApi">通过api返回的流下载文件</el-button>
  </div>
</template>

<script>
import { exportDocx, downLoadFileByUrl, downLoadFileByStream } from '../../../../../utils/download/index.js'

export default {
  name: 'DomDoc',
  methods: {
    handleExportDocx() {
      exportDocx(document.getElementById('doc'), '测试名字')
    },
    handleDownloadByUrl() {
      downLoadFileByUrl(location.origin + '/test.pdf')
    },
    handleDownloadByApi() {
      downLoadFileByStream(location.origin + '/test.pdf')
    }
  }
}
</script>
