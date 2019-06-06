import _pick from 'lodash/pick';
import _assign from 'lodash/assign';
// import _isEmpty from 'lodash/isEmpty';
// eslint-disable-next-line
import { remote } from 'electron';

import { assert } from '@/utils/tools';
import { API_DEFAULT_CONFIG, NODE_ENV } from '@/config';
import API_CONFIG from '@/service/api';
import axios from './axios';

function normoalize(options, data) {
  const localOpt = Object.assign({}, options);
  if (localOpt.method === 'POST') {
    localOpt.data = data;
  } else if (localOpt.method === 'GET') {
    localOpt.params = data;
  }
  return localOpt;
}

class MakeApi {
  constructor(options) {
    this.api = {};
    this.options = options;
    this.apiBuilder();
  }

  apiBuilder(localOpt = {}) {
    const {
      // 只有在模块注入的api才有moduleName属性
      moduleName = null,
      sep = '/',
      config = {},
      mock = false,
      debug = false,
      mockBaseURL = '',
    } = { ...this.options, ...localOpt };

    Object.keys(config).map(namespace => this.apiSingleBuilder({
      namespace: moduleName ? [moduleName, namespace].join(sep) : namespace,
      mock,
      mockBaseURL,
      sep,
      debug,
      config: config[namespace],
    }));
  }

  apiSingleBuilder(args) {
    const {
      namespace,
      sep = '/',
      config = {},
      mock = false,
      debug = false,
      mockBaseURL = '',
    } = args;
    config.forEach((api) => {
      const {
        name, desc, params, method, path, mockPath,
      } = api;

      const apiname = `${namespace}${sep}${name}`;
      const url = mock ? mockPath : path;
      const baseURL = mock ? mockBaseURL : remote.getGlobal('electronStore').get('host');

      if (debug) {
        // console.info(`调用服务层接口${apiname}，接口描述为${desc}`);
        assert(!this.api[apiname], `"${apiname}"接口已存在`);
        assert(name, `${url} :接口name属性不能为空`);
        assert(url.indexOf('/') === 0, `${url} :接口路径path，首字符应为/`);
      }

      if (!this.api[apiname]) {
        Object.defineProperty(
          this.api,
          apiname,
          {
            value(outerParams, outerOptions) {
              const paramsKeys = Object.keys(params);

              const _data = _pick(outerParams, paramsKeys);
              // const _data = _isEmpty(outerParams) ? params : pickData;

              if (NODE_ENV !== 'production') {
                paramsKeys.forEach((key) => {
                  if (params[key] === true && _data[key] === undefined) {
                    assert(_data[key], `参数 ${key} 为必传`);
                  }
                });
              }

              return axios(normoalize(_assign({
                url,
                desc,
                baseURL,
                method,
              }, outerOptions), _data));
            },
          },
        );
      }
    });
  }
}

export default new MakeApi({
  config: API_CONFIG,
  ...API_DEFAULT_CONFIG,
});

