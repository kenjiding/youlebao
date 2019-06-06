export default [{
  name: 'getAllChannel',
  method: 'POST',
  desc: '获取所有渠道',
  path: '/ProfessionalCash/api/v1.0/Channel/GetAllChannel',
  mockPath: '/ProfessionalCash/api/v1.0/Channel/GetAllChannel',
  params: {
  },
}, {
  name: '127.0.0.1:19999',
  method: 'GET',
  desc: 'ip地址为后台地址  端口号为后台端口号加上10000',
  path: 'ws://127.0.0.1:19999',
  mockPath: 'ws://127.0.0.1:19999',
  params: {
    tid: false, // typeName: String  desc: TerminalID
  },
}, {
  name: 'getChannelExceptGroupBuy',
  method: 'POST',
  desc: '获取团购外的所有渠道',
  path: '/ProfessionalCash/api/v1.0/Channel/GetChannelExceptGroupBuy',
  mockPath: '/ProfessionalCash/api/v1.0/Channel/GetChannelExceptGroupBuy',
  params: {
    ChannelType: false, // typeName: Int  desc: 渠道类型
  },
}, {
  name: 'getNetWorkStatus',
  method: 'POST',
  desc: '获取服务器联网状态',
  path: '/ProfessionalCash/api/v1.0/System/GetNetWorkStatus',
  mockPath: '/ProfessionalCash/api/v1.0/System/GetNetWorkStatus',
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
  name: 'getOrderClass',
  method: 'POST',
  desc: '班次下拉',
  path: '/ProfessionalCash/api/v1.0/Finance/GetOrderClass',
  mockPath: '/ProfessionalCash/api/v1.0/Finance/GetOrderClass',
  params: {
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
}, {
  name: 'getTicketPrintInfo',
  method: 'POST',
  desc: '获取小票打印信息',
  path: '/ProfessionalCash/api/v1.0/TicketPrint/GetTicketPrintInfo',
  mockPath: '/ProfessionalCash/api/v1.0/TicketPrint/GetTicketPrintInfo',
  params: {
  },
}, {
  name: 'otherInMoneyLogPost',
  method: 'POST',
  desc: '其他收入录入',
  path: '/ProfessionalCash/api/v1.0/Finance/OtherInMoneyLogPost',
  mockPath: '/ProfessionalCash/api/v1.0/Finance/OtherInMoneyLogPost',
  params: {
    OtherInOutMoney: true, // typeName: Guid  desc: 收支类别
    Number: true, // typeName: String  desc: 收支单号
    Amount: true, // typeName: Number  desc: 应收金额
    Summary: false, // typeName: String  desc: 备注
    PayTypeID: true, // typeName: Guid  desc: 支付方式ID
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
  name: 'otherOutMoneyLogPost',
  method: 'POST',
  desc: '其他支出录入',
  path: '/ProfessionalCash/api/v1.0/Finance/OtherOutMoneyLogPost',
  mockPath: '/ProfessionalCash/api/v1.0/Finance/OtherOutMoneyLogPost',
  params: {
    OtherInOutMoney: true, // typeName: Guid  desc: 收支类别
    Number: true, // typeName: String  desc: 收支单号
    Amount: true, // typeName: Number  desc: 应收金额
    Summary: false, // typeName: String  desc: 备注
    PayTypeID: true, // typeName: Guid  desc: 支付方式ID
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
  name: 'getChannelExceptGroupBuy',
  method: 'POST',
  desc: '获取团购外的所有渠道',
  path: '/ProfessionalCash/api/v1.0/Channel/GetChannelExceptGroupBuy',
  mockPath: '/ProfessionalCash/api/v1.0/Channel/GetChannelExceptGroupBuy',
  params: {
    ChannelType: false, // typeName: Int  desc: 渠道类型
  },
}];

/** **********
下方为接口的描述详情, 请根据相应的接口名称寻找描述详情

getPayTypeDropWithExclude描述详情:
payKind:
现金 1
预存款 2
微信付款码支付(旧) 3
支付宝付款码支付 4
美团 5
银行卡 6
其他 7
渠道 8
代金券 9
抹零 10
微信扫一扫支付 15
支付宝扫一扫支付 16
微信付款码支付 17
百度钱包付款码支付 18
QQ钱包付款码支付 19
POS机支付 20
拉卡拉扫码支付 = 21
拉卡拉银联支付  22
微信-威富通渠道 23
支付宝-威富通渠道 24
微信 扫一扫-威富通渠道 25
支付宝 扫一扫-威富通渠道 26
快钱扫码支付 27
快钱银联支付 28

*********** */
