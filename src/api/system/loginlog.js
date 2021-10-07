import request from '@/utils/request'

export function pageList(data) {
  return request({
    url: '/base/loginlog/page',
    method: 'get',
    params: data
  })
}
export function get(id) {
  return request({
    url: '/base/loginlog/' + id,
    method: 'get'
  })
}

export function del(id) {
  return request({
    url: '/base/loginlog/delete/' + id,
    method: 'delete'
  })
}

export function add(data) {
  return request({
    url: '/base/loginlog/save',
    method: 'post',
    data
  })
}

export function update(data) {
  return request({
    url: '/base/loginlog/update',
    method: 'put',
    data
  })
}
