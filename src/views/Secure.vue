<template>
  <div class="secure">
    <van-nav-bar
      title="安全中心"
      left-text="返回"
      left-arrow
      fixed
      @click-left="onClickLeft"
    />

   <div class="bg-content">
    <BgBox>
      <div class="cell-box">
        <van-cell
          @click="openPasswordBox"
          title="修改密码"
          is-link
          :center="true"
        />
        <van-cell
          title="注销账号"
          is-link
          :center="true"
          @click="destroyAccount"
        />
      </div>
    </BgBox>
   </div>

    <div class="logout">
      <van-button color="#0c34ba" round block @click="loginOut"
        >退出登入</van-button
      >
    </div>

    <div class="pop-box">
      <van-popup v-model="isOpen" islink position="bottom" round closeable>
        <div class="form-box">
          <div class="form-title">修改密码</div>
          <van-form>
            <van-field
              v-model="password.oldPassword"
              :type="isPassword ? 'password' : 'text'"
              name="旧密码"
              label="旧密码"
              placeholder="请输入旧密码（以字母开头，6-16位)"
              
              autocomplete="off"
              @click-right-icon="toggleType"
            />
            <van-field
              v-model="password.newPassword"
              :type="isPassword ? 'password' : 'text'"
              name="新密码"
              label="新密码"
              placeholder="请输入新密码（以字母开头，6-16位)"
              
              autocomplete="off"
              @click-right-icon="toggleType"
            />

            <div class="btn" >
              <van-button
                round
                block
                color="#0c34ba"
                @click="commit"
              >
                确认修改
              </van-button>
            </div>
          </van-form>
        </div>
      </van-popup>
    </div>
  </div>
</template>
  
  <script>
import BgBox from "../components/BgBox.vue";
import { validForm } from "../assets/js/validForm";

export default {
  name: "Secure",
  data() {
    return {
      isOpen: false,
      isPassword: true,
      password: {
        oldPassword: "",
        newPassword: "",
      },
    };
  },
  components: {
    // 2.注册组件
    BgBox,
  },
  methods: {
    onClickLeft() {
      this.$router.go(-1);
    },

    // 切换密码类型
    toggleType() {
      this.isPassword = !this.isPassword;
    },

    // 弹出层控制
    openPasswordBox() {
      this.isOpen = true;
    },

    // 注销账号
    destroyAccount() {
      this.$dialog
        .confirm({
          title: "注销账号",
          message: "是否确定注销账号，一旦注销无法恢复！",
        })
        .then(() => {
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
            url: "/destroyAccount",
            params: {
              appkey: this.appkey,
              tokenString,
            },
          }).then((result) => {
            // console.log(result);
            this.$toast.clear();
            if (result.data.code == 700) {
              // 此时校验无效，让用户重新登入
              this.$router.push({ name: "Login" });
            } else if (result.data.code == "G001") {           
              setTimeout(() => {
                 // 清除token
               localStorage.removeItem("token");
                this.$router.push({ name: "Login" });
              }, 800);
            }
            this.$toast(result.data.msg);
          });
        })

        .catch((err) => {
          this.$toast.clear();
        });
    },

    // 退出登录
    loginOut() {
      // 清除登陆状态
      this.$dialog
        .confirm({
          title: "退出登录",
          message: "是否确定退出登录？",
        })
        .then(() => {
          this.$toast.loading({
            message: "加载中...",
            forbidClick: true,
            duration: 0,
          });
          setTimeout(() => {
            // 清楚轻提示
            this.$toast.clear();
            localStoragere.removeItem("token");
            this.$router.push({ name: "Login" });
          }, 800);
        })
        .catch((err) => {
          this.$toast.clear();
        });
    },

    // 修改密码
    commit() {
      let o = {
        oldPassword: {
          value: this.password.oldPassword,
          errorMsg: "旧密码支持数字字母下划线组合，且必须以字母开头，6-16位",
          reg: /^[A-Za-z]\w{5,15}$/,
        },
        newPassword: {
          value: this.password.newPassword,
          errorMsg: "新密码支持数字字母下划线组合，且必须以字母开头，6-16位",
          reg: /^[A-Za-z]\w{5,15}$/,
        },
      };

      let isPass = validForm.valid(o);
      if (isPass) {
        if (this.password.oldPassword == this.password.newPassword) {
          this.$toast("旧密码与新密码不能相同！");
        }
      }
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
        url: "/updatePassword",
        data: {
          appkey: this.appkey,
          tokenString,
          oldPassword: this.password.oldPassword,
          password: this.password.newPassword,
        },
      }).then((result) => {
        // console.log(result);
        this.$toast.clear();
        if (result.data.code == 700) {
          // 此时校验无效，让用户重新登入
          this.$router.push({ name: "Login" });
        } else if (result.data.code == E001) {
          this.$toast("修改成功,请重新登录");
          setTimeout(() => {
            this.$toast.clear();
            localStoragere.removeItem("token");
            this.$router.push({ name: "Login" });
          }, 800);
        }
        this.$toast(result.data.msg)
      }).catch((err) => {
          this.$toast.clear();
        });
    },
  },
};
</script>
  
  <style lang="less" scoped>
.form-title{
  font-size: 16px;
  font-weight: bold;
  padding: 20px 0 10px 10px;
  color: #444;
}
.bg-content{
  margin-top: 46px;
}
.btn{
  margin: 10px;
}
.logout{
  margin: 10px;
}

</style>