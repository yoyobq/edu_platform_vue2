<template>
  <div class="sidebar">
    <el-menu class="sidebar-el-menu" :default-active="onRoutes" :collapse="collapse" background-color="#324157"
      text-color="#bfcbd9" active-text-color="#20a0ff" unique-opened router>
      <template v-for="item in items">
        <template v-if="isShow(item.name)">
          <template v-if="item.subs">
            <el-submenu :index="item.index" :key="item.index">
              <template slot="title">
                <i :class="item.icon"></i><span slot="title">{{ item.title }}</span>
              </template>
              <el-menu-item v-for="(subItem,i) in item.subs" :key="i" :index="subItem.index">
                <template v-if="isShow(subItem.name)">
                  {{ subItem.title }}
                </template>
              </el-menu-item>
            </el-submenu>
          </template>
          <template v-else>
            <el-menu-item :index="item.index" :key="item.index">
              <i :class="item.icon"></i><span slot="title">{{ item.title }}</span>
            </el-menu-item>
          </template>
        </template>
      </template>
    </el-menu>
  </div>
</template>

<script>
import bus from '../common/bus'
export default {
  data () {
    return {
      permission: this.$session.get('permission'),
      collapse: false,
      items: [
        {
          icon: 'el-icon-star-on',
          index: 1,
          name: 'dashboard',
          title: '平台首页',
          limit: 'none'
        },
        {
          icon: 'el-icon-tickets',
          index: 2,
          name: 'module',
          title: this.$t('common.mainPage.module'),
          limit: 'none'
        },
        // {
        //   icon: 'el-icon-message',
        //   index: 'tab',
        //   title: this.$t('common.mainPage.message'),
        //   limit: 'none'
        // },
        {
          icon: 'el-icon-setting',
          index: 'personal',
          title: this.$t('common.mainPage.personal'),
          limit: 'none'
        },
        // {
        //   icon: 'el-icon-share',
        //   index: 'users',
        //   title: this.$t('common.mainPage.users'),
        //   limit: 'Admin'
        // },
        {
          icon: 'el-icon-date',
          index: '4',
          title: 'ManageMent',
          limit: 'none',
          subs: [
            {
              index: 1,
              name: 'users',
              title: this.$t('common.mainPage.users'),
              limit: 'Admin'
            },
            {
              index: 'appointList',
              title: 'AppointList',
              limit: 'Admin'
            }
          ]
        },
        {
          icon: 'el-icon-date',
          index: '3',
          title: '课程学习',
          limit: 'none',
          subs: [
            {
              index: 'form',
              title: '题库浏览',
              limit: 'none'
            },
            {
              index: 'editor',
              title: '自测练习',
              limit: 'none'
            },
            {
              index: 'charts',
              title: '成绩分析',
              limit: 'none'
            }
          ]
        }
        // {
        //   icon: 'el-icon-date',
        //   index: '4',
        //   title: 'form',
        //   limit: 'none',
        //   subs: [
        //     {
        //       index: 'form',
        //       title: '基本表单',
        //       limit: 'none'
        //     },
        //     {
        //       index: 'editor',
        //       title: '富文本编辑器',
        //       limit: 'none'
        //     },
        //     {
        //       index: 'markdown',
        //       title: 'markdown编辑器',
        //       limit: 'none'
        //     },
        //     {
        //       index: 'upload',
        //       title: '文件上传'
        //     }
        //   ]
        // }
        // {
        //   icon: 'el-icon-star-on',
        //   index: 'charts',
        //   title: 'schart',
        //   limit: 'none'
        // },
        // {
        //   icon: 'el-icon-rank',
        //   index: 'drag',
        //   title: '拖拽列表'
        // },
        // {
        //   icon: 'el-icon-warning',
        //   index: 'permission',
        //   title: '权限测试'
        // },
        // {
        //   icon: 'el-icon-error',
        //   index: '404',
        //   title: '404页面'
        // }
      ]
    }
  },
  computed: {
    onRoutes () {
      return this.$route.path.replace('/', '')
    }
  },
  created () {
    // 通过 Event Bus 进行组件间通信，来折叠侧边栏
    bus.$on('collapse', msg => {
      this.collapse = msg
    })
    // console.log(this.permission.status)
  },
  methods: {
    isShow (page) {
      switch (this.permission[page]) {
        case 'forbidden': return false
        case 'execute': return true
        case 'read': return true
        default: return false
      }
    }
  }
}
</script>

<style scoped>
    .sidebar{
        display: block;
        position: absolute;
        left: 0;
        top: 70px;
        bottom:0;
        overflow-y: scroll;
    }
    .sidebar::-webkit-scrollbar{
        width: 0;
    }
    .sidebar-el-menu:not(.el-menu--collapse){
        width: 200px;
    }
    .sidebar > ul {
        height:100%;
    }
</style>
