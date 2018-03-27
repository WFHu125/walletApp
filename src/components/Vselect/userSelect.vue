<template>
  <div class="selects-wrapper" ref="selectContainer" @click="showSelect">
    <ul>
      <li v-for="item in user" @click="selectItem(item)">{{item}}</li>
    </ul>
  </div>
</template>

<script type="text/ecmascript-6">
  import BScroll from 'better-scroll';
  export default {
    props: ['Role'],
    data() {
      return {
        user: []
      };
    },
    created() {
      let arr = ['普通用户', '代理', '供货商', '合伙人', '会员Plus'];
      this.user = arr;
      this.$nextTick(() => {
        this._initScroll();
        console.log(this);
      });
    },
    methods: {
      selectItem(item) {
        this.$emit('userRole', item);
      },
      showSelect() {
        this.$emit('showR');
      },
      _initScroll() {
        this.selectScroll = new BScroll(this.$refs.selectContainer, {
          click: true
        });
      }
    }
  };
</script>

<style>
  .selects-wrapper {
    width: 100vw;
    height: 100vh;
    background-color: rgba(0, 0, 0, 0.3);
    z-index: 1000;
    position: absolute;
  }

  .selects-wrapper ul {
    width: 100%;
    list-style: none;
    position: fixed;
    bottom: 0;
    background-color: #ffffff;
    z-index: 1001;
    border-top: solid 1px #f5f5f5;
    /*overflow: hidden;*/
  }

  .selects-wrapper ul li {
    height: 40px;
    line-height: 40px;
    border-bottom: solid 1px #f4f4f4;
    text-align: center;
    font-size: 14px;
    color: #313131;
  }
</style>
