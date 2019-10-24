export default {
  loginUser: 'POST /auth', //用户登录
  queryUserInfo: '/auth',
  editUser: 'PUT /auth',
  queryStatistic: '/statistic',
  getArticleList: '/article',
  createArticle: 'POST /article',
  batchArticleUpdate: 'PATCH /article',
  batcArticlehDelete: 'DELETE /article',
  getArticleItem: '/article/:id',
  editArticleItem: 'PUT /article/:_id',
  deleteArticleItem: 'DELETE /article/:_id',
  changeArticleItemState: 'patch /article/:_id',
  getTagList: '/tag',
  createTag: 'POST /tag',
  editTagItem: 'PUT /tag/:_id',
  batcTagDelete: 'DELETE /tag',
  getCategoryList: '/category',
  editCategoryItem: 'PUT /category/:_id',
  deleteCategoryItem: 'DELETE /category/:_id',
  batcCategoryDelete: 'DELETE /category',
  createCategory: 'POST /category',
  getQiniuConfig: '/qiniu',
  getGoogleConfig: '/google',
  getCommentList: '/comment',
  patchCommentUpdate: 'PATCH /comment',
  patchCommentDelete: 'DELETE /comment',
  getCommentDetail: '/comment/:id',
  editComment: 'PUT /comment/:_id',
  getOption: '/option',
  editOption: 'PUT /option',
}
