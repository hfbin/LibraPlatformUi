import request from '@/utils/request'

export function pageList(data) {
  return request({
    url: '/gen/ds/page',
    method: 'get',
    params: data
  })
}

export function list() {
  return request({
    url: '/gen/ds/list',
    method: 'get'
  })
}
export function get(id) {
  return request({
    url: '/gen/ds/' + id,
    method: 'get'
  })
}

export function save(data) {
  return request({
    url: '/gen/ds/save',
    method: 'post',
    data
  })
}

export function update(data) {
  return request({
    url: '/gen/ds/edit',
    method: 'put',
    data
  })
}

