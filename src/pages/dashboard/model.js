import { parse } from 'qs'
import modelExtend from 'dva-model-extend'
import api from 'api'
import { pathMatchRegexp } from 'utils'
import { model } from 'utils/model'

const { queryStatistic, getGoogleConfig } = api

export default modelExtend(model, {
  namespace: 'dashboard',
  state: {
    number: {},
    recentSales: [],
    comments: [],
    googleToken: '',
    isLoadingGa: false,
  },
  subscriptions: {
    setup({ dispatch, history }) {
      history.listen(({ pathname }) => {
        if (
          pathMatchRegexp('/dashboard', pathname) ||
          pathMatchRegexp('/', pathname)
        ) {
          dispatch({ type: 'query' })
        }
      })
    },
  },
  effects: {
    *query({ payload }, { call, put, select }) {
      const { result } = yield call(queryStatistic, parse(payload))
      const { googleToken } = yield select(_ => _.dashboard)
      yield put({
        type: 'updateState',
        payload: {
          number: result,
        },
      })
      if (!googleToken) {
        const { result } = yield call(getGoogleConfig)
        const { access_token = '' } = result
        yield put({
          type: 'updateState',
          payload: {
            googleToken: access_token,
          },
        })
      }
    },
  },
})
