import { TOKEN } from './constant'
import store from 'store'
import config from 'config'
const BLOG_HOST = config.BLOG_HOST

// 检查 token 的存在和有效性
export const checkTokenIsOk = () => {
  const token = store.get(TOKEN)
  const tokenIsOk = token && token.split('.').length === 3
  return tokenIsOk
}

// 权限页面
export const isAuthPage = url => {
  return url && url === '/auth'
}

// 首页
export const isIndexPage = url => {
  return url && url === '/'
}

// 仪表盘
export const isDashboardPage = url => {
  return url && url === '/dashboard'
}

// 发布文章页面
export const isPostArticlePage = url => {
  return url && url === '/article/post'
}

// 公告页面
export const isAnnouncementPage = url => {
  return url && url === '/announcement'
}
// 评论宿主页面的 POST_ID 类型
export const ECommentPostType = {
  Guestbook: 0, // 留言板
}
// 判断是留言板
export const isGuestbook = postId => {
  return Number(postId) === Number(ECommentPostType.Guestbook)
}

export function getTagPath(tagSlug) {
  return `${BLOG_HOST}/tag/${tagSlug}`
}

export function getCategoryPath(categorySlug) {
  return `${BLOG_HOST}/category/${categorySlug}`
}

export function getArticlePath(articleId) {
  return `${BLOG_HOST}/article/${articleId}`
}

export function getGuestbookPath() {
  return `${BLOG_HOST}/guestbook`
}
