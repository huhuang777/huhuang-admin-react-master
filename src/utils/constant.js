export const ROLE_TYPE = {
  ADMIN: 'admin',
  DEFAULT: 'admin',
  DEVELOPER: 'developer',
}

export const TOKEN = 'id_token'

export const TOKEN_HEADER = 'Authorization'

export const CANCEL_REQUEST_MESSAGE = 'cancel request'

export const AUTH = '/auth'

export const OPTION = '/option'

export const QINIU = '/qiniu'

export const ANNOUNCEMENT = '/announcement'

export const CATEGORY = '/category'

export const ARTICLE = '/article'

export const COMMENT = '/comment'

export const TAG = '/tag'

// 返回正常但业务错误
export const HTTP_SUCCESS = 200

// 无权限
export const NO_PERMISSION = 403

// 未授权
export const UNAUTHORIZED = 401

// 服务器挂了
export const SERVER_ERROR = 500

// 请求超时
export const GATEWAY_TIMEOUT = 504

// 未知
export const UNKNOWN_ERROR = 0

// 退出
export const ESC = 27

// F5
export const F5 = 122

// S
export const S = 83

// 发布状态
export const PublishState = {
  all: 'all',
  draft: 0, // 草稿
  published: 1, // 已发布
  recycle: -1, // 回收站
}

// 公开状态
export const PublicState = {
  all: 'all',
  password: 0, // 需要密码
  public: 1, // 公开状态
  secret: -1, // 私密
}

// 转载状态
export const OriginState = {
  all: 'all',
  original: 0, // 原创
  reprint: 1, // 转载
  hybrid: -1, // 混合
}

export const CommentState = {
  all: 'all',
  auditing: 0, // 待审核
  published: 1, // 通过正常
  deleted: -1, // 已删除
  spam: -2, // 垃圾评论
}

// 评论宿主页面的 POST_ID 类型
export const CommentPostType = {
  guestbook: 0, // 留言板
}

// 评论本身的类型
export const CommentParentType = {
  self: 0, // 自身一级评论
}

// 排序状态
export const SortType = {
  desc: -1, // 降序
  asc: 1, // 升序
  hot: 2, // 最热
}

// 喜欢类型
export const LikeType = {
  comment: 1,
  page: 2,
}

// 退出
export const KEYCODE = {
  ESC: 27,
  F5: 122,
  S: 83,
}
