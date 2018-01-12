<template>
  <div class="charts">
      <div class="gonggao_bread">
        <a href="#/mainIndex/index" class="fa">首页</a>
        &gt;
        <span>统计管理</span>
        &gt;
        <span>费用统计</span>
      </div>


    <div class="gonggao_body" style="position:relative;overflow:hidden;zoom: 1;">
        <div style="width:60%;float: left;">
           <div class="menEdit" style="margin-left: 60px;line-height: 40px">
                 <span v-on:click="seacherPeople"  style="color: #00a1e9;cursor: pointer;">{{ aygck }}</span>
                 <span v-on:click="seacherProvince" style="color: #00a1e9;cursor: pointer;margin-left: 10px">{{ asfck }}</span>
            </div>
            <div class="menEdit" style="margin-left: 50px;">
                 <span class="areaP" v-bind:class="[allcolor]" v-if="areaList.length != 1" v-on:click="areaChange(-1)">全国</span>
                 <span class="areaP" v-bind:class="[areaCheck[k].check]" v-if="areaShow" v-for="(area,k) in areaList" v-on:click="areaChange(k,area.areaId)">{{ area.areaName.substring(3) }}</span>
            </div>
            <div class="menEdit" style="width:100%;margin:10px 50px;">
                 <span>选择日期：</span>

                 <el-date-picker
                   v-model="time1"
                   type="month"
                   value-format="yyyy-MM"
                   placeholder="选择月">
                 </el-date-picker>

                 <span>至</span>

                 <el-date-picker
                   v-model="time2"
                   type="month"
                   value-format="yyyy-MM"
                   placeholder="选择月">
                 </el-date-picker>     
                 <span class="btn-blue-s" v-on:click="seacherEchart" >查询</span>
            </div>
            
            <!--创建费用趋势折线图-->
            <div id="myChart" style="width:100%; height:300px;"></div>
        </div>
        <div style="width:10px;height: 100%;position:absolute;top: 0px;left: 62%;background-color: #E3E3E3"></div>
        <div style="width:35%;float: right;">
            <div class="menEdit" style="margin:0px 0px 20px 0px;">
                     <span>选择日期：</span>
                     <el-date-picker
                       v-model="time4"
                       type="month"
                       value-format="yyyy-MM"
                       placeholder="选择月">
                     </el-date-picker>
                     <span class="btn-blue-s" v-on:click="seacherPie" >查询</span>
            </div>
            <!--创建费用分布饼状图-->
           <div id="myChartPie" style="width:100%; height:350px;"></div>
        </div>
    </div>

    <div id="divWidth" class="gonggao_body" style="margin-top: 10px">
        <div class="menEdit" style="margin-left: 50px;">
             <span class="areaP" v-bind:class="[allcolorBar]" v-if="areaList.length != 1" v-on:click="areaBar(-1)">全国</span>
             <span class="areaP" v-bind:class="[areaCheckBar[k].check]" v-if="areaShow" v-for="(area,k) in areaList" v-on:click="areaBar(k,area.areaId)">{{ area.areaName.substring(3) }}</span>
             <span style="margin-left: 20px">选择日期：</span>
             <el-date-picker
               v-model="time3"
               type="month"
               value-format="yyyy-MM"
               placeholder="选择月">
             </el-date-picker>
             <span class="btn-blue-s" v-on:click="seacherEchartBar" >查询</span>
             <span v-on:click="provinceChose" v-if="userPro==0" style="color: #00a1e9;cursor: pointer;float: right;margin-right: 50px">按员工查看</span>
             <span v-on:click="userChose" v-if="userPro==1" style="color: #00a1e9;cursor: pointer;float: right;margin-right: 50px">按省份查看</span>
       
        </div>
        

        <!--按省份查看-->
        <div class="menEdit provinceLook" v-bind:class="[showOrHide]">
            <!--创建费用统计柱状图-->
           <div id="barChart" style="width:100%; height:300px;"></div>
        </div>

        <!--按人员查看-->
        <div class="menEdit userLook"  v-bind:class="[hideOrShow]">
            <!--创建费用统计柱状图（人员）-->
           <div id="barUserChart" style="width:100%; height:300px;"></div>
        </div>
    </div>


    <div class="bgpop" v-if="isShowCover"></div>
    <div class="view_area lookDiv" style="width: 300px;height: 230px;padding: 5px 20px" v-if="isShowDetail">
         <div class="peoMen" style="font-size: 20px;font-weight: 700;text-align: center" > {{ listName }} </div>
               
          <div class="peoMenEdit" style="width: 100%;margin-top: 10px">
              <span>区域：</span>             
              <select name="" class="deptChoose" v-model="areaCho" v-on:change="areaChangeChose(areaCho)" >
                  <option value="">请选择</option>
                  <option v-for="area in findArea"  v-bind:value="area.areaId">{{ area.areaName }}</option>
              </select>
          </div>

          <div class="peoMenEdit" style="width: 100%;margin-top: 10px">
              <span>省份：</span>
              <select name="" id="prov" class="deptChoose" v-model="provinceCho" v-on:change="provinceChangeChose(provinceCho)" >
                  <option value="">请选择</option>
                  <option v-for="prov in province"  v-bind:value="prov.provinceId">{{ prov.province }}</option>
              </select>             
          </div>

          <div class="peoMenEdit" style="width: 100%;margin-top: 10px" v-if="peoOrPro">
              <span>员工：</span>
              <select name="" id="peopl" class="deptChoose" v-model="peopleCho" v-on:change="peopleChangeChose" >
                  <option value="">请选择</option>
                  <option v-for="peo in people"  v-bind:value="peo.userId">{{ peo.userName }}</option>
              </select>
          </div>

          <div class="view_btn" style="margin-top: 20px">
               <span class="btn-blue-s" v-on:click="submitChose">确定</span>
               <span class="btn-yellow-s" v-on:click="closePop">取消</span>
          </div>
    </div>

    <oa-alert ref="childAlert"></oa-alert>
    
    
  </div>  
</template>
<style>
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
      .el-date-editor .el-range-separator {
        width: 20px;
      }
      #app .el-date-editor.el-input, .el-date-editor.el-input__inner{width:150px;cursor:pointer;}
      .el-input__inner{height:30px;line-height:30px;cursor:pointer;border:1px solid #C9C9C9;}
      .el-input__icon{line-height:30px;}
      .provinceLook {
        display: block;
      }
      .provinceLook.check {
        display: none;
      }
      .userLook {
        display: block;
      }
      .userLook.check {
        display: none;
      }
</style>

 
<script>
import $ from 'jquery'
var echarts = require('echarts')
import oaPage from '@/components/commonVue/Page'
import oaAlert from '@/components/commonVue/Alert'
export default {
  name: 'ProgressSearch',
  components: {
      'oa-page': oaPage,
      'oa-alert': oaAlert
    },
  data () {
    return {
      path: this.OACommon["publicDef"]["qpath"],      
      showOrHide: '',
      hideOrShow: 'check',
      areaId: 0, //折线图区域ID
      provinceId: 0, //折线图省份ID
      userId: 0, //折线图人员ID
      zxtName: '',
      aygck: '按员工查看',
      asfck: '按省份查看',
      time1: '',  //折线图开始时间
      time2: '',  //折线图结束时间
      time3: '',  //柱状图时间
      time4: '',  //饼图时间
      timeString:'', //开始时间
      timeStringEnd: '', //结束时间
      userPro: '0',
      areaShow: false,
      isShowCover: false,  //是否显示遮盖层
      isShowDetail: false, //是否显示详情弹层
      option: '', //折线图option
      option1: '', //柱状图option1
      option2: '', //柱状图option2
      optionPie: '', //饼图option2
      zt: [], //后台数据操作
      ztBar: [], //后台数据操作
      ztBar2: [], //后台数据操作
      ztBarPie: [], //后台数据操作
      allcolor:"", //全国选中
      areaList: [], //区域遍历
      areaCheck:[],  //区域颜色遍历
      areaBarId:'', //柱状图区域ID
      areaPieId:'', //饼图区域ID
      allcolorBar:"", //柱状图全国选中
      areaCheckBar:[],  //柱状图区域颜色遍历
      listName: '',
      peoOrPro: false,
      areaCho:'',  //区域选中
      provinceCho:'',  //省份选中（省份ID）
      peopleCho:'',  //人员选中
      findArea:[],  //区域
      province:[],  //省份
      people:[]  //人员
         
    }
  },
  created: function () {       
       this.userArea();
  },
  methods: {  
    getEchart: function(){  //费用趋势折线图（全国）
        this.areaId = 0;
        if(this.time1){
          this.timeString = this.time1 + "-01";
        }else {
          this.timeString = this.formatDate2(new Date()) +"01";
        }
        if(this.time2){
          this.endTimeString = this.time2 + "-01";
        }else {
          this.timeStringEnd = this.formatDate1(new Date()) +"01";
        }
        if(!this.provinceCho){
          this.provinceCho = 0;
        }
        if(!this.peopleCho){
          this.peopleCho = 0;
        }

        this.zxtSeacher();
        
    }, 
    formatDate: function(date){ //时间转化器
       var y = date.getFullYear();  
       var m = date.getMonth() +1; 
       if(m > 12){
          y = y + 1;
          m = m -12;
       } 
       m = m < 10 ? '0' + m : m;  
       var d = date.getDate();  
       d = d < 10 ? ('0' + d) : d;  
       return y + '-' + m + '-';
    },
    formatDate1: function(date){ //时间转化上一个月
       var y = date.getFullYear();  
       var m = date.getMonth() + 1;  
       if(m > 12){
          y = y + 1;
          m = m -12;
       }
       m = m < 10 ? '0' + m : m;  
       var d = date.getDate();  
       d = d < 10 ? ('0' + d) : d;  
       return y + '-' + m + '-';
    },
    formatDate2: function(date){ //时间转化最近 6个月
       var y = date.getFullYear();  
       var m = date.getMonth() - 5;
       if(m < 1){
          y = y - 1;
          m = 12 - Math.abs(m);
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
               if(this.areaList.length == 1){
                   this.areaShow = false;
                   this.seacherArea(this.areaList[0].areaId);
                   this.getEchartBarArea(this.areaList[0].areaId);                   
                   this.getEchartBarUser(this.areaList[0].areaId);                   
                   this.getEchartPie(this.areaList[0].areaId); 
                   this.allcolor = "";                  
                   this.allcolorBar = "";                  
                   this.areaCheck.push({
                     "check": "check"
                   });
                   this.areaCheckBar.push({
                     "check": "check"
                   });
               }else {
                    this.areaShow = true;
                    for(var i=0;i<this.areaList.length;i++){
                        this.areaCheck.push({
                          "check": ""
                        });
                        this.areaCheckBar.push({
                          "check": ""
                        });
                    }
                   this.getEchart();
                   this.getEchartBar();
                   this.getEchartUser();
                   this.getEchartPieAll();
                   this.allcolor = "check"; 
                   this.allcolorBar = "check"; 
               }               
           }else {
             this.$refs.childAlert.show(data["msg"]);
           }
   
         }.bind(this),
         error : function() {
         }
      });
    },
    zxtSeacher: function(){ //费用趋势折线图     
        $.ajax({
            type : "post",
            url : this.path + "selectUserCostkStaticTrend",
            data : {
              "jobNumber": localStorage.getItem("jobNumber"),
              "sessionIdOa": localStorage.getItem("sessionIdOa"),
              "startTimeString": this.timeString,
              "endTimeString": this.timeStringEnd,
              "areaId": this.areaId,
              "provinceId": this.provinceCho,
              "userId": this.peopleCho
            },
            success : function(data) {
              if(data.code == 200){
                var nums=[];
                for(var i=0;i<data["data"].length;i++){
                    nums.push(data["data"][i].date);
                }  
                //时间
                var timeQ = this.getYearAndMonth(this.timeString,this.timeStringEnd);
                var timeYear = []
                for(var i=0;i<timeQ.length;i++){
                  var yearMon = '';
                  timeQ[i].month = (timeQ[i].month < 10)?("0" + timeQ[i].month):timeQ[i].month;
                  yearMon = timeQ[i].year +"-" + timeQ[i].month;
                  timeYear.push(yearMon)
                }
  
                this.zt =[];
                for(var i=0;i<data["data"].length;i++){
                    var ej = data["data"][i]
                    for(var j=0;j<ej.length;j++){
                      this.zt.push({
                          "date": ej[j].date,
                          "money": ej[j].money,
                          "costCategory": ej[j].costCategory
                      })
                    }
                }
  
                var grfy = [];          //1
                var kkfy = [];          //2
                var xxtra = [];         //3
                var kk = [];         //4
                var costCategoryOjb = {};   //根据costCategory组装值
                for(var c=0;c<this.zt.length;c++){
                  var cos = this.zt[c]["costCategory"];
                  if(!costCategoryOjb[cos]){
                    costCategoryOjb[cos] = [];
                    costCategoryOjb[cos].push(this.zt[c]);
                  }else{
                    costCategoryOjb[cos].push(this.zt[c]);
                  }
                }
                if(costCategoryOjb[1]){
                      for(var t=0;t<timeYear.length;t++){
                      var grfyFlag = 1;  //判断是否时间匹配上了
                      for(var ti=0;ti<costCategoryOjb[1].length;ti++){
                        if(timeYear[t] == costCategoryOjb[1][ti]["date"]){
                          grfy.push(costCategoryOjb[1][ti]["money"]);
                          grfyFlag = 2;
                          break;
                        }
                      }
                      if(grfyFlag == 1){
                        grfy.push(0);
                      }
                    }
    
                }else {
                   grfy = [0,0,0,0,0,0,0];
                }
                if(costCategoryOjb[2]){
                   for(var t1=0;t1<timeYear.length;t1++){
                   var grfyFlag = 1;  //判断是否时间匹配上了
                   for(var tj=0;tj<costCategoryOjb[2].length;tj++){
                     if(timeYear[t1] == costCategoryOjb[2][tj]["date"]){
                       kkfy.push(costCategoryOjb[2][tj]["money"]);
                       grfyFlag = 2;
                       break;
                     }
                   }
                   if(grfyFlag == 1){
                     kkfy.push(0);
                   }
                 }
   
                }else {
                  kkfy = [0,0,0,0,0,0,0];
                }
                if(costCategoryOjb[3]){
                    for(var t2=0;t2<timeYear.length;t2++){
                   var grfyFlag = 1;  //判断是否时间匹配上了
                   for(var tk=0;tk<costCategoryOjb[3].length;tk++){
                     if(timeYear[t2] == costCategoryOjb[3][tk]["date"]){
                       xxtra.push(costCategoryOjb[3][tk]["money"]);
                       grfyFlag = 2;
                       break;
                     }
                   }
                   if(grfyFlag == 1){
                     xxtra.push(0);
                   }
                  }
  
                }else {
                  xxtra = [0,0,0,0,0,0,0];
                }

                if(costCategoryOjb[4]){
                    for(var t2=0;t2<timeYear.length;t2++){
                   var grfyFlag = 1;  //判断是否时间匹配上了
                   for(var tk=0;tk<costCategoryOjb[4].length;tk++){
                     if(timeYear[t2] == costCategoryOjb[4][tk]["date"]){
                       kk.push(costCategoryOjb[4][tk]["money"]);
                       grfyFlag = 2;
                       break;
                     }
                   }
                   if(grfyFlag == 1){
                     kk.push(0);
                   }
                  }
  
                }else {
                  kk = [0,0,0,0,0,0,0];
                }
              
              
                this.option = {
                    title: {
                      text: '费用趋势',
                      left: 50
                    },
                    tooltip : {
                      trigger: 'axis'
                    },
                    color:['#48A9EF', '#99D97C','#FFD562','#F37A70','#8997E7','#99C1FF','#54BFB7','#2E789B'],
                    legend: {
                        data:['个人统筹费用','Extra','区域费用','开课费用']
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
                            name:'个人统筹费用',
                            type:'line',
                            stack: '个人统筹费用',
                            symbol:'pin',//拐点样式
                            symbolSize: 15,//拐点大小
                            data:grfy
                        },
                        {
                            name:'Extra',
                            type:'line',
                            stack: 'Extra',
                            symbol:'droplet',//拐点样式
                            data:kkfy
                        },
                        {
                            name:'区域费用',
                            type:'line',
                            stack: '区域费用',
                            symbol:'arrow',//拐点样式
                            data:xxtra
                        },
                        {
                            name:'开课费用',
                            type:'line',
                            stack: '开课费用',
                            data:kk
                        }
                        
                    ]
                    
  
  
                }
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
    seacherArea: function(areaId){ //费用趋势折线图（区域）
        this.areaId = areaId;
        if(this.time1){
          this.timeString = this.time1 + "-01";
        }else {
          this.timeString = this.formatDate2(new Date()) +"01";
        }
        if(this.time2){
          this.timeStringEnd = this.time2 + "-01";
        }else {
          this.timeStringEnd = this.formatDate1(new Date()) +"01";
        }
        this.zxtSeacher();

    }, 
    areaChange: function(k,areaId){ //折线图区域点击
      this.provinceCho = 0;
      this.peopleCho = 0;
      if(k==-1){
         this.allcolor = "check";
         this.areaId = 0;
         for(var i=0;i<this.areaCheck.length;i++){
            this.areaCheck[i].check = ""
          }
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
         
      }
    },
    areaBar: function(k,areaId){ //柱状图区域点击
      if(k==-1){
         this.allcolorBar = "check";
         this.areaBarId = '';  
         for(var i=0;i<this.areaCheckBar.length;i++){
            this.areaCheckBar[i].check = ""
          }       
      }else{
         this.areaBarId = areaId;
         this.allcolorBar = "";
         for(var i=0;i<this.areaCheckBar.length;i++){
             if(k==i){
               this.areaCheckBar[i].check = "check"
             }else{
               this.areaCheckBar[i].check = ""
             }
         }
         
      }
    },
    seacherEchart: function(){ //查询费用趋势折线图
      this.zxtSeacher();
    },
    getEchartBar: function(){  //费用统计柱状图（全国按省份）
        this.areaBarId = '';
        if(this.time3){
          this.time3 = this.time3 + "-01";
        }else {
          this.time3 = this.formatDate1(new Date()) +"01";          
        }   
        $.ajax({
            type : "post",
            url : this.path + "selectUserCostStaticByProvince",
            data : {
              "jobNumber": localStorage.getItem("jobNumber"),
              "sessionIdOa": localStorage.getItem("sessionIdOa"),
              "timeString": this.time3
            },
            success : function(data) {
              if(data.code == 200){
                var areaBar =[];
                for(var i=0;i<data["data"].length;i++){
                    var ej = data["data"][i]
                    areaBar.push(ej[0].provinceName)
                    // for(var j=0;j<ej.length;j++){
                    //   areaBar.push(ej[j].provinceName)
                    // }
                }
                this.ztBar =[];
                for(var i=0;i<data["data"].length;i++){
                    var ej = data["data"][i]
                    for(var j=0;j<ej.length;j++){
                      this.ztBar.push({
                          "provinceName": ej[j].provinceName,
                          "money": ej[j].money,
                          "costCategory": ej[j].costCategory
                      })
                    }
                }
  
                var grfy = [];          //1
                var kkfy = [];          //2
                var xxtra = [];         //3
                var kk = [];         //4
                var costCategoryOjb = {};   //根据costCategory组装值
                for(var c=0;c<this.ztBar.length;c++){
                  var cos = this.ztBar[c]["costCategory"];
                  if(!costCategoryOjb[cos]){
                    costCategoryOjb[cos] = [];
                    costCategoryOjb[cos].push(this.ztBar[c]);
                  }else{
                    costCategoryOjb[cos].push(this.ztBar[c]);
                  }
                }
                if(costCategoryOjb[1]){
                      for(var t=0;t<areaBar.length;t++){
                      var grfyFlag = 1;  //判断是否时间匹配上了
                      for(var ti=0;ti<costCategoryOjb[1].length;ti++){
                        if(areaBar[t] == costCategoryOjb[1][ti]["provinceName"]){
                          grfy.push(costCategoryOjb[1][ti]["money"]);
                          grfyFlag = 2;
                          break;
                        }
                      }
                      if(grfyFlag == 1){
                        grfy.push(0);
                      }
                    }
    
                }else {
                  for(var i=0;i<areaBar.length;i++){
                    grfy.push(0)
                  }
                }
                if(costCategoryOjb[2]){
                   for(var t1=0;t1<areaBar.length;t1++){
                   var grfyFlag = 1;  //判断是否时间匹配上了
                   for(var tj=0;tj<costCategoryOjb[2].length;tj++){
                     if(areaBar[t1] == costCategoryOjb[2][tj]["provinceName"]){
                       kkfy.push(costCategoryOjb[2][tj]["money"]);
                       grfyFlag = 2;
                       break;
                     }
                   }
                   if(grfyFlag == 1){
                     kkfy.push(0);
                   }
                 }
   
                }else {
                  for(var i=0;i<areaBar.length;i++){
                    kkfy.push(0)
                  }
                }
                if(costCategoryOjb[3]){
                    for(var t2=0;t2<areaBar.length;t2++){
                   var grfyFlag = 1;  //判断是否时间匹配上了
                   for(var tk=0;tk<costCategoryOjb[3].length;tk++){
                     if(areaBar[t2] == costCategoryOjb[3][tk]["provinceName"]){
                       xxtra.push(costCategoryOjb[3][tk]["money"]);
                       grfyFlag = 2;
                       break;
                     }
                   }
                   if(grfyFlag == 1){
                     xxtra.push(0);
                   }
                  }
  
                }else {
                  for(var i=0;i<areaBar.length;i++){
                    xxtra.push(0)
                  }
  
                }

                if(costCategoryOjb[4]){
                    for(var t2=0;t2<timeYear.length;t2++){
                   var grfyFlag = 1;  //判断是否时间匹配上了
                   for(var tk=0;tk<costCategoryOjb[4].length;tk++){
                     if(timeYear[t2] == costCategoryOjb[4][tk]["date"]){
                       kk.push(costCategoryOjb[4][tk]["money"]);
                       grfyFlag = 2;
                       break;
                     }
                   }
                   if(grfyFlag == 1){
                     kk.push(0);
                   }
                  }
  
                }else {
                  kk = [0,0,0,0,0,0,0];
                }
                            
  
                this.option1 = {
                    title: {
                      text: '费用统计',
                      left: 50
                    },
                    tooltip : {
                        trigger: 'axis',
                        axisPointer : {            // 坐标轴指示器，坐标轴触发有效
                            type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
                        }
                    },
                    color:['#48A9EF', '#99D97C','#FFD562','#F37A70','#8997E7','#99C1FF','#54BFB7','#2E789B'],
                    legend: {
                        data:['个人统筹费用','Extra','区域费用','开课费用']
                    },
                    toolbox: {
                        show : false,
                        orient: 'vertical',
                        x: 'right',
                        y: 'center',
                        feature : {
                            mark : {show: true},
                            dataView : {show: true, readOnly: false},
                            magicType : {show: true, type: ['line', 'bar', 'stack', 'tiled']},
                            restore : {show: true},
                            saveAsImage : {show: true}
                        }
                    },
                    calculable : true,
                    xAxis : [
                        {
                            type : 'category',
                            data : areaBar
                        }
                    ],
                    yAxis : [
                        {
                            type : 'value'
                        }
                    ],
                    series : [                    
                        {
                            name:'个人统筹费用',
                            type:'bar',
                            stack: '费用',
                            data: grfy
                        },
                        {
                            name:'Extra',
                            type:'bar',
                            stack: '费用',
                            data: kkfy
                        },
                        {
                            name:'区域费用',
                            type:'bar',
                            stack: '费用',
                            data: xxtra
                        },
                        {
                            name:'开课费用',
                            type:'bar',
                            stack: '费用',
                            data: kk
                        }
                       
                    ]
                };
                                    
                var barChart = echarts.init(document.getElementById('barChart'));
                barChart.setOption(this.option1)

              }else {
                this.$refs.childAlert.show(data["msg"]);
              }
              
            }.bind(this),
            error : function() {
            }
        });
    }, 
    getEchartBarArea: function(areaBarId){  //费用统计柱状图（区域按省份）
        this.areaBarId = areaBarId;
        if(this.time3){
          this.time3 = this.time3 + "-01";
        }else {
          this.time3 = this.formatDate1(new Date()) +"01";
        } 
        $.ajax({
            type : "post",
            url : this.path + "selectUserCostStaticByProvince",
            data : {
              "jobNumber": localStorage.getItem("jobNumber"),
              "sessionIdOa": localStorage.getItem("sessionIdOa"),
              "timeString": this.time3,
              "areaId": this.areaBarId
            },
            success : function(data) {

              if(data.code == 200){
                var areaBar =[];
                for(var i=0;i<data["data"].length;i++){
                    var ej = data["data"][i]
                    areaBar.push(ej[0].provinceName)
                    // for(var j=0;j<ej.length;j++){
                    //   areaBar.push(ej[j].provinceName)
                    // }
                }
  
                this.ztBar =[];
                for(var i=0;i<data["data"].length;i++){
                    var ej = data["data"][i]
                    for(var j=0;j<ej.length;j++){
                      this.ztBar.push({
                          "provinceName": ej[j].provinceName,
                          "money": ej[j].money,
                          "costCategory": ej[j].costCategory
                      })
                    }
                }
  
                var grfy = [];          //1
                var kkfy = [];          //2
                var xxtra = [];         //3
                var kk = [];         //4
                var costCategoryOjb = {};   //根据costCategory组装值
                for(var c=0;c<this.ztBar.length;c++){
                  var cos = this.ztBar[c]["costCategory"];
                  if(!costCategoryOjb[cos]){
                    costCategoryOjb[cos] = [];
                    costCategoryOjb[cos].push(this.ztBar[c]);
                  }else{
                    costCategoryOjb[cos].push(this.ztBar[c]);
                  }
                }
                if(costCategoryOjb[1]){
                      for(var t=0;t<areaBar.length;t++){
                      var grfyFlag = 1;  //判断是否时间匹配上了
                      for(var ti=0;ti<costCategoryOjb[1].length;ti++){
                        if(areaBar[t] == costCategoryOjb[1][ti]["provinceName"]){
                          grfy.push(costCategoryOjb[1][ti]["money"]);
                          grfyFlag = 2;
                          break;
                        }
                      }
                      if(grfyFlag == 1){
                        grfy.push(0);
                      }
                    }
    
                }else {
                  for(var i=0;i<areaBar.length;i++){
                    grfy.push(0)
                  }
                }
                if(costCategoryOjb[2]){
                   for(var t1=0;t1<areaBar.length;t1++){
                   var grfyFlag = 1;  //判断是否时间匹配上了
                   for(var tj=0;tj<costCategoryOjb[2].length;tj++){
                     if(areaBar[t1] == costCategoryOjb[2][tj]["provinceName"]){
                       kkfy.push(costCategoryOjb[2][tj]["money"]);
                       grfyFlag = 2;
                       break;
                     }
                   }
                   if(grfyFlag == 1){
                     kkfy.push(0);
                   }
                 }
  
                }else {
                  for(var i=0;i<areaBar.length;i++){
                    kkfy.push(0)
                  }
                }
                if(costCategoryOjb[3]){
                    for(var t2=0;t2<areaBar.length;t2++){
                   var grfyFlag = 1;  //判断是否时间匹配上了
                   for(var tk=0;tk<costCategoryOjb[3].length;tk++){
                     if(areaBar[t2] == costCategoryOjb[3][tk]["provinceName"]){
                       xxtra.push(costCategoryOjb[3][tk]["money"]);
                       grfyFlag = 2;
                       break;
                     }
                   }
                   if(grfyFlag == 1){
                     xxtra.push(0);
                   }
                  }
  
                }else {
                  for(var i=0;i<areaBar.length;i++){
                    xxtra.push(0)
                  }
  
                }

                if(costCategoryOjb[4]){
                    for(var t2=0;t2<timeYear.length;t2++){
                   var grfyFlag = 1;  //判断是否时间匹配上了
                   for(var tk=0;tk<costCategoryOjb[4].length;tk++){
                     if(timeYear[t2] == costCategoryOjb[4][tk]["date"]){
                       kk.push(costCategoryOjb[4][tk]["money"]);
                       grfyFlag = 2;
                       break;
                     }
                   }
                   if(grfyFlag == 1){
                     kk.push(0);
                   }
                  }
  
                }else {
                  kk = [0,0,0,0,0,0,0];
                }
              
                this.option1 = {
                    title: {
                      text: '费用统计',
                      left: 50
                    },
                    tooltip : {
                        trigger: 'axis',
                        axisPointer : {            // 坐标轴指示器，坐标轴触发有效
                            type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
                        }
                    },
                    color:['#48A9EF', '#99D97C','#FFD562','#F37A70','#8997E7','#99C1FF','#54BFB7','#2E789B'],
                    legend: {
                        data:['个人统筹费用','Extra','区域费用','开课费用']
                    },
                    toolbox: {
                        show : false,
                        orient: 'vertical',
                        x: 'right',
                        y: 'center',
                        feature : {
                            mark : {show: true},
                            dataView : {show: true, readOnly: false},
                            magicType : {show: true, type: ['line', 'bar', 'stack', 'tiled']},
                            restore : {show: true},
                            saveAsImage : {show: true}
                        }
                    },
                    calculable : true,
                    xAxis : [
                        {
                            type : 'category',
                            data : areaBar
                        }
                    ],
                    yAxis : [
                        {
                            type : 'value'
                        }
                    ],
                    series : [                    
                        {
                            name:'个人统筹费用',
                            type:'bar',
                            stack: '费用',
                            data: grfy
                        },
                        {
                            name:'Extra',
                            type:'bar',
                            stack: '费用',
                            data: kkfy
                        },
                        {
                            name:'区域费用',
                            type:'bar',
                            stack: '费用',
                            data: xxtra
                        },
                        {
                            name:'开课费用',
                            type:'bar',
                            stack: '费用',
                            data: kk
                        }
                       
                    ]
                };
                      
    
                      
  
                
                var barChart = echarts.init(document.getElementById('barChart'));
                barChart.setOption(this.option1)
              }else {
                this.$refs.childAlert.show(data["msg"]);
              }                            
            }.bind(this),
            error : function() {
            }
        });       
    }, 
    getEchartUser: function(){  //费用统计柱状图（全国按人员）
        this.areaBarId = '';
        if(this.time3){
          this.time3 = this.time3;
        }else {
          this.time3 = this.formatDate(new Date()) +"01";
        }   
        $.ajax({
            type : "post",
            url : this.path + "selectUserCostkStaticByUserId",
            data : {
              "jobNumber": localStorage.getItem("jobNumber"),
              "sessionIdOa": localStorage.getItem("sessionIdOa"),
              "timeString": this.time3
            },
            success : function(data) {
              if(data.code == 200){
                var areaBar =[];
                for(var i=0;i<data["data"].length;i++){
                    var ej = data["data"][i]
                    areaBar.push(ej[0].userName)
                }
  
                this.ztBar2 =[];
                for(var i=0;i<data["data"].length;i++){
                    var ej = data["data"][i]
                    for(var j=0;j<ej.length;j++){
                      this.ztBar2.push({
                          "userName": ej[j].userName,
                          "money": ej[j].money,
                          "costCategory": ej[j].costCategory
                      })
                    }
                }
  
                var grfy = [];          //1
                var kkfy = [];          //2
                var xxtra = [];         //3
                var kk = [];         //4
                var costCategoryOjb = {};   //根据costCategory组装值
                for(var c=0;c<this.ztBar2.length;c++){
                  var cos = this.ztBar2[c]["costCategory"];
                  if(!costCategoryOjb[cos]){
                    costCategoryOjb[cos] = [];
                    costCategoryOjb[cos].push(this.ztBar2[c]);
                  }else{
                    costCategoryOjb[cos].push(this.ztBar2[c]);
                  }
                }
                if(costCategoryOjb[1]){
                      for(var t=0;t<areaBar.length;t++){
                      var grfyFlag = 1;  //判断是否时间匹配上了
                      for(var ti=0;ti<costCategoryOjb[1].length;ti++){
                        if(areaBar[t] == costCategoryOjb[1][ti]["userName"]){
                          grfy.push(costCategoryOjb[1][ti]["money"]);
                          grfyFlag = 2;
                          break;
                        }
                      }
                      if(grfyFlag == 1){
                        grfy.push(0);
                      }
                    }
    
                }else {
                  for(var i=0;i<areaBar.length;i++){
                    grfy.push(0)
                  }
                }
                if(costCategoryOjb[2]){
                   for(var t1=0;t1<areaBar.length;t1++){
                   var grfyFlag = 1;  //判断是否时间匹配上了
                   for(var tj=0;tj<costCategoryOjb[2].length;tj++){
                     if(areaBar[t1] == costCategoryOjb[2][tj]["userName"]){
                       kkfy.push(costCategoryOjb[2][tj]["money"]);
                       grfyFlag = 2;
                       break;
                     }
                   }
                   if(grfyFlag == 1){
                     kkfy.push(0);
                   }
                 }
   
                }else {
                  for(var i=0;i<areaBar.length;i++){
                    kkfy.push(0)
                  }
                }
                if(costCategoryOjb[3]){
                    for(var t2=0;t2<areaBar.length;t2++){
                   var grfyFlag = 1;  //判断是否时间匹配上了
                   for(var tk=0;tk<costCategoryOjb[3].length;tk++){
                     if(areaBar[t2] == costCategoryOjb[3][tk]["userName"]){
                       xxtra.push(costCategoryOjb[3][tk]["money"]);
                       grfyFlag = 2;
                       break;
                     }
                   }
                   if(grfyFlag == 1){
                     xxtra.push(0);
                   }
                  }
  
                }else {
                  for(var i=0;i<areaBar.length;i++){
                    xxtra.push(0)
                  }
  
                }


                if(costCategoryOjb[4]){
                    for(var t2=0;t2<timeYear.length;t2++){
                   var grfyFlag = 1;  //判断是否时间匹配上了
                   for(var tk=0;tk<costCategoryOjb[4].length;tk++){
                     if(timeYear[t2] == costCategoryOjb[4][tk]["date"]){
                       kk.push(costCategoryOjb[4][tk]["money"]);
                       grfyFlag = 2;
                       break;
                     }
                   }
                   if(grfyFlag == 1){
                     kk.push(0);
                   }
                  }
  
                }else {
                  kk = [0,0,0,0,0,0,0];
                }


              
                this.option2 = {
                    title: {
                      text: '费用统计',
                      left: 50
                    },
                    tooltip : {
                        trigger: 'axis',
                        axisPointer : {            // 坐标轴指示器，坐标轴触发有效
                            type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
                        }
                    },
                    color:['#48A9EF', '#99D97C','#FFD562','#F37A70','#8997E7','#99C1FF','#54BFB7','#2E789B'],
                    legend: {
                        data:['个人统筹费用','Extra','区域费用','开课费用']
                    },
                    toolbox: {
                        show : false,
                        orient: 'vertical',
                        x: 'right',
                        y: 'center',
                        feature : {
                            mark : {show: true},
                            dataView : {show: true, readOnly: false},
                            magicType : {show: true, type: ['line', 'bar', 'stack', 'tiled']},
                            restore : {show: true},
                            saveAsImage : {show: true}
                        }
                    },
                    calculable : true,
                    xAxis : [
                        {
                            type : 'category',
                            data : areaBar
                        }
                    ],
                    yAxis : [
                        {
                            type : 'value'
                        }
                    ],
                    series : [                    
                        {
                            name:'个人统筹费用',
                            type:'bar',
                            stack: '费用',
                            data: grfy
                        },
                        {
                            name:'Extra',
                            type:'bar',
                            stack: '费用',
                            data: kkfy
                        },
                        {
                            name:'区域费用',
                            type:'bar',
                            stack: '费用',
                            data: xxtra
                        },
                        {
                            name:'开课费用',
                            type:'bar',
                            stack: '费用',
                            data: kk
                        }
                       
                    ]
                };
  
                document.getElementById("barUserChart").style.width=document.getElementById("divWidth").offsetWidth+ "px"; 
                var barUserChart = echarts.init(document.getElementById('barUserChart'));
                barUserChart.setOption(this.option2)
              }else {
                this.$refs.childAlert.show(data["msg"]);
              }
            
            }.bind(this),
            error : function() {
            }
        });
    }, 
    getEchartBarUser: function(areaBarId){  //费用统计柱状图（区域按人员）
        this.areaBarId = areaBarId;
        if(this.time3){
          this.time3 = this.time3;
        }else {
          this.time3 = this.formatDate1(new Date()) +"01";
        }  
        $.ajax({
            type : "post",
            url : this.path + "selectUserCostkStaticByUserId",
            data : {
              "jobNumber": localStorage.getItem("jobNumber"),
              "sessionIdOa": localStorage.getItem("sessionIdOa"),
              "timeString": this.time3,
              "areaId": this.areaBarId
            },
            success : function(data) {
              if(data.code == 200){
                var areaBar =[];
                for(var i=0;i<data["data"].length;i++){
                    var ej = data["data"][i]
                    areaBar.push(ej[0].userName)                  
                }
                this.ztBar2 =[];
                for(var i=0;i<data["data"].length;i++){
                    var ej = data["data"][i]
                    for(var j=0;j<ej.length;j++){
                      this.ztBar2.push({
                          "userName": ej[j].userName,
                          "money": ej[j].money,
                          "costCategory": ej[j].costCategory
                      })
                    }
                }
  
                var grfy = [];          //1
                var kkfy = [];          //2
                var xxtra = [];         //3
                var kk = [];         //4
                var costCategoryOjb = {};   //根据costCategory组装值
                for(var c=0;c<this.ztBar2.length;c++){
                  var cos = this.ztBar2[c]["costCategory"];
                  if(!costCategoryOjb[cos]){
                    costCategoryOjb[cos] = [];
                    costCategoryOjb[cos].push(this.ztBar2[c]);
                  }else{
                    costCategoryOjb[cos].push(this.ztBar2[c]);
                  }
                }
                if(costCategoryOjb[1]){
                      for(var t=0;t<areaBar.length;t++){
                      var grfyFlag = 1;  //判断是否时间匹配上了
                      for(var ti=0;ti<costCategoryOjb[1].length;ti++){
                        if(areaBar[t] == costCategoryOjb[1][ti]["userName"]){
                          grfy.push(costCategoryOjb[1][ti]["money"]);
                          grfyFlag = 2;
                          break;
                        }
                      }
                      if(grfyFlag == 1){
                        grfy.push(0);
                      }
                    }
    
                }else {
                  for(var i=0;i<areaBar.length;i++){
                    grfy.push(0)
                  }
                }
                if(costCategoryOjb[2]){
                   for(var t1=0;t1<areaBar.length;t1++){
                   var grfyFlag = 1;  //判断是否时间匹配上了
                   for(var tj=0;tj<costCategoryOjb[2].length;tj++){
                     if(areaBar[t1] == costCategoryOjb[2][tj]["userName"]){
                       kkfy.push(costCategoryOjb[2][tj]["money"]);
                       grfyFlag = 2;
                       break;
                     }
                   }
                   if(grfyFlag == 1){
                     kkfy.push(0);
                   }
                 }
   
                }else {
                  for(var i=0;i<areaBar.length;i++){
                    kkfy.push(0)
                  }
                }
                if(costCategoryOjb[3]){
                    for(var t2=0;t2<areaBar.length;t2++){
                   var grfyFlag = 1;  //判断是否时间匹配上了
                   for(var tk=0;tk<costCategoryOjb[3].length;tk++){
                     if(areaBar[t2] == costCategoryOjb[3][tk]["userName"]){
                       xxtra.push(costCategoryOjb[3][tk]["money"]);
                       grfyFlag = 2;
                       break;
                     }
                   }
                   if(grfyFlag == 1){
                     xxtra.push(0);
                   }
                  }
  
                }else {
                  for(var i=0;i<areaBar.length;i++){
                    xxtra.push(0)
                  }
  
                }

                if(costCategoryOjb[4]){
                    for(var t2=0;t2<timeYear.length;t2++){
                   var grfyFlag = 1;  //判断是否时间匹配上了
                   for(var tk=0;tk<costCategoryOjb[4].length;tk++){
                     if(timeYear[t2] == costCategoryOjb[4][tk]["date"]){
                       kk.push(costCategoryOjb[4][tk]["money"]);
                       grfyFlag = 2;
                       break;
                     }
                   }
                   if(grfyFlag == 1){
                     kk.push(0);
                   }
                  }
  
                }else {
                  kk = [0,0,0,0,0,0,0];
                }
              
                this.option2 = {
                    title: {
                      text: '费用统计',
                      left: 50
                    },
                    tooltip : {
                        trigger: 'axis',
                        axisPointer : {            // 坐标轴指示器，坐标轴触发有效
                            type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
                        }
                    },
                    color:['#48A9EF', '#99D97C','#FFD562','#F37A70','#8997E7','#99C1FF','#54BFB7','#2E789B'],
                    legend: {
                        data:['个人统筹费用','Extra','区域费用','开课费用']
                    },
                    toolbox: {
                        show : false,
                        orient: 'vertical',
                        x: 'right',
                        y: 'center',
                        feature : {
                            mark : {show: true},
                            dataView : {show: true, readOnly: false},
                            magicType : {show: true, type: ['line', 'bar', 'stack', 'tiled']},
                            restore : {show: true},
                            saveAsImage : {show: true}
                        }
                    },
                    calculable : true,
                    xAxis : [
                        {
                            type : 'category',
                            data : areaBar
                        }
                    ],
                    yAxis : [
                        {
                            type : 'value'
                        }
                    ],
                    series : [                    
                        {
                            name:'个人统筹费用',
                            type:'bar',
                            stack: '费用',
                            data: grfy
                        },
                        {
                            name:'Extra',
                            type:'bar',
                            stack: '费用',
                            data: kkfy
                        },
                        {
                            name:'区域费用',
                            type:'bar',
                            stack: '费用',
                            data: xxtra
                        },
                        {
                            name:'开课费用',
                            type:'bar',
                            stack: '费用',
                            data: xxtra
                        }
                       
                    ]
                };
                      
                document.getElementById("barUserChart").style.width=document.getElementById("divWidth").offsetWidth+ "px"; 
                var barUserChart = echarts.init(document.getElementById('barUserChart'));
                barUserChart.setOption(this.option2)

              }else {
                this.$refs.childAlert.show(data["msg"]);
              }

              
              
            }.bind(this),
            error : function() {
            }
        });   
    }, 
    seacherEchartBar: function(){ //查询费用统计柱状图
      if(this.areaBarId){
        this.getEchartBarArea(this.areaBarId);
        this.getEchartBarUser(this.areaBarId);
      }else{
        this.getEchartBar();
        this.getEchartUser();
      }
    },
    provinceChose: function(){
      this.showOrHide = 'check';
      this.hideOrShow = '';
      this.userPro = "1" ;  
    },
    userChose: function(){
      this.showOrHide = '';
      this.hideOrShow = 'check';
      this.userPro = "0" ;
    },
    getEchartPie: function(areaPieId){  //费用分布饼状图（区域）
        this.areaPieId = areaPieId;
        if(this.time4){
          this.time4 = this.time4 + "-01";
        }else {
          this.time4 = this.formatDate1(new Date()) +"01";
        }  
        $.ajax({
            type : "post",
            url : this.path + "selectUserCostStaticByProvince",
            data : {
              "jobNumber": localStorage.getItem("jobNumber"),
              "sessionIdOa": localStorage.getItem("sessionIdOa"),
              "timeString": this.time4,
              "areaId": this.areaPieId
            },
            success : function(data) {

              if(data.code == 200){

                var areaBar =[];
                for(var i=0;i<data["data"].length;i++){
                    var ej = data["data"][i]
                    areaBar.push(ej[0].provinceName)                  
                }
    
                this.ztBarPie =[];
                for(var i=0;i<data["data"].length;i++){
                    var ej = data["data"][i]
                    var money = 0;
                    for(var j=0;j<ej.length;j++){
                      money = Number(money) + Number(data["data"][i][j].money)
                    }
                    this.ztBarPie.push({
                        "provinceName": ej[0].provinceName,
                        "money": money,
                        "costCategory": ej[0].costCategory
                    })
                }
  
                var deptName=[];
                var money=[];
                for(var i=0;i<this.ztBarPie.length;i++){
                  if(typeof(this.ztBarPie[i].costCategory)=="undefined"){
                  }else{
                    deptName.push(this.ztBarPie[i].provinceName);
                  }
                }
                for(var i=0;i<this.ztBarPie.length;i++){
                  money.push(this.ztBarPie[i].money);
                }

                var firstColor = '#48A9EF';
            
                if(!money || money == ''){
                  deptName.push("暂无花费");
                  money.push(0);
                  firstColor = '#cecece';
                }else {
                  firstColor = '#48A9EF';
                }
  
                this.optionPie = {
                    title : {
                         text: '费用分布',
                         x:'left'
                     },
                     tooltip : {
                         trigger: 'item',
                         formatter: "{a} <br/>{b} : {c} ({d}%)"
                     },
                     color:[firstColor, '#99D97C','#FFD562','#F37A70','#8997E7','#99C1FF','#54BFB7','#2E789B'],
                     legend: {
                         //orient : 'vertical',
                         x : 'center',
                         y : 'bottom',
                         data: areaBar
                     },
                     toolbox: {
                         show : false,
                         feature : {
                             mark : {show: true},
                             dataView : {show: true, readOnly: false},
                             magicType : {
                                 show: true, 
                                 type: ['pie', 'funnel'],
                                 option: {
                                     funnel: {
                                         x: '25%',
                                         width: '50%',
                                         funnelAlign: 'left',
                                         max: 1548
                                     }
                                 }
                             },
                             restore : {show: true},
                             saveAsImage : {show: true}
                         }
                     },
                     calculable : true,
                     series : [
                         {
                             name:'',
                             type:'pie',
                             radius : '60%',
                             center: ['50%', '50%'],
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
                         }
                     ]
                };
                      
                var myChartPie = echarts.init(document.getElementById('myChartPie'));
                myChartPie.setOption(this.optionPie)

              }else {
                this.$refs.childAlert.show(data["msg"]);
              }

              
              
            }.bind(this),
            error : function() {
            }
        });   
    }, 
    getEchartPieAll: function(){  //费用分布饼状图（全国）
        this.areaPieId = '';
        if(this.time4){
          this.time4 = this.time4 + "-01";
        }else {
          this.time4 = this.formatDate1(new Date()) +"01";  
        }   
        $.ajax({
            type : "post",
            url : this.path + "selectCostStaticTrendSum",           
            data : {
              "jobNumber": localStorage.getItem("jobNumber"),
              "sessionIdOa": localStorage.getItem("sessionIdOa"),
              "timeString": this.time4
            },
            success : function(data) {
              if(data.code == 200){

                var areaBar =[];
                for(var i=0;i<data["data"].length;i++){
                    areaBar.push(data["data"][i].areaName)                  
                }
                this.ztBarPie =[];
                for(var i=0;i<data["data"].length;i++){
                    this.ztBarPie.push({
                        "areaName": data["data"][i].areaName,
                        "money": data["data"][i].money,
                        "costCategory": data["data"][i].costCategory
                    })
                } 

  
                var deptName=[];
                var money=[];
                for(var i=0;i<this.ztBarPie.length;i++){
                  if(typeof(this.ztBarPie[i].costCategory)=="undefined"){
                  }else{
                    deptName.push(this.ztBarPie[i].areaName);
                  }
                }
                for(var i=0;i<this.ztBarPie.length;i++){
                  money.push(this.ztBarPie[i].money);
                }

                var firstColor = '#48A9EF';
            
                if(!money || money == ''){
                  deptName.push("暂无花费");
                  money.push(0);
                  firstColor = '#cecece';
                }else {
                  firstColor = '#48A9EF';
                }

  
                this.optionPie = {
                    title : {
                         text: '费用分布',
                         x:'left'
                     },
                     tooltip : {
                         trigger: 'item',
                         formatter: "{a} <br/>{b} : {c} ({d}%)"
                     },
                     color:[firstColor, '#99D97C','#FFD562','#F37A70','#8997E7','#99C1FF','#54BFB7','#2E789B'],
                     legend: {
                         //orient : 'vertical',
                         x : 'center',
                         y : 'bottom',
                         data: areaBar
                     },
                     toolbox: {
                         show : false,
                         feature : {
                             mark : {show: true},
                             dataView : {show: true, readOnly: false},
                             magicType : {
                                 show: true, 
                                 type: ['pie', 'funnel'],
                                 option: {
                                     funnel: {
                                         x: '25%',
                                         width: '50%',
                                         funnelAlign: 'left',
                                         max: 1548
                                     }
                                 }
                             },
                             restore : {show: true},
                             saveAsImage : {show: true}
                         }
                     },
                     calculable : true,
                     series : [
                         {
                             name:'',
                             type:'pie',
                             radius : '45%',
                             center: ['50%', '47%'],
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
                         }
                     ]
                };
                      
                var myChartPie = echarts.init(document.getElementById('myChartPie'));
                myChartPie.setOption(this.optionPie)

              }else {
                this.$refs.childAlert.show(data["msg"]);
              }
              
              
            }.bind(this),
            error : function() {
            }
            
        });
    },
    seacherPie: function(){ //查询费用趋势折线图
      if(this.areaPieId){
        this.getEchartPie(this.areaPieId);
      }else{
        this.getEchartPieAll();
      }
    },
    seacherPeople: function(){ //折线图根据员工查
      this.isShowCover = true;
      this.isShowDetail = true;
      this.listName = "按员工查询";
      this.peoOrPro = true;
      this.areaCho = '';
      this.provinceCho = '';
      this.peopleCho = '';
      this.getArea();
    },
    closePop: function(){
      this.isShowCover = false;
      this.isShowDetail = false;
    },
    seacherProvince: function(){ //折线图根据省份查
      this.isShowCover = true;
      this.isShowDetail = true;
      this.listName = "按省份查询";
      this.peoOrPro = false;
      this.areaCho = '';
      this.provinceCho = '';
      this.peopleCho = '';
      this.getArea();

    },
    getArea: function(){ //获取区域数据
      if(this.areaList.length == 1){
         this.findArea = this.areaList;
      }else{
        $.ajax({
            url: this.path + "findAreaByCondition",
            type: 'get',  
            dataType: 'json',
            data: {
               "jobNumber": localStorage.getItem("jobNumber"),
               "sessionIdOa": localStorage.getItem("sessionIdOa")
            },
            success: function(data){ 
              if(data.code == 200){
                  for(var i=0;i<data["data"].length;i++){
                    this.findArea = data["data"];
                  }
                }else {
                   this.$refs.childAlert.show(data.msg);
                }                
                
            }.bind(this),
            error: function(err){
              console.log("登录异常");
            }
        })

      }
         
    },
    areaChangeChose: function(){ //获取省份数据
        this.areaId = this.areaCho;
        this.province = this.OACommon.findProvinceList(this.areaCho);
        this.province.splice(0,1);
    },   
    provinceChangeChose: function(){
      $.ajax({
            url: this.path + "findUsersByProvinceId",
            type: 'post',  
            dataType: 'json',
            data: {
               "jobNumber": localStorage.getItem("jobNumber"),
               "sessionIdOa": localStorage.getItem("sessionIdOa"),
               "provinceId": this.provinceCho
            },
            success: function(data){ 
              if(data.code == 200){
                for(var i=0;i<data["data"].length;i++){
                  this.people = data["data"];
                }
                }else {
                   this.$refs.childAlert.show(data.msg);
                }                
                
            }.bind(this),
            error: function(err){
              console.log("登录异常");
            }
        })
    },
    submitChose: function(){
      if($("#peopl").find("option:selected").text() && $("#peopl").find("option:selected").text() != "请选择"){
         this.aygck = $("#peopl").find("option:selected").text();
      }else {
        this.aygck = "按员工查看";
      }
      if(!$("#peopl").find("option:selected").text() && $("#prov").find("option:selected").text() != "请选择"){
         this.asfck = $("#prov").find("option:selected").text();
      }else {
         this.asfck = "按省份查看";
      }


      if(this.peoOrPro){     
        if(!this.areaCho){
          if(this.areaList.length == 1){
            this.areaId = this.areaList[0].areaId
          }else{
            this.areaId = 0;
          }
        }else {
           this.areaId = this.areaCho;
        }
        if(!this.provinceCho){
           this.provinceId = 0;
        }else {
           this.provinceId = this.provinceCho;
        }
        if(!this.peopleCho){
           this.userId = 0;
        }else {
           this.userId = this.peopleCho;
        }
        this.isShowCover = false;
        this.isShowDetail = false;
        this.zxtSeacher();
        
      }else {

        if(!this.areaCho){
           if(this.areaList.length == 1){
             this.areaId = this.areaList[0].areaId
           }else{
             this.areaId = 0;
           }
        }else {
           this.areaId = this.areaCho;
        }
        if(!this.provinceCho){
           this.provinceId = 0;
        }else {
           this.provinceId = this.provinceCho;
        }
        this.userId = 0;
        this.isShowCover = false;
        this.isShowDetail = false;
        this.zxtSeacher();
        
      }

    }

    
  }
}
</script>
