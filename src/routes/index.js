import React from 'react'
import AppLayout from '../layouts/AppLayout'
import Login from './Login'
import PageNotFound from './PageNotFound'


export const createRoutes = store => {
  return {
    basename: '/',
    component: AppLayout,
    childRoutes: [
      {
        redirect: {
          from: '/',
          to: '/home',
          push: false
        }
      },
      {
        redirect: {
          from: '/article',
          to: '/article/all',
          push: false
        }
      },
      {
        path: '/login',
        name: 'Login',
        component: Login,
        exact: true
      },
      {
        name: 'pageNotFound',
        component: PageNotFound
      }
    ]
  }
}

export default createRoutes
