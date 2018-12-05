<template>
  <div>
    <div class="que-list" v-for="(quest, index) in questions" >
      <div v-if="quest.quest_type === 'sin'">
        <sinChoice :quest="quest" :index="index" :answer="answerRecord[index]" @update:answer="changeAnswer($event,index)"></sinChoice>
      </div>
      <div v-if="quest.quest_type === 'mul'">
        <questChoice :quest="quest" :index="index"></questChoice>
      </div>
    </div>
  </div>
</template>
<script>
// import myHeader from '@/components/examine/examHeader.vue'
import questChoice from '@/components/exercise/multipleChoice.vue'
import sinChoice from '@/components/exercise/singleChoice.vue'
export default {
  name: 'Exercise',
  components: { questChoice, sinChoice },
  data () {
    return {
      title: '',
      id: 0,
      questions: [],
      answerRecord: []
    }
  },
  async created () {
    await this.getQuestInfo()
    if (this.questions !== undefined || this.answerRecord !== undefined) {
      localStorage.setItem('exercise_questions', JSON.stringify(this.questions))
      localStorage.setItem('exercise_answerRecord', JSON.stringify(this.answerRecord))
      localStorage.setItem('exercise_id', this.id)
    } else {
      this.questions = JSON.parse(localStorage.getItem('exercise_questions'))
      this.answerRecord = JSON.parse(localStorage.getItem('exercise_answerRecord'))
      this.id = localStorage.getItem('exercise_id')
      if (this.questions === null || this.answerRecord === null || this.id === null) {
        this.$router.push('/questLibList')
      }
    }
  },
  methods: {
    getQuestInfo () {
      return new Promise((resolve, reject) => {
        this.questions = this.$route.params.questions
        this.id = this.$route.params.id
        this.answerRecord = this.$route.params.answerRecord
        resolve(true)
      })
    },
    changeAnswer (answer, index) {
      this.answerRecord[index] = answer
      // 统计正确率（暂缓）
      // 上传答案
      // console.log(this.answerRecord)
      let data = {
        _csrf: this.$cookies.get('csrfToken'),
        data: {
          id: this.id,
          answerRecord: JSON.stringify(this.answerRecord)
        }
      }
      // return new Promise((resolve, reject) => {
      this.$api.put('exerciseRecords/' + this.id, data, res => {
      }, res => {
        console.log(res.data.error)
        console.log(res)
        this.$message.error('远程服务器出错，答案只在本地记录')
      })
      localStorage.setItem('exercise_answerRecord', JSON.stringify(this.answerRecord))
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
