import Vue from 'vue'
import App from './App'
import router from './router'
// import axios from 'axios'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css' // 默认主题
// import '../static/css/theme-green/index.css'; // 浅绿色主题
import 'font-awesome/css/font-awesome.css'
import 'babel-polyfill' // ie8兼容
import VueSession from 'vue-session'
// import apiv1 from './api/v1.js'
import apiv2 from './api/v2.js'
import mjson from './api/mjson.js'
import VueCookies from 'vue-cookies'
import VueI18n from 'vue-i18n' // 国际化插件
// import Crypto from 'crypto'
import Moment from 'moment'

// Vue.use(apiv1)
// Vue.prototype.$apiv1 = apiv1
Vue.use(apiv2)
Vue.prototype.$api = apiv2
Vue.use(mjson)
Vue.prototype.$mjson = mjson

Vue.use(VueCookies)
Vue.use(VueSession)
Vue.use(ElementUI, { size: 'small' })
Vue.use(VueI18n)
// Vue.use(Crypto)
Vue.prototype.$moment = Moment
// Vue.prototype.$axios = axios

// 使用钩子函数对路由进行权限跳转
router.beforeEach((to, from, next) => {
  const role = JSON.parse(sessionStorage.getItem('permission'))
  // 若是注册登录页面，无须验证session
  let session = JSON.parse(sessionStorage.getItem('vue-session-key'))
  // console.log(session)
  if (to.path === '/signUpByMail' || to.path === '/signUpByAccount' || to.path === '/signUpByIdentity' || to.path === '/login') {
    next()
  // 否则验证session是否存在，不存在就去登录页面
  } else if (session === null) {
    console.log(session)
    next('/login')
  // session中的permission不存在
  // } else if (!role && to.path !== '/login') {
  //   next('/login')
  // // permission存在但目的地是login
  } else if (role && to.path === '/login') {
    next('/')
  } else if (to.meta.permission) {
    // 如果是管理员权限则可进入，这里只是简单的模拟管理员权限而已
    role.status === 'Admin' ? next() : next('/403')
  } else {
    // 简单的判断IE10及以下不进入富文本编辑器，该组件不兼容
    if (navigator.userAgent.indexOf('MSIE') > -1 && to.path === '/editor') {
      Vue.prototype.$alert('vue-quill-editor组件不兼容IE10及以下浏览器，请使用更高版本的浏览器查看', '浏览器不兼容通知', {
        confirmButtonText: '确定'
      })
    } else {
      next()
    }
  }
})

// 注册i18n实例，并引入语言文件
const i18n = new VueI18n({
  locale: 'zh',
  messages: {
    'zh': require('./assets/languages/zh.json'),
    'en': require('./assets/languages/en.json')
  }
})

new Vue({
  router,
  i18n,
  render: h => h(App)
}).$mount('#app')
