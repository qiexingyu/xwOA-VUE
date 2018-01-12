<template>
  <div class="hello">
      <div class="gonggao_bread">
        <a href="#/mainIndex/index" class="fa">首页</a>
        &gt;
        <span>费用核销</span>
        &gt;
        <span>选择核销条目</span>
      </div>
      <div class="gonggao_body table_body" style="padding-bottom:30px;">
        <div class="money_progress">
          <table cellpadding="0" cellspacing="0">
            <tr class="pro">
              <td align="left" class="big_cur">
                <i>1</i>
              </td>
              <td align="right">
                <i></i>
              </td>
              <td>&nbsp;</td>
              <td align="right">
                <i></i>
              </td>
              <td>&nbsp;</td>
              <td align="right">
                <i></i>
              </td>
            </tr>
            <tr class="pro_word">
              <td align="left" class="cur">选择核销条目</td>
              <td align="center" colspan="2">选择核销款项</td>
              <td align="center" colspan="2">填写核销具体款项</td>
              <td align="right">提交</td>
            </tr>
          </table>
        </div>
        <div style="width:100%;border-top:1px solid #CCC;"></div>
        <div class="search_div yydo" style="padding-top:0;margin-bottom:0;">
          <label style="margin-left:0;width:100px;">费用申请时间：</label>
          <el-date-picker
            v-model="searchData.searchDateVal"
            type="month"
            value-format="yyyy-MM"
            placeholder="选择月">
          </el-date-picker>
          <label style="width:100px;margin-left:20px;">费用申请类型：</label>
          <select v-model="searchData.costCategoryVal">
            <option v-for="c in searchData.costCategory" v-bind:value="c.id">{{ c.name }}</option>
          </select>
          <span class="btn-blue-s sear_btn" v-on:click="getList">查询</span>
        </div>
        <div class="gonggao_body table_body">
          <div class="data_table_head">
            <ul>
              <li class="td7 xh">序号</li>
              <li class="td19 tdml3">费用申请时间</li>
              <li class="td19">申请类型</li>
              <li class="td16">申请额度</li>
              <li class="td12">详情</li>
              <li class="td12">操作</li>
            </ul>
          </div>
          <div class="data_table_body">
            <ul v-if="list.length>=0" v-for="(l, i) in list">
              <li class="td7 xh">{{ i+1 }}</li>
              <li class="td19 tdml3">{{ l.createDate }}</li>
              <li class="td19">{{ costCategory[l.costCategory] }}</li>
              <li class="td16">{{ l.money.toFixed(2) }}</li>
              <li class="td12">
                <a href="javascript:void(0);" class="table_pa" v-on:click="viewPop(l.costId, l.money, l.costCategory)">详情</a>
              </li>
              <li class="td16">
                <a v-bind:href="'#/mainIndex/verfication/selectSunEntry?id='+l.costId" class="table_pa">核销</a>
              </li>
            </ul>
            <ul v-if="list.length==0">
              <li style="width:100%;text-align:center;color:red;">暂无数据</li>
            </ul>
          </div>
      </div>
    </div>

    <div class="bgpop" v-bind:class="{'check': viewData.shCheck}" v-on:click="closeViewPop"></div>
    <div class="view_area" style="width:1024px;height:auto;max-height:400px;overflow-y:auto;"
     v-bind:class="{'check': viewData.shCheck}" ref="viewK">
      <span class="closexx" style="margin-right:10px;" v-on:click="closeViewPop"><Icon type="android-cancel"></Icon></span>
      <div style="margin:20px;border:1px solid #DDD;padding:5px;">
        <p>费用时间：{{ viewData.spendtimeString }}</p>
        <p>额度类型：{{ viewData.costCategory }}</p>
        <p>申请人：{{ viewData.areaValue }}-{{ viewData.userName }}</p>
      </div>
      <div class="view_eve_table_div" v-for="(v, k) in viewData.viewData">
        <table cellpadding="0" cellspacing="0" border="1">
          <thead>
            <tr>
              <td width="8%">省份</td>
              <td width="8%">课程类型</td>
              <td width="8%">额度类别</td>
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
              <td>{{ (v.costCategory!=2)?s.costTypeName:'N/A' }}</td>
              <td><span v-for="(c, ci) in s.costDetailCustomerVos">{{ c.customerName?c.customerName:'N/A' }}<span v-if="ci<(s.costDetailCustomerVos.length-1)">、</span></span></td>
              <td>{{ s.costDetailCustomerVos[0]["contactsName"]?s.costDetailCustomerVos[0]["contactsName"]:'N/A' }}</td>
              <td>{{ s.quota.toFixed(2) }}</td>
              <td class="tleft" v-if="v.costCategory!=2">{{ s.quotaPurpose }}</td>
              <td class="tleft" v-if="v.costCategory==2&&v.costTypeExtra==1">
                材料费：{{ s.materialCost.toFixed(2) }} <br/>
                <span>招生人数：{{ s.enrollment }}</span>
                <br/>
                用途：{{ s.quotaPurpose }}
              </td>
              <td class="tleft" v-if="v.costCategory==2&&v.costTypeExtra!=1">
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
      <div style="margin:10px 20px;text-align:right;">总计：{{ viewData.money.toFixed(2) }}元</div>
      <div class="view_btn" style="margin-top:20px;margin-bottom:25px;">
        <span class="btn-blue-s" v-on:click="closeViewPop">关闭</span>
      </div>
    </div>

    <oa-page ref="childPage"></oa-page>
  </div>
</template>

<script>
import $ from 'jquery'
import oaPage from '@/components/commonVue/Page'

export default {
  name: 'selectEnrty',
  components: {
      'oa-page': oaPage
    },
  data () {
    return {
      path: this.OACommon["publicDef"]["qpath"],
      searchData: {
        searchDateVal: '',
        costCategory: [],
        costCategoryVal: 0
      },
      costCategory: {
        1: "个人统筹费用",
        2: "Extra费用",
        3: "区域费用",
        4: "开课费用"
      },
      courseTypeObj: {
        "1": "常规课",
        "2": "合作课"
      },
      pageNum: 1,
      pageSize: 10,
      list: [],
      viewData: {
        shCheck: true,
        money: 0,
        costCategory: '',
        viewData: {},
        spendtimeString: '',
        userName: localStorage.getItem("userName"),
        areaValue: '',
        personProvince: ''
      }
    }
  },
  created: function () {
    this.setInitSearchData();
    this.getList();
  },
  methods: {
    closeViewPop: function(){
      this.viewData.shCheck = true;
    },
    viewPop: function(id, money, costCategory){
      this.viewData.money = money;
      this.viewData.costCategory = this.costCategory[costCategory];

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
      var nowMonth = this.OACommon.getOADate(new Date()).todayDate;
      nowMonth = nowMonth.slice(0, -3);
      this.searchData.searchDateVal = nowMonth;
      //设置申请类型
      this.searchData.costCategory = [
        {"id": 0, "name": "--请选择--"},
        {"id": 1, "name": "个人统筹"},
        {"id": 2, "name": "Extra费用"},
        {"id": 3, "name": "区域费用"},
        {"id": 4, "name": "开课费用"}
      ];
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
        url: this.path + "verification/findVerificationCostPageList",
        type: "post",
        dataType: "json",
        data: {
          "jobNumber": localStorage.getItem("jobNumber"),
          "sessionIdOa": localStorage.getItem("sessionIdOa"),
          "costCategory": this.searchData.costCategoryVal,
          "createDate": this.searchData.searchDateVal,
          "pageNum": this.pageNum,
          "pageSize": this.pageSize
        },
        success: function(data){
          this.list = data["data"]["list"];

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
	table tr td{position:relative;}
  .el-date-editor.el-input, .el-date-editor.el-input__inner{width:170px;cursor:pointer;}
  .el-input__inner{height:30px;line-height:30px;cursor:pointer;border:1px solid #C9C9C9;}
  .el-input__icon{line-height:30px;}

  .view_eve_table_div{margin:10px 20px 0;}
  .view_eve_table_div table{width:100%;border-collapse:collapse;border:1px solid #d9d9d9;}
  .view_eve_table_div table td{text-align:center;vertical-align:middle;padding:3px 2px;}
  .view_eve_table_div table tbody td, .view_eve_table_div table tbody td span{font-size:12px;}
  .view_eve_table_div table td.tleft{text-align:left;padding-left:5px;}
</style>

