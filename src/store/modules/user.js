import { login, logout, getInfo, getMenu } from '@/api/user'
import { getToken, setToken, removeToken } from '@/utils/auth'
import router, { resetRouter, constantRoutes } from '@/router'
import { setLocal, delLocal } from '@/utils/storage'

import Layout from '@/layout'

const state = {
  routes: [],
  addRoutes: [],
  token: getToken(),
  name: '',
  avatar: '',
  introduction: '',
  roles: []
}

const mutations = {
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_INTRODUCTION: (state, introduction) => {
    state.introduction = introduction
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  },
  SET_ROLES: (state, roles) => {
    state.roles = roles
  },
  SET_ROUTES: (state, routes) => {
    state.addRoutes = routes // 动态权限
    state.routes = constantRoutes.concat(routes) // 默认权限
    console.log('state.addRoutes', state.addRoutes)
  }
}

const actions = {
  /**
   * 用户登录
   * @param commit
   * @param userInfo
   * @returns {Promise<unknown>}
   */
  login({ commit }, userInfo) {
    const { username, password } = userInfo
    return new Promise((resolve, reject) => {
      login({ username: username.trim(), password: password, grantType: 'password' }).then(response => {
        const { data } = response
        commit('SET_TOKEN', data.token)
        setToken(data.token)
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  /**
   * 获取用户信息
   * @param commit
   * @param state
   * @returns {Promise<unknown>}
   */
  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      getInfo().then(response => {
        const { data } = response
        if (!data) {
          reject('Verification failed, please Login again.')
        }
        const { name, avatar, introduction } = data
        commit('SET_NAME', name)
        commit('SET_AVATAR', avatar)
        commit('SET_INTRODUCTION', introduction)
        setLocal('userInfo', data)
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },

  /**
   * 获取用户菜单权限
   * @param commit
   * @param state
   * @returns {Promise<unknown>}
   */
  generateRoutes({ commit }) {
    return new Promise((resolve, reject) => {
      let accessedRoutes
      getMenu().then(response => {
        // 菜单权限
        const routerVos = response.data.routerVos
        // 按钮资源权限
        const btnAuths = response.data.btnAuths

        // 特殊页面菜单处理
        accessedRoutes = filterAsyncRouter(routerVos)
        console.log('generateRoutes.SET_ROLES', btnAuths)
        console.log('generateRoutes.SET_ROUTES', accessedRoutes)
        commit('SET_ROLES', btnAuths)
        commit('SET_ROUTES', accessedRoutes)
        resolve(accessedRoutes)
      }).catch(error => {
        reject(error)
      })
    })
  },

  /**
   * 用户退出登录
   * @param commit
   * @param state
   * @param dispatch
   * @returns {Promise<unknown>}
   */
  logout({ commit, state, dispatch }) {
    return new Promise((resolve, reject) => {
      logout(state.token).then(() => {
        commit('SET_TOKEN', '')
        commit('SET_ROLES', [])
        removeToken()
        resetRouter()

        // reset visited views and cached views
        // to fixed https://github.com/PanJiaChen/vue-element-admin/issues/2485
        dispatch('tagsView/delAllViews', null, { root: true })
        delLocal('userInfo')
        // 移除水印
        document.body.removeChild(document.getElementById('_waterMark'))
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      commit('SET_TOKEN', '')
      commit('SET_ROLES', [])
      removeToken()
      resolve()
    })
  },

  // dynamically modify permissions
  async changeRoles({ commit, dispatch }, role) {
    const token = role + '-token'

    commit('SET_TOKEN', token)
    setToken(token)

    await dispatch('getInfo')

    resetRouter()

    // generate accessible routes map based on roles
    const accessRoutes = await dispatch('user/generateRoutes', { root: true })
    // dynamically add accessible routes
    router.addRoutes(accessRoutes)

    // reset visited views and cached views
    dispatch('tagsView/delAllViews', null, { root: true })
  }
}

/**
 * 处理特殊页面
 * @param routes
 * @param parent
 * @returns {*}
 */
function filterAsyncRouter(routes, parent) {
  return routes.filter((route) => {
    const component = route.component
    if (component) {
      // 处理空页面，避免出现父菜单显示问题
      if (route.component === 'Layout') {
        if (route.children && route.children.length > 0 && parent) {
          route.component = (resolve) => {
            // 子菜单的父菜单空页面处理（不是一级菜单）
            require(['@/layout/empty.vue'], resolve)
          }
        } else {
          // 一级菜单
          route.component = Layout
        }
      } else if (typeof component === 'string') {
        route.component = view(component)
      }
      if (route.children && route.children.length) {
        route.children = filterAsyncRouter(route.children, route)
      }
      return true
    }
  })
}

/**
 * 将component转换成对劲页面地址
 * @param path
 * @returns {(function(*=): void)|*}
 */
function view(path) {
  return function(resolve) {
    require([`@/views/${path}.vue`], resolve)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
