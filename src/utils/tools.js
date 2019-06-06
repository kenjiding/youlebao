/* eslint-disable */
/**
 * 判断接口(api)属性是否存在
 *
 * @export
 * @param {*} condition 属性名称
 * @param {*} msg 错误信息
 */
export function assert(condition, msg) {
  if (condition === undefined) throw new Error(`[Apior] ${msg}`);
}

/**
 * 回到指定容器顶部过渡效果
 *
 * @export
 * @param {*} el  指定容器
 * @param {number} [from=0]
 * @param {*} to
 * @param {number} [duration=500]
 */
export function scrollTop(el, from = 0, to, duration = 500) {
  if (!window.requestAnimationFrame) {
    window.requestAnimationFrame = (
      window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        window.msRequestAnimationFrame ||
        function (callback) {
          return window.setTimeout(callback, 1000 / 60);
        }
    );
  }
  const difference = Math.abs(from - to);
  const step = Math.ceil((difference / duration) * 50);

  function scroll(start, end) {
    if (start === end) return;

    let d = (start + step > end) ? end : start + step;
    if (start > end) {
      d = (start - step < end) ? end : start - step;
    }

    if (el === window) {
      window.scrollTo(d, d);
    } else {
      el.scrollTop = d;
    }
    window.requestAnimationFrame(() => scroll(d, end, step));
  }
  scroll(from, to);
}

/**
 * 加载对应目录下的模块文件
 * @param {Object} require webpack 依赖api reuqire.context的返回
 * @param {*} cb 处理每个引用的回调方法
 */
export function importAll(require, cb) {
  require.keys().forEach((key) => {
    cb(require(key).default, key);
  });
}

/**
 * BufferArray转字符串
 * @param {BufferArray} buf 数据
 */
export function arrayBufferToString(buf) {
  if (!buf) return '';

  const json = buf.toJSON();
  if (!json || !json.data) return '';

  return json.data.toString();
}

export const sleep = timeout => new Promise(resolve => setTimeout(resolve, timeout));
