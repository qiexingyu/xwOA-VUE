<template>
  <div class="hello">
    <div class="gonggao_bread">
        <a href="#/mainIndex/index" class="fa">首页</a>
        &gt;
        <span>课程安排管理</span>
        &gt;
        <span>场地申请</span>
      </div>
      <div class="gonggao_body">
        <div class="fbtong_div">
          <div class="form_eve">
            <label class="label_tit-2">区&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;域：</label>
            <select class="form_input-2" v-model="appData.areaId" v-on:change="areaChange">
              <option v-for="a in appData.area" v-bind:value="a.areaId">{{ a.areaName }}</option>
            </select>
            <label class="label_tit-2">省&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;份：</label>
            <select class="form_input-2" v-model="appData.provinceId">
              <option v-for="p in appData.province" v-bind:value="p.provinceId">{{ p.province }}</option>
            </select>
          </div>
          <div class="form_eve xspk">
            <label class="label_tit-2">时&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;间：</label>
            <el-date-picker
              v-model="appData.date"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              :picker-options="pickerOptions"
              end-placeholder="结束日期">
            </el-date-picker>
          </div>
          <div class="form_eve sc1">
            <label class="label_tit-2">地&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;点：</label>
            <input type="text" class="form_input-2" placeholder="请输入场地" v-model="appData.address" style="width:30%;">
          </div>
          <div class="form_eve">
            <label class="label_tit-2">场地标准：</label>
            <input type="text" class="form_input-2" placeholder="请输入场地标准" v-model="appData.addressBz">
            <label class="label_tit-2">人&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;数：</label>
            <input type="text" class="form_input-2" placeholder="请输入正整数" v-model="appData.people" v-on:blur="moneyKey1">
          </div>
          <div class="form_eve">
            <label class="label_tit-2">人均钱数标准：</label>
            <input type="text" class="form_input-2" placeholder="最多可输入2位小数" v-model="appData.moenyBz" v-on:blur="moneyKey2">
            <label class="label_tit-2">人均实收标准：</label>
            <input type="text" class="form_input-2" placeholder="最多可输入2位小数" v-model="appData.moenySjBz" v-on:blur="moneyKey3">
          </div>
          <div class="form_eve">
            <label class="label_tit-2">要&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;求：</label>
            <textarea class="form_input-5" maxlength="500" v-model="appData.require" placeholder="最多输入500个字"></textarea>
          </div>
          <div class="errTip">{{ errTip }}</div>
          <div class="fbtong_btn_div">
            <span class="btn-blue" v-on:click="subApply">提交</span>
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
  name: 'coursePlanApply',
  components: {
      'oa-alert': oaAlert
    },
  data () {
    return {
      path: this.OACommon["publicDef"]["qpath"],
      pickerOptions: {
        firstDayOfWeek: 1,
        disabledDate(time) {
            return time.getTime() < Date.now();
        }
      },
      appData: {
        area: [],
        areaId: 0,
        province: [{"areaId": "", "province": "--请选择--", "provinceCode": "", "provinceId": 0}],
        provinceId: 0,
        date: '',
        address: '',
        addressBz: '',
        people: '',
        moenyBz: '',
        moenySjBz: '',
        require: ''
      },
      errTip: '',
      subPause: true         //防止重复提交
    }  
  },
  created: function () {
    this.appData.area = this.OACommon.findAreaByCondition();
  },
  methods: {
    areaChange: function(){
      this.appData.province = this.OACommon.findProvinceList(this.appData.areaId);
    },
    subApply: function(){
      if(!this.appData.areaId){
        this.errTip = "请选择区域";
        return false;
      }
      if(!this.appData.provinceId){
        this.errTip = "请选择省份";
        return false;
      }
      if(!this.appData.date){
        this.errTip = "请选择时间段";
        return false;
      }
      if(!this.appData.address){
        this.errTip = "请输入地点";
        return false;
      }
      if(!this.appData.addressBz){
        this.errTip = "请输入场地标准";
        return false;
      }
      if(!this.appData.people){
        this.errTip = "请输入人数";
        return false;
      }
      if(!this.appData.moenyBz){
        this.errTip = "请输入人数钱数标准";
        return false;
      }
      if(!this.appData.moenySjBz){
        this.errTip = "请输入人均实收标准";
        return false;
      }
      if(!this.appData.require){
        this.errTip = "请输入要求";
        return false;
      }

      //防止重复提交
      if(!this.subPause){
        return false;
      }
      this.subPause = false;

      var startDate = this.OACommon.getOADate(new Date(this.appData.date[0])).todayDate;
      var endDate = this.OACommon.getOADate(new Date(this.appData.date[1])).todayDate;
      $.ajax({
        url: this.path + "insertPlaceApply",
        type: "post",
        dataType: "json",
        data: {
          "jobNumber": localStorage.getItem("jobNumber"),
          "sessionIdOa": localStorage.getItem("sessionIdOa"),
          "areaId": this.appData.areaId,
          "provinceId": this.appData.provinceId,
          "startDate": startDate,
          "endDate": endDate,
          "location": this.appData.address,
          "placeStandard": this.appData.addressBz,
          "peopleNumber": this.appData.people,
          "onePeopleStandard": this.appData.moenyBz,
          "onePeopleReality": this.appData.moenySjBz,
          "placeRequire": this.appData.require
        },
        success: function(data){
          if(data["code"] != 200){
            this.subPause = true;
            this.$refs.childAlert.show(data["msg"]);
          }else{
            this.$refs.childAlert.show("提交成功", function(){
              this.$router.push('/mainIndex/coursePlanApply/placeSearch');
            });
          }
        }.bind(this),
        error: function(){
          console.log("提交场地申请异常");
        }
      });
    },
    moneyKey1: function(){
      if(isNaN(this.appData.people) || Number(this.appData.people)%1!=0 || Number(this.appData.people)<=0 || this.appData.people.indexOf(".")!=-1){
        this.appData.people = "";
      }
    },
    moneyKey2: function(){
      var reg = /(^[0-9]*$)|(^[0-9]*[\.]{1}[0-9]{1,2}$)/;
      var edvalNum = 0;
      if(!reg.test(this.appData.moenyBz)){
        if(!isNaN(this.appData.moenyBz) && this.appData.moenyBz.indexOf(".")!=-1 && this.appData.moenyBz.split(".")[1].length>2){
          edvalNum = this.appData.moenyBz.split(".")[0] + "." + this.appData.moenyBz.split(".")[1].substring(0, 2);
          this.appData.moenyBz = Number(edvalNum).toFixed(2);
        }else{
          this.appData.moenyBz = "0.00";
        }
      }else{
        if(this.appData.moenyBz){
          this.appData.moenyBz = Number(this.appData.moenyBz).toFixed(2);
        }else{
          this.appData.moenyBz = "0.00";
        }
      }
    },
    moneyKey3: function(){
      var reg = /(^[0-9]*$)|(^[0-9]*[\.]{1}[0-9]{1,2}$)/;
      var edvalNum = 0;
      if(!reg.test(this.appData.moenySjBz)){
        if(!isNaN(this.appData.moenySjBz) && this.appData.moenySjBz.indexOf(".")!=-1 && this.appData.moenySjBz.split(".")[1].length>2){
          edvalNum = this.appData.moenySjBz.split(".")[0] + "." + this.appData.moenySjBz.split(".")[1].substring(0, 2);
          this.appData.moenySjBz = Number(edvalNum).toFixed(2);
        }else{
          this.appData.moenySjBz = "0.00";
        }
      }else{
        if(this.appData.moenySjBz){
          this.appData.moenySjBz = Number(this.appData.moenySjBz).toFixed(2);
        }else{
          this.appData.moenySjBz = "0.00";
        }
      }
    }
  }
}
</script>
<style>
  
</style>

