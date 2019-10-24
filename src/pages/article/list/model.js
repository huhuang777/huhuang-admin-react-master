import modelExtend from 'dva-model-extend'
import { pathMatchRegexp } from 'utils'
import api from 'api'
import { pageModel } from 'utils/model'

const {
  getArticleList,
  getTagList,
  getCategoryList,
  batchArticleUpdate,
  batcArticlehDelete,
} = api

export default modelExtend(pageModel, {
  namespace: 'articleList',

  state: {
    currentItem: {},
    modalVisible: false,
    tagList: [],
    categoryList: [],
    modalType: 'create',
    selectedRowKeys: [],
    lastQuery: {},
  },

  subscriptions: {
    setup({ dispatch, history }) {
      history.listen(location => {
        if (pathMatchRegexp('/article/list', location.pathname)) {
          const payload = {
            page: 1,
            pageSize: 10,
            ...location.query,
          }
          dispatch({
            type: 'query',
            payload,
          })
          dispatch({
            type: 'queryTag',
          })
          dispatch({
            type: 'queryCategory',
          })
        }
      })
    },
  },

  effects: {
    *query({ payload = {} }, { call, put, select }) {
      const { result } = yield call(getArticleList, payload)
      if (result) {
        yield put({
          type: 'querySuccess',
          payload: {
            list: result.data,
            pagination: {
              current: Number(payload.page) || 1,
              pageSize: Number(payload.pageSize) || 10,
              total: result.pagination.total,
            },
          },
        })
      }
    },
    *queryTag({ payload = { page: 1, pageSize: 160 } }, { call, put, select }) {
      const { tagList } = yield select(_ => _.articleList)
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
    *queryCategory(
      { payload = { page: 1, pageSize: 160 } },
      { call, put, select }
    ) {
      const { categoryList } = yield select(_ => _.articleList)
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
    *delete({ payload }, { call, put, select }) {
      const data = yield call(batcArticlehDelete, { id: payload })
      if (data.success) {
        yield put({
          type: 'updateState',
          payload: {
            selectedRowKeys: [],
          },
        })
      } else {
        throw data
      }
    },
    *patchArticles({ payload }, { call, put }) {
      const data = yield call(batchArticleUpdate, payload)
      if (data.success) {
        yield put({ type: 'updateState', payload: { selectedRowKeys: [] } })
      } else {
        throw data
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
    queryCache(state, { payload }) {
      const { lastQuery } = payload
      return {
        ...state,
        lastQuery,
      }
    },
  },
})
