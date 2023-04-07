<template>
  <div class="login">
    <van-nav-bar right-text="首页" @click-right="goHome('Home')">
      <template #left>
        <div class="nav-left">
          <div class="logo">
            <img
              src="../assets/images/home_active.png"
              alt=""
              class="auto_img fl"
            />
            <div class="logo-text fl">Luckin Coffee</div>
          </div>
        </div>
      </template>
    </van-nav-bar>

    <div class="login-box">
      <div class="welcome">欢迎回来！</div>
      <div class="welcome-en">Please login to your accounts !</div>
    </div>

    <div class="login-form">
      <van-form>
        <van-field
          name="手机号"
          label="手机号"
          placeholder="手机号"
          autocomplete="off"
          v-model="userInfo.phone"
        />
        <van-field
          name="密码"
          label="密码"
          placeholder="密码(6-16位)"
          autocomplete="off"
          v-model="userInfo.password"
          :type="isRegisterPassword ? 'password' : 'text'"
          
          @click-right-icon="toggleRegisterPasswordType"
        />
        <div class="forgot fr">
          <span @click="goState('Forgot')">忘记密码？</span>
        </div>
        <div class="l-btn" style="margin-top: 70px">
          <van-button
            round
            block
            autocomplete="off"
            type="primary"
            color="#0c34ba"
            native-type="submit"
            @click="login"
          >
            登入
          </van-button>
          <van-button
            round
            block
            autocomplete="off"
            style="margin-top: 50px"
            native-type="submit"
            @click="toggleRegisterBox"
          >
            注册
          </van-button>
        </div>
      </van-form>

      <!-- 注册表单(弹出层) -->
      <van-popup
        class="register-box"
        position="bottom"
        closeable
        v-model="isShow"
      >
        <div class="register-title">注册</div>
        <van-form>
          <van-field
            name="手机号"
            label="手机号"
            placeholder="手机号"
            autocomplete="off"
            v-model="userRegisterInfo.phone"
          />
          <van-field
            :type="isRegisterPassword ? 'password' : 'text'"
            name="密码"
            label="密码"
            placeholder="密码(6-16位)"
            autocomplete="off"
            v-model="userRegisterInfo.password"
          
            @click-right-icon="toggleRegisterPasswordType"
          />
          <van-field
            name="昵称"
            label="昵称"
            placeholder="昵称(1-10位)"
            autocomplete="off"
            v-model="userRegisterInfo.nickName"
          />
          <div class="l-btn" style="margin-top: 30px; margin-bottom: 10px">
            <van-button
              round
              block
              type="info"
              color="#0c34ba"
              style="margin-top: 50px"
              native-type="submit"
              @click="register"
            >
              注册
            </van-button>
          </div>
        </van-form>
      </van-popup>
    </div>
  </div>
</template>

<script>
import "../assets/less/Login.less";
// 导入表单验证模块
import {validForm} from "../assets/js/validForm";

export default {
  name: "Login",
  data() {
    return {
      // 用户信息
      userInfo: {
        phone: "",
        password: "",
      },
      // 用户注册信息
      userRegisterInfo: {
        phone: "",
        password: "",
        nickName: "",
      },
      //是否显示注册信息
      isShow: false,
      // 是否展示密码（小眼睛）
      isRegisterPassword: true,
    };
  },
  methods: {
    // 回到首页
    goHome(name) {
      this.$router.push({ name });
    },
    // 忘记密码
    goState(name) {
      this.$router.push({ name });
    },
    // 切换密码框类型
    toggleRegisterPasswordType() {
      this.isRegisterPassword = !this.isRegisterPassword;
    },
    //
    toggleRegisterBox() {
      this.isShow = !this.isShow;
    },

    // 注册方法
    register() {
      let o = {
        phone: {
          value: this.userRegisterInfo.phone,
          errorMsg: "手机号格式不正确",
          reg: /^1[3-9]\d{9}$/,
        },
        password: {
          value: this.userRegisterInfo.password,
          errorMsg: "密码支持数字字母下划线组合，且必须以字母开头，6-16位",
          reg: /^[A-Za-z]\w{5,15}$/,
        },
        nickName: {
          value: this.userRegisterInfo.nickName,
          errorMsg: "昵称由字母、数字、下划线、汉字组成（1-10个字符）",
          reg: /^[\w\u4e00-\u9fa5]{1,10}$/,
        },
      };
      let isPass = validForm.valid(o);

      if (isPass) {
        // 通过则复制用户的注册信息，并保存
        // 发送到接口进行注册
        let userInfo = Object.assign({}, this.userRegisterInfo);

        userInfo.appkey = this.appkey;

        this.$toast.loading({
          message: "等等哦~马上好啦~",
          forbidClick: true,
          duration: 0,
        });
        this.axios({
          method: "POST",
          url: "/register",
          data: userInfo,
        })
          .then((result) => {
            // console.log(result);
            this.$toast.clear();
            if (result.data.code == 100) {
              // 注册成功
              this.isShow = false;
            } else {
              //注册过了，弹窗注册失败信息
              this.$toast(result.data.msg);
            }
          })
          .catch((err) => {
            this.$toast.clear();
          });
      }
    },
    // 登入
    login() {
      let o = {
        phone: {
          value: this.userInfo.phone,
          errorMsg: "手机号格式不正确",
          reg: /^1[3-9]\d{9}$/,
        },
        password: {
          value: this.userInfo.password,
          errorMsg: "密码支持数字字母下划线组合，且必须以字母开头，6-16位",
          reg: /^[A-Za-z]\w{5,15}$/,
        },
      };
      let isPass = validForm.valid(o);
      if(isPass){
        // 发送登入请求，拷贝用户登入信息
        let userInfo = Object.assign({}, this.userInfo);

        userInfo.appkey = this.appkey;
                                                                                                                                                                                                                                                                                                                         
        this.$toast.loading({
          message: "正在登入喔~~",
          forbidClick: true,
          duration: 0,
        });
        // 发起请求
        this.axios({
            method:"POST",
            url:"/login",
            data:userInfo
        })
        .then((result) => {
            // console.log(result);
            this.$toast.clear();
            
            if (result.data.code == 200) {
            // 登录成功
            // 保存token在localstorage中
              localStorage.setItem('token',result.data.token);
              this.$router.push({name:"Home"});
            } else {
              //注册过了，弹窗注册失败信息
              this.$toast(result.data.msg);
            }
          })
          .catch((err) => {
            this.$toast.clear();
          });
      }
    },
  },
};
</script>

<style>
</style>