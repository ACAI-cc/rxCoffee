<template>
  <div class="main">
    <!-- 二级路由： -->
    <div>
      <router-view>

      </router-view>
    </div>

    <!-- 底部导航栏 -->

    <van-tabbar v-model="activeName" route>
      <van-tabbar-item 
      :icon="item.icon" 
      v-for="(item,index) in tabbarData" 
      :key="index"
      replace
      :to="item.path"
      :name="item.name">
      <span>{{item.title}}</span>
      <!-- 给子组件提供一个占位符 ---插槽 -->
      <!-- 默认插槽 <slot></slot> -->
      <!-- 作用域插槽 -->
      <!-- 将vant组件库视为父组件 -->
      <template #icon="props">
        <!-- 
          由于我们使用了v-bind绑定了icon为item里面的里的图标icon，
          因此文档中的icon应全部替换为item.icon
          又因item中已经拥有activeImg和inactiveImg，
          因此直接调用即可
         -->
        <img :src="props.active ? item.activeImg : item.inactiveImg">
      </template>

      </van-tabbar-item>
    </van-tabbar>
    
    
  </div>
</template>
<script>
export default {
  name: "Main",

  data() {
    return {
      // 激活标签名称
      activeName:'Home',

      tabbarData:[
        {
          title:"首页",
          // 图标名称
          icon:'wap-home-o',
          // 跳转页面（路由）的名称
          name:'Home',
          // 路由路径
          path:'/main/home',

          // 
          inactiveImg:require('../assets/images/home.png'),
          activeImg:require('../assets/images/home_active.png'),
        },
        {
          title:"菜单",
          // 图标名称
          icon:'wap-home-o',
          // 跳转页面（路由）的名称
          name:'Meneu',
          // 路由路径
          path:'/main/menu',

          // 
          inactiveImg:require('../assets/images/icons_09.gif'),
          activeImg:require('../assets/images/icons_21.gif'),
        },
        {
          title:"购物袋",
          // 图标名称
          icon:'wap-home-o',
          // 跳转页面（路由）的名称
          name:'Shopbag',
          // 路由路径
          path:'/main/shopbag',

          // 
          inactiveImg:require('../assets/images/shopbag.png'),
          activeImg:require('../assets/images/shopbag_active.png'),
        },
        {
          title:"我的",
          // 图标名称
          icon:'wap-home-o',
          // 跳转页面（路由）的名称
          name:'User',
          // 路由路径
          path:'/main/user',

          // 
          inactiveImg:require('../assets/images/my.png'),
          activeImg:require('../assets/images/my_active.png'),
        },
        
        
        

      ]
    };
  },
  methods: {},
};
</script>
<style lang="less">
</style>
