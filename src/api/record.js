import request from '@/utils/request'

export function recordAdd(data) {
  return request({
    url: '/admin_auth/record/add',
    method: 'post',
    data
  })
}
export function recordUpdate(data) {
  return request({
    url: '/admin_auth/record/update',
    method: 'post',
    data
  })
}

export function recordList(params) {
  return request({
    url: '/admin_auth/record/list',
    method: 'get',
    params
  })
}
export function recordDel(params) {
  return request({
    url: '/admin_auth/record/del',
    method: 'get',
    params
  })
}
