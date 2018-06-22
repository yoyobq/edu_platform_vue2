<template>
  <div>
    <div id="nav-top">
      <div id="nav-centerbox">
          <span id="nav-logo"><h2>{{ pageTitle }}</h2></span>
          <span id="nav-right"><span id="nav-name">{{ this.$session.get('realname') }}</span><el-button type="warning" @click="submitExam">完成交卷</el-button></span>
      </div>
    </div>
    <div id="nav-height"></div>
      <el-dialog
        title="成绩已经记录"
        :visible.sync="modalResult"
        :mask-closable="false"
        :closable="false">
        <p>你的分数是</p>
        <p>{{ score }} 分</p>
      </el-dialog>
    </div>
</template>

<script>
export default {
  data () {
    return {
      title: '',
      activeIndex: '',
      pageTitle: 'SSTS 智能化考试平台',
      permit: [],
      personalInfo: '',
      examId: this.$session.get('examid'),
      id: 0,
      modalResult: false,
      score: 0,
      scoId: 0
    }
  },
  computed: {
    // pagetitle () {
    //   return this.$store.state.title
    // }
  },
  created () {
    this.id = this.$session.get('id')
  },
  methods: {
    submitExam: function () {
      this.$confirm('您是否确认要交卷，试卷提交后不得修改', '交卷确认', {
        type: 'warning'
      }).then(() => {
        this.finishExam()
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消提交'
        })
      })
    },
    finishExam: function () {
      // 查询是否存在scoreList记录
      this.$api.get('/api/v1/accounts/' + this.id + '/scoreLists', { 'exam_Id': this.examId }, res => {
        // 得到scorceLists的对应记录的id，最后一次提交的时间， 得分
        this.scoId = res[0].sco_id
        // let submitTime = res[0].sco_SubmitTime
        this.score = res[0].sco_score

        // 如果有分数，或提交时间记录，结束评分流程
        if (this.score !== null) {
          this.$confirm('最终得分是 ' + this.score + '分', '提示', {
            title: '您已交卷',
            showConfirmButton: false,
            cancelButtonText: '我知道了',
            type: 'warning'
          })
        } else {
          // 否则，进入评分流程
          // 获取错题数，并计算结果 总分 - 错题数 * 每题得分
          this.$api.get('/api/v1/scores/wrong', { 'exam_Id': this.examId, 'id': this.id }, res => {
            let perScore
            if (this.examId === 24 || this.examId === 25 || this.examId === 22 || this.examId === 23) {
              perScore = 2
            } else {
              perScore = 1
            }
            this.score = 100 - res[0].wrong * perScore

            // 将分数存入scoreLists 对应记录中，并记录提交时间
            let data = {
              sco_score: this.score,
              _csrf: this.$cookies.get('csrfToken')
            }
            console.log(this.examId)
            this.$api.put('/api/v1/accounts/' + this.id + '/scoreLists/' + this.scoId, data, res => {
              // console.log(res)
              this.modalResult = true
            })
          })
        }
      })
    }
  }
}
</script>

<style>
#nav-top {
  position: fixed;
  width: 100%;
  z-index: 98;
  background-color: #FFFFFF;
  height: 68px;
  color: #2d8cf0;
  font-size: 14px;
  box-shadow: 0 1px 3px 0 rgba(0,34,77,.1);
  margin-bottom: 15px;
}
#nav-top .el-menu-item {
  line-height: 70px;
}
#nav-centerbox {
  width: 100%;
  max-width: 1090px;
  min-width: 800px;
  z-index: 99;
  height: 68px;
  word-break: keep-all;
  margin: 0px auto 15px;
  display: flex;
  display: -webkit-flex;
  justify-content: space-between;
  align-items: center; /* 垂直居中 */
}
#nav-logo,#nav-right{
  padding: 0px 20px;
}
#nav-height{
  height: 68px;
}
#nav-name{
  margin-right: 15px;
  color: #495384;
  font-size: 14px;
}
</style>
