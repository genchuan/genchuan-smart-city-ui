import http from './genchuanHttp2';

// thingsBoard 登录（直接调用 ThingsBoard API）
export function thingsBoardLogin(data) {
  return http({
    url: '/api/auth/login',
    method: 'post',
    data,
  });
}

// thingsBoard api文档
export function thingsboardApiDoc() {
  return http({
    url: '/v3/api-docs/thingsboard',
    method: 'get',
  });
}
