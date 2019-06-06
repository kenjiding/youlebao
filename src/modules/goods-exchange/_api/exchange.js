export default [{
  name: 'exchangeQuery',
  method: 'POST',
  desc: '兑换查询',
  path: '/ProfessionalCash/api/v1.0/Exchange/ExchangeQuery',
  mockPath: '/ProfessionalCash/api/v1.0/Exchange/ExchangeQuery',
  params: {
    OperateTerminal: false, // typeName: String  desc: 操作终端
    StartDate: false, // typeName: String  desc: 记录日期（开始）
    EndDate: false, // typeName: String  desc: 记录日期（结束）
    LeaguerID: false, // typeName: Guid  desc: 会员ID
    ChannelID: false, // typeName: Guid  desc: 兑换渠道
    ExchangeType: false, // typeName: Int  desc: 兑换类型
    PageInfo: true, // typeName: PageInfo  desc:
    DateRange: false, // typeName: DateRange  desc: 日期范围
    Condition: false, // typeName: String  desc: 搜索条件
  },
}, {
  name: 'returnOrder',
  method: 'POST',
  desc: '退兑换单',
  path: '/ProfessionalCash/api/v1.0/Exchange/ReturnOrder',
  mockPath: '/ProfessionalCash/api/v1.0/Exchange/ReturnOrder',
  params: {
    ExchangeLogID: true, // typeName: String  desc: 兑换单记录ID
  },
}, {
  name: 'getExchangeGoodsByExchangeType',
  method: 'POST',
  desc: '根据彩票、积分、代币、金币 获取相应的可兑换商品',
  path: '/ProfessionalCash/api/v1.0/Exchange/GetExchangeGoodsByExchangeType',
  mockPath: '/ProfessionalCash/api/v1.0/Exchange/GetExchangeGoodsByExchangeType',
  params: {
    LgLevelID: true, // typeName: Guid  desc: 会员级别
    ExchangeType: true, // typeName: Int  desc: 兑换类型（3：积分、401：金币、402：代币、403：彩票）
    Value: true, // typeName: String  desc: 条码、商品名称、商品兑换价
  },
}, {
  name: 'exchangeGoods',
  method: 'POST',
  desc: '兑换商品',
  path: '/ProfessionalCash/api/v1.0/Exchange/ExchangeGoods',
  mockPath: '/ProfessionalCash/api/v1.0/Exchange/ExchangeGoods',
  params: {
    LeaguerID: true, // typeName: Guid  desc: 会员ID
    ExchangeValueType: true, // typeName: Int  desc: 兑换类型（3：积分、401：金币、402：代币、403：彩票）
    GoodsList: true, // typeName:   desc: 兑换商品
  },
}, {
  name: 'getExchangeOrderTicket',
  method: 'POST',
  desc: '获取兑换小票',
  path: '/ProfessionalCash/api/v1.0/Exchange/GetExchangeOrderTicket',
  mockPath: '/ProfessionalCash/api/v1.0/Exchange/GetExchangeOrderTicket',
  params: {
    ExchangeOrderID: true, // typeName: Guid  desc: 兑换单ID
    RePrint: false, // typeName: Boolean  desc: 是否重打，默认false
  },
}, {
  name: 'rePrintExchangeOrderTicket',
  method: 'POST',
  desc: '重打兑换小票接口',
  path: '/ProfessionalCash/api/v1.0/Exchange/RePrintExchangeOrderTicket',
  mockPath: '/ProfessionalCash/api/v1.0/Exchange/RePrintExchangeOrderTicket',
  params: {
    ExchangeOrderID: true, // typeName: Guid  desc: 兑换单ID
    RePrint: false, // typeName: Boolean  desc: 是否重打，默认false
  },
}, {
  name: 'sendAndReceive',
  method: 'POST',
  desc: '兑换发货并收货（自取）',
  path: '/ProfessionalCash/api/v1.0/Exchange/SendAndReceive',
  mockPath: '/ProfessionalCash/api/v1.0/Exchange/SendAndReceive',
  params: {
    ExchangeLogID: true, // typeName: Guid  desc: 兑换单ID
  },
}, {
  name: 'getLogDetail',
  method: 'POST',
  desc: '获取兑换详情',
  path: '/ProfessionalCash/api/v1.0/Exchange/GetLogDetail',
  mockPath: '/ProfessionalCash/api/v1.0/Exchange/GetLogDetail',
  params: {
    ExchangeLogID: true, // typeName: Guid  desc: 兑换记录ID
  },
}, {
  name: 'checkExchangeGoods',
  method: 'POST',
  desc: '检验兑换商品及计算价格',
  path: '/ProfessionalCash/api/v1.0/Exchange/CheckExchangeGoods',
  mockPath: '/ProfessionalCash/api/v1.0/Exchange/CheckExchangeGoods',
  params: {
    LeaguerID: true, // typeName: Guid  desc: 会员ID
    GoodsList: true, // typeName:   desc: 兑换商品
    ExchangeValueType: true, // typeName: Int  desc: 兑换类型（3：积分、401：金币、402：代币、403：彩票）
  },
}, {
  name: 'cancelOrder',
  method: 'POST',
  desc: '取消兑换单',
  path: '/ProfessionalCash/api/v1.0/Exchange/CancelOrder',
  mockPath: '/ProfessionalCash/api/v1.0/Exchange/CancelOrder',
  params: {
    ExchangeLogID: true, // typeName: Guid  desc: 兑换单ID
  },
}, {
  name: 'getExChangeLogListForPro',
  method: 'POST',
  desc: '会员兑换记录查询',
  path: '/ProfessionalCash/api/v1.0/Exchange/GetExChangeLogListForPro',
  mockPath: '/ProfessionalCash/api/v1.0/Exchange/GetExChangeLogListForPro',
  params: {
    LeaguerID: true, // typeName: Guid  desc: 会员ID
    PageInfo: true, // typeName: PageInfo  desc:
  },
}, {
  name: 'getExchangeGoodsListByExchangeType',
  method: 'POST',
  desc: '获取兑换商品（根据兑换价）',
  path: '/ProfessionalCash/api/v1.0/Exchange/GetExchangeGoodsListByExchangeType',
  mockPath: '/ProfessionalCash/api/v1.0/Exchange/GetExchangeGoodsListByExchangeType',
  params: {
    LgLevelID: true, // typeName: Guid  desc: 会员级别ID
    ExchangeType: true, // typeName: Int  desc: 兑换类型
    MinPrice: true, // typeName: Int  desc: 最小值
    MaxPrice: false, // typeName: Int  desc: 最大值
    PageInfo: true, // typeName: PageInfo  desc: 分页信息
  },
}];
