<template>
  <div class="hello">
    <div class="gonggao_bread">
        <a href="#/mainIndex/index" class="fa">首页</a>
        &gt;
        <span>费用核销</span>
        &gt;
        <span>审核记录</span>
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
            <li class="td12">申请人</li>
            <li class="td10">所属区域</li>
            <li class="td16">费用核销类型</li>
            <li class="td10">核销额度</li>
            <li class="td10">详情</li>
            <li class="td14">状态</li>
            <li class="td10" v-if="caiwuLeader">实际核销额</li>
          </ul>
        </div>
        <div class="data_table_body">
          <ul v-for="(l, i) in listData" v-if="listData.length>=0">
            <li class="td6 xh">{{ i+1 }}</li>
            <li class="td10">{{ OACommon.getOADate(new Date(l.createDate)).todayDate }}</li>
            <li class="td12">{{ l.list[0]["userName"] }}</li>
            <li class="td10">{{ l.list[0]["areaName"] }}</li>
            <li class="td16">{{ l.list[0]["createDate"] }}&nbsp;&nbsp;{{ costCategoryObj[l.list[0]["costCategory"]] }}</li>
            <li class="td10">{{ l.verificationTotalMoney?l.verificationTotalMoney.toFixed(2):'0.00' }}</li>
            <li class="td10">
              <a href="javascript:void(0);" class="table_pa" v-on:click="viewPop(l.verificationId, l.list[0]['userName'], l.createDate)">查看详情</a>
            </li>
            <li class="td14">
              {{ l.status==2?'审核拒绝':'审核通过' }}
              <a href="javascript:void(0);" class="table_del" v-if="l.status==2" v-on:click="showReason(l.reason)">查看原因</a>
              <a href="javascript:void(0);" class="table_del" v-if="l.status!=2&&caiwuLeader" v-on:click="printDetail(l.verificationId, l.list[0]['userName'], l.createDate)">打印</a>
            </li>
            <li class="td10" v-if="caiwuLeader" style="position:relative;">
              {{ l.status==2?'N/A':l.verificationCfoTotalMoney.toFixed(2) }}
              <div class="xiaopen" v-if="l.status==3" v-on:click="leaderHX(l.verificationId)" style="margin-top:9px;right:auto;bottom:auto;">
                <Icon type="compose"></Icon>
              </div>
            </li>
          </ul>
          <ul v-if="listData.length==0">
            <li style="text-align:center;width:100%;color:red;">暂无数据</li>
          </ul>
        </div>
      </div>

      <oa-page ref="childPage"></oa-page>

      <div class="bgpop" v-bind:class="{'check': viewData.shCheck}" v-on:click="closeViewPop"></div>
      <div class="view_area" style="width:1024px;height:auto;max-height:400px;overflow-y:auto;"
       v-bind:class="{'check': viewData.shCheck}" ref="viewK">
        <span class="closexx" style="margin-right:10px;" v-on:click="closeViewPop"><Icon type="android-cancel"></Icon></span>
        <div style="margin:20px;border:1px solid #DDD;padding:5px;">
          <p>申请人：{{ viewData.viewSanData.areaName }}-{{ viewData.userName }}</p>
          <p>申请时间：{{ viewData.viewSanData.applyDate }}</p>
          <p>核销类型：{{ viewData.viewSanData.createDate }}&nbsp;&nbsp;{{ costCategoryObj[viewData.viewSanData.costategory] }}</p>
        </div>
        <div class="view_eve_table_div">
          <table cellpadding="0" cellspacing="0" border="1">
            <thead>
              <tr>
                <td width="8%">省份</td>
                <td width="8%">课程类型</td>
                <td width="8%">额度类别</td>
                <td width="8%">学校</td>
                <td width="8%">客户</td>
                <td width="8%">额度</td>
                <td width="16%">额度用途</td>
                <td width="16%">目标</td>
                <td width="7%">实际花费</td>
                <td width="14%">备注</td>
              </tr>
            </thead>
            <tbody v-for="(v, vi) in viewData.viewListData">
              <tr v-for="(eve, k) in v">
                <td v-bind:rowspan="v.length" v-if="k==0">{{ vi }}</td>
                <td v-bind:rowspan="v.length" v-if="k==0">{{ eve.courseType?courseTypeObj[eve.courseType]:'N/A' }}</td>
                <td>{{ eve.costTypeName?eve.costTypeName:'N/A' }}</td>
                <td><span v-for="(s, si) in eve.costDetailCustomerVos">{{ s.customerName?s.customerName:'N/A' }}<span v-if="si!=eve.costDetailCustomerVos.length-1">,</span></span></td>
                <td>{{ eve.costDetailCustomerVos[0]["contactsName"]?eve.costDetailCustomerVos[0]["contactsName"]:'N/A' }}</td>
                <td>{{ eve.quota?eve.quota.toFixed(2):'' }}</td>
                <td class="tleft" v-if="viewData.viewSanData.costategory!=2">{{ eve.quotaPurpose }}</td>
                <td class="tleft" v-if="viewData.viewSanData.costategory==2&&viewData.viewSanData.costTypeExtra==1">
                  材料费：{{ eve.materialCost?eve.materialCost.toFixed(2):'0.00' }} <br/>
                  <span style="font-size:12px;">招生人数：{{ eve.enrollment }}</span>
                  <br/>
                  用途：{{ eve.quotaPurpose }}
                </td>
                <td class="tleft" v-if="viewData.viewSanData.costategory==2&&viewData.viewSanData.costTypeExtra!=1">
                  材料费：{{ eve.materialCost?eve.materialCost.toFixed(2):'0.00' }} <br/>
                  <span style="font-size:12px;">天数：{{ eve.days }}</span>
                  <br/>
                  用途：{{ eve.quotaPurpose }}
                </td>
                <td class="tleft">{{ eve.target }}</td>
                <td>{{ eve.actualCostSalesMoney?eve.actualCostSalesMoney.toFixed(2):'0.00' }}</td>
                <td>{{ eve.remark }}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div style="margin:20px;text-align:right;">
          <p>总计：{{ viewData.viewSanData.verificationTotalMoney?viewData.viewSanData.verificationTotalMoney.toFixed(2):'0.00' }}元</p>
          <p>大写：{{ OACommon.lower2UpperNum(viewData.viewSanData.verificationTotalMoney) }}</p>
        </div>
        <div class="view_btn" style="margin-top:20px;margin-bottom:25px;">
          <span class="btn-blue-s" v-on:click="closeViewPop">关闭</span>
        </div>
      </div>

      <div class="bgpop" v-bind:class="{'check': hxData.shCheck}" v-on:click="closeHXView"></div>
      <div class="view_area" style="width:1024px;height:auto;max-height:400px;overflow-y:auto;"
       v-bind:class="{'check': hxData.shCheck}">
        <span class="closexx" style="margin-right:10px;" v-on:click="closeHXView"><Icon type="android-cancel"></Icon></span>
        <div style="margin-top:15px;text-align:center;font-size:18px;">实际核销额修改<span style="font-size:12px;color:red;">(实际核销额不能大于实际花费)</span></div>
        <div class="view_eve_table_div">
          <table cellpadding="0" cellspacing="0" border="1">
            <thead>
              <tr>
                <td width="7%">费用类型</td>
                <td width="6%">省份</td>
                <td width="8%">额度类型</td>
                <td width="8%">学校</td>
                <td width="8%">客户</td>
                <td width="8%">额度</td>
                <td width="13%">额度用途</td>
                <td width="10%">目标</td>
                <td width="8%">实际花费</td>
                <td width="11%">备注</td>
                <td width="13%">实际核销额</td>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(h, i) in hxData.hxListData">
                <td v-bind:rowspan="hxData.hxListData.length" v-if="i==0">{{ hxData.hxSanData.createDate }}&nbsp;&nbsp;{{ costCategoryObj[hxData.hxSanData.costategory] }}</td>
                <td>{{ h.provinceName }}</td>
                <td>{{ h.costTypeName?h.costTypeName:'N/A' }}</td>
                <td><span v-for="(s, si) in h.costDetailCustomerVos">{{ s.customerName }}<span v-if="si!=h.costDetailCustomerVos.length-1">,</span></span></td>
                <td>{{ h.costDetailCustomerVos[0]["contactsName"]?h.costDetailCustomerVos[0]["contactsName"]:'N/A' }}</td>
                <td>{{ h.quota?h.quota.toFixed(2):'0.00' }}</td>
                <td class="tleft" v-if="hxData.hxSanData.costategory!=2">{{ h.quotaPurpose }}</td>
                <td class="tleft" v-if="hxData.hxSanData.costategory==2&&hxData.hxSanData.costTypeExtra==1">
                  材料费：{{ h.materialCost?h.materialCost.toFixed(2):'0.00' }} <br/>
                  <span style="font-size:12px;">招生人数：{{ h.enrollment }}</span>
                  <br/>
                  用途：{{ h.quotaPurpose }}
                </td>
                <td class="tleft" v-if="hxData.hxSanData.costategory==2&&hxData.hxSanData.costTypeExtra!=1">
                  材料费：{{ h.materialCost?h.materialCost.toFixed(2):'0.00' }} <br/>
                  <span style="font-size:12px;">天数：{{ h.days }}</span>
                  <br/>
                  用途：{{ h.quotaPurpose }}
                </td>
                <td class="tleft">{{ h.target }}</td>
                <td>{{ h.actualCostSalesMoney?h.actualCostSalesMoney.toFixed(2):'0.00' }}</td>
                <td>{{ h.remark }}</td>
                <td><input type="text" style="width:70px;" v-model="h.actualCostCfoMoney" v-on:blur="leaderHXBlur(i, h.actualCostSalesMoney)"/></td>
              </tr>
            </tbody>
          </table>
        </div>
        <div style="height:20px;color:red;text-align:center;margin-top:10px;">{{ errTip }}</div>
        <div class="view_btn" style="margin-top:20px;margin-bottom:25px;">
          <span class="btn-blue-s" v-on:click="subHXMoney">确认</span>
          <span class="btn-yellow-s" v-on:click="closeHXView">取消</span>
        </div>
      </div>

      <div class="bgpop" v-if="hxPrint.showPause" v-on:click="closePrintPop"></div>
      <div class="view_area" style="width:1088px;height:auto;max-height:400px;overflow-y:auto;" v-if="hxPrint.showPause">
        <span class="closexx" style="margin-right:10px;" v-on:click="closePrintPop"><Icon type="android-cancel"></Icon></span>
        <div id="printExpense">
          <div style="margin:30px 20px 20px;border:1px solid #000;padding:5px;">
            <p>申请人：{{ hxPrint.viewSanData.areaName }}-{{ hxPrint.userName }}</p>
            <p>申请时间：{{ hxPrint.viewSanData.applyDate }}</p>
            <p>核销类型：{{ hxPrint.viewSanData.createDate }}&nbsp;&nbsp;{{ costCategoryObj[hxPrint.viewSanData.costategory] }}</p>
          </div>
          <div class="view_eve_table_div">
            <table cellpadding="0" cellspacing="0" border="1" class="ver_print">
              <thead class="print">
                <tr>
                  <!-- <td width="7%">省份</td>
                  <td width="8%">课程类型</td> -->
                  <td width="33%">额度类别</td>
                  <!-- <td width="8%">学校</td>
                  <td width="8%">客户</td>
                  <td width="7%">额度</td>
                  <td width="13%">额度用途</td>
                  <td width="13%">目标</td> -->
                  <td width="33%">实际花费</td>
                  <!-- <td width="12%">备注</td> -->
                  <td width="33%">实际核销额</td>
                </tr>
              </thead>
              <tbody v-for="(v, vi) in hxPrint.viewListData">
                <tr v-for="(eve, k) in v">
                  <!-- <td v-bind:rowspan="v.length" v-if="k==0">{{ vi }}</td>
                  <td v-bind:rowspan="v.length" v-if="k==0">{{ eve.courseType?courseTypeObj[eve.courseType]:'N/A' }}</td> -->
                  <td>{{ eve.costTypeName?eve.costTypeName:'N/A' }}</td>
                  <!-- <td><span v-for="(s, si) in eve.costDetailCustomerVos">{{ s.customerName?s.customerName:'N/A' }}<span v-if="si!=eve.costDetailCustomerVos.length-1">,</span></span></td> -->
                  <!-- <td>{{ eve.costDetailCustomerVos[0]["contactsName"]?eve.costDetailCustomerVos[0]["contactsName"]:'N/A' }}</td> -->
                  <!-- <td>{{ eve.quota?eve.quota.toFixed(2):'' }}</td> -->
                  <!-- <td class="tleft" v-if="hxPrint.viewSanData.costategory!=2">{{ eve.quotaPurpose }}</td> -->
                  <!-- <td class="tleft" v-if="hxPrint.viewSanData.costategory==2&&hxPrint.viewSanData.costTypeExtra==1">
                    材料费：{{ eve.materialCost?eve.materialCost.toFixed(2):'0.00' }} <br/>
                    <span style="font-size:12px;">招生人数：{{ eve.enrollment }}</span>
                    <br/>
                    用途：{{ eve.quotaPurpose }}
                  </td> -->
                  <!-- <td class="tleft" v-if="hxPrint.viewSanData.costategory==2&&hxPrint.viewSanData.costTypeExtra!=1">
                    材料费：{{ eve.materialCost?eve.materialCost.toFixed(2):'0.00' }} <br/>
                    <span style="font-size:12px;">天数：{{ eve.days }}</span>
                    <br/>
                    用途：{{ eve.quotaPurpose }}
                  </td> -->
                  <!-- <td class="tleft">{{ eve.target }}</td> -->
                  <td>{{ eve.actualCostSalesMoney?eve.actualCostSalesMoney.toFixed(2):'0.00' }}</td>
                  <!-- <td>{{ eve.remark }}</td> -->
                  <td>{{ eve.actualCostCfoMoney?eve.actualCostCfoMoney.toFixed(2):'0.00' }}</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div style="margin:20px;text-align:right;">
            <p>总计：{{ hxPrint.viewSanData.verificationCfoTotalMoney?hxPrint.viewSanData.verificationCfoTotalMoney.toFixed(2):'0.00' }}元</p>
            <p>大写：{{ OACommon.lower2UpperNum(hxPrint.viewSanData.verificationCfoTotalMoney) }}</p>
          </div>
          <div style="margin:10px 20px;text-align:right;" v-if="hxPrint.checkMan">审批人：{{ hxPrint.checkMan }}</div>
        </div>
        <div class="view_btn" style="margin-top:20px;margin-bottom:25px;">
          <span class="btn-blue-s" v-on:click="closePrintPop">关闭</span>
          <span class="btn-yellow-s" v-on:click="go2PrintViewPop">打印</span>
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
      caiwuLeader: false,         //判断是否财务领导
      costCategoryObj: {
        1: "个人统筹费用",
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
        checkMan: '',
        userName: ''
      },
      hxData: {
        shCheck: true,
        hxListData: [],
        hxSanData: {},
        verificationId: 0,              //id
        verificationCfoTotalMoney: 0    //输入框money值总和
      },
      errTip: '',
      hxPrint: {
        showPause: false,
        viewListData: [],
        viewSanData: {},
        checkMan: '',
        userName: ''        
      }
    }
  },
  created: function () {
    //用户权限
    var buttonPermissionList = localStorage.getItem("buttonPermissionList");
    buttonPermissionList = JSON.parse(localStorage.getItem("buttonPermissionList"));
    for(var c=0;c<buttonPermissionList.length;c++){
      if(buttonPermissionList[c]["permissionCode"] == "hexiao_caiwu_learder"){
        this.caiwuLeader = true;
      }
    }
    //设置时间
    //this.searchData.startDate = this.OACommon.getOADate(new Date()).prevMonthToday;
    //this.searchData.endDate = this.OACommon.getOADate(new Date()).todayDate;

    this.getList();
  },
  methods: {
    go2PrintViewPop: function(){
      var newstr = document.getElementById("printExpense").innerHTML;
      var oldstr = document.body.innerHTML;
      document.body.innerHTML = newstr;
      window.print();
      window.location.reload();
      //document.body.innerHTML = oldstr;       
      return false;  
    },
    leaderHXBlur: function(i, money){
      var num = this.hxData.hxListData[i]["actualCostCfoMoney"];
      var reg = /(^[0-9]*$)|(^[0-9]*[\.]{1}[0-9]{1,2}$)/;
      var edvalNum = 0;
      if(!reg.test(num)){
        if(!isNaN(num) && num.indexOf(".")!=-1 && num.split(".")[1].length>2){
          edvalNum = num.split(".")[0] + "." + num.split(".")[1].substring(0, 2);
          this.hxData.hxListData[i]["actualCostCfoMoney"] = edvalNum;
          if(Number(this.hxData.hxListData[i]["actualCostCfoMoney"]) > Number(money)){
            this.hxData.hxListData[i]["actualCostCfoMoney"] = "";
          }else{
            if(this.errTip){
              this.errTip = "";
            }
          }
        }else{
          this.hxData.hxListData[i]["actualCostCfoMoney"] = "";
        }
      }else{
        if(num){
          this.hxData.hxListData[i]["actualCostCfoMoney"] = Number(num).toFixed(2);
          if(Number(this.hxData.hxListData[i]["actualCostCfoMoney"]) > Number(money)){
            this.hxData.hxListData[i]["actualCostCfoMoney"] = "";
          }else{
            if(this.errTip){
              this.errTip = "";
            }
          }
        }else{
          this.hxData.hxListData[i]["actualCostCfoMoney"] = "";
        }
      }
    },
    subHXMoney: function(){
      var subPause = true;
      for(var h=0;h<this.hxData.hxListData.length;h++){
        if(!this.hxData.hxListData[h]["actualCostCfoMoney"]){
          this.errTip = "请输入第" + (h+1) + "个实际核销额";
          subPause = false;
          break;
        }
      }
      if(!subPause){
        return false;
      }

      var verificationDetailIdAndMoney = "[";
      var verificationCfoTotalMoney = 0;
      for(var i=0;i<this.hxData.hxListData.length;i++){
        verificationCfoTotalMoney += Number(this.hxData.hxListData[i]["actualCostCfoMoney"]);

        verificationDetailIdAndMoney += "{"
        verificationDetailIdAndMoney += "\"costDetailsId\":\""+ this.hxData.hxListData[i]["costDetailId"] +"\",";
        verificationDetailIdAndMoney += "\"verificationCfoMoney\":\""+ this.hxData.hxListData[i]["actualCostCfoMoney"] +"\"";
        verificationDetailIdAndMoney += "}"
        if(i != this.hxData.hxListData.length-1){
          verificationDetailIdAndMoney += ","
        }
      }
      verificationDetailIdAndMoney += "]";
      verificationCfoTotalMoney = verificationCfoTotalMoney.toFixed(2);
      $.ajax({
        url: this.path + "verification/updateVerificationActualCostCfoMoney",
        type: "post",
        dataType: "json",
        data: {
          "jobNumber": localStorage.getItem("jobNumber"),
          "sessionIdOa": localStorage.getItem("sessionIdOa"),
          "verificationId": this.hxData.verificationId,
          "verificationDetailIdAndMoney": verificationDetailIdAndMoney,
          "verificationCfoTotalMoney": verificationCfoTotalMoney
        },
        success: function(data){
          if(data["code"] == 200){
            this.hxData.shCheck = true;
            this.$refs.childAlert.show("操作成功");
            this.getList();
          }else{
            this.$refs.childAlert.show(data["msg"]);
          }
        }.bind(this),
        error: function(){
          console.log("领导填写异常");
        }
      });
    },
    closeHXView: function(){
      this.hxData.shCheck = true;
      this.errTip = "";
    },
    leaderHX: function(verificationId){
      this.hxData.verificationId = verificationId;
      this.hxData.shCheck = false;
      $.ajax({
        url: this.path + "verification/findVerificationCostDetailsThree",
        type: "post",
        dataType: "json",
        data: {
          "jobNumber": localStorage.getItem("jobNumber"),
          "sessionIdOa": localStorage.getItem("sessionIdOa"),
          "verificationId": verificationId
        },
        success: function(data){
          this.hxData.hxListData = data["data"]["costDetailsList"];
          this.hxData.hxSanData = data["data"];
        }.bind(this),
        error: function(){
          console.log("财务总监获取核销详情异常");
        }
      });
    },
    showReason: function(reason){
      this.$refs.childAlert.show(reason);
    },
    closeViewPop: function(){
      this.viewData.shCheck = true;
    },
    closePrintPop: function(){
      this.hxPrint.showPause = false;
    },
    
    viewPop: function(id, name, applyDate){
      this.viewData.shCheck = false;
      this.viewData.userName = name;
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
          this.viewData.viewSanData.applyDate = this.OACommon.getOADate(new Date(applyDate)).todayDate;;
          this.viewData.viewListData = data["data"]["detailsProvinceList"];
        }.bind(this),
        error: function(){
          console.log("查询详情异常");
        }
      });
    },
    printDetail: function(id, name, applyDate){
      this.hxPrint.showPause = true;
      this.hxPrint.userName = name;
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
          this.hxPrint.checkMan = data["assigneeUsreList"];
          this.hxPrint.viewSanData = data["data"];
          this.hxPrint.viewSanData.applyDate = this.OACommon.getOADate(new Date(applyDate)).todayDate;;
          this.hxPrint.viewListData = data["data"]["detailsProvinceList"];
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
        url: this.path + "verification/findHistoryVerificationListPage",
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
  .view_eve_table_div table thead{background:#00A1E9;color:#FFF;}
  .view_eve_table_div table td{text-align:center;vertical-align:middle;padding:3px 2px;}
  .view_eve_table_div table tbody td{font-size:12px;}
  .view_eve_table_div table td.tleft{text-align:left;padding-left:5px;}

  .xiaopen{display: inline-block;color: blue;margin-left: 20px;width: 20px;height: 20px;cursor: pointer;line-height: 20px;}
</style>

