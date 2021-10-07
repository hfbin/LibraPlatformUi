import request from '@/utils/request'

export function pageList(data) {
  return request({
    url: '/ucpm/client/page',
    method: 'get',
    params: data
  })
}
export function get(id) {
  return request({
    url: '/ucpm/client/' + id,
    method: 'get'
  })
}

export function del(id) {
  return request({
    url: '/ucpm/client/delete/' + id,
    method: 'delete'
  })
}

export function add(data) {
  return request({
    url: '/ucpm/client/save',
    method: 'post',
    data
  })
}

export function update(data) {
  return request({
    url: '/ucpm/client/update',
    method: 'put',
    data
  })
}

export function clientList(data) {
  return request({
    url: '/ucpm/client/list',
    method: 'get',
    params: data
  })
}
