import axios from 'axios'
import { MessageBox, Message } from 'element-ui'
import store from '@/store'
import { getToken } from '@/utils/auth'
import { getLocal } from '@/utils/storage'
import qs from 'qs'

// create an axios instance
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 25000 // request timeout 25S
})

// request interceptor
service.interceptors.request.use(
  config => {
    // 租户获取
    const token = getLocal('TenantCode')
    if (token === undefined || token === null || token === '') {
      Message({
        message: '未指定租户',
        type: 'error',
        duration: 5 * 1000
      })
      return
    }
    // 请求版本
    config.headers['g-version'] = '1.0'
    // 应用端
    config.headers['Client-Code'] = 'pc-tenant'
    // 租户请求头
    config.headers['Tenant-Code'] = token
    // 此端的身份标识
    config.headers['Identity-Type'] = 10
    // 如果有token 则放进请求头
    if (store.getters.token) {
      config.headers['Access-Token'] = getToken()
    }
    // 解决get请求数据问题
    if (config.method === 'get') {
      config.paramsSerializer = function(params) {
        return qs.stringify(params, { arrayFormat: 'repeat' })
      }
    }
    return config
  },
  error => {
    console.log(error) // for debug
    return Promise.reject(error)
  }
)

// response interceptor
service.interceptors.response.use(
  response => {
    const res = response.data
    // 文件则直接返回
    if (response.request.responseType === 'blob') {
      return response
    }
    //  JWT_TOKEN_EXPIRED(600, "token已失效，请重新登录"),
    //  JWT_SIGNATURE(601, "token签名错误，请重新登录"),
    //  JWT_ILLEGAL_ARGUMENT(602, "token为空，请重新登录"),
    //  WT_PARSER_TOKEN_FAIL(603, "token解析失败，请重新登录"),
    if (res.code === 600 || res.code === 601 || res.code === 602 || res.code === 603) {
      // to re-login
      MessageBox.confirm('token已失效，请重新登录', 'token已失效', {
        confirmButtonText: '重新登录',
        type: 'warning'
      }).then(() => {
        store.dispatch('user/resetToken').then(() => {
          location.reload()
        })
      })
    } else if (res.code !== 200) {
      Message({
        message: res.msg || 'Error',
        type: 'error',
        duration: 5 * 1000
      })
      return Promise.reject(new Error(res.msg || 'Error'))
    } else {
      return res
    }
  },
  error => {
    console.log('err', error)
    Message({
      message: '无法连接服务，请检查网络',
      type: 'error',
      duration: 5 * 1000
    })
    return Promise.reject(error)
  }
)

export default service
