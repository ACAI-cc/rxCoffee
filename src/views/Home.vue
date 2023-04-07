<template>
  <div class="home">
    <!-- 顶部搜索框 -->
    <van-nav-bar>
      <template #left>
        <div class="home-nav">
          <div class="t1">{{ times }}</div>
          <div class="t2">{{userInfo.nickName}}</div>
        </div>
      </template>
      <template #right>
        <div class="home-search">
          <van-search
            shape="round"
            placeholder="请输入搜索关键词"
            @focus="searchFocus"
          />
        </div>
      </template>
    </van-nav-bar>
    <!-- 商品列表 -->
    <div class="home-content">
      <!-- 轮播图 -->
      <div class="banner-box" >
        <van-swipe class="my-swipe" :autoplay="3000" indicator-color="white">
          <van-swipe-item v-for="(item, index) in bannerData" :key="index">
            <div  @click="getDetail(item.pid)">
              <img class="auto_img" :src="item.bannerImg" alt="" />
            </div>
          </van-swipe-item>
        </van-swipe>

        <!-- 商品列表 -->
        <div class="product-box">
          <div>
            <div class="clearfix pro-title-box">
              <span class="pro-title">热卖推荐</span>
            </div>

            <div class="clearfix product">
              <!-- 商品图片盒，左浮动 -->
              <div
                class="pro-item fl"
                v-for="(item, index) in hotProduct"
                :key="index"
                @click="getDetail(item.pid,item)"
              >
                <div class="img-box">
                  <img :src="item.smallImg" class="auto_img" />
                </div>
                <!-- 热卖标签 -->
                <div class="hot">热卖</div>
                <!-- 商品简略信息 -->
                <div class="pro-info">
                  <div class="pro-name">{{ item.name }}</div>
                  <div class="pro-enname">{{ item.enname }}</div>
                  <div class="pro-price">￥{{ item.price }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>


<script>
// 外链的css引入
import "../assets/less/home.less";

// 默认导出组件
export default {
  // 组件名称
  name: "Home",
  data() {
    return {
      // 接受轮播图数据
      bannerData: [],
      // 接受商品列表数据
      hotProduct: [],
      // 定义一个变量接受问候语
      times: "",
      // 用户信息数据
      userInfo: {},
    };
  },

  created() {
    // 调用返回的数据
    this.getBannerData();
    this.getHotProduct();

    //调用getDate
    this.getDate();
    // 获取用户信息
    this.getUserInfo();
  },
  methods: {
    // 导航栏内容
    // 动态获取时间,根据当前时间，改变问候语
    getDate() {
      let hour = new Date().getHours();
      // console.log();

      // 问候语的判断
      if (hour < 6) {
        this.times = "早点睡捏";
      } else if (hour < 11) {
        this.times = "早捏";
      } else if (hour < 13) {
        this.times = "午好捏";
      } else if (hour < 18) {
        this.times = "下午好捏";
      } else if (hour < 23) {
        this.times = "晚好捏";
      }
    },

    // 定义方法获取图片
    // 获取轮播图数据
    getBannerData() {
      // 调用vant的轻提示中的加载提示
      this.$toast.loading({
        // 提示文字
        message: "糟糕糟糕，偶买噶，魔法怎么失灵了",

        // 点击穿透
        forbidClick: true,

        //延迟
        duration: 0,
      });

      // 发起请求
      this.axios({
        // 请求类型
        method: "GET",

        // 请求路径
        // 在main中已经配置了基础路径，所以在此处可以简写
        url: "/banner",

        // 请求参数data(数组[]，用data),params(对象{})选一个
        // data:[],
        params: {
          appkey: this.appkey,
        },

        // 发起请求，成功后能拿到东西的
      })
        //获取返回的数据
        .then((result) => {
          // console.log(result);

          // 获取到数据后，将请提示清除
          this.$toast.clear();

          // 判断是否成功获取数据
          if (result.data.code == 300) {
            this.bannerData = result.data.result;
          }
        })
        // 请求失败，可以看见错因
        .catch((err) => {
          console.log(err);
          // 若数据拉取失败，axios也会判断数据加载成功
          // 此时加载动画依旧存在，因此要清除加载中的动画
        });
    },

    // 获取商品列表
    getHotProduct() {
      // 调用vant的轻提示中的加载提示
      this.$toast.loading({
        // 提示文字
        message: "糟糕糟糕，偶买噶，魔法怎么失灵了",

        // 点击穿透
        forbidClick: true,

        //延迟
        duration: 0,
      });

      // 发起请求
      this.axios({
        // 请求类型
        method: "GET",

        // 请求路径
        // 在main中已经配置了基础路径，所以在此处可以简写
        url: "/typeProducts",

        // 请求参数data(数组[]，用data),params(对象{})选一个
        // data:[],
        params: {
          appkey: this.appkey,
          key: "isHot",
          value: 1,
        },

        // 发起请求，成功后能拿到东西的
      })
        //获取返回的数据
        .then((result) => {
          // console.log(result);

          // 获取到数据后，将请提示清除
          this.$toast.clear();

          // 判断是否成功获取数据
          if (result.data.code == 500) {
            this.hotProduct = result.data.result;
          }
        })
        // 请求失败，可以看见错因
        .catch((err) => {
          console.log(err);
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

    // 获取用户信息
    getUserInfo() {
      let tokenString = localStorage.getItem("token");
      // console.log(tokenString);
      if (!tokenString) {
        return;
      }
      this.$toast.loading({
        message: "糟糕糟糕，偶买噶，魔法怎么失灵了",
        forbidClick: true,
        duration: 0,
      });

      this.axios({
        method: "",
        url: "/findMy",
        params: {
          appkey: this.appkey,
          tokenString,
        },
      })
        .then((result) => {
          this.$toast.clear();
          if (result.data.code == "A001") {
            this.userInfo = result.data.result[0];
            // console.log(this.userInfo);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
  },
};
</script>


<style lang="less" scoped>
.pro-item {
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
.hot {
  background-color: rgba(255, 41, 41, 0.79);
  color: #fff;
  position: absolute;
  text-align: center;
  width: 30px;
  top: 0;
  right: 0;
  border-bottom-left-radius: 10px;
}
.pro-price {
  color: #e4393c;
  font-weight: 700;
  font-size: 0.37333rem;
  margin-right: auto;
}
.pro-name {
  margin-top: 0.26667rem;
  font-size: 0.42667rem;
}
.pro-enname {
  color: #999;
  font-size: 0.32rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
