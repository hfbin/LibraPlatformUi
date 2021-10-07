<template>
  <div />
</template>
<script>
import { getLocal } from '@/utils/storage'
export default {
  props: {
    // // 显示的水印文本
    // inputText: {
    //   type: String,
    //   default: 'username'
    // },
    // 是否允许通过js或开发者工具等途径修改水印DOM节点（水印的id，attribute属性，节点的删除）
    // true为允许，默认不允许
    inputAllowDele: {
      type: Boolean,
      default: false
    },
    // 是否在组件销毁时去除水印节点（前提是允许用户修改DOM，否则去除后会再次自动生成）
    // true会，默认不会
    inputDestroy: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      maskDiv: {} // 当前显示的水印div节点DOM对象
    }
  },
  watch: {
    // 监听传入水印文本变化
    // inputText() {
    //   this.$nextTick(() => {
    //     this.removeMaskDiv()
    //   })
    // }
  },
  mounted() {
    // 确认DOM渲染后再执行
    this.$nextTick(() => {
      // 创建水印节点
      this.init()
      if (!this.inputAllowDele) {
        // 设置水印节点修改的DOM事件
        this.Monitor()
      }
    })
  },
  methods: {
    init() {
      const userInfo = getLocal('userInfo')
      let mobile = ''
      let tenantCode = ''
      if (userInfo !== null) {
        mobile = userInfo.mobile
        tenantCode = userInfo.tenantCode
      } else {
        // 没有登录信息则不生成水印
        return
      }
      // 获取缓存中的租户
      const inputText = (new Date()).toLocaleString() + '-' + tenantCode + '-' + mobile
      const canvas = document.createElement('canvas')
      canvas.id = 'canvas'
      canvas.width = '350' // 单个水印的宽高
      canvas.height = '180'
      this.maskDiv = document.createElement('div')
      const ctx = canvas.getContext('2d')
      ctx.font = 'normal 12px Microsoft Yahei' // 设置样式
      ctx.fillStyle = 'rgba(116,115,115,0.13)' // 水印字体颜色
      // 旋转角度
      ctx.rotate(-18 * Math.PI / 180)
      ctx.fillText(inputText, 0, 180)
      const src = canvas.toDataURL('image/png')
      this.maskDiv.style.position = 'fixed'
      this.maskDiv.style.zIndex = '9999'
      this.maskDiv.id = '_waterMark'
      this.maskDiv.style.top = '30px'
      this.maskDiv.style.left = '0'
      this.maskDiv.style.height = '100%'
      this.maskDiv.style.width = '100%'
      this.maskDiv.style.pointerEvents = 'none'
      this.maskDiv.style.backgroundImage = 'URL(' + src + ')'
      // 水印节点插到body下
      document.body.appendChild(this.maskDiv)
    },
    Monitor() {
      const body = document.getElementsByTagName('body')[0]
      const options = {
        childList: true,
        attributes: true,
        characterData: true,
        subtree: true,
        attributeOldValue: true,
        characterDataOldValue: true
      }
      const observer = new MutationObserver(this.callback)
      observer.observe(body, options) // 监听body节点
    },
    // DOM改变执行callback
    callback(mutations, observer) {
      // 当attribute属性被修改
      if (mutations[0].target.id === '_waterMark') {
        this.removeMaskDiv()
      }
      // 当id被改变时
      if (mutations[0].attributeName === 'id') {
        this.removeMaskDiv()
        this.init()
      }
      // 当节点被删除
      if (mutations[0].removedNodes[0] && mutations[0].removedNodes[0].id === '_waterMark') {
        this.init()
      }
    },
    /* public */
    // 手动销毁水印DOM
    removeMaskDiv() {
      document.body.removeChild(this.maskDiv)
    },
    // 手动生成水印
    createMaskDiv() {
      this.init()
    }
  },
  destroy() {
    // 组件销毁时去除生成在body节点下的水印节点
    if (this.inputDestroy) {
      this.removeMaskDiv()
    }
  }
}
</script>
