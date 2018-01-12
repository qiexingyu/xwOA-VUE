<template>
  <div class="hello">
      <div class="gonggao_bread">
        <a href="#/mainIndex/index" class="fa">首页</a>
        &gt;
        <span>报销管理</span>
        &gt;
        <span>申请进度查询</span>
      </div>
      <div class="search_div">
        <label>开始时间：</label>

        <el-date-picker
          v-model="searchData.startDate"
          type="date"
          format="yyyy-MM-dd"
          value-format="yyyy-MM-dd"
          placeholder="选择日期">
        </el-date-picker>

        <label>结束时间：</label>

        <el-date-picker
          v-model="searchData.endDate"
          type="date"
          format="yyyy-MM-dd"
          value-format="yyyy-MM-dd"
          placeholder="选择日期">
        </el-date-picker>

        <span class="btn-blue-s sear_btn" v-on:click="findReimburseList">查询</span>
      </div>

      <div class="gonggao_body table_body" style="text-align: center;">
        <div class="data_table_head">
          <ul>
            <li class="td7 xh">序号</li>
            <li class="td16">申请日期</li>
            <li class="td13">报销额度</li>
            <li class="td11">当前节点审批人</li>
            <li class="td16">最后审批时间</li>
            <li class="td13" style="min-width: 160px">申请状态</li>
            <li class="td19" style="text-align: left;padding-left: 3%">操作</li>
          </ul>
        </div>
        <div class="data_table_body" style="text-align: center;">
          <ul v-if="followUpList.length!=0" v-for="(list, i) in followUpList">
            <li class="td7 xh">{{ i+1 }}</li>
            <li class="td16">{{ list.createTime }}</li>
            <li class="td13">{{ list.totalMoney.toFixed(2) }}</li>
            <li class="td11">{{ list.assigneeUserName }}</li>
            <li class="td16">{{ list.lastHandlerTime }}</li>
            <li class="td13" style="min-width: 160px;">
                 <a class="table_la" v-if="list.status==2 && list.editeFlag==1" style="color: #666">已修改重提</a>
                 <a class="table_la" v-if="list.editeFlag!=1" style="color: #666">{{ showStatus[list.status] }}</a>
                 <a href="javascript:void(0);" class="table_del" v-if="list.status==2" v-on:click="viewReason(list.reason)">查看原因</a>
            </li>
            <li class="td19" style="text-align: left;padding-left: 3%">
              <a href="javascript:void(0);" class="table_pa" v-on:click="viewPop(list.reimId)">查看详情</a>
              <a v-bind:href="'/#/mainIndex/reimbursement/expenseClaim?reimId='+list.reimId" v-on:click="amendExpense(list.reimId)" class="table_la" v-if="list.status==2 && list.editeFlag==0">修改重提</a>
              <a href="javascript:void(0);" class="table_lv" v-if="list.status==3" v-on:click="printExpense(list.reimId)">打印</a>
            </li>
          </ul>
          <ul v-if="followUpList.length==0">
             <li class="td7 xh" style="width: 100%;color: red;">暂无申请记录</li>
          </ul>
        </div>
      


      </div>

      <oa-page ref="childPage"></oa-page>

      <div class="bgpop" v-if="isShowCover"></div>
      <div class="view_area" style="width: 800px;height: 450px;padding: 5px 20px" v-if="isShowDetail">
            
            <div class="menEdit peoMenEdit">
                 <div style="margin-top: 10px"><span>申请时间：</span><span>{{ expensesList.createTime }}</span></div>
                 <div style="margin-top: 10px"><span>申请人：</span><span style="color: #00a1e9">{{ expensesList.userName }}</span></div>                              
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

                         <tr v-for="(exp,v) in expensesList.reimDateilsList">
                             <td v-if="v==0" style="width:240px" colspan="3" :rowspan="listNum" class="huang">{{ expensesList.startTime }} -- {{ expensesList.endTime }}</td>
                             <td>{{ v+1 }}</td>
                             <td>{{ exp.reimTypeName }}</td>
                             <td>{{ exp.reimMoney.toFixed(2) }}</td>
                             <td>{{ exp.reimDescription }}</td>                                
                         </tr>

                  </table>
                                                            
            </div>  

            <div >
                <div style="margin-top: 10px;text-align: right;padding-right: 20px"><span>金额：</span><span style="color: #FF6666;font-size: 20px;">{{ expensesList.totalMoney.toFixed(2) }}</span> 元</div>
                <div style="margin-top: 10px;text-align: right;padding-right: 20px"><span>大写：</span><span style="font-size: 20px;">{{ chineseNum }}</span></div>                              
            </div>          
           
            <div class="view_btn" style="margin-top: 20px">
                 <span class="btn-yellow-s" v-on:click="closePop">关闭</span>
            </div>

      </div>

      <div  class="view_area" style="width: 800px;height: 450px;padding: 5px 20px" v-if="isShowPrint">
         <div id="printExpense">
            <div class="menEdit peoMenEdit">
                 <div style="margin-top: 10px"><span>申请时间：</span><span>{{ expensesList.createTime }}</span></div>
                 <div style="margin-top: 10px"><span>申请人：</span><span style="color: #00a1e9">{{ expensesList.userName }}</span></div>                              
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

                         <tr v-for="(exp,v) in expensesList.reimDateilsList">
                             <td v-if="v==0" style="width:240px" colspan="3" :rowspan="listNum" class="huang">{{ expensesList.startTime }} -- {{ expensesList.endTime }}</td>
                             <td>{{ v+1 }}</td>
                             <td>{{ exp.reimTypeName }}</td>
                             <td>{{ exp.reimMoney.toFixed(2) }}</td>
                             <td>{{ exp.reimDescription }}</td>                                
                         </tr>

                  </table>
                                                            
            </div>  

            <div >
                <div style="margin-top: 10px;text-align: right;padding-right: 20px"><span>金额：</span><span style="color: #FF6666;font-size: 20px;">{{ expensesList.totalMoney.toFixed(2) }}</span> 元</div>
                <div style="margin-top: 10px;text-align: right;padding-right: 20px"><span>大写：</span><span style="font-size: 18px;">{{ chineseNum }}</span></div>                              
                <div style="margin-top: 10px;text-align: right;padding-right: 20px">
                    <span>审批人：</span>
                    <span style="font-size: 15px;" >
                          {{ userName }} 
                    </span>
                </div>                              
            </div> 
         </div>  
                                
         <div class="view_btn" style="margin-top: 20px">
              <span class="btn-blue-s" v-on:click="print(printExpense)">打印</span>
              <span class="btn-yellow-s" v-on:click="closePrint">取消</span>
         </div>

      </div>

      <div class="view_area" style="width: 500px;height: 250px;padding: 5px 20px" v-if="isShowReject">

          <div class="content" style="font-size: 20px;font-weight: 700;text-align: center" >拒绝原因</div>
          <div class="menEdit" style="widtH: 100%;height: 120px;margin-top: 30px">
                <label class="label_tit-1" style="width: 70px;height: 40px;line-height: 40px">拒绝原因：</label>
                <textarea style="width: 370px;margin-left: 10px" placeholder="请描述拒绝原因" class="form_input-5" v-model="reason" ></textarea>
          </div>
          <div class="view_btn" style="margin-top: 20px">
               <span class="btn-yellow-s" v-on:click="closeReject">关闭</span>
          </div>

      </div>
      
      <oa-alert ref="childAlert"></oa-alert>
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
</style>

<script>
import $ from 'jquery'
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
      searchData: {
        startDate: '',
        endDate: ''
      },
      reimId: '',
      reason: '', //原因
      followUpList: [],
      listNum: '',  //费用编号
      chineseNum: '',
      isShowCover: false,
      isShowDetail: false,
      isShowReject: false,
      isShowPrint: false,
      showStatus: {
        "1": "待审批",
        "2": "审批失败",
        "3": "审批成功",
        "4": "已修改成功"
      },
      showreimType: {
        "1": "办公费",
        "2": "交通费",
        "3": "住宿费",
        "4": "餐费",
        "5": "车费",
        "6": "杂费",
        "7": "宣传费",
        "8": "其它"
      },
      expensesList:{
          "createTime": "", 
          "startTime": "", 
          "endTime": "",  
          "totalMoney": "",
          "userName": "",
          "totalMoney": "",
          "reimDateilsList": []
      },
      userName: '',
      pageNum: 1,
      pageSize: 10
     
    }
  },
  created: function () {
    this.findReimburseList();    //查询申请进度列表
  },
  methods: {
    updateApply: function(id, isStatus, costCategory){        //修改重提跳转
      if(isStatus == 1){       //额度调拨
        this.$router.push('/mainIndex/QuotaApply?id='+id);
      }else{
        switch(costCategory)
        {
          case 1:
          this.$router.push('/mainIndex/PersonApply?id='+id);
          break;

          case 2:
          this.$router.push('/mainIndex/ExtraApply?id='+id);
          break;

          case 3:
          this.$router.push('/mainIndex/AreaApply?id='+id);
          break;
        }
      }
    },  
    findReimburseList: function(pn, ps){ //查询申请进度列表
      //pn: 当前页数  ps：每页条数
      if(pn && typeof(pn)!='object'){
        this.pageNum = pn;
      }
      if(ps && typeof(ps)!='object'){
        this.pageSize = ps;
      }

      $.ajax({
        url: this.path + "reimbursement/findReimburseListPage",
        type: "post",
        dataType: "json",
        data: {
          "jobNumber": localStorage.getItem("jobNumber"),
          "sessionIdOa": localStorage.getItem("sessionIdOa"),
          "startDate": this.searchData.startDate,
          "endDate": this.searchData.endDate        
        },
        success: function(data){
          if(data.code == 200){
             this.followUpList = data["data"]["list"];
             this.$refs.childPage.setArg(data["data"]["pages"], this.pageNum, this.pageSize, this.findReimburseList);
          }else {
            this.$refs.childAlert.show(data["msg"]);
          }

        }.bind(this),
        error: function(){
          console.log("获取申请进度列表异常");
        }
      });
    },
    viewPop: function(reimId){
      this.isShowCover = true;
      this.isShowDetail = true;
      this.reimId = reimId;
      $.ajax({
        url: this.path + "reimbursement/findReimbursementByReimId",
        type: "post",
        dataType: "json",
        data: {
          "jobNumber": localStorage.getItem("jobNumber"),
          "sessionIdOa": localStorage.getItem("sessionIdOa"),
          "reimId": this.reimId
        },
        success: function(data){
          if(data.code == 200){
            this.expensesList.reimDateilsList = data["data"]["reimDateilsList"];
            var newDate = new Date(data["data"]["createTime"]);
            var startTime = new Date(data["data"]["startTime"]);
            var endTime = new Date(data["data"]["endTime"]);
            this.expensesList.createTime = this.formatDate(newDate);
            this.expensesList.startTime = this.formatDate(startTime);
            this.expensesList.endTime = this.formatDate(endTime);
            this.expensesList.userName = data["data"]["userName"];
            this.expensesList.totalMoney = data["data"]["totalMoney"];
            this.listNum = this.expensesList.reimDateilsList.length;
            this.chineseNum = this.NoToChinese(this.expensesList.totalMoney);
          }else {
            this.$refs.childAlert.show(data["msg"]);
          }
          
        }.bind(this),
        error: function(){
          console.log("后台异常");
        }
      });
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
    closePop: function(){ //关闭按钮
      this.isShowCover = false;
      this.isShowDetail = false;
    },
    formatDate: function(date){ //转化时间
      var y = date.getFullYear();  
      var m = date.getMonth() + 1;  
      m = m < 10 ? '0' + m : m;  
      var d = date.getDate();  
      d = d < 10 ? ('0' + d) : d;  
      return y + '-' + m + '-' + d;
    },
    viewReason: function(reason){
      this.isShowCover = true;
      this.isShowReject = true;
      this.reason = reason;
    },
    closeReject: function(){
      this.isShowCover = false;
      this.isShowReject = false;
    },
    amendExpense: function(reimId){
      this.reimId = reimId;
    },
    printExpense: function(reimId){  //打印预览
      this.isShowCover = true;
      this.isShowPrint = true;    
      this.reimId = reimId;
      $.ajax({
        url: this.path + "reimbursement/printReimbursement",
        type: "post",
        dataType: "json",
        data: {
          "jobNumber": localStorage.getItem("jobNumber"),
          "sessionIdOa": localStorage.getItem("sessionIdOa"),
          "reimId": this.reimId
        },
        success: function(data){
          if(data.code == 200){
            this.expensesList.reimDateilsList = data["data"]["reimDateilsList"];
            this.userName = data["assigneeUsreList"];
            var newDate = new Date(data["data"]["createTime"]);
            var startTime = new Date(data["data"]["startTime"]);
            var endTime = new Date(data["data"]["endTime"]);
            this.expensesList.createTime = this.formatDate(newDate);
            this.expensesList.startTime = this.formatDate(startTime);
            this.expensesList.endTime = this.formatDate(endTime);
            this.expensesList.userName = data["data"]["userName"];
            this.expensesList.totalMoney = data["data"]["totalMoney"];
            this.listNum = this.expensesList.reimDateilsList.length;
            this.chineseNum = this.NoToChinese(this.expensesList.totalMoney);
          }else {
            this.$refs.childAlert.show(data["msg"]);
          }
          
        }.bind(this),
        error: function(){
          console.log("后台异常");
        }
      });
      
    },
    closePrint: function(){
      this.isShowCover = false;
      this.isShowPrint = false;
    },
    print: function(){ //打印
      var newstr = document.getElementById("printExpense").innerHTML;
      var oldstr = document.body.innerHTML;
      document.body.innerHTML = newstr;
      window.print();
      window.location.reload();
      //document.body.innerHTML = oldstr;       
      return false;    
    }
    

  }  
}
</script>


