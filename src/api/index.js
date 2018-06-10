// 配置API接口地址
var root = '/'
// 引用axios
var axios = require('axios')
// 自定义判断元素类型JS
function toType (obj) {
  return ({}).toString.call(obj).match(/\s([a-zA-Z]+)/)[1].toLowerCase()
}
// 参数过滤函数
function filterNull (o) {
  for (var key in o) {
    // 如果是空值，删除此项
    if (o[key] === null) {
      delete o[key]
    }
    // 如果是字符串，去除首位空格，
    // 如果是对象，数组，递归调用本过滤函数
    if (toType(o[key]) === 'string') {
      o[key] = o[key].trim()
    } else if (toType(o[key]) === 'object') {
      o[key] = filterNull(o[key])
    } else if (toType(o[key]) === 'array') {
      o[key] = filterNull(o[key])
    }
  }
  return o
}
/*
  接口处理函数
  这个函数每个项目都是不一样的，我现在调整的是适用于
  http://127.0.0.1:7001/api 的接口，如果是其他接口
  需要根据接口的参数进行调整。出错就是简单的alert。
*/

function apiAxios (method, url, params, success, failure) {
  if (params) {
    params = filterNull(params)
    // console.log(params)
  }
  axios({
    method: method,
    url: url,
    // 此处有个天坑请注意，get请求是不带body的，什么params，什么body，统统处理成query，别去找了
    // data: method === 'POST' || method === 'PUT' || method === 'PATCH' ? params : null,
    // params: method === 'GET' || method === 'DELETE' ? params : null,
    params: params,
    baseURL: root,
    withCredentials: false
  })
    .then(function (res) {
      // 按照接口设计，所有的错误都作为html错误抛出
      // 因此，这里只会收到正确的数据，直接输出
      success(res.data)
    })
    .catch((error) => {
      let res = error.response
      if (res && res.status !== 504) {
        // console.log(error.response)
        if (res.data.detail.message) {
          failure(res.data.detail.message)
        }
      } else {
        failure('连接超时，请稍待片刻或联系网站管理员')
      }
    })
}

// 返回在vue模板中的调用接口
export default {
  get: function (url, params, success, failure) {
    return apiAxios('GET', url, params, success, failure)
  },
  post: function (url, params, success, failure) {
    return apiAxios('POST', url, params, success, failure)
  },
  put: function (url, params, success, failure) {
    return apiAxios('PUT', url, params, success, failure)
  },
  delete: function (url, params, success, failure) {
    return apiAxios('DELETE', url, params, success, failure)
  }
  // patch: function (url, params, success, failure) {
  //   return apiAxios('PATCH', url, params, success, failure)
  // }
}
