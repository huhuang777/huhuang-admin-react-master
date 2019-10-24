import axios from 'axios'
import { router } from 'utils'
import { cloneDeep } from 'lodash'
import pathToRegexp from 'path-to-regexp'
import { message } from 'antd'
import {
  SERVER_ERROR,
  UNAUTHORIZED,
  NO_PERMISSION,
  GATEWAY_TIMEOUT,
  UNKNOWN_ERROR,
  TOKEN_HEADER,
} from 'utils/constant'
import { checkTokenIsOk, isAuthPage } from 'utils/check'
import { apiPrefix } from 'utils/config'
import { stringify } from 'qs'

const { CancelToken } = axios
window.cancelRequest = new Map()

const fetcher = axios.create({
  baseURL: apiPrefix,
  timeout: 50000,
})

fetcher.interceptors.request.use(config => {
  config.params = config.params || {}
  return config
})

fetcher.interceptors.response.use(
  response => {
    if (!response || !response.data) {
      // TODO 提示服务器异常
      message.error('服务器异常')
    }
    if (response.data.result && response.data.result.pagination) {
      const result = response.data
      const { pagination } = result.result
      result.result.pagination = {
        current: pagination.current_page,
        total: pagination.total,
        pageSize: pagination.per_page,
      }
      return result
    }
    return response.data
  },
  error => {
    return error
  }
)

export default function request(options) {
  let { data, url, method = 'get' } = options
  if (data && data.pageSize && data.page) {
    data = {
      ...data,
      per_page: data.pageSize,
    }
    delete data.pageSize
  }
  const cloneData = cloneDeep(data)
  const headers = {}
  try {
    let domain = ''
    const urlMatch = url.match(/[a-zA-z]+:\/\/[^/]*/)
    if (urlMatch) {
      ;[domain] = urlMatch
      url = url.slice(domain.length)
    }

    const match = pathToRegexp.parse(url)
    url = pathToRegexp.compile(url)(data)

    for (const item of match) {
      if (item instanceof Object && item.name in cloneData) {
        delete cloneData[item.name]
      }
    }
    url = domain + url
  } catch (e) {
    message.error(e.message)
  }
  if (checkTokenIsOk()) {
    const { app } = window.g_app._store.getState('app')
    const { token } = app
    headers[TOKEN_HEADER] = `Bearer ${token}`
    options.headers = headers
  } else if (!isAuthPage(url)) {
    message.error('Token 不存在或是无效的')
    return {
      success: false,
    }
  }
  options.url = url
  options.params = cloneData
  if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(method)) {
    options.data = cloneData
    delete options.params
  }

  options.cancelToken = new CancelToken(cancel => {
    window.cancelRequest.set(Symbol(Date.now()), {
      pathname: window.location.pathname,
      cancel,
    })
  })

  return fetcher(options)
    .then(response => {
      const { code } = response
      if (code) {
        message.success(response.message)
        return Promise.resolve({
          success: true,
          ...response,
        })
      } else {
        throw response
      }
    })
    .catch(error => {
      let { response } = error
      if (!response) {
        response = error
      }
      const responseError = [
        SERVER_ERROR,
        GATEWAY_TIMEOUT,
        UNAUTHORIZED,
        NO_PERMISSION,
        UNKNOWN_ERROR,
      ].includes(response.status)
      if (responseError) {
        const errMessage = response.data
          ? response.data.message
          : response.statusText
        message.error(errMessage)
      }
      if ([UNAUTHORIZED, NO_PERMISSION].includes(response.status)) {
        router.push({
          pathname: '/login',
          search: stringify({
            from: window.location.pathname,
          }),
        })
        window.g_app._store.dispatch({ type: 'app/signOut' })
      }
      /* eslint-disable */
      return Promise.reject({
        success: false,
        ...error,
      })
    })
}
