<template>
  <div class="newAddress">
    <van-nav-bar
      :title="aid ? '编辑地址' : '新增地址'"
      left-text="返回"
      left-arrow
      fixed
      @click-left="onClickLeft"
    />
    <div>
      <van-address-edit
        :area-list="areaList"
        show-postal
        :show-delete="!!aid"
        show-set-default
        :address-info="addressInfo"
        :area-columns-placeholder="['选择省', '选择市', '选择区']"
        @save="save"
        @delete="removeAddress"
      />
    </div>
  </div>
</template>

<script>
import areaList from "../assets/js/area";

export default {
  name: "NewAddress",
  data() {
    return {
      // 地址列表
      areaList,
      // 默认地址值
      addressInfo: {},

      aid: "",
    };
  },
  created() {
    //截取aid
    this.aid = this.$route.query.aid;
    // 根据aid查询地址数据
    if (this.aid) {
      this.getAddressDataByAid();
    }
  },
  methods: {
    onClickLeft() {
      this.$router.go(-1);
    },

    //根据aid查询地址
    getAddressDataByAid() {
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
        url: "/findAddressByAid",
        params: {
          appkey: this.appkey,
          tokenString,
          aid: this.aid,
        },
      })
        .then((result) => {
          this.$toast.clear();
            // console.log(result);
          if (result.data.code == 700) {
            // 此时校验无效，让用户重新登入
            this.$router.push({ name: "Login" });
          } else if (result.data.code == 40000) {
            let data = result.data.result[0];
            data.isDefault = Boolean(data.isDefault);
            this.addressInfo = data;
            // console.log(this.addressInfo);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },

    // 保存地址
    save(content) {
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

      //   复制地址content,浅拷贝,拷贝过后的数据叫content
      let addressInfo = Object.assign({}, content);

      // 处理数组，删除不需要的，增加需要的
      delete addressInfo.country;
      addressInfo.tokenString = tokenString;
      addressInfo.appkey = this.appkey;
      //   转成数字
      addressInfo.isDefault = Number(addressInfo.isDefault);

      // console.log(addressInfo);
      // 请求数据----若有aid则为编辑地址，否则为新增低地址
      // 处理url
      if (!this.aid) {
        // 新增地址
        this.address(addressInfo, "/addAddress");
      } else {
        // 修改地址
        // 验证用户是否修改过原地址
        let isModify = false;
        for (let key in this.addressInfo) {
          if (content[key] != this.addressInfo[key]) {
            isModify = true;
          }
        }
        if (isModify) {
          // 发起请求，编辑地址
          this.address(addressInfo, "/editAddress");
        } else {
          return this.$toast("请修改地址信息");
        }
      }
    },

    // 发起新增地址或修改地址的请求
    address(addressInfo, url) {
      this.axios({
        method: "POST",
        url,
        data: addressInfo,
      })
        .then((result) => {
          this.$toast.clear();
          // console.log(result);
          if (result.data.code == 700) {
            // 此时校验无效，让用户重新登入
            this.$router.push({ name: "Login" });
          } else if (result.data.code == 30000 || result.data.code == 9000) {
            setTimeout(() => {
              this.$router.push({ name: "Address" });
            }, 500);
          }
          this.$toast(result.data.msg);
        })
        .catch((err) => {
          console.log(err);
        });
    },

    removeAddress() {
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
        method: "POST",
        url: "/deleteAddress",
        data: {
          appkey: this.appkey,
          tokenString,
          aid: this.aid,
        },
      })
        .then((result) => {
          this.$toast.clear();
          // console.log(result);
          if (result.data.code == 700) {
            // 此时校验无效，让用户重新登入
            this.$router.push({ name: "Login" });
          } else if (result.data.code == 10000) {
            setTimeout(() => {
              this.$router.push({ name: "Address" });
            }, 500);
          }
          this.$toast(result.data.msg);
        })
        .catch((err) => {
          console.log(err);
        });
    },
  },
};
</script>

<style>
.van-address-edit {
  margin-top: 50px;
}
.van-button--danger {
  background-color: #0c34ba;
  border: #0c34ba 1px solid;
}

</style>