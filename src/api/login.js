import request from '@/utils/request'

export function login(username, password) {
  return request({
    // url: '/user/login',
    url: '/admin/user/sign_in',
    method: 'post',
    data: {
      name: username,
      pwd: password
    }
  })
}

export function getInfo(token) {
  return request({
    url: '/admin_auth/user/info',
    method: 'get',
    params: { token }
  })
}

export function logout() {
  return request({
    url: '/user/logout',
    method: 'post'
  })
}
