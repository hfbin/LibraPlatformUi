import request from '@/utils/request'

export function roleTree(data) {
  return request({
    url: '/ucpm/role/tree',
    method: 'get',
    params: data
  })
}
export function roleList() {
  return request({
    url: '/ucpm/role/list',
    method: 'get'
  })
}

export function roleMenuAuth(data) {
  return request({
    url: `/ucpm/role/menu/${data}`,
    method: 'get'
  })
}

export function saveRoleMenuAuth(data) {
  return request({
    url: '/ucpm/role/save-role-menu',
    method: 'post',
    data
  })
}
export function getRoleGroup(data) {
  return request({
    url: `/ucpm/role/group/${data}`,
    method: 'get'
  })
}
export function getRole(data) {
  return request({
    url: `/ucpm/role/${data}`,
    method: 'get'
  })
}

export function saveRole(data) {
  return request({
    url: '/ucpm/role/save',
    method: 'post',
    data
  })
}

export function saveRoleGroup(data) {
  return request({
    url: '/ucpm/role/group/save',
    method: 'post',
    data
  })
}

export function updateRole(data) {
  return request({
    url: '/ucpm/role/edit',
    method: 'put',
    data
  })
}
export function updateRoleGroup(data) {
  return request({
    url: '/ucpm/role/group/edit',
    method: 'put',
    data
  })
}

export function delRole(id) {
  return request({
    url: '/ucpm/role/delete/' + id,
    method: 'delete'
  })
}

export function delRoleGroup(id) {
  return request({
    url: '/ucpm/role/group/delete/' + id,
    method: 'delete'
  })
}
