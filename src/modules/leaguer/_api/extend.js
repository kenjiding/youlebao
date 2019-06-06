export default [{
  name: 'getExChangeLogListForPro',
  method: 'POST',
  desc: '会员兑换记录查询',
  path: '/ProfessionalCash/api/v1.0/Exchange/GetExChangeLogListForPro',
  mockPath: '/ProfessionalCash/api/v1.0/Exchange/GetExChangeLogListForPro',
  params: {
    LeaguerID: true, // typeName: Guid  desc: 会员ID
    PageInfo: true, // typeName: PageInfo  desc:
  },
}, {
  name: 'getLeagerPlayLog',
  method: 'POST',
  desc: '游乐消费历史查询',
  path: '/ProfessionalCash/api/v1.0/Game/LeaguerPlayLog',
  mockPath: '/ProfessionalCash/api/v1.0/Game/LeaguerPlayLog',
  params: {
    DateRange: false, // typeName: DateRange  desc: 日期范围
    PageInfo: true, // typeName: PageInfo  desc: 分页
    StartDate: false, // typeName: String  desc: 开始时间
    EndTime: false, // typeName: String  desc: 结束时间
    LeaguerID: false, // typeName: Guid  desc: 会员ID
    MachineID: false, // typeName: Guid  desc: 项目ID
  },
}];
