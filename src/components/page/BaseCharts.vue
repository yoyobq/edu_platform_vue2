<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-date"></i> 自学自测</el-breadcrumb-item>
                <el-breadcrumb-item>成绩分析</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <!-- <div class="plugins-tips"> -->
                <!-- vue-schart：vue.js封装sChart.js的图表组件。 -->
                <!-- 访问地址：<a href="https://github.com/lin-xin/vue-schart" target="_blank">vue-schart</a> -->
            <!-- </div> -->
            <div class="schart-box">
                <!-- <div class="content-title">柱状图</div> -->
                <schart class="schart" canvasId="bar" :data="data1" type="bar" :options="options1"></schart>
            </div>
            <div class="schart-box">
              <!-- <div class="content-title">折线图</div> -->
              <schart class="schart" canvasId="line" :data="data3" type="line" :options="options2"></schart>
            </div>
            <!-- <div class="schart-box">
              <div class="content-title">饼状图</div>
              <schart class="schart" canvasId="pie" :data="data2" type="pie" :options="options3"></schart>
            </div>
            <div class="schart-box">
              <div class="content-title">环形图</div>
              <schart class="schart" canvasId="ring" :data="data2" type="ring" :options="options4"></schart>
            </div> -->
        </div>
    </div>
</template>

<script>
import Schart from 'vue-schart'
export default {
  name: 'basecharts',
  components: {
    Schart
  },
  data: () => ({
    data1: [
      {name: '9/15', value: 71},
      {name: '9/18', value: 79},
      {name: '9/19', value: 70},
      {name: '9/21', value: 70},
      {name: '9/22', value: 77}
    ],
    data2: [
      {name: 'Linux基础', value: 1200},
      {name: 'HTML', value: 1222},
      {name: 'C语言程序设计', value: 1283},
      {name: '数据结构和算法', value: 1314},
      {name: '.NET编程', value: 2314}
    ],
    data3: [
      {name: '9/15', value: 61},
      {name: '9/18', value: 95},
      {name: '9/19', value: 87},
      {name: '9/21', value: 79},
      {name: '9/22', value: 84}
    ],
    options1: {
      title: '近五次自测得分',
      autoWidth: true, // 设置宽高自适应
      showValue: true,
      bgColor: '#F9EFCC',
      fillColor: '#00887C',
      contentColor: 'rgba(46,199,201,0.3)'
      // yEqual: 12
    },
    options2: {
      title: '网页设计随堂测试得分',
      bgColor: '#D5E4EB',
      titleColor: '#00887C',
      fillColor: 'red',
      contentColor: 'rgba(46,199,201,0.3)'
    },
    // options3: {
    //   title: '某商店各商品年度销量',
    //   bgColor: '#829dca',
    //   titleColor: '#ffffff',
    //   legendColor: '#ffffff',
    //   radius: 120
    // },
    options4: {
      title: '某商店各商品年度销量',
      bgColor: '#829daa',
      titleColor: '#ffffff',
      legendColor: '#ffffff',
      radius: 120,
      innerRadius: 80
    }
  })
}
</script>

<style scoped>
.schart-box{
    display: inline-block;
    margin: 20px;
}
    .schart{
        width: 500px;
        height: 400px;
    }
    .content-title{
        clear: both;
        font-weight: 400;
        line-height: 50px;
        margin: 10px 0;
        font-size: 22px;
        color: #1f2f3d;
    }
    
</style>