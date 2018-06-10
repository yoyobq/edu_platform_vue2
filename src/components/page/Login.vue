<template>
  <div class="login-wrap">
    <div class="ms-title">SSTS 教学平台</div>
    <div class="ms-login">
      <el-form :model="loginForm" :rules="rules" ref="loginForm" label-width="0px" class="demo-loginForm">
        <el-form-item prop="username">
          <el-input v-model="loginForm.username" prefix-icon="fa fa-user" placeholder="用户名"></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input type="password" prefix-icon="fa fa-lock" placeholder="密码" v-model="loginForm.password" @keyup.enter.native="submitForm('loginForm')"></el-input>
        </el-form-item>
        <div class="login-btn">
          <el-button type="primary" @click="submitForm('loginForm')">登录</el-button>
        </div>
        <!-- <p style="font-size:12px;line-height:30px;color:#999;">没有账号？请先注册</p> -->
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  data: function () {
    return {
      loginForm: {
        username: '',
        password: ''
      },
      rules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' }
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
          this.$api.get('api/v1/authentications', this.loginForm, res => {
            // 一旦找到符合条件的用户名和密码，记录 uuid 和 id 到 session
            let uuid = res[0].uuid
            let id = res[0].id
            this.$session.set('id', id)
            this.$session.set('uuid', uuid)
            // 设置本次登录时间，记录登录IP
            let data = {
              '_csrf': this.$cookies.get('csrfToken')
            }
            this.$api.put('api/v1/accounts/' + id, data, res => {
              console.log(res)
              this.$api.get('api/v1/accounts/' + id, null, res => {
                // {id: 1, realName: "卜强", accClassId: 3170103, accClassName: "信息1703", lastLoginTime: null,…}
                localStorage.setItem('pf_username', this.loginForm.username)
                localStorage.setItem('pf_realName', res.realName)
                localStorage.setItem('pf_lastLoginTime', res.lastLoginTime)
                localStorage.setItem('pf_lastLoginIP', res.lastLoginIP)
                this.$router.push('/')
              })
            })
          }, res => {
            // console.log(res)
            this.$message.error(res)
          })
        }
      })
    },
    setSession (uuid, id) {
      this.$session.start()
      this.$session.set('uuid', uuid)
      this.$session.set('id', id)
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
    padding:40px;
    border-radius: 5px;
    background: #fff;
}
.login-btn{
    text-align: center;
}
.login-btn button{
    width:100%;
    height:36px;
}
</style>