<template>
  <el-dialog :title="$t('common.module.attendance')" :visible.sync="attendVisible" width="1080px" :close-on-click-modal="false" :close-on-press-escape="false" :show-close="false">
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
    <el-table :data="tableData"  style="width: 100%" >
      <el-table-column :label="$t('common.module.name')" width="100">
        <template slot-scope="scope"> {{ scope.row.name }}</template>
      </el-table-column>
      <el-table-column label="1" width="40">
        <template slot-scope="scope">
          <el-button type="text" @click="absent(scope.row.uId)">出席</el-button>
        </template>
      </el-table-column>
      <el-table-column label="2" width="70">
        <template slot-scope="scope"> {{ scope.row.uId }}</template>
      </el-table-column>
      <el-table-column label="3" width="70">
        <template slot-scope="scope"> {{ scope.row.uId }}</template>
      </el-table-column>
      <el-table-column label="4" width="70">
        <template slot-scope="scope"> {{ scope.row.uId }}</template>
      </el-table-column>
      <el-table-column label="5" width="70">
        <template slot-scope="scope"> {{ scope.row.uId }}</template>
      </el-table-column>
      <el-table-column label="6" width="70">
        <template slot-scope="scope"> {{ scope.row.uId }}</template>
      </el-table-column>
      <el-table-column label="7" width="70">
        <template slot-scope="scope"> {{ scope.row.uId }}</template>
      </el-table-column>
      <el-table-column label="8" width="70">
        <template slot-scope="scope"> {{ scope.row.uId }}</template>
      </el-table-column>
      <el-table-column label="9" width="70">
        <template slot-scope="scope"> {{ scope.row.uId }}</template>
      </el-table-column>
      <el-table-column label="10" width="70">
        <template slot-scope="scope"> {{ scope.row.uId }}</template>
      </el-table-column>
    </el-table>
    <span slot="footer" class="dialog-footer">
      <el-button @click="dataShow">data show</el-button>
      <el-button @click="close">{{$t('common.module.close')}}</el-button>
    </span>
  </el-dialog>
</template>
<script>
export default {
  name: 'attendModule',
  props: ['attendShow', 'row'],
  data: function () {
    return {
      istrue: true,
      attendVisible: this.attendShow,
      tableData: []
    }
  },
  methods: {
    close () {
      this.attendVisible = false
      this.$emit('update:attendShow', false)
    },
    dataShow () {
      console.log(this.row)
    },
    absent (uId) {
      console.log(uId)
    }
  },
  watch: {
    attendShow: function () {
      this.attendVisible = this.attendShow
    },
    // row: function () {
    //   this.form = this.row
    // },
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
          let result = res.map(item => {
            return { uId: item.uId, name: item.realName, type: item.type, status: item.status }
          })
          result = result.filter(item => {
            return item.type === 'TA' && (item.status === 'pass' || item.status === 'force')
          })
          this.tableData = result
          console.log(this.tableData)
        }, res => {})
        // console.log(this.confirm)
      },
      deep: true
    }
  },
  computed: {

  }
}
</script>

<style scoped>

</style>
