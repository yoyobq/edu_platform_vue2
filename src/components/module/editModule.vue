<template>
  <el-dialog :title="$t('common.module.moduleEdit')" :visible.sync="editVisible" width="685px" :close-on-click-modal="false" :close-on-press-escape="false" :show-close="false">
    <el-form ref="form" :model="form" :rules="rules" label-width="150px">
      <el-form-item :label="$t('common.module.moduleTitle')" prop="moduleTitle">
          <el-input v-model="form.moduleTitle" readyonly="true"></el-input>
      </el-form-item>
       <el-row>
        <el-col :span="12">
          <el-form-item :label="$t('common.module.taWeekHour')" prop="taWeekHour">
              <el-input type="number" v-model="form.taWeekHour"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item :label="$t('common.module.markerWeekHour')" prop="markerWeekHour">
              <el-input type="number" v-model="form.markerWeekHour"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item :label="$t('common.module.moduleLeaderName')">
          <el-input v-model="form.moduleLeaderName" disabled></el-input>
      </el-form-item>
      <el-row>
        <el-col :span="24">
          <el-form-item :label="$t('common.module.duration')" prop="duration">
            <el-input v-model="form.duration"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item :label="$t('common.module.moduleWeek')" prop="moduleWeek">
              <el-input type="number" v-model="form.moduleWeek"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item :label="$t('common.module.stuNumber')" prop="stuNumber">
              <el-input type="number" v-model="form.stuNumber"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
          <el-form-item :label="$t('common.module.classHour')" prop="classHour">
              <el-input v-model="form.classHour"></el-input>
          </el-form-item>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item :label="$t('common.module.taNum')" prop="taNum">
            <el-input type="number" v-model="form.taNum" width="50px"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item :label="$t('common.module.markerNum')" prop="markerNum">
            <el-input type="number" v-model="form.markerNum" width="50px"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <span slot="footer" class="dialog-footer">
        <el-button @click="cancelEdit">{{$t('common.module.cancel')}}</el-button>
        <el-button type="warning" @click="saveEdit" >{{$t('common.module.save')}}</el-button>
        <el-button v-if="this.row.status === 'private'" type="danger" @click="publicity" >{{$t('common.module.publish')}}</el-button>
    </span>
  </el-dialog>
</template>
<script>
export default {
  name: 'editModule',
  props: ['editShow', 'row'],
  data: function () {
    return {
      editVisible: this.editShow,
      form: {
        id: '', // modId
        moduleTitle: '',
        moduleLeaderName: '',
        duration: '',
        moduleWeek: 0,
        classHour: '',
        taNum: 0,
        markerNum: 0,
        stuNumber: 0,
        taWeekHour: 0,
        markerWeekHour: 0
      },
      rules: {
        moduleTitle: [
          { required: true, message: this.$t('message.module.inputTitle'), trigger: 'blur' },
          { min: 4, max: 100, message: this.$t('message.module.invalidTitle'), trigger: 'blur' }
        ],
        duration: [
          { required: true, message: this.$t('message.module.inputDuration'), trigger: 'change' }
        ],
        moduleWeek: [
          { required: true, message: this.$t('message.module.inputWeek'), trigger: 'blur' }
          // {type: 'number', message: '这不是一个合理的课程总周数', trigger: 'blur'}
        ],
        stuNumber: [
          { required: true, message: this.$t('message.module.studentNumber'), trigger: 'blur' }
        ],
        classHour: [
          { required: true, message: this.$t('message.module.classHour'), trigger: 'blur' }
        ],
        taNum: [
          { required: true, message: this.$t('message.module.taNum'), trigger: 'blur' }
          // {pattern: / ^\d$/, message: '这不是一个合理的需求数量', trigger: 'blur'}
        ],
        markerNum: [
          { required: true, message: this.$t('message.module.markerNum'), trigger: 'blur' }
          // {pattern: /^\d$/, message: '这不是一个合理的需求数量', trigger: 'blur'}
        ],
        taWeekHour: [
          { required: true, message: this.$t('message.module.inputData'), trigger: 'blur' }
          // {pattern: / ^\d$/, message: '这不是一个合理的需求数量', trigger: 'blur'}
        ],
        markerWeekHour: [
          { required: true, message: this.$t('message.module.inputData'), trigger: 'blur' }
          // {pattern: / ^\d$/, message: '这不是一个合理的需求数量', trigger: 'blur'}
        ]
      }
    }
  },
  methods: {
    saveEdit () {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          this.$confirm(this.$t('message.module.modify'), this.$t('common.module.tips'), {
            confirmButtonText: this.$t('common.module.confirm'),
            cancelButtonText: this.$t('common.module.cancel'),
            type: 'warning'
          }).then(() => {
            let data = {
              '_csrf': this.$cookies.get('csrfToken'),
              params: {
                id: this.form.id,
                moduleTitle: this.form.moduleTitle,
                duration: this.form.duration,
                classHour: this.form.classHour,
                taNum: this.form.taNum,
                markerNum: this.form.markerNum,
                moduleWeek: this.form.moduleWeek,
                stuNumber: this.form.stuNumber,
                taWeekHour: this.form.taWeekHour,
                markerWeekHour: this.form.markerWeekHour
              }
            }
            this.$api.put('api/v1/modules/' + this.form.id, data, res => {
              this.$message({
                type: 'success',
                message: this.$t('message.module.saveSuccess')
              })
              this.editVisible = false
              this.$emit('update:editShow', false)
            })
          }).catch(() => { })
        }
      })
    },
    publicity () {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          this.$confirm(this.$t('message.module.confirmPublish'), this.$t('common.module.tips'), {
            confirmButtonText: this.$t('common.module.confirm'),
            cancelButtonText: this.$t('common.module.cancel'),
            type: 'warning'
          }).then(() => {
            let data = {
              '_csrf': this.$cookies.get('csrfToken'),
              params: {
                id: this.form.id,
                moduleTitle: this.form.moduleTitle,
                duration: this.form.duration,
                classHour: this.form.classHour,
                taNum: this.form.taNum,
                markerNum: this.form.markerNum,
                moduleWeek: this.form.moduleWeek,
                stuNumber: this.form.stuNumber,
                taWeekHour: this.form.taWeekHour,
                markerWeekHour: this.form.markerWeekHour,
                status: 'public'
              }
            }
            this.$api.put('api/v1/modules/' + this.form.id, data, res => {
              this.$message({
                type: 'success',
                message: this.$t('message.module.publishSuccess')
              })
              this.editVisible = false
              this.$emit('update:editShow', false)
              location.reload()
            })
          }).catch(() => { })
        }
      })
    },
    cancelEdit () {
      this.$confirm(this.$t('message.module.cancelEdit'), this.$t('common.module.tips'), {
        confirmButtonText: this.$t('common.module.confirm'),
        cancelButtonText: this.$t('common.module.cancel'),
        type: 'warning'
      }).then(() => {
        this.editVisible = false
        this.$emit('update:editShow', false)
      }).catch(() => { })
    }
  },
  watch: {
    editShow: function () {
      this.editVisible = this.editShow
    },
    row: function () {
      this.form = this.row
    }
  },
  computed: {

  }
}
</script>

<style scoped>

</style>
