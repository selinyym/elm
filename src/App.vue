<template>
  <div id="app">
    <v-header :seller="seller" v-if="flag"></v-header>
    <div class="tab">
      <div class="tab-item">
        <router-link to="/goods" >商品</router-link>
      </div>
      <div class="tab-item">
        <router-link to="/ratings">评论</router-link>
      </div>
      <div class="tab-item">
        <router-link to="/seller">商家</router-link>
      </div>
    </div>
    <div class="content">
      <keep-alive>
        <router-view :seller="seller"></router-view>
      </keep-alive>
    </div>
  </div>
</template>
<script>
import Header from "./components/header/header.vue";
import {urlParse} from './common/js/util.js';
export default {
  data() {
    return {
      seller: {
        id: (() => {
          let queryParam = urlParse();
          return queryParam.id;
        })()
      },
      flag:false
    };
  },
  created() {
    this.$http.get('/api/seller?id=' + this.seller.id).then((res) => {
      this.seller = Object.assign({}, this.seller, res.data.data);
      this.flag=true;
    });
  },
  components: {
    'v-header': Header
  }
}
</script>

<style scoped lang="scss">
.tab{
  display: flex;
  width: 100%;
  @include ht(40px);
  @include border-1px(rgba(7,17,27,0.1));
  .tab-item{
    flex: 1;
    text-align: center;
    &>a{
      display: block;
      font-size: 14px;
      color: rgb(77, 85, 93);
      &.active{
        color: rgb(240, 20, 20);
      }
    }
  }
}
</style>
