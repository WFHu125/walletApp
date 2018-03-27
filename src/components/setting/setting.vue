<template>
  <div>
    <Vheader title="设置"></Vheader>
    <div class="setting-container" ref="Wrapper">
      <div class="setting-wrapper">
        <div class="setting-info">
          <div class="s-tr">
            <div class="icon-label especially">
              头像
            </div>
            <div class="icon-img"><input type="file" class="avatar-file" accept="image/*"
                                         @change="uploadImg($event)"><img :src="avatar"></div>
            <div class="pull-right"><span class="iconfont icon-right"></span></div>
          </div>
          <router-link to="/updateNick" class="s-tr">
            <div class="icon-label">修改昵称</div>
            <div class="info">{{nick}}</div>
            <div class="pull-right"><span class="iconfont icon-right"></span></div>
          </router-link>
          <router-link to="/updatePassword" class="s-tr">
            <div class="icon-label">修改密码</div>
            <div class="pull-right"><span class="iconfont icon-right"></span></div>
          </router-link>
          <router-link to="/updateNumber" class="s-tr">
            <div class="icon-label">修改绑定手机</div>
            <div class="info">{{mobile}}</div>
            <div class="pull-right"><span class="iconfont icon-right"></span></div>
          </router-link>
          <router-link to="/feedback" class="s-tr">
            <div class="icon-label">意见反馈</div>
            <div class="pull-right"><span class="iconfont icon-right"></span></div>
          </router-link>
        </div>
        <div class="btn-container margin100">
          <div class="btn btn-orange" @click="quitLogin">退出登录</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import Vheader from '../header/childHeader.vue';
  import BScroll from 'better-scroll';
  import {config, headers, unHeaders} from '../../common/js/config';
  export default {
    data() {
      return {
        avatar: '',
        nick: '',
        mobile: ''
      };
    },
    created() {
      var token = localStorage.getItem('token');
      var _this = this;
      this.$root.tokenValidat(token, function (data) {
        if (data) {
          _this.initSetting();
        } else {
          _this.$router.push('/login');
        }
      });
    },
    methods: {
      initSetting: function () {
        let userInfo = JSON.parse(localStorage.getItem('user'));
        this.avatar = userInfo.avatar;
        this.nick = userInfo.nick;
        this.mobile = userInfo.mobile;
        this.$nextTick(() => {
          this._initScroll();
        });
      },
      uploadImg: function (e) {
        var _this = this;
        //    用于压缩图片的canvas
        var canvas = document.createElement('canvas');
        var ctx = canvas.getContext('2d');
        //    瓦片canvas
        var tCanvas = document.createElement('canvas');
        var tctx = tCanvas.getContext('2d');
        var maxsize = 100 * 1024;
        var files = Array.prototype.slice.call(e.target.files);
        for (let i = 0; i < files.length; i++) {
          if (!/\/(?:jpeg|png|gif)/i.test(files[i].type)) return;
          var reader = new FileReader();
          reader.onload = function () {
            var result = this.result;
            var img = new Image();
            img.src = result;
            this.avatar = result;
            // 如果图片大小小于100kb，则直接上传
            if (result.length <= maxsize) {
              img = null;
              upload(result, files[i].type, _this);
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
              upload(data, files[i].type, _this);
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

        function upload(basestr, type, s) {
          var token = localStorage.getItem('token');
          var text = window.atob(basestr.split(',')[1]);
          var buffer = new Uint8Array(text.length);
//          var pecent = 0, loop = null;
          for (var i = 0; i < text.length; i++) {
            buffer[i] = text.charCodeAt(i);
          }
          var blob = getBlob([buffer], type);
          var formdata = getFormData();
          formdata.append('files', blob);
          s.$http.post(config.img_url, formdata, unHeaders).then((res) => {
            console.log('上传图片返回数据' + JSON.stringify(res.body));
            if (res.body.data.result === true) {
              s.avatar = res.body.data.path[0];
              console.log(res.body.data.path[0]);
              var imgData = JSON.stringify({
                'data': [{'avatar': s.avatar}],
                'controllerName': 'userInfo',
                'actionName': 'update'
              });
              // 修改头像接口
              s.$http.post(config.request_url, imgData, headers(token)).then((res) => {
                console.log(res.body);
                if (res.body.data.result === true) {
                  var user = localStorage.getItem('user');
                  user = JSON.parse(user);
                  user.avatar = s.avatar;
                  localStorage.setItem('user', JSON.stringify(user));
                }
              });
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
//      uploadImg: function (e) {
//        var format = new FormData();
//        var files = e.target.files;
//        for (let i = 0; i < files.length; i++) {
//          format.append('files', files[i]);
//        }
//        var token = localStorage.getItem('token');
//        this.$http.post(config.img_url, format, unHeaders).then((res) => {
//          console.log('上传图片返回数据' + JSON.stringify(res.body));
//          if (res.body.data.result === true) {
//            this.avatar = res.body.data.path[0];
//            var imgData = JSON.stringify({
//              'data': [{'avatar': this.avatar}],
//              'controllerName': 'userInfo',
//              'actionName': 'update'
//            });
//            // 修改头像接口
//            this.$http.post(config.request_url, imgData, headers(token)).then((res) => {
//              console.log(res.body);
//              if (res.body.data.result === true) {
//                var user = localStorage.getItem('user');
//                user = JSON.parse(user);
//                user.avatar = this.avatar;
//                localStorage.setItem('user', JSON.stringify(user));
//              }
//            });
//          }
//        });
//      },
      quitLogin: function () {
        localStorage.removeItem('token');
        this.$router.push('/');
      },
      _initScroll: function () {
        this.setScroll = new BScroll(this.$refs.Wrapper, {
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

  .setting-info {
    width: 100%;
  }

  .setting-info .s-tr {
    display: block;
    width: 100%;
    position: relative;
    height: 46px;
    background-color: #ffffff;
    margin-bottom: 1px;
  }

  .setting-info .icon-img .avatar-file {
    -webkit-appearance: none;
    position: absolute;
    display: block;
    height: 46px;
    width: 100%;
    z-index: 3;
    opacity: 0;
  }

  .setting-info .s-tr .icon-label {
    position: absolute;
    left: 10px;
    line-height: 46px;
    padding-left: 7.5px;
    font-size: 14px;
    color: #313131;
    box-sizing: border-box;
  }

  .setting-info .icon-label.especially {
    width: 30%;
  }

  .setting-info .s-tr .icon-img {
    position: absolute;
    right: 47px;
    box-sizing: border-box;
  }

  .setting-info .s-tr .icon-img img {
    width: 34px;
    height: 34px;
    margin-top: 6px;
    border-radius: 100%;
  }

  .setting-info .s-tr .info {
    line-height: 46px;
    position: absolute;
    right: 47px;
    font-size: 13px;
    color: #313131;
    box-sizing: border-box;
  }

  .setting-info .s-tr .pull-right {
    position: absolute;
    right: 15px;
    top: 12px;
  }

</style>
