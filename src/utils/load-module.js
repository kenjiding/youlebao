import { importAll } from '@/utils/tools';

export default function (require) {
  const apis = {};
  const consts = {};
  let routes = [];
  let stores = null;
  let menu = null;

  importAll(require, (value, key) => {
    const isApi = key.match(/^\.\/_api\/(\S+)\.js/);
    const isConst = key.match(/^\.\/_const\/(\S+)\.js/);
    if (isApi) {
      apis[isApi[1]] = value;
    } else if (isConst) {
      consts[isConst[1]] = value;
    } else if (/routes\.js$/.test(key)) {
      routes = value;
    } else if (/_store\/index\.js$/.test(key)) {
      stores = value;
    } else if (/menu\.js$/.test(key)) {
      menu = value;
    }
  });

  return {
    apis,
    consts,
    routes,
    stores,
    menu,
  };
}
