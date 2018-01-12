<template>
   
   <div class="roleManagement">
      <div class="gonggao_bread">
        <a href="#/mainIndex/index" class="fa">首页</a>
        &gt;
        <span>统计管理</span>
        &gt;
        <span>核销费用对比情况</span>
      </div>
      
      <div class="gonggao_body table_body" style="padding-top: 20px">

      
        <div class="baoxiao" style="width: 100%;text-align: center;padding: 20px 10px" >
             <span style="font-size: 25px;font-weight: 700">{{ dateTime }}核销费用对比情况</span>
             <span v-on:click="timeSeacher" style="display:inline-block;float:right;color: #00a1e9;cursor: pointer;margin-right: 50px">按时间查询</span>
        </div>

        <div class="money_table">
          <table cellpadding="0" cellspacing="0" border="1" style="text-align: center">
              <thead>
              <tr>
                <td width="25%">区域</td>
                <td width="25%" colSpan="2">省份</td>
                <td width="25%">费用申请</td>
                <td width="25%">增长</td>
              </tr>
              </thead>
              <tbody v-if="tableList.length!=0" v-for="(list,v) in tableList">
                  <tr>
                    <td v-bind:rowSpan="list.rowspan" v-on:click="getTableProvice(v,list.areaId)" style="cursor: pointer;">{{ list.areaName }} 
                        <span v-on:click="getTableProvice(v,list.areaId)">
                          <Icon v-if="list.check==1" style="color: #333333;font-size: 15px;margin-left: 5px;cursor: pointer" type="ios-arrow-up"></Icon>
                        </span>
                        <span>
                           <Icon v-if="list.check!=1" style="color: #333333;font-size: 15px;margin-left: 5px;cursor: pointer" type="ios-arrow-down"></Icon>
                        </span>
                    </td>
                    <td colSpan="2">区域总计</td>
                    <td v-on:click="showEcharts(list.areaId,list.provinceId)" style="cursor: pointer;color: #00a1e9;">{{ list.money }}</td>
                    <td>{{ list.areaPercentage }}%</td>                
                  </tr>
                  <tr v-for="(proList,k) in list.provinceList">
                    <td v-bind:rowSpan="proList.rowspan">{{ proList.provinceName }} 
                    </td>
                    <td>省份总计</td>
                    <td v-on:click="showEcharts(list.areaId,proList.provinceId)" style="cursor: pointer;color: #00a1e9;">{{ proList.money }}</td>
                    <td>{{ proList.areaPercentage }}%</td>  
                  </tr>

                  <tr v-for="(proList,k) in list.provinceList">
                    <td v-for="(useList,l) in proList.userList">{{ useList.userName }}</td>
                    <td v-for="(useList,l) in proList.userList">{{ useList.money }}</td>
                    <td v-for="(useList,l) in proList.userList">{{ useList.userPercent }}%</td>
                                   
                  </tr>
                  
              </tbody>

              <tbody v-if="tableList.length==0">
                  <tr>
                    <td colSpan="5" style="color:red;">暂无数据</td>
                  </tr>
              </tbody>
              
            </table>
        </div>
      </div>

      <div class="bgpop" v-if="isShowCover"></div>
      <div class="view_area" style="width: 500px;height: 300px;padding: 5px 20px" v-if="isShowDetail">

            <div class="baoxiao" style="width: 100%;text-align: center;padding: 20px 10px" >
                  <span style="font-size: 25px;font-weight: 700">按时间查询</span>
            </div>

            <div class="menEdit">
                 <span class="yearMonth" v-for="(color,v) in colorChose" v-bind:class="[color.check]" v-on:click="colorChange(v)">{{ color.checkName }}</span>
            </div>  

            <div v-if="index == 0" class="menEdit" style="margin-top: 20px">
                 <select style="margin-left: 30px" name="" v-model="yearChose" >
                      <option  value="">请选择</option>
                      <option v-for="yea in year"  v-bind:value="yea.yearName">{{ yea.yearName }}</option>
                 </select>
                 <span class="prompt">年</span>
                 <select style="margin-left: 10px" name="" v-model="monthChose" >
                      <option  value="">请选择</option>
                      <option v-for="mon in month"  v-bind:value="mon.monthName">{{ mon.monthName }}</option>
                 </select>
                 <span class="prompt">月</span>

                 <div class="view_btn" style="margin-top: 20px">
                      <span class="btn-blue-s" v-on:click="choseMonth">确定</span>
                      <span class="btn-yellow-s" v-on:click="closePop">取消</span>
                 </div>                                           
            </div> 

            <div v-if="index == 1" class="menEdit" style="margin-top: 20px">
                 <select style="margin-left: 30px" name="" v-model="yearChose" >
                      <option  value="">请选择</option>
                      <option v-for="yea in year"  v-bind:value="yea.yearName">{{ yea.yearName }}</option>
                 </select>
                 <span class="prompt">年</span>
                 <select style="margin-left: 10px" name="" v-model="quarterChose" >
                      <option  value="">请选择</option>
                      <option v-for="qua in quarter"  v-bind:value="qua.quarterName">{{ qua.quarterName }}</option>
                 </select>
                 <span class="prompt">季度</span>

                 <div class="view_btn" style="margin-top: 20px">
                      <span class="btn-blue-s" v-on:click="choseQuart">确定</span>
                      <span class="btn-yellow-s" v-on:click="closePop">取消</span>
                 </div>                                           
            </div>

            <div v-if="index == 2" class="menEdit" style="margin-top: 20px">
                 <select style="margin-left: 50px" name="" v-model="yearChose" >
                      <option  value="">请选择</option>
                      <option v-for="yea in year"  v-bind:value="yea.yearName">{{ yea.yearName }}</option>
                 </select>
                 <span class="prompt">年</span>
                 
                 <div class="view_btn" style="margin-top: 20px">
                      <span class="btn-blue-s" v-on:click="choseYear">确定</span>
                      <span class="btn-yellow-s" v-on:click="closePop">取消</span>
                 </div>                                           
            </div>                  
      </div>

      <div class="view_area" style="width: 800px;height: 500px;padding: 5px 20px" v-if="isShowEcharts">
            
             <div class="peoMen">
               <span class="closexx"  v-on:click="closeShowEchart"><Icon type="android-cancel"></Icon></span>
            </div>

             <div class="menEdit" style="float: left;width: 280px;padding-left: 10px;">
                    
                    <div class="baoxiao schoolfy" style="width: 80%;margin: 0 auto;text-align: center;padding: 10px 10px" >
                      <ul>
                        <li v-bind:class="[allcolor]" v-on:click="liChange(-1)">
                            
                            <div style="float: left;width: 50%;margin-top: 10px">
                                <span style="display: inline-block;width: 60px;height: 60px"><img style="width: 100%" src="/static/img/zhf.png"/></span>
                            </div>
                            <div style="float: right;width: 50%">
                                <span>总花费</span>
                                 </br>
                                <span>{{ allMoney.toFixed(2) }}元</span>
                            </div>


                        </li>
       
                        <li v-bind:class="[liColor[k].check]" v-on:click="liChange(k,list.costCategory)" v-for="(list,k) in fyList" v-if="list.chat_fytj_area">
                           
                            <div style="float: left;width: 50%;margin-top: 10px">
                                 <span v-if="list.costCategory==1" style="display: inline-block;width: 60px;height: 60px"><img style="width: 100%" src="/static/img/grtcf.png"/></span>
                                 <span v-if="list.costCategory==2" style="display: inline-block;width: 60px;height: 60px"><img style="width: 100%" src="/static/img/extra.png"/></span>
                                 <span v-if="list.costCategory==3" style="display: inline-block;width: 60px;height: 60px"><img style="width: 100%" src="/static/img/qyfy.png"/></span>
                                 <span v-if="list.costCategory==4" style="display: inline-block;width: 60px;height: 60px"><img style="width: 100%" src="/static/img/kk.png"/></span>
                             </div>
                             <div style="float: right;width: 50%">
                                 <span>{{ list.costCategoryName }}</span>
                                 </br>
                                 <span>{{ list.money.toFixed(2) }}元</span>
                             </div>

                        </li>                
                        
                      </ul>
                    </div>

              </div> 

              <div class="menEdit" style="float: right;width: 450px;">
                   <!--创建一个echarts的容器-->
                   <div id="myChart" style="width: 100%; height:400px;margin: 0 auto"></div>
              </div> 


      </div>
   
      <oa-alert ref="childAlert"></oa-alert>
      <oa-confirm ref="childConfirm"></oa-confirm>
      <oa-load ref="childLoading"></oa-load>

  </div>


</template>

<style>      
      .yearMonth {
        display: inline-block;
        width: 80px;
        height: 30px;
        line-height: 30px;
        border: 1px solid #cecece;
        border-radius: 5px;
        margin-left: 50px;
        text-align: center;
        cursor: pointer
      }
      .yearMonth.check {
        background-color: #00a1e9;
        color: #FFFFFF;
        border: 1px solid #00a1e9;
      }
      .schoolfy li {
            width: 90%;
            height: 80px;
            line-height: 40px;
            margin: 10px 2%;
            border: 1px solid #cecece;
            cursor: pointer;
      }
      .schoolfy li:hover {      
        border: 1px solid #cecece;
      }
      .schoolfy li.check {       
        border: 1px solid #00a1e9;
      }
    
</style>

<script>
  import $ from 'jquery'
  import oaAlert from '@/components/commonVue/Alert'
  import oaConfirm from '@/components/commonVue/Confirm'
  import Loading from '@/components/commonVue/Loading'
  var echarts = require('echarts')
    export default {
        name: 'PositionManagement',
        components: {
          'oa-alert': oaAlert,
          'oa-confirm': oaConfirm,
          'oa-load': Loading
        },
        data () {
            return {               
                path: this.OACommon["publicDef"]["qpath"],
                isShowCover: false,
                isShowDetail: false,
                yearChose: '',
                monthChose: '',
                quarterChose: '',
                index:'0',
                timeString: '',
                timeStringEnd: '',
                dateTime: '',
                colorChose: [
                   {
                    "checkName": "按月",
                    "check": "check"
                   },
                   {
                    "checkName": "按季",
                    "check": ""
                   },
                   {
                    "checkName": "按年",
                    "check": ""
                   }
                ],
                year: [
                    {"yearName": "2009"},
                    {"yearName": "2010"},
                    {"yearName": "2011"},
                    {"yearName": "2012"},
                    {"yearName": "2013"},
                    {"yearName": "2014"},
                    {"yearName": "2015"},
                    {"yearName": "2016"},
                    {"yearName": "2017"},
                    {"yearName": "2018"},
                    {"yearName": "2019"},
                    {"yearName": "2020"},
                    {"yearName": "2021"},
                    {"yearName": "2022"},
                    {"yearName": "2023"},
                    {"yearName": "2024"},
                    {"yearName": "2025"},
                    {"yearName": "2026"},
                    {"yearName": "2027"} 
                ],
                month: [
                    {"monthName": "1"},
                    {"monthName": "2"},
                    {"monthName": "3"},
                    {"monthName": "4"},
                    {"monthName": "5"},
                    {"monthName": "6"},
                    {"monthName": "7"},
                    {"monthName": "8"},
                    {"monthName": "9"},
                    {"monthName": "10"},
                    {"monthName": "11"},
                    {"monthName": "12"}          
                ],
                quarter:[
                    {"quarterName": "1"},
                    {"quarterName": "2"},
                    {"quarterName": "3"},
                    {"quarterName": "4"},
                ],
                tableList: [],     //区域遍历
                lastMonthArea: [], //区域上个月费用
                areaPercentage: [], //区域增长百分比
                proPercentage: [], //省份增长百分比
                userPercent: [], //人员增长百分比
                allMoney: 0,
                allcolor:'check',
                costCategory: '',
                provinceId: '',
                areaId: '',
                liColor: [
                  {"check": ""},
                  {"check": ""},
                  {"check": ""},
                  {"check": ""}
                ],
                fyList: [
                  {
                  costCategoryName: "个人统筹费",
                  costCategory:1,
                  chat_fytj_area: true, //是否有区域费用
                  money: 0
                 },
                 {
                  costCategoryName: "Extra",
                  costCategory:2,
                  chat_fytj_area: true, //是否有区域费用
                  money:0
                 },
                 {
                  costCategoryName: "区域费用",
                  costCategory:3,
                  chat_fytj_area: true, //是否有区域费用
                  money:0
                 },
                 {
                  costCategoryName: "开课费用",
                  costCategory:4,
                  chat_fytj_area: true, //是否有开课费用
                  money:0
                 }
                ]
                
             
            }
        },
        created: function(){
            this.dateTime = this.formatDate(new Date());
            this.userArea();

        },
        methods:{
            userArea: function(){  //初始化区域
              $.ajax({
                 type : "get",
                 url : this.path + "findCurrentUserAreaList",
                 data : {
                   "jobNumber": localStorage.getItem("jobNumber"),
                   "sessionIdOa": localStorage.getItem("sessionIdOa")         
                 },
                 success : function(data) {
                   if(data.code == 200){ 
                       if(data["data"].length == 1){
                           this.areaId = data.data[0].areaId;
                           this.getTableArea();
                       }else {
                           this.getTable();
                       }               
                   }else {
                      this.$refs.childAlert.show(data["msg"]);
                   }
           
                 }.bind(this),
                 error : function() {
                 }
              });
            },            
            getTable: function(){  //对比列表（全国前一个月）
                this.areaId = '';
                if(!this.timeString){
                  this.timeString = this.formatDate2(new Date()) +"01";
                }                             
                $.ajax({
                    type : "post",
                    async : false,
                    url : this.path + "selectCheckStaticTrendSum",
                    data : {
                      "jobNumber": localStorage.getItem("jobNumber"),
                      "sessionIdOa": localStorage.getItem("sessionIdOa"),
                      "timeString": this.timeString
                    },
                    success : function(data) {
                      if(data.code == 200){
                        for(var i=0;i<data.data.length;i++){
                            this.lastMonthArea.push(
                              data.data[i].money
                            )
                        }
                        this.getTableStart();
                      }else {
                        this.$refs.childAlert.show(data["msg"]);
                      }
                                              
                    }.bind(this),
                    error : function() {
                    }
                });
            },
            getTableStart: function(){  //对比列表（全国）
                this.areaId = '';
                if(!this.timeStringEnd){
                  this.timeStringEnd = this.formatDate1(new Date()) +"01";
                }              
                $.ajax({
                    type : "post",
                    async : false,
                    url : this.path + "selectCheckStaticTrendSum",
                    data : {
                      "jobNumber": localStorage.getItem("jobNumber"),
                      "sessionIdOa": localStorage.getItem("sessionIdOa"),
                      "timeString": this.timeStringEnd
                    },
                    success : function(data) {
                      if(data.code == 200){
                        this.areaPercentage = [];
                        for(var i=0;i<data.data.length;i++){                        
                            var thisMoney = data.data[i]["money"]
                            for(var j=0;j<this.lastMonthArea.length;j++){
                            } 
                            var percentage = (thisMoney - this.lastMonthArea[i])/this.lastMonthArea[i];
                            if(isNaN(percentage)){
                               percentage = 0;
                            }
                            percentage = (percentage*100).toFixed(2)
                            this.areaPercentage.push(percentage); 
                        }
                        this.tableList =[];
                        for(var i=0;i<data["data"].length;i++){
                            this.tableList.push({
                                  "areaName": data["data"][i].areaName,
                                  "money": data["data"][i].money,
                                  "areaPercentage": this.areaPercentage[i],
                                  "areaId": data["data"][i].areaId,
                                  "check": "",
                                  "rowspan":"1",
                                  "provinceList": [],   //省份遍历
                                  "lastMonthPro": [],   //省份上个月费用
                                  "proPercentage": []  //省份增长百分比                    
                            })
                        }
                      }else {
                        this.$refs.childAlert.show(data["msg"]);
                      }
                                                               
                    }.bind(this),
                    error : function() {
                    }
                });
            },
            getTableArea: function(){  //对比列表（区域前一个月）
                if(!this.timeString){
                  this.timeString = this.formatDate2(new Date()) +"01";
                }                             
                $.ajax({
                    type : "post",
                    async : false,
                    url : this.path + "selectCheckStaticTrendSum",
                    data : {
                      "jobNumber": localStorage.getItem("jobNumber"),
                      "sessionIdOa": localStorage.getItem("sessionIdOa"),
                      "timeString": this.timeString,
                      "areaId": this.areaId
                    },
                    success : function(data) {
                      if(data.code == 200){
                        for(var i=0;i<data.data.length;i++){
                            this.lastMonthArea.push(
                              data.data[i].money
                            )
                        }
                        this.getTableStartArea();
                      }else {
                        this.$refs.childAlert.show(data["msg"]);
                      }
                                                
                    }.bind(this),
                    error : function() {
                    }
                });
            },
            getTableStartArea: function(){  //对比列表（区域）
                if(!this.timeStringEnd){
                  this.timeStringEnd = this.formatDate1(new Date()) +"01";
                }              
                $.ajax({
                    type : "post",
                    async : false,
                    url : this.path + "selectCheckStaticTrendSum",
                    data : {
                      "jobNumber": localStorage.getItem("jobNumber"),
                      "sessionIdOa": localStorage.getItem("sessionIdOa"),
                      "timeString": this.timeStringEnd,
                      "areaId": this.areaId
                    },
                    success : function(data) {
                      if(data.code == 200){
                        this.areaPercentage = [];
                        for(var i=0;i<data.data.length;i++){                        
                            var thisMoney = data.data[i]["money"]
                            for(var j=0;j<this.lastMonthArea.length;j++){
                            } 
                            var percentage = (thisMoney - this.lastMonthArea[i])/this.lastMonthArea[i];
                            if(isNaN(percentage)){
                               percentage = 0;
                            }
                            percentage = (percentage*100).toFixed(2)
                            this.areaPercentage.push(percentage); 
                        }
                        this.tableList =[];
                        for(var i=0;i<data["data"].length;i++){
                            this.tableList.push({
                                  "areaName": data["data"][i].areaName,
                                  "money": data["data"][i].money,
                                  "areaPercentage": this.areaPercentage[i],
                                  "areaId": data["data"][i].areaId,
                                  "check": "",
                                  "rowspan":"1",
                                  "provinceList": [],   //省份遍历
                                  "lastMonthPro": [],   //省份上个月费用
                                  "proPercentage": []  //省份增长百分比                    
                            })
                        }

                      }else {
                        this.$refs.childAlert.show(data["msg"]);
                      }
                      
                                               
                    }.bind(this),
                    error : function() {
                    }
                });
            },
            getTableProvice: function(v,areaId){  //对比列表（省份前一个月）
                if(!this.timeString){
                  this.timeString = this.formatDate2(new Date()) +"01";
                }                             
                $.ajax({
                    type : "post",
                    async : false,
                    url : this.path + "selectUserCheckStaticByProvince",
                    data : {
                      "jobNumber": localStorage.getItem("jobNumber"),
                      "sessionIdOa": localStorage.getItem("sessionIdOa"),
                      "timeString": this.timeString,
                      "areaId": areaId
                    },
                    success : function(data) {
                      if(data.code == 200){
                        if(this.tableList[v].check == "1"){
                           this.tableList[v].check = "";
                           this.tableList[v].rowspan = "1";
                           this.tableList[v].provinceList = [];
                           this.tableList[v].lastMonthPro = [];
                           this.tableList[v].proPercentage = []; 
                           this.proPercentage = [];                      
                        }else {
                           this.tableList[v].check = "1";
                           for(var i=0;i<data.data.length;i++){
                                var money = 0;
                                for(var j=0;j<data.data[i].length;j++){
                                   money += data.data[i][j].money
                                }
                                this.tableList[v].lastMonthPro.push(money)
                            }
                            this.tableList[v].rowspan = this.tableList[v].lastMonthPro.length + Number(1);
                            this.getTableStartProvince(v,areaId);
                        }

                      }else {
                          this.$refs.childAlert.show(data["msg"]);
                      }
                                                                   
                    }.bind(this),
                    error : function() {
                    }
                });
            },
            getTableStartProvince: function(v,areaId){  //对比列表（省份）
                if(!this.timeStringEnd){
                  this.timeStringEnd = this.formatDate1(new Date()) +"01";
                }    
                $.ajax({
                    type : "post",
                    async : false,
                    url : this.path + "selectUserCheckStaticByProvince",
                    data : {
                      "jobNumber": localStorage.getItem("jobNumber"),
                      "sessionIdOa": localStorage.getItem("sessionIdOa"),
                      "timeString": this.timeStringEnd,
                      "areaId": areaId
                    },
                    success : function(data) {
                      if(data.code == 200){
                        this.proPercentage = [];
                        for(var i=0;i<data.data.length;i++){
                            var money = 0;
                            for(var j=0;j<data.data[i].length;j++){
                               money += data.data[i][j].money
                            }
                            this.tableList[v].lastMonthPro.push(money)
                        }
                        this.tableList[v].rowspan = this.tableList[v].lastMonthPro.length + Number(1);


                        for(var i=0;i<data.data.length;i++){ 
                            var thisMoney = 0;
                            for(var j=0;j<data.data[i].length;j++){
                               thisMoney += Number(data.data[i][j].money);
                            }
                            var percentage = (thisMoney - this.tableList[v].lastMonthPro[i])/this.tableList[v].lastMonthPro[i];
                            percentage = (percentage*100).toFixed(2)
                            this.proPercentage.push(percentage); 
                        }
                        this.tableList[v].provinceList =[];
                        for(var i=0;i<data["data"].length;i++){
                          var thisMoney = 0;
                            for(var j=0;j<data.data[i].length;j++){
                               thisMoney += data.data[i][j].money
                            }
                            this.tableList[v].provinceList.push({
                                  "provinceName": data["data"][i][0].provinceName,
                                  "provinceId": data["data"][i][0].provinceId,
                                  "money": thisMoney,
                                  "areaPercentage": this.proPercentage[i],
                                  "check": "",
                                  "rowspan": "1",
                                  "userList": [],   //人员遍历
                                  "lastMonthUser": [],   //人员上个月费用
                                  "userPercentage": []  //人员增长百分比
                            })
                        }
                      }else {
                        this.$refs.childAlert.show(data["msg"]);
                      }
                      
                    }.bind(this),
                    error : function() {
                    }
                });
            },
            getTableUser: function(v,k,provinceId){  //对比列表（人员前一个月）
                if(!this.timeString){
                  this.timeString = this.formatDate2(new Date()) +"01";
                }                             
                $.ajax({
                    type : "post",
                    async : false,
                    url : this.path + "selectUserCheckStaticByUserId",
                    data : {
                      "jobNumber": localStorage.getItem("jobNumber"),
                      "sessionIdOa": localStorage.getItem("sessionIdOa"),
                      "timeString": this.timeString,
                      "provinceId": provinceId
                    },
                    success : function(data) {
                      if(data.code == 200){
                        if(this.tableList[v].provinceList[k].check == "1"){
                           this.tableList[v].provinceList[k].check = "";
                           this.tableList[v].provinceList[k].rowspan = "1";
                           this.tableList[v].rowspan = this.tableList[v].lastMonthPro.length + Number(1);
                           this.tableList[v].provinceList[k].userList = [];
                           this.tableList[v].provinceList[k].lastMonthUser = [];
                           this.tableList[v].provinceList[k].userPercent = []; 
                           this.userPercent = [];
                        }else {

                           this.tableList[v].provinceList[k].check = "1";
                           for(var i=0;i<data.data.length;i++){
                                var money = 0;
                                for(var j=0;j<data.data[i].length;j++){
                                   money += data.data[i][j].money
                                }
                                this.tableList[v].provinceList[k].lastMonthUser.push(money)
                            }
                            this.tableList[v].provinceList[k].rowspan = this.tableList[v].provinceList[k].lastMonthUser.length + Number(1);
                            this.tableList[v].rowspan = this.tableList[v].provinceList[k].rowspan + Number(1);
                            this.getTableStartUser(v,k,provinceId);

                        }

                      }else {
                        this.$refs.childAlert.show(data["msg"]);
                      }
                                    
                    }.bind(this),
                    error : function() {
                    }
                });
            },
            getTableStartUser: function(v,k,provinceId){  //对比列表（人员）
                if(!this.timeStringEnd){
                  this.timeStringEnd = this.formatDate1(new Date()) +"01";
                }    
                $.ajax({
                    type : "post",
                    async : false,
                    url : this.path + "selectUserCheckStaticByUserId",
                    data : {
                      "jobNumber": localStorage.getItem("jobNumber"),
                      "sessionIdOa": localStorage.getItem("sessionIdOa"),
                      "timeString": this.timeStringEnd,
                      "provinceId": provinceId
                    },
                    success : function(data) {
                      if(data.code == 200){
                        this.userPercent = [];
                        for(var i=0;i<data.data.length;i++){ 
                            var thisMoney = 0;
                            for(var j=0;j<data.data[i].length;j++){
                               thisMoney += Number(data.data[i][j].money);
                            }
                            var percentage = (thisMoney - this.tableList[v].provinceList[k].lastMonthUser[i])/this.tableList[v].provinceList[k].lastMonthUser[i];
                            percentage = (percentage*100).toFixed(2)
                            this.userPercent.push(percentage);
                             
                        }
                        this.tableList[v].provinceList[k].userList =[];
  
                        for(var i=0;i<data["data"].length;i++){
                          var thisMoney = 0;
                            for(var j=0;j<data.data[i].length;j++){
                               thisMoney += data.data[i][j].money
                            }
                            this.tableList[v].provinceList[k].userList.push({
                                  "userName": data["data"][i][0].userName,
                                  "userId": data["data"][i][0].userId,
                                  "money": thisMoney,
                                  "userPercent": this.userPercent[i]                            
                            })
                        }

                      }else {
                        this.$refs.childAlert.show(data["msg"]);
                      }
                                                                    
                    }.bind(this),
                    error : function() {
                    }
                });
            },
            timeSeacher: function(){
              this.isShowCover = true;
              this.isShowDetail = true;
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
            closePop: function(){
              this.isShowCover = false;
              this.isShowDetail = false;
            },
            choseMonth: function(){
              this.dateTime = this.yearChose +"年"+ this.monthChose +"月份";
              var sTime = this.monthChose - 1;
              var sYear = this.monthChose - 1;
              if(sTime<= 0){
                sYear = Number(this.yearChose) - Number(1);
                sTime = 12 + sTime;
              }  
              if( this.monthChose < 10){
                 this.monthChose = '0' + this.monthChose
              }
              this.timeString  = sYear +"-"+ sTime +"-01";
              this.timeStringEnd = this.yearChose +"-"+ this.monthChose +"-01";
              this.getTable();
              this.isShowCover = false;
              this.isShowDetail = false;
            },
            choseQuart: function(){
              var quarter = '';
              if(this.quarterChose == "1"){
                    quarter = "一季度";
                    this.timeString  = this.yearChose +"-"+ "01-01";
                    this.timeStringEnd  = this.yearChose +"-"+ "03-01";
              }
              if(this.quarterChose == "2"){
                    quarter = "二季度";
                    this.timeString  = this.yearChose +"-"+ "04-01";
                    this.timeStringEnd  = this.yearChose +"-"+ "06-01";
              }
              if(this.quarterChose == "3"){
                    quarter = "三季度";
                    this.timeString  = this.yearChose +"-"+ "07-01";
                    this.timeStringEnd  = this.yearChose +"-"+ "09-01";
              }
              if(this.quarterChose == "4"){
                    quarter = "四季度";
                    this.timeString  = this.yearChose +"-"+ "10-01";
                    this.timeStringEnd  = this.yearChose +"-"+ "12-01";
              }
              this.dateTime = this.yearChose +"年"+ quarter; 
              this.getTable(); 
              this.isShowCover = false;
              this.isShowDetail = false;   
            },
            choseYear: function(){
              this.dateTime = this.yearChose +"年";
              this.timeString  = this.yearChose +"-"+ "01-01";
              this.timeStringEnd  = this.yearChose +"-"+ "12-01";
              this.getTable();
              this.isShowCover = false;
              this.isShowDetail = false;
            },
            formatDate: function(date){
               var y = date.getFullYear();  
               var m = date.getMonth() + 1; 
               if(m > 12){
                  y = Number(y) + Number(1);
                  m = m - 12;
                }
                if(m <= 0){
                  y = Number(y) - Number(1);
                  m = 12 + m;
                }  
               m = m < 10 ? '0' + m : m;  
               var d = date.getDate();  
               d = d < 10 ? ('0' + d) : d;  
               //return y + '-' + m + '-' + d;
               return y + '年' + m + '月';
            },
            formatDate1: function(date){
               var y = date.getFullYear();  
               var m = date.getMonth() + 1;  
               if(m > 12){
                  y = Number(y) + Number(1);
                  m = m - 12;
                }
                if(m <= 0){
                  y = Number(y) - Number(1);
                  m = 12 + m;
                } 
               m = m < 10 ? '0' + m : m;  
               var d = date.getDate();  
               d = d < 10 ? ('0' + d) : d;  
               //return y + '-' + m + '-' + d;
               return y + '-' + m + '-';
            },
            formatDate2: function(date){
               var y = date.getFullYear();  
               var m = date.getMonth();  
               if(m > 12){
                  y = Number(y) + Number(1);
                  m = m - 12;
                }
                if(m <= 0){
                  y = Number(y) - Number(1);
                  m = 12 + m;
                } 
               m = m < 10 ? '0' + m : m;  
               var d = date.getDate();  
               d = d < 10 ? ('0' + d) : d;  
               //return y + '-' + m + '-' + d;
               return y + '-' + m + '-';
            },
            closeShowEchart: function(){
              this.isShowCover = false;
              this.isShowEcharts = false;
            },
            showEcharts: function(areaId,provinceId){
              this.isShowCover = true;
              this.isShowEcharts = true;
              if(!provinceId){
                 this.provinceId = '';
              }else {
                this.provinceId = provinceId;
              }
              this.areaId = areaId;
              this.getLeft();
              this.getEchartPie();
            },
            liChange: function(k,costCategory){
              if(k==-1){
                 this.costCategory = '';
                 this.allcolor = "check";
                 for(var i=0;i<this.liColor.length;i++){
                    this.liColor[i].check = ""
                  }
                  this.getEchartPie(); 
              }else{
                 this.costCategory = costCategory;
                 this.allcolor = "";
                 for(var i=0;i<this.liColor.length;i++){
                     if(k==i){
                       this.liColor[i].check = "check"
                     }else{
                       this.liColor[i].check = ""
                     }
                 }
                 this.getEchartPie();
              }     
            }, 
            getLeft: function(){
              if(!this.timeString){
                  this.timeString = this.formatDate2(new Date()) +"01";
                } 
              if(!this.timeStringEnd){
                this.timeStringEnd = this.formatDate1(new Date()) +"01";
              } 
              
              $.ajax({
              type : "post",
              url : this.path + "selectUserCheckStaticByCostCategoryAndAreaId",
              data : {
                "jobNumber": localStorage.getItem("jobNumber"),
                "sessionIdOa": localStorage.getItem("sessionIdOa"),
                "timeString": this.timeString,
                "timeStringEnd": this.timeStringEnd,
                "provinceId": this.provinceId,
                "areaId": this.areaId,
                "costCategory": this.costCategory
              },
              success : function(data) {
                if(data.code == 200){

                    
                      var allMoney = 0;
                      var grMoney = 0;
                      var extraMoney = 0;
                      var qytraMoney = 0;
                      var kkMoney = 0;
                      for(var i=0;i< data["data"].length;i++){
                          allMoney = Number(allMoney) + Number(data["data"][i].money);
                          
                          if(data["data"][i]["costCategory"] == 1){
                              grMoney += data["data"][i]["money"];
                          }
                          
                          if(data["data"][i]["costCategory"] == 2){
                              extraMoney += data["data"][i]["money"];
                          }

                          if(data["data"][i]["costCategory"] == 3){
                              qytraMoney += data["data"][i]["money"];
                          }
                          
                          if(data["data"][i]["costCategory"] == 4){
                              kkMoney += data["data"][i]["money"];
                          }
          
                      }
                      this.fyList[0]["money"] = grMoney;
                      this.fyList[1]["money"] = extraMoney;
                      this.fyList[2]["money"] = qytraMoney;
                      this.fyList[3]["money"] = kkMoney;
          
                      this.allMoney = allMoney;

                 
                }else {
                  this.$refs.childAlert.show(data.msg);
                }
        
              }.bind(this),
              error : function() {
              }
               });
            },
            getEchartPie: function(){
              if(!this.timeString){
                  this.timeString = this.formatDate2(new Date()) +"01";
                } 
              if(!this.timeStringEnd){
                this.timeStringEnd = this.formatDate1(new Date()) +"01";
              } 
              
              $.ajax({
              type : "post",
              url : this.path + "selectUserCheckStaticByCostCategoryAndAreaId",
              data : {
                "jobNumber": localStorage.getItem("jobNumber"),
                "sessionIdOa": localStorage.getItem("sessionIdOa"),
                "timeString": this.timeString,
                "timeStringEnd": this.timeStringEnd,
                "provinceId": this.provinceId,
                "areaId": this.areaId,
                "costCategory": this.costCategory
              },
              success : function(data) {
                if(data.code == 200){

                      var deptName=[];
                      var money=[];
                      for(var i=0;i<data["data"].length;i++){
                        if(typeof(data["data"][i].costTypeName)=="undefined" || !data["data"][i].costTypeName){
                          deptName.push("Extra");
                        }else{
                          deptName.push(data["data"][i].costTypeName);
                        }
                      }
                      for(var i=0;i<data["data"].length;i++){
                        money.push(data["data"][i].money);
                      }
                      var nums=[];
                      for(var i=0;i<data["data"].length;i++){
                          if(!data["data"][i].costTypeName){
                            nums.push("Extra");
                          }else {
                            nums.push(data["data"][i].costTypeName);
                          }
                          
                      }
        
                      var expenName = '';
                      if(!this.costCategory || this.costCategory == ''){
                         expenName = '全部费用类型占比'
                      }
                      if(this.costCategory == 1){
                         expenName = '个人统筹费用类型占比'
                      }
                      if(this.costCategory == 2){
                         expenName = 'Extra费用类型占比'
                      }
                      if(this.costCategory == 3){
                         expenName = '区域费用类型占比'
                      }
                      if(this.costCategory == 4){
                         expenName = '开课费用类型占比'
                      }
        
                      var firstColor = '#48A9EF';
                    
                      if(!money || money == ''){
                        deptName.push("暂无花费");
                        money.push(0);
                        firstColor = '#cecece';
                      }else {
                        firstColor = '#48A9EF';
                      }
                      
                      this.option = {        //加载数据图表
                        title: {
                            text: expenName,
                            left: 'center',
                            top: 10,
                        },
                        tooltip : {
                            trigger: 'item',
                            formatter: "{a} <br/>{b} : {c} ({d}%)"
                        },
                        color:[ firstColor, '#99D97C','#FFD562','#F37A70','#8997E7','#99C1FF','#54BFB7','#2E789B'],
                        legend: {
                            //orient: 'vertical',
                            //top: 'middle',
                            bottom: 0,
                            left: 'center',
                            data: nums
                        },
                       series : [
                          {
                            name: '',
                            type: 'pie',
                            radius : '50%',
                            center: ['50%', '50%'],
                            data: (function() {
                              var res = [];
                              var len = deptName.length;
                              while (len--) {
                                res.push({
                                  value : money[len],
                                  name : deptName[len],
                                });
                              }
                              return res;
                            })(),
                            itemStyle: {
                              emphasis: {
                                shadowBlur: 10,
                                shadowOffsetX: 0,
                                shadowColor: 'rgba(0, 0, 0, 0.5)'
                              }
                            }
                          }
                        ]
          
                      };
                    
                      var myChart = echarts.init(document.getElementById('myChart'));
          
                      myChart.setOption(this.option)
                 
                }else {
                  this.$refs.childAlert.show(data.msg);
                }
        
              }.bind(this),
              error : function() {
              }
               });
            }


        }
        
    }
</script>