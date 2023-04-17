import VirtualSelector from './virtualSelector'

const VirSelector = {
  install(Vue) {
    Vue.component('virtual-selector', VirtualSelector)
    Vue.component('VirtualSelector', VirtualSelector)
  }
}

export default VirSelector
