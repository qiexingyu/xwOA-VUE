<template>
  <div class="hello">
      <div class="gonggao_bread">
        <a href="#/mainIndex/index" class="fa">首页</a>
        &gt;
        <span>费用申请</span>
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

        <label>申请类型：</label>
        <select v-model="searchData.costCategoryVal">
          <option v-for="c in searchData.costCategory" v-bind:value="c.id">{{ c.name }}</option>
        </select>
        <span class="btn-blue-s sear_btn" v-on:click="getSelectFeeApplication">查询</span>
      </div>

      <div class="gonggao_body table_body">
        <div class="data_table_head">
          <ul>
            <li class="td7 xh">序号</li>
            <li class="td10">审核时间</li>
            <li class="td10">申请人</li>
            <li class="td14">所属区域</li>
            <li class="td19">花费形式</li>
            <li class="td16">额度</li>
            <li class="td10">详情</li>
            <li class="td14">状态</li>
          </ul>
        </div>
        <div class="data_table_body">
          <ul v-for="(l, i) in list" v-if="list.length>0">
            <li class="td7 xh">{{ i+1 }}</li>
            <li class="td10">{{ l.approvalTimeString }}</li>
            <li class="td10">{{ l.userName }}</li>
            <li class="td14">{{ l.areaName }}</li>
            <li class="td19">
              {{ l.spendtimeString.substring(0, 7) }}&nbsp;&nbsp;{{ (l.isStatus==1)?'额度调拨-'+costCategory[l.costCategory]:costCategory[l.costCategory] }}
            </li>
            <li class="td16">{{ l.money.toFixed(2) }}</li>
            <li class="td10">
              <a href="javascript:void(0);" class="table_pa" v-on:click="viewPop(l.costId, l.money, l.isStatus, l.costCategory, l.userName)">查看</a>
            </li>
            <li class="td14">
              <span class="table_pa" style="color:#333;" v-if="l.approvalStatus==1">审核通过</span>
              <span class="table_pa" style="color:#333;" v-if="l.approvalStatus==0">审核拒绝</span>
              <a href="javascript:void(0);" class="table_la" v-on:click="refuseApply(l.reason)" v-if="l.approvalStatus==0">查看原因</a>
            </li>
          </ul>
          <ul v-if="list.length==0">
            <li style="width:100%;text-align:center;color:red;">暂无数据</li>
          </ul>
        </div>
      </div>

      <oa-page ref="childPage"></oa-page>

      <div class="bgpop" v-bind:class="{'check': viewData.shCheck}" v-on:click="closeViewPop"></div>
      <div class="view_area" style="width:1024px;height:auto;max-height:400px;overflow-y:auto;"
       v-bind:class="{'check': viewData.shCheck}" ref="viewK">
        <span class="closexx" style="margin-right:10px;" v-on:click="closeViewPop"><Icon type="android-cancel"></Icon></span>
        <div style="margin:20px;border:1px solid #DDD;padding:5px;">
          <p>费用时间：{{ viewData.spendtimeString }}</p>
          <p>额度类型：{{ viewData.costCategory }}<span v-if="viewData.costTypeExtra">-</span>{{ viewData.costTypeExtra }}</p>
          <p>申请人：{{ viewData.areaValue }}-{{ viewData.userName }}</p>
        </div>
        <div class="view_eve_table_div" v-for="(v, k) in viewData.viewData">
          <table cellpadding="0" cellspacing="0" border="1">
            <thead>
              <tr>
                <td width="8%">省份</td>
                <td width="8%">课程类型</td>
                <td width="8%" v-if="v.costCategory!=2">额度类别</td>
                <td width="8%" v-if="v.costCategory==2">科目</td>
                <td width="14%">学校</td>
                <td width="8%">客户</td>
                <td width="10%">额度</td>
                <td width="23%">额度用途</td>
                <td width="21%">目标</td>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(s, si) in v.costDetailVoList">
                <td>{{ s.provinceName }}</td>
                <td>{{ s.courseType?courseTypeObj[s.courseType]:'N/A' }}</td>
                <td v-if="v.costCategory!=2">{{ (v.costCategory!=2)?s.costTypeName:'N/A' }}</td>
                <td v-if="v.costCategory==2">{{ v.costTypeExtra==1?v.costSubjectName:'N/A' }}</td>
                <td v-if="s.costDetailCustomerVos.length>0"><span v-for="(c, ci) in s.costDetailCustomerVos">{{ c.customerName?c.customerName:'N/A' }}<span v-if="ci<(s.costDetailCustomerVos.length-1)">、</span></span></td>
                <td v-if="s.costDetailCustomerVos.length==0">N/A</td>
                <td v-if="s.costDetailCustomerVos.length>0">{{ s.costDetailCustomerVos[0]["contactsName"]?s.costDetailCustomerVos[0]["contactsName"]:'N/A' }}</td>
                <td v-if="s.costDetailCustomerVos.length==0">N/A</td>
                <td>{{ s.quota.toFixed(2) }}</td>
                <td class="tleft" v-if="v.isStatus==1">{{ s.quotaPurpose }}</td>
                <td class="tleft" v-if="v.isStatus==2&&v.costCategory!=2">{{ s.quotaPurpose }}</td>
                <td class="tleft" v-if="v.isStatus==2&&v.costCategory==2&&v.costTypeExtra==1">
                  材料费：{{ s.materialCost.toFixed(2) }} <br/>
                  <span>招生人数：{{ s.enrollment }}</span>
                  <br/>
                  用途：{{ s.quotaPurpose }}
                </td>
                <td class="tleft" v-if="v.isStatus==2&&v.costCategory==2&&v.costTypeExtra!=1">
                  材料费：{{ s.materialCost.toFixed(2) }} <br/>
                  <span>天数：{{ s.days }}</span>
                  <br/>
                  用途：{{ s.quotaPurpose }}
                </td>
                <td class="tleft">{{ s.target }}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div style="margin:20px;text-align:right;">
          <p>总计：{{ viewData.money.toFixed(2) }}元</p>
          <p>大写：{{ OACommon.lower2UpperNum(viewData.money) }}</p>
        </div>
        <div class="view_btn" style="margin-top:20px;margin-bottom:25px;">
          <span class="btn-blue-s" v-on:click="closeViewPop">关闭</span>
        </div>
      </div>

      <div class="bgpop" v-if="refuse.ashow"></div>
      <div class="com_div" v-if="refuse.ashow">
        <div class="com_tit">拒绝原因<span class="com_close" v-on:click="refuseSure"></span></div>
        <div class="com_bg">
          <div class="com_content" style="height:68px;">{{ refuse.value }}</div>
          <div class="com_btn" style="margin-top:10px;">
            <span class="s" v-on:click="refuseSure">关闭</span>
          </div>
        </div>
      </div>

      <div class="bgpop" v-if="approveData.ashow" v-on:click="canelDB"></div>
      <div class="view_area" style="width:420px;height:466px;overflow-y:auto;"
        v-if="approveData.ashow">
        <span class="closexx" style="margin-right:10px;" v-on:click="canelDB"><Icon type="android-cancel"></Icon></span>
        <div style="font-size: 20px;font-weight: 700;text-align: center;margin-top: 10px">额度调拨审批</div>
        <div class="view_eve_table_div">
          <div class="gonggao_body table_body">
            <div class="data_table_head">
              <ul style="height:30px;">
                <li class="xh" style="width:20%;height:30px;line-height:30px;">操作</li>
                <li class="xh" style="width:40%;height:30px;line-height:30px;">被调拨人</li>
                <li class="xh" style="width:40%;height:30px;line-height:30px;">可用额度</li>
              </ul>
            </div>
            <div class="data_table_body">
              <ul v-for="u in approveData.appList" style="height:30px;line-height:30px;" v-bind:id="'u'+u.userId">
                <li class="xh" style="width:20%;height:30px;line-height:30px;">
                  <input type="radio" name="edr" style="width:14px;height:14px;vertical-align:middle;" v-bind:value="u.userId" v-model="approveData.appModel"/>
                </li>
                <li class="xh" style="width:40%;height:30px;line-height:30px;">{{ u.userName }}</li>
                <li class="xh" style="width:40%;height:30px;line-height:30px;" v-bind:num="u.money">{{ OACommon.formatCurrency(u.money) }}</li>
              </ul>
            </div>
          </div>

          <oa-page ref="childPageUser"></oa-page>
          <div style="margin:0 40px;">
            调拨额度：<input type="text" placeholder="请输入调拨额度" v-model="approveData.appMoney" v-on:keyup="moneyKey"/>
          </div>
        </div>
        <div style="height:20px;text-align:center;color:red;margin-top:5px;">{{ approveData.errorTip }}</div>
        <div class="view_btn" style="margin-top:10px;margin-bottom:25px;">
          <span class="btn-blue-s" v-on:click="go2DB">确定</span>
          <span class="btn-yellow-s" v-on:click="canelDB">取消</span>
        </div>
      </div>

      <oa-alert ref="childAlert"></oa-alert>
      <oa-confirm ref="childConfirm"></oa-confirm>
  </div>
</template>

<script>
import $ from 'jquery'
import oaPage from '@/components/commonVue/Page'
import oaAlert from '@/components/commonVue/Alert'
import oaConfirm from '@/components/commonVue/Confirm'

export default {
  name: 'ProgressSearch',
  components: {
      'oa-page': oaPage,
      'oa-alert': oaAlert,
      'oa-confirm': oaConfirm
    },
  data () {
    return {
      path: this.OACommon["publicDef"]["qpath"],
      searchData: {
        startDate: '',
        endDate: '',
        costCategory: [],
        costCategoryVal: ''
      },
      list: [],
      costCategory: {
        "1": "个人统筹费用",
        "2": "Extra费用",
        "3": "区域费用",
        "4": "开课费用"
      },
      costTypeExtra: {
        1: "常规课",
        2: "合作课",
        3: "直播课"
      },
      courseTypeObj: {
        "1": "常规课",
        "2": "合作课"
      },
      pageNum: 1,
      pageSize: 10,
      viewData: {
        shCheck: true,
        viewData: [],
        money: 0,
        spendtimeString: '',
        costCategory: '',
        areaValue: '',
        userName: '',
        personProvince: '',
        costTypeExtra: ''
      },
      costId: '',       //同意/拒绝申请的costId
      refuse: {
        ashow: false,
        value: '',
        tipText: ''
      },
      approveData: {
        ashow: false,
        pageNum: 1,
        pageSize: 6,
        appList: [],
        appModel: '',
        appMoney: '',
        errorTip: ''
      },
      subPause: true   //避免重复点击
    }
  },
  created: function () {
  	this.setInitSearchData();          //设置右上角申请类型
    this.getSelectFeeApplication();    //查询申请进度列表
  },
  methods: {
    canelDB: function(){
      this.approveData.ashow = false;
      this.approveData.appMoney = '';
      this.approveData.errorTip = '';
    },
    go2DB: function(){
      if(!this.approveData.appModel){
        this.approveData.errorTip = "请选择被调拨人";
        return false;
      }
      if(!this.approveData.appMoney){
        this.approveData.errorTip = "请输入调拨额度";
        return false;
      }
      var ed = $("#u" + this.approveData.appModel + ">li").eq(2).attr("num");
      ed = Number(ed);
      if(Number(this.approveData.appMoney) > ed){
        this.approveData.errorTip = "此人额度不足";
        return false;
      }
      this.approveData.errorTip = "";

      //避免重复提交
      if(!this.subPause){
        return false;
      }
      this.subPause = false;
      $.ajax({
        url: this.path + "handlerCostApply",
        type: "post",
        dataType: "json",
        data: {
          "jobNumber": localStorage.getItem("jobNumber"),
          "sessionIdOa": localStorage.getItem("sessionIdOa"),
          "costId": this.costId,
          "action": "1",
          "transferredPerson": this.approveData.appModel,
          "money": this.approveData.appMoney
        },
        success: function(data){
          if(data["code"] == 200){
            this.canelDB();
            this.getSelectFeeApplication();            
            this.$refs.childAlert.show("额度调拨成功");            
            this.subPause = true;
          }else{
            this.subPause = true;
            this.approveData.errorTip = data["msg"];
          }
        }.bind(this),
        error: function(){
          console.log("调拨额度请求异常");
        }
      });
    },
    moneyKey: function(){
      var num = Number(this.approveData.appMoney);
      if(this.approveData.appMoney){
        if(isNaN(num) || num<=0){
          this.approveData.appMoney = '';
        }
      }
    },
    closeRefuse: function(){
      this.refuse.ashow = false;
    },
    refuseSure: function(){
      this.refuse.ashow = false;
    },
    refuseApply: function(reason){
      this.refuse.value = reason;
      this.refuse.ashow = true;
    },
    agreeApply: function(costId, isStatus){
      this.costId = costId;
      //如果是额度调拨类的申请，如果当前是财务部的人员来审批
      if(isStatus == 1){
        $.ajax({
          url: this.path + "isFinance",
          type: "post",
          dataType: "json",
          data: {
            "jobNumber": localStorage.getItem("jobNumber"),
            "sessionIdOa": localStorage.getItem("sessionIdOa")
          },
          success: function(data){
            if(data["code"] == 200){   //是财务部的人
              this.approveData.ashow = true;
              this.getUsersByMoney();
            }else{
              this.costId = costId;
              this.$refs.childConfirm.show("确定要同意本条申请吗？", this.agreeFn);
            }
          }.bind(this),
          error: function(){
            console.log("判断是不是财务部人员异常");
          }
        });
      }else{
        this.$refs.childConfirm.show("确定要同意本条申请吗？", this.agreeFn);
      }
    },
    getUsersByMoney: function(pn, ps){
      //pn: 当前页数  ps：每页条数
      if(pn && typeof(pn)!='object'){
        this.approveData.pageNum = pn;
      }
      if(ps && typeof(ps)!='object'){
        this.approveData.pageSize = ps;
      }      
      $.ajax({
        url: this.path + "selectUserByMoney",
        type: "get",
        dataType: "json",
        data: {
          "pageNum": this.approveData.pageNum,
          "pageSize": this.approveData.pageSize
        },
        success: function(data){
          this.approveData.appList = data["data"]["list"];

          this.$refs.childPageUser.setArg(data["data"]["pages"], this.approveData.pageNum, this.approveData.pageSize, this.getUsersByMoney, "2");
        }.bind(this),
        error: function(){
          console.log("获取销售人员异常");
        }
      });
    },
    agreeFn: function(){
      $.ajax({
        url: this.path + "handlerCostApply",
        type: "post",
        dataType: "json",
        data: {
          "jobNumber": localStorage.getItem("jobNumber"),
          "sessionIdOa": localStorage.getItem("sessionIdOa"),
          "costId": this.costId,
          "action": "1"
        },
        success: function(data){
          if(data["code"] == 200){
            this.getSelectFeeApplication();
            this.$refs.childAlert.show("操作成功");
          }else{
            this.$refs.childAlert.show(data["msg"]);
          }
        }.bind(this),
        error: function(){
          console.log("同意申请请求异常");
        }
      });
    },
    viewPop: function(id, money, isStatus, costCategory, name){
      this.viewData.money = money;
      this.viewData.costCategory = (isStatus==1)?'额度调拨-'+(this.costCategory[costCategory]):this.costCategory[costCategory];
      this.viewData.userName = name;

      $.ajax({
        url: this.path + "selectFeeApplicationDetail",
        type: "post",
        dataType: "json",
        data: {
          "jobNumber": localStorage.getItem("jobNumber"),
          "sessionIdOa": localStorage.getItem("sessionIdOa"),
          "id": id
        },
        success: function(data){
          this.viewData.viewData = data["data"];
          this.viewData.spendtimeString = data["data"][0]["spendtimeString"].substring(0, 7);
          this.viewData.areaValue = data["data"][0]["costDetailVoList"][0]["areaName"];
          this.viewData.costTypeExtra = this.costTypeExtra[data["data"][0]["costTypeExtra"]];

          this.viewData.shCheck = false;
        }.bind(this),
        error: function(){
          console.log("获取详情信息异常");
        }
      });

      //个人省份获取
      $.ajax({
        url: this.path + "findUserProvinceList",
        type: "get",
        dataType: "json",
        async: false,
        data: {
          "jobNumber": localStorage.getItem("jobNumber"),
          "sessionIdOa": localStorage.getItem("sessionIdOa")          
        },
        success: function(data){
          this.viewData.personProvince = data["data"][0];
        }.bind(this),
        error: function(){
          console.log("获取个人所属省份异常");
        }
      });
    },
    setInitSearchData: function(){
      //设置时间
      //this.searchData.startDate = this.OACommon.getOADate(new Date()).prevMonthToday;
      //this.searchData.endDate = this.OACommon.getOADate(new Date()).todayDate;
      //设置申请类型
      this.searchData.costCategory = [
        {"id": "", "name": "--请选择--"},
        {"id": "1", "name": "个人统筹"},
        {"id": "2", "name": "Extra"},
        {"id": "3", "name": "区域费用"},
        {"id": "4", "name": "额度调拨"}
      ];
    },
    getSelectFeeApplication: function(pn, ps){
      //pn: 当前页数  ps：每页条数
      if(pn && typeof(pn)!='object'){
        this.pageNum = pn;
      }
      if(ps && typeof(ps)!='object'){
        this.pageSize = ps;
      }

      $.ajax({
        url: this.path + "selectCostHistorical",
        type: "post",
        dataType: "json",
        data: {
          "jobNumber": localStorage.getItem("jobNumber"),
          "sessionIdOa": localStorage.getItem("sessionIdOa"),
          "startTime": this.searchData.startDate,
          "endTime": this.searchData.endDate,
          "costCategory": this.searchData.costCategoryVal,
          "pageNum": this.pageNum,
          "pageSize": this.pageSize
        },
        success: function(data){
          this.list = data["data"]["list"];

          this.$refs.childPage.setArg(data["data"]["pages"], this.pageNum, this.pageSize, this.getSelectFeeApplication);
        }.bind(this),
        error: function(){
          console.log("获取个人代办列表异常");
        }
      });
    },
    closeViewPop: function(){
      this.viewData.shCheck = true;
    }
  }  
}
</script>
<style>
	table tr td{position:relative;}
  .person_ul{left:0;}
  .person_ul>li{color:#333;text-align:center;}
  .person_ul>li input[type=checkbox]{margin-left:-10px;}
  .person_ul>li label{margin-left:10px;}
  ul.edu{background:#DDD;}
  ul.edu{border:1px solid #BBB;}
  ul.edu>li{text-align:left;}
  ul.edu>li input[type=checkbox], ul.edu>li input[type=radio]{margin-left:25px;}
  ul.edu>li input[type=radio]{width:14px;height:14px;vertical-align:middle;}
  .xiaopen{width:20px;height:20px;cursor:pointer;position:absolute;right:0;bottom:0;color:blue;}
  textarea.tt{width:100%;height:70px;}
  .el-date-editor.el-input, .el-date-editor.el-input__inner{width:170px;cursor:pointer;}
  .el-input__inner{height:30px;line-height:30px;cursor:pointer;border:1px solid #C9C9C9;}
  .el-input__icon{line-height:30px;}

  .view_eve_table_div{margin:10px 20px 0;}
  .view_eve_table_div table{width:100%;border-collapse:collapse;border:1px solid #d9d9d9;}
  .view_eve_table_div table thead{background:#00A1E9;color:#FFF;}
  .view_eve_table_div table td{text-align:center;vertical-align:middle;padding:3px 2px;}
  .view_eve_table_div table tbody td, .view_eve_table_div table tbody td span{font-size:12px;}
  .view_eve_table_div table td.tleft{text-align:left;padding-left:5px;}

  .refuse_area{line-height:initial;width:230px;height:45px;margin-top:20px;}
  .refuse_text{color:red;font-size:12px;height:20px;text-align:center;}
</style>

