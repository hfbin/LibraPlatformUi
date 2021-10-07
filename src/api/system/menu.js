import request from '@/utils/request'

export function listMenu(data) {
  return request({
    url: '/ucpm/menu/list',
    method: 'get',
    params: data
  })
}

export function getMenu(id) {
  return request({
    url: '/ucpm/menu/' + id,
    method: 'get'
  })
}

export function delMenu(id) {
  return request({
    url: '/ucpm/menu/delete/' + id,
    method: 'delete'
  })
}

export function addMenu(data) {
  return request({
    url: '/ucpm/menu/save',
    method: 'post',
    data
  })
}

export function updateMenu(data) {
  return request({
    url: '/ucpm/menu/edit',
    method: 'put',
    data
  })
}

export function menuTree(data) {
  return request({
    url: '/ucpm/menu/tree',
    method: 'get',
    params: data
  })
}

/**
 * [平台使用，查询所有菜单]
 * @param data
 * @returns {AxiosPromise}
 */
export function menuTreeIgnoreTr(data) {
  return request({
    url: '/ucpm/menu/treeIgnoreTr',
    method: 'get',
    params: data
  })
}

export function getMenuInterfaceRef(id) {
  return request({
    url: '/ucpm/menu/interface-ref/' + id,
    method: 'get'
  })
}

export function addMenuInterfaceRef(data) {
  return request({
    url: '/ucpm/menu/interface-ref/save',
    method: 'post',
    data
  })
}
