<template>
  <div class="login-wrap">
    <el-dialog :title="$t('common.signUp.formTitle')" :visible.sync="registerFormVisible" :close-on-click-modal="allowClose" :close-on-press-escape="allowClose" :show-close="allowClose" width="500px">
      <el-form :model="registerForm" :rules="formRules" ref="registerForm">
        <el-form-item :label="$t('common.signUp.userName')" :label-width="formLabelWidth" prop="username">
          <el-input v-model.trim="registerForm.username" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item :label="$t('common.signUp.password')" :label-width="formLabelWidth" prop="password">
          <el-input :type="registerPassword" v-model.trim="registerForm.password" auto-complete="off">
            <el-button slot="append" :icon="passwordIcon" @click="changeType()"></el-button>
          </el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="registerFormCancel()">{{$t('common.signUp.registerCancel')}}</el-button>
        <el-button type="primary" @click="checkInput()">{{$t('common.signUp.registerConfirm')}}</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
const crypto = require('crypto')
export default {
  data: function () {
    return {
      registerFormVisible: false,
      registerPassword: 'password',
      passwordIcon: 'fa fa-eye',
      allowClose: false,
      registerForm: {
        username: '',
        password: ''
      },
      formLabelWidth: '150px',
      formRules: {
        username: [
          { required: true, message: this.$t('message.signUp.inputName'), trigger: 'blur' },
          {
            pattern: /^[a-zA-Z0-9_.]{4,16}$/,
            message: this.$t('message.signUp.invalidName'),
            trigger: 'blur'
          }
        ],
        password: [
          { required: true, message: this.$t('message.signUp.inputPassword'), trigger: 'blur' },
          { min: 6, message: this.$t('message.signUp.minPassword'), trigger: 'blur' }
        ]
      }
    }
  },
  created () {
    // this.signUp()
    this.registerFormVisible = true
  },
  methods: {
    changeType () {
      if (this.registerPassword === 'password') {
        this.registerPassword = 'text'
        this.passwordIcon = 'fa fa-eye-slash'
      } else {
        this.registerPassword = 'password'
        this.passwordIcon = 'fa fa-eye'
      }
    },
    registerFormCancel () {
      this.registerFormVisible = false
      this.$message({
        type: 'info',
        message: '取消输入'
      })
      this.$router.push('/login')
    },
    checkInput () {
      this.$refs['registerForm'].validate((valid) => {
        if (valid) {
          // console.log(this.registerForm)
          // 检查帐号是否存在
          let data = { 'username': this.registerForm.username }
          this.$api.get('api/v1/authentications', data, res => {
            // console.log(res)
            this.$message({
              type: 'warning',
              message: this.$t('message.signUp.isFound')
            })
          },
          res => {
            // 若不存在，登录注册信息
            let data = {
              '_csrf': this.$cookies.get('csrfToken'),
              'username': this.registerForm.username,
              'password': this.registerForm.password
            }
            let sha1 = crypto.createHash('sha1')
            sha1.update(data.password)
            data.password = sha1.digest('hex')
            // console.log(data)
            this.$api.post('api/v1/authentications', data, res => {
              this.$message({
                type: 'success',
                message: data.username + ' ' + this.$t('message.signUp.isCreated')
              }).then(() => {
                this.$router.push('/login')
              })
            })
          })
        }
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