export default [{
  name: 'getLeaguerDetailByCard',
  method: 'POST',
  desc: '获取会员信息详情',
  path: '/ProfessionalCash/api/v1.0/Leaguer/GetLeaguerDetailByCard',
  mockPath: '/ProfessionalCash/api/v1.0/Leaguer/GetLeaguerDetailByCard',
  params: {
    DeviceLgID: true, // typeName: String  desc: 会员相应设备ID（卡ID、身份证号、指纹等）
    DeviceType: true, // typeName: DeviceType  desc: 设备类型
    VerifyState: false, // typeName: Boolean  desc: 是否验证会员状态
    VerifyDate: false, // typeName: Boolean  desc: 是否验证过期时间
    VerifyCardState: false, // typeName: Boolean  desc: 验证卡片状态
  },
}, {
  name: 'getLeaguerBaseByCard',
  method: 'POST',
  desc: '获取会员卡基本信息',
  path: '/ProfessionalCash/api/v1.0/Leaguer/GetLeaguerBaseByCard',
  mockPath: '/ProfessionalCash/api/v1.0/Leaguer/GetLeaguerBaseByCard',
  params: {
    DeviceLgID: true, // typeName: String  desc: 会员相应设备ID（卡ID、身份证号、指纹等）
    DeviceType: true, // typeName: String  desc: 设备类型
  },
}];
