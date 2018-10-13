<template>
    <div class="table">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <!-- <el-breadcrumb-item><i class="el-icon-tickets"></i>{{$t('common.module.module')}}</el-breadcrumb-item> -->
                <el-breadcrumb-item><i class="el-icon-share"></i> Users</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
              <el-row>
                <el-col :span="9">
                  <!-- <el-input v-model="select_word" :placeholder="$t('message.module.phSearch')" class="handle-input mr10"></el-input> -->
                  <el-input v-model="select_word" placeholder="Search by keyword in the Name" class="handle-input mr10"></el-input>
                </el-col>
                <el-col :span="4">
                  <el-button type="primary" icon="search" @click="search">{{$t('common.module.search')}}</el-button>
                </el-col>
              </el-row>
            </div>
            <el-tabs v-model="activeName" @tab-click="handleClick">
              <el-tab-pane label="Teacher Assitant" name="student"></el-tab-pane>
              <el-tab-pane label="Teacher" name="teacher"></el-tab-pane>
              <!-- <el-tab-pane label="Guest" name="guest"></el-tab-pane> -->
              <el-tab-pane label="Check Pending" name="audit"></el-tab-pane>
            </el-tabs>
            <el-table  :data="data" border stripe empty-text="No Data">
              <el-table-column prop="id" label="id" width="50" align="center"></el-table-column>
              <el-table-column prop="realName" label="Name" header-align="center" width="150"></el-table-column>
              <el-table-column prop="school" label="School" header-align="center" width="100" show-overflow-tooltip effect="light"></el-table-column>
              <el-table-column prop="department" label="Department" align="center" width="100">1</el-table-column>
              <el-table-column prop="email" label="Email Address" header-align="center" width="200" show-overflow-tooltip effect="light" ></el-table-column>
              <el-table-column prop="cellphone" label="Mobile Phone" header-align="center" show-overflow-tooltip effect="light" width="100" ></el-table-column>
              <el-table-column prop="lastLoginTime" label="Last Login Time" align="center" show-overflow-tooltip effect="light" width="150" :formatter="formatter"></el-table-column>
              <el-table-column :label="$t('common.module.operate')" align="center">
                 <template slot-scope="scope">
                    <el-button v-if="permission === 'Admin' && activeName === 'audit'" size="small" type="primary" plain @click="handleConfirm(scope.$index, scope.row)">Confirm</el-button>
                    <el-button v-if="permission === 'Admin'" size="small" type="danger" plain @click="handleDelete(scope.$index, scope.row)">Delete</el-button>
                    <el-button v-if="permission === 'Admin' && activeName !== 'audit'" size="small" type="warning" plain @click="handleReset(scope.$index, scope.row)">Reset Password</el-button>
                  </template>
              </el-table-column>
            </el-table>
            <div class="pagination">
                <el-pagination @current-change="handleCurrentChange" layout="prev, pager, next" :total="6">
                </el-pagination>
            </div>
        </div>
    </div>
</template>

<script>
export default {
  name: 'users',
  data () {
    return {
      activeName: 'audit',
      tableData: [],
      allData: [],
      cur_page: 1,
      select_word: '',
      is_search: false,
      uId: sessionStorage.getItem('id'),
      permission: JSON.parse(sessionStorage.getItem('permission')).status,
      rowCurrent: -1,
      applyId: [],
      confirm: [],
      row: {}
    }
  },
  created () {
    if (this.permission !== 'Admin') {
      this.$router.push('/module')
    } else {
      this.getAllUsers()
    }
  },
  computed: {
    data () {
      return this.tableData.filter((d) => {
        if (d.realName != null && d.realName.indexOf(this.select_word) > -1) {
          return d
        }
      })
    }
  },
  methods: {
    // 分页导航
    handleCurrentChange (val) {
      this.cur_page = val
    },
    // 获取所有尚在进行中的课程
    getAllUsers () {
      let informations = []
      let accounts = []
      let results = []
      this.$api.get('api/v1/informations', null, res => {
        informations = res
        this.$api.get('api/v1/accounts', null, res => {
          // console.log(res)
          accounts = res
          accounts.forEach(function (item, index) {
            results[index] = {...informations[index], ...item}
          })
          this.allData = results
          let tab = {
            name: this.activeName
          }
          this.handleClick(tab)
        })
      })
    },
    getStudentUsers () {
      this.tableData = this.allData.filter((d) => {
        let status = JSON.parse(d.permission)[0].status
        if (status === 'Assitant') {
          return d
        }
      })
    },
    getAuditUsers () {
      this.tableData = this.allData.filter((d) => {
        let permission = JSON.parse(d.permission)[0]
        if (permission.module === undefined && permission.status === 'Teacher') {
          return d
        }
      })
    },
    getTeacherUsers () {
      this.tableData = this.allData.filter((d) => {
        let status = JSON.parse(d.permission)[0].status
        let module = JSON.parse(d.permission)[0].module
        if (status === 'Teacher' && module !== undefined) {
          return d
        }
      })
    },
    getGuestUsers () {
      this.tableData = this.allData.filter((d) => {
        let status = JSON.parse(d.permission)[0].status
        if (status === 'Guest') {
          return d
        }
      })
    },
    handleConfirm (tab, event) {
      if (event.permission === '[{"status":"Teacher"}]') {
        let data = {
          '_csrf': this.$cookies.get('csrfToken'),
          'permission': '[{"status":"Teacher", "module":2}]'
        }
        this.$api.put('api/v1/accounts/' + event.id, data, res => {
          this.getAllUsers()
        })
      }
    },
    async handleDelete (tab, event) {
      this.$confirm('是否真的要删除该账户', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let data = {
          '_csrf': this.$cookies.get('csrfToken')
        }
        // console.log(data)
        this.$api.delete('api/v1/authentications/' + event.id, data, res => {
          // console.log(event.id)
          data = {
            '_csrf': this.$cookies.get('csrfToken'),
            params: {
              uId: event.id
            }
          }
          this.$api.delete('api/v1/moduleApplyRecords/' + event.id, data, res => {
            this.$message({
              type: 'success',
              message: event.realName + '账户删除成功!'
            })
            this.getAllUsers()
          })
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    handleReset (tab, event) {
      // console.log(event)
      this.$confirm('是否重置该用户密码, 请确认', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let data = {
          '_csrf': this.$cookies.get('csrfToken'),
          params: {
            'id': event.id,
            'password': '9ee4ed34fae8f59d572691a369627b9879dc61b3'
          }
        }
        // let sha1 = crypto.createHash('sha1')
        // sha1.update(data.password)
        // data.password = sha1.digest('hex')
        // console.log(data)
        this.$api.put('api/v1/authentications/' + event.id, data, res => {
          this.$message({
            type: 'success',
            message: event.realName + ' ' + '密码已被重置为"changeme@first"'
          })
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    handleClick (tab) {
      if (tab.name === 'student') {
        this.getStudentUsers()
      } else if (tab.name === 'teacher') {
        this.getTeacherUsers()
      } else if (tab.name === 'guest') {
        this.getGuestUsers()
      } else {
        this.getAuditUsers()
      }
    },
    isMyModule (leaderId) {
      if (leaderId === parseInt(this.uId)) {
        return true
      }
      return false
    },
    formatter (row, column) {
      return this.$moment(Date.parse(row.lastLoginTime)).format('MM-DD / H:mm')
    },
    search () {
      this.is_search = true
    },
    filterTag (value, row) {
      return row.tag === value
    },
    handleEdit (index, row) {
      this.editShow = true
      this.row = row
    },
    handleApply (index, row) {
      this.applyShow = true
      this.row = row
    },
    handleAdd () {
      this.addShow = true
    }
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
    width: 380px;
    display: inline-block;
  }
  .del-dialog-cnt{
    font-size: 16px;
    text-align: center
  }

  .container {
    width: 1080px;
  }

  .apply-text {
    font-size: 14px;
    color: #606266;
    line-height: 32px;
  }
  .el-input__inner {
    padding-left: 5px !important;
  }
</style>
