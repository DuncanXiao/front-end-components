const VirtualTree = () => import('@/pages/VirtualTree/index.vue')
const EmptyRouteView = () => import('@/pages/EmptyRouteView/index.vue')
const DomDoc = () => import('@/pages/Download/DomDoc/index.vue')
const DomDoc2 = () => import('@/pages/Download/DomDoc2/index.vue')

const routes = [
  {
    path: '/',
    component: VirtualTree,
    name: '虚拟treeLIst'
  },
  {
    path: '/download',
    name: '下载',
    component: EmptyRouteView,
    children: [
      {
        name: '通过dom下载doc',
        path: 'dom-doc',
        component: DomDoc
      },
      {
        name: '通过dom下载doc2',
        path: 'dom-doc2',
        component: DomDoc2
      }
    ]
  }
]

export default routes