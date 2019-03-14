
import { lazy } from 'react';

import AppLayout from '../layouts/AppLayout'

const dashboard = lazy(() => import('./Dashboard'));
const Login = lazy(() => import('./Login'));
const PageNotFound = lazy(() => import('./404'));
const codding = lazy(() => import('./codding'));
const ArticleList = lazy(() => import('./Article/list'));
const ArticleCategory = lazy(() => import('./Article/category'));

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
        path: '/article/list',
        name: 'articleList',
        component: ArticleList,
        exact: true
      },
      {
        path: '/article/category',
        name: 'ArticleCategory',
        component: ArticleCategory,
        exact: true
      },
      {
        name: 'pageNotFound',
        component: PageNotFound
      },
    ]
  }
}

export default createRoutes
