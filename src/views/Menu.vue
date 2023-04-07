<template>
  <div class="menu">
    <!-- 顶部搜索框 -->
    <div class="menu-seach">
      <van-search
      
        shape="round"
        placeholder="请输入搜索关键词"
        @focus="searchFocus"
      />
    </div>

    <!-- 左侧导航栏 -->
    <div class="menu-option">
      <!-- 全部选项 -->
      <div
        class="menu-item"
        v-for="(item, index) in menuOption"
        :key="index"
        @click="toMenu(index, item.type)"
        
      >
        <!-- 一个选项 -->
        <div class="m-item">
          <!-- 选项图标 -->
          <div class="m-icon">
            <img
              :src="menuIndex == index ? item.activeIcon : item.inactiveIcon"
              alt=""
              class="auto_img"
            />
          </div>
          <div class="m-text">{{ item.title }}</div>
        </div>
      </div>
    </div>

    <!-- 右侧商品 -->
    <div class="menu-product clearfix">
      <!-- 每一个商品 -->
      <div
        class="m-pro-item clearfix fl"
        v-for="(item, index) in productData"
        :key="index"
        @click="getDetail(item.pid,item)"
      >
        <div class="fl pro-img">
          <img :src="item.smallImg" alt="" class="auto_img" />
        </div>
        <!-- 热卖标签 -->
        <div
          class="hot"
          :style="`display:${item.isHot == 1 ? 'block' : 'none'}`"
        >
          热卖
        </div>

        <div class="fl text">
          <div class="pro-text">
            <div class="pro-name">{{ item.name }}</div>
            <div class="pro-enname">{{ item.enname }}</div>
          </div>
        </div>
        <div class="fl price">￥{{ item.price }}</div>
      </div>
    </div>
  </div>
</template>

<script>
import "../assets/less/Menu.less";
// 默认导出组件
export default {
  // 组件名称
  name: "Menu",
  data() {
    return {
      // 给选项赋予下标
      menuIndex: 0,
      menuOption: [
        {
          title: "热卖推荐",
          // 选中的下标
          activeIcon: require("../assets/images/icons_18.gif"),
          // 未选中的下表
          inactiveIcon: require("../assets/images/icons_03.gif"),
        },
        {
          title: "拿铁",
          // 选中的下标
          activeIcon: require("../assets/images/icons_18.gif"),
          // 未选中的下表
          inactiveIcon: require("../assets/images/icons_03.gif"),
        },
        {
          title: "咖啡",
          // 选中的下标
          activeIcon: require("../assets/images/icons_18.gif"),
          // 未选中的下表
          inactiveIcon: require("../assets/images/icons_03.gif"),
        },
        {
          title: "瑞纳冰",
          // 选中的下标
          activeIcon: require("../assets/images/icons_18.gif"),
          // 未选中的下表
          inactiveIcon: require("../assets/images/icons_03.gif"),
        },
        {
          title: "水果茶",
          // 选中的下标
          activeIcon: require("../assets/images/icons_18.gif"),
          // 未选中的下表
          inactiveIcon: require("../assets/images/icons_03.gif"),
        },
      ],
      // 接收商品数据
      productData: [],
    };
  },
  created() {
    // 调用商品类型数据
    this.getType();
  },
  methods: {
    // 切换选项
    toMenu(index, type) {
      if (this.menuIndex == index) {
        return;
      }
      this.menuIndex = index;
      this.getProductByType(type);
    },
    // 获取商品类型
    getType() {
      this.$toast.loading({
        message: "我来了我来了，我就快到了！",
        forbidClick: true,
        duration: 0,
      });
      this.axios({
        method: "GET",
        url: "/type",
        params: {
          appkey: this.appkey,
        },
      })
        .then((result) => {
          // console.log(result);
          this.$toast.clear();
          if (result.data.code == 400) {
            let data = result.data.result;
            // 获取到数据后，将缺失数据补入进去
            data.unshift({
              id: 5,
              type: "isHot",
              typeDesc: "热卖推荐",
            });
            // 对数组检测：map()方法,不会改变数组，返回的是新数组
            this.menuOption.map((v) => {
              for (let i = 0; i < data.length; i++) {
                // 匹配title与type
                // 若成功则新数组类型=data中的类型
                if (v.title == data[i].typeDesc) {
                  v.type = data[i].type;
                  break;
                }
              }
            });
            let type = this.menuOption[this.menuIndex].type;
            //调用根据商品类型获取商品方法
            this.getProductByType(type);
          }
        })
        .catch((err) => {
          this.$toast.clear();
        });
    },
    //根据商品类型获取商品方法
    getProductByType(type) {
      let params = {
        appkey: this.appkey,
      };
      if (type == "isHot") {
        params.key = "isHot";
        params.value = 1;
      } else {
        params.key = "type";
        params.value = type;
      }
      this.$toast.loading({
        message: "糟糕糟糕，偶买噶，魔法怎么失灵了！",
        forbidClick: true,
        duration: 0,
      });
      this.axios({
        method: "GET",
        url: "/typeProducts",
        params,
      })
        .then((result) => {
          this.$toast.clear();
          // console.log(result);

          if (result.data.code == 500) {
            this.productData = result.data.result;
          }
        })
        .catch((err) => {
          this.$toast.clear();
        });
    },
      // 查看商品详情页面
      getDetail(pid,item){
      // 传值 传入pid
      // 使用push加入元素
      this.$router.push({name:'Detail',params:{pid}});
      item.time = (new Date()).toLocaleDateString() + " " + (new Date()).toLocaleTimeString()
      this.$store.commit('addTrackCount',item)
    },
    // 搜索框获取焦点事件
    searchFocus() {
      this.$router.push({
        name: "Search",
      });
    },
  },
};
</script>

<style lang="less" scoped>
.menu-seach{
  position: fixed;
  width: 100%;
  z-index: 99;
}

.m-pro-item {
  width: 143px;
  height: 200px;
  position: relative;
  width: calc(~"50% - 25px");
  margin-right: 10px;
  padding: 10px;
  background-color: #fff;
  margin-bottom: 10px;
  border-radius: 8px;
  overflow: hidden;
  &:nth-child(2n) {
    margin-right: 0;
  }
}
.price {
  color: #e4393c;
  font-weight: 700;
  font-size: 0.37333rem;
  margin-right: auto;

  position: absolute;
  bottom: 10px;
}
.pro-enname {
  color: #999;
  width: 123px;
  font-size: 0.32rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.hot{
  background-color: rgba(255, 41, 41, 0.79);
  color: #fff;
  position:absolute;
  text-align: center;
  width: 30px;
  top: 0;
  right: 0;
  border-bottom-left-radius:10px ;
}

.pro-name {
  margin-top: 0.26667rem;
  font-size: 0.42667rem;
  margin-bottom: 5px;
}


</style>
  