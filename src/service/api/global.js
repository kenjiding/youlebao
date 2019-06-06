export default [{
  name: 'dTOAuth',
  method: 'POST',
  desc: '授权',
  path: '/ProfessionalCash/api/v1.0/Global/DTOAuth',
  mockPath: '/ProfessionalCash/api/v1.0/Global/DTOAuth',
  params: {
    Username: true, // typeName: String  desc: 授权人用户名
    Password: true, // typeName: String  desc: 授权人密码
    Permission: true, // typeName: Int  desc: 授权使用的权限
    Summary: false, // typeName: String  desc: 描述
  },
}, {
  name: 'getProCashVersion',
  method: 'POST',
  desc: '获取升级包',
  path: '/ProfessionalCash/api/v1.0/Global/GetProCashVersion',
  mockPath: '/ProfessionalCash/api/v1.0/Global/GetProCashVersion',
  params: {
    PackageFile: true, // typeName: String  desc: 专业版升级包名称(如ticket.apk)
    Version: true, // typeName: Int  desc: 程序版本
  },
}, {
  name: 'dTOConnectTest',
  method: 'POST',
  desc: '测试服务器连接',
  path: '/ProfessionalCash/api/v1.0/Global/DTOConnectTest',
  mockPath: '/ProfessionalCash/api/v1.0/Global/DTOConnectTest',
  params: {
  },
}, {
  name: 'sendMessageByCode',
  method: 'POST',
  desc: '发送验证码至指写手机号码',
  path: '/ProfessionalCash/api/v1.0/Global/SendMessageByCode',
  mockPath: '/ProfessionalCash/api/v1.0/Global/SendMessageByCode',
  params: {
    PhoneNum: true, // typeName: String  desc: 手机号
  },
}, {
  name: 'authByCard',
  method: 'POST',
  desc: '根据员工卡授权',
  path: '/ProfessionalCash/api/v1.0/Global/AuthByCard',
  mockPath: '/ProfessionalCash/api/v1.0/Global/AuthByCard',
  params: {
    CardNum: true, // typeName: String  desc: 员工卡号
    Permission: true, // typeName: Int  desc: 授权使用的权限
  },
}];
