<template>
  <div class="hello">
    <div class="gonggao_bread">
        <a href="#/mainIndex/index" class="fa">首页</a>
        &gt;
        <span>排课管理</span>
        &gt;
        <span>排课查询</span>
      </div>
      <div class="search_div">
        <div class="yydo">
          <label>上课时间：</label>
          <el-date-picker
            v-model="searchData.keDate"
            type="date"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
            :picker-options="pickerOptions"
            placeholder="选择日期">
          </el-date-picker>
          <label style="width:50px;margin-left:10px;">区域：</label>
          <select v-model="searchData.areaId" v-on:change="areaChange">
            <option v-for="a in searchData.area" v-bind:value="a.areaId">{{ a.areaName }}</option>
          </select>
          <label style="width:50px;margin-left:10px;">省份：</label>
          <select v-model="searchData.provinceId" v-on:change="provinceChange">
            <option v-for="p in searchData.province" v-bind:value="p.provinceId">{{ p.province }}</option>
          </select>
          <label class="mlgb10" style="width:50px;margin-left:10px;">学校：</label>
          <div style="display:inline-block;position:relative;">
            <div style="border:1px solid #C9C9C9;border-radius:4px;height:30px;width:170px;padding-left:10px;line-height:30px;" v-bind:class="{'greytip': !searchData.schoolId}" v-on:mouseenter="showSchool">
              {{ searchData.schoolName }}
            </div>
            <ul class="person_ul edu" style="width:170px;top:30px;border:none;" v-if="searchData.schoolShow">
              <li style="text-align:center;">
                <select v-model="searchData.cityId" v-on:change="schoolChange">
                  <option v-for="c in searchData.city" v-bind:value="c.cityId">{{ c.cityName }}</option>
                </select>
              </li>
              <div v-on:mouseleave="hideSchool">
                <li style="text-align:center;" v-if="searchData.school.length>0" v-for="s in searchData.school" v-on:click="fuSchool(s.customerName, s.customerId)">{{ s.customerName }}</li>
              </div>
            </ul>
          </div>
        </div>
        <div class="et">
          <label>课程类型：</label>
          <select v-model="searchData.keTypeId">
            <option v-for="k in searchData.keType" v-bind:value="k.id">{{ k.name }}</option>
          </select>
          <label style="width:50px;margin-left:10px;">科目：</label>
          <select v-model="searchData.subjectId">
            <option v-for="s in searchData.subject" v-bind:value="s.subjectId">{{ s.subjectName }}</option>
          </select>
          <span class="btn-blue-s sear_btn" v-on:click="getList(0)">查询</span>
        </div>
      </div>
      <div class="gonggao_body table_body" style="margin-bottom:40px;">
        <div class="search_div" style="margin:0;">
          <span class="btn-blue-s" v-on:click="getList(-1)">上一周</span>
          <span class="btn-blue-s" v-on:click="getList(1)">下一周</span>
        </div>
        <div class="money_table" style="margin:0;padding:0;">
          <table cellpadding="0" cellspacing="0" border="1" class="pksq_table">
            <thead>
              <tr>
                <td width="8%">省份</td>
                <td width="8%">学校</td>
                <td class="pktd" v-for="(d, di) in headData" v-bind:width="(84/headData.length)+'%'">星期{{ weekDays[d.week] }}<br/>{{ d.learnDate }}</td>
              </tr>
            </thead>
            <tbody v-for="v1 in scheduData">
              <tr v-for="(v2, v2i) in v1.list">
                <td v-if="v2i==0" v-bind:rowspan="v1.length">{{ v1.name }}</td>
                <td>{{ v2.name }}</td>
                <td v-for="v3 in v2.list" v-bind:class="{'pktd': v3.length>0}">
                  <div v-if="v3.length>0" v-for="(v4, v4i) in v3" v-bind:class="{'bor_bot':(v3.length>1&&v4i!=v3.length-1), 'redc':v4.deleteFlag!=1}" v-on:click="showViewPop(v4.courseSchId)">
                    {{ v4.grade }}--{{ v4.courseTypeId==2?'合作课':'常规课' }}<br/>
                    {{ v4.subjectName }}&nbsp;&nbsp;{{ v4.teacherName }}&nbsp;&nbsp;{{ v4.courseHour }}小时
                  </div>
                </td>
              </tr>
            </tbody>
            <tbody v-if="headData.length==0">
              <tr>
                <td colspan="2" style="color:red;">暂无数据</td>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div class="bgpop" v-if="viewPop.isShow" v-on:click="closeView"></div>
      <div class="kecha_pop" style="height:425px;" v-if="viewPop.isShow">
        <span class="closexx" style="margin-right:10px;" v-on:click="closeView"><Icon type="android-cancel"></Icon></span>
        <table cellpadding="0" cellspacing="0" border="1">
          <tr>
            <td colspan="8" class="head">排课预览</td>
          </tr>
          <tr class="x">
            <td class="b" width="16%">省份</td>
            <td width="16%">{{ viewPop.vdata.data.provinceName }}</td>
            <td class="b" width="16%">上课日期</td>
            <td colspan="3">{{ viewPop.vdata.data.learnDate }}</td>
          </tr>
          <tr class="x">
            <td class="b" width="16%">年级</td>
            <td width="16%">{{ viewPop.vdata.data.grade }}</td>
            <td class="b" width="16%" v-if="viewPop.vdata.data.courseTypeId==2">学校</td>
            <td class="b" width="16%" v-if="viewPop.vdata.data.courseTypeId==1">上课地点</td>
            <td width="16%" v-if="viewPop.vdata.data.courseTypeId==2">{{ viewPop.vdata.data.schoolName }}</td>
            <td width="16%" v-if="viewPop.vdata.data.courseTypeId==1">{{ viewPop.vdata.data.learnLocation }}</td>
            <td class="b" width="16%">课目</td>
            <td width="17%">{{ viewPop.vdata.data.subjectName }}</td>
          </tr>
          <tr class="x">
            <td class="b">老师</td>
            <td>{{ viewPop.vdata.data.teacherName }}</td>
            <td class="b">小时</td>
            <td colspan="3">{{ viewPop.vdata.data.courseHour }}</td>
          </tr>
          <tr class="x">
            <td class="b">培训内容</td>
            <td colspan="7">{{ viewPop.vdata.data.contentRequired }}</td>
          </tr>
          <tr class="x">
            <td class="b">行程安排</td>
            <td colspan="7">{{ viewPop.vdata.data.schedulePlan }}</td>
          </tr>
          <tr class="x">
            <td class="b">反馈</td>
            <td colspan="7">{{ viewPop.vdata.data.feedbackContent }}</td>
          </tr>
          <tr class="x">
            <td class="b">修改记录</td>
            <td colspan="7">
              <div v-for="r in viewPop.vdata.data.courseScheduleHistoryList" v-if="viewPop.vdata.data.courseScheduleHistoryList.length>0">
                {{ r.editUserName }}&nbsp;&nbsp;{{ OACommon.getOADate(new Date(r.editDate)).todayDate }}&nbsp;&nbsp;修改
                <a href="javascript:void(0);" style="color:#00A1E9;" v-on:click="showOldUpdateData(r.courseSchEditId)">原记录查看</a>
              </div>
            </td>
          </tr>
          <tr>
            <td colspan="8" align="center">
              <span class="btn-blue" v-if="viewPop.vdata.dataTwo!=-1&&viewPop.vdata.data.deleteFlag!=-1&&viewPop.canDelete==true" v-on:click="deleteView">删除</span>
              <span class="btn-blue" v-if="viewPop.vdata.dataTwo!=-1&&viewPop.vdata.data.deleteFlag!=-1" v-on:click="showUpdateView">修改</span>
              <span class="btn-blue" v-on:click="closeView">关闭</span>
            </td>
          </tr>
        </table>
        <table cellpadding="0" cellspacing="0" border="1" v-if="oldData.isShow">
          <tr>
            <td colspan="8" class="head">历史记录</td>
          </tr>
          <tr class="x">
            <td class="b" width="16%">省份</td>
            <td width="16%">{{ oldData.udata.province }}</td>
            <td class="b" width="16%">上课日期</td>
            <td colspan="3">{{ oldData.udata.learnDate }}</td>
          </tr>
          <tr class="x">
            <td class="b" width="16%">年级</td>
            <td width="16%">{{ oldData.udata.grade }}</td>
            <td class="b" width="16%" v-if="oldData.udata.courseTypeId==2">学校</td>
            <td class="b" width="16%" v-if="oldData.udata.courseTypeId==1">上课地点</td>
            <td width="16%" v-if="oldData.udata.courseTypeId==2">{{ oldData.udata.customerName }}</td>
            <td width="16%" v-if="oldData.udata.courseTypeId==1">{{ oldData.udata.learnLocation }}</td>
            <td class="b" width="16%">课目</td>
            <td width="17%">{{ oldData.udata.subjectName }}</td>
          </tr>
          <tr class="x">
            <td class="b">老师</td>
            <td>{{ oldData.udata.teacherName }}</td>
            <td class="b">小时</td>
            <td colspan="3">{{ oldData.udata.courseHour }}小时</td>
          </tr>
          <tr class="x">
            <td class="b">培训内容</td>
            <td colspan="7">{{ oldData.udata.contentRequired }}</td>
          </tr>
          <tr class="x">
            <td class="b">行程安排</td>
            <td colspan="7">{{ oldData.udata.schedulePlan }}</td>
          </tr>
          <tr class="x">
            <td class="b">修改原因</td>
            <td colspan="7">{{ oldData.udata.editReason }}</td>
          </tr>
          <tr>
            <td colspan="8" align="center">
              <span class="btn-blue" v-on:click="closeOldUpdate">关闭</span>
            </td>
          </tr>
        </table>
      </div>

      <div class="bgpop" v-if="updateData.isShow" v-on:click="canelUpdate"></div>
      <div class="view_area" style="width:650px;height:420px;padding:5px 20px" v-if="updateData.isShow">
        <span class="closexx" style="margin-right:10px;position:absolute;right:0;" v-on:click="canelUpdate"><Icon type="android-cancel"></Icon></span>
        <div style="font-size: 20px;font-weight: 700;text-align: center;margin-top: 10px">排课修改</div>
        <div class="view_school" style="margin-top: 10px">
          <label style="display: inline-block;width:110px;text-align: right">省份：</label>
          <select v-model="updateData.provinceId" v-bind:disabled="viewPop.canxiuDown" v-on:change="provChange"> 
            <option v-for="p in updateData.provinceArr" v-bind:value="p.provinceId">{{ p.province }}</option>
          </select>
          <label style="display: inline-block;width: 70px;text-align: right;margin-left:40px;">课程类型：</label>
          <select v-model="updateData.keTypeId" v-bind:disabled="viewPop.canxiuDown">
            <option v-for="k in updateData.keType" v-bind:value="k.id">{{ k.name }}</option>
          </select>
        </div>
        <div class="view_school" style="margin-top:10px;" v-if="updateData.keTypeId==2">
          <label style="display: inline-block;width:110px;text-align: right">学校：</label>
          <div style="width:460px;display:inline-block;border:1px solid #C9C9C9;border-radius:4px;height:30px;padding:0 10px;position:relative;" v-on:click="showSchoolSelect">
            <span style="position:relative;top:3px;">{{ updateData.schoolName }}</span>
            <Icon type="arrow-down-b" style="float:right;position:relative;top:8px;"></Icon>
            <ul class="person_ul" v-if="updateData.isSchoolShow" style="border:1px solid #CCC;">
              <li style="text-align:center;">
                <select v-model="updateData.cityId" v-on:change="cityChange" style="width:100%;">
                  <option v-for="s in updateData.cityArr" v-bind:value="s.cityId">{{ s.cityName }}</option>
                </select>
              </li>
              <li v-for="s in updateData.schoolArr" v-on:click.stop="clickSchool(s.customerId, s.customerName)" style="padding-left:15px;">{{ s.customerName }}</li>
            </ul>
          </div>
        </div>
        <div class="view_school" style="margin-top: 10px" v-if="updateData.keTypeId==1">
          <label style="display: inline-block;width:110px;text-align: right">上课地点：</label>
          <input type="text" style="width:460px;" v-model="updateData.keAddress" v-bind:disabled="viewPop.canxiuDown"/>
        </div>
        <div class="view_school" style="margin-top: 10px">
          <label style="display: inline-block;width:110px;text-align: right">课目：</label>
          <select v-model="updateData.subjectId" v-bind:disabled="viewPop.canxiuDown" v-on:change="subjectChange">
            <option v-for="s in updateData.subject" v-bind:value="s.subjectId">{{ s.subjectName }}</option>
          </select>
          <label style="display: inline-block;width:70px;text-align: right;margin-left:40px;">年级：</label>
          <select v-model="updateData.gradeId" v-bind:disabled="viewPop.canxiuDown">
            <option v-for="g in updateData.grade" v-bind:value="g.gradeName">{{ g.gradeName }}</option>
          </select>
        </div>
        <div class="view_school yydo" style="margin-top: 10px">
          <label style="display: inline-block;width:110px;text-align: right">上课日期：</label>
          <el-date-picker
            v-if="viewPop.canXiuUp"
            v-model="updateData.keDate"
            type="date"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
            placeholder="选择日期">
          </el-date-picker>
          <input type="text" v-model="updateData.keDate" v-if="viewPop.canxiuDown" v-bind:disabled="viewPop.canxiuDown">
          <label style="display: inline-block;width: 70px;text-align: right;margin-left:40px;">老师：</label>
          <select v-model="updateData.teacherId" v-bind:disabled="viewPop.canxiuDown">
            <option v-for="t in updateData.teacherArr" v-bind:value="t.teacherId">{{ t.teacherName }}</option>
          </select>
        </div>
        <div class="view_school" style="margin-top: 10px">
          <label style="display: inline-block;width:110px;text-align: right">小时：</label>
          <select v-model="updateData.oneHour" v-bind:disabled="viewPop.canxiuDown">
            <option v-for="h in updateData.hour" v-bind:value="h">{{ h }}</option>
          </select>
        </div>
        <div class="view_school" style="margin-top: 10px">
          <label style="display: inline-block;width:110px;text-align: right;vertical-align:top;">培训内容要求：</label>
          <textarea style="width:460px;height:60px;" v-model="updateData.pxnryq" maxlength="500" v-bind:readonly="viewPop.canXiuUp" placeholder="最多输入500个字"></textarea>
        </div>
        <div class="view_school" style="margin-top: 10px">
          <label style="display: inline-block;width:110px;text-align: right;vertical-align:top;">行程安排：</label>
          <textarea style="width:460px;height:60px;" v-model="updateData.kcap" maxlength="500" v-bind:readonly="viewPop.canXiuUp" placeholder="最多输入500个字"></textarea>
        </div>
        <div class="view_school" style="margin-top: 10px">
          <label style="display: inline-block;width:110px;text-align: right;vertical-align:top;">修改原因：</label>
          <textarea style="width:460px;height:60px;" v-model="updateData.xgReason" maxlength="500" placeholder="最多输入500个字"></textarea>
        </div>
        <div style="height:20px;text-align:center;color:red;">{{ updateData.upErrTip }}</div>
        <div class="view_btn" style="margin:15px 0 15px;">
          <span class="btn-blue-s" v-on:click="updateScheduData">提交</span>
          <span class="btn-yellow-s" v-on:click="canelUpdate">取消</span>
        </div>
      </div>

      <oa-confirm ref="childConfirm"></oa-confirm>      
      <oa-alert ref="childAlert"></oa-alert>      
  </div>
</template>

<script>
import $ from 'jquery'
import oaConfirm from '@/components/commonVue/Confirm'
import oaAlert from '@/components/commonVue/Alert'

export default {
  name: 'yydoCourseSearch',
  components: {
      'oa-confirm': oaConfirm,
      'oa-alert': oaAlert
    },
  data () {
    return {
      path: this.OACommon["publicDef"]["qpath"],
      pickerOptions: {
        firstDayOfWeek: 1
      },
      searchData: {
        keDate: '',
        area: [],
        areaId: 0,
        province: [{"areaId": "", "province": "--请选择--", "provinceCode": "", "provinceId": 0}],
        provinceId: 0,
        city: [{"cityCode": "", "cityId": 0, "cityName": "--请选择--", "provinceId": ""}],
        cityId: 0,
        schoolName: '学校名称',
        schoolShow: false,
        school: [],
        schoolId: 0,
        subject: [],
        subjectId: 0,
        keType: [{"id": 0, "name": "--请选择--"},{"id": 1, "name": "常规课"},{"id": 2, "name": "合作课"}],
        keTypeId: 0
      },
      headData: [],         //顶部日期值
      weekDays: {"0":"一", "1":"二", "2":"三", "3":"四", "4":"五", "5":"六", "6":"日"},
      scheduData: [],
      viewPop: {
        isShow: false,
        vdata: {},
        courseSchId: '',    //单条数据的id
        canDelete: false,
        canXiuUp: false,
        canxiuDown: false
      },
      updateData: {
        isShow: false,
        provinceArr: [],
        provinceId: '',
        provinceName: '',
        keType: [{"id":1, "name":"常规课"}, {"id":2, "name":"合作课"}],
        keTypeId: '',
        cityArr: [{"cityCode": "", "cityId": 0, "cityName": "--请选择--", "provinceId": ""}],
        cityId: 0,
        cityName: '',
        schoolArr: [],
        schoolId: '',
        schoolName: '',
        keAddress: '',
        subject: [],
        subjectId: '',
        subjectName: '',
        grade: [],
        gradeId: '',
        keDate: '',
        teacherArr: [],
        teacherId: '',
        teacherName: '',
        hour: [1,2,3,4,5,6,7,8,9],
        oneHour: 1,
        pxnryq: '',
        kcap: '',
        xgReason: '',
        upErrTip: '',
        isSchoolShow: false
      },
      oldData: {
        isShow: false,
        udata: {}
      }
    }  
  },
  created: function () {
    this.initSearchData();
    this.getList(0);
  },
  methods: {
    showOldUpdateData: function(id){
      this.oldData.isShow = true;
      $.ajax({
        url: this.path + "findCourseScheduleHistoryById",
        type: "post",
        dataType: "json",
        data: {
          "jobNumber": localStorage.getItem("jobNumber"),
          "sessionIdOa": localStorage.getItem("sessionIdOa"),
          "courseSchEditId": id
        },
        success: function(data){
          this.oldData.udata = data["data"];
        }.bind(this),
        error: function(){
          console.log("查看修改记录异常");
        }
      });
    },
    closeOldUpdate: function(){
      this.oldData.isShow = false;
    },
    updateScheduData: function(){
      if(this.viewPop.canxiuDown){                                 //运营专员
        if(!this.updateData.pxnryq){
          this.updateData.upErrTip = "请输入培训内容要求";
          return false;
        }
        if(!this.updateData.kcap){
          this.updateData.upErrTip = "请输入课程安排内容";
          return false;
        }
      }else if(this.viewPop.canXiuUp){                              //运营领导
        if(this.updateData.keTypeId == 1){                          //常规课
          if(!this.updateData.keAddress){
            this.updateData.upErrTip = "请输入上课地点";
            return false;
          }
        }else{                                                      //合作课
          if(this.updateData.schoolId == "0"){
            this.updateData.upErrTip = "请选择学校";
            return false;
          }
        }
        if(!this.updateData.teacherId){
          this.updateData.upErrTip = "请选择老师";
          return false;
        }
      }

      if(!this.updateData.xgReason){
        this.updateData.upErrTip = "请输入修改原因";
        return false;
      }
      this.updateData.upErrTip = "";

      var subData = "{";
      subData += "\"courseSchId\":\""+ this.viewPop.courseSchId +"\",";
      subData += "\"courseTypeId\":\""+ this.updateData.keTypeId +"\",";
      if(this.viewPop.canxiuDown){                                     //运营专员
        subData += "\"contentRequired\":\""+ this.updateData.pxnryq +"\",";
        subData += "\"schedulePlan\":\""+ this.updateData.kcap +"\"";
      }else if(this.viewPop.canXiuUp){                                 //运营领导
        subData += "\"provinceId\":\""+ this.updateData.provinceId +"\",";
        if(this.updateData.keTypeId == 1){
          subData += "\"learnLocation\":\""+ this.updateData.keAddress +"\",";
        }else{
          subData += "\"schoolId\":\""+ this.updateData.schoolId +"\",";
        }
        subData += "\"subjectId\":\""+ this.updateData.subjectId +"\",";
        subData += "\"grade\":\""+ this.updateData.gradeId +"\",";
        subData += "\"learnDate\":\""+ this.updateData.keDate +"\",";
        subData += "\"teacherId\":\""+ this.updateData.teacherId +"\",";
        subData += "\"courseHour\":\""+ this.updateData.oneHour +"\"";
      }
      subData += "}";

      $.ajax({
        url: this.path + "updateCourseSchedule",
        type: "post",
        dataType: "json",
        data: {
          "jobNumber": localStorage.getItem("jobNumber"),
          "sessionIdOa": localStorage.getItem("sessionIdOa"),
          "courseScheduleString": subData,
          "editReason": this.updateData.xgReason
        },
        success: function(data){
          if(data["code"] == 200){
            this.updateData.isShow = false;        
            this.getList(0);            
            this.$refs.childAlert.show("修改成功");
            this.viewPop.courseSchId = "";

            //把弹框的值清空
            this.updateData.provinceId = 0;
            this.updateData.keTypeId = 0;
            this.updateData.cityId = 0;
            this.updateData.schoolId = 0;
            this.updateData.keAddress = "";
            this.updateData.subjectId = 0;
            this.updateData.gradeId = 0;
            this.updateData.teacherId = 0;
            this.updateData.pxnryq = "";
            this.updateData.kcap = "";
            this.updateData.xgReason = "";
          }else{
            this.updateData.upErrTip = data["msg"];
          }
        }.bind(this),
        error: function(){
          console.log("修改异常");
        }
      });
    },
    subjectChange: function(){
      $.ajax({
          url: this.path + "findTeacherListBySubjectId",
          type: "post",
          dataType: "json",
          data: {
            "jobNumber": localStorage.getItem("jobNumber"),
            "sessionIdOa": localStorage.getItem("sessionIdOa"),
            "subjectId": this.updateData["subjectId"]
          },
          success: function(data){
            var tea = [{"teacherId":0,"teacherName":"--请选择--"}];
            this.updateData.teacherArr = tea.concat(data["data"]);
            this.updateData.teacherId = 0;
          }.bind(this),
          error: function(){
            console.log("查询老师异常");
          }
        });
    },
    cityChange: function(){
      $.ajax({
        url: this.path + "findAllCustomerBycitiesId",
        type: "post",
        dataType: "json",
        data: {"citiesId": this.updateData.cityId},
        success: function(data){
          data = data["data"];
          this.updateData.schoolArr = [{"customerId":0, "customerName":"暂无学校"}];
          if(data.length != 0){
            var sch = [];
            this.updateData.schoolArr = sch.concat(data);
          }
          this.updateData.schoolId = 0;
        }.bind(this),
        error: function(){
          console.log("获取学校请求异常");
        }
      });
    },
    showSchoolSelect: function(){
      if(this.viewPop.canXiuUp){
        this.updateData.isSchoolShow = true;
      }
    },
    clickSchool: function(id, name){
      this.updateData.schoolId = id;
      this.updateData.schoolName = name;
      this.updateData.isSchoolShow = false;
    },
    provChange: function(){
      this.updateData.cityArr = this.OACommon.findCitiesList(this.updateData.provinceId);
      this.updateData.cityId = 0;
      this.updateData.schoolArr = [{"customerId":0, "customerName":"--请选择--"}];
      this.updateData.schoolId = 0;
    },
    canelUpdate: function(){
      this.updateData.isShow = false;
      this.showViewPop(this.viewPop.courseSchId);
    },
    showUpdateView: function(){
      this.viewPop.isShow = false;
      this.updateData.isShow = true;
      this.oldData.isShow = false;

      $.ajax({
        url: this.path + "findCourseScheduleById",
        type: "post",
        dataType: "json",
        async: false,
        data: {
          "jobNumber": localStorage.getItem("jobNumber"),
          "sessionIdOa": localStorage.getItem("sessionIdOa"),
          "courseSchId": this.viewPop.courseSchId
        },
        success: function(data){
          data = data["data"];
          this.updateData.provinceArr = data["provinceList"];
          this.updateData.provinceId = data["provinceId"];
          this.updateData.keTypeId = data["courseTypeId"];
          this.updateData.subject = data["subjectList"];
          this.updateData.subjectId = data["subjectId"];
          this.updateData.grade = data["gradeList"];
          this.updateData.gradeId = data["grade"];
          this.updateData.keDate = data["learnDate"];
          this.updateData.oneHour = data["courseHour"];
          this.updateData.teacherArr = data["teacherList"];
          this.updateData.teacherId = data["teacherId"];
          this.updateData.schoolArr = [{"customerId":data["schoolId"], "customerName":data["schoolName"]}];
          this.updateData.schoolId = data["schoolId"];
          this.updateData.schoolName = data["schoolName"];
          this.updateData.keAddress = data["learnLocation"];
          this.updateData.pxnryq = data["contentRequired"];
          this.updateData.kcap = data["schedulePlan"];
          this.updateData.xgReason = "";


          this.updateData.cityArr = this.OACommon.findCitiesList(data["provinceId"]);
        }.bind(this),
        error: function(){
          console.log("获取update详情异常");
        }
      });
    },
    deleteView: function(){
      this.$refs.childConfirm.show("您确定要删除吗？", function(){
        $.ajax({
          url: this.path + "deleteCourseScheduleById",
          type: "post",
          dataType: "json",
          data: {
            "jobNumber": localStorage.getItem("jobNumber"),
            "sessionIdOa": localStorage.getItem("sessionIdOa"),
            "courseSchId": this.viewPop.courseSchId
          },
          success: function(data){
            this.closeView();
            this.oldData.isShow = false;

            if(data["code"] == 200){
              this.$refs.childAlert.show("删除成功");
              this.getList(0);
            }else{
              this.$refs.childAlert.show(data["msg"]);
            }
          }.bind(this),
          error: function(){
            console.log("删除课程异常");
          }
        });
      }.bind(this));
    },
    closeView: function(){
      this.viewPop.isShow = false;
      this.viewPop.courseSchId = "";
      this.oldData.isShow = false;
    },
    showViewPop: function(id){
      this.viewPop.isShow = true;
      this.viewPop.courseSchId = id;
      $.ajax({
        url: this.path + "findCourseScheduleAndHistoryById",
        type: "post",
        dataType: "json",
        async: false,
        data: {
          "jobNumber": localStorage.getItem("jobNumber"),
          "sessionIdOa": localStorage.getItem("sessionIdOa"),
          "courseSchId": id
        },
        success: function(data){
          this.viewPop.vdata = data;

        }.bind(this),
        error: function(){
          console.log("获取详情异常");
        }
      });
    },
    getList: function(nestOrLastFlag){
      $.ajax({
        url: this.path + "findCourseScheduleByWeekListPage",
        type: "post",
        dataType: "json",
        data: {
          "jobNumber": localStorage.getItem("jobNumber"),
          "sessionIdOa": localStorage.getItem("sessionIdOa"),
          "learnDate": this.searchData.keDate,
          "areaId": this.searchData.areaId,
          "provinceId": this.searchData.provinceId,
          "schoolId": this.searchData.schoolId,
          "courseTypeId": this.searchData.keTypeId,
          "subjectId": this.searchData.subjectId,
          "nestOrLastFlag": nestOrLastFlag
        },
        success: function(data){
          this.headData = data["data"];
          this.scheduData = data["dataTwo"];

          var newDate = 0, oldDate = this.searchData.keDate;
          if(nestOrLastFlag == 1){  //下一周
            newDate = (new Date(oldDate)).getTime() + 1000*60*60*24*7;
            this.searchData.keDate = this.OACommon.getOADate(new Date(newDate)).todayDate;
          }else if(nestOrLastFlag == -1){
            newDate = (new Date(oldDate)).getTime() - 1000*60*60*24*7;
            this.searchData.keDate = this.OACommon.getOADate(new Date(newDate)).todayDate;
          }
        }.bind(this),
        error: function(){
          console.log("获取排课列表异常");
        }
      });
    },
    initSearchData: function(){
      this.searchData.keDate = this.OACommon.getOADate(new Date()).todayDate;
      this.searchData.area = this.OACommon.findAreaByCondition();
      this.searchData.subject = this.OACommon.findSubjectAll();

      //用户权限
      var buttonPermissionList = localStorage.getItem("buttonPermissionList");
      this.viewPop.buttonPerm = JSON.parse(localStorage.getItem("buttonPermissionList"));
      for(var i=0;i<this.viewPop.buttonPerm.length;i++){
        if(this.viewPop.buttonPerm[i]["permissionCode"] == "coursePlanManage-list-delete"){
          this.viewPop.canDelete = true;
        }
        if(this.viewPop.buttonPerm[i]["permissionCode"] == "coursePlanManage-list-updateup"){
          this.viewPop.canXiuUp = true;
        }
        if(this.viewPop.buttonPerm[i]["permissionCode"] == "coursePlanManage-list-updatexia"){
          this.viewPop.canxiuDown = true;
        }
      }
    },
    areaChange: function(){
      if(this.searchData.areaId){
        this.searchData.province = this.OACommon.findProvinceList(this.searchData.areaId);
        this.searchData.provinceId = 0;
        this.searchData.city = [{"cityCode": "", "cityId": 0, "cityName": "--请选择--", "provinceId": ""}];
        this.searchData.cityId = 0;
      }else{
        this.searchData.province = [{"areaId": "", "province": "--请选择--", "provinceCode": "", "provinceId": 0}];
        this.searchData.provinceId = 0;
        this.searchData.city = [{"cityCode": "", "cityId": 0, "cityName": "--请选择--", "provinceId": ""}];
        this.searchData.cityId = 0;
      }
    },
    provinceChange: function(){
      if(this.searchData.provinceId){
        this.searchData.city = this.OACommon.findCitiesList(this.searchData.provinceId);
        this.searchData.cityId = 0;
      }else{
        this.searchData.city = [{"cityCode": "", "cityId": 0, "cityName": "--请选择--", "provinceId": ""}];
        this.searchData.cityId = 0;
      }
    },
    showSchool: function(){
      if(this.searchData.provinceId){
        this.searchData.schoolShow = true;
      }
    },
    hideSchool: function(){
      this.searchData.schoolShow = false;
    },
    schoolChange: function(){
      var school = this.OACommon.findAllCustomerBycitiesId(this.searchData.cityId);
      school.splice(0, 1);
      this.searchData.school = school;
    },
    fuSchool: function(name ,id){
      if(id){
        this.searchData.schoolName = name;
        this.searchData.schoolId = id;
      }
      this.searchData.schoolShow = false;
    }
  }
}
</script>
<style>

  
</style>

