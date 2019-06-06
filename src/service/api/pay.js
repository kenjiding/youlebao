export default [{
  name: 'getPayTypeList',
  method: 'POST',
  desc: '获取支付方式列表',
  path: '/ProfessionalCash/api/v1.0/Pay/GetPayTypeList',
  mockPath: '/ProfessionalCash/api/v1.0/Pay/GetPayTypeList',
  params: {
    OrderID: false, // typeName: Guid  desc: 订单ID
  },
}, {
  name: 'getPayResult',
  method: 'POST',
  desc: '获取支付结果',
  path: '/ProfessionalCash/api/v1.0/Pay/GetPayResult',
  mockPath: '/ProfessionalCash/api/v1.0/Pay/GetPayResult',
  params: {
    PayLogID: true, // typeName: Guid  desc: 支付单ID
  },
}, {
  name: 'cancelPay',
  method: 'POST',
  desc: '取消支付',
  path: '/ProfessionalCash/api/v1.0/Pay/CancelPay',
  mockPath: '/ProfessionalCash/api/v1.0/Pay/CancelPay',
  params: {
    PayLogID: true, // typeName: Guid  desc: 支付单ID
  },
}, {
  name: 'payForOrder',
  method: 'POST',
  desc: '支付订单',
  path: '/ProfessionalCash/api/v1.0/Pay/PayForOrder',
  mockPath: '/ProfessionalCash/api/v1.0/Pay/PayForOrder',
  params: {
    OrderID: true, // typeName: Guid  desc: 订单ID
    PayTypeID: true, // typeName: Guid  desc: 支付类型ID(微信支付宝刷卡支付传空)
    Money: true, // typeName: Number  desc: 金额
    Summary: false, // typeName: String  desc: 备注（微信支付宝为授权码）
    PayKind: true, // typeName: String  desc: 支付类型（微信支付宝刷卡支付传Scan）
    LeaguerID: false, // typeName: Guid  desc: 会员ID
    Password: false, // typeName: String  desc: 密码
  },
}, {
  name: 'getGuiderFuzzyList',
  method: 'POST',
  desc: '搜索导购员',
  path: '/ProfessionalCash/api/v1.0/ShoppingGuide/GetGuiderFuzzyList',
  mockPath: '/ProfessionalCash/api/v1.0/ShoppingGuide/GetGuiderFuzzyList',
  params: {
    LikeStr: false, // typeName: String  desc: 名字或编号的模糊关键字
  },
}, {
  name: 'addOrderGuiderFuzzy',
  method: 'POST',
  desc: '订单增加导购员',
  path: '/ProfessionalCash/api/v1.0/ShoppingGuide/AddOrderGuiderFuzzy',
  mockPath: '/ProfessionalCash/api/v1.0/ShoppingGuide/AddOrderGuiderFuzzy',
  params: {
    OrderID: true, // typeName: Guid  desc: 订单ID
    GuiderCode: true, // typeName: String  desc: 导购员编号
  },
}];
