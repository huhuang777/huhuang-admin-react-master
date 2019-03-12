//import React from 'react'
import AppLayout from '../layouts/AppLayout'
import Login from './Login'
import PageNotFound from './404'
import dashboard from './Dashboard'
import codding from './codding'


export const createRoutes = store => {
  return {
    basename: '/',
    component: AppLayout,
    childRoutes: [
      {
        path: '/login',
        name: 'Login',
        component: Login,
        exact: true
      },
      {
        redirect: {
          from: '/',
          to: '/dashboard',
          exact: true,
          push: false
        }
      },
      {
        path: '/dashboard',
        name: 'dashboard',
        component: dashboard,
        exact: true
      },
      {
        path: '/announcement',
        name: 'announcement',
        component: codding
      },
      {
        name: 'pageNotFound',
        component: PageNotFound
      },
    ]
  }
}

export default createRoutes
