/*
 * mjson，m代表manange，或者my
 * 因为在交换数据时需要处理各种json字符串或obj的情况越来越多
 * 因此添加了这个私有的json api
 * code by alex @2018
*/

// f: JSONobj遍历，用于测试api可用性
const f = (jsonObj) => {
  for (let index in jsonObj) {
    console.log(index)
  }
}

// 合并json代码，时间长远懒得看，先弃用
// computePermission (permission) {
//   permission = JSON.parse(permission)
//   // console.log(permission)
//   let result = permission[0]
//   for (let i = 1; i < permission.length; i++) {
//     result = {...result, ...permission[i]}
//   }
//   // console.log(typeof result)
//   return JSON.stringify(result)
// }

export default {
  f: function (jsonObj) {
    return f(jsonObj)
  }
}
