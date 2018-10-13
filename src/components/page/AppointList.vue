<template>
    <div class="table">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-share"></i> Appoint Lists</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
              <el-row>
                <el-col :span="10">
                  <el-input v-model="select_word" placeholder="Search by keyword in the Name" class="handle-input mr10"></el-input>
                </el-col>
                <el-col :span="2">
                  <el-button type="primary" icon="search" @click="search">{{$t('common.module.search')}}</el-button>
                </el-col>
                <el-col :span="2">
                  <el-button type="primary" icon="el-icon-refresh" @click="refresh"></el-button>
                </el-col>
              </el-row>
            </div>
            <el-tabs v-model="activeName" @tab-click="handleClick">
              <el-tab-pane label="Appointed" name="appointed"></el-tab-pane>
              <el-tab-pane label="Applying" name="applying"></el-tab-pane>
            </el-tabs>
            <div class="budget-row" v-if="activeName === 'appointed'">Budget = {{totalFee}} RMB ( for master students )</div>
            <el-table  :data="data" border stripe empty-text="No Data">
              <el-table-column prop="uId" label="Id" width="80" align="center" sortable></el-table-column>
              <el-table-column prop="realName" label="Name" header-align="center" width="150" show-overflow-tooltip effect="light" sortable></el-table-column>
              <el-table-column prop="email" :label="$t('common.personal.eMail')" width="200" show-overflow-tooltip effect="light"></el-table-column>
              <el-table-column prop="cellphone" :label="$t('common.personal.phone')" width="120"></el-table-column>
              <el-table-column prop="highestDegree" label="Degree" header-align="center" width="100" sortable></el-table-column>
              <el-table-column prop="moduleTitle" label="Module" header-align="center" width="200" show-overflow-tooltip effect="light" sortable></el-table-column>
              <el-table-column prop="moduleWeek" label="Week" align="center" width="60">1</el-table-column>
              <el-table-column label="Hours/week" header-align="center" align="center" width="100" :formatter="taWeekFormatter"></el-table-column>
              <el-table-column label="TA Hours" header-align="center" align="center" width="90" :formatter="taHoursFormatter"></el-table-column>
              <el-table-column prop="markerWeekHour" label="MarkingHours" header-align="center" :formatter="markerWeekFormatter" align="center" width="110"></el-table-column>
              <el-table-column prop="type" label="type" align="center" sortable></el-table-column>
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
      activeName: 'appointed',
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
      totalFee: 0,
      row: {}
    }
  },
  created () {
    if (this.permission !== 'Admin') {
      this.$router.push('/module')
    } else {
      this.getAppointLists()
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
    getAppointLists () {
      // let results = []
      this.$api.get('api/v1/appointLists', null, res => {
        // console.log(res)
        this.tableData = res
        console.log(res)
        let totalTime = 0
        this.tableData.forEach((item, index) => {
          // console.log(item.taWeekHour * item.moduleWeek + item.markerWeekHour)
          if (item.highestDegree === 'junior') { // masterStudent') {
            totalTime = totalTime + (item.taWeekHour * item.moduleWeek + item.markerWeekHour)
          }
        })
        this.totalFee = totalTime * 40
      }, res => {
        this.tableData = []
      })
    },
    getApplyLists () {
      let data = {
        'apply': true
      }
      this.$api.get('api/v1/appointLists', data, res => {
        // console.log(res)
        this.tableData = res
      }, res => {
        this.tableData = []
      })
    },
    handleClick (tab) {
      if (tab.name === 'applying') {
        this.getApplyLists()
      } else {
        this.getAppointLists()
      }
    },
    taWeekFormatter (row, column) {
      if (row.type === 'TA') {
        return row.taWeekHour
      } else {
        return '-'
      }
      // console.log(row)
      // return this.$moment(Date.parse(row.lastLoginTime)).format('MM-DD / H:mm')
    },
    taHoursFormatter (row, column) {
      if (row.type === 'TA') {
        return row.taWeekHour * row.moduleWeek
      } else {
        return '-'
      }
      // console.log(row)
      // return this.$moment(Date.parse(row.lastLoginTime)).format('MM-DD / H:mm')
    },
    markerWeekFormatter (row, column) {
      if (row.type === 'Marker') {
        return row.taWeekHour
      } else {
        return '-'
      }
      // console.log(row)
      // return this.$moment(Date.parse(row.lastLoginTime)).format('MM-DD / H:mm')
    },
    search () {
      this.is_search = true
    },
    refresh () {
      this.$api.get('api/v1/appointLists', null, res => {
        // console.log(res)
        this.tableData = res
        this.$message({
          type: 'success',
          message: 'Refresh succeeded'
        })
      }, res => {
        this.$message({
          type: 'error',
          message: 'Sth. wrong plz try again'
        })
      })
    },
    filterTag (value, row) {
      return row.tag === value
    }
  }
}
</script>

<style scoped>
  .handle-box {
    margin-bottom: 20px;
  }

  .handle-select {
    /* width: 120px; */
  }

  .handle-input {
    width: 390px;
    display: inline-block;
  }
  .del-dialog-cnt{
    font-size: 16px;
    text-align: center
  }

  .container {
    width: 1300px;
  }

  .apply-text {
    font-size: 14px;
    color: #606266;
    line-height: 32px;
  }
  .el-input__inner {
    padding-left: 5px !important;
  }

  .budget-row {
    margin: 10px 10px 20px;
    font-size: 1.1em;
    font-weight: 400;
    color: #606266;
  }
</style>
