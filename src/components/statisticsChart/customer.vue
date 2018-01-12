<template>

  <div class="roleManagement">
      <div class="gonggao_bread">
        <a href="#/mainIndex/index" class="fa">首页</a>
        &gt;
        <span>统计管理</span>
        &gt;
        <span>客户统计</span>
      </div>
      
      <div class="gonggao_body table_body" style="padding-top: 20px;overflow: hidden;zoom: 1">

         <div style="width:20%;height:600px;float: left;overflow: auto">
              <div style="padding-left: 20%;margin-bottom: 20px" v-if="country"> 
                  <div style="font-size: 15px;font-weight: 700;border-left: 5px solid #00a1e9;padding-left: 10px">全国客户总数</div>
                  <div style="font-size: 25px;padding-left: 15px;margin-top: 5px;color: #00a1e9">{{ allNumber }}</div>
                  <div style="font-size: 14px;padding-left: 15px;margin-top: 5px;">
                       较上月新增
                       <span style="color: #FF6666">{{ addNumber }}</span>
                  </div>
              </div>

              <div style="padding-left: 20%;margin-bottom: 20px" v-for="list in leftList"> 
                  <div style="font-size: 15px;font-weight: 700;border-left: 5px solid #00a1e9;padding-left: 10px">{{ list.areaName }}</div>
                  <div style="font-size: 25px;padding-left: 15px;margin-top: 5px;color: #00a1e9">{{ list.number }}</div>
                  <div style="font-size: 14px;padding-left: 15px;margin-top: 5px;">
                       较上月新增
                       <span style="color: #FF6666">{{ list.numIncrease }}</span>
                  </div>
              </div>
                              
        </div>

        <div style="width:50%;float: left;margin-left: 5%;">
            <!--创建地图容器-->
            <div id="myChart" style="width:100%;height:600px"></div>
        </div>

        <div style="width:22%;height:600px;float: right;">
                <div style="width:100%;overflow: hidden;zoom: 1"> 
                    <span v-if="qgArea" style="width:100%;text-align: center" class="areaProv check" >省份客户排名</span>
                    <span v-if="area" v-on:click="showProv" class="areaProv" v-bind:class="check" >省份客户排名</span>
                    <span v-if="areaShow" v-on:click="showArea" class="areaProv" v-bind:class="checked">区域客户排名</span>
                </div>

                <div v-if="provChose" style="width: 90%;height:500px;padding-left: 10px;margin-top: 10px;border: 1px solid #cecece;overflow: auto;"> 
                   <div style="margin-top: 10px" v-for="province in rightProvince">
                        <span v-on:click="showCity(province.provineId)"  style="cursor: pointer">{{ province.provinceName }}</span>
                        <span style="display: inline-block;color: #00a1e9;margin-right: 50px;float:right">{{ province.number }}</span>
                   </div>
                </div>

                <div v-if="areaChose" style="width: 90%;height:500px;padding-left: 10px;margin-top: 10px;border: 1px solid #cecece;overflow: auto;"> 
                   <div style="margin-top: 10px" v-for="area in rightArea">
                        <span>{{ area.areaName }}</span>
                        <span style="display: inline-block;color: #00a1e9;margin-right: 50px;float:right">{{ area.number }}</span>
                   </div>
                </div>

        </div>

        <div style="width:100%;float: right;margin-top: 30px;border-top: 1px dashed #cecece;padding-top: 20px">
            <div class="menEdit" style="margin-left: 50px;">
                 <span class="areaP" v-bind:class="[allcolor]" v-if="areaList.length != 1" v-on:click="areaChange(-1)">全国</span>
                 <span class="areaP" v-bind:class="[areaCheck[k].check]" v-for="(area,k) in areaList" v-on:click="areaChange(k,area.areaId)">{{ area.areaName.substring(3) }}</span>
            </div>
            <!--创建折线图容器-->
            <div id="myChartZxt" style="width:100%; height:300px"></div>
        </div>

      </div>


      <div class="bgpop" v-if="isShowCover"></div>
      <div class="view_area" style="width: 400px;height: 520px;padding: 5px 20px" v-if="isShowDetail">
         
            <div class="menEdit" style="font-size: 20px;font-weight: 700;text-align: center">
                 {{ cityName }}客户
            </div> 


            <div style="width: 90%;margin: 20px auto;height:400px;padding-left: 10px;margin-top: 10px;border: 1px solid #cecece;overflow: auto;"> 
                  <div style="margin-top: 10px" v-for="city in rightCity">
                       <span>{{ city.cityName }}</span>
                       <span style="color: #00a1e9;margin-left: 20px">{{ city.number }}</span>
                  </div>

            </div> 

            <div class="view_btn" style="margin-top: 20px">
                 <span class="btn-yellow-s" v-on:click="closePop">关闭</span>
            </div>

      </div>

      <oa-alert ref="childAlert"></oa-alert>

   </div>



</template>
<style>
     .areaProv {
      display: inline-block;
      font-size: 16px;
      font-weight: 700;
      float: left;
      cursor: pointer;
      line-height: 40px;
      margin: 0;
      padding: 0;
      width: 50%;
      border-top: 5px solid #cecece;
      color: #cecece;      
     }
     .areaProv.check {
        border-top: 5px solid #00a1e9;
        color: #00a1e9;
     }
     .areaProv.checked {
        border-top: 5px solid #00a1e9;
        color: #00a1e9;
     }
     .areaP {
        display: inline-block;
        width: 50px;
        font-size: 13px;
        height: 30px;
        line-height: 30px;
        border: 1px solid #cecece;
        border-radius: 5px;
        margin-left: 10px;
        margin-bottom: 10px;
        text-align: center;
        cursor: pointer
      }
      .areaP.check {
        background-color: #00a1e9;
        color: #FFFFFF;
        border: 1px solid #00a1e9;
      }


</style>


<script>
import $ from 'jquery'
var echarts = require('echarts')
import oaAlert from '@/components/commonVue/Alert'
import '../../../node_modules/echarts/map/js/china.js'
export default {
  name: 'ProgressSearch',
  components: {
      'oa-alert': oaAlert
    },
  data () {
    return {
      path: this.OACommon["publicDef"]["qpath"],
      isShowCover: false,
      isShowDetail: false,
      areaChose: false,
      provChose: true,
      qgArea: false,
      area: true,
      startTimeString: '',
      endTimeString: '',
      areaShow: '',
      areaId: '',
      check: 'check',
      checked: '',
      allcolor:"", //全国选中
      areaCheck:[],  //区域颜色遍历
      country: '',
      allNumber: '',
      addNumber: '',
      provinceId: '',
      areaList: '',
      option: [],
      leftList: [],
      rightProvince:[],
      rightCity:[],
      rightArea:[],
      cityName: ''
          
    }
  },
  created: function () {
      this.userArea();
  },
  methods: { 
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
                   this.areaList = data["data"];
                   if(data["data"].length == 1){
                       this.areaId = data.data[0].areaId;
                       this.qgArea = true;
                       this.area = false;
                       this.country = false;
                       this.allcolor = "";
                       this.areaCheck.push({
                         "check": "check"
                       });
                       this.getLeftListArea();
                       this.getEchartArea();
                       this.getEchartZxArea();
                      
                   }else {
                       this.country = true;
                       this.qgArea = false;
                       this.area = true;
                       this.areaShow = true;
                       for(var i=0;i<this.areaList.length;i++){
                          this.areaCheck.push({
                            "check": ""
                          });                    
                       }
                       this.allcolor = "check";
                       this.getLeftList();
                       this.getEchart();
                       this.getEchartZx();
                                             

                   }               
           }else {
            this.$refs.childAlert.show(data["msg"]);
           }            
    
         }.bind(this),
         error : function() {
         }
      });
    }, 
    getLeftList: function(){  //获取左侧客户信息（全国）
        $.ajax({
            type : "post",
            url : this.path + "findAllCustomerAreaNumber",
            data : {
              "jobNumber": localStorage.getItem("jobNumber"),
              "sessionIdOa": localStorage.getItem("sessionIdOa")           
            },
            success : function(data) {
                if(data.code == 200){
                  this.leftList = data.data;                  
                  var erList = data.data;
                  erList = this.JsonSort(erList,"number");
                  this.rightArea = erList;
                  var allNumber = '';
                  var addNumber = 0;
                  for(var i=0;i<data.data.length;i++){
                      allNumber = Number(allNumber) + Number(data.data[i].number);
                      addNumber += data.data[i].numIncrease;
                  }

                  this.allNumber = allNumber;
                  this.addNumber = addNumber;

                }else {
                  this.$refs.childAlert.show(data["msg"]);
                }

                

                      
            }.bind(this),
            error : function() {

            }
        });
    }, 
    getLeftListArea: function(){  //获取左侧客户信息（区域）
        $.ajax({
            type : "post",
            url : this.path + "findAllCustomerAreaNumber",
            data : {
              "jobNumber": localStorage.getItem("jobNumber"),
              "sessionIdOa": localStorage.getItem("sessionIdOa"),          
              "areaId": this.areaId          
            },
            success : function(data) {
              if(data.code == 200){
                this.leftList = data.data;
              }else {
                this.$refs.childAlert.show(data["msg"]);
              }

                
                      
            }.bind(this),
            error : function() {

            }
        });
    },
    getEchart: function(){  //客户数量地图（全国）
        $.ajax({
            type : "post",
            url : this.path + "findAllCustomerAreaNumberByGruopByProvineId",
            data : {
              "jobNumber": localStorage.getItem("jobNumber"),
              "sessionIdOa": localStorage.getItem("sessionIdOa")           
            },
            success : function(data) {
              if(data.code == 200){
                var erList = data.data;
                var province=[];    //省份（实际用来盛放X轴坐标值）
                var provinceCount=[];    //省份客户数（实际用来盛放Y坐标值）
                
                erList = this.JsonSort(erList,"number");

                for(var i=0;i<erList.length;i++){
                  if(erList[i].provinceName==undefined){
      
                  }else{
                    province.push(erList[i].provinceName);    //挨个取出时间并填入时间数组
                  }
                }
                var maxUser = erList[0].number;
                for (var i = 1; i < erList.length; i++) {
                  // 如果元素当前值大于max,就把这个当前值赋值给max
                  if (erList[i].number > maxUser) {
                    maxUser = erList[i].number;
                  }
                }
                for(var i=0;i<erList.length;i++){
                  if(erList[i].number == "" || !erList[i].number){
                    provinceCount.push(0); 
                  }else{
                    provinceCount.push(erList[i].number);    //挨个取出用户量并填入用户量数组

                  }
                }
  
                this.rightProvince = erList;
             
                this.option = {
                    title : {
                        text: '用户分布量',
                        x:'center'
                    },
                    tooltip : {
                        trigger: 'item'
                    },
                    color:['#48A9EF', '#99D97C','#FFD562','#F37A70','#8997E7','#99C1FF','#54BFB7','#2E789B'],
                    legend: {
                        orient: 'vertical',
                        x:'left',
                        data:['客户总数']
                    },
                    dataRange: {
                        min: 0,
                        max: maxUser,
                        x: 'left',
                        y: 'bottom',
                        text:['高','低'],           // 文本，默认为数值文本
                        calculable : true,
                        inRange: {
                            color: ['#D2F6FD', '#0773DE'],
                        }
                    },
                    toolbox: {
                        show: false,
                        orient : 'vertical',
                        x: 'right',
                        y: 'center',
                        feature : {
                            mark : {show: true},
                            dataView : {show: true, readOnly: false},
                            restore : {show: true},
                            saveAsImage : {show: true}
                        }
                    },
                    roamController: {
                        show: true,
                        x: 'right',
                        mapTypeControl: {
                            'china': true
                        }
                    },
                    series : [
                        {
                            name: '客户总数',
                            type: 'map',
                            mapType: 'china',
                            //roam: false,
                            showLegendSymbol: false,
                            itemStyle: {
                               normal: {
                                   borderWidth: .1,//区域边框宽度
                                   borderColor: '#009fe8',//区域边框颜色
                                   areaColor:"#ededed",//区域颜色
                                   //normal:{label:{show:true}},
                                  //emphasis:{label:{show:true}}
                               },
                               emphasis: {
                                   borderWidth: .5,
                                   borderColor: '#4b0082',
                                   areaColor:"#ffdead",
                               }
                           },
                           data: (function() {
                              var res = [];
                              var len = province.length;
                              while (len--) {
                                res.push({
                                  name : province[len],
                                  value : provinceCount[len]
                                });
                              }
                              return res;
                            })()
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
    getEchartArea: function(){  //客户数量地图（区域）
        $.ajax({
            type : "post",
            url : this.path + "findAllCustomerAreaNumberByGruopByProvineId",
            data : {
              "jobNumber": localStorage.getItem("jobNumber"),
              "sessionIdOa": localStorage.getItem("sessionIdOa"),          
              "areaId": this.areaId          
            },
            success : function(data) {
              if(data.code == 200){
                var erList = data.data;
                var province=[];    //省份（实际用来盛放X轴坐标值）
                var provinceCount=[];    //省份客户数（实际用来盛放Y坐标值）

                erList = this.JsonSort(erList,"number")
  
                for(var i=0;i<erList.length;i++){
                  if(erList[i].provinceName==undefined){
      
                  }else{
                    province.push(erList[i].provinceName);    //挨个取出时间并填入时间数组
                  }
                }
                var maxUser = erList[0].number;
                for (var i = 1; i < erList.length; i++) {
                  // 如果元素当前值大于max,就把这个当前值赋值给max
                  if (erList[i].count > maxUser) {
                    maxUser = erList[i].number;
                  }
                }
                for(var i=0;i<erList.length;i++){
                  provinceCount.push(erList[i].number);    //挨个取出用户量并填入用户量数组
                }
  
                this.rightProvince = erList;
             
                this.option = {
                    title : {
                        text: '用户分布量',
                        x:'center'
                    },
                    tooltip : {
                        trigger: 'item'
                    },
                    color:['#48A9EF', '#99D97C','#FFD562','#F37A70','#8997E7','#99C1FF','#54BFB7','#2E789B'],
                    legend: {
                        orient: 'vertical',
                        x:'left',
                        data:['客户总数']
                    },
                    dataRange: {
                        min: 0,
                        max: maxUser,
                        x: 'left',
                        y: 'bottom',
                        text:['高','低'],           // 文本，默认为数值文本
                        calculable : true,
                        inRange: {
                                color: ['#FFFFFF', '#00a1e9']
                        }
                    },
                    toolbox: {
                        show: false,
                        orient : 'vertical',
                        x: 'right',
                        y: 'center',
                        feature : {
                            mark : {show: true},
                            dataView : {show: true, readOnly: false},
                            restore : {show: true},
                            saveAsImage : {show: true}
                        }
                    },
                    roamController: {
                        show: true,
                        x: 'right',
                        mapTypeControl: {
                            'china': true
                        }
                    },
                    series : [
                        {
                            name: '客户总数',
                            type: 'map',
                            mapType: 'china',
                            roam: false,
                            
                            itemStyle: {
                               normal: {
                                   borderWidth: .1,//区域边框宽度
                                   borderColor: '#009fe8',//区域边框颜色
                                   areaColor:"#ededed",//区域颜色
                                   //normal:{label:{show:true}},
                                  //emphasis:{label:{show:true}}
                               },
                               emphasis: {
                                   borderWidth: .5,
                                   borderColor: '#4b0082',
                                   areaColor:"#ffdead",
                               }
                           },
                            data: (function() {
                              var res = [];
                              var len = province.length;
                              while (len--) {
                                res.push({
                                  name : province[len],
                                  value : provinceCount[len]
                                });
                              }
                              return res;
                            })()
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
    showCity: function(provineId){  //客户数量（城市）    
        this.isShowCover = true;
        this.isShowDetail = true;
        this.provinceId = provineId;
        $.ajax({
            type : "post",
            url : this.path + "findAllCustomerAreaNumberByProvineId",
            data : {
              "jobNumber": localStorage.getItem("jobNumber"),
              "sessionIdOa": localStorage.getItem("sessionIdOa"),
              "provinceId": this. provinceId         
            },
            success : function(data) {
              if(data.code == 200){
                var erList = data.data;
                var province=[];    //省份（实际用来盛放X轴坐标值）
                var provinceCount=[];    //省份客户数（实际用来盛放Y坐标值）

                erList = this.JsonSort(erList,"number")
                for(var i=0;i<erList.length;i++){
                  if(erList[i].cityName==undefined){
      
                  }else{
                    province.push(erList[i].cityName);    //挨个取出时间并填入时间数组
                  }
                }
                var maxUser = erList[0].number;
                this.cityName = erList[0].provinceName
                for (var i = 1; i < erList.length; i++) {
                  // 如果元素当前值大于max,就把这个当前值赋值给max
                  if (erList[i].count > maxUser) {
                    maxUser = erList[i].number;
                  }
                }
                for(var i=0;i<erList.length;i++){
                  provinceCount.push(erList[i].number);    //挨个取出用户量并填入用户量数组
                }
  
                this.rightCity = erList;
              }else {
                this.$refs.childAlert.show(data["msg"]);
              }

            }.bind(this),
            error : function() {

            }
        });
    },
    showArea: function(){
      this.provChose = false;
      this.areaChose = true;  
      this.checked = "checked";
      this.check = "";
    },
    showProv: function(){
      this.areaChose = false;
      this.provChose = true;
      this.check = "check";
      this.checked = "";
    },
    closePop: function(){
      this.isShowCover = false;
      this.isShowDetail = false;
    },
    getEchartZx: function(){  //费用趋势折线图（全国）          
        this.startTimeString = this.formatDate2(new Date()) +"01";
        this.endTimeString = this.formatDate1(new Date()) +"01";  
        $.ajax({
            type : "post",
            url : this.path + "findAllCustomerNumIncrease",
            data : {
              "jobNumber": localStorage.getItem("jobNumber"),
              "sessionIdOa": localStorage.getItem("sessionIdOa"),
              "startTimeString": this.startTimeString,
              "endTimeString": this.endTimeString
            },
            success : function(data) {
              if(data.code == 200){
                var nums=[];
                for(var i=0;i<data["data"].length;i++){
                    nums.push(data["data"][i].date);
                }
                //时间
                var timeQ = this.getYearAndMonth(this.startTimeString,this.endTimeString);
                var timeYear = []
                for(var i=0;i<timeQ.length;i++){
                  var yearMon = '';
                  timeQ[i].month = (timeQ[i].month < 10)?("0" + timeQ[i].month):timeQ[i].month;
                  yearMon = timeQ[i].year +"-" + timeQ[i].month;
                  timeYear.push(yearMon)
                }
  
                var moneyArr =[];
                var money = data["data"][0].numIncrease;
                for(var i=0;i<data["data"].length;i++){
                    money += data["data"][i].number;
                    moneyArr.push(money) 
                }
              
                this.option = {
                    title: {
                      text: '客户总数',
                      left: 50
                    },
                    tooltip : {
                      trigger: 'axis'
                    },
                    color:['#48A9EF', '#99D97C','#FFD562','#F37A70','#8997E7','#99C1FF','#54BFB7','#2E789B'],
                    legend: {
                        data:['客户总数']
                    },
                    calculable : true,
                    xAxis : [
                        {
                            type : 'category',
                            boundaryGap : false,
                            data : timeYear
                        }
                    ],
                    yAxis : [
                        {
                            type : 'value'
                        }
                    ],
                    series : [
                        {
                            name:'客户总数',
                            type:'line',
                            stack: '总量',
                            symbol:'pin',//拐点样式
                            symbolSize: 15,//拐点大小
                            itemStyle : {
                                normal : {
                                    lineStyle:{
                                        width:1//折线宽度
                                    }
                                }
                            },
                            data:moneyArr
                        }
                       
                        
                    ]
                    
  
  
                }
                var myChartZxt = echarts.init(document.getElementById('myChartZxt'));
                myChartZxt.setOption(this.option)
              }else {
                this.$refs.childAlert.show(data["msg"]);
              }
              
            }.bind(this),
            error : function() {
            }
        });
    }, 
    getEchartZxArea: function(){  //费用趋势折线图（区域）          
        this.startTimeString = this.formatDate2(new Date()) +"01";
        this.endTimeString = this.formatDate1(new Date()) +"01";  
        $.ajax({
            type : "post",
            url : this.path + "findAllCustomerNumIncrease",
            data : {
              "jobNumber": localStorage.getItem("jobNumber"),
              "sessionIdOa": localStorage.getItem("sessionIdOa"),
              "startTimeString": this.startTimeString,
              "endTimeString": this.endTimeString,
              "areaId": this.areaId
            },
            success : function(data) {
              if(data.code == 200){
                var nums=[];
                for(var i=0;i<data["data"].length;i++){
                    nums.push(data["data"][i].date);
                }
                //时间
                var timeQ = this.getYearAndMonth(this.startTimeString,this.endTimeString);
                var timeYear = []
                for(var i=0;i<timeQ.length;i++){
                  var yearMon = '';
                  timeQ[i].month = (timeQ[i].month < 10)?("0" + timeQ[i].month):timeQ[i].month;
                  yearMon = timeQ[i].year +"-" + timeQ[i].month;
                  timeYear.push(yearMon)
                }
  
                var moneyArr =[];
                var money = data["data"][0].numIncrease;
                for(var i=0;i<data["data"].length;i++){
                    money += data["data"][i].number;
                    moneyArr.push(money) 
                }
              
                this.option = {
                    title: {
                      text: '客户总数',
                      left: 50
                    },
                    tooltip : {
                      trigger: 'axis'
                    },
                    color:['#48A9EF', '#99D97C','#FFD562','#F37A70','#8997E7','#99C1FF','#54BFB7','#2E789B'],
                    legend: {
                        data:['客户总数']
                    },
                    calculable : true,
                    xAxis : [
                        {
                            type : 'category',
                            boundaryGap : false,
                            data : timeYear
                        }
                    ],
                    yAxis : [
                        {
                            type : 'value'
                        }
                    ],
                    series : [
                        {
                            name:'客户总数',
                            type:'line',
                            stack: '总量',
                            symbol:'pin',//拐点样式
                            symbolSize: 15,//拐点大小
                            itemStyle : {
                                normal : {
                                    lineStyle:{
                                        width:1//折线宽度
                                    }
                                }
                            },
                            data:moneyArr
                        }
                       
                        
                    ]
                    
  
  
                }
                var myChartZxt = echarts.init(document.getElementById('myChartZxt'));
                myChartZxt.setOption(this.option)
              }else {
                this.$refs.childAlert.show(data["msg"]);
              }
                            
            }.bind(this),
            error : function() {
            }
        });
    }, 
    formatDate1: function(date){ //时间转化上一个月
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
       return y + '-' + m + '-';
    },
    formatDate2: function(date){ //时间转化最近 6个月
       var y = date.getFullYear();  
       var m = date.getMonth() - 5; 
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
       return y + '-' + m + '-';
    },
    getYearAndMonth: function(start,end){ //获取两个时间段中间的月份
       var result = [];
       var starts = start.split('-');
       var ends = end.split('-');
       var staYear = parseInt(starts[0]);
       var staMon = parseInt(starts[1]-1);
       var endYear = parseInt(ends[0]);
       var endMon = parseInt(ends[1]);
       while (staYear <= endYear) {
           if (staYear === endYear) {
               while (staMon < endMon) {
                   staMon++;
                   result.push({year: staYear, month: staMon});
               }
               staYear++;
           } else {
               staMon++;
               if (staMon > 12) {
                   staMon = 1;
                   staYear++;
               }
               result.push({year: staYear, month: staMon});
           }
       }
       return result;
    },
    areaChange: function(k,areaId){ //折线图区域点击
      if(k==-1){
         this.allcolor = "check";
         this.areaId = '';
         for(var i=0;i<this.areaCheck.length;i++){
            this.areaCheck[i].check = ""
         }
         this.getEchartZxArea();
      }else{
         this.areaId = areaId;
         this.allcolor = "";
         for(var i=0;i<this.areaCheck.length;i++){
             if(k==i){
               this.areaCheck[i].check = "check"
             }else{
               this.areaCheck[i].check = ""
             }
         }
         this.getEchartZxArea();
         
      }
    },
    JsonSort: function(json,key){
      for(var j=1,jl=json.length;j < jl;j++){
        var temp = json[j],
            val  = temp[key],
            i    = j-1;
        while(i >=0 && json[i][key] < val){
            json[i+1] = json[i];
            i = i-1;    
        }
        json[i+1] = temp;        
      }
      return json;

    }
    
  }
   
}
</script>
