<template>
    <div class="table">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-tickets"></i> 课程总览</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
              <el-row>
                <el-col :span="7">
                  <el-input v-model="select_word" placeholder="根据课程名称或授课教授中的关键字搜索" class="handle-input mr10"></el-input>
                </el-col>
                <el-col :span="4">
                  <el-button type="primary" icon="search" @click="search">搜索</el-button>
                </el-col>
                <el-col :span="2" :offset="11">
                  <el-button v-if="permission === 3 || permission ===2" type="danger" @click="handleAdd">发布新课程</el-button>
                </el-col>
              </el-row>
            </div>
            <el-table :data="data" border ref="multipleTable" stripe>
                <el-table-column prop="id" label="编号" width="50" align="center"></el-table-column>
                <el-table-column prop="moduleTitle" label="课程名称" header-align="center" width="170"></el-table-column>
                <el-table-column prop="moduleLeaderName" label="授课教授" header-align="center" width="150"></el-table-column>
                <el-table-column prop="durationStart" label="开始日期" align="center" sortable :formatter="formatterStart" width="95">1</el-table-column>
                <el-table-column prop="durationEnd" label="结束日期" align="center" sortable :formatter="formatterEnd" width="95">2</el-table-column>
                <el-table-column prop="moduleWeek" label="周数" align="center" width="50" ></el-table-column>
                <el-table-column prop="classHour" label="授课时间" header-align="center" show-overflow-tooltip effect="light" width="164" ></el-table-column>
                <el-table-column prop="taNum" label="需要助教" align="center" width="70" ></el-table-column>
                <el-table-column prop="markerNum" label="需评分员" align="center" width="70" ></el-table-column>
                <el-table-column label="操作" align="center">
                    <template slot-scope="scope">
                        <div v-if="scope.row.status === 'finish'">课程已结束</div>
                        <el-button v-else-if="permission === 1" size="small" type="warning" plain @click="handleApply(scope.$index, scope.row)">申请参与该课程</el-button>
                        <div v-else-if="permission === 3 || isMyModule(scope.row.moduleLeaderId)" >
                          <div v-if="scope.row.status === 'private'">
                            <el-button size="small" type="warning" plain @click="handleEdit(scope.$index, scope.row)">编辑并发布</el-button>
                          </div>
                          <div v-if="scope.row.status === 'public'">
                            <el-button size="small" type="warning" plain @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                            <el-button size="small" type="success" @click="handleAudit(scope.$index, scope.row)">审核</el-button>
                          </div>
                        </div>
                    </template>
                </el-table-column>
            </el-table>
            <div class="pagination">
                <el-pagination @current-change="handleCurrentChange" layout="prev, pager, next" :total="6">
                </el-pagination>
            </div>
        </div>

        <!-- 编辑弹出框 -->
        <el-dialog title="申请成为助教或评分员" :visible.sync="editVisible" width="685px">
            <el-form ref="form" :model="form" label-width="100px">
              <el-form-item label="课程名称">
                  <el-input v-model="form.moduleTitle" readyonly="true"></el-input>
              </el-form-item>
              <el-form-item label="授课教授">
                  <el-input v-model="form.moduleLeaderName"></el-input>
              </el-form-item>
              <el-row>
                <el-col :span="12">
                  <el-form-item label="开始日期">
                    <el-date-picker v-model="form.durationStart" type="date"></el-date-picker>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="结束日期">
                    <el-date-picker v-model="form.durationEnd" type="date"></el-date-picker>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-form-item label="授课时间">
                  <el-input v-model="form.classHour"></el-input>
              </el-form-item>
              <el-row>
                <el-col :span = "6">
                  <el-form-item label="需要助教">
                    <el-input v-model="form.taNum" width="50px"></el-input>
                  </el-form-item>
                </el-col>
                <!-- <el-col :offset = "1" :span = "9">
                  <span class="apply-text"> 通过人数 / 申请人数 ：3 / 8</span>
                </el-col> -->
                <el-col :span="8" :offset="1">
                  <el-button v-if="!isApply['TA']" size="small" type="warning" plain @click="submitApply('TA',form.id)">申请</el-button>
                  <div v-else-if="isPass['TA'] === 'apply'">
                    <span class="apply-text">您已提交申请</span>
                    <el-button size="small" type="warning" plain @click="revokeApply(applyId['TA'])">撤销申请</el-button>
                  </div>
                  <span v-else-if="isPass['TA'] === 'deny'" class="apply-text">您的申请被拒了</span>
                  <span v-else class="apply-text">申请通过，请注意准时出勤</span>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span = "6">
                  <el-form-item label="需批阅人">
                    <el-input v-model="form.markerNum" width="50px"></el-input>
                  </el-form-item>
                </el-col>
                <!-- <el-col :offset = "1" :span = "9">
                  <span class="apply-text"> 通过人数 / 申请人数 ：3 / 8</span>
                </el-col> -->
                <el-col :span="8" :offset="1">
                  <el-button v-if="!isApply['Marker']" size="small" type="warning" plain @click="submitApply('Marker',form.id)">申请</el-button>
                  <div v-else-if="isPass['Marker'] === 'apply'">
                    <span class="apply-text">您已提交申请</span>
                    <el-button size="small" type="warning" plain @click="revokeApply(applyId['Marker'])">撤销申请</el-button>
                  </div>
                  <span v-else-if="isPass['Marker'] === 'deny'" class="apply-text">您的申请被拒了</span>
                  <span v-else class="apply-text">申请通过，请注意准时出勤</span>
                </el-col>
              </el-row>
            </el-form>
            <!-- <span slot="footer" class="dialog-footer">
                <el-button @click="editVisible = false">取 消</el-button>
                <el-button type="primary" @click="saveEdit">确 定</el-button>
            </span> -->
        </el-dialog>
        <addModule v-if="permission === 3 || permission ===2" :addShow="addShow" @update:addShow="addShow = $event" :row="row"></addModule>
        <editModule v-if="permission === 3 || permission ===2" :editShow="editShow" @update:editShow="editShow = $event" :row="row"></editModule>
        <apply v-if="permission === 1" :applyShow="applyShow" @update:applyShow="applyShow = $event" :row="row"></apply>
        <audit v-if="permission === 3 || permission ===2" :auditShow="auditShow" @update:auditShow="auditShow = $event" :row="row" :confirm="confirm"></audit>
    </div>
</template>

<script>
export default {
  name: 'module',
  components: {
    'addModule': resolve => { require(['@/components/module/addModule.vue'], resolve) }, // 模块懒加载，防止加载过慢
    'editModule': resolve => { require(['@/components/module/editModule.vue'], resolve) },
    'audit': resolve => { require(['@/components/module/audit.vue'], resolve) }
  },
  data () {
    return {
      url: './static/vuetable.json',
      tableData: [],
      del_list: [],
      cur_page: 1,
      select_word: '',
      is_search: false,
      editVisible: false,
      form: {
        id: '', // modId
        moduleTitle: '',
        moduleLeaderName: '',
        durationStart: '',
        durationEnd: '',
        moduleWeek: 0,
        classHour: '',
        taNum: 0,
        markerNum: 0,
        stuNumber: 0
      },
      uId: sessionStorage.getItem('id'),
      permission: JSON.parse(sessionStorage.getItem('permission')).module,
      idx: -1,
      rowCurrent: -1,
      isApply: [],
      isPass: [],
      applyId: [],
      confirm: [],
      row: {},
      editShow: false,
      auditShow: false,
      addShow: false,
      applyShow: false
    }
  },
  created () {
    this.getData()
    // this.permission = this.permission.module
  },
  computed: {
    data () {
      // console.log(this.select_word)
      return this.tableData.filter((d) => {
        if (d.moduleTitle.indexOf(this.select_word) > -1 ||
                d.moduleLeaderName.indexOf(this.select_word) > -1) {
          return d
        }
      })
    }
  },
  methods: {
    // 分页导航
    handleCurrentChange (val) {
      this.cur_page = val
      this.getData()
    },
    // 获取 easy-mock 的模拟数据
    getData () {
      // console.log(this.permission) 1 助教, 2 教师, 3管理员
      let data = {
        status1: 'public', // private 未公开， public 公开， finsih 完成
        status2: 'finish'
      }
      this.$api.get('api/v1/modules', data, res => {
        let res1 = res
        if (this.permission === 2 || this.permisson === 3) {
          data = {
            status: 'private',
            moduleLeaderId: this.uId
          }
          this.$api.get('api/v1/modules', data, res => {
            // let result = Object.assign(res[0], this.tableData[0])
            let res2 = res
            // console.log(res1)
            // console.log(res2)
            var result = res2.concat(res1)
            // console.log(result)
            this.tableData = result
          })
        } else {
          this.tableData = res
        }
      })
    },
    isMyModule (leaderId) {
      if (leaderId === parseInt(this.uId)) {
        return true
      }
      return false
    },
    revokeApply (applyId) {
      let data = {
        '_csrf': this.$cookies.get('csrfToken')
      }
      // console.log(applyId)
      this.$api.delete('api/v1/moduleApplyRecords/' + applyId, data, res => {
        // this.$message({
        //   type: 'success',
        //   message: '申请撤销成功'
        // }).then(
        this.handleView(this.idx, this.rowCurrent)
        // )
      }, res => {
        this.$message({
          type: 'success',
          message: '申请撤销出错，请重试'
        })
      })
    },
    submitApply (type, modId) {
      let data = {
        '_csrf': this.$cookies.get('csrfToken'),
        params: {
          'modId': modId,
          'type': type,
          'uId': this.uId,
          'status': 'apply'
        }
      }
      this.$api.post('api/v1/moduleApplyRecords', data, res => {
        this.handleView(this.idx, this.rowCurrent)
      }, res => {
        this.$message({
          type: 'error',
          message: '服务器拒绝，请检查是否重复提交'
        })
      })
    },
    search () {
      this.is_search = true
    },
    formatterStart (row, column) {
      // this.$moment().format() 当前时间
      // this.$moment().add(10, 'day').calendar()
      return this.$moment(row.durationStart).format('MM/DD/YY')
    },
    formatterEnd (row, column) {
      return this.$moment(row.durationEnd).format('MM/DD/YY')
    },
    filterTag (value, row) {
      return row.tag === value
    },
    handleView (index, row) {
      // 应该是vue的处理机制+ js异步的问题，虽然说能获得正确的数据，但是页面渲染和实际情况不同
      // 这里用了一个临时的解决方案，强制页面内容重新渲染，获得了正确的结果
      // 但会有用户莫名的“顿挫感”，有时间的话对于editVisible, isApply等数据，需要重新考虑
      // !! 交互特别丑陋，请尽快修改 ！！
      this.editVisible = false
      this.idx = index
      this.rowCurrent = row
      const item = this.tableData[index]
      this.form = {
        'id': item.id,
        'moduleTitle': item.moduleTitle,
        'moduleLeaderName': item.moduleLeaderName,
        'durationStart': item.durationStart,
        'durationEnd': item.durationEnd,
        'moduleWeek': item.moduleWeek,
        'classHour': item.classHour,
        'taNum': item.taNum,
        'markerNum': item.markerNum
      }
      let data = {
        modId: item.id,
        uId: this.uId
      }
      this.isApply['TA'] = false
      this.isApply['Marker'] = false
      this.$api.get('api/v1/moduleApplyRecords', data, res => {
        // 同一课程，一个学生最多出现两条，分别比对这两条记录
        this.isApply[res[0].type] = true
        this.isPass[res[0].type] = res[0].status
        this.applyId[res[0].type] = res[0].id
        if (res[1] !== undefined) {
          this.isApply[res[1].type] = true
          this.isPass[res[1].type] = res[1].status
          this.applyId[res[1].type] = res[1].id
        }
        // console.log(this.isApply) // isApply 和 实际的不同步，造成出错
        this.editVisible = true
      }, res => {
        this.editVisible = true
      })
    },
    handleDelete (index, row) {
      this.idx = index
      this.delVisible = true
    },
    handleEdit (index, row) {
      this.editShow = true
      this.row = row
    },
    handleApply (index, row) {
      this.applyShow = true
      this.row = row
    },
    handleAudit (index, row) {
      // console.log(row.id)
      let data = {
        modId: row.id,
        type: 'TA',
        status: 'pass'
      }
      let taRes = []
      let markerRes = []
      // 获取pass的TA的数量
      this.$api.get('api/v1/moduleApplyRecords', data, res => {
        // 如果有
        taRes = res
        // 获取pass 的marker数量
        let data = {
          modId: row.id,
          type: 'Marker',
          status: 'pass'
        }
        this.$api.get('api/v1/moduleApplyRecords', data, res => {
          markerRes = res
          this.confirm['TA'] = taRes.length
          this.confirm['Marker'] = markerRes.length
          this.auditShow = true
          this.row = row
        }, res => {
          markerRes = []
          this.confirm['TA'] = taRes.length
          this.confirm['Marker'] = markerRes.length
          this.auditShow = true
          this.row = row
        })
      }, res => {
        // 如果没取到pass 的TA
        taRes = []
        let data = {
          modId: row.id,
          type: 'Marker',
          status: 'pass'
        }
        this.$api.get('api/v1/moduleApplyRecords', data, res => {
          markerRes = res
          this.confirm['TA'] = taRes.length
          this.confirm['Marker'] = markerRes.length
          this.auditShow = true
          this.row = row
        }, res => {
          markerRes = []
          this.confirm['TA'] = taRes.length
          this.confirm['Marker'] = markerRes.length
          this.auditShow = true
          this.row = row
        })
      })
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
    width: 300px;
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
