<template>
  <el-dialog title="新增课程" :visible.sync="addVisible" width="685px" :close-on-click-modal="false" :close-on-press-escape="false" :show-close="false">
    <el-form ref="form" :model="form" :rules="rules" label-width="100px">
      <el-form-item label="课程名称" prop="moduleTitle">
          <el-input v-model="form.moduleTitle" readyonly="true"></el-input>
      </el-form-item>
      <el-form-item label="授课教授">
          <el-input v-model="form.moduleLeaderName" disabled></el-input>
      </el-form-item>
      <el-row>
        <el-col :span="12">
          <el-form-item label="开始日期" prop="durationStart">
            <el-date-picker v-model="form.durationStart" type="date" @change="lastWeek"></el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="结束日期" prop="durationEnd">
            <el-date-picker v-model="form.durationEnd" type="date" @change="lastWeek"></el-date-picker>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
          <el-form-item label="授课时间" prop="classHour">
              <el-input v-model="form.classHour"></el-input>
          </el-form-item>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="学生人数" prop="stuNumber">
              <el-input type="number" v-model="form.stuNumber"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="授课周数" prop="moduleWeek">
              <el-input type="number" v-model="form.moduleWeek"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="需要助教" prop="taNum">
            <el-input type="number" v-model="form.taNum"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="需批阅人" prop="markerNum">
            <el-input type="number" v-model="form.markerNum"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <span slot="footer" class="dialog-footer">
        <el-button @click="cancelAdd">取 消</el-button>
        <el-button type="primary" plain @click="saveAdd" >暂存</el-button>
        <el-button type="danger" @click="add">发布</el-button>
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
        durationStart: '',
        durationEnd: '',
        moduleWeek: 0,
        classHour: '',
        taNum: 0,
        markerNum: 0,
        stuNumber: 0
      },
      rules: {
        moduleTitle: [
          { required: true, message: '请输入课程名称', trigger: 'blur' },
          { min: 4, max: 100, message: '课程名称长度应在 4 到 100 个字符之间', trigger: 'blur' }
        ],
        durationStart: [
          { required: true, message: '请选择课程开始日期', trigger: 'change' }
        ],
        durationEnd: [
          { required: true, message: '请选择课程结束日期', trigger: 'change' }
        ],
        moduleWeek: [
          { required: true, message: '请填写课程总周数', trigger: 'blur' }
          // {type: 'number', message: '这不是一个合理的课程总周数', trigger: 'blur'}
        ],
        stuNumber: [
          { required: true, message: '请填写班级学生人数', trigger: 'blur' }
        ],
        classHour: [
          { required: true, message: '请填写每周具体的上课时间', trigger: 'blur' }
        ],
        taNum: [
          { required: true, message: '请提供需要的助教人数', trigger: 'blur' }
          // {pattern: / ^\d$/, message: '这不是一个合理的需求数量', trigger: 'blur'}
        ],
        markerNum: [
          { required: true, message: '请提供需要的批阅人人数', trigger: 'blur' }
          // {pattern: /^\d$/, message: '这不是一个合理的需求数量', trigger: 'blur'}
        ]
      }
    }
  },
  methods: {
    add () {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          this.$confirm('课程发布后相关信息不能修改, 是否确认?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
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
                durationStart: this.$moment(Date.parse(this.form.durationStart)).format('YYYY-MM-DD'),
                durationEnd: this.$moment(Date.parse(this.form.durationEnd)).format('YYYY-MM-DD'),
                classHour: this.form.classHour,
                taNum: this.form.taNum,
                markerNum: this.form.markerNum,
                moduleWeek: this.form.moduleWeek,
                stuNumber: this.form.stuNumber,
                status: 'public'
              }
            }
            // console.log(data)
            this.$api.post('api/v1/modules', data, res => {
              // console.log(res)
              this.$message({
                type: 'success',
                message: '课程发布成功'
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
      this.$confirm('保存填写的课程信息但不发布, 是否确认?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
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
            durationStart: this.$moment(Date.parse(this.form.durationStart)).format('YYYY-MM-DD'),
            durationEnd: this.$moment(Date.parse(this.form.durationEnd)).format('YYYY-MM-DD'),
            classHour: this.form.classHour,
            taNum: this.form.taNum,
            markerNum: this.form.markerNum,
            moduleWeek: this.form.moduleWeek,
            stuNumber: this.form.stuNumber,
            status: 'private'
          }
        }
        // console.log(data)
        this.$api.post('api/v1/modules', data, res => {
          // console.log(res)
          this.$message({
            type: 'success',
            message: '课程数据保存成功'
          })
          // this.addVisible = false
          // this.$emit('update:addShow', false)
          location.reload()
        })
      }).catch(() => { })
    },
    cancelAdd () {
      this.$confirm('取消本次修改, 是否确认?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.addVisible = false
        this.$emit('update:addShow', false)
      }).catch(() => { })
    },
    lastWeek () {
      let lastWeek = (Date.parse(this.form.durationEnd) - Date.parse(this.form.durationStart)) / 3600 / 1000 / 24 / 7
      lastWeek = Math.ceil(Math.abs(lastWeek))
      this.form.moduleWeek = lastWeek
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
