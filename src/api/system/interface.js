import request from '@/utils/request'

export function listInterface(data) {
  return request({
    url: '/ucpm/interface/list',
    method: 'get',
    params: data
  })
}

export function treeInterface(data) {
  return request({
    url: '/ucpm/interface/tree',
    method: 'get',
    params: data
  })
}

export function getInterface(id) {
  return request({
    url: '/ucpm/interface/' + id,
    method: 'get'
  })
}

export function delInterface(id) {
  return request({
    url: '/ucpm/interface/delete/' + id,
    method: 'delete'
  })
}

export function addInterface(data) {
  return request({
    url: '/ucpm/interface/save',
    method: 'post',
    data
  })
}

export function updateInterface(data) {
  return request({
    url: '/ucpm/interface/edit',
    method: 'put',
    data
  })
}
