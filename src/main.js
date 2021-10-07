import Vue from 'vue'

import Cookies from 'js-cookie'

import 'normalize.css/normalize.css' // a modern alternative to CSS resets

import Element from 'element-ui'
import './styles/element-variables.scss'
import enLang from 'element-ui/lib/locale/lang/en'// 如果使用中文语言包请默认支持，无需额外引入，请删除该依赖
// eslint-disable-next-line no-unused-vars
import { resetForm, dateFormat, handleTree, removePublicFields } from '@/utils/index'
import '@/styles/index.scss' // global css

import App from './App'
import store from './store'
import router from './router'

import './icons' // icon
import './permission' // permission control
import './utils/error-log' // error log

import * as filters from './filters' // global filters
import {
  fileDown
} from '@/utils/file'
import Pagination from '@/components/Pagination'
// 自定义表格工具组件
import RightToolbar from '@/components/RightToolbar'
Vue.component('Pagination', Pagination)
Vue.component('RightToolbar', RightToolbar)

// 权限判断全局指令
import permission from './directive/permission/permission.js'
Vue.directive('permission', permission)

// 全局方法挂载
Vue.prototype.removePublicFields = removePublicFields
Vue.prototype.handleTree = handleTree
Vue.prototype.dateFormat = dateFormat
Vue.prototype.resetForm = resetForm
// 文件下载
Vue.prototype.fileDown = fileDown

// 自定义表格
import LibraTable from '@/components/LibraTable'
Vue.component('LibraTable', LibraTable)

import zhLocale from 'element-ui/lib/locale/lang/zh-CN'
Vue.use(Element, { zhLocale })
/**
 * If you don't want to use mock-server
 * you want to use MockJs for mock api
 * you can execute: mockXHR()
 *
 * Currently MockJs will be used in the production environment,
 * please remove it before going online ! ! !
 */

Vue.use(Element, {
  size: Cookies.get('size') || 'medium', // set element-ui default size
  locale: enLang // 如果使用中文，无需设置，请删除
})

// register global utility filters
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})

Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
