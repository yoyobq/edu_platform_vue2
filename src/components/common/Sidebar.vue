<template>
    <div class="sidebar">
        <el-menu class="sidebar-el-menu" :default-active="onRoutes" :collapse="collapse" background-color="#324157"
            text-color="#bfcbd9" active-text-color="#20a0ff" unique-opened router>
            <template v-for="item in items">
                <template v-if="item.subs">
                    <el-submenu :index="item.index" :key="item.index">
                        <template slot="title">
                            <i :class="item.icon"></i><span slot="title">{{ item.title }}</span>
                        </template>
                        <el-menu-item v-for="(subItem,i) in item.subs" :key="i" :index="subItem.index">
                            <template v-if="isShow(subItem.limit)">
                              {{ subItem.title }}
                            </template>
                        </el-menu-item>
                    </el-submenu>
                </template>
                <template v-else>
                    <el-menu-item :index="item.index" :key="item.index">
                      <template v-if="isShow(item.limit)">
                        <i :class="item.icon"></i><span slot="title">{{ item.title }}</span>
                       </template>
                    </el-menu-item>
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
      permission: JSON.parse(sessionStorage.getItem('permission')),
      collapse: false,
      items: [
        // {
        //   icon: 'el-icon-star-on',
        //   index: 'dashboard',
        //   title: '系统首页'
        // },
        {
          icon: 'el-icon-tickets',
          index: 'module',
          title: this.$t('common.mainPage.module'),
          limit: 'none'
        },
        // {
        //   icon: 'el-icon-message',
        //   index: 'tabs',
        //   title: this.$t('common.mainPage.message')
        // },
        {
          icon: 'el-icon-setting',
          index: 'personal',
          title: this.$t('common.mainPage.personal'),
          limit: 'none'
        },
        {
          icon: 'el-icon-share',
          index: 'users',
          title: this.$t('common.mainPage.users'),
          limit: 'Admin'
        }
        // {
        //   icon: 'el-icon-date',
        //   index: '3',
        //   title: '表单相关',
        //   subs: [
        //     {
        //       index: 'form',
        //       title: '基本表单'
        //     },
        //     {
        //       index: 'editor',
        //       title: '富文本编辑器'
        //     },
        //     {
        //       index: 'markdown',
        //       title: 'markdown编辑器'
        //     },
        //     {
        //       index: 'upload',
        //       title: '文件上传'
        //     }
        //   ]
        // },
        // {
        //   icon: 'el-icon-star-on',
        //   index: 'charts',
        //   title: 'schart图表'
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
  },
  methods: {
    isShow (limit) {
      if (limit === 'none') {
        return true
      } else if (limit === this.permission.status) {
        return true
      }
      return false
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
