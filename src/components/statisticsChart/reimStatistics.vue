<template>
  <div class="charts">
      <div class="gonggao_bread">
        <a href="#/mainIndex/index" class="fa">首页</a>
        &gt;
        <span>统计管理</span>
        &gt;
        <span>报销统计</span>
      </div>

      <div class="gonggao_body table_body" style="text-align: center;">

             <div class="baoxiao" style="width: 100%;text-align: center;padding: 20px 10px" >
                  <span style="font-size: 25px;font-weight: 700">{{ dateTime }}报销费用统计情况</span>
                  <span v-on:click="timeSeacher" style="display:inline-block;float:right;color: #00a1e9;cursor: pointer;margin-right: 50px">按时间查询</span>
             </div>
             <div class="baoxiao bxfytj" style="width: 100%;text-align: center;padding: 20px 10px" >
               <ul>
                 <li v-bind:class="[allcolor]" v-on:click="liChange(-1)">
                     <div style="float: left;width: 30%;margin-top: 10px">
                         <span style="display: inline-block;width: 90%;margin: 0 auto;"><img style="width: 100%" src="/static/img/all.png"/></span>
                     </div>
                     <div style="float: right;width: 70%">
                        <span>全部</span>
                        </br>
                        <span style="font-size: 22px" v-bind:title="allMoney.toFixed(2)">{{ allMoney.toFixed(2) }}</span>
                    </div>
                 </li>
                 
                 <li  v-bind:class="[liColor[k].check]" v-if="!list.userId" v-on:click="liChangeDept(k,list.deptId)" v-for="(list,k) in fyList">
                     
                    <div v-if="list.deptName" style="float: left;width: 30%;margin-top: 10px">
                        <span v-if="list.deptName && k==0" style="display: inline-block;width: 90%;margin: 0 auto;"><img style="width: 100%" src="/static/img/wlb.png"/></span>
                        <span v-if="list.deptName && k==1" style="display: inline-block;width: 90%;margin: 0 auto;"><img style="width: 100%" src="/static/img/cwb.png"/></span>
                        <span v-if="list.deptName && k==2" style="display: inline-block;width: 90%;margin: 0 auto;"><img style="width: 100%" src="/static/img/xzb.png"/></span>
                        <span v-if="list.deptName && k==3" style="display: inline-block;width: 90%;margin: 0 auto;"><img style="width: 100%" src="/static/img/rlb.png"/></span>
                        <span v-if="list.deptName && k==4" style="display: inline-block;width: 90%;margin: 0 auto;"><img style="width: 100%" src="/static/img/yyb.png"/></span>
                        <span v-if="list.deptName && k==5" style="display: inline-block;width: 90%;margin: 0 auto;"><img style="width: 100%" src="/static/img/scb.png"/></span>
                        <span v-if="list.deptName && k==6" style="display: inline-block;width: 90%;margin: 0 auto;"><img style="width: 100%" src="/static/img/jyb.png"/></span>
                    </div>

                   
                    <div style="float: right;width: 70%">
                        <span v-if="list.userName">{{ list.userName }}</span>
                        <span v-if="list.deptName">{{ list.deptName }}</span>
                        </br>
                        <span style="font-size: 22px" v-bind:title="list.money.toFixed(2)">{{ list.money.toFixed(2) }}</span>
                    </div>
                   
                 </li>


                 <li  v-bind:class="[liColor[k].check]" v-if="list.userId" v-on:click="liChange(k,list.userId)" v-for="(list,k) in fyList">
                                  
                    <div v-if="list.userName" style="float: left;width: 30%;margin-top: 10px">
                        <span v-if="list.userName" style="display: inline-block;width: 90%;margin: 0 auto;"><img style="width: 100%" src="/static/img/jtf.png"/></span>
                   </div>

                    <div style="float: right;width: 70%">
                        <span v-if="list.userName">{{ list.userName }}</span>
                        </br>
                        <span style="font-size: 25px" v-bind:title="list.money.toFixed(2)">{{ list.money.toFixed(2) }}</span>
                    </div>
                   
                 </li>

         
                 
               </ul>
             </div>

      </div>

      <div class="gonggao_body">
          <!--创建一个echarts的容器-->
          <div id="myChart" style="width:500px; height:400px;margin: 0 auto"></div>
          
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

      <oa-alert ref="childAlert"></oa-alert>


    
  </div>
</template>

<style>
      .bxfytj ul {
        border: 0 none;
        width: 100%;
      }
      .bxfytj li {
            width: 20%;
            height: 80px;
            line-height: 40px;
            float: left;
            margin: 10px 2%;
            border: 1px solid #cecece;
            cursor: pointer;
      }
      .bxfytj li:hover {
        border: 1px solid #00a1e9;
        color: #00a1e9;
      }
      .bxfytj li.check {
        border: 1px solid #00a1e9;
        color: #00a1e9;
      }
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
      option: '',
      allMoney: 0,
      isShowCover: false,
      isShowDetail: false,
      typeId: false,
      areaList: '',
      dateTime: '',
      timeString: '',
      timeStringEnd: '',
      yearChose: '',
      monthChose: '',
      quarterChose: '',
      index:'0',
      deptId: '',
      userId:'',
      allcolor:'check',
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
      liColor: [
          {"check": ""},
          {"check": ""},
          {"check": ""},
          {"check": ""},
          {"check": ""},
          {"check": ""},
          {"check": ""}
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
      fyList: [
          {
            deptName: '网络部',
            deptId: '3',
            money: 0
          },
          {
            deptName: '财务部',
            deptId: '5',
            money: 0
          },
          {
            deptName: '行政部',
            deptId: '4',
            money: 0
          },
          {
            deptName: '人力部',
            deptId: '9',
            money: 0
          },
          {
            deptName: '运营部',
            deptId: '8',
            money: 0
          },
          {
            deptName: '市场部',
            deptId: '18',
            money: 0
          },
          {
            deptName: '教研部',
            deptId: '11',
            money: 0
          }
      ]
          
    }
  },
  created: function () {
    this.dateTime = this.formatDate(new Date())
    this.timeString = this.formatDate2(new Date()) +"01"
    this.usersDept();    
  },
  methods: {  
    usersDept: function(){  //初始化区域
      $.ajax({
         type : "post",
         url : this.path + "findUsersDept",
         data : {
           "jobNumber": localStorage.getItem("jobNumber"),
           "sessionIdOa": localStorage.getItem("sessionIdOa")         
         },
         success : function(data) {
           if(data.code == 200){ 
               if(data["data"].deptName == "集团总部" || data["data"].deptName == "财务部"){
                  this.areaList = 2;
                  this.getEchart(); 
               }else {
                  this.areaList = 1;
                  this.typeId = true;
                  this.deptId = data["data"].deptId;
                  this.getEchartByUser();
                  this.getEchartByDeptid();
               }               
           }else {
             this.$refs.childAlert.show(data["msg"]);
           }
   
         }.bind(this),
         error : function() {
         }
      });
    },
    getEchart: function(){
      $.ajax({
      type : "post",
      url : this.path + "reimbursement/selectByPrimaryDate",
      data : {
        "jobNumber": localStorage.getItem("jobNumber"),
        "sessionIdOa": localStorage.getItem("sessionIdOa"),
        "timeString": this.timeString,
        "timeStringEnd": this.timeStringEnd
      },
      success : function(data) {
        if(data.code == 200){

            if(!data["data"] || data["data"]==''){
              this.fyList = [
                 {
                   deptName: '网络部',
                   deptId: '3',
                   money: 0
                 },
                 {
                   deptName: '财务部',
                   deptId: '5',
                   money: 0
                 },
                 {
                   deptName: '行政部',
                   deptId: '4',
                   money: 0
                 },
                 {
                   deptName: '人力部',
                   deptId: '9',
                   money: 0
                 },
                 {
                   deptName: '运营部',
                   deptId: '8',
                   money: 0
                 },
                 {
                   deptName: '市场部',
                   deptId: '18',
                   money: 0
                 },
                 {
                   deptName: '教研部',
                   deptId: '11',
                   money: 0
                 }
              ];
            }else{

            
              if(data["data"].length == 1 ){
                this.deptId = data["data"][0].deptId;
                this.getEchartByDeptid();
                this.getEchartByUser();
              }else{
                for(var i=0;i<data["data"].length;i++){
                  if(!data["data"][i]["money"]){
                      data["data"][i]["money"] = 0;
                  }
                  for(var j=0;j<this.fyList.length;j++){
                     if(data["data"][i]["deptId"] == this.fyList[j]["deptId"]){ 
                        this.fyList[j]["money"] = data["data"][i]["money"];
                     }
                  }
                }
                console.log(this.fyList)
                var allMoney = 0;
                var deptName=[];
                var money=[];
                for(var i=0;i<data["data"].length;i++){
                  if(typeof(data["data"][i].deptName)=="undefined" || !data["data"][i].money){
                  }else{
                    deptName.push(data["data"][i].deptName);
                  }
                }
                for(var i=0;i<data["data"].length;i++){
                  money.push(data["data"][i].money);
                  allMoney +=data["data"][i].money;
                }
                var nums=[];
                for(var i=0;i<data["data"].length;i++){
                    nums.push(data["data"][i].deptName);
                }
  
                var firstColor = '#48A9EF';
              
                if(!money || money == ''){
                  deptName.push("暂无花费");
                  money.push(0);
                  firstColor = '#cecece';
                }else {
                  firstColor = '#48A9EF';
                }
    
                this.allMoney = allMoney;
    
                this.option = {        //加载数据图表
                  title: {
                      text: '报销费用类型占比',
                      left: 'center',
                      top: 10,
                  },
                  tooltip : {
                      trigger: 'item',
                      formatter: "{a} <br/>{b} : {c} ({d}%)"
                  },
                  color:[firstColor, '#99D97C','#FFD562','#F37A70','#8997E7','#99C1FF','#54BFB7','#2E789B'],
                  legend: {
                      //orient: 'vertical',
                      //top: 'middle',
                      bottom: 80,
                      left: 'center',
                      data: nums
                  },
                 series : [
                    {
                      name: '报销统计',
                      type: 'pie',
                      radius : '55%',
                      center: ['50%', '43%'],
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
  
              }

            }
            

        }else {
          this.$refs.childAlert.show(data["msg"]);
        }

      }.bind(this),
      error : function() {
      }
       });
    },
    getEchartByDeptid: function(){
      $.ajax({
      type : "post",
      url : this.path + "reimbursement/selectDetailByPrimaryDate",
      data : {
        "jobNumber": localStorage.getItem("jobNumber"),
        "sessionIdOa": localStorage.getItem("sessionIdOa"),
        "timeString": this.timeString,
        "timeStringEnd": this.timeStringEnd,
        "deptId": this.deptId
      },
      success : function(data) {
        if(data.code == 200){ 
           
            var allMoney = 0;
            var deptName=[];
            var money=[];
            for(var i=0;i<data["data"].length;i++){
              if(typeof(data["data"][i].reimTypeName)=="undefined"){
              }else{
                deptName.push(data["data"][i].reimTypeName);
              }
            }
            for(var i=0;i<data["data"].length;i++){
              if(!data["data"][i].money){

              }else {
                money.push(data["data"][i].money);
                if(this.areaList == 1){
                   allMoney +=data["data"][i].money;
                }
                
              }
            }
            if(this.areaList == 1){
               this.allMoney = allMoney;
            }
            var nums=[];
            for(var i=0;i<data["data"].length;i++){
                nums.push(data["data"][i].reimTypeName);
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
                  text: '报销费用类型占比',
                  left: 'center',
                  top: 10,
              },
              tooltip : {
                  trigger: 'item',
                  formatter: "{a} <br/>{b} : {c} ({d}%)"
              },
              color:[firstColor, '#99D97C','#FFD562','#F37A70','#8997E7','#99C1FF','#54BFB7','#2E789B'],
              legend: {
                  //orient: 'vertical',
                  //top: 'middle',
                  bottom: 80,
                  left: 'center',
                  data: nums
              },
             series : [
                {
                  name: '报销统计',
                  type: 'pie',
                  radius : '55%',
                  center: ['50%', '43%'],
                  data: (function() {
                    var res = [];
                    var len = deptName.length;
                    while (len--) {
                      res.push({
                        value : money[len],
                        name : deptName[len]
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
          this.$refs.childAlert.show(data["msg"]);
        }

      }.bind(this),
      error : function() {
      }
       });
    },
    getEchartByUser: function(){
      $.ajax({
      type : "post",
      url : this.path + "reimbursement/selectByPrimaryDateUserId",
      data : {
        "jobNumber": localStorage.getItem("jobNumber"),
        "sessionIdOa": localStorage.getItem("sessionIdOa"),
        "timeString": this.timeString,
        "timeStringEnd": this.timeStringEnd,
        "deptId": this.deptId
        //"userId": this.userId
      },
      success : function(data) {
        if(data.code == 200){ 
            
            if(!data["data"] || data["data"]==''){
              this.fyList = [];
              this.allMoney = 0;
            }else {
              this.fyList = data["data"];
            }
            this.liColor = [];
            for(var i=0;i<this.fyList.length;i++){
              this.liColor.push({
                "check": ""
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
    getEchartByUserId: function(){
      $.ajax({
      type : "post",
      url : this.path + "reimbursement/selectDetailByPrimaryDate",
      data : {
        "jobNumber": localStorage.getItem("jobNumber"),
        "sessionIdOa": localStorage.getItem("sessionIdOa"),
        "timeString": this.timeString,
        "timeStringEnd": this.timeStringEnd,
        "userId": this.userId
      },
      success : function(data) {
        if(data.code == 200){ 
          var allMoney = 0;
            var deptName=[];
            var money=[];
            for(var i=0;i<data["data"].length;i++){
              if(typeof(data["data"][i].reimTypeName)=="undefined"){
              }else{
                deptName.push(data["data"][i].reimTypeName);
              }
            }
            for(var i=0;i<data["data"].length;i++){
              money.push(data["data"][i].money);
            }
            var nums=[];
            for(var i=0;i<data["data"].length;i++){
                nums.push(data["data"][i].reimTypeName);
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
                  text: '报销费用类型占比',
                  left: 'center',
                  top: 10,
              },
              tooltip : {
                  trigger: 'item',
                  formatter: "{a} <br/>{b} : {c} ({d}%)"
              },
              color:['#48A9EF', '#99D97C','#FFD562','#F37A70','#8997E7','#99C1FF','#54BFB7','#2E789B'],
              legend: {
                  //orient: 'vertical',
                  //top: 'middle',
                  bottom: 80,
                  left: 'center',
                  data: nums
              },
             series : [
                {
                  name: '报销统计',
                  type: 'pie',
                  radius : '55%',
                  center: ['50%', '43%'],
                  data: (function() {
                    var res = [];
                    var len = deptName.length;
                    while (len--) {
                      res.push({
                        value : money[len],
                        name : deptName[len]
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
          this.$refs.childAlert.show(data["msg"]);
        }

      }.bind(this),
      error : function() {
      }
       });
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
    liChange: function(k,userId){
      if(k==-1){
         this.allcolor = "check";
         for(var i=0;i<this.liColor.length;i++){
            this.liColor[i].check = ""
          }
          if(this.typeId){
            this.getEchartByUser();
            this.getEchartByDeptid();
          }else {
            this.getEchart();
          }
           
      }else{
        this.userId = userId;
         this.allcolor = "";
         for(var i=0;i<this.liColor.length;i++){
             if(k==i){
               this.liColor[i].check = "check"
             }else{
               this.liColor[i].check = ""
             }
         }
         this.getEchartByUserId();
      }    
    },
    liChangeDept: function(k,deptId){
      if(k==-1){
         this.allcolor = "check";
         for(var i=0;i<this.liColor.length;i++){
            this.liColor[i].check = ""
          }
          this.getEchart(); 
      }else{
         this.deptId = deptId;
         this.allcolor = "";
         for(var i=0;i<this.liColor.length;i++){
             if(k==i){
               this.liColor[i].check = "check"
             }else{
               this.liColor[i].check = ""
             }
         }
         this.getEchartByDeptid();
      }
    },
    choseMonth: function(){
      this.dateTime = this.yearChose +"年"+ this.monthChose +"月份";
      this.timeStringEnd = '';
      if( this.monthChose < 10){
         this.monthChose = '0' + this.monthChose
      }
      this.timeString  = this.yearChose +"-"+ this.monthChose +"-01";
      this.getEchart();
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
      this.getEchart(); 
      this.isShowCover = false;
      this.isShowDetail = false;   
    },
    choseYear: function(){
      this.dateTime = this.yearChose +"年";
      this.timeString  = this.yearChose +"-"+ "01-01";
      this.timeStringEnd  = this.yearChose +"-"+ "12-01";
      this.getEchart();
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
    formatDate2: function(date){
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
    timeSeacher: function(){
      this.isShowCover = true;
      this.isShowDetail = true;      
    },
    closePop: function(){
      this.isShowCover = false;
      this.isShowDetail = false;
    }

    
  }
 
}
</script>
