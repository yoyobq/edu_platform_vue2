<template>
  <el-dialog title="第 3 步（共 3 步）：建立帐号并完成注册" :visible.sync="createShow" width="685px" :close-on-click-modal="false" :close-on-press-escape="false" :show-close="false">
    <span slot="footer" class="dialog-footer">
        <el-button @click="cancelCheck">回到上一步</el-button>
    </span>
  </el-dialog>
</template>
<script>
export default {
  name: 'createForm',
  props: ['createShow', 'data'],
  data: function () {
    return {
      // stuInfo: {
      //   '证件号码': '',
      //   '学号': '',
      //   '姓名': '',
      //   '性别': '',
      //   '所在年级': '',
      //   '所在学部': '',
      //   '所在专业': '',
      //   '所在班级': '',
      //   '是否在籍': '',
      //   '是否在校': '',
      //   '是否住宿': '',
      //   '是否下厂实习': '',
      //   '入学层次': ''
      // }
    }
  },
  methods: {
    cancelCheck () {
      this.$emit('update:createShow', false)
    }
  },
  watch: {
    // chkInfoShow 与 chkInfoVisible 父子组件联动
    createShow: function () {
    },
    data: function () {
    }
  },
  computed: {

  }
}
</script>

<style scoped>
  .clearfix:before,
  .clearfix:after {
    display: table;
    content: "";
  }
  .clearfix:after {
    clear: both
  }

  .name-text{
    font-size: 20px;
    font-weight: 500;
    color: #409EFF;
    padding-right: 30px;
  }

  .card-button {
    float: right;
    /* padding: 3px 0; */
    font-size: 12px;
  }

  .stu-card {
    /* width: 200px; */
  }

  .stu-ul {
    list-style-type: none;
    font-size: 12px;
    font-weight: 500;
  }

  .stu-ul li {
    padding-right: 30px;
    display: inline;
  }
</style>
