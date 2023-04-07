<template>
  <div class="address my-address">
    <van-nav-bar
      title="地址管理"
      left-text="返回"
      left-arrow
      fixed
      @click-left="onClickLeft"
    />
    <!-- 使用组件 -->
    <div>
      <van-address-list
        :list="list"
        default-tag-text="默认"
        @add="add"
        @edit="edit"
        :switchable="false"
      />
    </div>
    <div v-show="list.length === 0">
      <van-empty description="还没有收藏的商品哦~" />
    </div>
  </div>
</template>
  
  <script>
import BgBox from "../components/BgBox.vue";

export default {
  name: "Address",
  components: {
    // 2.注册组件
    BgBox,
  },
  data() {
    return {
      list: [],
    };
  },
  created(){
    this.getAddressData();
  },
  methods: {
    onClickLeft() {
      this.$router.push({name:"User"});
    },

    // 获取地址列表
    getAddressData() {
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
        url: "/findAddress",
        params: {
          appkey: this.appkey,
          tokenString
        }
      })
        .then((result) => {
          this.$toast.clear();
          // console.log(result);
          if (result.data.code == 700) {
            // 此时校验无效，让用户重新登入
            this.$router.push({ name: "Login" });
          } else if (result.data.code == 20000) {
            // 将获取到的数据对象中的数组提取出来--map
            result.data.result.map((v) => {
              v.isDefault = Boolean(v.isDefault);
              v.id = v.aid;
              v.address = `${v.province}${v.city}${v.county}${v.addressDetail}`;
            });

            this.list = result.data.result;
          }
        })
        .catch((err) => {
          console.log(err);
          this.$toast.clear();
        });
    },

    // 新增地址
    add() {
      this.$router.push({ name: "NewAddress" });
    },
    // 修改地址
    edit(item) {
      this.$router.push({ name: "NewAddress", query: { aid: item.aid } });
    },
  },
};
</script>

<style>
.my-address{
  margin-top: 46px;
}
.van-button--danger {
  background-color: #0c34ba;
  border: #0c34ba 1px solid;
}
.van-tag--danger {
    background-color: #0c34ba;
}
</style>