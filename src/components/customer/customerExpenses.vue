<template>
  <div class="charts">
      <div class="gonggao_bread">
        <a href="#/mainIndex/index" class="fa">首页</a>
        &gt;
        <span>客户管理</span>
        &gt;
        <span>联系人费用花费</span>
      </div>

      <div class="gonggao_body table_body" style="text-align: center;overflow: hidden;zoom: 1">
                    
              <div class="baoxiao" style="width: 100%;text-align: center;padding: 20px 10px" >
                 <a style="position:absolute;left:40px;" href="/#/mainIndex/CustomerList">返回学校列表</a>
                 <span style="font-size: 25px;font-weight: 700">{{ dateTime }}费用花费明细</span>
                 <span v-on:click="timeSeacher" style="display:inline-block;float:right;color: #00a1e9;cursor: pointer;margin-right: 50px">按时间查询</span>
              </div>
              
              <div class="menEdit" style="float: left;width: 40%;padding-left: 10px;">
                    
                    <div class="baoxiao schoolfy" style="width: 60%;margin: 0 auto;text-align: center;padding: 10px 10px" >
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

              <div class="menEdit" style="float: right;width: 60%;">
                   <!--创建一个echarts的容器-->
                   <div id="myChart" style="width: 100%; height:500px;margin: 0 auto"></div>
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

      <oa-alert ref="childAlert"></oa-alert>
    
  </div>
</template>

<style>
      .schoolfy ul {
        border: 0 none;
        width: 100%;
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
      dateTime: '',
      timeString: '',
      timeStringEnd: '',
      customerContactsId:'', //联系人ID
      costCategory:'', //费用类型
      yearChose: '',
      monthChose: '',
      quarterChose: '',
      index:'0',
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
        chat_fytj_area: false, //是否有区域费用
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
  created: function () {
     this.customerContactsId = this.OACommon.getUrlPara("customerContactsId");
    //this.dateTime = this.formatDate(new Date());
    this.dateTime = "";
    this.startTimeString = this.formatDate3(new Date())
    this.getEchart(); 
    this.getEchartPie();
    //this.findUsers();   
  },
  methods: {  
    findUsers: function(){
      $.ajax({
      type : "post",
      url : this.path + "findUsersPositionId",
      data : {
        "jobNumber": localStorage.getItem("jobNumber"),
        "sessionIdOa": localStorage.getItem("sessionIdOa")
      },
      success : function(data) {
        if(data.code == 200){
           if(data.data == 1){
             this.fyList[2]["chat_fytj_area"] = true;
           }else {
            this.fyList[2]["chat_fytj_area"] = false;
           }

        }else {
          this.$refs.childAlert.show(data.msg);
        }

      }.bind(this),
      error : function() {
      }
       });
    },
    getEchart: function(){
      if(!this.startTimeString){
        this.startTimeString = this.formatDate4(new Date());
      }  
      $.ajax({
      type : "post",
      url : this.path + "findUserCheckStaticByCoustomerId",
      data : {
        "jobNumber": localStorage.getItem("jobNumber"),
        "sessionIdOa": localStorage.getItem("sessionIdOa"),
        "startTimeString": this.startTimeString,
        "endTimeString": this.endTimeString,
        "customerContactsId": this.customerContactsId
      },
      success : function(data) {
        if(data.code == 200){

            this.fyList = [
               {
                 costCategoryName: '个人统筹费',
                 costCategory: '1', 
                 chat_fytj_area: true, //是否有区域费用               
                 money: 0
               },
               {
                 costCategoryName: 'Extra',
                 costCategory: '2',
                 chat_fytj_area: true, //是否有区域费用
                 money: 0
               },
               {
                 costCategoryName: '区域费用',
                 costCategory: '3',
                 chat_fytj_area: false, //是否有区域费用
                 money: 0
               },
               {
                 costCategoryName: '开课费用',
                 costCategory: '4',
                 chat_fytj_area: true, //开课费用
                 money: 0
               }
              
            ];

            this.findUsers();

            var allMoney = 0;
            for(var i=0;i< data["data"].length;i++){
                this.liColor.push({
                  "check": ""
                });
                if(this.fyList[2]["chat_fytj_area"]){
                  allMoney = Number(allMoney) + Number(data["data"][i].money);

                }else {
                  
                  if(data["data"][i]["costCategory"] == 3){

                  }else {
                    allMoney = Number(allMoney) + Number(data["data"][i].money);
                  }
                }
                

                for(var j=0;j<this.fyList.length;j++){
                 if(data["data"][i]["costCategory"] == this.fyList[j]["costCategory"]){
                    this.fyList[j]["money"] = data["data"][i]["money"];
                 }

              }

            }

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
      if(!this.startTimeString){
        this.startTimeString = this.formatDate4(new Date());
      }  
      $.ajax({
      type : "post",
      url : this.path + "findUsersStaticNumSchool",
      data : {
        "jobNumber": localStorage.getItem("jobNumber"),
        "sessionIdOa": localStorage.getItem("sessionIdOa"),
        "startTimeString": this.startTimeString,
        "endTimeString": this.endTimeString,
        "costCategory": this.costCategory,
        "customerContactsId": this.customerContactsId
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
                    bottom: 80,
                    left: 'center',
                    data: nums
                },
               series : [
                  {
                    name: '',
                    type: 'pie',
                    radius : '50%',
                    center: ['50%', '40%'],
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
    choseMonth: function(){
      this.endTimeString = '';
      if(!this.yearChose){
        this.$refs.childAlert.show("请选择年份");
        return false;
      }
      if(!this.monthChose){
        this.$refs.childAlert.show("请选择月份");
        return false;
      }
      this.dateTime = this.yearChose +"年"+ this.monthChose +"月份";
      if(this.monthChose < 10){
         this.monthChose = '0' + this.monthChose;
      }
      this.startTimeString  = this.yearChose +"-"+ this.monthChose +"-01";
      this.getEchart();
      this.getEchartPie();
      this.isShowCover = false;
      this.isShowDetail = false;
    },
    choseQuart: function(){
      var quarter = '';
      if(!this.yearChose){
        this.$refs.childAlert.show("请选择年份");
        return false;
      }
      if(!this.quarterChose){
        this.$refs.childAlert.show("请选择季度");
        return false;
      }
      if(this.quarterChose == "1"){
            quarter = "一季度";
            this.startTimeString  = this.yearChose +"-"+ "01-01";
            this.endTimeString  = this.yearChose +"-"+ "03-01";
      }
      if(this.quarterChose == "2"){
            quarter = "二季度";
            this.startTimeString  = this.yearChose +"-"+ "04-01";
            this.endTimeString  = this.yearChose +"-"+ "06-01";
      }
      if(this.quarterChose == "3"){
            quarter = "三季度";
            this.startTimeString  = this.yearChose +"-"+ "07-01";
            this.endTimeString  = this.yearChose +"-"+ "09-01";
      }
      if(this.quarterChose == "4"){
            quarter = "四季度";
            this.startTimeString  = this.yearChose +"-"+ "10-01";
            this.endTimeString  = this.yearChose +"-"+ "12-01";
      }
      this.dateTime = this.yearChose +"年"+ quarter; 
      this.getEchart();
      this.getEchartPie();
      this.isShowCover = false;
      this.isShowDetail = false;   
    },
    choseYear: function(){
      if(!this.yearChose){
        this.$refs.childAlert.show("请选择年份");
        return false;
      }
      this.dateTime = this.yearChose +"年";
      this.startTimeString  = this.yearChose +"-"+ "01-01";
      this.endTimeString  = this.yearChose +"-"+ "12-01";
      this.getEchart();
      this.getEchartPie();
      this.isShowCover = false;
      this.isShowDetail = false;
    },
    formatDate: function(date){
       var y = date.getFullYear();  
       var m = date.getMonth() + 1; 
       if(m > 12){
           y = y + 1;
           m = m - 12;
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
           y = y + 1;
           m = m - 12;
       }
       m = m < 10 ? '0' + m : m;  
       var d = date.getDate();  
       d = d < 10 ? ('0' + d) : d;  
       //return y + '-' + m + '-' + d;
       return y + '-' + m + '-01';
    },
    formatDate3: function(date){
       var y = date.getFullYear();  
       var m = date.getMonth() + 1;  
       if(m > 12){
           y = y + 1;
           m = m - 12;
       }
       m = m < 10 ? '0' + m : m;  
       var d = date.getDate();  
       d = d < 10 ? ('0' + d) : d;  
       //return y + '-' + m + '-' + d;
       return y + '-' + m + '-01';
    },
    formatDate4: function(date){
       var y = date.getFullYear();  
       var m = date.getMonth() -6; 
       if(m < 1){
           y = y - 1;
           m = 12 - Math.abs(m);
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
