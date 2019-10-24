module.exports = {
  siteName: 'HuHuang.net',
  copyright: 'HuHuang.net  ©2019 huhuang',
  logoPath: '/logo.svg',
  apiPrefix: 'https://api.huhuang.net',
  // apiPrefix: '/api/v1',
  iconfontUrl: '//at.alicdn.com/t/font_789538_ow90c6rv1xd.js',
  staticUrl: 'https://static.huhuang.net',
  BLOG_HOST: 'https://huhuang.net',
  fixedHeader: true, // sticky primary layout header

  /* Layout configuration, specify which layout to use for route. */
  layouts: [
    {
      name: 'primary',
      include: [/.*/],
      exclude: [/login/],
    },
  ],
}
