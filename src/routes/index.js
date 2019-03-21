
import { lazy } from 'react';

import AppLayout from '../layouts/AppLayout'
import dashboard from './Dashboard'
import Login from './Login'
import PageNotFound from './404'
import codding from './codding'
import ArticleList from './Article/list'
import ArticleCategory from './Article/category'
import ArticleEditComponent from './Article/edit'

// const dashboard = require('./Dashboard');
// const Login = require('./Login');
// const PageNotFound = require('./404');
// const codding = require('./codding');
// const ArticleList = require('./Article/list');
// const ArticleCategory = require('./Article/category');
// const ArticleEditComponent =require('./Article/edit');

export const createRoutes = store => {
  return {
    basename: '/',
    component: AppLayout,
    childRoutes: [
      {
        path: '/login',
        name: 'Login',
        component: Login,
        exact: true,
        noLogin:true
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
        path: '/article/post',
        component: ArticleEditComponent
      },
      {
        path: '/article/edit/:article_id',
        component: ArticleEditComponent
      },
      {
        name: 'pageNotFound',
        component: PageNotFound
      },
    ]
  }
}

export default createRoutes
