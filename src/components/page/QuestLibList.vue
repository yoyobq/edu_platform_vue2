<template>
    <section class="main">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-date"></i> 课程学习</el-breadcrumb-item>
                <el-breadcrumb-item>题库一览</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
          <el-card v-for="(item,index) in myExeRecord" class="drag-list" :key="index" @click.native ="handleClick(item.libId)">
            <div slot="header" class="clearfix card-header">
              <i class="el-icon-edit"></i> {{item.libName}}
            </div>
            <ul>
              <li>
                题目数量： {{item.questNum}} 题
              </li>
              <li>
                背诵轮次： {{ getRound(item.round) }}
              </li>
              <li>
                <span>本轮进度：</span>
                <el-progress :text-inside="true" :stroke-width="18" :percentage="getProgress(item.answerRecord, item.questNum)" status="success"></el-progress>
              </li>
              <!-- <li>
                <span>本轮正确率:</span>
                <el-progress :text-inside="true" :stroke-width="18" :percentage="getCorrectRate(item.correctRate)" status="success"></el-progress>
              </li> -->
            </ul>
          </el-card>
        </div>
    </section>
</template>

<script>
  // import draggable from 'vuedraggable'
  export default {
    name: 'draglist',
    data () {
      return {
        dragOptions: {
          animation: 120,
          scroll: true,
          group: 'sortlist',
          ghostClass: 'ghost-style'
        },
        questLib: [],
        myExeRecord: [],
        stuId: sessionStorage.getItem('id')
      }
    },
    components: {
      // draggable
    },
    async created () {
      this.questLib = await this.getQuestLib()
      // console.log(this.questLib)
      this.myExeRecord = await this.getMyExerciseRecord()
      // console.log(this.myExeRecord)

      // 似乎可以完成相同id数组合并
      // this.questLib.forEach(function (item, index) {
      //   console.log(item.id)
      // console.log(this.myExeRecord[2])
      // results[index] = {...informations[index], ...item}
      // })
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
      getMyExerciseRecord () {
        // console.log(this.stuId)
        return new Promise((resolve, reject) => {
          let data = {
            stuId: this.stuId
          }
          // 注意此处有特殊处理，后台返回的是多表查询数据
          this.$api.get('exerciseRecords', data, res => {
            resolve(res)
          }, res => {
            console.log(res.data.error)
            resolve(false)
          })
        })
      },
      getQuestions (libId) {
        return new Promise((resolve, reject) => {
          let data = {
            queG_id: libId
          }
          this.$api.get('questions', data, res => {
            resolve(res)
          }, res => {
            console.log(res.data.error)
            resolve(false)
          })
        })
      },
      // 获取对应libId的记录
      async getExistRecord (libId) {
        // 从该用户的exerciseRecord中，寻找对应记录
        // 从数据库中再次获取最新的exerciseRecord记录，防止重复添加
        this.myExeRecord = await this.getMyExerciseRecord()
        // console.log(this.myExeRecord)
        const result = this.myExeRecord.filter(item => {
          return item.libId === libId // 'TA' && (item.status === 'pass' || item.status === 'force')
        })
        // 搜索返回的数组，最多有且只有一条匹配记录
        return result[0]
      },
      async handleClick (libId) {
        let res = await this.getExistRecord(libId)
        let id = res.id
        // 如果没有获取到记录
        if (res.id === null) {
          let answer = [...Array(res.questNum)].map(_ => 0)
          res = await this.createExerciseRecord(libId, parseInt(this.stuId), JSON.stringify(answer))
          id = res.insertId
          res.answerRecord = JSON.stringify(answer)
          this.$message.success('建立了新的学习档案')
          // 如果不存在，就建立档案
        }
        let answerRecord = JSON.parse(res.answerRecord)
        let questions = await this.getQuestions(libId)
        // 此处id为exercise_record表的主键  id
        this.$router.push({ name: 'exercise', params: { questions: questions, answerRecord: answerRecord, id: id } })
      },
      createExerciseRecord (libId, stuId, answerRecord) {
        return new Promise((resolve, reject) => {
          let data = {
            _csrf: this.$cookies.get('csrfToken'),
            data: {
              libId: libId,
              stuId: stuId,
              answerRecord: answerRecord
            }
          }
          console.log(data)
          this.$api.post('exerciseRecords', data, res => {
            resolve(res)
          }, res => {
            reject(new Error('学习档案建立失败'))
          })
        })
      },
      getRound (round) {
        return round !== null ? '第' + round + '轮' : '未建档'
      },
      getProgress (answerRecord, totalNum) {
        if (answerRecord === null) {
          return 0
        } else {
          let unfinishNum = this.$mjson.countOccurences(JSON.parse(answerRecord), 0)
          return Math.floor((totalNum - unfinishNum) * 100 / totalNum)
        }
      },
      getCorrectRate (correctRate) {
        return correctRate === null ? 100 : correctRate
      }
    }
  }
</script>

<style scoped>
    .drag-box{
      display: flex;
      user-select: none;
      flex-direction: column;
      color: #303133;
    }
    /* .drag-box-item {
        flex: 1;
        max-width: 330px;
        min-width: 300px;
        background-color: #eff1f5;
        margin-right: 16px;
        border-radius: 6px;
        border: 1px #e1e4e8 solid;
    }
    .item-title{
        padding: 8px 8px 8px 12px;
        font-size: 14px;
        line-height: 1.5;
        color: #24292e;
        font-weight: 600;
    } */
    .item-ul{
        padding: 0 8px 8px;
        min-height: 500px;
        overflow-y: scroll;
    }
    .item-ul::-webkit-scrollbar{
        width: 0;
    }
    .drag-list {
        display: inline-block;
        /* min-width: 28%;
        max-width: 28%; */
        width: 280px;
        /* height: 60px; */
        /* border: 1px #e1e4e8 solid; */
        padding: 10px;
        margin: 5px 10px 10px;
        /* list-style: none; */
        /* background-color: #fff; */
        border-radius: 16px;
        cursor: pointer;
              text-align: center;
        /* -webkit-transition: border .3s ease-in; */
        /* transition: border .3s ease-in; */
    }
    .drag-list:hover {
        border: 1px solid #20a0ff;
    }
    .ghost-style{
        display: block;
        color: transparent;
        border-style: dashed
    }
  .clearfix:before,
  .clearfix:after {
    display: table;
    content: "";
  }
  .clearfix:after {
    clear: both
  }
  .drag-list li {
    font-size: 14px;
    margin-bottom: 10px;
    list-style: none;
    text-align: left;
  }
  .el-progress {
    margin: 10px 5px;
  }
  .card-header {
    font-size: 20px;
    color: #409EFF;
    font-weight: 600;
    padding-right: 20px;
  }
</style>
