<template>
  <div id="food">
    <transition enter-active-class="animated fadeInRight" leave-active-class="animated fadeOutRight">
      <div class="food" v-show="showFlag" ref="food">
        <div class="food-content">
          <div class="image-header">
            <img :src="food.image" alt="">
            <div class="back" @click="hide">
              <i class="icon-arrow_list"><</i>
            </div>
          </div>
          <div class="content">
            <div class="title">{{food.name}}</div>
            <div class="detail">
              <span class="sell-count">月售{{food.sellCount}}份</span><span class="rating">好评率{{food.rating}}%</span>
            </div>
            <div class="price">
              <span class="now">￥{{food.price}}</span><span class="old" v-show="food.oldPrice">￥{{food.oldPrice}}</span>
            </div>
            <div class="cartcontrol-wrapper">
              <cartcontrol :food="food"></cartcontrol>
            </div>
            <transition enter-active-class="animated fadeIn" leave-active-class="animated fadeOut" :duration="1000">
              <div class="buy" v-show="!food.count || food.count===0" @click.stop.prevent="addFirst">加入购物车</div>
            </transition>
          </div>
          <split v-show="food.info"></split>
          <div class="info" v-show="food.info">
            <h1 class="title">商品信息</h1>
            <p class="text">{{food.info}}</p>
          </div>
          <split></split>
          <div class="rating">
            <h1 class="title">商品评价</h1>
            <ratingselect :select-type="selectType" :only-content="onlyContent" :desc="desc" :ratings="food.ratings"></ratingselect>
            <div class="rating-wrapper">
              <ul class="" v-show="food.ratings && food.ratings.length">
                <li v-show="needShow(rating.rateType,rating.text)" v-for="rating in food.ratings" class="rating-item">
                  <div class="user">
                    <span class="name">{{rating.username}}</span>
                    <img :src="rating.avatar" alt="" class="avatar" width="12" height="12">
                  </div>
                  <div class="time">{{rating.rateTime | normalTime}}</div>
                  <p class="text">
                    <span :class="{'icon-thumb_up':rating.rateType===0,'icon-thumb_down':rating.rateType===1}"></span>{{rating.text}}
                  </p>
                </li>
              </ul>
              <div class="no-rating" v-show="!food.ratings || !food.ratings.length">暂无评价</div>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>
<script>
import BScroll from 'better-scroll';
import Vue from 'vue';
import cartcontrol from "../cartcontrol/cartcontrol.vue";
import split from '../split/split.vue';
import ratingselect from '../ratingselect/ratingselect.vue';
const ALL=2;

export default{
  props:{
    food:{
      type:Object
    }
  },
  data() {
    return {
      showFlag: false,
      selectType:ALL,
      onlyContent:true,
      desc:{
        all:"全部",
        positive:"推荐",
        negative:"吐槽"
      }
    }
  },
  watch: {
      'selectType'() {
        this.$nextTick(() => {
          this._initScroll();
        });
      },
      'onlyContent'() {
        this.$nextTick(() => {
          this._initScroll();
        })
      }
  },
  created(){
    this.$root.eventHub.$on('ratingtype.select', (type)=>{
      this.selectType=type;
    });
    this.$root.eventHub.$on('content.toggle', (onlyContent)=>{
      this.onlyContent=onlyContent;
    });
  },
  methods:{
    _initScroll() {
        if (!this.scroll) {
          this.scroll = new BScroll(this.$refs.food, {
            click: true
          });
        } else {
          this.scroll.refresh();
        }
    },
    show() {
      this.showFlag = true;
      this.selectType=ALL;
      this.onlyContent=true;
      this.$nextTick(()=>{
        this._initScroll();
      });
    },
    hide(){
      this.showFlag = false;
    },
    addFirst(){
      this.$root.eventHub.$emit('addcart', event.target);
      Vue.set(this.food, 'count', 1);
    },
    needShow(type,text){
      if (this.onlyContent && !text) {
        return false;
      }
      if (this.selectType === ALL) {
        return true;
      } else {
        return type === this.selectType;
      }
    }
  },
  components:{
    cartcontrol,
    split,
    ratingselect
  }
}
</script>
<style scoped lang="scss">
.food{
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  z-index: 30;
  bottom: 48px;
  background: #fff;
  .image-header{
    position: relative;
    width: 100%;
    height: 0;
    padding-top: 100%;
    img{
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
    }
    .back{
      position: absolute;
      top: 10px;
      left: 0;
      .icon-arrow_list{
        display: block;
        padding: 10px;
        font-size: 20px;
        color: #fff;
        font-family: "宋体";
        font-style: normal;
      }
    }
  }
  .content{
    position: relative;
    padding: 18px;
    .title{
      line-height: 14px;
      margin-bottom: 8px;
      font-size: 14px;
      font-weight: 700;
      color: rgb(7, 17, 27);
    }
    .detail{
      margin-bottom: 18px;
      line-height: 10px;
      height: 10px;
      font-size: 0;
      .sell-count, .rating{
        font-size: 10px;
        color: rgb(147, 153, 159);
      }
      .sell-count{
        margin-right: 12px;
      }
    }
    .price{
      font-weight: 700;
      line-height: 24px;
      .now{
        margin-right: 8px;
        font-size: 14px;
        color: rgb(240, 20, 20);
      }
      .old{
        text-decoration: line-through;
        font-size: 10px;
        color: rgb(147, 153, 159);
      }
    }
    .cartcontrol-wrapper{
      position: absolute;
      right: 12px;
      bottom: 12px;
    }
    .buy{
      position: absolute;
      right: 18px;
      bottom: 18px;
      z-index: 10;
      height: 24px;
      line-height: 24px;
      padding: 0 12px;
      box-sizing: border-box;
      border-radius: 12px;
      font-size: 10px;
      color: #fff;
      background: rgb(0, 160, 220);
    }
  }
  .info{
    padding: 18px;
    .title{
      line-height: 14px;
      margin-bottom: 6px;
      font-size: 14px;
      color: rgb(7, 17, 27);
    }
    .text{
      line-height: 24px;
      padding: 0 8px;
      font-size: 12px;
      color: rgb(77, 85, 93);
    }
  }
  .rating{
    padding-top: 18px;
    .title{
      line-height: 14px;
      margin-left: 18px;
      font-size: 14px;
      color: rgb(7, 17, 27);
    }
    .rating-wrapper{
      padding: 0 18px;
      .rating-item{
        position: relative;
        padding: 16px 0;
        @include border-1px(rgba(7, 17, 27, 0.1));
        .user{
          position: absolute;
          right: 0;
          top: 16px;
          line-height: 12px;
          font-size: 0;
          .name{
            display: inline-block;
            margin-right: 6px;
            vertical-align: top;
            font-size: 10px;
            color: rgb(147, 153, 159);
          }
          .avatar{
            border-radius: 50%;
          }
        }
        .time{
          margin-bottom: 6px;;
          line-height: 12px;
          font-size: 10px;
          color: rgb(147, 153, 159);
        }
        .text{
          line-height: 16px;
          font-size: 12px;
          color: rgb(7, 17, 27);
          .icon-thumb_up, .icon-thumb_down{
            margin-right: 4px;
            width: 16px;
            height: 16px;
            display: inline-block;
            vertical-align: middle;
            background-size: 16px!important;
          }
          .icon-thumb_up{
            background: url('img/up.png') no-repeat;
          }
          .icon-thumb_down{
            background: url('img/down.png') no-repeat;
          }
        }
      }
      .no-rating{
        padding: 16px 0;
        font-size: 12px;
        color: rgb(147, 153, 159);
      }
    }
  }
}
</style>
