import modelExtend from 'dva-model-extend'
import { pathMatchRegexp } from 'utils'
import store from 'store'
import api from 'api'
import { pageModel } from 'utils/model'

const { getOption, editOption, queryUserInfo, editUser } = api

export default modelExtend(pageModel, {
  namespace: 'option',

  state: {
    options: {},
    users: {
      gravatar: '',
    },
  },

  subscriptions: {
    setup({ dispatch, history }) {
      history.listen(location => {
        if (pathMatchRegexp('/options', location.pathname)) {
          dispatch({
            type: 'query',
          })
          dispatch({
            type: 'queryUser',
          })
        }
      })
    },
  },

  effects: {
    *query({ payload = {} }, { call, put, select }) {
      const { result } = yield call(getOption, payload)
      if (result) {
        yield put({
          type: 'queryOptionSuccess',
          payload: {
            result,
          },
        })
      }
    },
    *queryUser({ payload = {} }, { call, put, select }) {
      const { result } = yield call(queryUserInfo)
      if (result) {
        store.set('user', {
          avatar: result.gravatar,
          username: result.name,
        })
        yield put({
          type: 'updateState',
          payload: {
            users: result,
          },
        })
      }
    },
    *edit({ payload }, { call, put }) {
      const data = yield call(editOption, payload)
      if (data.success) {
        yield put({
          type: 'updateState',
          payload: {},
        })
      } else {
        throw data
      }
    },
    *editUser({ payload }, { call, put }) {
      const data = yield call(editUser, payload)
      if (data.success) {
        yield put({
          type: 'updateState',
          payload: {},
        })
      } else {
        throw data
      }
    },
  },
  reducers: {
    queryOptionSuccess(state, { payload }) {
      const { result } = payload
      return {
        ...state,
        options: result,
      }
    },
  },
})
