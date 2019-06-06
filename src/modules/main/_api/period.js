export default [{
  name: 'getLoginPeriod',
  method: 'POST',
  desc: '获取当前账期与系统日期以及可登录账期',
  path: '/ProfessionalCash/api/v1.0/Period/GetLoginPeriod',
  mockPath: '/ProfessionalCash/api/v1.0/Period/GetLoginPeriod',
  params: {
    IsContainCurrSysDate: true, // typeName: Boolean  desc: 是否包含当前系统时间
  },
}, {
  name: 'getPeriodIsEqToday',
  method: 'POST',
  desc: '客户端的账期是否与服务器当前日期相同',
  path: '/ProfessionalCash/api/v1.0/Period/GetPeriodIsEqToday',
  mockPath: '/ProfessionalCash/api/v1.0/Period/GetPeriodIsEqToday',
  params: {
  },
}, {
  name: 'changeCurrentPeriod',
  method: 'POST',
  desc: '切换当前账期',
  path: '/ProfessionalCash/api/v1.0/Period/ChangeCurrentPeriod',
  mockPath: '/ProfessionalCash/api/v1.0/Period/ChangeCurrentPeriod',
  params: {
    PeriodID: true, // typeName: Guid  desc: 账期ID
  },
}];
