export default [{
  name: 'cancelGivingCoinLog',
  method: 'POST',
  desc: '取消赠币',
  path: '/ProfessionalCash/api/v1.0/GivingCoin/CancelGivingCoinLog',
  mockPath: '/ProfessionalCash/api/v1.0/GivingCoin/CancelGivingCoinLog',
  params: {
    LogID: true, // typeName: Guid  desc: 赠币记录ID
  },
}, {
  name: 'getGivingCoinScheme',
  method: 'POST',
  desc: '获取赠币方案',
  path: '/ProfessionalCash/api/v1.0/GivingCoin/GetGivingCoinScheme',
  mockPath: '/ProfessionalCash/api/v1.0/GivingCoin/GetGivingCoinScheme',
  params: {
    LeaguerID: false, // typeName: Guid  desc: 会员ID
    GuestIDCard: false, // typeName: String  desc: 散客身份证号
  },
}, {
  name: 'saveGivingCoinLog',
  method: 'POST',
  desc: '保存赠币记录',
  path: '/ProfessionalCash/api/v1.0/GivingCoin/SaveGivingCoinLog',
  mockPath: '/ProfessionalCash/api/v1.0/GivingCoin/SaveGivingCoinLog',
  params: {
    SchemeID: true, // typeName: Guid  desc: 方案ID
    LeaguerID: false, // typeName: Guid  desc: 会员ID
    IDCard: false, // typeName: String  desc: 身份证
    IsOutCoin: false, // typeName: Boolean  desc: 是否出币
  },
}, {
  name: 'getGivingCoinLogList',
  method: 'POST',
  desc: '获取赠币记录',
  path: '/ProfessionalCash/api/v1.0/GivingCoin/GetGivingCoinLogList',
  mockPath: '/ProfessionalCash/api/v1.0/GivingCoin/GetGivingCoinLogList',
  params: {
    LeaguerID: true, // typeName: Guid  desc: 会员ID
    StartTime: false, // typeName: String  desc: 开始时间
    EndTime: false, // typeName: String  desc: 结束时间
    PageInfo: true,
  },
}];
