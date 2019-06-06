export default [{
  name: 'getTicketRemain',
  method: 'POST',
  desc: '详情见下方注释: getTicketRemain',
  path: '/ProfessionalCash/api/v1.0/Game/GetTicketRemain',
  mockPath: '/ProfessionalCash/api/v1.0/Game/GetTicketRemain',
  params: {
    SaleLogID: true, // typeName: Guid  desc: 记录ID
    PageInfo: true, // typeName: PageInfo  desc:
  },
}, {
  name: 'ticketOverdueForce',
  method: 'POST',
  desc: '强制退票',
  path: '/ProfessionalCash/api/v1.0/Game/TicketOverdueForce',
  mockPath: '/ProfessionalCash/api/v1.0/Game/TicketOverdueForce',
  params: {
    PackageSaleLogIds: true, // typeName: Guid  desc: 售卖记录ID
    Fee: true, // typeName: Number  desc: 手续费
  },
}, {
  name: 'getTicketPlayLog',
  method: 'POST',
  desc: '套票使用记录',
  path: '/ProfessionalCash/api/v1.0/Ticket/GetTicketPlayLog',
  mockPath: '/ProfessionalCash/api/v1.0/Ticket/GetTicketPlayLog',
  params: {
    SaleLogID: true, // typeName: Guid  desc: 记录ID
    PageInfo: true, // typeName: PageInfo  desc:
  },
}, {
  name: 'ticketQuery',
  method: 'POST',
  desc: '套票查询',
  path: '/ProfessionalCash/api/v1.0/Ticket/TicketQuery',
  mockPath: '/ProfessionalCash/api/v1.0/Ticket/TicketQuery',
  params: {
    LogTimeBegin: false, // typeName: String  desc: 购买时间（开始）
    LogTimeEnd: false, // typeName: String  desc: 购买时间（结束）
    LeaguerID: false, // typeName: Guid  desc: 会员ID
    Condition: false, // typeName: String  desc: 搜索条件（可以是订单号/票码/套票名称/购票人姓名/手机号 其中之一）
    PageInfo: true, // typeName: PageInfo  desc:
    ChannelID: true, // typeName: Guid  desc: 渠道ID
    TicketStatus: true, // typeName: TicketStatus  desc: 状态
    DateRange: true, // typeName: DateRange  desc: 日期范围
  },
}, {
  name: 'getTicketSaleLogDetail',
  method: 'POST',
  desc: '套票详情',
  path: '/ProfessionalCash/api/v1.0/Ticket/GetTicketSaleLogDetail',
  mockPath: '/ProfessionalCash/api/v1.0/Ticket/GetTicketSaleLogDetail',
  params: {
    SaleLogID: true, // typeName: String  desc: 售卖记录ID
  },
}, {
  name: 'printPTforSuccessed',
  method: 'POST',
  desc: '陪同票打印成功后调用接口',
  path: '/ProfessionalCash/api/v1.0/Game/PrintPTforSuccessed',
  mockPath: '/ProfessionalCash/api/v1.0/Game/PrintPTforSuccessed',
  params: {
    SaleLogId: true, // typeName: Guid  desc: 售卖记录ID
  },
}, {
  name: 'getTickerPrint',
  method: 'POST',
  desc: '打印套票',
  path: '/ProfessionalCash/api/v1.0/Game/GetTickerPrint',
  mockPath: '/ProfessionalCash/api/v1.0/Game/GetTickerPrint',
  params: {
    PackageTicketLogID: true, // typeName: Guid  desc: 套票销售记录ID
    IsPeiTong: false, // typeName: Boolean  desc: 是否陪同票
  },
}, {
  name: 'getTicketRegisterConfig',
  method: 'POST',
  desc: '获取套票购买需要登记的信息',
  path: '/ProfessionalCash/api/v1.0/Ticket/GetTicketRegisterConfig',
  mockPath: '/ProfessionalCash/api/v1.0/Ticket/GetTicketRegisterConfig',
  params: {
  },
}, {
  name: 'getTicketOverdueDetail',
  method: 'POST',
  desc: '获取退票信息详情',
  path: '/ProfessionalCash/api/v1.0/Game/GetTicketOverdueDetail',
  mockPath: '/ProfessionalCash/api/v1.0/Game/GetTicketOverdueDetail',
  params: {
    PackageSaleLogIds: true, // typeName: Guid  desc: 选择的销售记录ID
  },
}, {
  name: 'ticketOverdue',
  method: 'POST',
  desc: '退票',
  path: '/ProfessionalCash/api/v1.0/Game/TicketOverdue',
  mockPath: '/ProfessionalCash/api/v1.0/Game/TicketOverdue',
  params: {
    PackageSaleLogIds: true, // typeName: Guid  desc: 售卖记录ID
    Fee: true, // typeName: Number  desc: 退票手续费
  },
}];

/** **********
下方为接口的描述详情, 请根据相应的接口名称寻找描述详情

getTicketRemain描述详情:
TimeDetail为空为计次票  TimeDetail不为空为期限票 计时票
1.当为计次票时 若非共享次数（TotalShareCount=0）显示DataList数据（用表格显示） 否则显示共享信息以及可玩项目名字（显示成一行 以逗号分割）
2.期限票 计时票显示TimeDetail 以及可玩项目名字（显示成一行 以逗号分割）

*********** */
