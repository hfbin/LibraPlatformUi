import request from '@/utils/request'

export function pageList(data) {
  return request({
    url: '/ucpm/version/page',
    method: 'get',
    params: data
  })
}
export function get(id) {
  return request({
    url: '/ucpm/version/' + id,
    method: 'get'
  })
}

export function del(id) {
  return request({
    url: '/ucpm/version/delete/' + id,
    method: 'delete'
  })
}

export function add(data) {
  return request({
    url: '/ucpm/version/save',
    method: 'post',
    data
  })
}

export function update(data) {
  return request({
    url: '/ucpm/version/edit',
    method: 'put',
    data
  })
}
