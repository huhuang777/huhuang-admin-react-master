export { default as menu } from './menu'
export { default as admin } from './admin'

export const iconfontUrl="//at.alicdn.com/t/font_789538_ow90c6rv1xd.js"

// 返回正常但业务错误
export const HTTP_SUCCESS = 200;

// 无权限
export const NO_PERMISSION = 403;

// 未授权
export const UNAUTHORIZED = 401;

// 服务器挂了
export const SERVER_ERROR = 500;

// 请求超时
export const GATEWAY_TIMEOUT = 504;

// 未知
export const UNKNOWN_ERROR = 0;
