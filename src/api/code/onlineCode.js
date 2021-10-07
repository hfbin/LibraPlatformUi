import request from '@/utils/request'

export function pageList(data) {
  return request({
    url: '/gen/generator/page',
    method: 'get',
    params: data
  })
}
export function preview(id) {
  return request({
    url: '/gen/generator/preview',
    method: 'get'
  })
}

export function code(data) {
  return request({
    url: '/gen/generator/code',
    method: 'get',
    responseType: 'blob',
    params: data
  })
}

