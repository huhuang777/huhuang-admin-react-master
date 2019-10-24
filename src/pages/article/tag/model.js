import modelExtend from 'dva-model-extend'
import { pathMatchRegexp } from 'utils'
import api from 'api'
import { pageModel } from 'utils/model'

const { getTagList, editTagItem, batcTagDelete, createTag } = api

export default modelExtend(pageModel, {
  namespace: 'tagsList',

  state: {
    currentItem: {
      name: '',
      description: '',
      slug: '',
      extends: [{ name: 'icon', value: 'icon-tag' }],
    },
    searchText: '',
    selectedRowKeys: [],
  },

  subscriptions: {
    setup({ dispatch, history }) {
      history.listen(location => {
        if (pathMatchRegexp('/article/tag', location.pathname)) {
          dispatch({
            type: 'query',
          })
        }
      })
    },
  },

  effects: {
    *query({ payload = {} }, { call, put, select }) {
      const { result } = yield call(getTagList, payload)
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
      const data = yield call(batcTagDelete, { tags: payload })
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
      const data = yield call(editTagItem, payload)
      if (data.success) {
        yield put({
          type: 'updateState',
          payload: {
            currentItem: {
              name: '',
              description: '',
              slug: '',
              extends: [{ name: 'icon', value: 'icon-tag' }],
            },
          },
        })
      } else {
        throw data
      }
    },
    *post({ payload }, { call, put }) {
      const data = yield call(createTag, payload)
      if (data.success) {
        yield put({
          type: 'updateState',
          payload: {
            currentItem: {
              name: '',
              description: '',
              slug: '',
              extends: [{ name: 'icon', value: 'icon-tag' }],
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
