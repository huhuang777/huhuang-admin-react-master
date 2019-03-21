import { fromJS } from 'immutable'
import axios from 'axios'
import { message } from 'antd'
import { SERVER_ERROR, GATEWAY_TIMEOUT, UNKNOWN_ERROR } from '../config';
import { isAuthPage } from '../discriminators/url';
import { checkTokenIsOk } from '../discriminators/token';
import { TOKEN, TOKEN_HEADER } from '../constants/auth';

const isProd = process.env.NODE_ENV === 'production'

export const fetcher = axios.create({
  baseURL: !isProd ? 'http://localhost:8000/' : 'http://api.huhuang.net/',
  timeout: 50000
})

fetcher.interceptors.request.use(config => {
  config.params = config.params || {}
  return config
})

fetcher.interceptors.response.use(response => {
  if (!response || !response.data) {
    // TODO 提示服务器异常
    message.error('服务器异常')
  }
  return response.data
}, error => {
  return error
})

const wrap = (type, url) => (config = {}) => {
  return new Promise((resolve, reject)=>{
    const headers = { 'Content-Type': 'application/json; charset=utf-8' }
      // 跳转去登陆
    if (isAuthPage(url)) {
     
    }
      // 检查 token，创建一个合理的头
    if (checkTokenIsOk()) {
      const _token = localStorage.getItem(TOKEN);
      headers[TOKEN_HEADER]=`Bearer ${_token}`;
      config.headers=headers;
    } else if(!isAuthPage(url)){
      message.error('Token 不存在或是无效的');
      return;
    }
    fetcher.request({ ...config, method: type, url }).then(response=>{
      if (response.code) {
        message.success(response.message);
        return resolve(response);
      } else {
        message.error(response.message);
        return reject(response);
      }
    }).catch(response=>{
      const responseError = [SERVER_ERROR, GATEWAY_TIMEOUT, UNKNOWN_ERROR].includes(response.status);
      if (responseError) {
        const errMessage = response.message || response.statusText;
        message.error(errMessage);
      }
      return reject(response);
    });
  })
}

const Service = {
  auth: {
    login: wrap('post', '/auth'),
    getInfo: wrap('get', '/auth'),
    editInfo: wrap('put', '/auth')
  },
  stat: {
    getStat: wrap('get', '/statistics')
  },
  article: {
    getList: wrap('get', '/article'),
    create: wrap('post', '/article'),
    batchUpdate: wrap('patch', '/article'),
    batchDelete: wrap('delete', '/article'),
    getItem: id => wrap('get', `/article/${id}`),
    editItem: id => wrap('put', `/article/${id}`),
    changeItemState: id => wrap('patch', `/article/${id}`),
    deleteItem: id => wrap('delete', `/article/${id}`)
  },
  comment: {
    getList: wrap('get', '/comment'),
    create: wrap('post', '/comment'),
    batchUpdate: wrap('patch', '/comment'),
    batchDelete: wrap('delete', '/comment'),
    getItem: id => wrap('get', `/comment/${id}`),
    editItem: id => wrap('put', `/comment/${id}`),
    deleteItem: id => wrap('delete', `/comment/${id}`),
    like: wrap('post', '/like')
  },
  category: {
    getList: wrap('get', '/category'),
    create: wrap('post', '/category'),
    batchDelete: wrap('delete', '/category'),
    getItem: id => wrap('get', `/category/${id}`),
    editItem: id => wrap('put', `/category/${id}`),
    deleteItem: id => wrap('delete', `/category/${id}`)
  },
  tag: {
    getList: wrap('get', '/tag'),
    create: wrap('post', '/tag'),
    batchDelete: wrap('delete', '/tag'),
    getItem: id => wrap('get', `/tag/${id}`),
    editItem: id => wrap('put', `/tag/${id}`),
    deleteItem: id => wrap('delete', `/tag/${id}`)
  },
  option: {
    getInfo: wrap('get', '/option'),
    create: wrap('post', '/option'),
    editInfo: wrap('put', '/option'),
  },
  qiniu: {
    getConfig: wrap('get', '/qiniu')
  }
}

export default Service
