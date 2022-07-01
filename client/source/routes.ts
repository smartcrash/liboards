import { compile } from 'path-to-regexp';

export const routes = {
  index: '/',

  login: '/login',
  signUp: '/signup',
  forgotPwd: '/forgot-password',
  resetPwd: '/reset-password/:token',
  'oauth.callback': '/oauth/callback',

  'projects.list': '/projects',
  'projects.create': '/projects/new',
  'projects.show': '/projects/:slug',
};

export const route = (name: keyof typeof routes, params = {}) => {
  const patter = routes[name];

  try {
    return compile(patter, { validate: false })(params);
  } catch (_) {
    return patter;
  }
};
