<template>
  <div class="hello">
      <div class="gonggao_bread">
        <a href="#/mainIndex/index" class="fa">首页</a>
        &gt;
        <span>报销管理</span>
        &gt;
        <span>个人待办</span>
      </div>
     
      <div class="gonggao_body table_body" style="text-align: center;">
        <div class="data_table_head">
          <ul>
            <li class="td7 xh">序号</li>
            <li class="td16">申请日期</li>
            <li class="td16">申请人</li>
            <li class="td13">所属部门</li>
            <li class="td16">报销额度</li>
            <li class="td10">详情</li>
            <li class="td19">操作</li>
            
          </ul>
        </div>
        <div class="data_table_body" style="text-align: center;">
          <ul v-if="findPersonList.length!=0" v-for="(list, i) in findPersonList">
            <li class="td7 xh">{{ i+1 }}</li>
            <li class="td16">{{ list.createTime }}</li>
            <li class="td16">{{ list.userName }}</li>
            <li class="td13">{{ list.deptName }}</li>
            <li class="td16">{{ list.totalMoney.toFixed(2) }}</li>
            <li class="td10">
              <a href="javascript:void(0);" class="table_pa" v-on:click="viewPop(list.reimId)">查看详情</a>
            </li>
            <li class="td19">
              <a href="javascript:void(0);" class="table_pa" v-on:click="Pass(list.reimId)">通过</a>
              <a href="javascript:void(0);" class="table_la" v-on:click="reject(list.reimId)">拒绝</a>
            </li>
          </ul>
          <ul v-if="findPersonList.length==0">
             <li class="td7 xh" style="width: 100%;color: red;">暂无个人待办事项</li>
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

            <div>
                <div style="margin-top: 10px;text-align: right;padding-right: 20px"><span>金额：</span><span style="color: #FF6666;font-size: 20px;">{{ expensesList.totalMoney.toFixed(2) }}</span> 元</div>
                <div style="margin-top: 10px;text-align: right;padding-right: 20px"><span>大写：</span><span style="font-size: 20px;">{{ chineseNum }}</span></div>                              
            </div>          
           
            <div class="view_btn" style="margin-top: 20px">
                 <span class="btn-yellow-s" v-on:click="closePop">关闭</span>
            </div>
      </div>

      <div class="view_area" style="width: 500px;height: 250px;padding: 5px 20px" v-if="isShowReject">

          <div class="content" style="font-size: 20px;font-weight: 700;text-align: center" >拒绝原因</div>
          <div class="menEdit" style="widtH: 100%;height: 120px;margin-top: 30px">
                <label class="label_tit-1" style="width: 70px;height: 40px;line-height: 40px">拒绝原因：</label>
                <textarea style="width: 370px;margin-left: 10px" placeholder="请描述拒绝原因" class="form_input-5" v-model="reason" ></textarea>
        
          </div>

          
          <div class="view_btn" style="margin-top: 20px">
               <span class="btn-blue-s" v-on:click="submitReject">提交</span>
               <span class="btn-yellow-s" v-on:click="closeReject">取消</span>
          </div>

      </div>
      
      <oa-alert ref="childAlert"></oa-alert>
      <oa-confirm ref="childConfirm"></oa-confirm>
      <oa-load ref="childLoading"></oa-load>

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
import oaConfirm from '@/components/commonVue/Confirm'
import Loading from '@/components/commonVue/Loading'
export default {
  name: 'ProgressSearch',
  components: {
      'oa-page': oaPage,
      'oa-alert': oaAlert,
      'oa-confirm': oaConfirm,
      'oa-load': Loading
    },
  data () {
    return {
      path: this.OACommon["publicDef"]["qpath"],
      searchData: {
        startDate: '',
        endDate: ''
      },
      reimId: '',
      findPersonList: [],
      listNum: '',  //费用编号
      chineseNum: '', //金额中文
      action: '',
      reason: '', //原因
      isShowCover: false,
      isShowDetail: false,
      isShowReject: false,
      showreimType: {
        "1": "办公费",
        "2": "交通费",
        "3": "住宿费",
        "4": "餐费",
        "5": "车费",
        "6": "杂费",
        "7": "其它"
      },
      expensesList:{
          "createTime": "", 
          "startTime": "", 
          "endTime": "",  
          "totalMoney": 0.00,
          "userName": "",
          "reimDateilsList": []
      },
      pageNum: 1,
      pageSize: 10
     
    }
  },
  created: function () {
    this.findPersonTaskList();    
  },
  methods: {      
    findPersonTaskList: function(pn, ps){ //查询个人待办列表
      //pn: 当前页数  ps：每页条数
      if(pn && typeof(pn)!='object'){
        this.pageNum = pn;
      }
      if(ps && typeof(ps)!='object'){
        this.pageSize = ps;
      }

      $.ajax({
        url: this.path + "reimbursement/findPersonTaskListPage",
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
            this.findPersonList = data["data"]["list"];
            this.$refs.childPage.setArg(data["data"]["pages"], this.pageNum, this.pageSize, this.findPersonTaskList);
          }else {
            this.$refs.childAlert.show(data["msg"]);
          }

        }.bind(this),
        error: function(){
          console.log("获取申请进度列表异常");
        }
      });
    },
    viewPop: function(reimId){ //查看详情
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
          console.log("获取申请进度列表异常");
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
    closeReject: function(){
      this.isShowCover = false;
      this.isShowReject = false;
    },
    formatDate: function(date){ //转化时间
      var y = date.getFullYear();  
      var m = date.getMonth() + 1;  
      m = m < 10 ? '0' + m : m;  
      var d = date.getDate();  
      d = d < 10 ? ('0' + d) : d;  
      return y + '-' + m + '-' + d;
    },
    Pass: function(reimId){
       this.reimId = reimId;
       this.action = '1';
       this.$refs.childConfirm.show("确定同意本条申请吗？",this.PassSq);       
    },
    PassSq: function(reimId){  
       this.$refs.childLoading.show(); 
       $.ajax({
         url: this.path + "reimbursement/handlerReimburse",
         type: "post",
         dataType: "json",
         data: {
           "jobNumber": localStorage.getItem("jobNumber"),
           "sessionIdOa": localStorage.getItem("sessionIdOa"),
           "reimId": this.reimId,
           "action": this.action
         },
         success: function(data){
          this.$refs.childLoading.hide();
          if(data.code == 200){
            this.$refs.childAlert.show("审核通过");
            this.findPersonTaskList();
          }else {
            this.$refs.childAlert.show(data["msg"]);
          }
                     
         }.bind(this),
         error: function(){
           console.log("后台异常");
         }
       });
    },
    reject: function(reimId){
      this.isShowCover = true;
      this.isShowReject = true;
      this.reimId = reimId;
    },
    submitReject: function(){
      if(this.reason == ""){                   
         this.$refs.childAlert.show("请填写拒绝原因");
         return false;
      }
      this.$refs.childLoading.show(); 
      this.action = '0';
      $.ajax({
       url: this.path + "reimbursement/handlerReimburse",
       type: "post",
       dataType: "json",
       data: {
         "jobNumber": localStorage.getItem("jobNumber"),
         "sessionIdOa": localStorage.getItem("sessionIdOa"),
         "reimId": this.reimId,
         "action": this.action,
         "reason": this.reason
       },
       success: function(data){
        this.$refs.childLoading.hide();
        if(data.code == 200){
          this.isShowCover = false;
          this.isShowReject = false;
          this.$refs.childAlert.show("已拒绝",this.findPersonTaskList);
        }else {
          this.$refs.childAlert.show(data["msg"]);
        }
         
       }.bind(this),
       error: function(){
         console.log("后台异常");
        }
      });

    }



  }  
}
</script>


