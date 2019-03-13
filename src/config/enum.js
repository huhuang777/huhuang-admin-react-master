// 发布状态
export const PublishState = {
    all: 'all',
    draft: 0, // 草稿
    published: 1, // 已发布
    recycle: -1 // 回收站
}

// 公开状态
export const PublicState = {
    all: 'all',
    password: 0, // 需要密码
    public: 1, // 公开状态
    secret: -1 // 私密
}

// 转载状态
export const OriginState = {
    all: 'all',
    original: 0, // 原创
    reprint: 1, // 转载
    hybrid: -1 // 混合
}

export const CommentState = {
    all: 'all',
    auditing: 0, // 待审核
    published: 1, // 通过正常
    deleted: -1, // 已删除
    spam: -2 // 垃圾评论
}

// 评论宿主页面的 POST_ID 类型
export const CommentPostType = {
    guestbook: 0 // 留言板
}

// 评论本身的类型
export const CommentParentType = {
    self: 0 // 自身一级评论
}

// 排序状态
export const SortType = {
    desc: -1, // 降序
    asc: 1, // 升序
    hot: 2 // 最热
}

// 喜欢类型
export const LikeType = {
    comment: 1,
    page: 2
}