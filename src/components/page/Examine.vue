<template>
  <div>
    <myHeader></myHeader>
    <div class="que-list" v-for="(quest, index) in list" >
      <div v-if="quest.exam_RealAnswer.length == 1">
        <sinChoice :quest="quest" :index="index"></sinChoice>
      </div>
      <div v-if="quest.exam_RealAnswer.length > 1">
        <questChoice :quest="quest" :index="index"></questChoice>
      </div>
    </div>
  </div>
</template>
<script>
import myHeader from '@/components/examine/examHeader.vue'
import questChoice from '@/components/examine/multipleChoice.vue'
import sinChoice from '@/components/examine/singleChoice.vue'

export default {
  name: 'Examine',
  components: { myHeader, questChoice, sinChoice },
  data () {
    return {
      title: '',
      list: [],
      id: this.$session.get('id'),
      examId: this.$session.get('examid')
    }
  },
  created () {
    // console.log(this.$children)
    this.checkLogin()
    this.getData()
    // console.log(this.$session.get('examid'))
  },
  methods: {
    checkLogin () {
      // console.log(this.id + ',' + this.examId)
      // let plist = JSON.parse(permission)
      if (!this.id === undefined || this.examId === undefined) {
        this.$message({
          message: '请勿非法进入考试页面，你的访问已被记录',
          type: 'warning'
        })
        this.$router.push({ path: '/' })
      }
    },
    getData () {
      this.$api.get('api/v1/questions', { 'exam_Id': this.examId, 'acc_Id': this.id }, res => {
        this.list = res
        // console.log(this.list)
      })
    },
    change () {
      console.log('1')
    }
  }
}
</script>
<style scoped>
.que-list{
  max-width: 960px;
  min-width: 100px;
  margin: 12px auto;
}

/* html,
body,
#app,
.wrapper {
  overflow: scroll;
} */

@media (max-width: 450px){
  .el-radio__inner,.el-checkbox__inner{
    display:none;
  }
}
</style>
