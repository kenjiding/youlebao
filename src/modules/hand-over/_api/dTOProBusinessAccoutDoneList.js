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
    EmpId: false, // typeName: String  desc: 员工ID
    PeriodId: false, // typeName: String  desc: 账期ID
    ListDto: true, // typeName:   desc: 收银结账做实明细
  },
}, {
  name: 'getSystemOverdate',
  method: 'POST',
  desc: '系统将过期提醒',
  path: '/ProfessionalCash/api/v1.0/System/GetSystemOverdate',
  mockPath: '/ProfessionalCash/api/v1.0/System/GetSystemOverdate',
  params: {
  },
}, {
  name: 'getSingelPayMax',
  method: 'POST',
  desc: '获取商户设置的单笔消费允许的最大值',
  path: '/ProfessionalCash/api/v1.0/MallConfig/GetSingelPayMax',
  mockPath: '/ProfessionalCash/api/v1.0/MallConfig/GetSingelPayMax',
  params: {
  },
}, {
  name: 'otherOutMoneyLogPost',
  method: 'POST',
  desc: '其他支出录入',
  path: '/ProfessionalCash/api/v1.0//Finance/OtherOutMoneyLogPost',
  mockPath: '/ProfessionalCash/api/v1.0//Finance/OtherOutMoneyLogPost',
  params: {
    OtherInOutMoney: true, // typeName: Guid  desc: 收支类别
    Number: true, // typeName: String  desc: 收支单号
    Amount: true, // typeName: Number  desc: 应收金额
    Summary: false, // typeName: String  desc: 备注
    PayTypeID: true, // typeName: Guid  desc: 支付方式ID
  },
}, {
  name: 'getOrderClass',
  method: 'POST',
  desc: '班次下拉',
  path: '/ProfessionalCash/api/v1.0/Finance/GetOrderClass',
  mockPath: '/ProfessionalCash/api/v1.0/Finance/GetOrderClass',
  params: {
  },
}, {
  name: 'otherInMoneyLogPost',
  method: 'POST',
  desc: '其他收入录入',
  path: '/ProfessionalCash/api/v1.0//Finance/OtherInMoneyLogPost',
  mockPath: '/ProfessionalCash/api/v1.0//Finance/OtherInMoneyLogPost',
  params: {
    OtherInOutMoney: true, // typeName: Guid  desc: 收支类别
    Number: true, // typeName: String  desc: 收支单号
    Amount: true, // typeName: Number  desc: 应收金额
    Summary: false, // typeName: String  desc: 备注
    PayTypeID: true, // typeName: Guid  desc: 支付方式ID
  },
}, {
  name: 'getEmpMoneyInput',
  method: 'POST',
  desc: '收银结账做实输入查询',
  path: '/ProfessionalCash/api/v1.0/Finance/GetEmpMoneyInput',
  mockPath: '/ProfessionalCash/api/v1.0/Finance/GetEmpMoneyInput',
  params: {
    OrderClass: false, // typeName: Int  desc: 班次
    EmpID: false, // typeName: Guid  desc: 员工
    PeriodId: false, // typeName: String  desc: 账期
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
  name: 'getAllOtherInOutMoney',
  method: 'POST',
  desc: '收入支出分类',
  path: '/ProfessionalCash/api/v1.0/Finance/GetAllOtherInOutMoney',
  mockPath: '/ProfessionalCash/api/v1.0/Finance/GetAllOtherInOutMoney',
  params: {
    IsIn: true, // typeName: Boolean  desc: 是否收入
  },
}, {
  name: 'getPayTypeDropWithExclude',
  method: 'POST',
  desc: '详情见下方注释: getPayTypeDropWithExclude',
  path: '/ProfessionalCash/api/v1.0/Pay/GetPayTypeDropWithExclude',
  mockPath: '/ProfessionalCash/api/v1.0/Pay/GetPayTypeDropWithExclude',
  params: {
    ExcludePayKind: true, // typeName: String  desc: 排除的PayKind(逗号分隔,如排除抹零、预存款、代金券则传：”2，9，10“)
    IsShowInClient: false, // typeName: Boolean  desc: 是否在收银终端显示
    TerminalID: false, // typeName: Guid  desc: 收银终端ID
  },
}];
