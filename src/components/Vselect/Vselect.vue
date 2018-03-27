<template>
  <div class="selects-wrapper" ref="selectContainer" @click="showSelect">
    <ul>
      <li v-for="item in education" @click="selectItem(item)">{{item}}</li>
    </ul>
  </div>

</template>

<script type="text/ecmascript-6">
  import BScroll from 'better-scroll';
  export default {
    props: ['list'],
    data() {
      return {
        education: ''
      };
    },
    created() {
      let arr = ['小学', '初中', '高中', '大专', '本科', '研究生', '博士'];
      this.education = arr;
      this.$nextTick(() => {
        this._initScroll();
        console.log(this);
      });
    },
    methods: {
      selectItem(item) {
        this.$emit('receive', item);
      },
      showSelect() {
        this.$emit('showE');
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
