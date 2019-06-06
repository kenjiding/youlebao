/* eslint no-shadow: "error" */
/* eslint import/no-extraneous-dependencies: "error" */
import { session } from 'electron';
import dayjs from 'dayjs';

const Cookies = session.defaultSession.cookies;
const host = 'http://localhost';
const cookies = {};

/**
 * @description 存储 cookie 值
 * @param {String} name cookie name
 * @param {String} value cookie value
 * @param {Object} setting cookie setting
 */
cookies.set = (name = 'default', value = '', cookieSetting = {}) => {
  console.log(name);
  const currentCookieSetting = {
    url: host,
    expirationDate: dayjs().add('day', 3).unix(),
  };
  Object.assign(currentCookieSetting, cookieSetting);
  Cookies.set({
    value,
    name,
    ...currentCookieSetting,
  });
};

/**
 * @description 拿到 cookie 值
 * @param {String} name cookie name
 */
// eslint-disable-next-line
cookies.get = (name = 'default') => new Promise((resolve, reject) => {
  Cookies.get({
    name,
  }, (error, resCookies) => {
    console.log(error, resCookies);
    resolve(resCookies);
  });
});

/**
 * @description 拿到 cookie 全部的值
 */
cookies.getAll = () => new Promise((resolve) => {
  Cookies.get({}, (error, resCookies) => resolve(resCookies));
});

/**
 * @description 删除 cookie
 * @param {String} name cookie name
 */
cookies.remove = (name = 'default') => Cookies.remove({
  url: host,
  name,
});

export default cookies;
