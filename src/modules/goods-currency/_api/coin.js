export default [{
  name: 'saveMaxDicountCoinOrder',
  method: 'POST',
  desc: '保存智能售币订单',
  path: '/ProfessionalCash/api/v1.0/Coin/SaveMaxDicountCoinOrder',
  mockPath: '/ProfessionalCash/api/v1.0/Coin/SaveMaxDicountCoinOrder',
  params: {
    LeaguerID: true, // typeName: Guid  desc: 会员ID
    PayMoney: true, // typeName: Number  desc: 购买金额
    CoinType: true, // typeName: CoinType  desc: 购币类型
  },
}, {
  name: 'getMaxDiscountSellCoinMeal',
  method: 'POST',
  desc: '获取智能售币最大优惠信息',
  path: '/ProfessionalCash/api/v1.0/Coin/GetMaxDiscountSellCoinMeal',
  mockPath: '/ProfessionalCash/api/v1.0/Coin/GetMaxDiscountSellCoinMeal',
  params: {
    LeaguerID: true, // typeName: Guid  desc: 会员ID
    PayMoney: true, // typeName: Number  desc: 购买金额
    CoinType: true, // typeName: CoinType  desc: 购币类型
  },
}];
