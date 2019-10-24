import modelExtend from 'dva-model-extend'
import { pathMatchRegexp } from 'utils'
import api from 'api'
import { model } from 'utils/model'

const { getCommentDetail, editComment } = api

export default modelExtend(model, {
  namespace: 'commentDetail',

  state: {
    comment: {},
  },

  subscriptions: {
    setup({ dispatch, history }) {
      history.listen(location => {
        const match = pathMatchRegexp('/comment/detail/:id', location.pathname)
        if (match) {
          dispatch({ type: 'query', payload: { id: match[1] } })
        }
      })
    },
  },

  effects: {
    *query({ payload }, { call, put, select }) {
      const { result } = yield call(getCommentDetail, payload)
      if (result) {
        yield put({
          type: 'queryCommentSuccess',
          payload: result,
        })
      }
    },
    *edit({ payload }, { call, put, select }) {
      const { result } = yield call(editComment, payload)
      if (result) {
        yield put({
          type: 'updateState',
          payload: {
            comment: {},
          },
        })
      }
    },
  },
  reducers: {
    queryCommentSuccess(state, { payload }) {
      return {
        ...state,
        comment: payload,
      }
    },
  },
})
