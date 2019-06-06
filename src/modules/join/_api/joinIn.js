export default [{
  name: 'confrimJoinIn',
  method: 'POST',
  desc: '确认开卡',
  path: '/ProfessionalCash/api/v1.0/JoinIn/ConfrimJoinIn',
  mockPath: '/ProfessionalCash/api/v1.0/JoinIn/ConfrimJoinIn',
  params: {
    CardID: true, // typeName: String  desc:
    CardNumber: true, // typeName: String  desc:
    Name: false, // typeName: String  desc:
    Sex: false, // typeName: String  desc:
    Phone: false, // typeName: String  desc:
    IDCardNumber: false, // typeName: String  desc:
    Password: false, // typeName: String  desc:
    Birthday: false, // typeName: String  desc:s
    MealID: true, // typeName: Guid  desc: 入会套餐ID
    GoodsData: true, // typeName:   desc: 子商品列表
    Photo: false, // typeName: String  desc:
    PhotoWidth: false, // typeName: Int  desc:
    PhotoHeight: false, // typeName: Int  desc:
    MediaType: true, // typeName: String
    // desc: 开卡介质入会介质（LeaguerCard：IC卡、NoCard：手机号、IcCard：RFID芯片、Parper：二维码腕带）
    ExtendInfo: true, // typeName: String  desc: 额外信息（json）
  },
}, {
  name: 'getJoinInMealListForShow',
  method: 'POST',
  desc: '获取会员入会套餐列表（设置商品展示）',
  path: '/ProfessionalCash/api/v1.0/JoinIn/GetJoinInMealListForShow',
  mockPath: '/ProfessionalCash/api/v1.0/JoinIn/GetJoinInMealListForShow',
  params: {
  },
}, {
  name: 'getJoinInMealList',
  method: 'POST',
  desc: '获取会员入会套餐列表',
  path: '/ProfessionalCash/api/v1.0/JoinIn/GetJoinInMealList',
  mockPath: '/ProfessionalCash/api/v1.0/JoinIn/GetJoinInMealList',
  params: {
  },
}, {
  name: 'checkSetJoinInShow',
  method: 'POST',
  desc: '检验设置入会套餐展示权限',
  path: '/ProfessionalCash/api/v1.0/JoinIn/CheckSetJoinInShow',
  mockPath: '/ProfessionalCash/api/v1.0/JoinIn/CheckSetJoinInShow',
  params: {
  },
}, {
  name: 'getJoinInMealDetail',
  method: 'POST',
  desc: '获取入会套餐明细',
  path: '/ProfessionalCash/api/v1.0/JoinIn/GetJoinInMealDetail',
  mockPath: '/ProfessionalCash/api/v1.0/JoinIn/GetJoinInMealDetail',
  params: {
    GoodsID: true, // typeName: Guid  desc: 商品id
  },
}, {
  name: 'checkLgJoinNeedAuth',
  method: 'POST',
  desc: '检验入会套餐是否需要授权',
  path: '/ProfessionalCash/api/v1.0/JoinIn/CheckLgJoinNeedAuth',
  mockPath: '/ProfessionalCash/api/v1.0/JoinIn/CheckLgJoinNeedAuth',
  params: {
    GoodsID: true, // typeName: Guid  desc: 商品id
  },
}];
