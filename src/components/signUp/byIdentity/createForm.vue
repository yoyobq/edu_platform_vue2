<template>
  <el-dialog title="第 3 步（共 3 步）：建立帐号并完成注册" :visible.sync="createShow" width="500px" :close-on-click-modal="false" :close-on-press-escape="false" :show-close="false">
    <el-form :model="authInfo" :rules="authRules" ref="authInfo">
      <el-form-item :label="$t('common.signUp.userName')" :label-width="formLabelWidth" prop="username">
        <el-input v-model.trim="authInfo.username" auto-complete="off"></el-input>
      </el-form-item>
      <el-form-item :label="$t('common.signUp.password')" :label-width="formLabelWidth" prop="password" width="150px">
        <el-input :type="registerPassword" v-model.trim="authInfo.password" auto-complete="off">
          <el-button slot="append" :icon="passwordIcon" @click="changeType()"></el-button>
        </el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <!-- <el-button @click="cancelAll()">{{$t('common.signUp.registerCancel')}}</el-button> -->
      <el-button @click="cancelSignUp">回到上一步</el-button>
      <el-button type="primary" @click="signUp()">{{$t('common.signUp.registerConfirm')}}</el-button>
    </div>
  </el-dialog>
</template>
<script>
const crypto = require('crypto')
export default {
  name: 'createForm',
  props: ['createShow', 'data'],
  data: function () {
    return {
      stuInfo: {},
      registerPassword: 'password',
      passwordIcon: 'fa fa-eye',
      formLabelWidth: '100px',
      authInfo: {
        username: '',
        password: ''
      },
      authRules: {
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
  methods: {
    async signUp () {
      // console.log(this.authInfo)
      let isSignUp = await this.checkInput()
      if (!isSignUp) {
        // 若不存在，登录注册信息
        let id = await this.createAuthInfo()
        await this.createStuInfo(id.insertId)
        this.$message({
          type: 'success',
          message: '帐号生成成功，请登录'
        })
        this.$router.push('/login')
      }
    },
    createAuthInfo () {
      return new Promise((resolve, reject) => {
        let data = {
          _csrf: this.$cookies.get('csrfToken'),
          data: {
            username: this.authInfo.username,
            password: this.authInfo.password,
            realName: this.stuInfo.realName
          }
        }
        let sha1 = crypto.createHash('sha1')
        sha1.update(data.data.password)
        data.data.password = sha1.digest('hex')
        this.$api.post('authentications', data, res => {
          resolve(res)
        }, res => {
          reject(new Error('auth注册失败'))
        })
      })
    },
    createStuInfo (id) {
      return new Promise((resolve, reject) => {
        this.stuInfo.id = id
        let data = {
          _csrf: this.$cookies.get('csrfToken'),
          data: this.stuInfo
        }
        this.$api.post('stuInfos', data, res => {
          resolve(res)
        }, res => {
          reject(new Error('stuInfo注册失败'))
        })
      })
    },
    checkInput () {
      return new Promise((resolve, reject) => {
        this.$refs['authInfo'].validate(async (valid) => {
          if (valid) {
            console.log(this.authInfo)
            // 检查帐号是否存在
            if (await this.checkUsername()) {
              this.$message({
                type: 'warning',
                message: this.stuInfo.username + '已注册，若不是本人，请及时联系管理员'
              })
              resolve(true)
            } else if (await this.checkIdNumber()) {
              this.$message({
                type: 'warning',
                message: '身份证:' + this.stuInfo.idNumber + '，已注册，若不是本人，请及时联系管理员'
              })
              resolve(true)
            } else {
              resolve(false)
            }
          }
        })
      })
    },
    // 检查 auth 表中的 username 是否重复
    checkUsername () {
      return new Promise((resolve, reject) => {
        let data = { 'username': this.authInfo.username }
        this.$api.get('authentications', data, res => {
          resolve(true)
        },
        res => {
          if (res.status === 404) {
            resolve(false)
          } else {
            reject(new Error('服务器错误'))
          }
        })
      })
    },
    // 检查 stuInof 表中的 idNumber 是否重复
    checkIdNumber () {
      return new Promise((resolve, reject) => {
        // 检查帐号是否存在
        let data = { 'idNumber': this.stuInfo.idNumber }
        this.$api.get('stuInfos', data, res => {
          resolve(true)
        },
        res => {
          if (res.status === 404) {
            resolve(false)
          } else {
            reject(new Error('服务器错误'))
          }
        })
      })
    },
    cancelSignUp () {
      this.$emit('update:createShow', false)
    },
    changeType () {
      if (this.registerPassword === 'password') {
        this.registerPassword = 'text'
        this.passwordIcon = 'fa fa-eye-slash'
      } else {
        this.registerPassword = 'password'
        this.passwordIcon = 'fa fa-eye'
      }
    },
    parseTinyInt (data) {
      return data === '是' ? 1 : 0
    },
    sexToTinyInt (sex) {
      return sex === '男' ? 1 : 0
    },
    getDepartmentId (departmentName) {
      let data = {
        departmentName: departmentName
      }
      return new Promise((resolve, reject) => {
        this.$api.get('departments', data, res => {
          resolve(res[0].id)
        }, res => {
          reject(new Error('获取系部信息出错'))
        })
      })
    },
    getClassId (className) {
      let data = {
        className: className
      }
      // console.log(data)
      return new Promise((resolve, reject) => {
        this.$api.get('classInfos', data, res => {
          resolve(res[0].id)
        }, res => {
          reject(new Error('获取班级信息出错'))
        })
      })
    },
    getSpecId (specName) {
      let data = {
        specName: specName
      }
      // console.log(data)
      return new Promise((resolve, reject) => {
        this.$api.get('specialities', data, res => {
          resolve(res[0].id)
        }, res => {
          reject(new Error('获取专业信息出错'))
        })
      })
    }
  },
  watch: {
    // chkInfoShow 与 chkInfoVisible 父子组件联动
    createShow: async function () {
      this.stuInfo.idNumber = this.data.证件号码
      this.stuInfo.stuId = this.data.学号
      this.stuInfo.realName = this.data.姓名
      this.stuInfo.sex = this.sexToTinyInt(this.data.性别)
      this.stuInfo.grade = this.data.所在年级
      this.stuInfo.departmentId = await this.getDepartmentId(this.data.所在学部)
      this.stuInfo.specialityId = await this.getSpecId(this.data.所在专业)
      this.stuInfo.classId = await this.getClassId(this.data.所在班级)
      this.stuInfo.isInSchoolRoll = this.parseTinyInt(this.data.是否在籍)
      this.stuInfo.isStuding = this.parseTinyInt(this.data.是否在校)
      this.stuInfo.isStay = this.parseTinyInt(this.data.是否住宿)
      this.stuInfo.isInternship = this.parseTinyInt(this.data.是否下厂实习)
      this.stuInfo.eduBack = this.data.入学层次
      // console.log(this.stuInfo)
    },
    data: function () {
    }
  },
  computed: {

  }
}
</script>

<style scoped>
  .clearfix:before,
  .clearfix:after {
    display: table;
    content: "";
  }
  .clearfix:after {
    clear: both
  }

  .name-text{
    font-size: 20px;
    font-weight: 500;
    color: #409EFF;
    padding-right: 30px;
  }

  .card-button {
    float: right;
    /* padding: 3px 0; */
    font-size: 12px;
  }

  .stu-card {
    /* width: 200px; */
  }

  .stu-ul {
    list-style-type: none;
    font-size: 12px;
    font-weight: 500;
  }

  .stu-ul li {
    padding-right: 30px;
    display: inline;
  }

  .el-input {
    width: 80%;
  }
</style>
