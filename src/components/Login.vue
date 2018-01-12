<template>
  <div class="hello">
     <div class="login_area">
      <div class="login_left">
        <p>北京学为教育集团OA系统</p>
        <div class="login_img">
          <img src="/static/img/login_img.png"/>
        </div>
      </div>
      <div class="login_right">
        <div class="login_form">
          <p class="tit">用户登录</p>

          <div class="yz_div">
              <div class="login_user">
                <label></label>
                <input placeholder="请输入用户名" maxlength="15" v-model="loginData.userName"/>  
              </div>
              <div class="yz_div_word" v-if="validata.userVali">{{ validata.userValiWord }}</div>
          </div>

          <div class="yz_div">
            <div class="login_pwd">
              <label></label>
              <input placeholder="请输入密码" type="password" maxlength="16" v-model="loginData.passWord"/>
            </div>
            <div class="yz_div_word" v-if="validata.passVali">{{ validata.passValiWord }}</div>
          </div>
          <div class="login_btn">
            <span class="btn-blue" v-on:click="loginSub">登录</span>
          </div>
          <div style="margin-top:20px;color:red;font-size:13px;">注意：请您使用Chrome、360或搜狗浏览器操作OA系统</div>
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
    name: 'Login',
    components: {
      'oa-alert': oaAlert
    },
    data () {
      return {
        loginData: {
          userName: '',
          passWord: ''
        },
        validata: {
          userVali: false,
          userValiWord: '',
          passVali: false,
          passValiWord: ''
        },
        path: this.OACommon["publicDef"]["qpath"],
        canLoginPause: true
      }
    },
    created: function () {
      //回车登录
      $("body").keyup(function(event){
        if(event.which == 13){
            this.loginSub();
        }
      }.bind(this));
    },
    methods: {
      loginSub: function(){
        this.loginData.userName = this.loginData.userName.replace(/^\s\s*/, '').replace(/\s\s*$/, '');
        this.loginData.passWord = this.loginData.passWord.replace(/^\s\s*/, '').replace(/\s\s*$/, '')
        
        if(!this.loginData.userName){
          this.validata.userVali = true;
          this.validata.userValiWord = '请输入用户名';
          return false;
        }
        this.validata.userVali = false;
        this.validata.userValiWord = '';

        if(!this.loginData.passWord){
          this.validata.passVali = true;
          this.validata.passValiWord = '请输入密码';
          return false;
        }
        this.validata.passVali = false;
        this.validata.passValiWord = '';

        //阻止多次胡乱点击
        if(!this.canLoginPause){
          return false;
        }
        this.canLoginPause = false;

        $.ajax({
            url: this.path + "login",
            type: 'post',
            dataType: 'json',
            data: this.loginData,
            success: function(data){
              if(data["code"] == 200){
                this.OACommon.setCookie("userId", data["data"]["userId"], 1000*60*60*8);
                localStorage.setItem("jobNumber", data["data"]["jobNumber"]);
                localStorage.setItem("sessionIdOa", data["data"]["sessionIdOa"]);
                localStorage.setItem("userName", data["data"]["userName"]);
                this.$router.push('/mainIndex/index');
                var leftPermissionList = data["data"]["leftPermissionList"]; 
                localStorage.setItem("leftPermissionList", JSON.stringify(leftPermissionList));
                //存储页面功能数据
                var buttonPermissionList = data["data"]["buttonPermissionList"]; 
                localStorage.setItem("buttonPermissionList", JSON.stringify(buttonPermissionList));
                //存储职位和可用额度
                var positionList = data["data"]["positionList"]; 
                localStorage.setItem("positionList", JSON.stringify(positionList));
                var positionListTwo = data["data"]["positionListTwo"];
                localStorage.setItem("positionListTwo", JSON.stringify(positionListTwo));
                //存储所属部门名称
                var dept = data["data"]["dept"];
                localStorage.setItem("deptName", dept["deptName"]);
                localStorage.setItem("deptId", dept["deptId"]);
              }else{
                this.$refs.childAlert.show(data["msg"], this.alertBackFn);
                this.canLoginPause = true;
              }
            }.bind(this),
            error: function(err){
              console.log("登录异常");
            }
        })
      }, 
      alertBackFn: function(){
        //存放alert回调函数
      }
    }
  }
</script>


