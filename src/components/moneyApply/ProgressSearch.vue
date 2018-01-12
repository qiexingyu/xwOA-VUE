<template>
  <div class="hello">
      <div class="gonggao_bread">
        <a href="#/mainIndex/index" class="fa">首页</a>
        &gt;
        <span>费用申请</span>
        &gt;
        <span>申请进度查询</span>
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
            <li class="td10">申请日期</li>
            <li class="td14">费用申请类型</li>
            <li class="td12" style="margin-left:1%;">申请额度</li>
            <li class="td11">当前节点审批人</li>
            <li class="td16">最后审批时间</li>
            <li class="td12">申请状态</li>
            <li class="td14">操作</li>
          </ul>
        </div>
        <div class="data_table_body">
          <ul v-for="(l, i) in list" v-if="list.length>0">
            <li class="td7 xh">{{ i+1 }}</li>
            <li class="td10">{{ l.createTimeString }}</li>
            <li class="td14">
              {{ l.spendtimeString.substring(0,7) }}&nbsp;&nbsp;{{ (l.isStatus==1)?'额度调拨-'+costCategory[l.costCategory]:costCategory[l.costCategory] }}
            </li>
            <li class="td12" style="margin-left:1%;">{{ l.money.toFixed(2) }}</li>
            <li class="td11">{{ l.approver }}</li>
            <li class="td16">{{ l.handlerTimeString }}</li>
            <li class="td12">
              {{ showStatus[l.status] }}&nbsp;&nbsp;
              <a href="javascript:void(0);" v-if="l.status==2" v-on:click="showReason(l.reason)">原因</a>
            </li>
            <li class="td14">
              <a href="javascript:void(0);" class="table_pa" v-on:click="viewPop(l.costId, l.money, l.isStatus, l.costCategory)">查看详情</a>
              <a href="javascript:void(0);" class="table_la" v-if="l.status==2" v-on:click="updateApply(l.costId, l.isStatus, l.costCategory)">修改重提</a>
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
          <p>额度类型：{{ viewData.costCategory }}&nbsp;&nbsp;{{ viewData.costTypeExtra }}</p>
          <p>申请人：{{ viewData.areaValue }}-{{ viewData.userName }}</p>
        </div>
        <div class="view_eve_table_div">
          <table cellpadding="0" cellspacing="0" border="1">
            <thead>
              <tr>
                <td width="8%">省份</td>
                <td width="8%">课程类型</td>
                <td width="8%">科目</td>
                <td width="14%">学校</td>
                <td width="8%">客户</td>
                <td width="10%">额度</td>
                <td width="23%">额度用途</td>
                <td width="21%">目标</td>
              </tr>
            </thead>
            <tbody v-for="(v, k) in viewData.viewData">
              <tr v-for="(s, si) in v.costDetailVoList">
                <td>{{ s.provinceName }}</td>
                <td>N/A</td>
                <td>{{ v.costTypeExtra==1?v.costSubjectName:'N/A' }}</td>
                <td v-if="s.costDetailCustomerVos.length>0"><span v-for="(c, ci) in s.costDetailCustomerVos">{{ c.customerName }}<span v-if="ci<(s.costDetailCustomerVos.length-1)">、</span></span></td>
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

      <div class="bgpop" v-bind:class="{'check': viewData.shCheck3}" v-on:click="closeViewPop"></div>
      <div class="view_area" style="width:1024px;height:auto;max-height:400px;overflow-y:auto;"
       v-bind:class="{'check': viewData.shCheck3}" ref="viewK">
        <span class="closexx" style="margin-right:10px;" v-on:click="closeViewPop"><Icon type="android-cancel"></Icon></span>
        <div style="margin:20px;border:1px solid #DDD;padding:5px;">
          <p>费用时间：{{ viewData.spendtimeString }}</p>
          <p>额度类型：{{ viewData.costCategory }}</p>
          <p>申请人：{{ viewData.areaValue }}-{{ viewData.userName }}</p>
        </div>
        <div class="view_eve_table_div">
          <table cellpadding="0" cellspacing="0" border="1">
            <thead>
              <tr>
                <td width="8%">省份</td>
                <td width="10%">课程类型</td>
                <td width="8%">额度类别</td>
                <td width="14%">学校</td>
                <td width="9%">客户</td>
                <td width="9%">额度</td>
                <td width="23%">额度用途</td>
                <td width="21%">目标</td>
              </tr>
            </thead>
            <tbody v-for="v in viewData.viewData3">
              <tr v-for="(s, si) in v">
                <td v-bind:rowspan="v.length" v-if="si==0">{{ s.provinceName }}</td>
                <td v-bind:rowspan="v.length" v-if="si==0">{{ s.courseType?courseTypeObj[s.courseType]:'N/A' }}</td>
                <td>{{ s.costTypeName }}</td>
                <td v-if="s.costDetailCustomerVos>0"><span v-for="(c, ci) in s.costDetailCustomerVos">{{ c.customerName?c.customerName:'N/A' }}<span v-if="ci<(s.costDetailCustomerVos.length-1)">、</span></span></td>
                <td v-if="s.costDetailCustomerVos==0">N/A</td>
                <td v-if="s.costDetailCustomerVos>0">{{ s.costDetailCustomerVos[0]["contactsName"]?s.costDetailCustomerVos[0]["contactsName"]:'N/A' }}</td>
                <td v-if="s.costDetailCustomerVos==0">N/A</td>
                <td>{{ s.quota.toFixed(2) }}</td>
                <td class="tleft" v-if="v.isStatus==1">{{ s.quotaPurpose }}</td>
                <td class="tleft" v-if="v.isStatus==2&&v.costCategory!=2">{{ s.quotaPurpose }}</td>
                <td class="tleft" v-if="v.isStatus==2&&v.costCategory==2&&v.costTypeExtra==1">
                  材料费：{{ s.materialCost.toFixed(2) }} <br/>
                  <span>招生人数：{{ s.enrollment }}</span>
                  <br/>
                  用途：{{ s.quotaPurpose }}
                </td>
                <td class="tleft">{{ s.quotaPurpose }}</td>
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

      <oa-alert ref="childAlert"></oa-alert>
  </div>
</template>

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
        endDate: '',
        costCategory: [],
        costCategoryVal: 0
      },
      list: [],
      showStatus: {
        "1": "已提交",
        "2": "审批失败",
        "3": "审批成功",
        "4": "已修改重提"
      },
      costCategory: {
        "1": "个人统筹费用",
        "2": "Extra费用",
        "3": "区域费用",
        "4": "开课费用"
      },
      costTypeExtra: {
        "1": "常规课",
        "2": "合作课",
        "3": "直播课"
      },
      courseTypeObj: {
        "1": "常规课",
        "2": "合作课"
      },
      pageNum: 1,
      pageSize: 10,
      viewData: {
        shCheck: true,
        shCheck3: true,
        viewData: [],
        viewData3: [],
        money: 0,
        spendtimeString: '',
        costCategory: 0,
        areaValue: '',
        userName: localStorage.getItem("userName"),
        personProvince: '',
        costTypeExtra: ''
      }
    }
  },
  created: function () {
  	this.setInitSearchData();          //设置右上角申请类型
    this.getSelectFeeApplication();    //查询申请进度列表

    //修改个人额度
    $.ajax({
      url: this.path + "findUserActualUsableMoney",
      type: "post",
      dataType: "json",
      data: {
        "jobNumber": localStorage.getItem("jobNumber"),
        "sessionIdOa": localStorage.getItem("sessionIdOa")
      },
      success: function(edata){
        this.$parent.creditEduObj = edata["data"];
        localStorage.setItem("positionListTwo", JSON.stringify(edata["data"]));
      }.bind(this),
      error: function(){
        console.log("查询个人额度异常");
      }
    });
  },
  methods: {
    showReason: function(reason){
      this.$refs.childAlert.show(reason);
    },
    updateApply: function(id, isStatus, costCategory){        //修改重提跳转
      if(isStatus == 1){       //额度调拨
        this.$router.push('/mainIndex/moneyApply/QuotaApply?id='+id);
      }else{
        switch(costCategory)
        {
          case 1:
          this.$router.push('/mainIndex/moneyApply/PersonApply?id='+id);
          break;

          case 2:
          this.$router.push('/mainIndex/moneyApply/ExtraApply?id='+id);
          break;

          case 3:
          this.$router.push('/mainIndex/moneyApply/AreaApply?id='+id);
          break;

          case 4:
          this.$router.push('/mainIndex/moneyApply/StartCourseApply?id='+id);
          break;
        }
      }
    },
    viewPop: function(id, money, isStatus, costCategory){
      this.viewData.money = money;
      this.viewData.costCategory = (isStatus==1)?'额度调拨-'+this.costCategory[costCategory]:this.costCategory[costCategory];

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
          this.viewData.spendtimeString = data["data"][0]["spendtimeString"].substring(0, 7);
          this.viewData.areaValue = data["data"][0]["costDetailVoList"][0]["areaName"];
          if(data["data"][0]["costCategory"] == 2){   //extra
            this.viewData.costTypeExtra = this.costTypeExtra[data["data"][0]["costTypeExtra"]];
          }

          //Extra费用和其他展示不同
          if(costCategory == 2){
            this.viewData.viewData = data["data"];
            this.viewData.shCheck = false;
          }else{
            //this.viewData.viewData3 = data["data"];
            var d3 = data["data"][0]["costDetailVoList"], dl = d3.length;
            var no = {};
            for(var i=0;i<dl;i++){
              var nsign = d3[i]["sign"];
              if(!no[nsign]){
                no[nsign] = [];
              }
            }

            for(var j=0;j<dl;j++){
              var nsign = d3[j]["sign"];
              no[nsign].push(d3[j]);
            }

            this.viewData.viewData3 = no;
            this.viewData.shCheck3 = false;
          }
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
    closeViewPop: function(){
      this.viewData.shCheck = true;
      this.viewData.shCheck3 = true;
    },
    setInitSearchData: function(){
      //设置时间
      //this.searchData.startDate = this.OACommon.getOADate(new Date()).prevMonthToday;
      //this.searchData.endDate = this.OACommon.getOADate(new Date()).todayDate;
      //设置申请类型
      this.searchData.costCategory = [
        {"id": 0, "name": "--请选择--"},
        {"id": 1, "name": "个人统筹"},
        {"id": 2, "name": "Extra"},
        {"id": 3, "name": "区域费用"},
        {"id": 4, "name": "额度调拨"}
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
        url: this.path + "selectFeeApplication",
        type: "post",
        dataType: "json",
        data: {
          "jobNumber": localStorage.getItem("jobNumber"),
          "sessionIdOa": localStorage.getItem("sessionIdOa"),
          "startTime": this.searchData.startDate,
          "endTime": this.searchData.endDate,
          "costCategory": this.searchData.costCategoryVal,
          "pageNum": this.pageNum,
          "pageSize": this.pageSize,
          "status": 1        //1：申请进度查询  2：个人待办查询
        },
        success: function(data){
          this.list = data["data"]["list"];

          this.$refs.childPage.setArg(data["data"]["pages"], this.pageNum, this.pageSize, this.getSelectFeeApplication);
        }.bind(this),
        error: function(){
          console.log("获取申请进度列表异常");
        }
      });
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
  .view_eve_table_div table tbody td{font-size:12px;}
  .view_eve_table_div table td.tleft{text-align:left;padding-left:5px;}
</style>

