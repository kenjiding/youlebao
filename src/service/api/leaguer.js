export default [{
  name: 'getLeaguerListByCard',
  method: 'POST',
  desc: '输入手机号码，读取身份证等会返回多个会员信息，故先调此接口，选择会员后，再通过会员ID 调用获取一个会员的接口',
  path: '/ProfessionalCash/api/v1.0/Leaguer/GetLeaguerListByCard',
  mockPath: '/ProfessionalCash/api/v1.0/Leaguer/GetLeaguerListByCard',
  params: {
    DeviceLgID: true, // typeName: String  desc: 会员相应设备ID（卡ID、身份证号、指纹等）
    DeviceType: true, // typeName: DeviceType  desc: 设备类型
  },
}, {
  name: 'getOneLeaguerBaseByCard',
  method: 'POST',
  desc: '获取一个会员的信息(读卡用)',
  path: '/ProfessionalCash/api/v1.0/Leaguer/GetOneLeaguerBaseByCard',
  mockPath: '/ProfessionalCash/api/v1.0/Leaguer/GetOneLeaguerBaseByCard',
  params: {
    DeviceType: false, // typeName: String  desc: 设备类型
    DeviceLgID: false, // typeName: String  desc: 会员相应设备ID（卡ID、身份证号、指纹等）
    VerifyState: false, // typeName: Boolean  desc: 是否验证会员状态
    VerifyDate: false, // typeName: Boolean  desc: 是否验证过期时间
    VerifyCardState: false, // typeName: Boolean  desc: 验证卡片状态
    LeaguerID: false, // typeName: String  desc: 会员ID
  },
}, {
  name: 'getLgListByRoam',
  method: 'POST',
  desc: '漫游获取多个会员信息（收银台用）',
  path: '/ProfessionalCash/api/v1.0/Leaguer/GetLgListByRoam',
  mockPath: '/ProfessionalCash/api/v1.0/Leaguer/GetLgListByRoam',
  params: {
    DeviceLgID: true, // typeName: String  desc: 会员相应设备ID（卡ID、身份证号、指纹等）
    DeviceType: true, // typeName: String  desc: 设备类型
  },
}, {
  name: 'getLeaguerDetailByRoam',
  method: 'POST',
  desc: '获取一个会员信息（收银台用）',
  path: '/ProfessionalCash/api/v1.0/Leaguer/GetLeaguerDetailByRoam',
  mockPath: '/ProfessionalCash/api/v1.0/Leaguer/GetLeaguerDetailByRoam',
  params: {
    LeaguerID: true, // typeName: Guid  desc: 会员id
    TargetBusinessID: true, // typeName: Guid  desc: 目标商户ID
  },
}, {
  name: 'checkIsCanRoam',
  method: 'POST',
  desc: '判断是否开通会员漫游',
  path: '/ProfessionalCash/api/v1.0/Leaguer/CheckIsCanRoam',
  mockPath: '/ProfessionalCash/api/v1.0/Leaguer/CheckIsCanRoam',
  params: {
  },
}];
