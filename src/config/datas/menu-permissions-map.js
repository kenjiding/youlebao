import { invert } from 'lodash';

export const sourceData = {
  /* 商品
  ----------------------*/
  // 售卖
  200001100: {
    action: '/sell',
    name: '售卖',
  },
  // 兑换
  200001200: {
    action: '/goods-exchange',
    name: '兑换',
  },
  // 团购验券
  200001300: {
    action: '/goods-group-buy',
    name: '团购验券',
  },
  // 活动赠送
  200001400: {
    action: '/goods-activity-gift',
    name: '活动赠送',
  },
  // 智能售币
  200001500: {
    action: '/goods-currency',
    name: '智能售币',
  },

  /* 会员
  ----------------------*/
  // 会员入会
  201001100: {
    action: '/join',
    name: '会员入会',
  },
  // 会员查询
  201001200: {
    action: '/leaguer',
    name: '会员查询',
  },
  // 会员漫游
  201001300: {
    action: '/leaguer-roam',
    name: '会员漫游',
  },

  /* 游乐
  ----------------------*/
  // 游乐扣费
  202001100: {
    action: '/swiping-card',
    name: '游乐扣费',
  },
  // 验票过闸
  202001200: {
    action: '/check-ticket',
    name: '验票过闸',
  },
  // 取消游乐扣费
  202001300: {
    action: '/cancel-order',
    name: '取消游乐扣费',
  },
  // 手工清场
  202001400: {
    action: '/manual-gate-out',
    name: '手工清场',
  },

  /* 订单
  ----------------------*/
  // 订单查询
  203001100: {
    action: '/order',
    name: '订单查询',
  },
  // 兑换查询
  203001200: {
    action: '/exchange-query',
    name: '兑换查询',
  },

  /* 套票
  ----------------------*/
  // 套票查询
  204001100: {
    action: '/ticket',
    name: '套票查询',
  },

  /* 交账
  ----------------------*/
  // 交班
  205001100: {
    action: '/hand-over',
    name: '交班',
  },
  // 其他收入
  205001200: {
    action: '/other-revenue',
    name: '其他收入',
  },
  // 其他支出
  205001300: {
    action: '/other-expenses',
    name: '其他支出',
  },

  /* 更多
  ----------------------*/
  // 通用设置
  206001101: {
    action: 'general-setting',
    name: '通用设置',
  },
  // 打印设置
  206001201: {
    action: 'printer-setting',
    name: '打印设置',
  },
  // 收银台初始化
  206001301: {
    action: 'cashier-init',
    name: '收银台初始化',
  },
  // 彩票暂存
  206001401: {
    action: 'lottery-staging',
    name: '彩票暂存',
  },
  // 出币异常处理
  206001501: {
    action: 'outcoin-error',
    name: '出币异常处理',
  },
  // 加币清币
  206001601: {
    action: 'add-clear-coin',
    name: '加币清币',
  },

  // 选择账期
  90000007: {
    action: 'select-period',
    name: '选择登录账期',
  },
};

export const keyByCode = (() => {
  const filtered = {};
  Object.keys(sourceData).forEach((key) => {
    filtered[key] = sourceData[key].action;
  });
  return filtered;
})();

export const keyByName = invert(keyByCode);
