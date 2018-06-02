<template>
  <div class="cartcontrol">
    <transition name="move">
      <div class="cart-decrease icons" v-show="food.count>0" @click.stop.prevent="decreaseCart()">
        <span class="inner">-</span>
      </div>
    </transition>
    <div class="cart-count" v-show="food.count>0">{{food.count}}</div>
    <div class="cart-add icons" @click.stop.prevent="addCart()"><span>+</span></div>
  </div>
</template>
<script>
import Vue from "vue";

export default{
  props:{
    food:{
      type:Object
    }
  },
  methods:{
    addCart(){
      // 不存在的时候，点击了就是1
      if(!this.food.count){
        Vue.set(this.food,'count',1)
      }else{
        this.food.count++;
      }
      this.$root.eventHub.$emit('addcart', event.target);
    },
    decreaseCart(){
      if(this.food.count){
        this.food.count--;
      }
    }
  }
}
</script>
<style scoped lang="scss">
/* 动画 */
.move-enter-active,.move-leave-active{
  transition: all 0.4s linear;
}
.move-enter-active{
  opacity: 1;
  transform: translate3d(0, 0, 0);
  .inner{
    transition: all 0.4s linear;
    transform: rotate(0);
  }
}
.move-leave-active,.move-enter{
  opacity: 0;
  transform: translate3d(24px, 0, 0);
  .inner{
    transition: all 0.4s linear;
    transform: rotate(180deg);
  }
}




.cartcontrol{
  font-size: 0;
  &>*{
    display: inline-block;
  }
  .cart-decrease,.cart-add{
    padding: 6px;
      &.icons span{
        display: inline-block;
        line-height: 22px;
        font-size: 18px;
        color: #fff;
        border-radius: 50%;
        width: 22px;
        height: 22px;
        background: rgb(0, 160, 220);
        text-align: center;
      }
  }
  .cart-count{
    font-size: 10px;
    vertical-align: top;
    padding-top: 6px;
    width: 12px;
    line-height: 24px;
    text-align: center;
    color: rgb(147, 153, 159);
  }
}
</style>
