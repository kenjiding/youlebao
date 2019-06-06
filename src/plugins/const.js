import { CONST_DEFAULT_CONFIG } from '@/config';
import CONST_CONFIG from '@/service/const';

class MakeConst {
  constructor(options) {
    this.const = {};
    this.constBuilder(options);
  }

  constBuilder({
    sep = '/',
    config = {},
  }) {
    Object.keys(config).map(namespace => this._constSingleBuilder({
      namespace,
      sep,
      config: config[namespace],
    }));
  }

  _constSingleBuilder({
    namespace,
    sep = '/',
    config = {},
  }) {
    config.forEach((cst) => {
      const { name, value } = cst;
      const constName = `${namespace.toUpperCase()}${sep}${name}`;
      Object.defineProperty(this.const, constName, { value });
    });
  }
}

export default new MakeConst({
  config: CONST_CONFIG,
  ...CONST_DEFAULT_CONFIG,
}).const;
