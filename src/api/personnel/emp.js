import request from '@/utils/request'

export function pageList(data) {
  return request({
    url: '/ucpm/identity/employee/page',
    method: 'get',
    params: data
  })
}

export function saveEmp(data) {
  return request({
    url: '/ucpm/identity/employee/save',
    method: 'post',
    data
  })
}

export function updateEmp(data) {
  return request({
    url: '/ucpm/identity/employee/edit',
    method: 'put',
    data
  })
}

export function resetPassword(id) {
  return request({
    url: '/ucpm/account/' + id,
    method: 'put'
  })
}
