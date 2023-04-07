<template>
  <div class="account">
    <van-nav-bar
      title="个人中心"
      left-text="返回"
      left-arrow
      fixed
      @click-left="onClickLeft"
    />
  
      <BgBox>
      <van-cell-group inset>
        <van-cell title="头像" :center="true">
          <div>
            <div class="user-img fr">
              <img class="auto_img" :src="accountInfo.userImg" alt="" />
              <van-uploader class="upload-box" :after-read="updateAvatar" />
            </div>
          </div>
        </van-cell>
        <van-cell title="用户ID" :value="accountInfo.userId" :center="true" />
        <van-cell title="手机号" :value="accountInfo.phone" :center="true" />

        <van-cell title="昵称" :center="true">
          <van-field
            v-model="accountInfo.nickName"
            class="field-box"
            maxlength="10"
            placeholder="请输入昵称"
            input-align="right"
            @change="uploadNickName"
          />
        </van-cell>

        <div class="desc-box">
          <div class="desc-content">
            <van-field
              v-model="accountInfo.desc"
              show-word-limit
              autosize
              type="textarea"
              label="简介"
              maxlength="40"
              placeholder="请输入简介"
              label-align="top"
              @change="uploadDesc"
            />
          </div>
        </div>
      </van-cell-group>
    </BgBox>
   
  </div>
</template>
  
  <script>
import BgBox from "../components/BgBox.vue";
import "../assets/less/Account.less";

export default {
  name: "Account",
  components: {
    // 2.注册组件
    BgBox,
  },
  data() {
    return {
      accountInfo: {
        nickName: "",
        phone: "",
        desc: "",
        userId: "",
        userImg: "",
      },
    };
  },
  created() {
    this.getAccountInfo();
  },
  methods: {
    onClickLeft() {
      this.$router.go(-1);
    },
    // 获取用户信息
    getAccountInfo() {
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
        url: "/findAccountInfo",
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
          } else if (result.data.code == "B001") {
            let data = result.data.result[0];
            this.accountInfo = data;
          }
          this.$toast(result.data.msg);
        })
        .catch((err) => {
          console.log(err);
        });
    },

    // 上传用户头像
    updateAvatar(file) {
      let tokenString = localStorage.getItem("token");
      // console.log(tokenString);
      //允许上传的格式
      let type = ["jpg", "png", "gif", "jpeg", "webp"];
      // 允许上传的大小1mb
      let size = 1;

      // 判断文件类型
      // 需要获取到文件的信息，vant提供了一个file参数存储了文件相关信息
      let fileType = file.file.type.split("/")[1];
      // console.log(fileType);
      if (type.indexOf(fileType) === -1) {
        this.$toast(`文件类型仅支持${type.join(",")}`);
        return;
      }

      // 判断文件大小
      let fileSize = file.file.size / 1024 / 1024;
      if (fileSize > size) {
        this.$toast(`文件最大不能超过${size}MB`);
        return;
      }
      // 处理base64标记
      // let base64 = file.content.replace(/^data:img\/[A-Za-z]+;base64,/,'');
      let base64 = file.content.replace(/^data:image\/[A-Za-z]+;base64,/, "");

      // 获取token

      this.$toast.loading({
        message: "等等哦，马上就好啦",
        forbidClick: true,
        duration: 0,
      });
      // 上传背景请求
      this.axios({
        method: "POST",
        url: "/updateAvatar",
        //
        data: {
          appkey: this.appkey,
          tokenString,
          imgType: fileType,
          serverBase64Img: base64,
        },
      })
        .then((result) => {
          this.$toast.clear();
           // console.log(result);
          if (result.data.code == 700) {
            // 此时校验无效，让用户重新登入
            this.$router.push({ name: "Login" });
          }else if (result.data.code == "H001") {
            this.accountInfo.userImg = result.data.userImg;
          }
          this.$toast(result.data.msg);
        })
      
          
        .catch((err) => {
          console.log(err);
        });
    },

    //更新昵称
    uploadNickName() {
      if (!this.accountInfo.nickName) {
        this.$toast("昵称不能为空");
      }

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
        method: "POST",
        url: "/updateNickName",
        data: {
          appkey: this.appkey,
          tokenString,
          nickName: this.accountInfo.nickName,
        },
      })
        .then((result) => {
          // console.log(result);
          this.$toast.clear();
          if (result.data.code == 700) {
            // 此时校验无效，让用户重新登入
            this.$router.push({ name: "Login" });
          } else {
            this.$toast(result.data.msg);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },

    // 更新简介
    uploadDesc() {
      if (!this.accountInfo.desc) {
        this.$toast("昵称不能为空");
      }

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
        method: "POST",
        url: "/updateDesc",
        data: {
          appkey: this.appkey,
          tokenString,
          desc: this.accountInfo.desc,
        },
      })
        .then((result) => {
          // console.log(result);
          this.$toast.clear();
          if (result.data.code == 700) {
            // 此时校验无效，让用户重新登入
            this.$router.push({ name: "Login" });
          } else {
            this.$toast(result.data.msg);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
  },
};
</script>
  
  <style scoped>

  .bg-box{
    margin-top: 47px;
  }
</style>