import { DEFAULT_PATH } from '@/config';
import common from './common';

export default [
  ...common,
  {
    path: '*', // 其他页面，强制跳转到登录页面
    redirect: DEFAULT_PATH,
  },
];
