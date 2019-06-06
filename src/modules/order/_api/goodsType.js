export default [{
  name: 'getGoodsTypeList',
  method: 'POST',
  desc: '获取商品类型下拉',
  path: '/ProfessionalCash/api/v1.0/Goods/GetGoodsTypeList',
  mockPath: '/ProfessionalCash/api/v1.0/Goods/GetGoodsTypeList',
  params: {
    ExcludeTypes: false, // typeName: String  desc: 包含的商品类型，以"，"连接的字符串
    IncludeTypes: false, // typeName: String  desc: 排除的商品类型，以"，"连接的字符串
  },
}];
