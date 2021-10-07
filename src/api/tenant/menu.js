import request from '@/utils/request'

export function pageList(data) {
  return request({
    url: '/tr/menu/template/page',
    method: 'get',
    params: data
  })
}
export function get(id) {
  return request({
    url: '/tr/menu/template/' + id,
    method: 'get'
  })
}

export function syncTenantMenuPermission(id) {
  return request({
    url: '/tr/menu/template/sync-tenant-menu-permission/' + id,
    method: 'get'
  })
}

export function del(id) {
  return request({
    url: '/tr/menu/template/delete/' + id,
    method: 'delete'
  })
}

export function add(data) {
  return request({
    url: '/tr/menu/template/save',
    method: 'post',
    data
  })
}

export function update(data) {
  return request({
    url: '/tr/menu/template/edit',
    method: 'put',
    data
  })
}

export function menuTemplateList(data) {
  return request({
    url: '/tr/menu/template/list',
    method: 'get',
    data
  })
}
