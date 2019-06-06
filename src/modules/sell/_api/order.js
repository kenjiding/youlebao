export default [{
  name: 'createOrder',
  method: 'POST',
  desc: '创建订单',
  path: '/ProfessionalCash/api/v1.0/Order/CreateOrder',
  mockPath: '/ProfessionalCash/api/v1.0/Order/CreateOrder',
  params: {
    GoodsData: true, // typeName:   desc: 商品列表
    LeaguerID: false, // typeName: Guid  desc: 会员id
    CouponNumber: false, // typeName: String  desc: 优惠券号
    TimeStamp: false, // typeName: String  desc: 时间戳
    ExtendInfo: false, // typeName: String  desc: 扩展信息（json格式字符串）
  },
}, {
  name: 'orderPaymentCompleted',
  method: 'POST',
  desc: '支付订单',
  path: '/ProfessionalCash/api/v1.0/Order/OrderPaymentCompleted',
  mockPath: '/ProfessionalCash/api/v1.0/Order/OrderPaymentCompleted',
  params: {
    OrderID: true, // typeName: Guid  desc: 订单ID
    Summary: false, //  typeName: String  desc: 小票备注
  },
}, {
  name: 'returnAndRefund',
  method: 'POST',
  desc: '退货',
  path: '/ProfessionalCash/api/v1.0/Mall/ReturnOrder/ReturnAndRefund',
  mockPath: '/ProfessionalCash/api/v1.0/Mall/ReturnOrder/ReturnAndRefund',
  params: {
    OrderItem: true, // typeName:   desc: 订单项
    Fee: true, // typeName: Number  desc: 手续费
    IsTicketForce: true, // typeName:   desc: 是否强制退订单内的票
  },
}, {
  name: 'cancelOrder',
  method: 'POST',
  desc: '取消订单',
  path: '/ProfessionalCash/api/v1.0/Order/CancelOrder',
  mockPath: '/ProfessionalCash/api/v1.0/Order/CancelOrder',
  params: {
    OrderID: true, // typeName: Guid  desc: 订单ID
  },
}, {
  name: 'getOrderList',
  method: 'POST',
  desc: '订单查询',
  path: '/ProfessionalCash/api/v1.0/GoodsOrder/GetOrderList',
  mockPath: '/ProfessionalCash/api/v1.0/GoodsOrder/GetOrderList',
  params: {
    PageInfo: true, // typeName: PageInfo  desc:
    StartTime: true, // typeName: String  desc: 记录时间（开始）
    EndTime: true, // typeName: String  desc: 记录时间（结束）
    LeaguerID: true, // typeName: Guid  desc: 会员ID
    TerminalID: true, // typeName: Guid  desc: 终端ID
    GoodsType: true, // typeName: String  desc: 商品类型
    PayWay: true, // typeName: String  desc: 支付方式
    Condition: true, // typeName: String  desc: 搜索
    DateRange: true, // typeName: DateRange  desc: 日期范围
  },
}, {
  name: 'getOrderItemDetails',
  method: 'POST',
  desc: '订单详情',
  path: '/ProfessionalCash/api/v1.0/GoodsOrder/GetOrderItemDetails',
  mockPath: '/ProfessionalCash/api/v1.0/GoodsOrder/GetOrderItemDetails',
  params: {
    OrderID: true, // typeName: Guid  desc: 订单号
  },
}];
