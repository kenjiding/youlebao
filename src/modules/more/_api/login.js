export default [{
  name: 'cashLogin',
  method: 'POST',
  desc: '收银台默认登录今天账期',
  path: '/ProfessionalCash/api/v1.0/Login/CashLogin',
  mockPath: '/ProfessionalCash/api/v1.0/Login/CashLogin',
  params: {
    UserName: true, // typeName: String  desc: 账号名称
    PassWord: true, // typeName: String  desc: 密码[Base64Crypt().Encrypt(string)]
    TerminalID: true, // typeName: Guid  desc: 终端ID
    PeriodID: false, // typeName: Guid  desc: 账期ID[不传值时默认获取当天账期]
  },
}, {
  name: 'getTerminalByMac',
  method: 'POST',
  desc: '根据Mac获取终端',
  path: '/ProfessionalCash/api/v1.0/Terminal/GetTerminalByMac',
  mockPath: '/ProfessionalCash/api/v1.0/Terminal/GetTerminalByMac',
  params: {
    Mac: true, // typeName: String  desc: Mac地址(字节转存字符)
  },
}, {
  name: 'bindTerminal',
  method: 'POST',
  desc: '绑定登录终端',
  path: '/ProfessionalCash/api/v1.0/Login/BindTerminal',
  mockPath: '/ProfessionalCash/api/v1.0/Login/BindTerminal',
  params: {
    UserName: true, // typeName: String  desc: 用户名
    PassWord: true, // typeName: String  desc: 登录密码
    Mac: true, // typeName: String  desc: 终端地址
    TerminalID: true, // typeName: Guid  desc: 要绑定的终端ID
  },
}, {
  name: 'getLoginTerminal',
  method: 'POST',
  desc: '获取登录终端信息',
  path: '/ProfessionalCash/api/v1.0/Login/GetLoginTerminal',
  mockPath: '/ProfessionalCash/api/v1.0/Login/GetLoginTerminal',
  params: {
    UserName: true, // typeName: String  desc: 登录名
    PassWord: true, // typeName: String  desc: 登录密码
  },
}, {
  name: 'getUserLoginInfo',
  method: 'POST',
  desc: '获取登录用户信息',
  path: '/ProfessionalCash/api/v1.0/Login/GetUserLoginInfo',
  mockPath: '/ProfessionalCash/api/v1.0/Login/GetUserLoginInfo',
  params: {
  },
}, {
  name: 'updatePwd',
  method: 'POST',
  desc: '修改登录密码',
  path: '/ProfessionalCash/api/v1.0/Login/UpdatePwd',
  mockPath: '/ProfessionalCash/api/v1.0/Login/UpdatePwd',
  params: {
    NewPassword: true, // typeName: String  desc: 新密码
    OldPassword: true, // typeName: String  desc: 旧密码
  },
}];
