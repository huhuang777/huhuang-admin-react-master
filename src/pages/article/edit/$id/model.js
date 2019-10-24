import modelExtend from 'dva-model-extend'
import { pathMatchRegexp } from 'utils'
import api from 'api'
import { model } from 'utils/model'

const {
  getTagList,
  getCategoryList,
  getArticleItem,
  editArticleItem,
  createArticle,
} = api

export default modelExtend(model, {
  namespace: 'articleDetail',

  state: {
    tagList: [],
    article: {
      extends: [{}],
    },
    categoryList: [],
    type: 'post',
  },

  subscriptions: {
    setup({ dispatch, history }) {
      history.listen(location => {
        if (
          pathMatchRegexp('/article/edit/*', location.pathname) ||
          pathMatchRegexp('/article/post', location.pathname)
        ) {
          dispatch({
            type: 'queryTag',
          })
          dispatch({
            type: 'queryCategory',
          })
          dispatch({
            type: 'updateState',
            payload: {
              article: {
                extends: [{}],
              },
            },
          })
        }
        const match = pathMatchRegexp('/article/edit/:id', location.pathname)
        if (match) {
          dispatch({ type: 'updateState', payload: { type: 'edit' } })
          dispatch({ type: 'queryArticle', payload: { id: match[1] } })
        }
      })
    },
  },

  effects: {
    *queryTag({ payload = { page: 1, pageSize: 160 } }, { call, put, select }) {
      const { tagList } = yield select(_ => _.articleDetail)
      if (tagList.length > 0) {
        return
      }
      const { result } = yield call(getTagList, payload)
      if (result) {
        yield put({
          type: 'queryTagSuccess',
          payload: {
            list: result.data,
          },
        })
      }
    },
    *queryArticle({ payload }, { call, put }) {
      const { result } = yield call(getArticleItem, payload)
      if (result) {
        yield put({
          type: 'queryArticleSuccess',
          payload: {
            data: result,
          },
        })
      }
    },
    *postArticle({ payload }, { call, put }) {
      const { result } = yield call(createArticle, payload)
    },
    *editArticle({ payload }, { call, put }) {
      const { result } = yield call(editArticleItem, payload)
    },
    *queryCategory(
      { payload = { page: 1, pageSize: 160 } },
      { call, put, select }
    ) {
      const { categoryList } = yield select(_ => _.articleDetail)
      if (categoryList.length > 0) {
        return
      }
      const { result } = yield call(getCategoryList, payload)
      if (result) {
        yield put({
          type: 'queryCategorySuccess',
          payload: {
            list: result.data,
          },
        })
      }
    },
  },
  reducers: {
    queryTagSuccess(state, { payload }) {
      const { list } = payload
      return {
        ...state,
        tagList: list,
      }
    },
    queryCategorySuccess(state, { payload }) {
      const { list } = payload
      return {
        ...state,
        categoryList: list,
      }
    },
    queryArticleSuccess(state, { payload }) {
      const { data } = payload
      return {
        ...state,
        article: data,
      }
    },
  },
})
