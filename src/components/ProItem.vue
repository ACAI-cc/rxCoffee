<template>
  <div class="pro-item"   @click="getDetail(item.pid,item)">
    <div>
      <div>
        <img :src="item.smallImg" alt="" class="auto_img" />
      </div>
      <!-- 热卖标签 -->
      <div class="hot" :style="`display:${item.isHot == 1 ? 'block' : 'none'}`">
        热卖
      </div>
      <div class="pro-name one_text">{{ item.name }}</div>
      <div class="pro-enname one_text">{{ item.enname }}</div>
      <div class="clearfix">
        <div class="fl pro-price">￥{{ item.price }}</div>
        <!-- <div class="fr delete">
                <van-icon name="cross"></van-icon>
            </div> -->
            <slot></slot>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "ProItem",
  // 组件传值
  props: {
    // 商品信息对象
    item: {
      type: Object,
      default() {
        return {};
      },
    },
  },
  methods:{
    getDetail(pid,item){
      // 传值 传入pid
      // 使用push加入元素
      this.$router.push({name:'Detail',params:{pid}});
      item.time = (new Date()).toLocaleDateString() + " " + (new Date()).toLocaleTimeString()
      this.$store.commit('addTrackCount',item)
    },
  }
};
</script>

<style  lang="less" scoped>
.pro-item {
  &:nth-child(2n) {
    margin-right: 0;
  }
  .pro-name {
    font-size: 14px;
    margin-top: 10px;
  }
  .pro-enname {
    margin-top: 5px;
    margin-bottom: 10px;
    font-size: 12px;
    color: #999;
  }
  .pro-price {
    font-size: 14px;
    color: #e7393c;
    font-weight: bold;
  }
  .delete {
    width: 16px;
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
  
}
</style>