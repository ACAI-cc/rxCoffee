<template>
  <div class="shopbag">
    <!-- 购物袋顶部导航栏 -->
    <van-nav-bar
      title="购物袋"
      left-text="返回"
      left-arrow
      fixed
      @click-left="onClickLeft"
      @click-right="isEdit = !isEdit"
    >
      <template #right>
        <div v-if="allShopbagData.length > 0">
          {{ isEdit ? "完成" : "编辑" }}
        </div>
      </template>
    </van-nav-bar>

    <div class="bg"></div>

    <!-- 展示信息页 -->
    <div v-if="shopbagData.length == 0">
      <van-empty description="购物袋空空如也,快去逛一逛!" />
    </div>
    <div class="shopbag-box" v-else>
      <div class="shopbag-bg">
        <!-- 懒加载组件 -->
        <van-list
          v-model="loading"
          :finished="finished"
          finished-text="哎呀哎呀,这就是全部啦"
          @load="loadData"
        >
          <div class="shopbag-product">
            <div
              class="shopbag-item"
              v-for="(item,index) in shopbagData"
              :key="item.sid"
            >
              <div class="cell-item">
                <van-swipe-cell :disabled="isEdit">
                  <div class="clearfix cell-item-box">
                    <!-- 圆圈盒子 -->
                    <div class="fl check-box">
                      <van-checkbox
                        @change="simpleSelect"
                        v-model="item.isChecked"
                      />
                    </div>
                    <!-- 商品内容盒子 -->
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
                        <!-- 价钱和计步器 -->
                        <div class="pro-count-box">
                          <div class="fl pro-price">￥{{ item.price }}</div>
                          <div class="step-box fr">
                            <van-stepper
                              v-model="item.count"
                              theme="round"
                              button-size="22"
                              disable-input
                              @change="changeCount(item)"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <template #right>
                    <van-button square type="danger" text="删除" @click="removeOne(index, item.sid)" />
                  </template>
                </van-swipe-cell>
              </div>
            </div>
          </div>
        </van-list>

        <van-submit-bar
        v-if="!isEdit"
          :price="total"
          button-text="提交订单"
          @submit="onSubmit"
          button-color="#1a73e8"
        >
          <van-checkbox @change="allSelect" v-model="isAllChecked"
            >全选</van-checkbox
          >
        </van-submit-bar>

        <van-submit-bar
        v-else
          
          button-text="删除选中"
          @submit=" removeSelected"
          button-color="#ee0a24"
        >
        <van-checkbox class="delete-all" @change="allSelect" v-model="isAllChecked"
            >全选</van-checkbox
          >
        </van-submit-bar>
      </div>
    </div>
  </div>
</template>

  <script>
import "../assets/less/Shopbag.less";

// 默认导出组件
export default {
  // 组件名称
  name: "Shopbag",
  data() {
    return {
      // 是否选中
      isCheck: false,

      // 是否处于编辑状态
      isEdit: false,

      // 购物袋商品数量
      count: 2,

      // 是否全选
      isAllChecked: false,

      // 是否需要懒加载
      loading: true,

      // 是否全部加载完成数据
      finished: false,

      // 所有购物袋数据
      allShopbagData: [],

      // 需要展示的商品的数组
      shopbagData: [],

      // 下拉加载的数量
      dataCount: 4,

      // 开始截取购物袋数据的位置
      startIndex: 0,

      // 订单总金额
      total: 0,
    };
  },
  created() {
    this.getShopbagData();

  },
  methods: {
    onClickLeft() {
      this.$router.go(-1);
    },

    // 获取购物袋数据
    getShopbagData() {
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
        method: "GET",
        url: "/findAllShopcart",
        params: {
          appkey: this.appkey,
          tokenString,
        },
      })
        .then((result) => {
          this.$toast.clear();
          // console.log(result);
          if (result.data.code == 700) {
            // 此时校验无效，让用户重新登入
            this.$router.push({ name: "Login" });
          } else if (result.data.code == 5000) {
            result.data.result.map((v) => {
              v.isChecked = false;
            });
            this.allShopbagData = result.data.result;

            // 截取数据
            // 根据开始截取位置和截取数据数量设置购物袋显示的数据
            this.shopbagData = this.allShopbagData.slice(
              this.startIndex,
              this.startIndex + this.dataCount
            );

            this.startIndex += this.dataCount;

            // 未加载的数据
            this.loading = false;
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },

    // 懒加载商品-->通过定时器来实现
    loadData() {
      setTimeout(() => {
        // 在allshopbagdata中截取数据
        let data = this.allShopbagData.slice(
          this.startIndex,
          this.startIndex + this.dataCount
        );

        this.startIndex += this.dataCount;

        this.shopbagData.push(...data);

        this.isAllChecked = false;

        // console.log("到这了");
        // 若截取数据不足八条,下次不截取数据
        if (data.length < this.dataCount) {
          // 没有数据可以加载,就需要将finished修改为true,这样就不会在执行onload事件
          this.finished = true;
        } else {
          // 每次出发onload事件是,将loading修改为false
          this.loading = false;
        }
      }, 1500);
    },

    // 选择商品
    simpleSelect() {
      for (let i = 0; i < this.shopbagData.length; i++) {
        if (!this.shopbagData[i].isChecked) {
          // 选择单选,全选失效
          this.isAllChecked = false;
          this.sum();
          return;
        }
      }
      this.isAllChecked = true;
      this.sum;
    },

    // 全选
    allSelect() {
      
      this.shopbagData.map((v) => {
        v.isChecked = this.isAllChecked;
      });
      this.sum();
    },

    // 单个删除
    removeOne(index, sid) {
      let tokenString = localStorage.getItem("token");

      if (!tokenString) {
        this.$toast("是不是忘记登入啦~");
        return this.$router.push({ name: "Login" });
      }

      // 发起请求
      this.axios({
        method: "POST",
        url: "/deleteShopcart",
        data: {
          appkey: this.appkey,
          tokenString,
          sids: JSON.stringify([sid]),
        },
      })
        .then((result) => {
          this.$toast.clear();
          // console.log(result);
          if (result.data.code == 700) {
            // 此时校验无效，让用户重新登入
            this.$router.push({ name: "Login" });
          } else if (result.data.code == 7000) {
            this.shopbagData.splice(index, 1);
            this.sum();
          }
          this.$toast(result.data.msg);
        })
        .catch((err) => {

          this.$toast.clear();
        });
    },

    // 判断是否勾选商品
    isSelectProduct() {
      for (let i = 0; i < this.shopbagData.length; i++) {
        if (this.shopbagData[i].isChecked) {
          // ischecked为true就证明勾选上了,check返回为true
          return true;
        }
      }
    },

    // 删除选择商品
    removeSelected() {
      let isHas = this.isSelectProduct();
      if (!isHas) {
        this.$toast("请选择需要删除的商品");
        return;
      }

      // sids:购物袋商品id的集合
      let sids = [];
      this.shopbagData.map((v) => {
        if (v.isChecked) {
          sids.push(v.sid);
        }
      });

      let tokenString = localStorage.getItem("token");

      if (!tokenString) {
        this.$toast("是不是忘记登入啦~");
        return this.$router.push({ name: "Login" });
      }

      // 发起请求
      this.axios({
        method: "POST",
        url: "/deleteShopcart",
        data: {
          appkey: this.appkey,
          tokenString,
          sids: JSON.stringify([sids]),
        },
      })
        .then((result) => {
          this.$toast.clear();
          // console.log(result);
          if (result.data.code == 700) {
            // 此时校验无效，让用户重新登入
            this.$router.push({ name: "Login" });
          } else if (result.data.code == 7000) {
            // 如果删除成功,则移除页面的的商品
            //移除页面数据
            for (let i = 0; i < this.shopbagData.length; i++) {
              if (this.shopbagData[i].isChecked) {
                this.shopbagData.splice(i, 1);
                i--;
              }
            }
          }
          this.$toast(result.data.msg);
        })
        .catch((err) => {
          console.log(err);
          this.$toast.clear();
        });
    },

    // 进步器修改商品数量
    changeCount() {
      let tokenString = localStorage.getItem("token");

      if (!tokenString) {
        this.$toast("是不是忘记登入啦~");
        return this.$router.push({ name: "Login" });
      }

      // 发起请求
      this.axios({
        method: "POST",
        url: "/modifyShopcartCount",
        data: {
          appkey: this.appkey,
          tokenString,
          sid: item.sid,
          count: item.count,
        },
      })
        .then((result) => {
          this.$toast.clear();
          console.log(result);
          if (result.data.code == 700) {
            // 此时校验无效，让用户重新登入
            this.$router.push({ name: "Login" });
          } else if (result.data.code == 6000) {
            // 若选中了,则重新计算修改数量后的总金额
            if (item.isChecked) {
              // 重新计算总金额
              this.sum();
            }
          }
        })
        .catch((err) => {
          console.log(err);
          this.$toast.clear();
        });
    },

    // 计算商品总金额
    sum() {
      this.total = 0;
      this.shopbagData.map((v) => {
        if (v.isChecked) {
          this.total += v.price * v.count;
        }
      });
      this.total *= 100;
    },
    // 提交订单
    onSubmit() {
      let isHas = this.isSelectProduct();
      if (!isHas) {
        this.$toast("请选择商品");
        return;
      }
      // 商品sid集合
      let sids = [];
      this.shopbagData.map((v) => {
        if (v.isChecked) {
          sids.push(v.sid);
        }
      });

      // 跳转到支付页面,并携带sids
      this.$router.push({ name: "Pay", query: { sids: sids.join("-") } });
    },
  },
};
</script>

<style lang="less" scoped>
.van-nav-bar__right div{
  color: #1989fa;
}

.bg {
  margin-top: 47px;
  height: 1.6rem;
  background: url(../assets/images/shopbag_bg.png) no-repeat 50%;
  background-size: cover;
}
.pro-info-box {
  position: relative;
}
.shopbag-product {
  margin-bottom: 50px;
  padding: 10px;
}
.cell-item {
  height: 100px;
  width: 355px;
  background-color: #fff;
  border-radius: 10px;
  margin: 5px 0;
  .van-button {
    height: 100px;
  }
}
.check-box {
  margin-top: 40px;
  margin-left: 10px;
}
.pro-img {
  height: 80px;
  width: 80px;
  margin: 10px;
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
.step-box {
  position: absolute;
  bottom: 15px;
  right: 5px;
}

.van-submit-bar {
  margin-bottom: 50px;
  position: fixed;
}


.delete-all{
  position: absolute;
  left: 16px;
}

</style>
  