<template>
  <div class="search">
    <van-nav-bar left-text="返回" left-arrow @click-left="onClickLeft">
        <template #right>
            <div class="search-box">
                <form action="/">
                    <van-search
                      shape="round"
                      show-action
                      placeholder="请输入搜索关键词"
                      @search="search"
                      ref="search"
                      v-model="name"
                    />
                  </form>
                  
            </div>
          </template>
    </van-nav-bar>
    <!-- 使用组件 -->
    <BgBox>
      <div class="box clearfix">
        <div class="fl item" 
        v-for="(item, index) in products" :key="index">
          <ProItem :item="item"></ProItem>
        </div>
      </div>
    </BgBox>
  </div>
</template>

<script>
// 导入组件
import BgBox from '../components/BgBox.vue';
import ProItem from '../components/ProItem.vue';

export default {
  name: "Search",
  data(){
    return{
      // 搜索商品的数据
      products:[],
      // 搜索商品的关键词
      name:"",
    }
  },
  components:{
    // 2.注册组件
    BgBox,
    ProItem
  },
  created(){
    //要在vue中的created操作dom，就一定要使用$nexttick回调 
    this.$nextTick(()=>{
      //获取搜索框
        let searchIpt = this.$refs.search.querySelector('[type="search"]');
        // 获取焦点
        searchIpt.focus(); 
    })
  },
  methods:{
    onClickLeft(){
            this.$router.go(-1);
    },
    search(){
      this.$toast.loading({
        message: "糟糕糟糕，偶买噶，魔法怎么失灵了",
        forbidClick: true,
        duration: 0,
      });
      this.axios({
        method:"GET",
        url:"/search",
        params:{
          appkey:this.appkey,
          name:this.name,

        }
      }).then((result)=>{
        this.$toast.clear();
        if (result.data.code == "Q001") {
          this.products = result.data.result;
          
        }else{
          this.$toast(result.data.msg)
        }

      }).catch((err) => {
          this.$toast.clear();
          
        });
    }
  }
};
</script>

<style lang="less" scoped>

.van-search{
    height: 46px;
}
.box{
  padding: 10px;
}
.item{
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
</style>