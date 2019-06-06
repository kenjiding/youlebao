export default [{
  name: 'getChannelDropDown',
  method: 'POST',
  desc: '获取渠道下拉',
  path: '/ProfessionalCash/api/v1.0/GroupBuy/GetChannelDropDown',
  mockPath: '/ProfessionalCash/api/v1.0/GroupBuy/GetChannelDropDown',
  params: {
  },
}, {
  name: 'getGoodsByCode',
  method: 'POST',
  desc: '输码验券校验接口',
  path: '/ProfessionalCash/api/v1.0/GroupBuy/GetGoodsByCode',
  mockPath: '/ProfessionalCash/api/v1.0/GroupBuy/GetGoodsByCode',
  params: {
    ChannelID: true, // typeName: Guid  desc: 渠道ID
    Code: true, // typeName: String  desc: 团购券码
  },
}, {
  name: 'writeOff',
  method: 'POST',
  path: '/ProfessionalCash/api/v1.0/GroupBuy/WriteOff',
  mockPath: '/ProfessionalCash/api/v1.0/GroupBuy/WriteOff',
  params: {
    ChannelID: true, // typeName: Guid  desc: 渠道ID
    Code: true, // typeName: String  desc: 验券码
    LeaguerID: true, // typeName: Guid  desc: 会员ID
    OrderItemExtended: true, // typeName:   desc: 订单扩展信息
    GoodsID: false,
  },
}, {
  name: 'getChannelOrder',
  method: 'POST',
  desc: '获取渠道验券历史订单',
  path: '/ProfessionalCash/api/v1.0/GroupBuy/GetChannelOrder',
  mockPath: '/ProfessionalCash/api/v1.0/GroupBuy/GetChannelOrder',
  params: {
    ChannelID: true, // typeName: Guid  desc: 渠道ID
    GoodsType: true, // typeName: String  desc: 商品类型
    StartDate: true, // typeName: String  desc: 开始时间
    Keyword: true, // typeName: String  desc: 关键字
    EndDate: true, // typeName: String  desc: 结束时间
    PageInfo: true, // typeName: PageInfo  desc: 分页
  },
}];
