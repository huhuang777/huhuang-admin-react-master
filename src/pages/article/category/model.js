import modelExtend from 'dva-model-extend'
import { pathMatchRegexp } from 'utils'
import api from 'api'
import { pageModel } from 'utils/model'

const {
  getCategoryList,
  editCategoryItem,
  batcCategoryDelete,
  createCategory,
} = api

export default modelExtend(pageModel, {
  namespace: 'categoryList',

  state: {
    currentItem: {
      name: '',
      description: '',
      slug: '',
      extends: [{ name: 'icon', value: 'icon-category' }],
    },
    searchText: '',
    selectedRowKeys: [],
  },

  subscriptions: {
    setup({ dispatch, history }) {
      history.listen(location => {
        if (pathMatchRegexp('/article/category', location.pathname)) {
          dispatch({
            type: 'query',
          })
        }
      })
    },
  },

  effects: {
    *query({ payload = {} }, { call, put, select }) {
      const { result } = yield call(getCategoryList, payload)
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
    *delete({ payload }, { call, put, select }) {
      const data = yield call(batcCategoryDelete, { categories: payload })
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
    *edit({ payload }, { call, put }) {
      const data = yield call(editCategoryItem, payload)
      if (data.success) {
        yield put({
          type: 'updateState',
          payload: {
            currentItem: {
              name: '',
              description: '',
              slug: '',
              extends: [{ name: 'icon', value: 'icon-category' }],
            },
          },
        })
      } else {
        throw data
      }
    },
    *post({ payload }, { call, put }) {
      const data = yield call(createCategory, payload)
      if (data.success) {
        yield put({
          type: 'updateState',
          payload: {
            currentItem: {
              name: '',
              description: '',
              slug: '',
              extends: [{ name: 'icon', value: 'icon-category' }],
            },
          },
        })
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
        list,
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
