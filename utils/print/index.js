import { PDFDocument } from 'pdf-lib'
import printJS from 'print-js'
import { Message } from 'element-ui'

export const printPartialHtml = (dom, { title = document.title } = {}) => {
  if (!dom) return
  let copyDom = document.createElement('span')
  const styleDom = document.querySelectorAll('style, link, meta')
  const titleDom = document.createElement('title')
  titleDom.innerText = title

  copyDom.appendChild(titleDom)
  Array.from(styleDom).forEach(item => {
    copyDom.appendChild(item.cloneNode(true))
  })
  copyDom.appendChild(dom.cloneNode(true))

  const htmlTemp = copyDom.innerHTML
  copyDom = null
  const iframeDom = document.createElement('iframe')
  const attrObj = {
    height: 0,
    width: 0,
    border: 0,
    wmode: 'Opaque'
  }
  const styleObj = {
    position: 'absolute',
    top: '-999px',
    left: '-999px'
  }
  Object.entries(attrObj).forEach(([key, value]) => {
    iframeDom.setAttribute(key, value)
  })
  Object.entries(styleObj).forEach(([key, value]) => {
    iframeDom.style[key] = value
  })
  document.body.insertBefore(iframeDom, document.body.children[0])
  const iframeWin = iframeDom.contentWindow // 1.获取iframe中的window
  const iframeDocs = iframeWin.document // 2.获取iframe中的document
  iframeDocs.write(`<!doctype html>`)
  iframeDocs.write(htmlTemp)
  setTimeout(() => {
    iframeWin.focus()
    // 兼容360浏览器的打印功能
    if (!iframeWin.document.execCommand('print', false, null)) { // document.execCommand('print', false, null) 相当于鼠标右击 选中打印功能
      // 调用其它浏览器的打印功能
      iframeWin.print() // 3.开始打印
    }
    document.body.removeChild(iframeDom)
  }, 100)
}


const downloadFile = (data) => {
  const blob = new Blob([data], { type: 'application/pdf' })
  const url = window.URL.createObjectURL(blob)
  printJS({
    printable: url,
    type: 'pdf'
  })
}

export const printPdfList = async(pdfList, errorMessage = '所选的文书不存在') => {
  const mergedPdf = await PDFDocument.create()
  let count = 0
  for (const pdfCopyDoc of pdfList) {
    try {
      const pdfBytes = await fetch(pdfCopyDoc).then(res => res.arrayBuffer())
      const pdf = await PDFDocument.load(pdfBytes)
      const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices())
      copiedPages.forEach((page) => {
        mergedPdf.addPage(page)
      })
      count++
    } catch (err) {
      console.error(err)
    }
  }
  if (count) {
    const mergedPdfFile = await mergedPdf.save()
    downloadFile(mergedPdfFile)
  } else {
    Message.error(errorMessage)
  }
}