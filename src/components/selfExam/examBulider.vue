<template>
  <el-dialog title="组卷向导" :visible.sync="builderVisible" width="685px" :close-on-click-modal="false" :close-on-press-escape="false" :show-close="false">
    <el-form :model="examForm" label-width="80px">
      <el-form-item label="题库">
        <el-select v-model="examForm.libId" placeholder="请选择组卷题库">
          <el-option v-for="item in questLib" :label="item.libName" :value="item.id" :key="item.id">
            <span style="float: left">{{ item.libName }}</span>
            <span style="float: right; color: #8492a6; font-size: 13px">共{{ item.questNum }}题</span>
          </el-option>
        </el-select>
      </el-form-item >
      <el-form-item label="题量" style="width: 300px;">
        <el-input v-model="examForm.num"></el-input>
      </el-form-item>
      <el-form-item style="text-align: right;">
        <el-button type="primary" @click="enterExam">进入考试</el-button>
        <el-button @click="dialogClose">取消</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<script>
export default {
  name: 'examBuilder',
  props: ['builderShow'],
  data: function () {
    return {
      builderVisible: this.builderShow,
      libName: '',
      questLib: [],
      examForm: {
        libId: null,
        num: null
      },
      rules: {
        moduleTitle: [
          { required: true, message: this.$t('message.module.inputTitle'), trigger: 'blur' },
          { min: 4, max: 100, message: this.$t('message.module.invalidTitle'), trigger: 'blur' }
        ],
        duration: [
          { required: true, message: this.$t('message.module.inputDuration'), trigger: 'change' }
        ]
      }
    }
  },
  async created () {
    this.questLib = await this.getQuestLib()
    // console.log(this.questLib)
  },
  methods: {
    getQuestLib () {
      return new Promise((resolve, reject) => {
        this.$api.get('questionsLibraries', null, res => {
          resolve(res)
        }, res => {
          console.log(res.data.error)
          resolve(false)
        })
      })
    },
    enterExam () {
      // console.log(this.examForm)
      // this.examInfo = this.examForm
      this.$emit('examInfo', this.examForm)
      this.builderVisible = false
    },
    dialogClose () {
      this.builderVisible = false
    }
  },
  watch: {
    builderVisible: function () {
      this.$emit('builderShow', this.builderVisible)
    }
  }
}
</script>