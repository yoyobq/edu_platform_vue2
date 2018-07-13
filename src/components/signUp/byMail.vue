<template>
  <div class="login-wrap">
  </div>
</template>

<script>
// const crypto = require('crypto')
const mailer = require('nodemailer')
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
    this.sendMail()
  },
  methods: {
    open3 () {
      this.$prompt('请输入邮箱', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputPattern: /[\w!#$%&'*+/=?^_`{|}~-]+(?:\.[\w!#$%&'*+/=?^_`{|}~-]+)*@(?:[\w](?:[\w-]*[\w])?\.)+[\w](?:[\w-]*[\w])?/,
        inputErrorMessage: '邮箱格式不正确'
      }).then(({ value }) => {
        this.$message({
          type: 'success',
          message: '你的邮箱是: ' + value
        })
        // this.sendMail()
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '取消输入'
        })
        this.$router.push('/login')
      })
    },
    aa () {
      var transporter = mailer.createTransport({
        service: 'qq',
        auth: {
          user: '527828938@qq.com',
          pass: 'ugxovfwhvxxxxxx' // 授权码,通过QQ获取

        }
      })
      var mailOptions = {
        from: '527828938@qq.com', // 发送者
        to: '452076103@qq.com', // 接受者,可以同时发送多个,以逗号隔开
        subject: 'nodemailer2.5.0邮件发送', // 标题
        text: 'Hello world' // 文本
        // html: 'hi'
      }

      transporter.sendMail(mailOptions, function (err, info) {
        if (err) {
          console.log(err)
          return
        }
        console.log('发送成功')
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
    background-color: #324157;
}
</style>