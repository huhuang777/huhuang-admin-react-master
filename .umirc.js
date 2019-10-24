// https://umijs.org/config/
import { resolve } from 'path'
export default {
  ignoreMomentLocale: true,
  targets: {
    ie: 9,
  },
  hash: true,
  treeShaking: true,
  publicPath: 'https://cdn.huhuang.net/admin/',
  routes: [
    {
      path: '/',
      component: '../layouts/index.js',
      routes: [
        { path: '/', component: './index' },
        { path: '/login', component: './login' },
        { path: '/dashboard', component: './dashboard' },
        { path: '/article/list', component: './article/list' },
        { path: '/article/category', component: './article/category' },
        { path: '/article/edit/:id', component: './article/edit/$id' },
        { path: '/article/post', component: './article/post' },
        { path: '/article/tag', component: './article/tag' },
        { path: '/comment/list', component: './comment/list' },
        { path: '/comment/post', redirect: '/comment/post/0' },
        { path: '/comment/post/:post_id', component: './comment/list' },
        {
          path: '/comment/detail/:comment_id',
          component: './comment/detail',
        },
        { path: '/options', component: './options' },
        { path: '/404', component: './404' },
      ],
    },
  ],
  plugins: [
    [
      // https://umijs.org/plugin/umi-plugin-react.html
      'umi-plugin-react',
      {
        dva: {
          immer: true,
        },
        antd: true,
        dynamicImport: {
          webpackChunkName: true,
          loadingComponent: './components/Loader/Loader',
        },
        routes: {
          exclude: [
            /model\.(j|t)sx?$/,
            /service\.(j|t)sx?$/,
            /models\//,
            /components\//,
            /services\//,
          ],
          update: routes => {
            const newRoutes = []
            for (const item of routes[0].routes) {
              newRoutes.push(item)
              if (item.path) {
                newRoutes.push(
                  Object.assign({}, item, {
                    path: '/${item.path}',
                  })
                )
              }
            }
            routes[0].routes = newRoutes

            return routes
          },
        },
        dll: {
          include: ['dva', 'dva/router', 'dva/saga', 'dva/fetch', 'antd/es'],
        },
        pwa: {
          manifestOptions: {
            srcPath: 'manifest.json',
          },
        },
      },
    ],
  ],
  // Theme for antd
  // https://ant.design/docs/react/customize-theme
  theme: './config/theme.config.js',
  // Webpack Configuration
  proxy: {
    '/api/v1': {
      target: 'http://localhost:8000',
      changeOrigin: true,
      pathRewrite: {
        '^/api/v1/': '',
      },
    },
  },
  alias: {
    api: resolve(__dirname, './src/services/'),
    components: resolve(__dirname, './src/components'),
    config: resolve(__dirname, './src/utils/config'),
    models: resolve(__dirname, './src/models'),
    routes: resolve(__dirname, './src/routes'),
    services: resolve(__dirname, './src/services'),
    themes: resolve(__dirname, './src/themes'),
    utils: resolve(__dirname, './src/utils'),
  },
  extraBabelPresets: ['@lingui/babel-preset-react'],
  extraBabelPlugins: [
    [
      'import',
      {
        libraryName: 'lodash',
        libraryDirectory: '',
        camel2DashComponentName: false,
      },
      'lodash',
    ],
  ],
}
