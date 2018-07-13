<template>
  <el-dialog :title="$t('common.module.moduleAdd')" :visible.sync="addVisible" width="685px" :close-on-click-modal="false" :close-on-press-escape="false" :show-close="false">
    <el-form ref="form" :model="form" :rules="rules" label-width="150px">
      <el-form-item :label="$t('common.module.moduleTitle')" prop="moduleTitle">
          <el-input v-model="form.moduleTitle" readyonly="true" :placeholder="$t('message.module.phTitle')"></el-input>
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
            <el-input v-model="form.duration" :placeholder="$t('message.module.phDuration')"></el-input>
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
              <el-input v-model="form.classHour" :placeholder="$t('message.module.phClassHour')"></el-input>
          </el-form-item>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item :label="$t('common.module.taNum')" prop="taNum">
            <el-input type="number" v-model="form.taNum"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item :label="$t('common.module.markerNum')" prop="markerNum">
            <el-input type="number" v-model="form.markerNum"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <span slot="footer" class="dialog-footer">
        <el-button @click="cancelAdd">{{$t('common.module.cancel')}}</el-button>
        <el-button type="primary" plain @click="saveAdd" >{{$t('common.module.save')}}</el-button>
        <el-button type="danger" @click="add">{{$t('common.module.publish')}}</el-button>
    </span>
  </el-dialog>
</template>
<script>
export default {
  name: 'addModule',
  props: ['addShow', 'row'],
  data: function () {
    return {
      addVisible: this.addShow,
      form: {
        moduleTitle: '',
        moduleLeaderName: localStorage.getItem('pf_realName'),
        moduleLeaderId: sessionStorage.getItem('id'),
        duration: '',
        moduleWeek: null,
        classHour: '',
        taNum: null,
        markerNum: null,
        stuNumber: null,
        taWeekHour: null,
        markerWeekHour: null
      },
      rules: {
        moduleTitle: [
          { required: true, message: this.$t('message.module.inputTitle'), trigger: 'blur' },
          { min: 4, max: 100, message: this.$t('message.module.invalidTitle'), trigger: 'blur' }
        ],
        duration: [
          { required: true, message: this.$t('message.module.inputDuration'), trigger: 'blur' }
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
    add () {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          this.$confirm(this.$t('message.module.confirmPublish'), this.$t('common.module.tips'), {
            confirmButtonText: this.$t('common.module.confirm'),
            cancelButtonText: this.$t('common.module.cancel'),
            type: 'warning'
          }).then(() => {
            console.log(this.form)
            let data = {
              '_csrf': this.$cookies.get('csrfToken'),
              params: {
                id: this.form.id,
                moduleLeaderId: this.form.moduleLeaderId,
                moduleLeaderName: this.form.moduleLeaderName,
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
            // console.log(data)
            this.$api.post('api/v1/modules', data, res => {
              // console.log(res)
              this.$message({
                type: 'success',
                message: this.$t('message.module.publishSuccess')
              })
              // this.addVisible = false
              // this.$emit('update:addShow', false)
              location.reload()
            })
          }).catch(() => { })
        }
      })
    },
    saveAdd () {
      this.$confirm(this.$t('message.module.confirmSave'), this.$t('common.module.tips'), {
        confirmButtonText: this.$t('common.module.confirm'),
        cancelButtonText: this.$t('common.module.cancel'),
        type: 'warning'
      }).then(() => {
        console.log(this.form)
        let data = {
          '_csrf': this.$cookies.get('csrfToken'),
          params: {
            id: this.form.id,
            moduleLeaderId: this.form.moduleLeaderId,
            moduleLeaderName: this.form.moduleLeaderName,
            moduleTitle: this.form.moduleTitle,
            duration: this.form.duration,
            classHour: this.form.classHour,
            taNum: this.form.taNum,
            markerNum: this.form.markerNum,
            moduleWeek: this.form.moduleWeek,
            stuNumber: this.form.stuNumber,
            taWeekHour: this.form.taWeekHour,
            markerWeekHour: this.form.markerWeekHour,
            status: 'private'
          }
        }
        // console.log(data)
        this.$api.post('api/v1/modules', data, res => {
          // console.log(res)
          this.$message({
            type: 'success',
            message: this.$t('message.module.saveSuccess')
          })
          // this.addVisible = false
          // this.$emit('update:addShow', false)
          location.reload()
        })
      }).catch(() => { })
    },
    cancelAdd () {
      this.$confirm(this.$t('message.module.cancelEdit'), this.$t('common.module.tips'), {
        confirmButtonText: this.$t('common.module.confirm'),
        cancelButtonText: this.$t('common.module.cancel'),
        type: 'warning'
      }).then(() => {
        this.addVisible = false
        this.$emit('update:addShow', false)
      }).catch(() => { })
    }
  },
  watch: {
    addShow: function () {
      this.addVisible = this.addShow
    }
  },
  computed: {

  }
}
</script>

<style scoped>

</style>
