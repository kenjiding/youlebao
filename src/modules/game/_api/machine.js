export default [{
  name: 'getAllByValueGates',
  method: 'POST',
  desc: '获取所有扣值闸机下拉',
  path: '/ProfessionalCash/api/v1.0/Machine/GetAllByValueGates',
  mockPath: '/ProfessionalCash/api/v1.0/Machine/GetAllByValueGates',
  params: {
    IsOut: false, // typeName: Boolean  desc: 是否出闸
  },
}, {
  name: 'getInGateLog',
  method: 'POST',
  desc: '获取项目入闸记录',
  path: '/ProfessionalCash/api/v1.0/Machine/GetInGateLog',
  mockPath: '/ProfessionalCash/api/v1.0/Machine/GetInGateLog',
  params: {
    IsTime: true, // typeName: Boolean  desc: 是否计时
    MachineID: false, // typeName: Guid  desc: 项目ID
    LeaguerID: false, // typeName: Guid  desc: 会员ID
    IsToday: true, // typeName: Boolean  desc: 是否今天
    TicketCode: false, // typeName: String  desc: 票码
    OutHour: true, // typeName: Int  desc: 出闸小时
    OutMinute: true, // typeName: Int  desc: 出闸分钟
    PageInfo: true, // typeName: PageInfo  desc: 分页信息
  },
}, {
  name: 'getMachineUseValues',
  method: 'POST',
  desc: '获取项目消费',
  path: '/ProfessionalCash/api/v1.0/Machine/GetMachineUseValues',
  mockPath: '/ProfessionalCash/api/v1.0/Machine/GetMachineUseValues',
  params: {
    MachineID: true, // typeName: Guid  desc: 项目ID
  },
}, {
  name: 'cancelMachineCoinIn',
  method: 'POST',
  desc: '取消机台扣费记录',
  path: '/ProfessionalCash/api/v1.0/Coin/CancelMachineCoinIn',
  mockPath: '/ProfessionalCash/api/v1.0/Coin/CancelMachineCoinIn',
  params: {
    ID: true, // typeName: Guid  desc: 投币记录ID
  },
}, {
  name: 'getAllMachine',
  method: 'POST',
  desc: '获取所有游乐项目下拉',
  path: '/ProfessionalCash/api/v1.0/Machine/GetAllMachine',
  mockPath: '/ProfessionalCash/api/v1.0/Machine/GetAllMachine',
  params: {
  },
}, {
  name: 'checkTicket',
  method: 'POST',
  desc: 'icket',
  path: '/ProfessionalCash/api/v1.0/Ticket/CheckTicket',
  mockPath: '/ProfessionalCash/api/v1.0/Ticket/CheckTicket',
  params: {
    MachineID: true, // typeName: Guid  desc: 项目ID
    TicketCode: false, // typeName: String  desc: 票码
    SaleLogID: false, // typeName: Guid  desc: 售卖纪录ID
    LeaguerID: false, // typeName: Guid  desc: 会员ID
    IsLeaguer: true, // typeName: Boolean  desc: 是否会员
    CheckCount: true, // typeName: Int  desc: 验票数
    IsOut: true, // typeName: Boolean  desc: 是否出闸
  },
}, {
  name: 'getOutGateFillTicketInfo',
  method: 'POST',
  desc: '获取出闸补票信息',
  path: '/ProfessionalCash/api/v1.0/Ticket/GetOutGateFillTicketInfo',
  mockPath: '/ProfessionalCash/api/v1.0/Ticket/GetOutGateFillTicketInfo',
  params: {
    TicketCode: true, // typeName: String  desc: 票码
  },
}, {
  name: 'getMachineHasProtList',
  method: 'POST',
  desc: '获取有启用端口的所有项目',
  path: '/ProfessionalCash/api/v1.0/Machine/GetMachineHasProtList',
  mockPath: '/ProfessionalCash/api/v1.0/Machine/GetMachineHasProtList',
  params: {
  },
}, {
  name: 'payByCard',
  method: 'POST',
  desc: '收银台刷卡-消费',
  path: '/ProfessionalCash/api/v1.0/Machine/PayByCard',
  mockPath: '/ProfessionalCash/api/v1.0/Machine/PayByCard',
  params: {
    MachineID: true, // typeName: Guid  desc: 项目ID
    LeaguerID: true, // typeName: Guid  desc: 会员ID
    Button: true, // typeName: Int  desc: 按键（1或2）
  },
}, {
  name: 'outGateReturnTicket',
  method: 'POST',
  desc: '出闸退票',
  path: '/ProfessionalCash/api/v1.0/Ticket/OutGateReturnTicket',
  mockPath: '/ProfessionalCash/api/v1.0/Ticket/OutGateReturnTicket',
  params: {
    LogID: true, // typeName: String  desc: 记录ID
    OutHour: true, // typeName: Number  desc: 出闸小时
    OutMinute: true, // typeName: Number  desc: 出闸分钟
  },
}, {
  name: 'fillCashTicketTime',
  method: 'POST',
  desc: '现金计时票补票',
  path: '/ProfessionalCash/api/v1.0/Ticket/FillCashTicketTime',
  mockPath: '/ProfessionalCash/api/v1.0/Ticket/FillCashTicketTime',
  params: {
    TicketCode: true, // typeName: String  desc: 票码
    Money: true, // typeName: Number  desc: 金额
  },
}, {
  name: 'getPayByCardInfo',
  method: 'POST',
  desc: '收银台刷卡-查询',
  path: '/ProfessionalCash/api/v1.0/Machine/GetPayByCardInfo',
  mockPath: '/ProfessionalCash/api/v1.0/Machine/GetPayByCardInfo',
  params: {
    MachineID: true, // typeName: Guid  desc: 项目ID
    LeaguerID: true, // typeName: Guid  desc: 会员ID
  },
}, {
  name: 'leaguerPlayLog',
  method: 'POST',
  desc: '游乐消费历史查询（会员查询用，无权限）',
  path: '/ProfessionalCash/api/v1.0/Game/LeaguerPlayLog',
  mockPath: '/ProfessionalCash/api/v1.0/Game/LeaguerPlayLog',
  params: {
    DateRange: true, // typeName: DateRange  desc: 日期范围
    PageInfo: true, // typeName: PageInfo  desc: 分页
    StartDate: true, // typeName: String  desc: 开始时间
    EndDate: true, // typeName: String  desc: 结束时间
    LeaguerID: true, // typeName: Guid  desc: 会员ID
    MachineID: true, // typeName: Guid  desc: 项目ID
  },
}, {
  name: 'getMachineInSum',
  method: 'POST',
  desc: '获取手工清场入场汇总',
  path: '/ProfessionalCash/api/v1.0/Ticket/GetMachineInSum',
  mockPath: '/ProfessionalCash/api/v1.0/Ticket/GetMachineInSum',
  params: {
    MachineID: false, // typeName: Guid  desc: 项目ID
    LeaguerID: false, // typeName: Guid  desc: 会员ID
    IsToday: true, // typeName: Boolean  desc: 是否今天
    TicketCode: false, // typeName: String  desc: 票码
  },
}, {
  name: 'getLgTicketsByMachine',
  method: 'POST',
  desc: '根据项目获取可过闸套票',
  path: '/ProfessionalCash/api/v1.0/Ticket/GetLgTicketsByMachine',
  mockPath: '/ProfessionalCash/api/v1.0/Ticket/GetLgTicketsByMachine',
  params: {
    LeaguerID: false, // typeName: Guid  desc: 会员ID
    TicketCode: false, // typeName: String  desc: 票码
    MachineID: true, // typeName: Guid  desc: 项目ID
    IsLeaguer: true, // typeName: Boolean  desc: 是否会员
    IsOut: true, // typeName: Boolean  desc: 是否出闸
  },
}, {
  name: 'clearMachineIn',
  method: 'POST',
  desc: '手工清场',
  path: '/ProfessionalCash/api/v1.0/Machine/ClearMachineIn',
  mockPath: '/ProfessionalCash/api/v1.0/Machine/ClearMachineIn',
  params: {
    LogID: false, // typeName: Guid  desc: 入闸记录ID
    OutHour: true, // typeName: Int  desc: 出闸小时
    OutMinute: true, // typeName: Int  desc: 出闸分钟
    IsToday: true, // typeName: Boolean  desc: 是否今天
    MachineID: true, // typeName: Guid  desc: 项目ID
  },
}, {
  name: 'playLog',
  method: 'POST',
  desc: '游乐消费历史查询（查询“取消机台扣费”时用）',
  path: '/ProfessionalCash/api/v1.0/Game/PlayLog',
  mockPath: '/ProfessionalCash/api/v1.0/Game/PlayLog',
  params: {
    DateRange: false, // typeName: DateRange  desc: 日期范围
    PageInfo: true, // typeName: PageInfo  desc: 分页
    StartDate: false, // typeName: String  desc: 开始时间
    EndDate: false, // typeName: String  desc: 结束时间
    LeaguerID: false, // typeName: Guid  desc: 会员ID
    MachineID: false, // typeName: Guid  desc: 项目ID
  },
}, {
  name: 'returnCashTicketTime',
  method: 'POST',
  desc: '现金计时票退票',
  path: '/ProfessionalCash/api/v1.0/Ticket/ReturnCashTicketTime',
  mockPath: '/ProfessionalCash/api/v1.0/Ticket/ReturnCashTicketTime',
  params: {
    TicketCode: true, // typeName: String  desc: 票码
  },
}, {
  name: 'getOutGateReturnTicketInfo',
  method: 'POST',
  desc: '获取出闸退票信息',
  path: '/ProfessionalCash/api/v1.0/Ticket/GetOutGateReturnTicketInfo',
  mockPath: '/ProfessionalCash/api/v1.0/Ticket/GetOutGateReturnTicketInfo',
  params: {
    TicketCode: true, // typeName: String  desc: 票吗
  },
}, {
  name: 'outGateFillTicket',
  method: 'POST',
  desc: '出闸补票',
  path: '/ProfessionalCash/api/v1.0/Ticket/OutGateFillTicket',
  mockPath: '/ProfessionalCash/api/v1.0/Ticket/OutGateFillTicket',
  params: {
    LogID: true, // typeName: Guid  desc: 记录ID
    OutHour: true, // typeName: Int  desc: 出闸小时
    OutMinute: true, // typeName: Int  desc: 出闸分钟
  },
}, {
  name: 'getGateInOutLogs',
  method: 'POST',
  desc: '获取套票的出入闸记录',
  path: '/ProfessionalCash/api/v1.0/Ticket/GetGateInOutLogs',
  mockPath: '/ProfessionalCash/api/v1.0/Ticket/GetGateInOutLogs',
  params: {
    TicketSaleLogID: true, // typeName: String  desc: 票售卖记录ID
  },
}, {
  name: 'activeTicket',
  method: 'POST',
  desc: '激活冻结票',
  path: '/ProfessionalCash/api/v1.0/Ticket/ActiveTicket',
  mockPath: '/ProfessionalCash/api/v1.0/Ticket/ActiveTicket',
  params: {
    RemainID: true, // typeName: Guid  desc: 余额ID
  },
}];
