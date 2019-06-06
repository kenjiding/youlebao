export default [
  {
    name: 'getTicketsPrintsPrintInfo',
    method: 'POST',
    desc: '订单套票批量打印',
    path: '/ProfessionalCash/api/v1.0/Ticket/GetTicketsPrintsPrintInfo',
    mockPath: '/ProfessionalCash/api/v1.0/Ticket/GetTicketsPrintsPrintInfo',
    params: {
      PackageTicketLogIDs: true, // typeName: Guid  desc: 销售记录ID
    },
  }, {
    name: 'getTicketsPrints',
    method: 'POST',
    desc: '套票批量打印',
    path: '/ProfessionalCash/api/v1.0/Ticket/GetTicketsPrints',
    mockPath: '/ProfessionalCash/api/v1.0/Ticket/GetTicketsPrints',
    params: {
      PackageTicketLogIDs: true, // typeName: Guid  desc: 销售记录ID
    },
  }, {
    name: 'getTicketSaleLogByOrder',
    method: 'POST',
    desc: '通过订单获取套票销售记录',
    path: '/ProfessionalCash/api/v1.0/Ticket/GetTicketSaleLogByOrder',
    mockPath: '/ProfessionalCash/api/v1.0/Ticket/GetTicketSaleLogByOrder',
    params: {
      OrderID: true, // typeName: Guid  desc: 订单编号
    },
  }];
