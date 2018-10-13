<template>
  <!-- Appointment -->
  <el-dialog :title="$t('common.module.moduleAudit')" :visible.sync="auditVisible" width="1080px" :close-on-click-modal="false" :close-on-press-escape="false" :show-close="false">
    <el-row>
      <el-col :span="4">{{$t('common.module.moduleTitle')}}:</el-col>
      <el-col :span="7">{{row.moduleTitle}} </el-col>
      <el-col :span="4">{{$t('common.module.moduleLeaderName')}}:</el-col>
      <el-col :span="7">{{row.moduleLeaderName}}</el-col>
    </el-row>
    <el-row>
      <el-col :span="4">{{$t('common.module.taWeekHour')}}:</el-col>
      <el-col :span="7">{{row.taWeekHour}} </el-col>
      <el-col :span="4">{{$t('common.module.markerWeekHour')}}:</el-col>
      <el-col :span="7">{{row.markerWeekHour}}</el-col>
    </el-row>
    <el-row>
      <el-col :span="5">{{$t('common.module.reTaNum')}}:</el-col>
      <el-col :span="6">{{confirm.TA}} person / {{requireNum['TA']}} person</el-col>
      <el-col :span="7">{{$t('common.module.reMarkerNum')}}:</el-col>
      <el-col :span="6">{{confirm['Marker']}} person / {{requireNum['Marker']}} person</el-col>
    </el-row>
    <el-row>
      <el-col :span="24" style="padding-top: 30px; font-weight: 700; align: center; color: #409EFF">I. Appoint a person as your TA.</el-col>
    </el-row>
    <el-row style="margin-top: 20px">
      <el-col :span="8">
        <el-select  style="width: 290px" v-model="student" filterable :placeholder="$t('message.module.phSearchStudent')">
          <el-option
            v-for="item in students"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-col>
      <el-col :span="4" style="padding-top: 5px">
        <el-switch
          style="display: block"
          v-model="job"
          active-color="#67C23A"
          inactive-color="#409EFF"
          active-text="TA"
          inactive-text="Marker">
        </el-switch>
      </el-col>
      <el-col :span="4">
        <el-button type="primary" icon="search" @click="assignStudent">{{$t('common.module.auditBtn')}}</el-button>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24" style="padding-top: 30px; font-weight: 700; align: center; color: #409EFF">II. The following students are applying for TA/Marker of your module.</el-col>
    </el-row>
    <el-table :data="tableData"  style="width: 100%" >
      <!-- <el-table-column :label="$t('common.module.submitTime')" width="120" sortable>
        <template slot-scope="scope">
          <i class="el-icon-time"></i>
          <span style="margin-left: 10px">{{ $moment(Date.parse(scope.row.submitTime)).format('YYYY-MM-DD') }}</span>
        </template>
      </el-table-column> -->
      <el-table-column :label="$t('common.module.name')" width="120">
        <template slot-scope="scope"> {{ scope.row.realName }}</template>
      </el-table-column>
      <!-- <el-table-column :label="$t('common.module.school')" width="120">
        <template slot-scope="scope"> {{ scope.row.school }}</template>
      </el-table-column> -->
      <el-table-column :label="$t('common.personal.eMail')" width="220">
        <template slot-scope="scope"> {{ scope.row.email }}</template>
      </el-table-column>
      <el-table-column :label="$t('common.personal.phone')" width="120">
        <template slot-scope="scope"> {{ scope.row.cellphone }}</template>
      </el-table-column>
      <el-table-column :label="$t('common.module.department')" width="100">
        <template slot-scope="scope"> {{ scope.row.department }}</template>
      </el-table-column>
      <el-table-column :label="$t('common.module.degree')" width="110">
        <template slot-scope="scope"> {{ scope.row.highestDegree }}</template>
      </el-table-column>
      <el-table-column prop="type" :label="$t('common.module.type')" sortable width="80"></el-table-column>
      <el-table-column :label="$t('common.module.status')" width="100" align="center">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.status==='apply'">{{$t('common.module.pending')}}</el-tag>
          <el-tag v-if="scope.row.status==='pass'" type='success'>{{$t('common.module.pass')}}</el-tag>
          <el-tag v-if="scope.row.status==='deny'" type='danger'>{{$t('common.module.reject')}}</el-tag>
          <el-tag v-if="scope.row.status==='assigned'" type='success'>{{$t('common.module.assigned')}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="Operation">
        <template slot-scope="scope" v-if="isShowBtn(scope.row)">
          <el-button
            size="mini"
            @click="agreeApp(scope.row)">{{$t('common.module.agreeBtn')}}</el-button>
          <el-button
            size="mini"
            type="danger"
            @click="denyApp(scope.row)">{{$t('common.module.rejectBtn')}}</el-button>
        </template>
        <template>
          {{msg}}
        </template>
      </el-table-column>
    </el-table>
    <span slot="footer" class="dialog-footer">
        <el-button @click="closeAudit">{{$t('common.module.close')}}</el-button>
    </span>
  </el-dialog>
</template>
<script>
export default {
  name: 'audit',
  props: ['auditShow', 'row', 'confirm'],
  data: function () {
    return {
      auditVisible: this.auditShow,
      permission: JSON.parse(sessionStorage.getItem('permission')).module,
      tableData: [],
      cNum: this.confirm,
      form: {
        id: '',
        uId: '',
        modId: '',
        type: '',
        status: '',
        submitTime: '',
        department: '',
        school: '',
        highestDegree: '',
        email: '',
        cellphone: ''
      },
      select_word: '',
      requireNum: [],
      student: null,
      students: [],
      taRes: {},
      maerkRes: {},
      job: true,
      msg: ''
    }
  },
  methods: {
    // studentSearch (queryString, cb) {
    //   var students = this.students
    //   var results = queryString ? students.filter(this.createFilter(queryString)) : students
    //   // 调用 callback 返回建议列表的数据
    //   cb(results)
    // },
    // createFilter (queryString) {
    //   return (students) => {
    //     return (students.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0)
    //   }
    // },
    assignStudent () {
      if (this.student !== null) {
        this.$confirm(this.$t('message.module.assignStudent') + (this.job ? 'TA?' : 'Marker?'), this.$t('common.module.tips'), {
          confirmButtonText: this.$t('common.module.confirm'),
          cancelButtonText: this.$t('common.module.cancel'),
          type: 'warning'
        }).then(() => {
          let data = {
            '_csrf': this.$cookies.get('csrfToken'),
            params: {
              'modId': this.row.id,
              'type': this.job ? 'TA' : 'Marker',
              'uId': this.student,
              'status': 'assigned'
            }
          }
          this.$api.post('api/v1/moduleApplyRecords', data, res => {
            this.confirm[data.params.type]++
            this.$forceUpdate()
            data = {
              modId: this.row.id
            }
            this.$api.get('api/v1/moduleApplyRecords', data, res => {
              this.tableData = res
            }, res => {})
            this.$forceUpdate()
          }, res => {
            this.$message({
              type: 'error',
              message: this.$t('message.module.reSubmit')
            })
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: this.$t('message.module.assignCancel')
          })
        })
      }
    },
    isShowBtn (row) {
      let flag = false
      if (row.status === 'apply' && this.confirm[row.type] < this.requireNum[row.type]) {
        // 状态为申请中, 且招募人数没有超过上限
        flag = true
      } else {
        flag = false
        this.msg = this.$t('message.module.msgFull')
      }
      if (this.permission === 3) flag = true // 是管理员
      return flag
    },
    agreeApp (row) {
      // console.log(row.id + row.realName)
      if (this.confirm[row.type] < this.requireNum[row.type] && row.status !== 'pass') {
        let data = {
          '_csrf': this.$cookies.get('csrfToken'),
          params: {
            id: row.id,
            status: 'pass',
            type: row.type
          }
        }
        this.$api.put('api/v1/moduleApplyRecords/' + row.id, data, res => {
          this.$message({
            type: 'success',
            message: row.realName + this.$t('message.module.msgPass')
          })
          this.confirm[row.type]++
          row.status = 'pass'
          this.$forceUpdate()
        })
      } else {
        this.$message({
          type: 'info',
          message: this.$t('message.module.numLimit')
        })
      }
    },
    denyApp (row) {
      // console.log(row.id + row.realName)
      if (row.status !== 'deny') {
        let data = {
          '_csrf': this.$cookies.get('csrfToken'),
          params: {
            id: row.id,
            status: 'deny',
            type: row.type
          }
        }
        this.$api.put('api/v1/moduleApplyRecords/' + row.id, data, res => {
          this.$message({
            type: 'warning',
            message: row.realName + this.$t('message.module.msgReject')
          })
          row.status = 'deny'
          if (this.confirm[row.type] > 0) {
            this.confirm[row.type]--
          }
          this.$forceUpdate()
        })
      } else {
        this.$message({
          type: 'info',
          message: this.$t('message.module.alreadyReject')
        })
      }
    },
    closeAudit () {
      this.auditVisible = false
      this.$emit('update:auditShow', false)
    },
    getStudents () {
      // http://192.168.72.55:7001/api/v1/informations
      this.$api.get('api/v1/accounts', null, res => {
        // console.log(res)
        let result = res.map(item => {
          return { value: item.id, label: item.realName, permission: item.permission }
        })
        // [{'value': 'CSSE'}, {'value': 'EEE'}]
        this.students = result.filter((d) => {
          let status = JSON.parse(d.permission)[0].status
          if (status === 'Assitant') {
            return d
          }
        })
        // console.log(this.students)
      })
    }
  },
  watch: {
    auditShow: function () {
      this.auditVisible = this.auditShow
    },
    confirm: {
      handler () {
        console.log('hi')
      },
      deep: true
    },
    row: {
      handler () {
        // console.log(this.row)
        // this.confirm['TA'] = 0
        // this.confirm['Marker'] = 0
        // console.log(this.confirm)
        let data = {
          modId: this.row.id
        }
        this.$api.get('api/v1/moduleApplyRecords', data, res => {
          this.requireNum['TA'] = this.row.taNum
          this.requireNum['Marker'] = this.row.markerNum
          this.tableData = res
          console.log(this.tableData)
        }, res => {})
        // console.log(this.confirm)
      },
      deep: true
    }
  },
  computed: {

  },
  mounted () {
    this.$nextTick(function () {
      this.getStudents()
    })
  }
}
</script>

<style scoped>

</style>
