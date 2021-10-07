import request from '@/utils/request'

export function pageList(data) {
  return request({
    url: '/ucpm/position/page',
    method: 'get',
    params: data
  })
}
export function get(id) {
  return request({
    url: '/ucpm/position/' + id,
    method: 'get'
  })
}

export function del(id) {
  return request({
    url: '/ucpm/position/delete/' + id,
    method: 'delete'
  })
}

export function add(data) {
  return request({
    url: '/ucpm/position/save',
    method: 'post',
    data
  })
}

export function update(data) {
  return request({
    url: '/ucpm/position/edit',
    method: 'put',
    data
  })
}

export function positionList() {
  return request({
    url: '/ucpm/position/list',
    method: 'get'
  })
}
