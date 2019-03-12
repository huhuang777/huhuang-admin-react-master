/**
 * @file 页面边栏菜单组件
 * @module src/routes
 */

export default [{
    path: '/dashboard',
    title: '仪表盘',
    icon: 'home',
    selected: false,
    expanded: false,
    key: 0,
  },
  {
    path: '/announcement',
    title: '公告管理',
    icon: 'icon-sunny',
    selected: false,
    expanded: false,
    key: 1,
  },
  {
    title: '文章管理',
    icon: 'edit',
    key: 2,
    children: [{
        path: '/article/list',
        icon: 'align-left',
        title: '所有文章',
        key: 2.1,
      },
      {
        path: '/article/category',
        icon: 'folder-open',
        title: '分类目录',
        key: 2.2,
      },
      {
        path: '/article/post',
        icon: 'export',
        title: '发布文章',
        key: 2.3,
      },
      {
        path: '/article/tag',
        icon: 'tags',
        title: '文章标签',
        key: 2.4,
      },
    ]
  },
  {
    title: '评论管理',
    icon: 'message',
    key: 4,
    children: [{
        path: '/comment/list',
        title: '所有评论',
        icon: 'icon-list',
        key: 4.1
      },
      {
        path: '/comment/post',
        title: '留言评论',
        icon: 'icon-list',
        key: 4.2
      }
    ]
  },
  {
    path: '/options',
    title: '全局设置',
    icon: 'setting',
    key: 10,
  },
  {
    path: '/linux',
    hideInMenu: true,
    title: 'Aliyun管理',
    icon: 'icon-logo-tux',
    selected: false,
    expanded: false,
    key: 9

  },
  {
    title: 'Google Analytics',
    path: 'https://analytics.google.com',
    icon: 'google',
    key: 800,
    target: '_blank'
  },
  {
    title: 'Github',
    path: 'https://github.com/huhuang777',
    icon: 'github',
    key: 900,
    target: '_blank'
  }
];