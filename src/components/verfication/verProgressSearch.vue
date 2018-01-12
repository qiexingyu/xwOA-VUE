<template>
  <div class="hello">
    <div class="gonggao_bread">
        <a href="#/mainIndex/index" class="fa">首页</a>
        &gt;
        <span>费用核销</span>
        &gt;
        <span>核销进度查询</span>
      </div>
      <div class="search_div yydo">
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
        <span class="btn-blue-s sear_btn" v-on:click="getList">查询</span>
      </div>
      <div class="gonggao_body table_body">
        <div class="data_table_head">
          <ul>
            <li class="td6 xh">序号</li>
            <li class="td10">申请日期</li>
            <li class="td12">费用核销类型</li>
            <li class="td9">核销额度</li>
            <li class="td10">当前节点审批人</li>
            <li class="td13">最后审批时间</li>
            <li class="td16">申请状态</li>
            <li class="td14">操作</li>
            <li class="td10">打印状态</li>
          </ul>
        </div>
        <div class="data_table_body">
          <ul v-for="(l, i) in listData" v-if="listData.length>=0">
            <li class="td6 xh">{{ i+1 }}</li>
            <li class="td10">{{ OACommon.getOADate(new Date(l.createDate)).todayDate }}</li>
            <li class="td12">{{ l.list[0]["createDate"] }}-{{ costCategoryObj[l.list[0]["costCategory"]] }}</li>
            <li class="td9">{{ l.verificationTotalMoney.toFixed(2) }}</li>
            <li class="td10">{{ l.userName }}</li>
            <li class="td13">{{ l.handlerTime?getYear2Second(l.handlerTime):'' }}</li>
            <li class="td16">
              {{ statusObj[l.status] }}&nbsp;&nbsp;{{ l.editeFlag==1?'已修改重提':'' }}&nbsp;&nbsp;
              <a href="javascript:void(0);" v-if="l.status==2" v-on:click="showReason(l.reason)">原因</a>
            </li>
            <li class="td14">
              <a href="javascript:void(0);" class="table_pa" v-on:click="viewPop(l.verificationId, l.createDate, l.status)">查看详情</a>
              <a href="javascript:void(0);" class="table_del" v-if="(l.printCount>0&&l.status==1)||(l.status==3)" v-on:click="printViewPop(l.verificationId, l.createDate, l.status)">打印</a>
              <a v-bind:href="'#/mainIndex/verfication/confirmMoney?verificationId='+l.verificationId" class="table_del" v-if="l.status==2&&l.editeFlag==0">修改重提</a>
            </li>
            <li class="td10">{{ (l.printCount==1&&l.status==1)?'待打印':(((l.printCount==2)
||(l.printCount==1&&l.status==3)||(l.printCount==1&&l.status==2))?'已打印':'无') }}</li>
          </ul>
          <ul v-if="listData.length==0">
            <li style="text-align:center;width:100%;color:red;">暂无数据</li>
          </ul>
        </div>
      </div>

      <oa-page ref="childPage"></oa-page>

      <div class="bgpop" v-bind:class="{'check': viewData.shCheck}" v-on:click="closeViewPop"></div>
      <div class="view_area" style="width:1124px;height:auto;max-height:400px;overflow-y:auto;"
       v-bind:class="{'check': viewData.shCheck}" ref="viewK">
       <span class="closexx" style="margin-right:10px;" v-on:click="closeViewPop"><Icon type="android-cancel"></Icon></span>
       <div id="printExpense">
          <div style="margin:30px 20px 20px;border:1px solid #000;padding:5px;">
            <p>申请人：{{ viewData.viewSanData.areaName }}-{{ viewData.viewSanData.userName }}</p>
            <p>申请时间：{{ viewData.viewSanData.applyDate }}</p>
            <p>核销类型：{{ viewData.viewSanData.createDate }}&nbsp;&nbsp;{{ costCategoryObj[viewData.viewSanData.costategory] }}</p>
          </div>
          <div class="view_eve_table_div">
            <table cellpadding="0" cellspacing="0" border="1" class="ver_print">
              <thead class="print">
                <tr>
                  <td width="7%">省份</td>
                  <td width="7%">课程类型</td>
                  <td width="8%">额度类别</td>
                  <td width="9%">学校</td>
                  <td width="7%">客户</td>
                  <td width="7%">额度</td>
                  <td width="13%">额度用途</td>
                  <td width="16%">目标</td>
                  <td width="7%">实际花费</td>
                  <td width="12%">备注</td>
                  <td width="7%" v-if="hxeMoneyShow">实际核销额</td>
                </tr>
              </thead>
              <tbody v-for="(v, vi) in viewData.viewListData">
                <tr v-for="(eve, k) in v">
                  <td v-bind:rowspan="v.length" v-if="k==0">{{ vi }}</td>
                  <td v-bind:rowspan="v.length" v-if="k==0">{{ eve.courseType?courseTypeObj[eve.courseType]:'N/A' }}</td>
                  <td>{{ eve.costTypeName?eve.costTypeName:'N/A' }}</td>
                  <td><span v-for="(s, si) in eve.costDetailCustomerVos">{{ s.customerName?s.customerName:'N/A' }}<span v-if="si!=eve.costDetailCustomerVos.length-1">,</span></span></td>
                  <td>{{ eve.costDetailCustomerVos[0]["contactsName"]?eve.costDetailCustomerVos[0]["contactsName"]:'N/A' }}</td>
                  <td>{{ eve.quota.toFixed(2) }}</td>
                  <td class="tleft" v-if="viewData.viewSanData.costategory!=2">{{ eve.quotaPurpose }}</td>
                  <td class="tleft" v-if="viewData.viewSanData.costategory==2&&viewData.viewSanData.costTypeExtra==1">
                    材料费：{{ eve.materialCost.toFixed(2) }} <br/>
                    <span style="font-size:12px;">招生人数：{{ eve.enrollment }}</span>
                    <br/>
                    用途：{{ eve.quotaPurpose }}
                  </td>
                  <td class="tleft" v-if="viewData.viewSanData.costategory==2&&viewData.viewSanData.costTypeExtra!=1">
                    材料费：{{ eve.materialCost.toFixed(2) }} <br/>
                    <span style="font-size:12px;">天数：{{ eve.days }}</span>
                    <br/>
                    用途：{{ eve.quotaPurpose }}
                  </td>
                  <td class="tleft">{{ eve.target }}</td>
                  <td>{{ eve.actualCostSalesMoney.toFixed(2) }}</td>
                  <td>{{ eve.remark }}</td>
                  <td v-if="hxeMoneyShow">{{ eve.actualCostCfoMoney?eve.actualCostCfoMoney.toFixed(2):'0.00' }}</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div style="margin:20px;text-align:right;">
            <p v-if="hxeMoneyShow">总计：{{ viewData.viewSanData.verificationCfoTotalMoney?viewData.viewSanData.verificationCfoTotalMoney.toFixed(2):'0.00' }}元</p>
            <p v-if="!hxeMoneyShow">总计：{{ viewData.viewSanData.verificationTotalMoney?viewData.viewSanData.verificationTotalMoney.toFixed(2):'0.00' }}元</p>
            <p v-if="hxeMoneyShow">大写：{{ OACommon.lower2UpperNum(viewData.viewSanData.verificationCfoTotalMoney) }}</p>
            <p v-if="!hxeMoneyShow">大写：{{ OACommon.lower2UpperNum(viewData.viewSanData.verificationTotalMoney) }}</p>
          </div>
          <div style="margin:10px 20px;text-align:right;" v-if="viewData.checkMan">审批人：{{ viewData.checkMan }}</div>
        </div>
        <div class="view_btn" style="margin-top:20px;margin-bottom:25px;">
          <span class="btn-blue-s" v-on:click="closeViewPop">关闭</span>
          <span class="btn-yellow-s" v-on:click="go2PrintViewPop" v-if="viewData.checkMan">打印</span>
        </div>
      </div>

      <oa-alert ref="childAlert"></oa-alert>
  </div>
</template>

<script>
import $ from 'jquery'
import oaPage from '@/components/commonVue/Page'
import oaAlert from '@/components/commonVue/Alert'

export default {
  name: 'verProgressSearch',
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
      listData: [],
      pageNum: 1,
      pageSize: 10,
      costCategoryObj: {
        1: "个人统筹",
        2: "Extra费用",
        3: "区域费用",
        4: "开课费用"
      },
      statusObj: {
        1: "待审批",
        2: "审批失败",
        3: "审批成功"
      },
      courseTypeObj: {
        "1": "常规课",
        "2": "合作课"
      },
      viewData: {
        shCheck: true,
        viewListData: [],
        viewSanData: {},
        checkMan: ''
      },
      verificationId: 0,   //打印需要的verificationId
      hxeMoneyShow: false
    }
  },
  created: function () {
    //设置时间
    //this.searchData.startDate = this.OACommon.getOADate(new Date()).prevMonthToday;
    //this.searchData.endDate = this.OACommon.getOADate(new Date()).todayDate;

    this.getList();
  },
  methods: {
    showReason: function(reason){
      this.$refs.childAlert.show(reason);
    },
    go2PrintViewPop: function(){
      $.ajax({
        url: this.path + "verification/updatePrintCount",
        type: "post",
        dataType: "json",
        data: {
          "jobNumber": localStorage.getItem("jobNumber"),
          "sessionIdOa": localStorage.getItem("sessionIdOa"),
          "verificationId": this.verificationId
        },
        success: function(data){
          this.verificationId = 0;
        }.bind(this),
        error: function(){
          console.log("记录打印次数异常");
        }
      });
      var newstr = document.getElementById("printExpense").innerHTML;
      var oldstr = document.body.innerHTML;
      document.body.innerHTML = newstr;
      window.print();
      window.location.reload();
      //document.body.innerHTML = oldstr;       
      return false;  
    },
    closeViewPop: function(){
      this.viewData.shCheck = true;
      this.verificationId = 0;
    },
    printViewPop: function(id, createDate, moneyStatus){
      this.viewData.shCheck = false;
      this.hxeMoneyShow = (moneyStatus==3)?true:false;
      this.verificationId = id;         //打印需要的id
      $.ajax({
        url: this.path + "verification/findVerificationAndAssigneeNamesById",
        type: "post",
        dataType: "json",
        data: {
          "jobNumber": localStorage.getItem("jobNumber"),
          "sessionIdOa": localStorage.getItem("sessionIdOa"),
          "verificationId": id
        },
        success: function(data){
          this.viewData.checkMan = data["assigneeUsreList"];
          this.viewData.viewSanData = data["data"];
          this.viewData.viewSanData.applyDate = this.OACommon.getOADate(new Date(createDate)).todayDate;
          this.viewData.viewListData = data["data"]["detailsProvinceList"];
        }.bind(this),
        error: function(){
          console.log("查询详情异常");
        }
      });
    },
    viewPop: function(id, createDate, moneyStatus){
      this.viewData.shCheck = false;
      this.hxeMoneyShow = (moneyStatus==3)?true:false;
      $.ajax({
        url: this.path + "verification/findVerificationById",
        type: "post",
        dataType: "json",
        data: {
          "jobNumber": localStorage.getItem("jobNumber"),
          "sessionIdOa": localStorage.getItem("sessionIdOa"),
          "verificationId": id
        },
        success: function(data){
          this.viewData.viewSanData = data["data"];
          this.viewData.viewSanData.applyDate = this.OACommon.getOADate(new Date(createDate)).todayDate;
          this.viewData.viewListData = data["data"]["detailsProvinceList"];
        }.bind(this),
        error: function(){
          console.log("查询详情异常");
        }
      });
    },
    getList: function(pn, ps){
      //pn: 当前页数  ps：每页条数
      if(pn && typeof(pn)!='object'){
        this.pageNum = pn;
      }
      if(ps && typeof(ps)!='object'){
        this.pageSize = ps;
      }  

      $.ajax({
        url: this.path + "verification/findPersonalProgressPageList",
        type: "post",
        dataType: "json",
        data: {
          "jobNumber": localStorage.getItem("jobNumber"),
          "sessionIdOa": localStorage.getItem("sessionIdOa"),
          "startDate": this.searchData.startDate,
          "endDate": this.searchData.endDate,
          "pageNum": this.pageNum,
          "pageSize": this.pageSize
        },
        success: function(data){
          this.listData = data["data"]["list"];

          this.$refs.childPage.setArg(data["data"]["pages"], this.pageNum, this.pageSize, this.getList);
        }.bind(this),
        error: function(){
          console.log("获取列表数据异常");
        }
      });
    },
    getYear2Second: function(src){
      var date = new Date(src);
      var year = date.getFullYear();
      var month = date.getMonth()+1;
      var day = date.getDate();
      var hour = date.getHours();
      var minute = date.getMinutes();
      var second = date.getSeconds();
      month = month<10?"0"+month:month;
      day = day<10?"0"+day:day;
      hour = hour<10?"0"+hour:hour;
      minute = minute<10?"0"+minute:minute;
      second = second<10?"0"+second:second;
      return year + "-" + month + "-" + day + "  " + hour + ":" + minute + ":" + second;
    }
  }
}
</script>
<style>
	.el-date-editor.el-input, .el-date-editor.el-input__inner{width:170px;cursor:pointer;}
  .el-input__inner{height:30px;line-height:30px;cursor:pointer;border:1px solid #C9C9C9;}
  .el-input__icon{line-height:30px;}

  .view_eve_table_div{margin:10px 20px 0;}
  .view_eve_table_div table{width:100%;border-collapse:collapse;border:1px solid #d9d9d9;}
  .view_eve_table_div table td{text-align:center;vertical-align:middle;padding:3px 2px;}
  .view_eve_table_div table tbody td{font-size:12px;}
  .view_eve_table_div table td.tleft{text-align:left;padding-left:5px;}
</style>

