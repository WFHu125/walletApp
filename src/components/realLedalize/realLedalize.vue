<template>
  <div>
    <Vheader title="实名认证"></Vheader>
    <div class="process-bar">
      <div class="process"></div>
      <div class="process-wrapper">
        <div class="process-text">
          <div class="circle active"></div>
          <div class="process-info">实名认证</div>
        </div>
        <div class="process-text">
          <div class="circle"></div>
          <div class="process-info">个人信息</div>
        </div>
        <div class="process-text">
          <div class="circle"></div>
          <div class="process-info">提交成功</div>
        </div>
      </div>
    </div>
    <div class="v-container" ref="realWrapper">
      <div class="v-wrapper" v-if="state === 0">
        <form action="" class="form_ledalize">
          <div class="input-wrapper">
            <label class="flex2">姓名：</label>
            <input type="text" placeholder="请输入真实信息" class="flex8" v-model="name" @blur="checkStr(name)">
          </div>
          <div class="input-wrapper">
            <label class="flex2">证件号：</label>
            <input type="text" placeholder="请输入身份证号" class="flex8" v-model="icard" @blur="isCardID(icard)">
          </div>
        </form>
        <!--证件上传-->
        <div class="zj-upload">
          <div class="upload-title">证件上传</div>
          <div class="upload-content">
            <div class="upload-section" v-for="(item,index) in imgs">
              <div class="img-preview"><img v-if="item.data != ''" :src="item.data || index"></div>
              <div class="upload-text">{{item.name}}</div>
              <div class="btn-upload"><input type="file" accept="image/*"
                                             @change="selectImg($event,index)"
                                             :id="item.id">上传
              </div>
            </div>
          </div>
        </div>
        <!--备注信息-->
        <div class="Remarks">
          <p><span class="zhu">注：</span>1、身份证是申请合伙人必须证件，咱的商城不会通过任何途径泄漏您的消息；</p>
          <p>2、请确保所有信息为本人信息</p>
        </div>
        <div class="btn-container margin20">
          <div class="btn btn-blue" @click="submitReal">下一步</div>
        </div>
      </div>
      <div class="v-wrapper" v-else-if="state === 2">
        <form action="" class="form_ledalize">
          <div class="input-wrapper">
            <label class="flex2">姓名：</label>
            <input type="text" placeholder="请输入真实信息" class="flex8" :value="name" readonly>
          </div>
          <div class="input-wrapper">
            <label class="flex2">证件号：</label>
            <input type="text" placeholder="请输入身份证号" class="flex8" :value="icard" readonly>
          </div>
        </form>
        <!--证件上传-->
        <div class="zj-upload">
          <div class="upload-title">证件上传</div>
          <div class="upload-content">
            <div class="upload-section" v-for="(item,index) in imgs">
              <div class="img-preview"><img v-if="item.data != ''" :src="item.data || index"></div>
              <div class="upload-text">{{item.name}}</div>
            </div>
          </div>
        </div>
        <!--备注信息-->
        <div class="Remarks">
          <p><span class="zhu">注：</span>1、身份证是申请合伙人必须证件，咱的商城不会通过任何途径泄漏您的消息；</p>
          <p>2、请确保所有信息为本人信息</p>
        </div>
        <div class="btn-container margin20">
          <router-link to="/personalInfo">
            <div class="btn btn-blue">下一步</div>
          </router-link>
        </div>
      </div>
      <div class="v-wrapper" v-else-if="state === 1 || state === 3">
        <form action="" class="form_ledalize">
          <div class="input-wrapper">
            <label class="flex2">姓名：</label>
            <input type="text" placeholder="请输入真实信息" class="flex8" :value="name" v-model="name">
          </div>
          <div class="input-wrapper">
            <label class="flex2">证件号：</label>
            <input type="text" placeholder="请输入身份证号" class="flex8" :value="icard" v-model="icard">
          </div>
        </form>
        <!--证件上传-->
        <div class="zj-upload">
          <div class="upload-title">证件上传</div>
          <div class="upload-content">
            <div class="upload-section" v-for="(item,index) in imgs">
              <div class="img-preview"><img v-if="item.data != ''" :src="item.data || index"></div>
              <div class="upload-text">{{item.name}}</div>
              <div class="btn-upload"><input type="file" accept="image/*"
                                             @change="selectImg($event,index)"
                                             :id="item.id">上传
              </div>
            </div>
          </div>
        </div>

        <!--备注信息-->
        <div class="Remarks">
          <p><span class="zhu">注：</span>1、身份证是申请合伙人必须证件，咱的商城不会通过任何途径泄漏您的消息；</p>
          <p>2、请确保所有信息为本人信息</p>
        </div>
        <div class="btn-container margin20">
          <div class="btn btn-blue" @click="submitReal">下一步</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import Vheader from '../header/childHeader.vue';
  import BScroll from 'better-scroll';
  import {config, headers, unHeaders} from '../../common/js/config';
  export default{
    data() {
      return {
        icard: '',
        name: '',
        flag: {
          change: false
        },
        imgs: [
          {
            id: 'img1',
            name: '身份证正面',
            data: 'http://upload.mnw.cn/2017/0122/1485050987244.jpg'
          },
          {
            id: 'img2',
            name: '身份证背面',
            data: 'http://upload.mnw.cn/2017/0122/1485050987244.jpg'
          },
          {
            id: 'img3',
            name: '手持身份证',
            data: 'http://upload.mnw.cn/2017/0122/1485050987244.jpg'
          }
        ],
        realImg: [],
        state: 0,
        texts: [{name: '身份证正面'}, {name: '身份证背面'}, {name: '手持身份证'}]
      };
    },
    created() {
      var token = localStorage.getItem('token');
      var _this = this;
      this.$root.tokenValidat(token, function (data) {
        if (data) {
          _this.initreal();
        } else {
          _this.$router.push('/login');
        }
      });
    },
    methods: {
      initreal: function () {
        var legalizeInfo = JSON.parse(sessionStorage.getItem('legalizeInfo'));
        if (legalizeInfo) {
          this.state = legalizeInfo.status;
          if (this.state === 1 || this.state === 2 || this.state === 3) {
            this.name = legalizeInfo.realName;
            this.icard = legalizeInfo.idCard;
            for (var i = 0; i < legalizeInfo.imageList.length; i++) {
              this.imgs[i].data = legalizeInfo.imageList[i];
            }
          }
          console.log(legalizeInfo);
          console.log(this.state);
        }
        this.$nextTick(() => {
          this._initScroll();
        });
      },
      selectImg: function (e, index) {
        console.log(index);
        var _this = this;
        //    用于压缩图片的canvas
        var canvas = document.createElement('canvas');
        var ctx = canvas.getContext('2d');
        //    瓦片canvas
        var tCanvas = document.createElement('canvas');
        var tctx = tCanvas.getContext('2d');
        var maxsize = 100 * 1024;
        var files = Array.prototype.slice.call(e.target.files);
        console.log(files.length);// 3
        for (let i = 0; i < files.length; i++) {
          if (!/\/(?:jpeg|png|gif)/i.test(files[i].type)) return;
          var reader = new FileReader();
          reader.onload = function () {
            var result = this.result;
            var img = new Image();
            img.src = result;
            // 如果图片大小小于100kb，则直接上传
            if (result.length <= maxsize) {
              img = null;
              upload(result, files[i].type, _this, index);
              return;
            }
            // 图片加载完毕之后进行压缩，然后上传
            if (img.complete) {
              callback();
            } else {
              img.onload = callback;
            }
            function callback() {
              var data = compress(img);
              upload(data, files[i].type, _this, index);
              img = null;
            }
          };
          reader.readAsDataURL(files[i]);
        }
        //    使用canvas对大图片进行压缩
        function compress(img) {
          var initSize = img.src.length;
          var width = img.width;
          var height = img.height;
          // 如果图片大于四百万像素，计算压缩比并将大小压至400万以下
          var ratio;
          if ((ratio = width * height / 4000000) > 1) {
            ratio = 0.7;
            console.log(ratio);
            // ratio =Math.pow(ratio,-4)
            width /= ratio;
            height /= ratio;
          } else {
            ratio = 1;
          }
          canvas.width = width;
          canvas.height = height;
//        铺底色
          ctx.fillStyle = '#fff';
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          // 如果图片像素大于100万则使用瓦片绘制
          var count;
          if ((count = width * height / 1000000) > 1) {
            count = ~~(Math.sqrt(count) + 1); // 计算要分成多少块瓦片
//            计算每块瓦片的宽和高
            var nw = ~~(width / count);
            var nh = ~~(height / count);
            tCanvas.width = nw;
            tCanvas.height = nh;
            for (var i = 0; i < count; i++) {
              for (var j = 0; j < count; j++) {
                tctx.drawImage(img, i * nw * ratio, j * nh * ratio, nw * ratio, nh * ratio, 0, 0, nw, nh);
                ctx.drawImage(tCanvas, i * nw, j * nh, nw, nh);
              }
            }
          } else {
            ctx.drawImage(img, 0, 0, width, height);
          }
          // 进行最小压缩
          var ndata = canvas.toDataURL('image/jpeg', 0.1);
          console.log('压缩前：' + initSize);
          console.log('压缩后：' + ndata.length);
          console.log('压缩率：' + ~~(100 * (initSize - ndata.length) / initSize) + '%');
          tCanvas.width = tCanvas.height = canvas.width = canvas.height = 0;
          return ndata;
        }

        function upload(basestr, type, s, indexs) {
//          var imgs = _this.imgs;
          var text = window.atob(basestr.split(',')[1]);
          var buffer = new Uint8Array(text.length);
          for (var i = 0; i < text.length; i++) {
            buffer[i] = text.charCodeAt(i);
          }
          var blob = getBlob([buffer], type);
          var formdata = getFormData();
          formdata.append('files', blob);
          s.$dialog.toast({mes: '正在上传图片，请稍等~'});
          s.$http.post(config.img_url, formdata, unHeaders).then((res) => {
            console.log('上传图片返回数据' + JSON.stringify(res.body));
            if (res.body.data.result === true) {
              console.log('mmmmmmmmm');
              s.realImg.push(res.body.data.path[0]);
              document.querySelectorAll('.upload-section')[indexs].querySelector('img').setAttribute('src', res.body.data.path[0]);
            }
          });
        }

        /**
         * 获取blob对象的兼容性写法
         * @param buffer
         * @param format
         * @returns {*}
         */
        function getBlob(buffer, format) {
          try {
            return new Blob(buffer, {type: format});
          } catch (e) {
            var bb = (window.BlobBuilder || window.WebKitBlobBuilder || window.MSBlobBuilder);
            buffer.forEach(function (buf) {
              bb.append(buf);
            });
            return bb.getBlob(format);
          }
        }

        /**
         * 获取formdata
         */
        function getFormData() {
          var isNeedShim = ~navigator.userAgent.indexOf('Android') && ~navigator.vendor.indexOf('Google') && !~navigator.userAgent.indexOf('Chrome') && navigator.userAgent.match(/AppleWebKit\/(\d+)/).pop() <= 534;
          return isNeedShim ? new FormDataShim() : new FormData();
        }

        /**
         * formdata 补丁, 给不支持formdata上传blob的android机打补丁
         * @constructor
         */
        function FormDataShim() {
          console.warn('using formdata shim');
          var o = this;
          var parts = [];
          var boundary = Array(21).join('-') + (+new Date() * (1e16 * Math.random())).toString(36);
          var oldSend = XMLHttpRequest.prototype.send;
          this.append = function (name, value, filename) {
            parts.push('--' + boundary + '\r\nContent-Disposition: form-data; name="' + name + '"');
            if (value instanceof Blob) {
              parts.push('; filename="' + (filename || 'blob') + '"\r\nContent-Type: ' + value.type + '\r\n\r\n');
              parts.push(value);
            } else {
              parts.push('\r\n\r\n' + value);
            }
            parts.push('\r\n');
          };
          // Override XHR send()
          XMLHttpRequest.prototype.send = function (val) {
            var fr;
            var data;
            var oXHR = this;
            if (val === o) {
              // Append the final boundary string
              parts.push('--' + boundary + '--\r\n');
              // Create the blob
              data = getBlob(parts);
              // Set up and read the blob into an array to be sent
              fr = new FileReader();
              fr.onload = function () {
                oldSend.call(oXHR, fr.result);
              };
              fr.onerror = function (err) {
                throw err;
              };
              fr.readAsArrayBuffer(data);
              // Set the multipart content type and boudary
              this.setRequestHeader('Content-Type', 'multipart/form-data; boundary=' + boundary);
              XMLHttpRequest.prototype.send = oldSend;
            } else {
              oldSend.call(this, val);
            }
          };
        }
      },
      submitReal: function () {
        if (this.state === 1 || this.state === 3) {
          var imgs = document.querySelectorAll('.upload-section img');
          this.realImg = [];
          for (var x = 0; x < imgs.length; x++) {
            this.realImg.push(imgs[x].getAttribute('src'));
          }
          this.realledalize();
        } else if (this.state === 0) {
          this.realledalize();
        }
      },
      realledalize: function () {
        if (this.name && this.icard && this.realImg) {
          var token = localStorage.getItem('token');
          var realData = JSON.stringify({
            'data': [{
              'realName': this.name,
              'idCard': this.icard,
              'imageList': this.realImg
            }],
            'controllerName': 'userAuth',
            'actionName': 'insert'
          });
          this.$http.post(config.request_url, realData, headers(token)).then((res) => {
            if (res.body.data.result === true) {
              this.$router.push('/personalInfo');
            } else {
              this.$dialog.toast({mes: res.body.data.data});
              console.log(res.body.data.data);
            }
            console.log(res.body);
          });
        } else {
          this.$dialog.toast({mes: '信息填写不完整'});
        }
      },
      imgPreview: function (e, index) {
        let imgs = this.imgs;
        let file = e.target;
        var objUrl = getObjectURL(file.files[0]);
        if (objUrl) {
          imgs[index].data = objUrl;
          console.log(objUrl);
        }

        function getObjectURL(file) {
          var url = null;
          if (window.createObjectURL !== undefined) { // basic
            url = window.createObjectURL(file);
          } else if (window.URL !== undefined) { // mozilla(firefox)
            url = window.URL.createObjectURL(file);
          } else if (window.webkitURL !== undefined) { // webkit or chrome
            url = window.webkitURL.createObjectURL(file);
          }
          return url;
        }
      },
      checkStr(str) {
        var re1 = new RegExp('^([\u4E00-\uFA29]|[\uE7C7-\uE7F3])*$');
        if (!re1.test(str)) {
          this.$dialog.toast({mes: '真实名字应为汉字'});
          return false;
        }
        return true;
      },
      isCardID(sId) {
        var aCity = {
          11: '北京',
          12: '天津',
          13: '河北',
          14: '山西',
          15: '内蒙古',
          21: '辽宁',
          22: '吉林',
          23: '黑龙江',
          31: '上海',
          32: '江苏',
          33: '浙江',
          34: '安徽',
          35: '福建',
          36: '江西',
          37: '山东',
          41: '河南',
          42: '湖北',
          43: '湖南',
          44: '广东',
          45: '广西',
          46: '海南',
          50: '重庆',
          51: '四川',
          52: '贵州',
          53: '云南',
          54: '西藏',
          61: '陕西',
          62: '甘肃',
          63: '青海',
          64: '宁夏',
          65: '新疆',
          71: '台湾',
          81: '香港',
          82: '澳门',
          91: '国外'
        };
        var iSum = 0;
        if (!/^\d{17}(\d|x)$/i.test(sId)) return this.$dialog.toast({mes: '你输入的身份证长度或格式错误'});
        sId = sId.replace(/x$/i, 'a');
        if (aCity[parseInt(sId.substr(0, 2))] === null) return this.$dialog.toast({mes: '你的身份证地区非法'});
        let sBirthday = sId.substr(6, 4) + '-' + Number(sId.substr(10, 2)) + '-' + Number(sId.substr(12, 2));
        var d = new Date(sBirthday.replace(/-/g, '/'));
        if (sBirthday !== (d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate())) {
          return this.$dialog.toast({mes: '身份证上的出生日期非法'});
        }
        for (var i = 17; i >= 0; i--) iSum += (Math.pow(2, i) % 11) * parseInt(sId.charAt(17 - i), 11);
        if (iSum % 11 !== 1) return this.$dialog.toast({mes: '你输入的身份证号非法'});
        // aCity[parseInt(sId.substr(0,2))]+","+sBirthday+","+(sId.substr(16,1)%2?"男":"女");//此次还可以判断出输入的身份证号的人性别
        return true;
      },
      _initScroll: function () {
        this.realScroll = new BScroll(this.$refs.realWrapper, {
          click: true
        });
      }
    },
    components: {
      Vheader
    }
  };
</script>

<style>
  @import "../../common/stylus/header.css";
  @import "../../common/stylus/public.css";

  /*表单*/
  /*公共样式*/

  /*上传证件照片*/
  .zj-upload {
    width: 100%;
    margin-top: 9px;
  }

  .zj-upload .upload-title {
    height: 36px;
    width: 100%;
    padding-left: 20px;
    line-height: 36px;
    font-size: 15px;
    color: #313131;
    box-sizing: border-box;
    background-color: #ffffff;
  }

  .zj-upload .upload-content {
    width: 100%;
    /*height: 201px;*/
    display: flex;
    padding: 4px 7px;
    box-sizing: border-box;
    margin-top: 4px;
    background-color: #ffffff;
  }

  /*.upload-content .upload-img {*/
  /*width: 100%;*/
  /*height: 103px;*/
  /*text-align: center;*/
  /*display: flex;*/
  /*}*/

  /*.img-section {*/
  /*flex: 1;*/
  /*text-align: center;*/
  /*}*/

  /*.img-section img {*/
  /*width: 100%;*/
  /*height: 103px;*/
  /*}*/

  /*.upload-name {*/
  /*width: 100%;*/
  /*display: flex;*/
  /*}*/

  /*.upload-btn {*/
  /*flex: 1;*/
  /*text-align: center;*/
  /*}*/

  /*.upload-btn p {*/
  /*line-height: 30px;*/
  /*}*/

  /*.upload-btn .btn-upload {*/
  /*position: relative;*/
  /*width: 90%;*/
  /*padding: 5px 0;*/
  /*text-align: center;*/
  /*font-size: 15px;*/
  /*color: #ffffff;*/
  /*background-color: #03dcef;*/
  /*border-radius: 5px;*/
  /*margin: auto;*/
  /*}*/

  /*.upload-btn .btn-upload input[type=file] {*/
  /*position: absolute;*/
  /*top: 0;*/
  /*left: 0;*/
  /*z-index: 3;*/
  /*opacity: 0;*/
  /*width: 100%;*/
  /*height: 25px;*/
  /*}*/

  .zj-upload .upload-section {
    flex: 1;
    text-align: center;
  }

  .zj-upload .upload-section:not(:nth-child(3)) {
    margin-right: 8px;
    box-sizing: border-box;
  }

  .zj-upload .img-preview {
    width: 100%;
    height: 103px;
    text-align: center;
  }

  .zj-upload .img-preview img {
    width: 100%;
    height: 103px;
  }

  .zj-upload .upload-text {
    font-size: 15px;
    color: #6a6a6a;
    padding: 15px 0 16px 0;
    box-sizing: border-box;
  }

  .zj-upload .btn-upload {
    position: relative;
    width: 90%;
    padding: 5px 0;
    text-align: center;
    font-size: 15px;
    color: #ffffff;
    background-color: #03dcef;
    border-radius: 5px;
    margin: auto;
  }

  .zj-upload .btn-upload input[type=file] {
    position: absolute;
    top: 0;
    left: 0;
    z-index: 3;
    opacity: 0;
    width: 100%;
    height: 25px;
  }

  .Remarks {
    width: 100%;
    height: 92px;
    padding: 5px 15px;
    margin-top: 4px;
    background-color: #ffffff;
    font-size: 13px;
    color: #5c5c5c;
    line-height: 20px;
    box-sizing: border-box;
  }

  .Remarks .zhu {
    font-size: 14px;
    color: #313131;
  }

</style>
