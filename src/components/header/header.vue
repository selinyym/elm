<template>
  <div class="header">
    <div class="content-wrapper">
      <div class="avatar">
        <img :src="seller.avatar" alt="" width="64" height="64">
      </div>
      <div class="content">
        <div class="title">
          <span class="brand"></span>
          <span class="name">{{seller.name}}</span>
        </div>
        <div class="description">
          {{seller.description}}/{{seller.time}}分钟送达
        </div>
        <div class="support" v-if="seller.supports">
          <span class="icon" :class="classMap[seller.supports[0].type]"></span>
          <span class="text">{{seller.supports[0].description}}</span>
        </div>
      </div>
      <div v-if="seller.supports" class="support-count" @click="showDetail">
        <span class="count">{{seller.supports.length}}个</span>
        <i class="iconKeyboardRight"></i>
      </div>
    </div>
    <div class="bulletin-wrapper" @click="showDetail">
      <span class="bulletin-title"></span><span class="bulletin-text">{{seller.bulletin}}</span>
      <i class="iconKeyboardRight"></i>
    </div>
    <div class="background">
      <img :src="seller.avatar" alt="" width="100%" height="100%">
    </div>
    <transition enter-active-class="animated fadeIn" leave-active-class="animated fadeOut">
      <div class="detail" v-show="detailShow">
          <div class="detail-wrapper clearfix">
            <div class="detail-main">
              <h1 class="name">{{seller.name}}</h1>
              <div class="star-wrapper">
                <star :size="48" :score="seller.score"></star>
              </div>
              <div class="title">
                <div class="line"></div>
                <div class="text">优惠信息</div>
                <div class="line"></div>
              </div>
              <ul class="support">
                <li class="support-item" v-for="(item,index) in seller.supports">
                <span class="icon" :class="classMap[seller.supports[index].type]"></span>
                <span class="text"> {{seller.supports[index].description}}</span>
                </li>
              </ul>
              <div class="title">
                <div class="line"></div>
                <div class="text">商家公告</div>
                <div class="line"></div>
              </div>
              <div class="bulletin">
                <p class="content">{{seller.bulletin}}</p>
              </div>
            </div>
          </div>
          <div class="detail-close" @click="hideDetail">+</div>
      </div>
    </transition>
  </div>

</template>
<script>
import star from '../star/star.vue'
export default{
  props: {
    seller: {
      type: Object
    }
  },
  data(){
    return{
      detailShow:false
    }
  },
  created(){
    this.classMap=['decrease', 'discount', 'special', 'invoice', 'guarantee'];
  },
  methods:{
    showDetail(){
      this.detailShow=true;
    },
    hideDetail(){
      this.detailShow=false;
    }
  },
  components:{
    star
  }
}
</script>
<style scoped lang="scss">
  .header{
    color: #fff;
    position: relative;
    background: rgba(7, 17, 27, 0.5);
    overflow: hidden;
    .content-wrapper{
      position: relative;
      padding: 24px 12px 18px 24px;
      font-size: 0;
      .avatar{
        display: inline-block;
        vertical-align: top;
        img{
          border-radius: 2px;
        }
      }
      .content{
        display: inline-block;
        margin-left: 16px;
        .title{
          margin: 2px 0 8px 0;
          .brand{
            width: 30px;
            height: 18px;
            display: inline-block;
            vertical-align: top;
            @include bg-image('img/brand');
            background-size: 30px 18px!important;
            background-repeat: no-repeat!important;
          }
          .name{
            margin-left: 6px;
            font-size: 16px;
            line-height: 18px;
            font-weight: bold;
          }
        }
        .description{
          margin-bottom: 10px;
          line-height: 12px;
          font-size: 12px;
        }
        .support{
          .icon{
            display: inline-block;
            vertical-align: top;
            width: 12px;
            height: 12px;
            margin-right: 2px;
            background-size: 12px 12px!important;
            background-repeat: no-repeat!important;
            &.decrease{
              @include bg-image('img/decrease_1');
            }
            &.discount{
              @include bg-image('img/discount_1');
            }
            &.guarantee{
              @include bg-image('img/guarantee_1');
            }
            &.invoice{
              @include bg-image('img/invoice_1');
            }
            &.special{
              @include bg-image('img/special_1');
            }
          }
          .text{
            line-height: 12px;
            font-size: 10px;
          }
        }
      }
      .support-count{
        position: absolute;
        right: 12px;
        bottom: 14px;
        padding: 0 8px;
        height: 24px;
        line-height: 24px;
        border-radius: 14px;
        background: rgba(0, 0, 0, 0.2);
        text-align: center;
        &>*{
          vertical-align: middle;
          font-size: 10px;
        }
        .iconKeyboardRight{
          margin-left: 2px;
          display: inline-block;
          width: 5px;
          height: 5px;
          border-left: 1px solid #fff;
          border-top: 1px solid #fff;
          transform: rotate(135deg);
        }
      }
    }
    .bulletin-wrapper{
      position: relative;
      height: 28px;
      line-height: 28px;
      padding: 0 22px 0 12px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      background: rgba(7, 17, 27, 0.2);
      .bulletin-title{
        display: inline-block;
        vertical-align: top;
        margin-top: 8px;
        width: 22px;
        height: 12px;
        @include bg-image('img/bulletin');
        background-size: 22px 12px!important;
        background-repeat: no-repeat!important;
      }
      .bulletin-text{
        vertical-align: top;
        margin: 0 4px;
        font-size: 10px;
      }
      .iconKeyboardRight{
        position: absolute;
        right: 12px;
        top: 10px;
        display: inline-block;
        width: 5px;
        height: 5px;
        border-left: 1px solid #fff;
        border-top: 1px solid #fff;
        transform: rotate(135deg);
      }
    }
    .background{
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      z-index: -1;
      filter: blur(10px);
    }
    .detail{
      position: fixed;
      z-index: 100;
      width: 100%;
      height: 100%;
      overflow: auto;
      background: rgba(7, 17, 27, 0.8);
      top: 0;
      left: 0;
      backdrop-filter: blur(10px);
      .detail-wrapper{
        width: 100%;
        min-height: 100%;
        .detail-main{
          margin-top: 64px;
          padding-bottom: 64px;
          .name{
            line-height: 16px;
            text-align: center;
            font-size: 16px;
            font-weight: 700;
          }
          .star-wrapper{
            padding: 2px 0;
            margin-top: 18px;
            text-align: center;
          }
          .title{
            display: flex;
            width: 80%;
            margin: 28px auto 24px;
            .line{
              flex: 1;
              position: relative;
              top: -6px;
              border-bottom: 1px solid rgba(255, 255, 255, 0.2);
            }
            .text{
              padding: 0 12px;
              font-weight: 700;
              font-size: 14px;
            }
          }
          .support{
            width: 80%;
            margin: 0 auto;
            .support-item{
              padding: 0 12px;
              margin-bottom: 12px;
              font-size: 0;
              &:last-child{
                margin-bottom: 0;
              }
              .icon{
                display: inline-block;
                width: 16px;
                height: 16px;
                vertical-align: top;
                margin-right: 6px;
                background-size: 16px 16px!important;
                background-repeat: no-repeat!important;

                &.decrease{
                  @include bg-image('img/decrease_2');
                }
                &.discount{
                  @include bg-image('img/discount_2');
                }
                &.guarantee{
                  @include bg-image('img/guarantee_2');
                }
                &.invoice{
                  @include bg-image('img/invoice_2');
                }
                &.special{
                  @include bg-image('img/special_2');
                }
              }
              .text{
                font-size: 12px;
                line-height: 16px;
              }
            }
          }
          .bulletin{
            width: 80%;
            margin: 0 auto;
            .content{
              padding: 0 12px;
              line-height: 24px;
              font-size: 12px;
            }
          }
        }
      }
      .detail-close{
        position: relative;
        width: 32px;
        height: 32px;
        margin: -64px auto 0 auto;
        clear: both;
        font-size: 32px;
        transform: rotate(-135deg);
        -webkit-transform: rotate(-135deg);
      }
    }
  }
</style>
