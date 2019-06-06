export default [
  {
    name: 'game-deduction',
    label: '游乐扣费',
    method: 'SwipingCardDialog',
  },
  {
    name: 'check-ticket',
    label: '验票过闸',
    method: 'CheckTicketDialog',
  },
  {
    name: 'gate-out',
    label: '手工清场',
    method: 'ManualGateOutDialog',
  },
  {
    name: 'cancel-charges',
    label: '取消游乐扣费',
    method: 'CancelOrderDialog',
  },
  {
    name: 'cash-ticket',
    label: '退补现金计时票',
    method: 'CashTimeTicketDialog',
  },
  // {
  //   name: 'order-back',
  //   label: '退单',
  //   method: '',
  // },
  {
    name: 'other-revenue',
    label: '其它收入',
    method: 'OtherRevenueDialog',
  },
  {
    name: 'other-expenses',
    label: '其它支出',
    method: 'OtherExpensesDialog',
  },
  // {
  //   name: 'ticket-query',
  //   label: '套票查询',
  //   method: '',
  // },
  {
    name: 'take-coin',
    label: '提币',
    method: 'GetCoin',
  },
  {
    name: 'for-coin',
    label: '补币',
    method: 'CompensateCoin',
  },
  {
    name: 'save-ticket',
    label: '手动存票',
    method: 'StoreLottery',
  },
  {
    name: 'out-error',
    label: '出币异常处理',
    method: 'OutCoinLog',
  },
  {
    name: 'leaguer-info',
    label: '会员资料修改',
    method: 'EditLeaguerInfo',
  },
  {
    name: 'leaguer-pwd',
    label: '会员密码修改',
    method: 'EditPassword',
  },
  {
    name: 'leaguer-level',
    label: '会员级别变更',
    method: 'LevelChange',
  },
  {
    name: 'sub-card-management',
    label: '主副卡',
    method: 'SubCardManagement',
  },
  {
    name: 'leaguer-lock',
    label: '会员启用/禁用',
    method: 'EnableStateChange',
  },
  {
    name: 'leaguer-join',
    label: '会员入会',
    method: 'JoinMealDialog',
  },
  {
    name: 'leaguer-renewal',
    label: '会员续期',
    method: 'Renewal',
  },
  {
    name: 'leaguer-card-reissue',
    label: '会员补卡',
    method: 'CardChange',
  },
  {
    name: 'stored-value',
    label: '储值过户',
    method: 'TransferAccount',
  },
  {
    name: 'leaguer-logout',
    label: '会员注销',
    method: 'CancelLeaguer',
  },
  {
    name: 'account-lock',
    label: '账户锁定/解锁',
    method: 'LockAccount',
  },
  {
    name: 'goods-currency',
    label: '智能售币',
    method: 'GoodsCurrency',
  },
  {
    name: 'leaguer-roam-dialog',
    label: '会员漫游',
    method: 'LeaguerRoamDialog',
  },
  {
    name: 'lottery-management',
    label: '彩票暂存',
    method: 'LotteryManagement',
  },
];
