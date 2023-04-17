const VirtualTree = () => import('@/pages/VirtualTree/index.vue')
const EmptyRouteView = () => import('@/pages/EmptyRouteView/index.vue')
const DomDocByHtml = () => import('@/pages/Download/DomDocByHtml/index.vue')
const PrintPdfByHtml = () => import('@/pages/Download/printPdfByHtml/index.vue')
const VirtualSelect = () => import('@/pages/VirtualSelect/index.vue')

const routes = [
  {
    path: '/',
    component: VirtualTree,
    name: '虚拟treeLIst',
    displayMenu: true
  },
  {
    path: '/downloadPrint',
    name: '下载与打印',
    component: EmptyRouteView,
    displayMenu: true,
    children: [
      {
        name: '通过dom下载doc',
        path: 'dom-doc-by-html',
        component: DomDocByHtml,
        displayMenu: true
      },
      {
        name: '通过dom打印pdf',
        path: 'dom-pdf-by-html',
        component: PrintPdfByHtml,
        displayMenu: true
      }
    ]
  }, {
    path: '/virtual-select',
    component: VirtualSelect,
    name: '虚拟treeLIst',
    displayMenu: true
  }
]

export default routes