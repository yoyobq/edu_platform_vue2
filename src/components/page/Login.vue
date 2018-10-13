<template>
  <div class="login-wrap">
    <div class="ms-title">{{$t('common.loginPage.formTitle')}}</div>
    <div class="ms-login">
      <el-tabs class="ms-form" v-model="activeName">
        <el-tab-pane :label="$t('common.loginPage.tabsAccount')" name="account">
          <el-form :model="loginForm" :rules="rules" ref="loginForm" label-width="0px">
            <el-form-item prop="username">
              <el-input v-model="loginForm.username" prefix-icon="fa fa-user" :placeholder="$t('common.loginPage.username')"></el-input>
            </el-form-item>
            <el-form-item prop="password">
              <el-input type="password" prefix-icon="fa fa-lock" :placeholder="$t('common.loginPage.password')" v-model="loginForm.password" @keyup.enter.native="submitForm('loginForm')"></el-input>
            </el-form-item>
            <div class="login-btn">
              <el-button type="primary" @click="submitForm('loginForm')">{{$t('common.loginPage.btnLogin')}}</el-button>
            </div>
            <el-button type="text" class="reg-info" @click="signUp()" ><i class="fa fa-user-plus"></i> {{$t('common.loginPage.verify')}}</el-button>
          </el-form>
        </el-tab-pane>
        <!-- <el-tab-pane :label="$t('common.loginPage.tabsEmail')" name="email">
          <el-form :model="mailLoginForm" :rules="mailRules" ref="mailLoginForm" label-width="0px">
            <el-form-item prop="usermail">
              <el-input v-model="mailLoginForm.usermail" prefix-icon="fa fa-envelope" :placeholder="$t('common.loginPage.email')"></el-input>
            </el-form-item>
            <el-form-item prop="password">
              <el-input type="password" prefix-icon="fa fa-lock" :placeholder="$t('common.loginPage.password')" v-model="mailLoginForm.password" @keyup.enter.native="submitForm('mailLoginForm')"></el-input>
            </el-form-item>
            <div class="login-btn">
              <el-button type="primary" @click="submitForm('mailLoginForm')">{{$t('common.loginPage.btnLogin')}}</el-button>
            </div>
            <el-button type="text" class="reg-info" @click="signUpByMail()"><i class="fa fa-user-plus"></i> {{$t('common.loginPage.regsiter')}}</el-button>
          </el-form>
        </el-tab-pane> -->
      </el-tabs>
    </div>
  </div>
</template>

<script>
const crypto = require('crypto')
export default {
  data: function () {
    return {
      activeName: 'account',
      loginForm: {
        username: '',
        password: ''
      },
      rules: {
        username: [
          { required: true, message: this.$t('message.loginPage.inputName'), trigger: 'blur' }
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
        // console.log(res)
        // 获取对应id的用户信息，将信息存在localStorage中，方便调用
        this.setLocalStorage(id)
        // 跳转至主页
        // this.$router.push('/')
      })
    },
    setSession (res) {
      sessionStorage.setItem('uuid', res.uuid)
      sessionStorage.setItem('id', res.id)
    },
    setLocalStorage (id) {
      this.$api.get('api/v1/accounts/' + id, null, res => {
        // {id: 1, realName: "卜强", accClassId: 3170103, accClassName: "信息1703", lastLoginTime: null,…}
        localStorage.setItem('pf_realName', res.realName)
        localStorage.setItem('pf_classId', res.accClassId)
        localStorage.setItem('pf_className', res.accClassName)
        localStorage.setItem('pf_lastLoginTime', res.lastLoginTime)
        localStorage.setItem('pf_lastLoginIP', res.lastLoginIP)
        localStorage.setItem('pf_avatarPath', res.avatarPath)
        sessionStorage.setItem('permission', this.computePermission(res.permission))
        this.$router.push('/')
      })
    },
    signUpByMail () {
      this.$router.push('/signUpByMail')
    },
    signUp () {
      this.$router.push('/signUpByIdentity')
    },
    computePermission (permission) {
      permission = JSON.parse(permission)
      // console.log(permission)
      let result = permission[0]
      for (let i = 1; i < permission.length; i++) {
        result = {...result, ...permission[i]}
      }
      // console.log(typeof result)
      return JSON.stringify(result)
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
    padding: 15px 40px 85px 40px;
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

.reg-info {
  padding-top: 20px;
  /* font-size: 14px;
  line-height:30px;
  color: #C0C4CC; */
  float: right;
}
</style>