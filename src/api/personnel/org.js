import request from '@/utils/request'

export function pageList(data) {
  return request({
    url: '/ucpm/depart/page',
    method: 'get',
    params: data
  })
}
export function deptTree(data) {
  return request({
    url: '/ucpm/depart/tree',
    method: 'get',
    params: data
  })
}

export function get(id) {
  return request({
    url: '/ucpm/depart/' + id,
    method: 'get'
  })
}

export function del(id) {
  return request({
    url: '/ucpm/depart/delete/' + id,
    method: 'delete'
  })
}

export function add(data) {
  return request({
    url: '/ucpm/depart/save',
    method: 'post',
    data
  })
}

export function update(data) {
  return request({
    url: '/ucpm/depart/edit',
    method: 'put',
    data
  })
}
