export default [{
  name: 'outCoinBeforeSaveFillCoinLog',
  method: 'POST',
  desc: '出币前保存补实物币记录',
  path: '/ProfessionalCash/api/v1.0/PhysicalCoin/OutCoinBeforeSaveFillCoinLog',
  mockPath: '/ProfessionalCash/api/v1.0/PhysicalCoin/OutCoinBeforeSaveFillCoinLog',
  params: {
    OutCoins: true, // typeName: Int  desc: 应出币数
    Summary: false, // typeName: String  desc: 补币原因
    CoinType: true, // typeName: Int  desc: 补币类型
  },
}, {
  name: 'fillCoinLogQuery',
  method: 'POST',
  desc: '补币记录查询',
  path: '/ProfessionalCash/api/v1.0/Coin/FillCoinLogQuery',
  mockPath: '/ProfessionalCash/api/v1.0/Coin/FillCoinLogQuery',
  params: {
    LeaguerID: false, // typeName: Guid  desc: 会员ID
    TerminalID: false, // typeName: Guid  desc: 终端ID
    StartTime: false, // typeName: String  desc: 开始时间
    EndTime: false, // typeName: String  desc: 结束时间
  },
}, {
  name: 'checkPhyCoinModule',
  method: 'POST',
  desc: '判断是否开通实物币模块',
  path: '/ProfessionalCash/api/v1.0/Coin/CheckPhyCoinModule',
  mockPath: '/ProfessionalCash/api/v1.0/Coin/CheckPhyCoinModule',
  params: {
  },
}, {
  name: 'outCoinCompletedUpdateCoinLog',
  method: 'POST',
  desc: '出币完成调用调用修改提币记录',
  path: '/ProfessionalCash/api/v1.0/PhysicalCoin/OutCoinCompletedUpdateCoinLog',
  mockPath: '/ProfessionalCash/api/v1.0/PhysicalCoin/OutCoinCompletedUpdateCoinLog',
  params: {
    LogID: true, // typeName: Guid  desc: 记录ID
    OutCoins: true, // typeName: Number  desc: 实出币数
  },
}, {
  name: 'getFillCoinTypeList',
  method: 'POST',
  desc: '查询补币类型',
  path: '/ProfessionalCash/api/v1.0/Coin/GetFillCoinTypeList',
  mockPath: '/ProfessionalCash/api/v1.0/Coin/GetFillCoinTypeList',
  params: {
  },
}, {
  name: 'completedFillCoinLog',
  method: 'POST',
  desc: '出币完成调用调用修改补实物币记录',
  path: '/ProfessionalCash/api/v1.0/PhysicalCoin/CompletedFillCoinLog',
  mockPath: '/ProfessionalCash/api/v1.0/PhysicalCoin/CompletedFillCoinLog',
  params: {
    LogID: true, // typeName: Guid  desc: 记录ID
    OutCoins: true, // typeName: Int  desc: 实出币数
  },
}, {
  name: 'cancelFillCoin',
  method: 'POST',
  desc: '取消补币',
  path: '/ProfessionalCash/api/v1.0/Coin/CancelFillCoin',
  mockPath: '/ProfessionalCash/api/v1.0/Coin/CancelFillCoin',
  params: {
    LogID: true, // typeName: Guid  desc: 记录ID
  },
}, {
  name: 'outCoinPausedUpdateCoinLog',
  method: 'POST',
  desc: '取消出币调用修改提币记录',
  path: '/ProfessionalCash/api/v1.0/PhysicalCoin/OutCoinPausedUpdateCoinLog',
  mockPath: '/ProfessionalCash/api/v1.0/PhysicalCoin/OutCoinPausedUpdateCoinLog',
  params: {
    LogID: true, // typeName: Guid  desc: 记录ID
    OutCoins: true, // typeName: Number  desc: 已出币数
  },
}, {
  name: 'cancelFillCoinLog',
  method: 'POST',
  desc: '出币取消调用修改补实物币记录',
  path: '/ProfessionalCash/api/v1.0/PhysicalCoin/CancelFillCoinLog',
  mockPath: '/ProfessionalCash/api/v1.0/PhysicalCoin/CancelFillCoinLog',
  params: {
    LogID: true, // typeName: Guid  desc: 记录ID
    OutCoins: true, // typeName: Int  desc: 已出币数
  },
}, {
  name: 'saveFillCoinLog',
  method: 'POST',
  desc: '补币',
  path: '/ProfessionalCash/api/v1.0/Coin/SaveFillCoinLog',
  mockPath: '/ProfessionalCash/api/v1.0/Coin/SaveFillCoinLog',
  params: {
    LeaguerID: true, // typeName: Guid  desc: 会员ID
    GoldCoin: false, // typeName: Number  desc: 金币数
    Coin: true, // typeName: Number  desc: 代币数
    Summary: true, // typeName: String  desc: 备注
    CoinType: true, // typeName: String  desc: 补币类型
  },
}, {
  name: 'checkCoinAndGoodsStock',
  method: 'POST',
  desc: '检查代币和实物币商品库存',
  path: '/ProfessionalCash/api/v1.0/PhysicalCoin/CheckCoinAndGoodsStock',
  mockPath: '/ProfessionalCash/api/v1.0/PhysicalCoin/CheckCoinAndGoodsStock',
  params: {
    LeaguerID: true, // typeName: Guid  desc: 会员ID
    CoinNumber: true, // typeName: Int  desc: 实物币数
  },
}, {
  name: 'outCoinBeforeSaveCoinLog',
  method: 'POST',
  desc: '出币前保存提币记录',
  path: '/ProfessionalCash/api/v1.0/PhysicalCoin/OutCoinBeforeSaveCoinLog',
  mockPath: '/ProfessionalCash/api/v1.0/PhysicalCoin/OutCoinBeforeSaveCoinLog',
  params: {
    LeaguerID: true, // typeName: Guid  desc: 会员ID
    OutCoins: true, // typeName: Number  desc: 应出币数
    Summary: false, // typeName: String  desc: 补币原因
  },
}, {
  name: 'getLeaguerAllBizCoins',
  method: 'POST',
  desc: '获取所属商户的会员代币',
  path: '/ProfessionalCash/api/v1.0/Leaguer/GetLeaguerAllBizCoins',
  mockPath: '/ProfessionalCash/api/v1.0/Leaguer/GetLeaguerAllBizCoins',
  params: {
    LeaguerID: true, // typeName: Guid  desc: 会员ID
  },
}, {
  name: 'getCoinValidByNumber',
  method: 'POST',
  desc: '根据币数获得有效期',
  path: '/ProfessionalCash/api/v1.0/Coin/GetCoinValidByNumber',
  mockPath: '/ProfessionalCash/api/v1.0/Coin/GetCoinValidByNumber',
  params: {
    CoinNumber: true, // typeName: Int  desc: 补币数
  },
}];
