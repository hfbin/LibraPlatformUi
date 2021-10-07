import request from '@/utils/request'

export function pageList(data) {
  return request({
    url: '/tr/tenant/page',
    method: 'get',
    params: data
  })
}
export function get(id) {
  return request({
    url: '/tr/tenant/' + id,
    method: 'get'
  })
}

export function del(id) {
  return request({
    url: '/tr/tenant/delete/' + id,
    method: 'delete'
  })
}

export function add(data) {
  return request({
    url: '/tr/tenant/save',
    method: 'post',
    data
  })
}

export function update(data) {
  return request({
    url: '/tr/tenant/edit',
    method: 'put',
    data
  })
}
