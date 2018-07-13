<template>
    <div class="table">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-setting"></i>{{$t('common.personal.title')}}</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
          <el-alert v-if="isGuest" :title="$t('message.personal.guestInfo')" type="error"></el-alert>
          <el-alert v-if="permission.status === 'Teacher' && permission.module === undefined" :title="$t('message.personal.teacherInfo')" type="error"></el-alert>
          <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="200px" size="medium" >
              <el-form-item :label="$t('common.personal.myPermission')" prop="type">
              <el-radio-group v-if="permission.status==='Guest'" v-model="ruleForm.type">
                <el-radio-button label="Assitant" name="type" value="Assitant" border>{{$t('common.personal.assitant')}}</el-radio-button>
                <el-radio-button label="Teacher" name="type" value="Teacher" border>{{$t('common.personal.teacher')}}</el-radio-button>
                <el-radio-button v-if="ruleForm.type === 'Admin'" label="Admin" name="type" value="Admin" border>{{$t('common.personal.admin')}}</el-radio-button>
                <!-- <el-radio-button label="Guest" name="type" value="Guest" border>访客</el-radio-button> -->
              </el-radio-group>
              <div v-else>{{ permission.status }}</div>
            </el-form-item>
            <el-form-item :label="$t('common.personal.name')" prop="realName">
              <el-input v-if="isGuest" v-model="ruleForm.realName" :placeholder="$t('message.personal.phName')"></el-input>
              <div v-else>{{ ruleForm.realName }}</div>
            </el-form-item>
            <el-form-item v-if="ruleForm.type !== 'Teacher'" :label="$t('common.personal.degree')" prop="highestDegree">
              <!-- undergraduate, Master Student, PhD Student -->
              <el-select v-model="ruleForm.highestDegree" :placeholder="$t('message.personal.phDegree')">
                <el-option :label="$t('common.personal.undergrauate')" value="undergraduate">{{ $t('common.personal.undergrauate') }}</el-option>
                <el-option :label="$t('common.personal.masterStudent')" value="masterStudent">{{ $t('common.personal.masterStudent') }}</el-option>
                <el-option :label="$t('common.personal.PhDStudent')" value="PhDStudent">{{ $t('common.personal.PhDStudent') }}</el-option>
              </el-select>
            </el-form-item>
            <el-form-item :label="$t('common.personal.department')" prop="department">
              <el-autocomplete
                class="inline-input"
                v-model="ruleForm.department"
                :fetch-suggestions="departmentSearch"
                :placeholder="$t('message.personal.phDepartment')"
              ></el-autocomplete>
            </el-form-item>
            <el-form-item :label="$t('common.personal.school')" prop="school">
              <el-autocomplete 
                v-model="ruleForm.school" 
                :placeholder="$t('message.personal.phSchool')"
                :fetch-suggestions="schoolSearch"
              ></el-autocomplete>
            </el-form-item>
            <el-form-item :label="$t('common.personal.eMail')" prop="email">
              <el-input v-model="ruleForm.email" :placeholder="$t('message.personal.phEmail')"></el-input>
            </el-form-item>
            <el-form-item :label="$t('common.personal.phone')" prop="cellphone">
              <el-input v-model="ruleForm.cellphone" :placeholder="$t('message.personal.phCellPhone')"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button @click="resetForm('ruleForm')">{{$t('common.personal.reset')}}</el-button>
              <el-button v-if="isGuest" type="primary" @click="submitForm()">{{$t('common.personal.submit')}}</el-button>
              <template v-else>
                <el-button type="warning" @click="submitForm()">{{$t('common.personal.modify')}}</el-button>
                <el-button type="primary" @click="changePass()">{{$t('common.personal.changePass')}}</el-button>
              </template>
            </el-form-item>
          </el-form>
        </div>
    </div>
</template>

<script>
const crypto = require('crypto')
export default {
  name: 'basetable',
  data () {
    return {
      id: sessionStorage.getItem('id'),
      permission: JSON.parse(sessionStorage.getItem('permission')),
      isGuest: true,
      isValid: false,
      ruleForm: {
        realName: '',
        highestDegree: '',
        department: '',
        type: '',
        school: '',
        email: '',
        cellphone: ''
      },
      rules: {
        realName: [
          { required: true, message: this.$t('message.personal.inputName'), trigger: 'blur' },
          { min: 2, max: 50, message: this.$t('message.personal.nameLength'), trigger: 'blur' }
        ],
        highestDegree: [
          { required: true, message: this.$t('message.personal.phDegree'), trigger: 'change' }
        ],
        department: [
          { required: true, message: this.$t('message.personal.phDepartment'), trigger: 'change' }
        ],
        school: [
          { required: true, message: this.$t('message.personal.phSchool'), trigger: 'change' }
        ],
        type: [
          { required: true, message: this.$t('message.personal.phType'), trigger: 'change' }
        ],
        email: [
          { required: true, message: this.$t('message.personal.phEmail'), trigger: 'blur' },
          {
            pattern: /[\w!#$%&'*+/=?^_`{|}~-]+(?:\.[\w!#$%&'*+/=?^_`{|}~-]+)*@(?:[\w](?:[\w-]*[\w])?\.)+[\w](?:[\w-]*[\w])?/,
            message: this.$t('message.personal.mailForm'),
            trigger: 'blur'
          }
        ],
        cellphone: [
          { required: true, message: this.$t('message.personal.phCellPhone'), trigger: 'blur' },
          {
            pattern: /^[\d-]+$/,
            message: this.$t('message.personal.phoneForm'),
            trigger: 'blur'
          }
        ]
      },
      departments: []
    }
  },
  async created () {
    if (this.permission.status !== 'Guest') {
      this.ruleForm.realName = localStorage.getItem('pf_realName')
      this.isGuest = false
      await this.getPersonalData()
      this.ruleForm.type = this.permission.status
      // console.log(this.permission.status)
      // console.log(this.ruleForm.type)
    }
  },
  computed: {
  },
  methods: {
    getPersonalData () {
      this.$api.get('api/v1/informations/' + this.id, null, res => {
        // this.ruleForm.realName = localStorage.getItem('pf_realName')
        this.ruleForm.cellphone = res.cellphone
        this.ruleForm.department = res.department
        this.ruleForm.email = res.email
        this.ruleForm.highestDegree = res.highestDegree
        this.ruleForm.school = res.school
      }, res => {
        // 找不到符合条件的用户账户
        // console.log(res)
        this.$message.error(this.$t('message.loginPage.notFound'))
      })
    },
    changePass () {
      this.$prompt(this.$t('message.personal.inputOldPasswd'), this.$t('common.module.tips'), {
        confirmButtonText: this.$t('common.module.confirm'),
        cancelButtonText: this.$t('common.module.cancel'),
        inputType: 'password'
      }).then(({ value }) => {
        let sha1 = crypto.createHash('sha1')
        sha1.update(value)
        value = sha1.digest('hex')
        let data = {
          id: this.id,
          password: value
        }
        this.$api.get('api/v1/authentications/' + this.id, data, res => {
          if (res.id === parseInt(this.id)) {
            this.$prompt(this.$t('message.personal.inputNewPasswd'), this.$t('common.module.tips'), {
              confirmButtonText: this.$t('common.module.confirm'),
              cancelButtonText: this.$t('common.module.cancel'),
              inputType: 'password'
            }).then(({ value }) => {
              let sha1 = crypto.createHash('sha1')
              sha1.update(value)
              value = sha1.digest('hex')
              let data = {
                '_csrf': this.$cookies.get('csrfToken'),
                params: {
                  id: this.id,
                  password: value
                }
              }
              this.$api.put('api/v1/authentications/' + this.id, data, res => {
                this.$message({
                  type: 'success',
                  message: this.$t('message.personal.changePassSucced')
                })
                sessionStorage.clear()
                localStorage.clear()
                this.$router.push('/login')
              })
            }).catch(() => {
              this.$message({
                type: 'info',
                message: '修改取消'
              })
            })
          } else {
            this.$message({
              type: 'info',
              message: this.$t('message.personal.wrongPassword')
            })
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '取消输入'
        })
      })
    },
    departmentSearch (queryString, cb) {
      var departments = this.departments
      var results = queryString ? departments.filter(this.createFilter(queryString)) : departments
      // 调用 callback 返回建议列表的数据
      cb(results)
    },
    schoolSearch (queryString, cb) {
      var schools = this.schools
      var results = queryString ? schools.filter(this.createFilter(queryString)) : schools
      // 调用 callback 返回建议列表的数据
      cb(results)
    },
    createFilter (queryString) {
      return (departments) => {
        return (departments.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0)
      }
    },
    submitForm () {
      this.$refs['ruleForm'].validate((valid) => {
        if (valid) {
          this.submitInfo()
        }
      })
    },
    async submitInfo () {
      if (this.isGuest) {
        if (this.ruleForm.realName === '访客' || this.ruleForm.realName === 'guest') {
          this.$message({
            type: 'warning',
            message: this.$t('message.personal.realName')
          })
        } else {
          await this.editName()
          await this.editInfo()
          await this.$message({
            type: 'success',
            message: this.$t('message.personal.reLogin')
          })
          localStorage.clear()
          sessionStorage.clear()
          this.$router.push('/login')
        }
      } else {
        this.editInfo()
        this.$message({
          type: 'success',
          message: this.$t('message.personal.modifySuccess')
        })
      }
    },
    async editName () {
      let data = {
        '_csrf': this.$cookies.get('csrfToken'),
        'realName': this.ruleForm.realName,
        'type': this.ruleForm.type
      }
      // console.log(data)
      this.$api.put('api/v1/accounts/' + this.id, data, res => {})
    },
    editInfo () {
      let data = {
        '_csrf': this.$cookies.get('csrfToken'),
        'realName': this.ruleForm.realName,
        'department': this.ruleForm.department,
        'school': this.ruleForm.school,
        'highestDegree': this.ruleForm.highestDegree,
        'email': this.ruleForm.email,
        'cellphone': this.ruleForm.cellphone
      }
      // console.log(data)
      this.$api.put('api/v1/informations/' + this.id, data, res => {}, res => {
        this.$message({
          type: 'error',
          message: this.$t('message.personal.serverError')
        })
      })
    },
    resetForm (formName) {
      this.$refs[formName].resetFields()
    }
  },
  mounted () {
    this.departments = [{'value': 'CSSE'}, {'value': 'EEE'}]
    this.schools = [{'value': 'XJTLU'}]
  }
}
</script>

<style scoped>
    .handle-box {
        margin-bottom: 20px;
    }

    .handle-select {
        width: 120px;
    }

    .handle-input {
        width: 300px;
        display: inline-block;
    }
    .del-dialog-cnt{
        font-size: 16px;
        text-align: center
    }

    .el-input, .el-autocomplete{
      width: 500px;
      min-width: 300px;
    }

    .el-form {
      padding-top: 0px;
    }

    .container {
      min-width: 650px;
      width: 700px;
    }
</style>
