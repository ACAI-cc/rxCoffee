<template>
  <div class="user">
    <div class="my-img" :style="{backgroundImage:`url('${userInfo.userBg}')`}">
      <van-uploader class="upload-box" :after-read="uploadBg" />

    </div>
    <div class="my-box">
      <div class="my-info clearfix">
        <div class="clearfix">
          <img class="my-img fl" :src="userInfo.userImg" alt="" />
        </div>
        <div class="user-info fl">
          <div class="user-name one-text">{{ userInfo.nickName }}</div>
          <div class="desc one-text">
            {{ userInfo.desc == "" ? "这家伙很懒，什么也没有留下" : userInfo.desc }}
          </div>
        </div>
      </div>
      <div class="cell-list">
        <van-cell
          v-for="(item, index) in listData"
          :key="index"
          :title="item.title"
          is-link
          @click="toPage(item.name)"
        />
      </div>
    </div>
  </div>
</template>
  <script>
import "../assets/less/User.less";

// 默认导出组件
export default {
  // 组件名称
  name: "User",
  data() {
    return {
      // 用户信息数据
      userInfo: {},

      listData: [
        {
          title: "个人资料",
          name: "Account",
        },
        {
          title: "我的订单",
          name: "Order",
        },
        {
          title: "我的收藏",
          name: "Like",
        },
        {
          title: "地址管理",
          name: "Address",
        },
        {
          title: "浏览足迹",
          name: "Track",
        },
        {
          title: "安全中心",
          name: "Secure",
        },
      ],
    };
  },
  created() {
    this.getUserInfo();
  },
  methods: {
    // 获取用户信息
    getUserInfo() {
      let tokenString = localStorage.getItem("token");
      // console.log(tokenString);

      // 判断token是否存在，若存在则进入页面，否则返回登入页
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
        url: "/findMy",
        params: {
          appkey: this.appkey,
          tokenString,
        },
      })
        .then((result) => {
          this.$toast.clear();
          if (result.data.code == 700) {
            // 此时校验无效，让用户重新登入
            this.$router.push({ name: "Login" });
          } else if (result.data.code == "A001") {
            this.userInfo = result.data.result[0];
            // console.log(this.userInfo);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
    // 页面跳转
    toPage(name) {
      this.$router.push({ name });
    },
    // 上传背景
    uploadBg(file){
      let tokenString = localStorage.getItem("token");
      // console.log(tokenString);
      //允许上传的格式
      let type = ['jpg','png','gif','jpeg','webp'];
      // 允许上传的大小1mb
      let size = 1;

      // 判断文件类型
      // 需要获取到文件的信息，vant提供了一个file参数存储了文件相关信息
      let fileType = file.file.type.split('/')[1];
      // console.log(fileType);
      if(type.indexOf(fileType) === -1){
        this.$toast(`文件类型仅支持${type.join(',')}`);
        return;
      }

      // 判断文件大小
      let fileSize = file.file.size/1024/1024;
      if(fileSize>size){
        this.$toast(`文件最大不能超过${size}MB`);
        return;
      }
      // 处理base64标记
      // let base64 = file.content.replace(/^data:img\/[A-Za-z]+;base64,/,'');
      let base64 = file.content.replace(/^data:image\/[A-Za-z]+;base64,/,'');

      // 获取token
      
      this.$toast.loading({
        message: "等等哦，马上就好啦",
        forbidClick: true,
        duration: 0,
      });
      // 上传背景请求
      this.axios({
        method:'POST',
        url:'/updateUserBg',
        // 
        data:{
          appkey:this.appkey,
          tokenString,
          imgType:fileType,
          serverBase64Img:base64
        }
      }).then(result=>{
        this.$toast.clear();
        // console.log(result);
        if (result.data.code == 'I001') {
          this.userInfo.userBg = result.data.userBg;
        }
        this.$toast(result.data.msg)

        
      }).catch((err) => {
          console.log(err);
        });
    }
  },
};
</script>
  <style lang="less" scoped>
</style>
  