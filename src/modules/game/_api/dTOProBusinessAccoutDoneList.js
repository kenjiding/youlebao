export default [{
  name: 'getNetWorkStatus',
  method: 'POST',
  desc: '获取服务器联网状态',
  path: '/ProfessionalCash/api/v1.0/System/GetNetWorkStatus',
  mockPath: '/ProfessionalCash/api/v1.0/System/GetNetWorkStatus',
  params: {
  },
}, {
  name: 'input',
  method: 'POST',
  desc: '交账',
  path: '/ProfessionalCash/api/v1.0/BusinessAccoutDone/Cash/Input',
  mockPath: '/ProfessionalCash/api/v1.0/BusinessAccoutDone/Cash/Input',
  params: {
    OrderClass: true, // typeName: Int  desc: 班次
    EmpId: true, // typeName: String  desc: 员工ID
    PeriodId: true, // typeName: String  desc: 账期ID
    ListDto: true, // typeName:   desc: 收银结账做实明细
  },
}, {
  name: 'getTicketPrintInfo',
  method: 'POST',
  desc: '获取小票打印信息',
  path: '/ProfessionalCash/api/v1.0/TicketPrint/GetTicketPrintInfo',
  mockPath: '/ProfessionalCash/api/v1.0/TicketPrint/GetTicketPrintInfo',
  params: {
  },
}, {
  name: 'getSystemOverdate',
  method: 'POST',
  desc: '系统将过期提醒',
  path: '/ProfessionalCash/api/v1.0/System/GetSystemOverdate',
  mockPath: '/ProfessionalCash/api/v1.0/System/GetSystemOverdate',
  params: {
  },
}];
