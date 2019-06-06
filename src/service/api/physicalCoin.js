export default [{
  name: 'physicalCoinStockAddCoinEx',
  method: 'POST',
  desc: '加币清币-加币（权限控制）',
  path: '/ProfessionalCash/api/v1.0/PhysicalCoin/PhysicalCoinStockAddCoinEx',
  mockPath: '/ProfessionalCash/api/v1.0/PhysicalCoin/PhysicalCoinStockAddCoinEx',
  params: {
    TerminalID: true, // typeName: Guid  desc: 设备ID
    Summary: true, // typeName: String  desc: 备注
    StockID: true, // typeName: Guid  desc: 仓库Id
    Amount: true, // typeName: String  desc: 加币数量
  },
}, {
  name: 'physicalCoinStockClearCoinEx',
  method: 'POST',
  desc: '加币清币-清币（权限控制）',
  path: '/ProfessionalCash/api/v1.0/PhysicalCoin/PhysicalCoinStockClearCoinEx',
  mockPath: '/ProfessionalCash/api/v1.0/PhysicalCoin/PhysicalCoinStockClearCoinEx',
  params: {
    TerminalID: true, // typeName: Guid  desc: 设备ID
    Summary: true, // typeName: String  desc:
    StockID: true, // typeName: Guid  desc: 仓库ID
    StockAmount: true, // typeName: String  desc: 实际库存
  },
}, {
  name: 'checkPhysicalCoinModel',
  method: 'POST',
  desc: '检查实物币模块是否开启',
  path: '/ProfessionalCash/api/v1.0/PhysicalCoin/CheckPhysicalCoinModel',
  mockPath: '/ProfessionalCash/api/v1.0/PhysicalCoin/CheckPhysicalCoinModel',
  params: {
  },
}, {
  name: 'updateGamePhysicalCoinSetMealLog',
  method: 'POST',
  desc: '继续出币',
  path: '/ProfessionalCash/api/v1.0/PhysicalCoin/UpdateGamePhysicalCoinSetMealLog',
  mockPath: '/ProfessionalCash/api/v1.0/PhysicalCoin/UpdateGamePhysicalCoinSetMealLog',
  params: {
    LogID: true, // typeName: Guid  desc: 游戏币售卖记录ID
    OutCoins: true, // typeName: Int  desc: 出币数
  },
}, {
  name: 'queryGetPhysicalCoinErrorTreate',
  method: 'POST',
  desc: '出币异常处理',
  path: '/ProfessionalCash/api/v1.0/PhysicalCoin/QueryGetPhysicalCoinErrorTreate',
  mockPath: '/ProfessionalCash/api/v1.0/PhysicalCoin/QueryGetPhysicalCoinErrorTreate',
  params: {
    StartDate: true, // typeName: String  desc: 开始时间
    EndDate: true, // typeName: String  desc: 结束时间
    LeaguerID: true, // typeName: Guid  desc: 会员ID
    State: true, // typeName: Int  desc: 状态（1.异常，2.已完成)
    PageInfo: true, // typeName: PageInfo  desc: 分页
    DateRange: true, // typeName: String  desc: 日期区间(今天：Today, 昨天：Yesterday,  一个月：OneMonth)
  },
}, {
  name: 'getPhysicalCoinTer',
  method: 'POST',
  desc: '获取前端售币机列表',
  path: '/ProfessionalCash/api/v1.0/PhysicalCoin/GetPhysicalCoinTer',
  mockPath: '/ProfessionalCash/api/v1.0/PhysicalCoin/GetPhysicalCoinTer',
  params: {
    IsNew: false, // typeName: Boolean  desc: 是否获取新设备列表
  },
}, {
  name: 'physicalCoinStockClearCoin',
  method: 'POST',
  desc: '加币清币-清币',
  path: '/ProfessionalCash/api/v1.0/PhysicalCoin/PhysicalCoinStockClearCoin',
  mockPath: '/ProfessionalCash/api/v1.0/PhysicalCoin/PhysicalCoinStockClearCoin',
  params: {
    TerminalID: true, // typeName: Guid  desc: 设备ID
    Summary: true, // typeName: String  desc:
    StockID: true, // typeName: Guid  desc: 仓库ID
    StockAmount: true, // typeName: Number  desc: 实际库存
  },
}, {
  name: 'updatePhysicalCoinTerminal',
  method: 'POST',
  desc: '更新绑定售币终端',
  path: '/ProfessionalCash/api/v1.0/PhysicalCoin/UpdatePhysicalCoinTerminal',
  mockPath: '/ProfessionalCash/api/v1.0/PhysicalCoin/UpdatePhysicalCoinTerminal',
  params: {
    MachineID: true, // typeName: String  desc: 硬件唯一标示
    Version: true, // typeName: String  desc: 硬件版本号
  },
}, {
  name: 'bindCoinTer',
  method: 'POST',
  desc: '绑定收银台实物币终端',
  path: '/ProfessionalCash/api/v1.0/PhysicalCoin/BindCoinTer',
  mockPath: '/ProfessionalCash/api/v1.0/PhysicalCoin/BindCoinTer',
  params: {
    CoinTerID: true, // typeName: Guid  desc: 实物币终端ID
  },
}, {
  name: 'unBindCoinTer',
  method: 'POST',
  desc: '解绑收银台实物币终端',
  path: '/ProfessionalCash/api/v1.0/PhysicalCoin/UnBindCoinTer',
  mockPath: '/ProfessionalCash/api/v1.0/PhysicalCoin/UnBindCoinTer',
  params: {
  },
}, {
  name: 'getPhysicalCoinTerminalStockLog',
  method: 'POST',
  desc: '加币清币记录',
  path: '/ProfessionalCash/api/v1.0/PhysicalCoin/GetPhysicalCoinTerminalStockLog',
  mockPath: '/ProfessionalCash/api/v1.0/PhysicalCoin/GetPhysicalCoinTerminalStockLog',
  params: {
    TerminalID: false, // typeName: Guid  desc: 终端ID
    StockID: false, // typeName: Guid  desc: 仓库ID
    StartTime: false, // typeName: String  desc: 开始时间
    EndTime: false, // typeName: String  desc: 结束时间
    IsAddLog: false, // typeName: Boolean  desc: 是否是加币记录（true:加币、false:清币）
    PageInfo: true, // typeName: PageInfo  desc: 分页
  },
}, {
  name: 'getPhysicalCoinErrorTreate',
  method: 'POST',
  desc: '提币误差处理',
  path: '/ProfessionalCash/api/v1.0/PhysicalCoin/GetPhysicalCoinErrorTreate',
  mockPath: '/ProfessionalCash/api/v1.0/PhysicalCoin/GetPhysicalCoinErrorTreate',
  params: {
    LogID: true, // typeName: Guid  desc:
  },
}, {
  name: 'orderOutCoinError',
  method: 'POST',
  desc: '订单出币异常处理',
  path: '/ProfessionalCash/api/v1.0/PhysicalCoin/OrderOutCoinError',
  mockPath: '/ProfessionalCash/api/v1.0/PhysicalCoin/OrderOutCoinError',
  params: {
    OrderID: true, // typeName: Guid  desc: 订单ID
  },
}, {
  name: 'getPhysicalCoinTerminal',
  method: 'POST',
  desc: '查询绑定售币终端',
  path: '/ProfessionalCash/api/v1.0/PhysicalCoin/GetPhysicalCoinTerminal',
  mockPath: '/ProfessionalCash/api/v1.0/PhysicalCoin/GetPhysicalCoinTerminal',
  params: {
  },
}, {
  name: 'getAllStockPhysicalCoinList',
  method: 'POST',
  desc: '获取所有绑定了实物币的库存',
  path: '/ProfessionalCash/api/v1.0/PhysicalCoin/GetAllStockPhysicalCoinList',
  mockPath: '/ProfessionalCash/api/v1.0/PhysicalCoin/GetAllStockPhysicalCoinList',
  params: {
  },
}, {
  name: 'physicalCoinStockAddCoin',
  method: 'POST',
  desc: '加币清币-加币',
  path: '/ProfessionalCash/api/v1.0/PhysicalCoin/PhysicalCoinStockAddCoin',
  mockPath: '/ProfessionalCash/api/v1.0/PhysicalCoin/PhysicalCoinStockAddCoin',
  params: {
    TerminalID: true, // typeName: Guid  desc: 设备ID
    Summary: true, // typeName: String  desc: 备注
    StockID: true, // typeName: Guid  desc: 仓库Id
    Amount: true, // typeName: Number  desc: 加币数量
  },
}];
