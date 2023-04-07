<template>
  <div class="order-list">
    
    <div class="pro-box clearfix">
       <div class="info-boxs">
       
        <div class="title">订单信息</div>
        <div class="info-title fl"> {{ infoTitleLeft }} </div>
        <div class="reinfo fr" v-if="isRight">
            <div v-if="!isReceive" @click="confirmReceive">
                确认收货
            </div>
            <div v-else class="clearfix">
                <div class="reinfo fl">已完成</div>
                <div class="delete fl" @click="remove">
                    <van-icon name="delete-o"  size="18" color="#666"/>
                </div>
            </div>
        </div>
       </div>
    </div>
    <div class="cell-list">
        <!-- 商品信息 -->
        <slot></slot>
    </div>
    <div class="bottom-into">
        <div class="circle">
            <div class="circle-box fl circle-left"></div>
            <div class="circle-box fr circle-right"></div>
        </div>
        <div class="date" v-if="date != ''">{{ date }}</div>
        <div class="clearfix bottom">
            <div class="total-num fl">共计{{ count }}件商品</div>
            <div class="total-price fr">订单金额：￥{{ total }}</div>
        </div>
    </div>
  </div>
</template>

<script>

export default {
    name:"OrderList",
    data(){
        return{

        }

    },
    props:{
        // 左侧标题
        infoTitleLeft:{
            type:String,
            default:""

        },
        // 是否显示右侧
        isRight:{
            type:Boolean,
            default:false
        },
        // 时间
        date:{
            typt:String,
            default:""
        },
        // 商品数量
        count:{
            type:Number,
            default:0
        },
        // 订单总金额
        total:{
            type:[Number,String],
            default:0
        },
        // 确认收货
        isReceive:{
            type:Boolean,
            default:false
        }
    },
    methods:{

        // 确认收货
        confirmReceive(){
            this.$emit('confirm-receive');
        },
        // 删除
        remove(){
            this.$emit('remove');
        }

    }
}
</script>

<style lang="less" scoped>

.order-list{
    background-color: #fff;
    padding: 10px;
}

.title{
    font-size: 14px;
    font-weight: bold;
    color: #444;
    padding: 10px 0;
    
}
.info-title{
    font-size: 14px;
    color: #666;
    padding-bottom: 10px;
}
.reinfo{
    font-size: 14px;
    color: #666;
    padding-right: 10px;
    padding-bottom: 10px;
}
.circle{
    border-top: #e8e8e8 1px dashed;
    position: relative;

    .circle-box{
    height: 20px;
    width:20px;
    border-radius: 50%;
    // border: #444 solid 1px;
    background-color: #f7f7f7;
}
}
.circle-left{
    position: absolute;
    top:-10px;
    left: -20px;
}
.circle-right{
    position: absolute;
    top: -10px;
    right: -20px;
}
.date{
    font-size: 14px;
    margin-top: 20px;
    color: #444;
}
.bottom{
    margin-top: 20px;
}
.total-num{
    color: #666;
    margin-bottom: 10px;
    font-size: 14px;
}
.total-price{
    font-size: 14px;
    color: #e4393c;
    font-weight: bold;
    margin-right: 10px;
}

</style>