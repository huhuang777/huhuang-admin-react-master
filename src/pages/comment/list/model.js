import modelExtend from 'dva-model-extend'
import { pathMatchRegexp } from 'utils'
import api from 'api'
import { pageModel } from 'utils/model'

const { getCommentList, patchCommentUpdate, patchCommentDelete } = api

export default modelExtend(pageModel, {
  namespace: 'commentList',

  state: {
    currentItem: {},
    selectedRowKeys: [],
  },

  subscriptions: {
    setup({ dispatch, history }) {
      history.listen(location => {
        const match = pathMatchRegexp(
          '/comment/post/:post_id',
          location.pathname
        )
        let payload = {
          page: 1,
          pageSize: 10,
          ...location.query,
        }
        if (match) {
          dispatch({
            type: 'updateState',
            payload: { list: [], selectedRowKeys: [] },
          })
          dispatch({
            type: 'query',
            payload: { ...payload, post_id: match[1] },
          })
        }
        if (pathMatchRegexp('/comment/list', location.pathname)) {
          dispatch({
            type: 'updateState',
            payload: { list: [], selectedRowKeys: [] },
          })
          dispatch({
            type: 'query',
            payload,
          })
        }
      })
    },
  },

  effects: {
    *query({ payload }, { call, put, select }) {
      const { result } = yield call(getCommentList, payload)
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
      const data = yield call(patchCommentDelete, payload)
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
    *patchComments({ payload }, { call, put }) {
      const data = yield call(patchCommentUpdate, payload)
      if (data.success) {
        yield put({ type: 'updateState', payload: { selectedRowKeys: [] } })
      } else {
        throw data
      }
    },
  },
  reducers: {
    queryCache(state, { payload }) {
      const { lastQuery } = payload
      return {
        ...state,
        lastQuery,
      }
    },
  },
})
