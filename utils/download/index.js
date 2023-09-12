// 注意：file-saver 依赖 Blob 对象
import { saveAs } from 'file-saver'
// htmlDocx 的作用就是将html字符串转成Blob对象
import htmlDocx from 'html-docx-js/dist/html-docx'
// import html2Canvas from 'html2canvas'
// import JsPDF from 'jspdf'

export const exportDocx = (dom, fileName, config, { title = document.title, width } = {}) => {
  if (!dom) return
  config = config || {}
  let copyDom = document.createElement('span')
  const titleDom = document.createElement('title')
  titleDom.innerText = title

  copyDom.appendChild(titleDom)
  const cloneDom = dom.cloneNode(true)
  if (width) {
    const domTables = cloneDom.getElementsByTagName('table')
    if (domTables.length) {
      for (const table of domTables) {
        table.style.width = width + 'px'
      }
    }
  }
  copyDom.appendChild(cloneDom)

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

  const htmlDoc = `
  <!DOCTYPE html>
  <html lang="en">
  ${iframeDocs.documentElement.innerHTML}
  </html>
  `
  var converted = htmlDocx.asBlob(htmlDoc, config)
  saveAs(converted, fileName + '.docx')
  document.body.removeChild(iframeDom)
}

export const downLoadFileByUrl = (url, fileName=`test.${Math.random()*10}`) => {
  const aEl = document.createElement('a')
  aEl.setAttribute('href', url)
  aEl.setAttribute('download', fileName)
  aEl.setAttribute('target', '_blank')
  aEl.setAttribute('style', 'display:none')
  document.body.appendChild(aEl)
  aEl.click()

  setTimeout(() => {
    document.body.removeChild(aEl)
  }, 500)
}

export const downLoadFileByStream = (content, name, type = '.xls') => {
  var elink = document.createElement('a')
  // name为后台返给前端的文件名，后缀名必须加，后台有返回后缀就不用管，不然下载在本地不好打开。
  elink.download = name + type
  elink.style.display = 'none'
  var blob = new Blob([content])
  elink.href = URL.createObjectURL(blob)
  document.body.appendChild(elink)
  elink.click()
  setTimeout(() => {
    document.body.removeChild(elink)
  }, 500)
}

export const htmlToPdfSave = (domName, title) => {
  html2Canvas(document.querySelector(domName), {
    allowTaint: true
  }).then(function(canvas) {
    const contentWidth = canvas.width
    const contentHeight = canvas.height
    const pageHeight = contentWidth / 592.28 * 841.89
    let leftHeight = contentHeight
    let position = 10
    const imgWidth = 595.28
    const imgHeight = 592.28 / contentWidth * contentHeight
    const pageData = canvas.toDataURL('image/jpeg', 1.0)
    const PDF = new JsPDF('', 'pt', 'a4')
    if (leftHeight < pageHeight) {
      PDF.addImage(pageData, 'JPEG', 0, 0, imgWidth, imgHeight)
    } else {
      while (leftHeight > 0) {
        PDF.addImage(pageData, 'JPEG', 0, position, imgWidth, imgHeight)
        leftHeight -= pageHeight
        position -= 841.89
        if (leftHeight > 0) {
          PDF.addPage()
        }
      }
    }
    PDF.save(title + '.pdf')
  }
  )
}

export const downloadFileByXML = {
  getBlob: (url, cb) => {
    const xhr = new XMLHttpRequest();
    xhr.open("GET", url, true);
    xhr.responseType = "blob";
    xhr.onload = function() {
      if (xhr.status === 200) {
        cb(xhr.response);
      }
    };
    xhr.send();
  },
  saveAs: (blob, filename) => {
    if (window.navigator.msSaveOrOpenBlob) {
      navigator.msSaveBlob(blob, filename);
    } else {
      const link = document.createElement("a");
      const body = document.querySelector("body");

      link.href = window.URL.createObjectURL(blob);
      link.download = filename;

      // fix Firefox
      link.style.display = "none";
      body.appendChild(link);

      link.click();
      body.removeChild(link);

      window.URL.revokeObjectURL(link.href);
    }
  },
  download: (url, filename) => {
    downloadFileByXML.getBlob(url, (blob) => {
      downloadFileByXML.saveAs(blob, filename);
    });
  }
};