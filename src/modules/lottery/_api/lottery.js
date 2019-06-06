export default [
  {
    name: 'lotTempStorage',
    method: 'POST',
    desc: '彩票暂存',
    path: '/ProfessionalCash/api/v1.0/Lottery/LotTempStorage',
    mockPath: '/ProfessionalCash/api/v1.0/Lottery/LotTempStorage',
    params: {
      LeaguerID: true, // typeName: Guid  desc: 会员ID
      StorageNumber: true, // typeName: Int  desc: 彩票数量
      Summary: true, // typeName: String  desc: 备注
    },
  },
  {
    name: 'getLotTempTicket',
    method: 'POST',
    desc: '获取彩票暂存信息',
    path: '/ProfessionalCash/api/v1.0/Lottery/GetLotTempTicket',
    mockPath: '/ProfessionalCash/api/v1.0/Lottery/GetLotTempTicket',
    params: {
      LotNumber: true, // typeName: String  desc: 记录ID或暂存码
    },
  },
  {
    name: 'takeLotTempTicket',
    method: 'POST',
    desc: '取彩票',
    path: '/ProfessionalCash/api/v1.0/Lottery/TakeLotTempTicket',
    mockPath: '/ProfessionalCash/api/v1.0/Lottery/TakeLotTempTicket',
    params: {
      LeaguerID: true, // typeName: Guid  desc: 会员ID
      LotNumber: true, // typeName: String  desc: 记录ID或暂存码
    },
  },
  {
    name: 'getTempTicketList',
    method: 'POST',
    desc: '彩票暂存记录查询',
    path: '/ProfessionalCash/api/v1.0/Lottery/GetTempTicketList',
    mockPath: '/ProfessionalCash/api/v1.0/Lottery/GetTempTicketList',
    params: {
      DateRange: false, // typeName: String  desc: 时间范围类型
      StartTime: false, // typeName: String  desc: 开始时间
      EndTime: false, // typeName: String  desc: 结束时间
      HasTaked: false, // typeName: String  desc: 是否已取
      LeaguerId: false, // typeName: Guid  desc: 存票会员ID
      TakeOutLeaguer: false, // typeName: Guid  desc: 取票会员ID
      LotNumber: false, // typeName: String  desc: 票号
      PageInfo: true,
    },
  },
];

