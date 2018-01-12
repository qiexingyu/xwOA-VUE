<template>
  <div class="charts">
      <div class="gonggao_bread">
        <a href="#/mainIndex/index" class="fa">首页</a>
        &gt;
        <span>统计管理</span>
        &gt;
        <span>个人费用统计</span>
      </div>

      <div class="search_div yydo">
        <label>选择日期：</label>

        <el-date-picker
          v-model="startTimeString"
          type="month"
          format="yyyy-MM"
          value-format="yyyy-MM"
          placeholder="选择月">
        </el-date-picker>
       

        <span class="btn-blue-s sear_btn" v-on:click="seacherCost">查询</span>
      </div>

      <div class="gonggao_body table_body" style="text-align: center;">

             <div class="baoxiao" style="width: 100%;text-align: center;padding: 20px 10px" >
                  <span style="font-size: 25px;font-weight: 700">{{ dateTime }}{{ costCategory }}统计情况</span>
             </div>
             <div class="baoxiao" >
                  <span v-if="chat_fytj_person" class="tcqy" v-bind:class="check" v-on:click="grtc">个人统筹费用</span><span v-if="chat_fytj_area" class="tcqy" v-bind:class="checked" v-on:click="grqy">区域费用</span><span v-if="chat_fytj_person" class="tcqy" v-bind:class="chec" v-on:click="kkfy">开课费用</span>
             </div>

             <div class="baoxiao grtcqk" style="width: 100%;text-align: center;padding: 20px 10px" >
               <ul>
                 <li v-bind:class="[allcolor]" style="overflow: hidden;zoom: 1" v-on:click="liChange(-1,0)">
                     <div style="float: left;width: 30%;margin-top: 10px">
                         <span style="display: inline-block;width: 90%;margin: 0 auto;"><img style="width: 100%" src="/static/img/all.png"/></span>
                     </div>
                     
                     <div style="float: right;width: 70%">
                         <span>全部</span>
                          </br>
                         <span style="font-size: 22px" v-bind:title="allMoney.toFixed(2)">{{ allMoney.toFixed(2) }}</span>
                     </div>
                 </li>
                 
                 <li  v-bind:class="[liColor[k].check]" style="overflow: hidden;zoom: 1" v-on:click="liChange(k,list.costTypeId,list.costTypeName)" v-for="(list,k) in fyList">
                     
                     <div style="float: left;width: 30%;margin-top: 10px">
                         <span v-if="list.costTypeId==1" style="display: inline-block;width: 90%;margin: 0 auto;"><img style="width: 100%" src="/static/img/jtf.png"/></span>
                         <span v-if="list.costTypeId==2" style="display: inline-block;width: 90%;margin: 0 auto;"><img style="width: 100%" src="/static/img/clf.png"/></span>
                         <span v-if="list.costTypeId==3" style="display: inline-block;width: 90%;margin: 0 auto;"><img style="width: 100%" src="/static/img/zdf.png"/></span>
                         <span v-if="list.costTypeId==4" style="display: inline-block;width: 90%;margin: 0 auto;"><img style="width: 100%" src="/static/img/lpf.png"/></span>
                         <span v-if="list.costTypeId==5" style="display: inline-block;width: 90%;margin: 0 auto;"><img style="width: 100%" src="/static/img/cyf.png"/></span>
                         <span v-if="list.costTypeId==6" style="display: inline-block;width: 90%;margin: 0 auto;"><img style="width: 100%" src="/static/img/zsf.png"/></span>
                         <span v-if="list.costTypeId==7" style="display: inline-block;width: 90%;margin: 0 auto;"><img style="width: 100%" src="/static/img/qt.png"/></span>
                     </div>
                     <div style="float: right;width: 70%">
                         <span>{{ list.costTypeName }}</span>
                         </br>
                         <span style="font-size: 25px" v-bind:title="list.money.toFixed(2)">{{ list.money.toFixed(2) }}</span>
                     </div>
                 
                 </li>
                                               
               </ul>
             </div>
             <div class="baoxiao" style="width: 100%;text-align: left;padding: 20px 40px;font-size: 20px;font-weight: 700" >
                   {{ costTypeName }}明细
             </div>


              <div class="data_table_head" style="padding-left:40px;padding-right:40px">
                <ul>
                  <li class="td10 xh">时间</li>
                  <li class="td10">省份</li>
                  <li class="td16">学校</li>
                  <li class="td13">申请额度</li>
                  <li class="td16">用途</li>
                  <li class="td10">核销额度</li>
                  <li class="td19">备注</li>
                </ul>
              </div>
              <div v-if="peopleDetail.length != 0" class="data_table_body" style="text-align: center;padding-bottom: 100px;padding-left:40px;padding-right:40px">
                <ul v-for="(peoList, i) in peopleDetail">
                  <li class="td10">{{ peoList.spendTimeString }}</li>
                  <li class="td10">{{ peoList.provinceName }}</li>
                  <li class="td16">
                      <span v-for="school in peoList.costDetailCustomerVos">{{ school.customerName }}</span>
                  </li>
                  <li class="td13">{{ peoList.quota }}</li>
                  <li class="td16">{{ peoList.quotaPurpose }}</li>
                  <li class="td10">{{ peoList.actualCostCfoMoney }}</li>
                  <li class="td19">{{ peoList.remark }}</li>
                </ul>
              </div>

              <div v-if="peopleDetail.length == 0" class="data_table_body" style="text-align: center;font-size: 25px;color: #FF6666;line-height: 100px">
                   暂无明细
              </div>
      
      </div>

      <oa-alert ref="childAlert"></oa-alert>

    
  </div>
</template>

<style>
      .grtcqk ul {
        border: 0 none;
        width: 100%;
      }
      .grtcqk li {
            width: 20%;
            height: 80px;
            line-height: 40px;
            float: left;
            margin: 10px 2%;
            border: 1px solid #cecece;
            cursor: pointer;
      }
      .grtcqk li:hover {
        border: 1px solid #00a1e9;
        color: #00a1e9;
      }
      .grtcqk li.check {
        border: 1px solid #00a1e9;
        color: #00a1e9;
      }
      .tcqy {
        display: inline-block;
        width: 100px;
        height: 30px;
        line-height: 30px;
        text-align: center;
        border: 1px solid #cecece;
        margin: 0;
        padding: 0;
        cursor: pointer;
      }
      .tcqy.check {
        border: 1px solid #00a1e9;
        color: #00a1e9;
      }
      .tcqy.checked {
        border: 1px solid #00a1e9;
        color: #00a1e9;
      }
      .tcqy.chec {
        border: 1px solid #00a1e9;
        color: #00a1e9;
      }
      
    
</style>



<script>
import $ from 'jquery'
var echarts = require('echarts')
import oaAlert from '@/components/commonVue/Alert'
export default {
  name: 'ProgressSearch',
  components: {
      'oa-alert': oaAlert
    },
  data () {
    return {
      path: this.OACommon["publicDef"]["qpath"],
      allMoney: 0,
      dateTime: '',
      check: 'check',
      checked: '',
      chec: '',
      qy: false,
      gr: false,
      startTimeString: '',
      endTimeString: '',  
      costTypeName: '费用',
      costCategory: '个人统筹',   
      costCategoryId: '1',   
      index:'0',   
      allcolor:'check',
      liColor: [
        {"check": ""},
        {"check": ""},
        {"check": ""},
        {"check": ""},
        {"check": ""},
        {"check": ""},
        {"check": ""},
        {"check": ""}
      ],
      fyList: [
          {
            costTypeName: '交通费',
            costTypeId: '1',                
            money: 0
          },
          {
            costTypeName: '差旅费',
            costTypeId: '2',
            money: 0
          },
          {
            costTypeName: '招待费',
            costTypeId: '3',
            money: 0
          },
          {
            costTypeName: '礼品费',
            costTypeId: '4',
            money: 0
          },
          {
            costTypeName: '餐饮费',
            costTypeId: '5',
            money: 0
          },
          {
            costTypeName: '住宿费',
            costTypeId: '6',
            money: 0
          },
          {
            costTypeName: '杂费',
            costTypeId: '7',
            money: 0
          }
      ],
      chat_fytj_person: false,      //个人统筹
      chat_fytj_area: false,   //区域
      peopleDetail: []
    }
  },
  created: function () {

         var buttonPermissionList = localStorage.getItem("buttonPermissionList");
         buttonPermissionList = JSON.parse(localStorage.getItem("buttonPermissionList"));        
         for(var i=0;i<buttonPermissionList.length;i++){
            if(buttonPermissionList[i]["permissionCode"] == "chat_fytj_area"){
               this.chat_fytj_area = true;
               this.costCategoryId = "3";
               this.costCategory = "区域费用";
               if(this.checked = "checked"){
                 this.check = "";
               }else{
                 this.check = "";
                 this.checked = "checked";
               }
               this.qy = true;
            }
            if(buttonPermissionList[i]["permissionCode"] == "chat_fytj_person"){
               this.chat_fytj_person = true;
               this.costCategoryId = "1";
               this.costCategory = "个人统筹费用";
               if(this.check = "check"){
                 this.checked = "";
               }else{
                 this.check = "check";
                 this.checked = "";
               }
               this.gr = true;
            }
         }
         if(this.qy && this.gr){
            this.costCategoryId = "1";
            this.costCategory = "个人统筹费用";
            if(this.check = "check"){
              this.checked = "";
            }else{
              this.check = "check";
              this.checked = "";
            }
         }
      
         this.dateTime = this.formatDate3(new Date());
         this.startTimeString = this.formatDate(new Date());
         this.getPeopleCost();
      
  },
  methods: {  
    getPeopleCost: function(){
      $.ajax({
      type : "post",
      url : this.path + "findUsersStaticNum",
      data : {
        "jobNumber": localStorage.getItem("jobNumber"),
        "sessionIdOa": localStorage.getItem("sessionIdOa"),
        "startTimeString": this.startTimeString,     
        "costCategory": this.costCategoryId     
      },
      success : function(data) {
        if(data.code == 200){
          if(!data["data"] || data["data"]==''){
            this.fyList = [
               {
                 costTypeName: '交通费',
                 costTypeId: '1',                
                 money: 0
               },
               {
                 costTypeName: '差旅费',
                 costTypeId: '2',
                 money: 0
               },
               {
                 costTypeName: '餐饮费',
                 costTypeId: '5',
                 money: 0
               },
               {
                 costTypeName: '招待费',
                 costTypeId: '3',
                 money: 0
               },
               {
                 costTypeName: '礼品费',
                 costTypeId: '4',
                 money: 0
               },
               {
                 costTypeName: '住宿费',
                 costTypeId: '6',
                 money: 0
               },
               {
                 costTypeName: '杂费',
                 costTypeId: '7',
                 money: 0
               }
            ];

          }else {
            for(var i=0;i<data["data"].length;i++){

              for(var j=0;j<this.fyList.length;j++){
                 if(data["data"][i]["costTypeId"] == this.fyList[j]["costTypeId"]){
                    this.fyList[j]["money"] = data["data"][i]["money"];
                 }

              }
            }
          }
          for(var i=0;i<this.fyList.length;i++){
            this.liColor.push({
              "check": ""
            })
          }
          var allMoney = 0;
          for(var i=0;i<data["data"].length;i++){
            allMoney +=data["data"][i].money;
          }
          this.allMoney = allMoney;
                   
        }else {
          this.$refs.childAlert.show(data["msg"]);
        }

      }.bind(this),
      error : function() {
      }
       });
    }, 
    getPeopleDetail: function(){
      this.startTimeString = this.formatDate4(new Date(this.startTimeString));
      $.ajax({
      type : "post",
      url : this.path + "findUserMyStaticByCostCategory",
      data : {
        "jobNumber": localStorage.getItem("jobNumber"),
        "sessionIdOa": localStorage.getItem("sessionIdOa"),
        "startTimeString": this.startTimeString,     
        "costTypeId": this.costTypeId,    
        "costCategory": this.costCategoryId    
      },
      success : function(data) {
        if(data.code == 200){
           this.peopleDetail = data.data; 
        }else {
          this.$refs.childAlert.show(data["msg"]);
        }

      }.bind(this),
      error : function() {
      }
       });
    }, 
    grtc: function(){   
        if(this.check = "check"){
          this.checked = "";
          this.chec = "";
        }else{
          this.check = "check";
          this.checked = "";
          this.chec = "";
        }
        this.costCategory = "个人统筹费用";
        this.costCategoryId = "1";
        this.getPeopleCost();
        this.getPeopleDetail();
    },
    grqy: function(){   
        if(this.checked = "checked"){
          this.check = "";
          this.chec = "";
        }else{
          this.check = "";
          this.checked = "checked";
          this.chec = "";
        }
        this.costCategory = "区域费用";
        this.costCategoryId = "3";
        this.getPeopleCost();
        this.getPeopleDetail();
    },
    kkfy: function(){
      if(this.chec = "checked"){
        this.checked = "";
        this.check = "";
      }else{
        this.check = "";
        this.chec = "checked";
        this.checked = "";
      }
      this.costCategory = "开课费用";
      this.costCategoryId = "4";
      this.getPeopleCost();
      this.getPeopleDetail();

    },
    colorChange: function(v){
      this.index = v;
      for(var i=0;i<this.colorChose.length;i++){
            if(v==i){
              this.colorChose[i].check = "check"
            }else{
              this.colorChose[i].check = ""
            }
      }
    },
    liChange: function(k,costTypeId,costTypeName){
      if(k==-1){
         this.allcolor = "check";
         this.costTypeName = "费用";
         this.costTypeId = costTypeId;
         for(var i=0;i<this.liColor.length;i++){
            this.liColor[i].check = ""
          }
          this.peopleDetail = [];
      }else{
         this.costTypeId = costTypeId;
         this.costTypeName = costTypeName;
         this.allcolor = "";
         for(var i=0;i<this.liColor.length;i++){
             if(k==i){
               this.liColor[i].check = "check"
             }else{
               this.liColor[i].check = ""
             }
         }
         this.getPeopleDetail();
      }
    },    
    closePop: function(){
      this.isShowCover = false;
      this.isShowDetail = false;
    },
    formatDate: function(date){
       var y = date.getFullYear();  
       //var m = date.getMonth();  
       var m = date.getMonth() + 1;  
       m = m < 10 ? '0' + m : m;  
       var d = date.getDate();  
       d = d < 10 ? ('0' + d) : d;  
       return y + '-' + m + '-' + '01';
    },
    formatDate4: function(date){
       var y = date.getFullYear();  
       //var m = date.getMonth() + 1;  
       var m = date.getMonth() + 1;  
       m = m < 10 ? '0' + m : m;  
       var d = date.getDate();  
       d = d < 10 ? ('0' + d) : d;  
       return y + '-' + m + '-' + '01';
    },
    formatDate2: function(date){
       var y = date.getFullYear();  
       var m = date.getMonth();  
       m = m < 10 ? '0' + m : m;  
       var d = date.getDate();  
       d = d < 10 ? ('0' + d) : d;  
       return y + '年' + m + '月';
    },
    formatDate3: function(date){
       var y = date.getFullYear();  
       var m = date.getMonth() + 1;  
       m = m < 10 ? '0' + m : m;  
       var d = date.getDate();  
       d = d < 10 ? ('0' + d) : d;  
       return y + '年' + m + '月';
    },
    seacherCost: function(){ 
      if(this.startTimeString.length != 10){
        this.startTimeString = this.startTimeString + '-01';
      }
      this.dateTime = this.formatDate3(new Date(this.startTimeString));
      this.getPeopleCost();
    }

    
  }
 
}
</script>
