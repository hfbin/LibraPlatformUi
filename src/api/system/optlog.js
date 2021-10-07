import request from '@/utils/request'

export function pageList(data) {
  return request({
    url: '/base/optlog/page',
    method: 'get',
    params: data
  })
}
export function get(id) {
  return request({
    url: '/base/optlog/' + id,
    method: 'get'
  })
}

export function del(id) {
  return request({
    url: '/base/optlog/delete/' + id,
    method: 'delete'
  })
}

export function add(data) {
  return request({
    url: '/base/optlog/save',
    method: 'post',
    data
  })
}

export function update(data) {
  return request({
    url: '/base/optlog/update',
    method: 'put',
    data
  })
}
