export default [{
  name: 'getAllPayType',
  method: 'POST',
  desc: '支付方式下拉',
  path: '/ProfessionalCash/api/v1.0/Order/GetAllPayType',
  mockPath: '/ProfessionalCash/api/v1.0/Order/GetAllPayType',
  params: {
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
}, {
  name: 'getOrderList',
  method: 'POST',
  desc: '订单查询',
  path: '/ProfessionalCash/api/v1.0/GoodsOrder/GetOrderList',
  mockPath: '/ProfessionalCash/api/v1.0/GoodsOrder/GetOrderList',
  params: {
    PageInfo: true, // typeName: PageInfo  desc:
    StartTime: false, // typeName: String  desc: 记录时间（开始）
    EndTime: false, // typeName: String  desc: 记录时间（结束）
    LeaguerID: false, // typeName: Guid  desc: 会员ID
    TerminalID: false, // typeName: Guid  desc: 终端ID
    GoodsType: false, // typeName: String  desc: 商品类型
    PayWay: false, // typeName: String  desc: 支付方式
    Condition: false, // typeName: String  desc: 搜索
    DateRange: false, // typeName: DateRange  desc: 日期范围
    OrderStatus: false, // typeName: OrderStatus  desc: 订单状态
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
  name: 'getOrderPrintInfo',
  method: 'POST',
  desc: '订单小票打印',
  path: '/ProfessionalCash/api/v1.0/Order/GetOrderPrintInfo',
  mockPath: '/ProfessionalCash/api/v1.0/Order/GetOrderPrintInfo',
  params: {
    OrderID: true, // typeName: Guid  desc:
  },
}, {
  name: 'getOrderRePrintInfo',
  method: 'POST',
  desc: '重打订单小票',
  path: '/ProfessionalCash/api/v1.0/Order/GetOrderRePrintInfo',
  mockPath: '/ProfessionalCash/api/v1.0/Order/GetOrderRePrintInfo',
  params: {
    OrderID: true, // typeName: Guid  desc:
  },
}, {
  name: 'getCashBarTerminal',
  method: 'POST',
  desc: '终端下拉',
  path: '/ProfessionalCash/api/v1.0/Order/GetCashBarTerminal',
  mockPath: '/ProfessionalCash/api/v1.0/Order/GetCashBarTerminal',
  params: {
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
    IsTicketForce: false, // typeName:   desc: 是否强制退订单内的票
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
  name: 'sendAndReceiveOrder',
  method: 'POST',
  desc: '支付订单',
  path: '/ProfessionalCash/api/v1.0/Order/SendAndReceiveOrder',
  mockPath: '/ProfessionalCash/api/v1.0/Order/SendAndReceiveOrder',
  params: {
    OrderID: true, // typeName: Guid  desc: 订单ID
  },
}];
