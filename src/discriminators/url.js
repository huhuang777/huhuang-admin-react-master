

// 权限页面
export const isAuthPage = url => {
  return url && url === '/auth';
};

// 首页
export const isIndexPage = url => {
  return url && url === '/';
};

// 仪表盘
export const isDashboardPage = url => {
  return url && url === '/dashboard';
};

// 发布文章页面
export const isPostArticlePage = url => {
  return url && url === '/article/post';
};

// 公告页面
export const isAnnouncementPage = url => {
  return url && url === '/announcement';
};
