<template>
  <div class="hello">
    <div class="gonggao_bread">
        <a href="#/mainIndex/index" class="fa">首页</a>
        &gt;
        <span>排课管理</span>
        &gt;
        <span>课程安排查询</span>
      </div>
      <div class="search_div">
        <div class="yydo">
          <label>申请时间：</label>

          <el-date-picker
            v-model="searchData.startDate"
            type="date"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
            placeholder="选择日期">
          </el-date-picker>

          <span class="zhi">至</span>
          <el-date-picker
            v-model="searchData.endDate"
            type="date"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
            placeholder="选择日期">
          </el-date-picker>

          <label class="mlgb10" style="width:50px;margin-left:10px;">区域：</label>
          <select v-model="searchData.areaId" v-on:change="areaChange">
            <option v-for="a in searchData.area" v-bind:value="a.areaId">{{ a.areaName }}</option>
          </select>
          <label class="mlgb10" style="width:50px;margin-left:10px;">省份：</label>
          <select v-model="searchData.provinceId" v-on:change="provChange">
            <option v-for="p in searchData.province" v-bind:value="p.provinceId">{{ p.province }}</option>
          </select>
        </div>
        <div class="et">
          <label>申请人：</label>
          <select v-model="searchData.applyUserId">
            <option v-for="p in searchData.applyUser" v-bind:value="p.userId">{{ p.userName }}</option>
          </select>
          <label style="width:50px;margin-left:10px;">科目：</label>
          <select v-model="searchData.subjectId">
            <option v-for="s in searchData.subject" v-bind:value="s.subjectId">{{ s.subjectName }}</option>
          </select>
          <span class="btn-blue-s sear_btn" v-on:click="getList">查询</span>
          </div>
      </div>
      <div class="gonggao_body table_body">
        <div class="data_table_head">
          <ul>
            <li class="td7 xh">序号</li>
            <li class="td8">申请日期</li>
            <li class="td8">申请人</li>
            <li class="td9">上课时间</li>
            <li class="td8" style="margin-left:1%;">课程类型</li>
            <li class="td9">年级</li>
            <li class="td7">科目</li>
            <li class="td7">省份</li>
            <li class="td14">上课地点</li>
            <li class="td14">学校</li>
            <li class="td7">操作</li>
          </ul>
        </div>
        <div class="data_table_body">
          <ul v-for="(l, i) in list" v-if="list.length>0">
            <li class="td7 xh">{{ i+1 }}</li>
            <li class="td8">{{ l.createDate }}</li>
            <li class="td8">{{ l.userName }}</li>
            <li class="td9" v-bind:title="l.learnDate">{{ l.learnDate }}</li>
            <li class="td8" style="margin-left:1%;">{{ keTypeArr[l.courseTypeId] }}</li>
            <li class="td9">{{ l.grade }}</li>
            <li class="td7"><span v-for="(s, si) in l.subjectList">{{ s.subjectName }}<span v-if="si!=l.subjectList.length-1">,</span></span></li>
            <li class="td7">{{ l.provinceName }}</li>
            <li class="td14">{{ l.learnLocation }}</li>
            <li class="td14">{{ l.schoolName?l.schoolName:'无' }}</li>
            <li class="td7">
              <a href="javascript:void(0);" class="table_pa" v-on:click="viewPop(l.courseSchApplyId)">查看</a>
            </li>
          </ul>
          <ul v-if="list.length==0">
            <li style="width:100%;text-align:center;color:red;">暂无数据</li>
          </ul>
        </div>
      </div>

      <oa-page ref="childPage"></oa-page>

      <div class="bgpop" v-if="viewData.isShow" v-on:click="closePop"></div>
      <div class="kecha_pop" style="height:556px;" v-if="viewData.isShow">
        <span class="closexx" style="margin-right:10px;" v-on:click="closePop"><Icon type="android-cancel"></Icon></span>
        <table cellpadding="0" cellspacing="0" border="1">
          <tr>
            <td colspan="8" class="head">北京学为学校课程安排情况说明-{{ viewData.vdata.courseTypeId==1?'常规课':'合作课' }}</td>
          </tr>
          <tr class="x">
            <td class="b" width="10%">省份</td>
            <td width="15%">{{ viewData.vdata.provinceName }}</td>
            <td class="b" width="10%">学校</td>
            <td width="11%">{{ viewData.vdata.schoolName }}</td>
            <td class="b" width="10%">省份负责人</td>
            <td width="12%">{{ viewData.vdata.userName }}</td>
            <td class="b" width="10%">上课地点</td>
            <td width="22%">{{ viewData.vdata.learnLocation }}</td>
          </tr>
          <tr class="x">
            <td class="b">上课科目</td>
            <td><span v-for="(s, si) in viewData.vdata.subjectList">{{ s.subjectName }}<span v-if="si!=(viewData.vdata.subjectList.length-1)">,</span></span></td>
            <td class="b">年级</td>
            <td>{{ viewData.vdata.grade }}</td>
            <td class="b">具体接待人</td>
            <td>{{ viewData.vdata.receptionistName }}</td>
            <td class="b">接待人电话</td>
            <td>{{ viewData.vdata.receptionistPhone }}</td>
          </tr>
          <tr class="x">
            <td class="b">上课日期</td>
            <td>{{ viewData.vdata.learnDate }}</td>
            <td class="b">高考卷类型</td>
            <td>{{ viewData.vdata.examinationTypeName }}</td>
            <td class="b">教材版本</td>
            <td colspan="3">{{ viewData.vdata.textbookVersion }}</td>
            <!--<td class="b">每人/每天收费</td>
            <td>{{ viewData.vdata.oneDayMoney }}</td>-->
          </tr>
          <!--<tr class="x">
            <td class="b">回款日期</td>
            <td colspan="7">{{ viewData.vdata.returnedMoneyDate }}</td>
          </tr>-->
          <tr class="x">
            <td class="b">本次参培学生层次</td>
            <td colspan="7">{{ viewData.vdata.studentsLevel }}</td>
          </tr>
          <tr class="x">
            <td class="b">学校授课建议</td>
            <td colspan="7">{{ viewData.vdata.courseAdvise }}</td>
          </tr>
          <tr class="x">
            <td class="b">已学内容</td>
            <td colspan="7">{{ viewData.vdata.alreadyLearnContent }}</td>
          </tr>
          <tr class="x">
            <td class="b">合作经历</td>
            <td colspan="7">{{ viewData.vdata.cooperationExperience }}</td>
          </tr>
          <tr class="x">
            <td class="b">合作简介</td>
            <td colspan="7">{{ viewData.vdata.cooperationInfo }}</td>
          </tr>
          <tr class="x">
            <td class="b">备注</td>
            <td colspan="7">{{ viewData.vdata.remark }}</td>
          </tr>
          <tr class="x">
            <td colspan="8" align="right"><b>申请人：</b>&nbsp;&nbsp;{{ viewData.vdata.userName }}&nbsp;&nbsp;{{ viewData.vdata.createDate }}</td>
          </tr>
          <tr>
            <td colspan="8" align="center"><span class="btn-blue" v-on:click="closePop">关闭</span></td>
          </tr>
        </table>
      </div>
  </div>
</template>

<script>
import $ from 'jquery'
import oaPage from '@/components/commonVue/Page'

export default {
  name: 'teacher',
  components: {
      'oa-page': oaPage
    },
  data () {
    return {
      path: this.OACommon["publicDef"]["qpath"],
      searchData: {
        startDate: '',
        endDate: '',
        area: [],
        areaId: 0,
        province: [{"areaId": "", "province": "--请选择--", "provinceCode": "", "provinceId": 0}],
        provinceId: 0,
        subject: [],
        subjectId: 0,
        applyUser: [{"userId": 0, "userName": "--请选择--"}],
        applyUserId: 0
      },
      pageNum: 1,
      pageSize: 10,
      list: [],
      keTypeArr: {"1":"常规课", "2":"合作课"},
      viewData: {
        isShow: false,
        vdata: {}
      }
    }  
  },
  created: function () {
    this.setInitSearchData(); 
    this.getList();
  },
  methods: {
    closePop: function(){
      this.viewData.isShow = false;
    },
    viewPop: function(id){
      $.ajax({
        url: this.path + "findCourseScheduleApplyById",
        type: "post",
        dataType: "json",
        data: {
          "jobNumber": localStorage.getItem("jobNumber"),
          "sessionIdOa": localStorage.getItem("sessionIdOa"),
          "courseSchApplyId": id
        },
        success: function(data){
          this.viewData.vdata = data["data"];
          this.viewData.isShow = true;
        }.bind(this),
        error: function(){
          console.log("获取排课详情异常");
        }
      });
    },
    setInitSearchData: function(){
      //设置时间
      //this.searchData.startDate = this.OACommon.getOADate(new Date()).prevMonthToday;
      //this.searchData.endDate = this.OACommon.getOADate(new Date()).todayDate;
      this.searchData.area = this.OACommon.findAreaByCondition();
      this.searchData.subject = this.OACommon.findSubjectAll();
    },
    provChange: function(){
      if(this.searchData.provinceId){
        var userData = [{"userId": 0, "userName": "--请选择--"}];
        $.ajax({
          url: this.path + "findUserListByAreaOrProvince",
          type: "post",
          dataType: "json",
          data: {
            "jobNumber": localStorage.getItem("jobNumber"),
            "sessionIdOa": localStorage.getItem("sessionIdOa"),
            "areaId": this.searchData.areaId,
            "provinceId": this.searchData.provinceId
          },
          success: function(data){
            this.searchData.applyUser = userData.concat(data["data"]);
            this.searchData.applyUserId = 0;
          }.bind(this),
          error: function(){
            console.log("获取申请人员请求异常");
          }
        });
      }else{
        this.searchData.applyUser = [{"userId": 0, "userName": "--请选择--"}];
        this.searchData.applyUserId = 0;
      }
    },
    areaChange: function(){
      if(this.searchData.areaId){
        this.searchData.province = this.OACommon.findProvinceList(this.searchData.areaId);
      }else{
        this.searchData.province = [{"areaId": "", "province": "--请选择--", "provinceCode": "", "provinceId": 0}];
      }
      this.searchData.provinceId = 0;

      this.searchData.applyUser = [{"userId": 0, "userName": "--请选择--"}];
      this.searchData.applyUserId = 0;
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
        url: this.path + "findCourseScheduleApplyByListPage",
        type: "post",
        dataType: "json",
        data: {
          "jobNumber": localStorage.getItem("jobNumber"),
          "sessionIdOa": localStorage.getItem("sessionIdOa"),
          "startDate": this.searchData.startDate,
          "endDate": this.searchData.endDate,
          "areaId": this.searchData.areaId,
          "provinceId": this.searchData.provinceId,
          "subjectId": this.searchData.subjectId,
          "userId": this.searchData.applyUserId,
          "pageNum": this.pageNum,
          "pageSize": this.pageSize
        },
        success: function(data){
          this.list = data["data"]["list"];
          this.$refs.childPage.setArg(data["data"]["pages"], this.pageNum, this.pageSize, this.getList);
        }.bind(this),
        error: function(){
          console.log("获取申请列表异常");
        }
      });
    }
  }
}
</script>
<style>

</style>

