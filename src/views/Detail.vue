<template>
  <div class="detail">
    <van-nav-bar
      title="商品详情"
      left-text="返回"
      left-arrow
      fixed
      @click-left="onClickLeft"
    />

    <!-- 根标签 -->
    <div>
      <!-- 图片容器 -->
      <div>
        <img :src="productDetail.large_img" alt="" class="auto_img" />
      </div>
      <!-- 商品详细信息容器 -->
      <div class="pro-info-box">
        <!-- 商品信息 -->
        <div class="pro-info">
          <!-- 商品名字与价格 -->
          <div class="clearfix pro-box">
            <div class="fl">
              <div class="pro-name one_text">{{ productDetail.name }}</div>
              <div class="pro-enname one_texxt">{{ productDetail.enname }}</div>
            </div>
            <div class="pro-price fr">￥{{ productDetail.price }}</div>
          </div>
        </div>
        <!-- 商品规格 -->
        <div class="rule-box">
          <div
            class="rule-items clearfix"
            v-for="(item, index) in productDetail.rules"
            :key="index"
          >
            <div class="rule-title fl">{{ item.title }}</div>
            <div class="fl">
              <div
                class="r-item fl"
                :class="{
                  active: item.ruleIndex == i,
                  'large-text': v.title.length >= 4,
                }"
                v-for="(v, i) in item.rule"
                :key="i"
                @click="toRule(item, i)"
              >
                {{ v.title }}
              </div>
            </div>
          </div>
        </div>
        <!-- 修改商品数量 -->
        <div class="count-box">
          <div class="select-text fl">选择数量</div>
          <div class="select-count fr">
            <van-stepper
              v-model="product.count"
              theme="round"
              button-size="22"
              disable-input
            />
          </div>
        </div>
        <!-- 商品描述 -->
        <div class="detail-desc">
          <div class="detail-desc-title">商品描述</div>
          <div
            class="detail-desc-content"
            v-for="(item, index) in productDetail.desc"
            :key="index"
          >
            <div class="desc-item">{{ index + 1 }}.{{ item }}</div>
          </div>
        </div>
      </div>
      <!-- 底部购物车等 -->
      <van-goods-action>
        <van-goods-action-icon :badge="bagCount" icon="bag" text="购物车" @click="goShopbag"/>
        <van-goods-action-icon
          :icon="isLike ? 'like' : 'like-o'"
          :text="isLike ? '已收藏' : '收藏'"
          :color="isLike ? '#ED1C24' : '#595C5A'"
          @click="toggeleLike"
        />
        <van-goods-action-button
          color="#dc696b"
          type="danger"
          text="加入购物袋"
          @click="addShopcart()"
        />
        <van-goods-action-button
          color="#3762F0"
          type="danger"
          text="立即购买"
          @click="buy(true)"
        />
      </van-goods-action>
    </div>
  </div>
</template>

<script>
import "../assets/less/Detail.less";
import ShopbagVue from './Shopbag.vue';

export default {
  name: "Detail",
  data() {
    return {
      // 商品id
      pid: "",
      // 商品数量信息存储
      product: {
        count: 1,
      },
      // 购物袋的数量
      bagCount: 0,
      // 商品详情的数据
      productDetail: {},
      // 是否收藏
      isLike: false,
    };
  },
  created() {
    // 截取pid
    this.pid = this.$route.params.pid;
    // console.log(this.pid);
    // 获取商品详细信息
    this.getProductDetail();
    // console.log(this.productDetail);
    //获取用户收藏商品状态
    this.findLike();

    // 获取购物车商品总数
    this.getshopcartCount();
  },
  methods: {
    // 收藏点击事件
    toRule(item, i) {
      if (item.ruleIndex == i) {
        return;
      }
      item.ruleIndex = i;
    },

    // 获取商品详情
    getProductDetail() {
      this.$toast.loading({
        message: "糟糕糟糕，偶买噶，魔法怎么失灵了",
        forbidClick: true,
        duration: 0,
      });
      // 发起请求
      this.axios({
        method: "GET",
        url: "/productDetail",
        params: {
          appkey: this.appkey,
          pid: this.pid,
        },
      })
        .then((result) => {
          //   console.log(result);
          this.$toast.clear();

          if (result.data.code == 600) {
            // 传回的是数组的数组，定义一个data作为商品数据的储存
            let data = result.data.result[0];
            // console.log(data)
            // 获取商品描述，将商品描述分割成为能用的数组
            data.desc = data.desc.split(/\n/);
            // console.log(data.desc)

            // 定义新数组，接受商品信息
            let rules = [];
            let rulesData = ["tem", "sugar", "milk", "cream"];

            rulesData.map((v) => {
              let r = {};
              r.title = data[v + "_desc"];

              // 下标
              r.ruleIndex = 0;
              r.rule = [];

              // 获取规格的字符串
              let ruleString = data[v].split("/");

              ruleString.map((value) => {
                if (value != "") {
                  r.rule.push({ title: value });
                }
              });
              if (r.rule.length > 0) {
                rules.push(r);
              }
            });

            data.rules = rules;
            this.productDetail = data;
            // console.log(this.productDetail.desc);
          }
        })
        .catch((err) => {
          this.$toast.clear();
        });
    },

    // 返回上一页
    onClickLeft() {
      this.$router.go(-1);
    },
    // 跳转到购物车
    goShopbag(){
      this.$router.push({name:'Shopbag'})
    },

    //获取用户收藏商品状态
    findLike() {
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
        url: "/findlike",
        params: {
          appkey: this.appkey,
          pid: this.pid,
          tokenString,
        },
      })
        .then((result) => {
          // console.log(result);
          this.$toast.clear();
          if (result.data.code == 1000) {
            // 获取到的结果中，数组长度大于0则商品已收藏；否则未收藏
            if (result.data.result.length > 0) {
              this.isLike = true;
            }
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },

    // 查询用户是否收藏该商品
    toggeleLike() {
      // 获取token
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

      let url = this.isLike ? "/notlike" : "/like";

      // 发送请求
      this.axios({
        method: "POST",
        // 动态处理url为一个变量
        url,
        data: {
          appkey: this.appkey,
          pid: this.pid,
          tokenString,
        },
      })
        .then((result) => {
          // console.log(result);
          this.$toast.clear();
          // 根据code，改变isLike的布尔值
          if (result.data.code == 700) {
            // 此时校验无效，让用户重新登入
            this.$router.push({ name: "Login" });
          } else if (result.data.code == 800) {
            this.isLike = true;
          } else if (result.data.code == 900) {
            this.isLike = false;
          }
          this.$toast(result.data.msg);
        })
        .catch((err) => {
          console.log(err);
        });
    },

    // 查询用户购物车中商品总数
    getshopcartCount() {
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
        url: "/shopcartCount",
        params: {
          appkey: this.appkey,
          tokenString,
        },
      })
        .then((result) => {
          this.$toast.clear();
          // console.log(result);
          if (result.data.code == 4000) {
            this.bagCount = result.data.result;
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },

    // 加入购物车
    addShopcart(isBuy) {
      let tokenString = localStorage.getItem("token");

      if (!tokenString) {
        this.$toast("是不是忘记登入啦~");
        return this.$router.push({ name: "Login" });
      }

      // 请求参数对象
      let data = {
        pid: this.pid,
        count: this.product.count,
        appkey: this.appkey,
        tokenString,
      };
      // 商品规格数组
      let rs = [];
      this.productDetail.rules.map((v) => {
        rs.push(v.rule[v.ruleIndex].title);
      });

      data.rule = rs.join("/");

      this.$toast.loading({
        message: "加载中..",
        forbidClick: true,
        duration: 0,
      });

      this.axios({
        method: "POST",
        url: "/addShopcart",
        data,
      })
        .then((result) => {
          this.$toast.clear();
          // console.log(result);
          if (result.data.code == 700) {
            // 此时校验无效，让用户重新登入
            this.$router.push({ name: "Login" });
          } else if (result.data.code == 3000) {
            // 加入成功---进行徽标的修改，并提示加入购物车成功
           if(!isBuy){
            // isBuy用户的定义是否加入购物车
            if(result.data.status == 1){
              this.bagCount++;
              this.$toast(result.data.msg);
            }
           }else{
            // 如果是立即购买，跳转页面
            this.$router.push({name:'Pay',query:{sids:result.data.sid}});
           }
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
    // 立即购买 
    buy(isBuy){
      this.addShopcart(isBuy);
      // 跳转到支付页面,并携带sids
    }
  },
};
</script>

<style lang="less" scoped>
.detail{
    // background-color: #fff;
    padding-top: 40px;
    .pro-info-box{
        position: relative;
        top: -40px;
        background-color: #fff;
        padding: 10px;
        margin: 0 10px;  
        border-top-left-radius: 10px;
        border-top-right-radius: 10px;
        .pro-info{
            // margin-top: 5px;
            margin-bottom: 10px;
            margin-left: 10px;
        }
    }
}

.pro-price {
  padding: 10px;
  font-size: 20px;
  color: #e4393c;
  font-weight: 700;
  margin-right: auto;
}
.pro-name {
  font-size: 14px;
  color: #444;
  margin: 0px;
}
.van-goods-action-button--danger {
  background: #0c34ba;
  border: #0c34ba 1px solid;
}
</style>