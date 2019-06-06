import { NODE_ENV } from '@/config';

const modules = [];

function requireAll(context) {
  context.keys().forEach((path) => {
    if (path === './index.js' || (NODE_ENV === 'production' && path.indexOf('goods-demo/') >= 0)) return;

    const moduleName = path.match(/\.\/(\S+)\/index\.js$/)[1];
    const serviceData = {
      ...context(path).default,
      moduleName,
    };
    modules.push(serviceData);
  });
}

requireAll(require.context('./', true, /index\.js$/));

export default modules;
