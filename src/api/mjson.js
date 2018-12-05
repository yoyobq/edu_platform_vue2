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

// const mergeArr = (arr1, arr2) => {
//   let merge = []
//   let kvIndex = {}
//   for (var i = 0; i < arr1.length; i++) {
//     for (var j = 0; j < arr2.length; j++) {
//       if (arr1[i].id === arr2[j].id) {
//         var item
//         if (kvIndex[arr1[i].id] === undefined) {
//           kvIndex[arr1[i].id] = merge.length
//           item = {}
//           for (var attr in arr1[i]) item[attr] = arr1[i][attr]
//           merge[kvIndex[arr1[i].id]] = item
//         } else item = merge[kvIndex[arr1[i].id]]
//         for (var attr in arr2[j]) item[attr] = arr2[j][attr]
//       }
//     }
//   }
// }

// 计算数组中特定值出现的次数
const countOccurences = (arr, value) => arr.reduce((a, v) => v === value ? a + 1 : a + 0, 0)

export default {
  f: function (jsonObj) {
    return f(jsonObj)
  },
  // mergeArr: function (arr1, arr2) {
  //   return mergeArr(arr1, arr2)
  // }
  countOccurences: function (arr, value) {
    if (arr === null) {
      arr = [10, 0, 0, 0, 0, 20]
    }
    return countOccurences(arr, value)
  }
}
