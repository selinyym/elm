<template>
  <div id="shopcart">
    <div class="shopcart">
      <div class="content" @click="toggleList">
        <div class="content-left">
          <div class="logo-wrapper">
            <div class="logo" :class="{'highlight':totalCount>0}">
              <i class="icon-shopping_cart"></i>
            </div>
            <div class="num" v-show="totalCount>0">{{totalCount}}</div>
          </div>
          <div class="price" :class="{'highlight':totalPrice>0}">￥{{totalPrice}}</div>
          <div class="desc">另需配送费￥{{deliveryPrice}}元</div>
        </div>
        <div class="content-right" @click.stop.prevent="pay">
          <div class="pay" :class="payClass">
            {{payDesc}}
          </div>
        </div>
      </div>
      <div class="ball-container" v-for="ball in balls">
        <transition
          v-on:before-enter="beforeEnter"
          v-on:enter="enter"
          v-on:after-enter="afterEnter"
          name="drop">
          <div class="ball" v-show="ball.show">
            <div class="inner inner-hook"></div>
          </div>
        </transition>
      </div>
      <transition name="fold">
        <div class="shopcart-list" v-show="listShow">
          <div class="list-header">
            <h1 class="title">购物车</h1>
            <span class="empty" @click="empty">清空</span>
          </div>
          <div class="list-content" ref="listContent">
            <ul>
              <li class="food" v-for="food in selectFoods">
                <span class="name">{{food.name}}</span>
                <div class="price">
                  <span>￥{{food.price*food.count}}</span>
                </div>
                <div class="cartcontrol-wrapper">
                  <cartcontrol :food="food"></cartcontrol>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </transition>
    </div>
    <transition name="fade">
      <div class="list-mask" @click="hideList" v-show="listShow"></div>
    </transition>
  </div>
</template>
<script>
  import BScroll from 'better-scroll';
  import cartcontrol from "../cartcontrol/cartcontrol.vue";

  export default{
    data(){
      return{
        //怕客户连续点击，球出现得没那快，所以多设置了几个球，只要里面还有show是false的球，客户再点击的时候，就可以把show变成true的动画球
        balls:[
          {
            show:false
          },
          {
            show:false
          },
          {
            show:false
          },
          {
            show:false
          },
          {
            show:false
          }
        ],
        dropBalls:[],
        fold:true
      }
    },
    props:{
      selectFoods:{
        type:Array,
        default(){
          return [];
        }
      },
      deliveryPrice:{
        type:Number,
        default:0
      },
      minPrice:{
        type:Number,
        default:0
      }
    },
    computed:{
      totalPrice(){
        let total=0;
        this.selectFoods.forEach((food)=>{
          total+=food.price*food.count;
        });
        return total;
      },
      totalCount(){
        let count=0;
        this.selectFoods.forEach((food)=>{
          count+=food.count;
        });
        return count;
      },
      payDesc(){
        if(this.totalPrice===0){
          return `￥${this.minPrice}元起送`;
        }else if(this.totalPrice<this.minPrice){
          let diff=this.minPrice-this.totalPrice;
          return `还差￥${diff}元起送`;
        }else{
          return '去结算';
        }
      },
      payClass(){
        if(this.totalPrice<this.minPrice){
          return 'not-enough';
        }else{
           return 'enough';
        }
      },
      listShow(){
        if (!this.totalCount) {
          this.fold = true;
          return false;
        }
        let show = !this.fold;
        if (show) {
          this.$nextTick(() => {
            if (!this.scroll) {
              this.scroll = new BScroll(this.$refs.listContent, {
                click: true
              });
            } else {
              this.scroll.refresh();
            };
          });
        };
        return show;
      }
    },
    methods:{
      drop(el) {
        for (let i = 0; i < this.balls.length; i++) {
          let ball = this.balls[i];
          if (!ball.show) {
            ball.show = true;
            ball.el = el;
            //ball.show改成true 证明已经下落了，dropBalls push 下落的球
            this.dropBalls.push(ball);
            //只循环了一次，return后不能再循环了，所以只把一个ball.show改成true，拿出一个球做动画
            return;
          }
        }
      },
      beforeEnter: function (el) {
        let count = this.balls.length;
        while (count--) {
          let ball = this.balls[count];
          //获取所有的ball,while循环所有的ball和for一样的功能
          if (ball.show) {
            /*获取加号的位置(小球动画开始的位置)*/
            let rect = ball.el.getBoundingClientRect();
            let x = rect.left - 32;
            let y = -(window.innerHeight - rect.top - 22);

            el.style.display = '';
            el.style.webkitTransform = `translate3d(0, ${y}px, 0)`;
            el.style.transform = `translate3d(0, ${y}px, 0)`;

            let inner = el.getElementsByClassName('inner-hook')[0];
            inner.style.webkitTransform = `translate3d(${x}px, 0, 0)`;
            inner.style.transform = `translate3d(${x}px, 0, 0)`;
          }
        }
      },
      enter: function (el, done) {
        /* eslint-disable no-unused-vars */
        let rf = el.offsetHeight;                 /*触发浏览器重绘;*/
        this.$nextTick(() => {
          el.style.webkitTransform = 'translate3d(0, 0, 0)';
          el.style.transform = 'translate3d(0, 0, 0)';
          let inner = el.getElementsByClassName('inner-hook')[0];
          inner.style.webkitTransform = 'translate3d(0, 0, 0)';
          inner.style.transform = 'translate3d(0, 0, 0)';
          el.addEventListener('transitionend', done);
        });
      },
      afterEnter: function (el) {
         //dropBalls push 下落的球 是引用值，这里改了ball里面为true做动画的球也会由于下面设置为false而跟着变成false
         let ball = this.dropBalls.shift();
         if (ball) {
             ball.show = false;
             el.style.display = 'none';
         };
      },
      toggleList() {
        if (!this.totalCount) {
          return;
        }
        this.fold = !this.fold;
      },
      empty(){
        this.selectFoods.forEach((food) => {
          food.count = 0;
        });
      },
      hideList() {
        this.fold = true;
      },
      pay() {
        if (this.totalPrice < this.minPrice) {
          return;
        }
        window.alert(`支付${this.totalPrice}元`);
      }
    },
    components:{
      cartcontrol
    }
  }
</script>
<style scoped lang="scss">
.shopcart{
  position: fixed;
  left: 0;
  bottom: 0;
  z-index: 50;
  width: 100%;
  height: 48px;
  .content{
    display: flex;
    background: #141d27;
    font-size: 0;
    color: rgba(255, 255, 255, 0.4);
    .content-left{
      flex: 1;
      &>*{
        display: inline-block;
        vertical-align: top;
      }
      .logo-wrapper{
        position: relative;
        top: -10px;
        margin: 0 5px;
        padding: 6px;
        width: 56px;
        height: 56px;
        box-sizing: border-box;
        border-radius: 50%;
        background: #141d27;
        .logo{
          width: 100%;
          height: 100%;
          border-radius: 50%;
          background: #2b343c;
          text-align: center;
          &.highlight{
            background: rgb(0, 160, 220);
          }
          .icon-shopping_cart{
            display: inline-block;
            vertical-align: top;
            width: 24px;
            height: 24px;
            background-size: 24px 24px!important;
            background-repeat: no-repeat!important;
            margin-top: 8px;
            background: url('img/shopcart.png');
          }
          &.highlight .icon-shopping_cart{
           background: url('img/shopcart-highlight.png');
          }
        }
        .num{
          position: absolute;
          top: 0;
          right: 0;
          width: 24px;
          height: 16px;
          line-height: 16px;
          text-align: center;
          border-radius: 16px;
          font-size: 9px;
          font-weight: 700;
          color: #fff;
          background: rgb(240, 20, 20);
          box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.4);
        }
      }
      .price{
        line-height: 24px;
        margin-top: 12px;
        box-sizing: border-box;
        padding-right: 12px;
        border-right: 1px solid rgba(255, 255, 255, 0.1);
        font-size: 16px;
        font-weight: 700;
        &.highlight{
          color: #fff;
        }
      }
      .desc{
        line-height: 24px;
        margin: 12px 0 0 12px;
        font-size: 10px;
      }
    }
    .content-right{
      flex: 0 0 105px;
      width: 105px;
      .pay{
        height: 48px;
        line-height: 48px;
        text-align: center;
        font-size: 12px;
        font-weight: 700;
        &.not-enough{
          background: #2b333b;
        }
        &.enough{
          background: #00b43c;
          color: #fff;
        }
      }
    }
  }
  .ball-container{
    .ball{
      position: fixed;
      left: 32px;
      bottom: 22px;
      z-index: 200;
      transition: all 0.4s cubic-bezier(0.49, -0.29, 0.75, 0.41);
      .inner{
        width: 16px;
        height: 16px;
        border-radius: 50%;
        background: rgb(0, 160, 220);
        transition: all 0.4s linear;
      }
    }
  }
  .shopcart-list{
    position: absolute;
    left: 0;
    top: 0;
    z-index: -1;
    width: 100%;
    transition: all 0.5s;
    transform: translate3d(0, -100%, 0);
    &.fold-enter-active{
      opacity: 1;
      transform: translate3d(0, -100%, 0);
    }
    &.fold-enter,&.fold-leave-active{
      opacity: 0;
      transform: translate3d(0, 0, 0);
    }
    .list-header{
      height: 40px;
      line-height: 40px;
      padding: 0 18px;
      background: #f3f5f7;
      border-bottom: 1px solid rgba(7, 17, 27, 0.1);
      .title{
        float: left;
        font-size: 14px;
        color: rgb(7, 17, 27);
      }
      .empty{
        float: right;
        font-size: 12px;
        color: rgb(0, 160, 220);
      }
    }
    .list-content{
      padding: 0 18px;
      max-height: 217px;
      overflow: hidden;
      background: #fff;
      .food{
        position: relative;
        padding: 12px 0;
        box-sizing: border-box;
        @include border-1px(rgba(7, 17, 27, 0.1));
      }
      .name{
        line-height: 24px;
        font-size: 14px;
        color: rgb(7, 17, 27);
      }
      .price{
        position: absolute;
        right: 90px;
        bottom: 12px;
        line-height: 24px;
        font-size: 14px;
        font-weight: 700;
        color: rgb(240, 20, 20);
      }
      .cartcontrol-wrapper{
        position: absolute;
        right: 0;
        bottom: 6px;
      }
    }
  }
}
.list-mask{
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 40;
  backdrop-filter: blur(10px);
  transition: all 0.5s;
  background: rgba(7, 17, 27, 0.6);
  &.fade-enter-active{
    opacity: 1;
    background: rgba(7, 17, 27, 0.6);
  }
  &.fade-enter,&.fade-leave-active{
    opacity: 0;
    background: rgba(7, 17, 27, 0);
  }
}

</style>
