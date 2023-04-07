<template>
  <div class="pay">
    <!-- 购物袋顶部导航栏 -->
    <van-nav-bar
      title="订单结算"
      left-text="返回"
      left-arrow
      fixed
      @click-left="onClickLeft"
    />

    <div class="pay-box">
      <div class="select-address">
        <div>
          <span class="add-title" @click="showAddress">选择地址</span>
          <van-icon name="arrow" size="14px"></van-icon>
        </div>
        <div class="user-box">
          <div class="userinfo">
            <div class="user-name">{{ currentAddress.name }}</div>
            <div class="user-phone">{{ currentAddress.tel }}</div>
            <div class="default-address" v-if="currentAddress.isDefault">
              默认
            </div>
          </div>
          <div class="detail-address">{{ currentAddress.address }}</div>
        </div>
      </div>

      <!-- 订单信息 -->
      <div class="order-info">
        <OrderList :count="productInfo.count" :total="productInfo.total">
          <!-- <ProItem
                v-for="(item,index) in products"
                :key="index"
                :item="item"
              >
              </ProItem> -->
          <div class="item" v-for="(item, index) in products" :key="index">
            <div class="fl pro-info-box">
              <div class="fl pro-img">
                <img :src="item.small_img" alt="" class="auto_img" />
              </div>
              <div class="fl pro-info">
                <div class="pro-info-text">
                  <div class="clearfix names">
                    <div class="fl pro-name">{{ item.name }}</div>
                    <div class="fl pro-rule">{{ item.rule }}</div>
                  </div>
                  <div class="pro-enname">{{ item.enname }}</div>
                </div>
              </div>
              <div class="pro-count-box">
                <div class="fl pro-price">￥{{ item.price }}</div>
                <div class="num-box fr">x{{ item.count }}</div>
              </div>
            </div>
          </div>
        </OrderList>
      </div>

      <!-- 按钮信息 -->
      <div class="btn-box">
        <van-button type="primary" block round color="#0c34ba" @click="payBox">
          立即结算
        </van-button>
      </div>

      <van-popup color="#0c34ba" is-link v-model="isOpen" closeable position="bottom">
        <div class="address-title">选择地址</div>
        <van-address-list
          v-model="chosenAddressId"
          :list="list"
          default-tag-text="默认"
          @add="newAddress"
          @select="selectAddress"
        />
      </van-popup>
    </div>
  </div>
</template>

<script>
import ProItem from "../components/ProItem.vue";
import OrderList from "../components/OrderList.vue";

export default {
  name: "Pay",
  data() {
    return {
      // 控制弹出层变量
      isOpen: false,

      // 地址列表
      list: [],

      // 选择当前地址的对象
      currentAddress: {},

      // 选择当前地址的aid
      chosenAddressId: "",

      // 购物袋id
      sids: [],

      // 需要购买商品的数据
      products: [],

      // 商品的数量和金额
      productInfo: {
        count: 0,
        total: 0,
      },
    };
  },
  components: {
    ProItem,
    OrderList,
  },
  created() {
    // 截获sid参数
    this.sids = this.$route.query.sids.split("-");

    //获取地址列表数据
    this.getAddressData();

    // 根据sids获取购物袋数据
    this.getShopbagBySids();
  },

  methods: {
    onClickLeft() {
      this.$router.go(-1);
    },

    //获取地址的列表数据
    getAddressData() {
      let tokenString = localStorage.getItem("token");

      if (!tokenString) {
        this.$toast("是不是忘记登入啦~");
        return this.$router.push({ name: "Login" });
      }
      this.$toast.loading({
        message: "加载中...",
        forbidClick: true,
        duration: 0,
      });

      // 发起请求
      this.axios({
        method: "GET",
        url: "/findAddress",
        params: {
          appkey: this.appkey,
          tokenString,
        },
      })
        .then((result) => {
          //   console.log(result);
          this.$toast.clear();
          if (result.data.code == 700) {
            // 此时校验无效，让用户重新登入
            this.$router.push({ name: "Login" });
          } else if (result.data.code == 20000) {
            // 将获取到的数据对象中的数组提取出来--map
            result.data.result.map((v) => {
              v.isDefault = Boolean(v.isDefault);
              v.id = v.aid;
              v.address = `${v.province}${v.city}${v.county}${v.addressDetail}`;

              //   选择默认地址
              if (v.isDefault) {
                this.currentAddress = v;
                this.chooseAddressId = v.id;
              }
            });
            this.list = result.data.result;
          }
        })
        .catch((err) => {
          this.$toast.clear();
        });
    },

    // 根据sids获取购物袋数据
    getShopbagBySids() {
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
        url: "/commitShopcart",
        params: {
          appkey: this.appkey,
          tokenString,
          sids: JSON.stringify(this.sids),
        },
      })
        .then((result) => {
          this.$toast.clear();
          //   console.log(result);
          if (result.data.code == 700) {
            // 此时校验无效，让用户重新登入
            this.$router.push({ name: "Login" });
          } else if (result.data.code == 50000) {
            // 拿到数据存在有商品与无商品
            if (result.data.result.length == 0) {
              return this.$router.push({ name: "Shopbag" });
            }
            result.data.result.map((v) => {
              this.productInfo.count += v.count;
              this.productInfo.total += v.count * v.price;
            });
            this.products = result.data.result;
          } else {
            this.$toast(result.data.msg);
          }
        })
        .catch((err) => {
          console.log(err);
          this.$toast.clear();
        });
    },

    //展示地址列表
    showAddress() {
      this.isOpen = true;
    },

    // 选择地址
    selectAddress(item, index) {
      this.isOpen = false;
      this.currentAddress = item;
    },
    // 新增地址
    newAddress() {
      this.$router.push({ name: "NewAddress" });
    },

    // 立即结算
    pay() {
      let tokenString = localStorage.getItem("token");

      if (!tokenString) {
        this.$toast("是不是忘记登入啦~");
        return this.$router.push({ name: "Login" });
      }
      this.$toast.loading({
        message: "加载中...",
        forbidClick: true,
        duration: 0,
      });

      // 发起请求
      this.axios({
        method: "POST",
        url: "/pay",
        data: {
          appkey: this.appkey,
          tokenString,
          sids: JSON.stringify(this.sids),
          phone: this.currentAddress.tel,
          address: this.currentAddress.address,
          receiver: this.currentAddress.name,
        },
      })
        .then((result) => {
          console.log(result);
          this.$toast.clear();
          if (result.data.code == 700) {
            // 此时校验无效，让用户重新登入
            this.$router.push({ name: "Login" });
          } else {
            this.$toast(result.data.msg);
            setTimeout(() => {
              this.$router.push({ name: "Order" });
            });
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },

    //
    payBox() {
      if (!this.chosenAddressId) {
        this.$toast("是不是忘了选择地址呀");
        return;
      }
      this.$dialog
        .confirm({
          title: "确认订单",
          message: "是否进行结算",
        })
        .then(() => {
          this.pay();
        })
        .catch((err) => {
          console.log(err);
        });
    },
  },
};
</script>

<style lang="less" scoped>
.pay-box {
  margin-top: 50px;
  padding: 10px;
}

.select-address {
  background-color: #fff;
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
  padding: 10px;
  .add-title {
    color: #444;
    font-size: 16px;
    font-weight: bold;
    margin-top: 10px;
  }
  .van-icon {
    margin-left: 5px;
  }
  .user-box {
    margin-top: 10px;

    .userinfo {
      position: relative;
      .user-name {
        color: #444;
        font-size: 14px;
        font-weight: bold;
      }
      .user-phone {
        position: absolute;
        top: 2px;
        left: 40px;
        color: #666;
        font-size: 14px;
      }
      .default-address {
        position: absolute;
        top: 2px;
        left: 150px;
        width: 30px;
        height: 16px;
        background-color: #0c34ba;
        color: #fff;
        border-radius: 20px;
        text-align: center;
      }
    }

    .detail-address {
      color: #999;
      margin-top: 10px;
    }
  }
}
.order-info {
  // border-radius: ;
  margin-top: 20px;
}

.item {
  height: 100px;
  position: relative;
  overflow: hidden;
  .pro-img {
    height: 80px;
    width: 80px;
    margin-bottom: 10px;
    margin-right: 10px;
  }
  .names {
    // background-color: red;

    font-size: 14px;
    margin: 10px 0;
    .pro-name {
      color: #444;
      width: 85px;
      height: 19px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .pro-rule {
      color: #666;
      margin: 0 20px;
      width: 100px;
      height: 19px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }
  .pro-enname {
    width: 215px;
    height: 13px;
    font-size: 12px;
    color: #999;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .pro-price {
    color: #e4393c;
    font-weight: 700;
    font-size: 0.37333rem;
    margin: 15px 0;
  }
  .num-box {
    color: #444;
    position: absolute;
    bottom: 15px;
    right: 20px;
  }
}

.btn-box {
  margin-top: 100px;
}

.address-title {
  font-size: 16px;
  font-weight: bold;
  padding: 20px 0 10px 10px;
  color: #444;
}
.van-tag--danger{
    background-color: #0c34ba;
}
.van-button--danger{
    background-color: #0c34ba;
    border-color: #0c34ba;

}
/deep/ .van-address-item .van-radio__icon--checked .van-icon {
    background-color: #0c34ba;
    border-color: #0c34ba;
}
</style>