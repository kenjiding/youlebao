export default [{
  name: 'getPackageTicketDetail',
  method: 'POST',
  desc: '获取套票类商品明细',
  path: '/ProfessionalCash/api/v1.0/Sell/GetPackageTicketDetail',
  mockPath: '/ProfessionalCash/api/v1.0/Sell/GetPackageTicketDetail',
  params: {
    GoodsID: true, // typeName: Guid  desc: 商品id
  },
}, {
  name: 'checkSetGoodsShow',
  method: 'POST',
  desc: '检验设置商品展示权限',
  path: '/ProfessionalCash/api/v1.0/Sell/CheckSetGoodsShow',
  mockPath: '/ProfessionalCash/api/v1.0/Sell/CheckSetGoodsShow',
  params: {
  },
}, {
  name: 'getSellGoodsList',
  method: 'POST',
  desc: '获取售卖商品列表',
  path: '/ProfessionalCash/api/v1.0/Sell/GetSellGoodsList',
  mockPath: '/ProfessionalCash/api/v1.0/Sell/GetSellGoodsList',
  params: {
  },
}, {
  name: 'checkGoodsCanSale',
  method: 'POST',
  desc: '检查商品是否可售',
  path: '/ProfessionalCash/api/v1.0/Sell/CheckGoodsCanSale',
  mockPath: '/ProfessionalCash/api/v1.0/Sell/CheckGoodsCanSale',
  params: {
    GoodsID: true, // typeName: Guid  desc: 商品ID
    LeaguerID: false, // typeName: Guid  desc: 会员ID
  },
}, {
  name: 'getGoodsGroups',
  method: 'POST',
  desc: '获取商品分组列表',
  path: '/ProfessionalCash/api/v1.0/Sell/GetGoodsGroups',
  mockPath: '/ProfessionalCash/api/v1.0/Sell/GetGoodsGroups',
  params: {
  },
}, {
  name: 'setGoodsGroup',
  method: 'POST',
  desc: '设置商品分组',
  path: '/ProfessionalCash/api/v1.0/Sell/SetGoodsGroup',
  mockPath: '/ProfessionalCash/api/v1.0/Sell/SetGoodsGroup',
  params: {
    ID: false, // typeName: Guid  desc: 商品分组ID（为空则为新增）
    Index: true, // typeName: Int  desc: 顺序索引
    GroupName: true, // typeName: String  desc: 分组名称
    GroupType: false, // typeName: GoodsGroupType  desc: 分组类型
  },
}, {
  name: 'getPreDepositDetail',
  method: 'POST',
  desc: '获取预存款商品明细',
  path: '/ProfessionalCash/api/v1.0/Sell/GetPreDepositDetail',
  mockPath: '/ProfessionalCash/api/v1.0/Sell/GetPreDepositDetail',
  params: {
    GoodsID: true, // typeName: Guid  desc: 商品id
  },
}, {
  name: 'calculateShoppingCart',
  method: 'POST',
  desc: '计算购物车结账费用',
  path: '/ProfessionalCash/api/v1.0/Sell/CalculateShoppingCart',
  mockPath: '/ProfessionalCash/api/v1.0/Sell/CalculateShoppingCart',
  params: {
    GoodsData: true, // typeName:   desc: 购买商品列表
    LeaguerID: false, // typeName: Guid  desc: 会员ID
    CouponNumber: false, // typeName: String  desc: 优惠券号
    TimeStamp: true, // typeName: String  desc: 时间戳
  },
}, {
  name: 'getCombinationDetail',
  method: 'POST',
  desc: '获取组合商品明细',
  path: '/ProfessionalCash/api/v1.0/Sell/GetCombinationDetail',
  mockPath: '/ProfessionalCash/api/v1.0/Sell/GetCombinationDetail',
  params: {
    GoodsID: true, // typeName: Guid  desc: 商品ID
  },
}, {
  name: 'updateGoodsShow',
  method: 'POST',
  desc: '批量修改商品展示信息',
  path: '/ProfessionalCash/api/v1.0/Sell/UpdateGoodsShow',
  mockPath: '/ProfessionalCash/api/v1.0/Sell/UpdateGoodsShow',
  params: {
    GoodsIDList: true, // typeName: String  desc: 商品ID列表
    Color: true, // typeName: String  desc: 商品颜色
    GroupID: true, // typeName: String  desc: 分组ID
  },
}, {
  name: 'bindPackageTicketNumber',
  method: 'POST',
  desc: '绑定票码',
  path: '/ProfessionalCash/api/v1.0/Sell/BindPackageTicketNumber',
  mockPath: '/ProfessionalCash/api/v1.0/Sell/BindPackageTicketNumber',
  params: {
    PackageTicketData: true, // typeName:   desc: 需要绑定的列表
  },
}, {
  name: 'updateGoodsForGoodsIndex',
  method: 'POST',
  desc: '修改商品显示顺序',
  path: '/ProfessionalCash/api/v1.0/Sell/UpdateGoodsForGoodsIndex',
  mockPath: '/ProfessionalCash/api/v1.0/Sell/UpdateGoodsForGoodsIndex',
  params: {
    GoodsIDList: true, // typeName: Guid  desc: 商品ID列表
  },
}, {
  name: 'getBougthPackageTicketByOrder',
  method: 'POST',
  desc: '根据订单获取已购买套票列表',
  path: '/ProfessionalCash/api/v1.0/Sell/GetBougthPackageTicketByOrder',
  mockPath: '/ProfessionalCash/api/v1.0/Sell/GetBougthPackageTicketByOrder',
  params: {
    OrderID: true, // typeName: Guid  desc: 订单ID
  },
}, {
  name: 'orderCompletedFollowOperaction',
  method: 'POST',
  desc: '订单完成后续操作',
  path: '/ProfessionalCash/api/v1.0/Sell/OrderCompletedFollowOperaction',
  mockPath: '/ProfessionalCash/api/v1.0/Sell/OrderCompletedFollowOperaction',
  params: {
    OrderID: true, // typeName: Guid  desc: 订单ID
  },
}, {
  name: 'getSellGoodsListForShow',
  method: 'POST',
  desc: '获取售卖商品列表（设置商品展示）',
  path: '/ProfessionalCash/api/v1.0/Sell/GetSellGoodsListForShow',
  mockPath: '/ProfessionalCash/api/v1.0/Sell/GetSellGoodsListForShow',
  params: {
  },
}, {
  name: 'getGoodsBaseInfo',
  method: 'POST',
  desc: '获取商品基础信息',
  path: '/ProfessionalCash/api/v1.0/Sell/GetGoodsBaseInfo',
  mockPath: '/ProfessionalCash/api/v1.0/Sell/GetGoodsBaseInfo',
  params: {
    GoodsID: true, // typeName: String  desc: 商品ID
  },
}, {
  name: 'updateGoodsForGroup',
  method: 'POST',
  desc: '修改商品分组',
  path: '/ProfessionalCash/api/v1.0/Sell/UpdateGoodsForGroup',
  mockPath: '/ProfessionalCash/api/v1.0/Sell/UpdateGoodsForGroup',
  params: {
    GoodsID: true, // typeName: Guid  desc: 商品ID
    GroupID: true, // typeName: Guid  desc: 分组ID
  },
}, {
  name: 'deleteGoodsGroup',
  method: 'POST',
  desc: '删除商品分组',
  path: '/ProfessionalCash/api/v1.0/Sell/DeleteGoodsGroup',
  mockPath: '/ProfessionalCash/api/v1.0/Sell/DeleteGoodsGroup',
  params: {
    GoodsGroupID: true, // typeName: Guid  desc: 商品分组ID
  },
}, {
  name: 'getCommonGoodsDetail',
  method: 'POST',
  desc: '获取普通商品明细',
  path: '/ProfessionalCash/api/v1.0/Sell/GetCommonGoodsDetail',
  mockPath: '/ProfessionalCash/api/v1.0/Sell/GetCommonGoodsDetail',
  params: {
    GoodsID: true, // typeName: Guid  desc: 商品ID
  },
}, {
  name: 'searchCouponByNumber',
  method: 'POST',
  desc: '根据编号查找优惠券',
  path: '/ProfessionalCash/api/v1.0/Sell/SearchCouponByNumber',
  mockPath: '/ProfessionalCash/api/v1.0/Sell/SearchCouponByNumber',
  params: {
    SearchValue: true, // typeName: String  desc: 查找值
  },
}, {
  name: 'getCoinMealDetail',
  method: 'POST',
  desc: '获取售币类商品明细',
  path: '/ProfessionalCash/api/v1.0/Sell/GetCoinMealDetail',
  mockPath: '/ProfessionalCash/api/v1.0/Sell/GetCoinMealDetail',
  params: {
    GoodsID: true, // typeName: String  desc: 商品id
  },
}, {
  name: 'getPackageTicketPrintInfo',
  method: 'POST',
  desc: '获取套票打印信息',
  path: '/ProfessionalCash/api/v1.0/Sell/GetPackageTicketPrintInfo',
  mockPath: '/ProfessionalCash/api/v1.0/Sell/GetPackageTicketPrintInfo',
  params: {
    Data: true, // typeName:   desc:
  },
}];
