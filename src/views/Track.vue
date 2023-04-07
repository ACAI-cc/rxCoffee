<template>
  <div class="track">
    <van-nav-bar
      title="足迹"
      left-text="返回"
      :right-text="!isEdit? '编辑':'完成'"
      left-arrow
      @click-left="onClickLeft"
      @click-right="onClickRight"
    />
    <BgBox>
      <div class="sortingTitle">
        <div class="title">
        <div class="trackAll">足迹</div>
        <div class="delAll" v-if="isEdit" @click="allSelect">清空</div>
      </div>
      </div>
      <van-empty v-if="trackCount.length==0" description="没有足迹" />
      <div v-if="trackCount.length>0" class="menu-product">
      <div>
        <div class="clearfix m-pro-item" v-for="(item, index) in trackCount" :key="index">
          <van-swipe-cell>
            <!--  -->
            <div @click="goDetail(item.pid)">
              <div class="fl pro-img">
                <img class="auto-img img-box" :src="item.smallImg" alt />
              </div>
              <div class="fl text">
                <div class="pro-text">
                  <div class="pro-time">{{item.time}}</div>
                  <div class="pro-name">{{item.name}}</div>
                  <div class="pro-enname">{{item.enname}}</div>
                </div>
              </div>
              <div class="fl price">￥{{item.price}}</div>
            </div>
            <template #right>
              <van-button square type="danger" @click="removeOne(index)" text="删除" />
            </template>
          </van-swipe-cell>
        </div>
      </div>
    </div>
    </BgBox>
    
  </div>
</template>

<script>
import BgBox from "../components/BgBox.vue";
export default {
  name:"Track",
  data() {
    return {
      track: [],

      isEdit: false,

      isAllChecked: false
    };
  },

  computed: {
    trackCount() {
      return this.$store.state.footprintData;
    }
  },
  methods: {
    //全删除
    allSelect() {

      if(this.trackCount.length==0){
         this.isEdit = !this.isEdit;
        this.$toast('没有足迹了');
        return
      }


      this.$dialog.confirm({
        title: "清空足迹",
        message: "清空后无法恢复",

      }).then(() => {

      this.$store.commit("delAllTrack");
      this.isEdit = !this.isEdit;

      }).catch(err => {
        
      })

    },

    //单个删除
    removeOne(index) {
      this.$store.commit("removeOne", index);
    },

    // 编辑
    onClickRight() {
      this.isEdit = !this.isEdit;
    },

    //返回
    onClickLeft() {
      this.$router.go(-1);
    },

    goDetail(pid) {
      this.$router.push({ name: "Detail", params: { pid } });
    }
  },
  components: {
    BgBox
  }
};
</script>

<style lang="less" scoped>
.sortingTitle {
  width: 100%;
  height: 50px;
  .title{
    height: 20px;
  position: relative;
  font-size: 0.37333rem;
  line-height: 0.53333rem;
  cursor: pointer;
  }

  .trackAll {
    position: absolute;
    width: 30px;
    margin: 10px 15px;
    border-bottom: 2px solid blue;
    text-align: center;
    color: rgb(12, 52, 186);
    padding-bottom: 5px;
  }

  .delAll {
    position: absolute;
    top: 10px;
    
    right: 15px;
    margin-right: 10px;
    color:#0c34ba;
  }
}

.menu-product {
  margin-top: 100px;
  padding: 10px;
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 450px;
  overflow-y: scroll;
}

.menu-product::-webkit-scrollbar {
  display: none;
}

.m-pro-item {
  padding: 10px;
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;
  background-color: #fff;
  margin-bottom: 10px;
  &:last-child {
    margin-bottom: 0;
  }
}

.pro-img {
  width: 70px;
  height: 70px;
  background-color: #ddd;
  .img-box{
    width:70px;
    height: 70px;

  }
}

.text {
  // width: calc(~"100% - 150px");
  padding-left: 10px;
}

.price {
  width: 50px;
  line-height: 70px;
  color: #0c34ba;
  font-weight: bold;
  font-size: 14px;
  text-align: right;
  margin-left: 20px;
}

.pro-time {
  margin-bottom: 5px;
  margin-top: 5px;
}

.pro-name {
  font-size: 14px;
}

.pro-enname {
  font-size: 12px;
  margin-top: 5px;
}

/deep/ .van-button {
  height: 100%;
}

/deep/ .van-swipe-cell__right {
  height: 70px;
}

.menu-nav {
  position: sticky;
  top: 0;
}

/deep/ .van-submit-bar {
}

/deep/ .van-submit-bar__price {
  color: #0c34ba;
}

/deep/ .van-checkbox__icon--checked .van-icon {
  background-color: #0c34ba;
  border-color: #0c34ba;
}

.van-submit-bar__bar {
  .van-button {
    margin-left: auto;
  }
}
</style>