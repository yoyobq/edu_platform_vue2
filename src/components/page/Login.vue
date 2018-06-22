<template>
  <div class="login-wrap">
    <div class="ms-title">{{$t('common.loginPage.formTitle')}}</div>
    <div class="ms-login">
      <el-tabs class="ms-form" v-model="activeName">
        <el-tab-pane :label="$t('common.loginPage.tabsAccount')" name="account">
          <el-form :model="loginForm" :rules="rules" ref="loginForm" label-width="0px">
            <el-form-item prop="username">
              <el-input v-model="loginForm.username" prefix-icon="fa fa-user" placeholder="用户名"></el-input>
            </el-form-item>
            <el-form-item prop="password">
              <el-input type="password" prefix-icon="fa fa-lock" :placeholder="$t('common.loginPage.password')" v-model="loginForm.password" @keyup.enter.native="submitForm('loginForm')"></el-input>
            </el-form-item>
            <div class="login-btn">
              <el-button type="primary" @click="submitForm('loginForm')">{{$t('common.loginPage.btnLogin')}}</el-button>
            </div>
            <p style="font-size:12px;line-height:30px;color:#999;">没有账号？请先登记身份信息</p>
          </el-form>
        </el-tab-pane>
        <el-tab-pane :label="$t('common.loginPage.tabsEmail')" name="email">
          <el-form :model="mailLoginForm" :rules="mailRules" ref="mailLoginForm" label-width="0px">
            <el-form-item prop="usermail">
              <el-input v-model="mailLoginForm.usermail" prefix-icon="fa fa-envelope" :placeholder="$t('common.loginPage.email')" ></el-input>
            </el-form-item>
            <el-form-item prop="password">
              <el-input type="password" prefix-icon="fa fa-lock" :placeholder="$t('common.loginPage.password')" v-model="mailLoginForm.password" @keyup.enter.native="submitForm('mailLoginForm')"></el-input>
            </el-form-item>
            <div class="login-btn">
              <el-button type="primary" @click="submitForm('mailLoginForm')">{{$t('common.loginPage.btnLogin')}}</el-button>
            </div>
            <p style="font-size:12px;line-height:30px;color:#999;">没有邮箱账号？请先注册</p>
          </el-form>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
const crypto = require('crypto')
export default {
  data: function () {
    return {
      activeName: 'email',
      loginForm: {
        username: '',
        password: ''
      },
      rules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' }
        ],
        password: [
          { required: true, message: this.$t('message.loginPage.inputPassword'), trigger: 'blur' }
        ]
      },
      mailLoginForm: {
        usermail: '',
        password: ''
      },
      mailRules: {
        usermail: [
          { required: true, message: this.$t('message.loginPage.inputMail'), trigger: 'blur' },
          { type: 'email', message: this.$t('message.loginPage.validMail'), trigger: 'blur' }
        ],
        password: [
          { required: true, message: this.$t('message.loginPage.inputPassword'), trigger: 'blur' }
        ]
      }
    }
  },
  created () {

  },
  methods: {
    submitForm (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let theForm = {}
          if (formName === 'loginForm') {
            theForm.username = this.loginForm.username
            theForm.password = this.loginForm.password
          } else {
            theForm.usermail = this.mailLoginForm.usermail
            theForm.password = this.mailLoginForm.password
          }
          // 将密码加密再传输
          let sha1 = crypto.createHash('sha1')
          sha1.update(theForm.password)
          theForm.password = sha1.digest('hex')
          // 实际使用中我编辑了一个处理axios提交数据的api
          // 好处是，在api里统一格式化提交的数据，处理了错误信息
          // 在这里提供一个直接用axios提交数据的例子
          // this.$axios.get('api/v1/authentications', {
          //   params: { id: 111 },
          //   data: this.loginForm,
          //   transformRequest: this.data
          // })
          //   .then((res) => {
          //     console.log(res)
          //   })
          // 以上是不用api，以下是调用api
          // 参数说明  url， params, success处理， failure处理
          // 提交登录表单
          this.$api.get('api/v1/authentications', theForm, res => {
            // 找到对应帐号
            this.loginSuccess(res[0])
          }, res => {
            // 找不到符合条件的用户账户
            // console.log(res)
            this.$message.error(this.$t('message.loginPage.notFound'))
          })
        }
      })
    },
    loginSuccess (res) {
      // 一旦找到符合条件的用户名和密码，记录 uuid 和 id 到 session
      this.setSession(res)
      // let uuid = res[0].uuid
      let id = res.id
      // 设置本次登录时间，记录登录IP
      let data = { '_csrf': this.$cookies.get('csrfToken') }
      this.$api.put('api/v1/accounts/' + id, data, res => {
        console.log(res)
        console.log(id)
        // 获取对应id的用户信息，将信息存在localStorage中，方便调用
        this.setLocalStorage(id)
        // 跳转至主页
        // this.$router.push('/')
      })
    },
    setSession (res) {
      this.$session.start()
      this.$session.set('uuid', res.uuid)
      this.$session.set('id', res.id)
    },
    setLocalStorage (id) {
      this.$api.get('api/v1/accounts/' + id, null, res => {
        console.log(res)
        // {id: 1, realName: "卜强", accClassId: 3170103, accClassName: "信息1703", lastLoginTime: null,…}
        localStorage.setItem('pf_realName', res.realName)
        localStorage.setItem('pf_classId', res.accClassId)
        localStorage.setItem('pf_className', res.accClassName)
        localStorage.setItem('pf_lastLoginTime', res.lastLoginTime)
        localStorage.setItem('pf_lastLoginIP', res.lastLoginIP)
      })
    }
  }
}
</script>

<style scoped>
.login-wrap{
    position: relative;
    width:100%;
    height:100%;
}
.ms-title{
    position: absolute;
    top:50%;
    width:100%;
    margin-top: -230px;
    text-align: center;
    font-size:30px;
    color: #fff;

}
.ms-login{
    position: absolute;
    left:50%;
    top:50%;
    width:300px;
    height:160px;
    margin:-150px 0 0 -190px;
    padding: 15px 40px 75px 40px;
    border-radius: 5px;
    background: #fff;
}

.ms-form {
    /* padding:0px 0px 0px 0px; */
}
.login-btn{
    text-align: center;
}
.login-btn button{
    width:100%;
    height:36px;
}
</style>