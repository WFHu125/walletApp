<template>
  <div class="citySelect">
    <div class="blank" @click="showSelect"></div>
    <div class="select-wrapper">
      <div class="title-select">
        <div class="banner">{{Cprovence}}</div>
        <div class="banner">{{Ccity}}</div>
        <div class="banner">{{Carea}}</div>
      </div>
      <div class="select-container">
        <div class="provence-wrapper" ref="provenceWrapper">
          <ul>
            <li v-for="item in provence" @click="selectProvence($event,item)" :id="item.regionid">
              {{item.name}}
            </li>
          </ul>
        </div>
        <div class="provence-wrapper" ref="cityWrapper">
          <ul>
            <li v-for="item in city" @click="selectCity($event,item)" :id="item.regionid">{{item.name}}</li>
          </ul>
        </div>
        <div class="provence-wrapper" ref="areaWrapper">
          <ul>
            <li v-for="item in area" @click="selectArea($event,item)" :id="item.regionid">{{item.name}}</li>
          </ul>
        </div>
      </div>
    </div>
  </div>

</template>

<script type="text/ecmascript-6">
  import BScroll from 'better-scroll';
  export default {
    name: 'citySelect',
    props: ['list'],
    data() {
      return {
        provence: [],
        city: [],
        area: [],
        Cprovence: '四川省',
        Ccity: '',
        Carea: '',
        listHeight: []
      };
    },
    created() {
//      this.showProvence();
    },
    methods: {
      showProvence() {
        var provenceData = JSON.stringify({
          'data': [{
            'parentid': ''
          }],
          'controllerName': 'regions',
          'actionName': 'query'
        });
        this.$http.post('http://139.224.132.124/fuxi-api/key-service', provenceData, {
          'headers': {
            'Content-Type': 'application/json'
          }
        }).then((res) => {
          this.provence = res.body.data;
          console.log('000000000');
          // dom更新后
          this.$nextTick(() => {
            this._initScroll();
            console.log('11111111');
          });
//          console.log('展示省份' + JSON.stringify(res.body));
          console.log('展示省份');
//          this.$emit('showPro');
        });
      },
      selectProvence(e, item) {
        var provenceId = e.target.id;
        this.Cprovence = item.name;
//        e.target.style.color = '#30aafd';
        var cityData = JSON.stringify({
          'data': [{
            'parentid': provenceId
          }],
          'controllerName': 'regions',
          'actionName': 'query'
        });
        this.$http.post('http://139.224.132.124/fuxi-api/key-service', cityData, {
          'headers': {
            'Content-Type': 'application/json'
          }
        }).then((res) => {
//          localStorage.setItem('city', JSON.stringify(res.body.data));
          this.city = res.body.data;
          this.$nextTick(() => {
            this.cityScroll = new BScroll(this.$refs.cityWrapper, {
              click: true
            });
          });
          console.log('选择省份');
          return false;
        });
      },
      selectCity(e, item) {
        var cityId = e.target.id;
        this.Ccity = item.name;
//        e.target.style.color = '#30aafd';
        console.log(cityId);
        var cityData = JSON.stringify({
          'data': [{
            'parentid': cityId
          }],
          'controllerName': 'regions',
          'actionName': 'query'
        });
        this.$http.post('http://139.224.132.124/fuxi-api/key-service', cityData, {
          'headers': {
            'Content-Type': 'application/json'
          }
        }).then((res) => {
//          localStorage.setItem('city', JSON.stringify(res.body.data));
          this.area = res.body.data;
          this.$nextTick(() => {
            this.areaScroll = new BScroll(this.$refs.areaWrapper, {
              click: true
            });
          });
//          console.log('选择城市' + JSON.stringify(this.area));
          console.log('选择城市');
        });
      },
      selectArea(e, item) {
        var areaId = e.target.id;
        this.Carea = item.name;
//        e.target.style.color = '#30aafd';
//        console.log(areaId);
        this.showSelect();
        var addr = this.Cprovence + this.Ccity + this.Carea;
        this.$emit('address', addr, areaId);
      },
      showSelect() {
        this.$emit('showC');
      },
//      showCity() {
//        var cityData = JSON.stringify({
//          'data': [{
//            'parentid': '23'
//          }],
//          'controllerName': 'regions',
//          'actionName': 'query'
//        });
//        this.$http.post('http://139.224.132.124/fuxi-api/key-service', cityData, {
//          'headers': {
//            'Content-Type': 'application/json'
//          }
//        }).then((res) => {
//          this.city = res.body.data;
//          this.$nextTick(() => {
//            this._initScroll();
//          });
//          console.log(this.provance);
//          console.log(res.body);
//        }).catch(() => {
//          this.$dialog.toast({mes: '服务器异常'});
//        });
//      },
//      showArea() {
//        var areaData = JSON.stringify({
//          'data': [{
//            'parentid': '280'
//          }],
//          'controllerName': 'regions',
//          'actionName': 'query'
//        });
//        this.$http.post('http://139.224.132.124/fuxi-api/key-service', areaData, {
//          'headers': {
//            'Content-Type': 'application/json'
//          }
//        }).then((res) => {
//          this.area = res.body.data;
//          this.$nextTick(() => {
//            this._initScroll();
//          });
//          console.log(this.provance);
//          console.log(res.body);
//        }).catch(() => {
//          this.$dialog.toast({mes: '服务器异常'});
//        });
//      },
      _initScroll() {
        if (!this.scroll) {
          this.provenceScroll = new BScroll(this.$refs.provenceWrapper, {
            click: true
          });
        } else {
          this.scroll.refresh();
        }
      }
    }
  };
</script>

<style>
  .citySelect {
    width: 100vw;
    height: 100vh;
    background-color: rgba(0, 0, 0, 0.3);
    z-index: 1000;
    position: absolute;
  }

  .citySelect .select-wrapper {
    width: 100%;
    height: 60vh;
    position: fixed;
    bottom: 0;
    background-color: #ffffff;
    z-index: 1001;
  }

  .citySelect .blank {
    width: 100%;
    height: 40vh;
  }

  .title-select {
    width: 100%;
    height: 40px;
    display: flex;
    flex-direction: row;
    border-bottom: solid 1px #f5f5f5;
    box-sizing: border-box;
  }

  .title-select .banner {
    flex: 1;
    line-height: 40px;
    text-align: center;
    font-size: 14px;
    color: #30aafd;
  }

  .select-container {
    display: flex;
    flex-direction: row;
    width: 100%;
    height: calc(60vh - 40px);
    overflow: hidden;
  }

  .select-container .provence-wrapper {
    flex: 1;
    height: 100%;
    overflow: hidden;
  }

  .provence-wrapper ul li {
    width: 100%;
    height: 40px;
    line-height: 40px;
    border-bottom: solid 1px #f4f4f4;
    text-align: center;
    font-size: 12px;
    color: #313131;
    overflow: hidden;
  }

  .active {
    color: #30aafd;
  }

  .unactive {
    color: #313131;
  }
</style>
