<template>

      <div class="DivisionalManagement">
           <div class="gonggao_bread">
                <a href="#/mainIndex/index" class="fa">首页</a>
                &gt;
                <span>报销管理</span>
                &gt;
                <span>报销申请</span>
           </div>
           
           <div class="gonggao_body table_body" style="padding: 20px 20px">

                  <div class="form_eve">
                      <label class="label_tit-1" style="height: 30px;line-height: 30px">费用产生时间：</label>
                      
                      <el-date-picker
                        v-model="startTime"
                        type="date"
                        format="yyyy-MM-dd"
                        value-format="yyyy-MM-dd"
                        placeholder="选择日期">
                      </el-date-picker>
                      <span style="margin:0px 10px;line-height: 30px">至</span>
                      <el-date-picker
                        v-model="endTime"
                        type="date"
                        format="yyyy-MM-dd"
                        value-format="yyyy-MM-dd"
                        placeholder="选择日期">
                      </el-date-picker>

                  </div>
                  <div class="form_eve" v-for="(expenses,v) in expensesList">

                      <label class="label_tit-1" style="height: 40px;line-height: 40px">费用明细：</label>
                      <span style="display:inline-block;width:18%;float:left;">                             
                            <select name=""  style="width: 100%;line-height: 40px" v-on:change="selectChange(v)" v-model="expenses.reimTypeId">
                                 <option  value="">请选择</option>
                                 <option v-for="ReimType in ReimTypeList"  v-bind:value="ReimType.reimTypeId">{{ ReimType.reimTypeName }}</option>
                            </select>
                            </br>
                            <input class="textType" v-on:keyup="inputKey(v)" placeholder="具体额度" style="margin-top: 20px;width: 100%;height: 40px" type="text" v-model="expenses.reimMoney" /> 
                      </span>
                      <textarea style="margin-left: 30px" placeholder="请描述费用报销用途" class="form_input-3" v-model="expenses.reimDescription" ></textarea>
                      <span class="btn-blue-s add_opition_btn" v-if="v==(expensesList.length-1)" v-on:click="addExpense">新增</span>
                      <span class="btn-yellow-s add_opition_btn" v-if="v!=0" v-on:click="removeExpense(v)">删除</span>
     
                  </div>

                  <div style="width: 68%;margin-top: 20px;text-align: right">
                        <span>总金额：</span>
                        <span style="font-size: 20px;color: #FF6666">{{ allMoney }}</span>
                  </div>    

                  <div style="margin-top: 20px;margin-left: 20px">
                     <span class="btn-yellow-s" v-on:click="previewExpense">预览</span>
                     <span class="btn-blue-s" v-on:click="submitExpense">提交</span>
                  </div>
                  
                  <div class="bgpop" v-if="isShowCover"></div>
                  <div class="view_area" style="width: 800px;height: 450px;padding: 5px 20px" v-if="isShowDetail">
                         

                         <div class="menEdit peoMenEdit">
                              <div style="margin-top: 10px"><span>申请时间：</span><span>{{ nowTime }}</span></div>
                              <div style="margin-top: 10px"><span>申请人：</span><span style="color: #00a1e9">{{ userName }}</span></div>                              
                         </div> 

                         <div class="menEdit peoMenEdit" style="margin-top: 20px">
                               
                               <table class="bigtable" border="1" style="border-collapse:collapse;border:1px solid #d9d9d9;">
                                      <tr>
                                          <td style="width:240px" colspan="3" rowspan="2">费用产生时间</td>
                                          <td style="width:560px" colspan="7">费用明细</td>
                                      </tr>
                                      <tr >
                                          <td style="width:60px" class="huang">编号</td>
                                          <td style="width:100px" class="huang">费用类型</td>
                                          <td style="width:100px" class="huang">金额</td>
                                          <td style="width:300px" class="huang">详情</td>
                                      </tr>

                                      <tr v-for="(exp,v) in expensesList">
                                          <td v-if="v==0" style="width:240px" colspan="3" :rowspan="listNum" class="huang">{{ startTime }} -- {{ endTime }}</td>
                                          <td>{{ v+1 }}</td>
                                          <td>{{ exp.expenseName }}</td>
                                          <td>{{ exp.reimMoney }}</td>
                                          <td>{{ exp.reimDescription }}</td>                                
                                      </tr>

                                </table>
                                                            
                         </div> 

                         <div >
                              <div style="margin-top: 10px;text-align: right;padding-right: 20px"><span>金额：</span><span style="color: #FF6666;font-size: 20px;">{{ allMoney }}</span> 元</div>
                              <div style="margin-top: 10px;text-align: right;padding-right: 20px"><span>大写：</span><span style="font-size: 20px;">{{ chineseNum }}</span></div>                              
                         </div>
                        

                        <div class="view_btn" style="margin-top: 20px">
                             <span class="btn-yellow-s" v-on:click="closePop">关闭</span>
                        </div>
                   </div>
        
                
                <oa-alert ref="childAlert"></oa-alert>
                <oa-load ref="childLoading"></oa-load>

           </div>   
       

     </div>



</template>
<style>
    
    .bigtable {
        width: 100%;
        margin: 0 auto;
    }     
    .bigtable td{
        line-height: 40px;
        text-align: center;
        color: #666666;
    }
    .loading {
      overflow-y:auto;background:#FFF;border-radius:4px;position:fixed;z-index:1001;top:0;right:0;bottom:0;left:0;margin:auto;
    }



</style>

<script>
  import $ from 'jquery'
  import oaPage from '@/components/commonVue/Page'
  import oaAlert from '@/components/commonVue/Alert'
  import Loading from '@/components/commonVue/Loading'
    export default {
        name: 'expenseClaim',
        components: {
          'oa-alert': oaAlert,
          'oa-load': Loading
        },
        data () {
            return {
                startTime: '',//开始时间
                endTime: '',//结束时间
                nowTime: '',
                userName:'',
                allMoney: '0',
                reimId: '',
                listNum: '',  //费用编号
                chineseNum: '',
                expensesTypeName: '', //费用类型  
                isShowCover: false,
                isShowDetail: false,
                path: this.OACommon["publicDef"]["qpath"],
                expensesList: [
                   {
                    "reimMoney": "", //具体额度
                    "reimTypeId": "",  //明细列表
                    "reimDescription": "",
                    "expenseName": ""                   
                  }
                ],
                ReimTypeList: []//费用明细
               
            }
        },
        created: function(){
            this.reimId = this.OACommon.getUrlPara("reimId");
            if(this.reimId == ""){

            }else{
              this.editReimbursement()
            }
            this.expenseClaim();

        },
        methods:{
            editReimbursement: function(){ //页面初始化
              $.ajax({
                  url: this.path + "reimbursement/findReimbursementByReimId",
                  type: 'post',  
                  dataType: 'json',
                  data: {
                     "jobNumber": localStorage.getItem("jobNumber"),
                     "sessionIdOa": localStorage.getItem("sessionIdOa"),
                     "reimId": this.reimId
                  },
                  success: function(data){
                      if(data.code == 200){
                         var startTime = new Date(data["data"]["startTime"]);
                         var endTime = new Date(data["data"]["endTime"]);
                         this.allMoney = data["data"]["totalMoney"];
                         this.startTime = this.formatDate(startTime);
                         this.endTime = this.formatDate(endTime);
                         this.expensesList = data["data"]["reimDateilsList"];
                      }else {
                         this.$refs.childAlert.show(data.msg);
                      }
                      
                  }.bind(this),
                  error: function(err){
                    console.log("登录异常");
                  }
              })
            },
            formatDate: function(date){ //转化时间
              var y = date.getFullYear();  
              var m = date.getMonth() + 1;  
              m = m < 10 ? '0' + m : m;  
              var d = date.getDate();  
              d = d < 10 ? ('0' + d) : d;  
              return y + '-' + m + '-' + d;
            },
            expenseClaim: function(){ //费用明细初始化
              $.ajax({
                  url: this.path + "reimbursement/findReimTypeList",
                  type: 'post',  
                  dataType: 'json',
                  data: {
                     "jobNumber": localStorage.getItem("jobNumber"),
                     "sessionIdOa": localStorage.getItem("sessionIdOa")
                  },
                  success: function(data){
                    if(data.code == 200){
                      this.ReimTypeList = data["data"];
                    }else {
                      this.$refs.childAlert.show(data.msg);
                    }
                      
                  }.bind(this),
                  error: function(err){
                    console.log("登录异常");
                  }
              })
            },
            addExpense: function(){  //新增
              this.expensesList.push(
                {
                  "reimMoney": "", //具体额度
                  "reimTypeId": "",  //明细列表
                  "reimDescription": "",
                  "expenseName": ""
                }) 
            },
            removeExpense: function(v){ //删除
              this.expensesList.splice(v,1);
              this.addValue();
            },            
            previewExpense: function(){ //预览
                this.isShowCover = true;
                this.isShowDetail = true;
                this.userName = localStorage.getItem("userName");
                var d = new Date();
                var month = d.getMonth()+1;
                if(month < 10){
                   month = '0' + month;
                }
                var day = d.getDate();
                if(day < 10){
                   day = '0' + day;
                }
                var str = d.getFullYear()+"-"+ month +"-"+ day;
                this.nowTime = str;
                this.listNum = this.expensesList.length;
                this.chineseNum = this.NoToChinese(this.allMoney);                               
            },
            NoToChinese: function(money){ //金额汉字大写
                //汉字的数字
                var cnNums = new Array('零', '壹', '贰', '叁', '肆', '伍', '陆', '柒', '捌', '玖');
                //基本单位
                var cnIntRadice = new Array('', '拾', '佰', '仟');
                //对应整数部分扩展单位
                var cnIntUnits = new Array('', '万', '亿', '兆');
                //对应小数部分单位
                var cnDecUnits = new Array('角', '分', '毫', '厘');
                //整数金额时后面跟的字符
                var cnInteger = '整';
                //整型完以后的单位
                var cnIntLast = '元';
                //最大处理的数字
                var maxNum = 999999999999999.9999;
                //金额整数部分
                var integerNum;
                //金额小数部分
                var decimalNum;
                //输出的中文金额字符串
                var chineseStr = '';
                //分离金额后用的数组，预定义
                var parts;
                if (money == '') { return ''; }
                money = parseFloat(money);
                if (money >= maxNum) {
                  //超出最大处理数字
                  return '';
                }
                if (money == 0) {
                  chineseStr = cnNums[0] + cnIntLast + cnInteger;
                  return chineseStr;
                }
                //转换为字符串
                money = money.toString();
                if (money.indexOf('.') == -1) {
                  integerNum = money;
                  decimalNum = '';
                } else {
                  parts = money.split('.');
                  integerNum = parts[0];
                  decimalNum = parts[1].substr(0, 4);
                }
                //获取整型部分转换
                if (parseInt(integerNum, 10) > 0) {
                  var zeroCount = 0;
                  var IntLen = integerNum.length;
                  for (var i = 0; i < IntLen; i++) {
                    var n = integerNum.substr(i, 1);
                    var p = IntLen - i - 1;
                    var q = p / 4;
                    var m = p % 4;
                    if (n == '0') {
                      zeroCount++;
                    } else {
                      if (zeroCount > 0) {
                        chineseStr += cnNums[0];
                      }
                      //归零
                      zeroCount = 0;
                      chineseStr += cnNums[parseInt(n)] + cnIntRadice[m];
                    }
                    if (m == 0 && zeroCount < 4) {
                      chineseStr += cnIntUnits[q];
                    }
                  }
                  chineseStr += cnIntLast;
                }
                //小数部分
                if (decimalNum != '') {
                  var decLen = decimalNum.length;
                  for (var i = 0; i < decLen; i++) {
                    var n = decimalNum.substr(i, 1);
                    if (n != '0') {
                      chineseStr += cnNums[Number(n)] + cnDecUnits[i];
                    }
                  }
                }
                if (chineseStr == '') {
                  chineseStr += cnNums[0] + cnIntLast + cnInteger;
                } else if (decimalNum == '') {
                  chineseStr += cnInteger;
                }
                return chineseStr;
            },
            selectChange: function(v){
              for(var i=0;i<this.ReimTypeList.length;i++){
                  if(this.ReimTypeList[i].reimTypeId == this.expensesList[v].reimTypeId){
                     this.expensesList[v].expenseName = this.ReimTypeList[i].reimTypeName;
                     break;
                  }
              }
            },
            inputKey: function(v){ //输入框数字校验
              if(isNaN(this.expensesList[v].reimMoney) || Number(this.expensesList[v].reimMoney) <= 0){
                  this.expensesList[v].reimMoney = '';
              }
              var obj = this.expensesList[v].reimMoney;

              obj = obj.replace(/[^\d.]/g,"");  //清除“数字”和“.”以外的字符
              obj = obj.replace(/\.{2,}/g,"."); //只保留第一个. 清除多余的
              obj = obj.replace(".","$#$").replace(/\./g,"").replace("$#$",".");
              obj = obj.replace(/^(\-)*(\d+)\.(\d\d).*$/,'$1$2.$3');//只能输入两个小数
              if(obj.indexOf(".")< 0 && obj !=""){//以上已经过滤，此处控制的是如果没有小数点，首位不能为类似于 01、02的金额
                obj= parseFloat(obj);
              }

              this.expensesList[v].reimMoney = obj

              this.addValue();
            },           
            addValue: function(){ //计算总金额
                var addResult = 0;
                for(var i=0;i<this.expensesList.length;i++){
                    addResult = Number(addResult) + Number(this.expensesList[i]['reimMoney']);
                }
                this.allMoney = addResult.toFixed(2);
            },
            closePop: function(){ //关闭按钮
                this.isShowCover = false;
                this.isShowDetail = false;                
            },
            reload: function(){
                location.reload();
            },
            submitExpense: function(){ //提交                         
              if(!this.startTime){
                  this.$refs.childAlert.show("请选择开始时间");
                  return false;
              }
              if(!this.endTime){
                  this.$refs.childAlert.show("请选择结束时间");
                  return false;
              }
              var ks=new Date(this.startTime).getTime();
              var js=new Date(this.endTime).getTime();

              if(ks >= js){
                  this.$refs.childAlert.show("结束时间需大于开始时间");
                  return false;
              }
                       
              for(var i=0;i<this.expensesList.length;i++){
                  if(this.expensesList[i].reimMoney == "" || this.expensesList[i].reimTypeId == "" || this.expensesList[i].reimDescription == ""){                   
                     this.$refs.childAlert.show("请填写完整费用明细");
                     return false;
                  }
              }
              if(this.allMoney == 0){
                 this.addValue();
              }
              var jsonExpen = JSON.stringify(this.expensesList);
              this.$refs.childLoading.show();
              $.ajax({
                  url: this.path + "reimbursement/insertReimbursement",
                  type: 'post',  
                  dataType: 'json',
                  data: {
                     "jobNumber": localStorage.getItem("jobNumber"),
                     "sessionIdOa": localStorage.getItem("sessionIdOa"),
                     "startDate": this.startTime,
                     "endDate": this.endTime,
                     "totalMoney": this.allMoney,
                     "reimDetailsString": jsonExpen,
                     "oldReimId": this.reimId
                  },
                  success: function(data){
                    this.$refs.childLoading.hide();
                    if(data.code == 200){
                        this.$refs.childAlert.show("提交成功", function(){
                          this.$router.push('/mainIndex/reimbursement/followUp');
                        });

                    }else{
                      this.$refs.childAlert.show(data["msg"]);
                    }
                        
                  }.bind(this),
                  error: function(err){
                    console.log("登录异常");
                  }
              }) 
            }



        }
        
    }
</script>