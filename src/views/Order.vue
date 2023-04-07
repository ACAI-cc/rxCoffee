<template>
  <div class="order">
    <van-nav-bar
      title="订单中心"
      left-text="返回"
      left-arrow
      fixed
      @click-left="onClickLeft"
    />
    <BgBox>
      <div class="box" v-if="isHas">
        <van-tabs
          v-model="tabIndex"
          color="#0c43ba"
          title-active-color="#0c34ba"
          line-height="2"
          @change="changeTab"
        >
          <van-tab
            v-for="(item, index) in tabData"
            :key="index"
            :title="item.title"
          >
            <div class="box" v-if="orderData.length > 0">
              <div class="order-box" v-for="(v, k) in orderData" :key="v.oid">
                <div class="gg"></div>
                <OrderList
                  :info-title-left="'订单编号：'+v.oid"
                  :date="v.date | formatDate('yyy-MM-dd hh:mm:ss')"
                  :count="v.count"
                  :total="v.total | decimal"
                  :is-right="true"
                  @confirm-receive="confirmReceive(v, k)"
                  @remove="removeOrder(v.oid, k)"
                  :is-receive="v.status == 2"
                >
                  <!-- <div class="item">
                    <ProItem
                    v-for="(value, idx) in v.data"
                    :key="idx"
                    :item="value"
                  >
                  </ProItem>
                  </div> -->

                  <div class="item" v-for="(item, idx) in v.data" :key="idx">
                    <div class="fl pro-info-box">
                      <div class="fl pro-img">
                        <img :src="item.smallImg" alt="" class="auto_img" />
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
            </div>
            <div v-else>
              <van-empty description="没有订单数据"></van-empty>
            </div>
          </van-tab>
        </van-tabs>
      </div>
      <div v-else>
        <van-empty description="没有订单数据"></van-empty>
      </div>
    </BgBox>
  </div>
</template>
  
  <script>
import BgBox from "../components/BgBox.vue";
import ProItem from "../components/ProItem.vue";
import OrderList from "../components/OrderList.vue";
export default {
  name: "Order",
  data() {
    return {
      // 选中tab的下标
      tabIndex: 0,

      tabData: [{ title: "全部" }, { title: "进行中" }, { title: "已完成" }],

      // 订单数据
      orderData: [],

      // 没有订单数据
      isHas: true,
    };
  },
  components: {
    // 2.注册组件
    BgBox,
    ProItem,
    OrderList,
  },

  created() {
    this.getOrderDataByStatus();
  },

  methods: {
    onClickLeft() {
      this.$router.go(-1);
    },

    // 切换订单status
    changeTab(name, title) {
      this.getOrderDataByStatus();
    },

    // 获取订单数据
    getOrderDataByStatus() {
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
        url: "/findOrder",
        params: {
          appkey: this.appkey,
          tokenString,
          status: this.tabIndex,
        },
      })
        .then((result) => {
          // console.log(result);
          this.$toast.clear();
          if (result.data.code == 700) {
            // 此时校验无效，让用户重新登入
            this.$router.push({ name: "Login" });
          } else if (result.data.code == 70000) {
            // 若不存在订单则移除tab
            if (this.tabIndex == 0 && result.data.result.length == 0) {
              this.isHas = false;
              return;
            }

            // 根据订单编号oid进行分类
            let orderDatas = [];
            result.data.result.map((v) => {
              // 查询orderdatas的订单数据,若有数据,则其存放在当前订单中,并累加当前顶答案的数量余总金额
              for (let i = 0; i < orderDatas.length; i++) {
                if (orderDatas[i].oid == v.oid) {
                  orderDatas[i].data.push(v);
                  orderDatas[i].count += v.count;
                  orderDatas[i].total += v.count * v.price;

                  return;
                }
              }
              // 若无订单数据,则初始化当前订单数据
              let o = {};
              o.oid = v.oid;
              o.count = v.count;
              o.total = v.count * v.price;
              o.status = v.status;
              o.date = v.createdAt;
              o.data = [v];
              orderDatas.push(o);
            });
            this.orderData = orderDatas;
            // console.log("##", orderDatas);
          }
        })
        .catch((err) => {
          this.$toast.clear();
        });
    },

    // 确认收货
    confirmReceive(item, index) {

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
        url: "/receive",
        data: {
          appkey: this.appkey,
          tokenString,
          oid:item.oid
        },
      })
        .then((result) => {
          // console.log(result);
          this.$toast.clear();
          if (result.data.code == 700) {
            // 此时校验无效，让用户重新登入
            this.$router.push({ name: "Login" });
          } else if (result.data.code == 80000) {
            if(this.tabIndex == 1){
              this.orderData.splice(index,1);
             
            }
            item.status = 2
          }
          this.$toast(result.data.msg);
        })
        .catch((err) => {
          this.$toast.clear();
        });
    },
    // 删除订单
    removeOrder(oid,index) {
      
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
        url: "/removeOrder",
        data: {
          appkey: this.appkey,
          tokenString,
          oid:oid
        },
      })
        .then((result) => {
          // console.log(result);
          this.$toast.clear();
          if (result.data.code == 700) {
            // 此时校验无效，让用户重新登入
            this.$router.push({ name: "Login" });
          } else if (result.data.code == 90000) {
           this.orderData.splice(index,1);
          }
          this.$toast(result.data.msg);
        })
        .catch((err) => {
          this.$toast.clear();
        });
    },
  },
};
</script>
  
<style lang="less" scoped>
  .bg-box{
    margin-top: 47px;
  }
.gg {
  height: 10px;
  background-color: #f7f7f7;
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
  .num-box{
    color: #444;
    position: absolute;
    bottom: 15px;
    right: 20px;
  }
}
</style>