<template>
   
   <div class="roleManagement">
      <div class="gonggao_bread">
        <a href="#" class="fa">首页</a>
        &gt;
        <a href="#">财务</a>
        &gt;
        <span>流水</span>
      </div>
      
      <div class="gonggao_body table_body" style="padding-top: 20px">

        <div class="baoxiao" style="width: 100%;text-align: center;padding: 20px 10px" >
             <span style="font-size: 25px;font-weight: 700">{{ dateTime }}流水</span>
             <span v-on:click="timeSeacher" style="display:inline-block;float:right;color: #00a1e9;cursor: pointer;margin-right: 50px">按时间查询</span>
        </div>

        <div class="money_table data_table_body">
          <table cellpadding="0" cellspacing="0" border="1" style="text-align: center">
              <thead>
              <tr>
                <td width="20%">区域</td>
                <td width="20%">省份</td>
                <td width="20%">员工</td>
                <td width="20%">流水</td>
                <td width="20%">操作</td>
              </tr>
              </thead>
              <tbody v-for="(l, i) in flowList">
                  <tr v-for="(v, k) in l">
                    <td v-bind:rowSpan="l.length" v-if="k==0">{{ i }}</td>
                    <td>{{ v.provinceNmae }}</td>               
                    <td>{{ v.userName }}</td>               
                    <td>{{ v.accountAmount }}</td>
                    <td>
                      <a v-bind:href="'/#/mainIndex/finance/financeDetail?provinceId='+v.provinceId"  class="table_la">查看</a>
                      <span style="cursor: pointer" class="table_lv" v-on:click="addFlow(v.areaId,v.provinceId)">添加</span>             
                    </td> 
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

      <div class="view_area" style="width: 400px;height: 200px;padding: 5px 20px" v-if="isShowFlow">

            <div class="baoxiao" style="width: 100%;text-align: center;padding: 10px 10px" >
              <span style="font-size: 20px;font-weight: 700">新增流水</span>
            </div>

            <div class="peoMenEdit">
                 <span class="prompt"><Icon style="color: #FF6666" type="android-star" ></Icon>入账时间：</span>
                 <el-date-picker
                   v-model="addTime"
                   type="date"
                   format="yyyy-MM-dd"
                   value-format="yyyy-MM-dd"
                   placeholder="选择日期">
                 </el-date-picker>              
            </div>
            <div class="peoMenEdit" style="margin-top: 20px">
                 <span class="prompt"><Icon style="color: #FF6666" type="android-star" ></Icon>入账金额：</span>
                 <input class="textType" style="width: 200px;height: 30px;line-height: 30px" v-on:keyup="inputKey" placeholder="入账金额"  type="text" v-model="addMoney" />
            </div>

            <div class="view_btn" style="margin-top: 20px">
                 <span class="btn-blue-s" v-on:click="submitFlow">提交</span>
                 <span class="btn-yellow-s" v-on:click="closeFlow">取消</span>
            </div>
                             
      </div>
   
      <oa-alert ref="childAlert"></oa-alert>
      <oa-confirm ref="childConfirm"></oa-confirm>

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
      .peoMenEdit .el-input__inner {
        width: 200px;
        height: 30px;
        line-height: 30px;
      }
      .peoMenEdit .el-input__icon {
        line-height: 30px;
      }
    
</style>

<script>
  import $ from 'jquery'
  import oaAlert from '@/components/commonVue/Alert'
  import oaConfirm from '@/components/commonVue/Confirm'
    export default {
        name: 'PositionManagement',
        components: {
          'oa-alert': oaAlert,
          'oa-confirm': oaConfirm
        },
        data () {
            return {               
                path: this.OACommon["publicDef"]["qpath"],
                isShowCover: false,
                isShowDetail: false,
                isShowFlow: false,
                addTime: '',
                addMoney: '',
                areaId: '',
                provinceId: '',
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
                flowList: {}     //流水遍历
                             
            }
        },
        created: function(){
            this.dateTime = this.formatDate(new Date())
            this.getFlow();

        },
        methods:{
                       
            getFlow: function(){  //对比列表（全国前一个月）
                if(!this.timeString){
                  this.timeString = this.formatDate2(new Date()) +"01";
                }                             
                $.ajax({
                    type : "post",
                    async : false,
                    url : this.path + "findFinanceWaterList",
                    data : {
                      "jobNumber": localStorage.getItem("jobNumber"),
                      "sessionIdOa": localStorage.getItem("sessionIdOa"),
                      "startTimeSting": this.timeString,
                      "endTimeSting": this.timeStringEnd
                    },
                    success : function(data) {

                      if(data.code == 200){
                        var data = data["data"];
                        var dataObj = {};         //预定义用来组装以区为key的数据对象
                        for(var i=0;i<data.length;i++){
                          var areaName = data[i]["areaName"];
                          if(dataObj[areaName]){
                            dataObj.areaName.push(data[i]);
                          }else{
                            dataObj[areaName] = [];
                            dataObj[areaName].push(data[i]);
                          }
                        }
                        this.flowList = dataObj;
                      }else {
                        this.$refs.childAlert.show(data.msg);
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
              this.timeString  = this.yearChose +"-"+ (this.monthChose-1) +"-01";
              this.timeStringEnd = this.yearChose +"-"+ this.monthChose +"-01";
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
              this.isShowCover = false;
              this.isShowDetail = false;   
            },
            choseYear: function(){
              this.dateTime = this.yearChose +"年";
              this.timeString  = this.yearChose +"-"+ "01-01";
              this.timeStringEnd  = this.yearChose +"-"+ "12-01";
              this.isShowCover = false;
              this.isShowDetail = false;
            },
            formatDate: function(date){
               var y = date.getFullYear();  
               var m = date.getMonth();  
               m = m < 10 ? '0' + m : m;  
               var d = date.getDate();  
               d = d < 10 ? ('0' + d) : d;  
               //return y + '-' + m + '-' + d;
               return y + '年' + m + '月';
            },
            formatDate1: function(date){
                var y = date.getFullYear();  
               var m = date.getMonth();  
               m = m < 10 ? '0' + m : m;  
               var d = date.getDate();  
               d = d < 10 ? ('0' + d) : d;  
               //return y + '-' + m + '-' + d;
               return y + '-' + m + '-';
            },
            formatDate2: function(date){
               var y = date.getFullYear();  
               var m = date.getMonth();  
               m = m < 10 ? '0' + m : m;  
               var d = date.getDate();  
               d = d < 10 ? ('0' + d) : d;  
               //return y + '-' + m + '-' + d;
               return y + '-' + m + '-';
            },
            addFlow: function(areaId,provinceId){ //添加流水            
                this.addTime = "";
                this.addMoney = "";
                this.areaId = areaId;
                this.provinceId = provinceId;
                this.isShowCover = true;
                this.isShowFlow = true;
            },
            inputKey: function(){ //输入框数字校验
              if(isNaN(this.addMoney) || Number(this.addMoney) <= 0){
                  this.addMoney = '';
              }
              var obj = this.addMoney;

              obj = obj.replace(/[^\d.]/g,"");  //清除“数字”和“.”以外的字符
              obj = obj.replace(/\.{2,}/g,"."); //只保留第一个. 清除多余的
              obj = obj.replace(".","$#$").replace(/\./g,"").replace("$#$",".");
              obj = obj.replace(/^(\-)*(\d+)\.(\d\d).*$/,'$1$2.$3');//只能输入两个小数
              if(obj.indexOf(".")< 0 && obj !=""){//以上已经过滤，此处控制的是如果没有小数点，首位不能为类似于 01、02的金额
                obj= parseFloat(obj);
              }
              this.addMoney = obj;
            },
            closeFlow: function(){ //关闭添加流水
              this.isShowCover = false;
              this.isShowFlow = false;
            },
            submitFlow: function(){  //提交添加流水
              if(!this.addTime){
                this.$refs.childAlert.show("请选择添加时间");
                return false;
              }
              if(!this.addMoney){
                this.$refs.childAlert.show("请填写金额");
                return false;
              }
              $.ajax({
                    type : "post",
                    async : false,
                    url : this.path + "insertOrUpdateFinanceWater",
                    data : {
                      "jobNumber": localStorage.getItem("jobNumber"),
                      "sessionIdOa": localStorage.getItem("sessionIdOa"),
                      "areaId": this.areaId,
                      "provinceId": this.provinceId,
                      "accountAmount": this.addMoney,
                      "timeString": this.addTime
                    },
                    success : function(data) {
                      this.isShowCover = false;
                      this.isShowFlow = false;
                      if(data.code == 200){
                          this.$refs.childAlert.show("添加成功",this.getFlow);
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