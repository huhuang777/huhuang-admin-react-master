import { cloneDeep, isString, flow, curry } from 'lodash'
import umiRouter from 'umi/router'
import pathToRegexp from 'path-to-regexp'
import moment from 'moment'
import 'moment/locale/zh-cn'

export { default as classnames } from 'classnames'
export { default as config } from './config'
export { default as request } from './request'
export { Color } from './theme'

/**
 * Query objects that specify keys and values in an array where all values are objects.
 * @param   {array}         array   An array where all values are objects, like [{key:1},{key:2}].
 * @param   {string}        key     The key of the object that needs to be queried.
 * @param   {string}        value   The value of the object that needs to be queried.
 * @return  {object|undefined}   Return frist object when query success.
 */
export function queryArray(array, key, value) {
  if (!Array.isArray(array)) {
    return
  }
  return array.find(_ => _[key] === value)
}

/**
 * Convert an array to a tree-structured array.
 * @param   {array}     array     The Array need to Converted.
 * @param   {string}    id        The alias of the unique ID of the object in the array.
 * @param   {string}    parentId       The alias of the parent ID of the object in the array.
 * @param   {string}    children  The alias of children of the object in the array.
 * @return  {array}    Return a tree-structured array.
 */
export function arrayToTree(
  array,
  id = 'id',
  parentId = 'pid',
  children = 'children'
) {
  const result = []
  const hash = {}
  const data = cloneDeep(array)

  data.forEach((item, index) => {
    hash[data[index][id]] = data[index]
  })

  data.forEach(item => {
    const hashParent = hash[item[parentId]]
    if (hashParent) {
      !hashParent[children] && (hashParent[children] = [])
      hashParent[children].push(item)
    } else {
      result.push(item)
    }
  })
  return result
}

/**
 * Adjust the router to automatically add the current language prefix before the pathname in push and replace.
 */
const myRouter = {
  ...umiRouter,
}

myRouter.push = flow(umiRouter.push)

myRouter.replace = flow(myRouter.replace)

export const router = myRouter

/**
 * Whether the path matches the regexp if the language prefix is ignored, https://github.com/pillarjs/path-to-regexp.
 * @param   {string|regexp|array}     regexp     Specify a string, array of strings, or a regular expression.
 * @param   {string}                  pathname   Specify the pathname to match.
 * @return  {array|null}              Return the result of the match or null.
 */
export function pathMatchRegexp(regexp, pathname) {
  return pathToRegexp(regexp).exec(pathname)
}

/**
 * In an array object, traverse all parent IDs based on the value of an object.
 * @param   {array}     array     The Array need to Converted.
 * @param   {string}    current   Specify the value of the object that needs to be queried.
 * @param   {string}    parentId  The alias of the parent ID of the object in the array.
 * @param   {string}    id        The alias of the unique ID of the object in the array.
 * @return  {array}    Return a key array.
 */
export function queryPathKeys(array, current, parentId, id = 'id') {
  const result = [current]
  const hashMap = new Map()
  array.forEach(item => hashMap.set(item[id], item))

  const getPath = current => {
    const currentParentId = hashMap.get(current)[parentId]
    if (currentParentId) {
      result.push(currentParentId)
      getPath(currentParentId)
    }
  }

  getPath(current)
  return result
}

/**
 * In an array of objects, specify an object that traverses the objects whose parent ID matches.
 * @param   {array}     array     The Array need to Converted.
 * @param   {string}    current   Specify the object that needs to be queried.
 * @param   {string}    parentId  The alias of the parent ID of the object in the array.
 * @param   {string}    id        The alias of the unique ID of the object in the array.
 * @return  {array}    Return a key array.
 */
export function queryAncestors(array, current, parentId, id = 'id') {
  const result = [current]
  const hashMap = new Map()
  array.forEach(item => hashMap.set(item[id], item))

  const getPath = current => {
    const currentParentId = hashMap.get(current[id])[parentId]
    if (currentParentId) {
      result.push(hashMap.get(currentParentId))
      getPath(hashMap.get(currentParentId))
    }
  }

  getPath(current)
  return result
}

/**
 * Query which layout should be used for the current path based on the configuration.
 * @param   {layouts}     layouts   Layout configuration.
 * @param   {pathname}    pathname  Path name to be queried.
 * @return  {string}   Return frist object when query success.
 */
export function queryLayout(layouts, pathname) {
  let result = 'public'

  const isMatch = regepx => {
    return regepx instanceof RegExp
      ? regepx.test(pathname)
      : pathMatchRegexp(regepx, pathname)
  }

  for (const item of layouts) {
    let include = false
    let exclude = false
    if (item.include) {
      for (const regepx of item.include) {
        if (isMatch(regepx)) {
          include = true
          break
        }
      }
    }

    if (include && item.exclude) {
      for (const regepx of item.exclude) {
        if (isMatch(regepx)) {
          exclude = true
          break
        }
      }
    }

    if (include && !exclude) {
      result = item.name
      break
    }
  }

  return result
}

const reg = /(((^https?:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+(?::\d+)?|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)$/

export function isUrl(path) {
  return reg.test(path)
}
/**
 * 判断两个对象值是否相等
 * @param {*} o1  对象1
 * @param {*} o2  对象2
 * @return {boolean} Return
 */
export function isObjEqual(o1, o2) {
  var props1 = Object.getOwnPropertyNames(o1)
  var props2 = Object.getOwnPropertyNames(o2)
  if (props1.length != props2.length) {
    return false
  }
  for (var i = 0, max = props1.length; i < max; i++) {
    var propName = props1[i]
    if (o1[propName] !== o2[propName]) {
      return false
    }
  }
  return true
}

function buildSpan(span, icon, text) {
  return `<span class="${span}"><i class="iconfont icon-${icon}"></i>${text}</span>`
}
// 浏览器解析
export function browserParser(ua) {
  const getR1 = r => r[0].split('/')
  const defaultRule = () => buildSpan('ua_other', 'internet', '其它浏览器')

  const rules = [
    {
      reg: /MSIE\s([^\s|]+)/gi,
      template: r =>
        buildSpan(
          'ua_ie',
          'ie',
          'Internet Explorer | ' + r[0].replace('MSIE', '').split('.')[0]
        ),
    },
    {
      reg: /FireFox\/([^\s]+)/gi,
      template: r =>
        buildSpan('ua_firefox', 'firefox', 'Mozilla FireFox | ' + getR1(r)[1]),
    },
    {
      reg: /Maxthon([\d]*)\/([^\s]+)/gi,
      template: r => buildSpan('ua_maxthon', 'maxthon', 'Maxthon'),
    },
    {
      reg: /UBrowser([\d]*)\/([^\s]+)/gi,
      template: r => buildSpan('ua_ucweb', 'uc', 'UCBrowser | ' + getR1(r)[1]),
    },
    {
      reg: /MetaSr/gi,
      template: r => buildSpan('ua_sogou', 'internet', '搜狗浏览器'),
    },
    {
      reg: /2345Explorer/gi,
      template: r => buildSpan('ua_2345explorer', 'internet', '2345王牌浏览器'),
    },
    {
      reg: /2345chrome/gi,
      template: r => buildSpan('ua_2345chrome', 'internet', '2345加速浏览器'),
    },
    {
      reg: /LBBROWSER/gi,
      template: r => buildSpan('ua_lbbrowser', 'internet', '猎豹安全浏览器'),
    },
    {
      reg: /MicroMessenger\/([^\s]+)/gi,
      template: r =>
        buildSpan('ua_qq', 'wechat', '微信 | ' + getR1(r)[1].split('/')[0]),
    },
    {
      reg: /QQBrowser\/([^\s]+)/gi,
      template: r =>
        buildSpan(
          'ua_qq',
          'internet',
          'QQ浏览器 | ' + getR1(r)[1].split('/')[0]
        ),
    },
    {
      reg: /QQ\/([^\s]+)/gi,
      template: r =>
        buildSpan(
          'ua_qq',
          'internet',
          'QQ浏览器 | ' + getR1(r)[1].split('/')[0]
        ),
    },
    {
      reg: /MiuiBrowser\/([^\s]+)/gi,
      template: r =>
        buildSpan(
          'ua_mi',
          'internet',
          'Miui浏览器 | ' + getR1(r)[1].split('/')[0]
        ),
    },
    {
      reg: /Chrome([\d]*)\/([^\s]+)/gi,
      template: r =>
        buildSpan(
          'ua_chrome',
          'chrome',
          'Chrome | ' + getR1(r)[1].split('.')[0]
        ),
    },
    {
      reg: /safari\/([^\s]+)/gi,
      template: r =>
        buildSpan('ua_apple', 'safari', 'Apple Safari | ' + getR1(r)[1]),
    },
    {
      reg: /Opera[\s|\/]([^\s]+)/gi,
      template: r => buildSpan('ua_opera', 'opera', 'Opera | ' + r[1]),
    },
    {
      reg: /Trident\/7.0/gi,
      template: r => buildSpan('ua_ie', 'edge', 'Internet Explorer 11'),
    },
  ]

  const targetRule = rules.find(rule => {
    const matched = ua.match(rule.reg)
    return !!(matched && matched.length)
  })

  return targetRule
    ? targetRule.template(ua.match(targetRule.reg))
    : defaultRule()
}
/**
 * @file UA 解析器
 */

function matchUa(ua, key) {
  return ua.match(new RegExp(key, 'ig'))
}
// os解析
export function osParser(ua) {
  const defaultRule = () => buildSpan('os_other', 'phone', 'Other')
  const matchWin = () => {
    if (matchUa(ua, 'nt 5.1')) {
      return buildSpan('os_xp', 'windows', 'Windows XP')
    } else if (matchUa(ua, 'nt 6.1')) {
      return buildSpan('os_7', 'windows', 'Windows 7')
    } else if (matchUa(ua, 'nt 6.2')) {
      return buildSpan('os_8', 'windows', 'Windows 8')
    } else if (matchUa(ua, 'nt 6.3')) {
      return buildSpan('os_8_1', 'windows', 'Windows 8.1')
    } else if (matchUa(ua, 'nt 10.0')) {
      return buildSpan('os_8_1', 'windows', 'Windows 10')
    } else if (matchUa(ua, 'nt 6.0')) {
      return buildSpan('os_vista', 'windows', 'Windows Vista')
    } else if (matchUa(ua, 'nt 5')) {
      return buildSpan('os_2000', 'windows', 'Windows 2000')
    } else {
      return buildSpan('os_windows', 'windows', 'Windows')
    }
  }

  const rules = [
    {
      key: 'win',
      template: () => matchWin(),
    },
    {
      key: 'android',
      template: () => buildSpan('os_android', 'android', 'Android'),
    },
    {
      key: 'ubuntu',
      template: () => buildSpan('os_ubuntu', 'ubuntu', 'Ubuntu'),
    },
    {
      key: 'linux',
      template: () => buildSpan('os_linux', 'linux', 'Linux'),
    },
    {
      key: 'iphone',
      template: () => buildSpan('os_mac', 'mac', 'iPhone OS'),
    },
    {
      key: 'mac',
      template: () => buildSpan('os_mac', 'mac', 'Mac OS X'),
    },
    {
      key: 'unix',
      template: () => buildSpan('os_unix', 'unix', 'Unix'),
    },
  ]

  const targetRule = rules.find(rule => {
    const matched = matchUa(ua, rule.key)
    return !!(matched && matched.length)
  })

  return targetRule ? targetRule.template() : defaultRule()
}
