<template>
  <el-dialog :title="$t('common.module.moduleApply')" :visible.sync="applyVisible" width="900px" :close-on-click-modal="false" :close-on-press-escape="false" :show-close="false">
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
      <el-col :span="4">{{$t('common.module.moduleWeek')}}:</el-col>
      <el-col :span="7"> {{row.moduleWeek}} </el-col>
      <el-col :span="4">{{$t('common.module.duration')}}:</el-col>
      <el-col :span="7"> {{row.duration}}</el-col>
    </el-row>
    <el-row>
      <el-col :span="4">{{$t('common.module.classHour')}}:</el-col>
      <el-col :span="20"> {{row.classHour}} </el-col>
    </el-row>
    <el-row>
      <el-col :span="7">{{$t('common.module.reTaNum')}}:</el-col>
      <el-col :span="4"> {{confirmNum['Ta']}}人 / {{row.taNum}} 人</el-col>
      <el-col :span="2">{{$t('common.module.applyStatus')}}</el-col>
      <el-col :span="3">
        <div v-if="confirmNum['Ta'] < row.taNum">
          <el-tag v-if="myStatus['Ta'] === null" type='info'>{{$t('common.module.noApply')}}</el-tag>
          <el-tag v-if="myStatus['Ta'] ==='apply'">{{$t('common.module.pending')}}</el-tag>
          <el-tag v-if="myStatus['Ta'] ==='pass'" type='success'>{{$t('common.module.pass')}}</el-tag>
          <el-tag v-if="myStatus['Ta'] ==='force'" type='success'>{{$t('common.module.assigned')}}</el-tag>
          <el-tag v-if="myStatus['Ta'] ==='deny'" type='danger'>{{$t('common.module.reject')}}</el-tag>
        </div>
        <div v-else>
          <el-tag v-if="myStatus['Ta'] ===null || myStatus['Ta'] ==='apply'" type='danger'>{{$t('common.module.full')}}</el-tag>
          <el-tag v-if="myStatus['Ta'] ==='pass'" type='success'>{{$t('common.module.pass')}}</el-tag>
          <el-tag v-if="myStatus['Ta'] ==='force'" type='success'>{{$t('common.module.assigned')}}</el-tag>
          <el-tag v-if="myStatus['Ta'] ==='deny'" type='danger'>{{$t('common.module.reject')}}</el-tag>
        </div>
      </el-col>
      <el-col :span="4">
        <el-button v-if="myStatus['Ta'] ===null && confirmNum['Ta'] < row.taNum" type="primary" @click="submitApply('TA', row.id)">{{$t('common.module.applyTaBtn')}}</el-button>
        <el-button v-if="myStatus['Ta'] ==='apply' && confirmNum['Ta'] < row.taNum" type="info" @click="revokeApply('TA')">{{$t('common.module.revokeApply')}}</el-button>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="7">{{$t('common.module.reMarkerNum')}}</el-col>
      <el-col :span="4"> {{confirmNum['Marker']}}人 / {{row.markerNum}} 人</el-col>
      <el-col :span="2">{{$t('common.module.applyStatus')}}</el-col>
      <el-col :span="3">
        <div v-if="confirmNum['Marker'] < row.markerNum">
          <el-tag v-if="myStatus['Marker'] === null" type='info'>{{$t('common.module.noApply')}}</el-tag>
          <el-tag v-if="myStatus['Marker'] ==='apply'">{{$t('common.module.pending')}}</el-tag>
          <el-tag v-if="myStatus['Marker'] ==='pass'" type='success'>{{$t('common.module.pass')}}</el-tag>
          <el-tag v-if="myStatus['Marker'] ==='force'" type='success'>{{$t('common.module.assigned')}}</el-tag>
          <el-tag v-if="myStatus['Marker'] ==='deny'" type='danger'>{{$t('common.module.reject')}}</el-tag>
        </div>
        <div v-if="confirmNum['Marker'] >= row.markerNum">
          <el-tag v-if="myStatus['Marker'] ===null || myStatus['Marker'] ==='apply'" type='danger'>{{$t('common.module.full')}}</el-tag>
          <el-tag v-if="myStatus['Marker'] ==='pass'" type='success'>{{$t('common.module.pass')}}</el-tag>
          <el-tag v-if="myStatus['Marker'] ==='force'" type='success'>{{$t('common.module.assigned')}}</el-tag>
          <el-tag v-if="myStatus['Marker'] ==='deny'" type='danger'>{{$t('common.module.reject')}}</el-tag>
        </div>
      </el-col>
      <el-col :span="3">
        <el-button v-if="myStatus['Marker']===null && confirmNum['Marker'] < row.markerNum" type="primary" @click="submitApply('Marker', row.id)">{{$t('common.module.applyMarkerBtn')}}</el-button>
        <el-button v-if="myStatus['Marker'] ==='apply' && confirmNum['Marker'] < row.markerNum" type="info" @click="revokeApply('Marker')">{{$t('common.module.revokeApply')}}</el-button>
      </el-col>
    </el-row>

    <span slot="footer" class="dialog-footer">
        <el-button @click="closeApply">{{$t('common.module.close')}}</el-button>
    </span>
  </el-dialog>
</template>
<script>
export default {
  name: 'apply',
  props: ['applyShow', 'row'],
  data: function () {
    return {
      applyVisible: this.applyShow,
      permission: JSON.parse(sessionStorage.getItem('permission')).module,
      confirmNum: [],
      requireNum: [],
      myStatus: [],
      myId: sessionStorage.getItem('id'),
      msg: '',
      applications: {}
    }
  },
  methods: {
    revokeApply (type) {
      let arr = this.applications.filter(function (record) {
        return (record.type === type && record.uId === parseInt(sessionStorage.getItem('id')))
      })
      let data = {
        '_csrf': this.$cookies.get('csrfToken'),
        params: {
          id: arr[0].id
        }
      }
      // console.log(data)
      this.$api.delete('api/v1/moduleApplyRecords/' + arr[0].id, data, res => {
        // this.$message({
        //   type: 'success',
        //   message: '申请撤销成功'
        // }).then(
        this.getData()
        // )
      }, res => {
        this.$message({
          type: 'success',
          message: this.$t('message.module.revokeError')
        })
      })
    },
    submitApply (type, modId) {
      let data = {
        '_csrf': this.$cookies.get('csrfToken'),
        params: {
          'modId': modId,
          'type': type,
          'uId': parseInt(sessionStorage.getItem('id')),
          'status': 'apply'
        }
      }
      this.$api.post('api/v1/moduleApplyRecords', data, res => {
        this.getData()
      }, res => {
        this.$message({
          type: 'error',
          message: this.$t('message.module.reSubmit')
        })
      })
    },
    closeApply () {
      this.myStatus = []
      this.applyVisible = false
      this.$emit('update:applyShow', false)
    },
    async getNums (res) {
      // 获取各种人数
      let confirmNum = []
      let arr = res.filter(function (record) {
        return (record.type === 'TA' && record.status === 'pass')
      })
      confirmNum['Ta'] = arr.length

      arr = res.filter(function (record) {
        return (record.type === 'Marker' && record.status === 'pass')
      })

      confirmNum['Marker'] = arr.length
      // console.log(confirmNum)
      return confirmNum
    },
    async getMyStatus (res) {
      let arr = []
      let myStatus = []
      let uId = parseInt(sessionStorage.getItem('id'))
      arr['Ta'] = res.filter(function (record) {
        return (record.type === 'TA' && record.uId === uId)
      })
      arr['Marker'] = res.filter(function (record) {
        return (record.type === 'Marker' && record.uId === uId)
      })

      // console.log(arr['Marker'][0])
      if (arr['Ta'][0] !== undefined) {
        myStatus['Ta'] = arr['Ta'][0].status
      } else {
        myStatus['Ta'] = null
      }

      if (arr['Marker'][0] !== undefined) {
        myStatus['Marker'] = arr['Marker'][0].status
      } else {
        myStatus['Marker'] = null
      }
      // console.log(myStatus)
      return myStatus
    },
    async getData () {
      let data = {
        modId: this.row.id
      }
      this.$api.get('api/v1/moduleApplyRecords', data, async res => {
        // console.log(res) // 得到的是该课程所有的申请记录 pass appy deny的
        this.confirmNum = await this.getNums(res)
        this.myStatus = await this.getMyStatus(res)
        this.applications = res
        this.applyVisible = this.applyShow
      }, res => {
        // console.log(res)
        this.confirmNum['Ta'] = 0
        this.confirmNum['Marker'] = 0
        this.myStatus['Ta'] = null
        this.myStatus['Marker'] = null
        this.applyVisible = false
        this.applyVisible = this.applyShow
      })
    }
  },
  watch: {
    async applyShow () {
      await this.getData()
    }
  }
}
</script>

<style scoped>
.el-row {
  padding: 0px 0 10px 20px;
  line-height: 30px;
}

</style>
