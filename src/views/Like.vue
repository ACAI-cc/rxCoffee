<template>
  <div class="like">
    <van-nav-bar
      title="我的收藏"
      left-text="返回"
      left-arrow
      fixed
      @click-left="onClickLeft"
    />
    <!-- 使用组件 -->
    <BgBox>
      <div v-if="products.length > 0">
        <div class="box clearfix">
          <div class="fl item" v-for="(item, index) in products" :key="index">
            <ProItem :item="item">
              <div @click.stop="remove(item.pid, index)">
                <van-icon name="delete-o" size="18" color="#999" />
              </div>
            </ProItem>
          </div>
        </div>
      </div>
      <div v-else>
        <van-empty description="还没有收藏的商品哦~" />
      </div>
    </BgBox>
  </div>
</template>
  
  <script>
import BgBox from "../components/BgBox.vue";
import ProItem from "../components/ProItem.vue";

export default {
  name: "Like",
  data() {
    return {
      // 搜索商品的数据
      products: [],
    };
  },
  components: {
    // 2.注册组件
    BgBox,
    ProItem,
  },
  created() {
    this.Like();
  },
  methods: {
    onClickLeft() {
      this.$router.go(-1);
    },
    Like() {
      let tokenString = localStorage.getItem("token");

      if (!tokenString) {
        this.$toast("是不是忘记登入啦~");
        return this.$router.push({ name: "Login" });
      }
      this.$toast.loading({
        message: "糟糕糟糕，偶买噶，魔法怎么失灵了",
        forbidClick: true,
        duration: 0,
      });

      // 发起请求
      this.axios({
        method: "GET",
        url: "/findAllLike",
        params: {
          appkey: this.appkey,

          tokenString,
        },
      })
        .then((result) => {
          // console.log(result);
          this.$toast.clear();
          if (result.data.code == 700) {
            // 此时校验无效，让用户重新登入
            this.$router.push({ name: "Login" });
          } else if (result.data.code == "2000") {
            this.products = result.data.result;
          } else {
            this.$toast(result.data.msg);
          }
        })
        .catch((err) => {
          this.$toast.clear();
        });
    },
    remove(pid, index) {
      let tokenString = localStorage.getItem("token");

      if (!tokenString) {
        this.$toast("是不是忘记登入啦~");
        return this.$router.push({ name: "Login" });
      }
      this.$toast.loading({
        message: "糟糕糟糕，偶买噶，魔法怎么失灵了",
        forbidClick: true,
        duration: 0,
      });
      this.axios({
        method: "POST",
        url: "/notlike",
        data: {
          appkey: this.appkey,
          pid,
          tokenString,
        },
      })
        .then((result) => {
          // console.log(result);
          this.$toast.clear();
          if (result.data.code == 700) {
            // 此时校验无效，让用户重新登入
            this.$router.push({ name: "Login" });
          } else if (result.data.code == 900) {
            this.$toast("删除成功");
            // 根据下标删除商品
            this.products.splice(index, 1);
          } else {
            this.$toast("删除失败");
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
.bg-box {
  margin-top: 47px;
}
.van-nav-bar {
  height: 46px;
}
.box {
  padding: 10px;
}
.item {
  background-color: #fff;
  width: 100%;
  position: relative;
  width: calc(~"49% - 25px");
  margin-right: 10px;
  padding: 10px;
  border: rgb(231, 231, 231) solid 1px;
  margin-bottom: 10px;
  border-radius: 8px;
  overflow: hidden;
  &:nth-child(2n) {
    margin-right: 0;
  }
}
.van-icon {
  margin-left: 70px;
  width: 16px;
  height: 16px;
}
</style>