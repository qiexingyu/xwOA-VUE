<template>
  <div class="hello">
      <div class="bgpop" v-if="passShow" style="z-index:11100;"></div>
      <div class="com_div" v-if="passShow" style="width:464px;height:286px;">
        <div class="com_tit">修改密码<span class="com_close" v-on:click="hide"></span></div>
        <div class="com_bg" style="width:100%;height:246px;">
          <div style="position:relative;top:20px;">
            <label style="display:inline-block;width:90px;margin-left:62px;text-align:right;">原密码：</label>
            <input type="password" placeholder="密码长度6~16位" v-model="oldPass">
          </div>
          <div style="position:relative;top:40px;">
            <label style="display:inline-block;width:90px;margin-left:62px;text-align:right;">新密码：</label>
            <input type="password" placeholder="密码长度6~16位" v-model="newPass1">
          </div>
          <div style="position:relative;top:60px;">
            <label style="display:inline-block;width:90px;margin-left:62px;text-align:right;">重复密码：</label>
            <input type="password" placeholder="密码长度6~16位" v-model="newPass2">
          </div>
          <div style="text-align:center;margin-top:68px;color:red;height:22px;">{{ errTip }}</div>
          <div class="com_btn" style="margin-top:13px;">
            <span class="btn-blue-s" v-on:click="subUpdatePass">确定</span>
            <span class="btn-yellow-s" v-on:click="hide">取消</span>
          </div>
        </div>
      </div>

      <oa-alert ref="childAlert"></oa-alert>
  </div>
</template>

<script>
import $ from 'jquery'
import oaAlert from '@/components/commonVue/Alert'

export default {
  name: 'UpdatePass',
  components: {
      'oa-alert': oaAlert
    },
  data () {
    return {
      path: this.OACommon["publicDef"]["qpath"],
      passShow: false,
      oldPass: '',
      newPass1: '',
      newPass2: '',
      errTip: ''
    }
  },
  methods: {
    subUpdatePass: function(){
      if(this.oldPass.length<6 || this.oldPass.length>16){
        this.errTip = "原密码长度应该是6~16位";
        return false;
      }
      if(this.newPass1.length<6 || this.newPass1.length>16){
        this.errTip = "新密码长度应该是6~16位";
        return false;
      }
      if(this.newPass2.length<6 || this.newPass2.length>16){
        this.errTip = "重复密码长度应该是6~16位";
        return false;
      }
      if(this.newPass1 != this.newPass2){
        this.errTip = "输入两次新密码不一致";
        return false;
      }

      this.errTip = "";

      $.ajax({
        url: this.path + "updateUsersPwdByUserIdAndOldPwd",
        type: "post",
        dataType: "json",
        data: {
          "jobNumber": localStorage.getItem("jobNumber"),
          "sessionIdOa": localStorage.getItem("sessionIdOa"),
          "oldPwd": this.oldPass,
          "newPwd": this.newPass1
        },
        success: function(data){
          if(data["code"] == 200){
            this.passShow = false;
            this.$refs.childAlert.show("修改成功，请重新登录", function(){
              this.$router.push('/');
            });
          }else{
            this.errTip = data["msg"];
          }
        }.bind(this),
        error: function(){
          console.log("修改密码异常");
        }
      });
    },
    show: function(){
      this.passShow = true;
    },
    hide: function(){
      this.errTip = "";
      this.passShow = false;
    }
  }
}
</script>


