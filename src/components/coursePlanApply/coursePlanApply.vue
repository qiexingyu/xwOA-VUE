<template>
  <div class="hello">
    <div class="gonggao_bread">
        <a href="#/mainIndex/index" class="fa">首页</a>
        &gt;
        <span>课程安排管理</span>
        &gt;
        <span>课程排课申请</span>
      </div>
      <div class="gonggao_body">
        <div class="fbtong_div">
          <div class="form_eve">
            <label class="label_tit-2">区&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;域：</label>
            <select class="form_select-1" v-model="appData.areaId" v-on:change="areaChange">
              <option v-for="a in area" v-bind:value="a.areaId">{{ a.areaName }}</option>
            </select>
            <label class="label_tit-2">省&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;份：</label>
            <select class="form_select-1" v-model="appData.provinceId" v-on:change="provinceChange">
              <option v-for="p in province" v-bind:value="p.provinceId">{{ p.province }}</option>
            </select>
            <label class="label_tit-2" v-if="appData.keType==2">市/区：</label>
            <select class="form_select-1" v-model="appData.cityId" v-on:change="cityChange" v-if="appData.keType==2">
              <option v-for="c in city" v-bind:value="c.cityId">{{ c.cityName }}</option>
            </select>
          </div>
          <div class="form_eve">
            <label class="label_tit-2">课程类型：</label>
            <select class="form_select-1" v-model="appData.keType">
              <option v-for="k in keTypeArr" v-bind:value="k.id">{{ k.name }}</option>
            </select>
            <label class="label_tit-2">上课地点：</label>
            <input type="text" class="form_input-2" v-model="appData.keAddress" maxlength="100" placeholder="请输入上课地点">
          </div>
          <div class="form_eve" v-if="appData.keType==2">
            <label class="label_tit-2">学&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;校：</label>
            <select class="form_select-1" v-model="appData.schoolId" v-on:change="schoolChange">
              <option v-for="s in school" v-bind:value="s.customerId">{{ s.customerName }}</option>
            </select>
            <label class="label_tit-2">客户姓名：</label>
            <select class="form_select-1" v-model="appData.linkManId">
              <option v-for="l in linkMan" v-bind:value="l.customerContactsId">{{ l.contactsName }}</option>
            </select>
          </div>
          <div class="form_eve" style="overflow:visible;">
            <label class="label_tit-2">上课科目：</label>
            <div class="minput_div" v-on:mouseenter="showSubjectList" v-on:mouseleave="hideSubjectList">
              <span class="subject_xian_o" v-if="appData.subjectArr.length==0" style="color:#CCC;">请选择科目</span>
              <span class="subject_xian_o" v-if="appData.subjectArr.length>0">{{ appData.subjectArr.join(",") }}</span>
              <Icon type="arrow-down-b" style="float:right;margin-right:5px;margin-top:7px;"></Icon>
              <ul class="person_ul edu" v-if="subjectShow">
                <li v-for="(s, si) in subject">
                  <input type="checkbox" v-bind:value="s.subjectName" v-bind:id="'km'+si" v-model="appData.subjectArr"/>
                  <label v-bind:for="'km'+si">{{ s.subjectName }}</label>
                </li>
              </ul>
            </div>
            
            <label class="label_tit-2">年&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;级：</label>
            <select class="form_select-1" v-model="appData.gradeId">
              <option v-for="g in grade" v-bind:value="g">{{ g }}</option>
            </select>
          </div>
          <div class="form_eve" v-if="appData.keType==2">
            <label class="label_tit-2">具体接待人：</label>
            <input type="text" class="form_input-2" v-model="appData.jdr" placeholder="请输入接待人姓名">
            <label class="label_tit-2">接待人电话：</label>
            <input type="text" class="form_input-2" v-model="appData.jdrPhone" placeholder="请输入接待人电话">
          </div>
          <div class="form_eve" style="overflow:visible;">
            <label class="label_tit-2">上课日期：</label>
            <div class="minput_div" v-on:mouseenter="enterKePanel" v-on:mouseleave="leaveKePanel">
              <span class="subject_xian" v-if="appData.keDate.length==0" style="color:#CCC;">请选择上课日期</span>
              <span class="subject_xian" v-if="appData.keDate.length>=0" style="">{{ appData.keDate.join(",") }}</span>
              <Icon type="arrow-down-b" style="position:absolute;right:5px;top:7px;"></Icon>

              <div class="person_ul edu xy_date_panel" v-if="datePanel.panelPause" style="max-height:360px;">
                <div class="son_date_panel">
                  <ul style="width:33%;">
                    <select style="width:110px;margin-left:5px;" v-model="datePanel.yearVal" v-on:change="panelYearChange">
                      <option v-for="y in datePanel.yearArr" v-bind:value="y">{{ y }}</option>
                    </select>
                  </ul>
                  <ul style="width:33%;">
                    <select style="width:110px;margin-left:5px;" v-model="datePanel.monthVal" v-on:change="panelMonthChange">
                      <option v-for="m in datePanel.monthArr" v-bind:value="m.m">{{ m.mx }}</option>
                    </select>
                  </ul>
                  <ul style="width:34%;">
                    <li v-for="(d, di) in datePanel.daysArr">
                      <input type="checkbox" v-bind:value="d.d" v-bind:id="'day'+di" v-model="appData.keDate"/>
                      <label v-bind:for="'day'+di">{{ d.dr }}</label>
                    </li>
                  </ul>
                </div>
                <div class="panel_footer">
                  <div style="cursor:pointer;float:right;margin:5px 5px 0 0;width:10px;height:10px;" v-if="appData.keDate.length>0" v-on:click="showOkDate">
                    <Icon type="ios-color-wand-outline" title="整理一下" style="color:blue;"></Icon>
                  </div>
                  {{ appData.keDate.join(",") }}
                </div>
                <div class="panel_footer" style="min-height:0px;" v-if="datePanel.okPause">
                  <div class="okdate_list" v-for="o in datePanel.okDate">
                    <div class="l">{{ o["ny"] }}</div>
                    <div class="r"><span v-for="xo in o.nyr">{{ xo }}</span></div>
                  </div>
                </div>
              </div>
            </div>

            <label class="label_tit-2">主讲方向：</label>
            <select class="form_select-1" v-model="appData.zjfxId">
              <option v-for="z in zjfx" v-bind:value="z.id">{{ z.name }}</option>
            </select>
          </div>
          <div class="form_eve">
            <label class="label_tit-2">高考卷类型：</label>
            <select class="form_select-1" v-model="appData.gkjType">
              <option v-for="g in gkjTypeArr" v-bind:value="g.examinationTypeId">{{ g.examinationTypeName }}</option>
            </select>
            <label class="label_tit-2">教材版本：</label>
            <input type="text" class="form_input-2" v-model="appData.jcbb">
          </div>
          <!--<div class="form_eve">
            <label class="label_tit-2">每人/每天收费：</label>
            <input type="text" class="form_input-2" placeholder="可精确到2位小数点" v-model="appData.money" v-on:blur="moneyKey">
            <label class="label_tit-2">回款日期：</label>
            <input type="text" class="form_input-2" placeholder="如：预计课程结束后一周回款" v-model="appData.backDate">
          </div>-->
          <div class="form_eve">
            <label class="label_tit-2">行程建议：</label>
            <textarea class="form_input-5" maxlength="500" v-model="appData.xcjy" placeholder="最多输入500个字"></textarea>
          </div>
          <div class="form_eve">
            <label class="label_tit-2">本次参培学生层次：</label>
            <textarea class="form_input-5" maxlength="500" v-model="appData.bccpxscc" placeholder="最多输入500个字"></textarea>
          </div>
          <div class="form_eve">
            <label class="label_tit-2">学校授课建议：</label>
            <textarea class="form_input-5" maxlength="500" v-model="appData.xxskjy" placeholder="最多输入500个字"></textarea>
          </div>
          <div class="form_eve">
            <label class="label_tit-2">已学内容：</label>
            <textarea class="form_input-5" maxlength="500" v-model="appData.yxnr" placeholder="最多输入500个字"></textarea>
          </div>
          <div class="form_eve">
            <label class="label_tit-2">合作经历：</label>
            <textarea class="form_input-5" maxlength="500" v-model="appData.hzjl" placeholder="最多输入500个字"></textarea>
          </div>
          <div class="form_eve">
            <label class="label_tit-2">合作简介：</label>
            <textarea class="form_input-5" maxlength="500" v-model="appData.hzjj" placeholder="最多输入500个字"></textarea>
          </div>
          <div class="form_eve">
            <label class="label_tit-2">备&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;注：</label>
            <textarea class="form_input-5" maxlength="500" v-model="appData.remark" placeholder="最多输入500个字"></textarea>
          </div>
          <div class="errTip">{{ errTip }}</div>
          <div class="fbtong_btn_div">
            <span class="btn-blue" v-on:click="subApply">提交</span>
          </div>
        </div>
      </div>

      <oa-alert ref="childAlert"></oa-alert>
  </div>
</template>

<script>
import $ from 'jquery'
import oaAlert from '@/components/commonVue/Alert'

export default {
  name: 'coursePlanApply',
  components: {
      'oa-alert': oaAlert
    },
  data () {
    return {
      path: this.OACommon["publicDef"]["qpath"],
      area: [{"areaName": "--请选择--", "areaId": 0, "createTime": "", "updateTime": ""}],
      province: [{"areaId": "", "province": "--请选择--", "provinceCode": "", "provinceId": 0}],
      city: [{"cityCode": "", "cityId": 0, "cityName": "--请选择--", "provinceId": ""}],
      school: [{"customerId":0, "customerName":"--请选择--"}],
      linkMan: [{"customerContactsId": 0, "contactsName": "--请选择--"}],
      keTypeArr: [{"id":1, "name":"常规课"}, {"id":2, "name":"合作课"}],
      subject: [],
      subjectShow: false,
      grade: [],
      zjfx: [{"id":1,"name":"自主招生"},{"id":2,"name":"高考培优"},{"id":3,"name":"竞赛"}],              //主讲方向
      gkjTypeArr: [],                                                                                    //高考卷类型
      errTip: '',
      subPause: true,         //防止重复提交
      appData: {
        areaId: 0,
        provinceId: 0,
        cityId: 0,
        schoolId: 0,
        linkManId: 0,
        keType: '1',
        keAddress: '',
        subjectId: '',         //科目最终要上传的id
        subjectArr: [],         //科目要显示的内容
        gradeId: '2017级',
        jdr: '',
        jdrPhone: '',
        keDate: [],             //上课日期集合
        zjfxId: "1",            //主讲方向id
        gkjType: '',            //高考卷类型id
        jcbb: '',                //教材版本
        money: '',
        backDate: '',
        xcjy: '',
        bccpxscc: '',
        xxskjy: '',
        yxnr: '',
        hzjl: '',
        hzjj: '',
        remark: ''
      },
      datePanel: {            //多选日历组件
        yearVal: '',
        yearArr: [],
        monthVal: '',
        monthArr: [],
        daysArr: [],
        okDate: [],
        okPause: false,
        panelPause: false
      }
    }  
  },
  created: function () {
  	this.area = this.OACommon.findAreaByCondition();

    var _subject = this.OACommon.findSubjectAll();
    _subject.splice(0, 1);
    this.subject = _subject;

    this.grade = this.OACommon.findGradeList();
    this.gkjTypeArr = this.getFindExaminationTypeList();

    this.setDatePanel();
  },
  methods: {
    subApply: function(){
      if(!this.appData.areaId){
        this.errTip = "请选择区域";
        return false;
      }
      if(!this.appData.provinceId){
        this.errTip = "请选择省份";
        return false;
      }

      if(this.appData.keType == 2){
        if(!this.appData.cityId){
          this.errTip = "请选择市/区";
          return false;
        }
      }
      if(!this.appData.keAddress){
        this.errTip = "请输入上课地点";
        return false;
      }
      if(this.appData.subjectArr.length == 0){
        this.errTip = "请选择上课科目";
        return false;
      }
      if(this.appData.keType == 2){   //合作课要多验证4个
        if(!this.appData.schoolId){
          this.errTip = "请选择学校";
          return false;
        }
        if(!this.appData.linkManId){
          this.errTip = "请选择客户姓名";
          return false;
        }
        if(!this.appData.jdr){
          this.errTip = "请输入具体接待人";
          return false;
        }
        if(!this.appData.jdrPhone){
          this.errTip = "请输入具体接待人";
          return false;
        }
      }
      if(this.appData.keDate.length==0){
        this.errTip = "请选择上课日期";
        return false;
      }
      if(!this.appData.gkjType){
        this.errTip = "请选择高考卷类型";
        return false;
      }
      if(!this.appData.jcbb){
        this.errTip = "请输入教材版本";
        return false;
      }
      /*if(!this.appData.money){
        this.errTip = "请输入收费标准";
        return false;
      }
      if(!this.appData.backDate){
        this.errTip = "请输入回款日期";
        return false;
      }*/
      if(!this.appData.xcjy){
        this.errTip = "请输入行程建议";
        return false;
      }
      if(!this.appData.bccpxscc){
        this.errTip = "请输入本次参培学生层次";
        return false;
      }
      if(!this.appData.xxskjy){
        this.errTip = "请输入学校授课建议";
        return false;
      }
      if(!this.appData.yxnr){
        this.errTip = "请输入已学内容";
        return false;
      }
      if(!this.appData.hzjl){
        this.errTip = "请输入合作经历";
        return false;
      }
      if(!this.appData.hzjj){
        this.errTip = "请输入合作简介";
        return false;
      }

      //上课科目通过name值组合id值
      var subject = this.subject, hasSubject = this.appData.subjectArr;
      var subjectId = '';
      for(var i=0;i<subject.length;i++){
        for(var j=0;j<hasSubject.length;j++){
          if(subject[i]["subjectName"] == hasSubject[j]){
            subjectId += subject[i]["subjectId"] + ',';
          }
        }
      }
      this.appData.subjectId = subjectId.slice(0, -1);
      if(!this.subPause){
        return false;
      }
      this.subPause = false;

      var subData = {};
      if(this.appData.keType == 2){     //合作课多取4个值
        subData = {
          "jobNumber": localStorage.getItem("jobNumber"),
          "sessionIdOa": localStorage.getItem("sessionIdOa"),
          "areaId": this.appData.areaId,
          "provinceId": this.appData.provinceId,
          "courseTypeId": this.appData.keType,
          "learnLocation": this.appData.keAddress,
          "schoolId": this.appData.schoolId,
          "customerContactsId": this.appData.linkManId,
          "subjectIds": this.appData.subjectId,
          "grade": this.appData.gradeId,
          "receptionistName": this.appData.jdr,
          "receptionistPhone": this.appData.jdrPhone,
          "learnDate": this.appData.keDate.join(","),
          "learnDirection": this.appData.zjfxId,
          "gaokaoTypeId": this.appData.gkjType,
          "textbookVersion": this.appData.jcbb,
          //"oneDayMoney": this.appData.money,
          //"returnedMoneyDate": this.appData.backDate,
          "scheduling": this.appData.xcjy,
          "studentsLevel": this.appData.bccpxscc,
          "courseAdvise": this.appData.xxskjy,
          "alreadyLearnContent": this.appData.yxnr,
          "cooperationExperience": this.appData.hzjl,
          "cooperationInfo": this.appData.hzjj,
          "remark": this.appData.remark
        }
      }else{
        subData = {
          "jobNumber": localStorage.getItem("jobNumber"),
          "sessionIdOa": localStorage.getItem("sessionIdOa"),
          "areaId": this.appData.areaId,
          "provinceId": this.appData.provinceId,
          "courseTypeId": this.appData.keType,
          "learnLocation": this.appData.keAddress,
          "subjectIds": this.appData.subjectId,
          "grade": this.appData.gradeId,
          "learnDate": this.appData.keDate.join(","),
          "learnDirection": this.appData.zjfxId,
          "gaokaoTypeId": this.appData.gkjType,
          "textbookVersion": this.appData.jcbb,
          //"oneDayMoney": this.appData.money,
          //"returnedMoneyDate": this.appData.backDate,
          "scheduling": this.appData.xcjy,
          "studentsLevel": this.appData.bccpxscc,
          "courseAdvise": this.appData.xxskjy,
          "alreadyLearnContent": this.appData.yxnr,
          "cooperationExperience": this.appData.hzjl,
          "cooperationInfo": this.appData.hzjj,
          "remark": this.appData.remark
        }
      }
      $.ajax({
        url: this.path + "insertCourseScheduleApply",
        type: "post",
        dataType: "json",
        data: subData,
        success: function(data){
          if(data["code"] != 200){
            this.subPause = true;
            this.$refs.childAlert.show(data["msg"]);
          }else{
            this.$refs.childAlert.show("提交成功", function(){
              this.$router.push('/mainIndex/coursePlanApply/coursePlanSearch');
            });
          }
        }.bind(this),
        error: function(){
          this.subPause = true;
          console.log("提交排课申请异常");
        }
      });
    },
    enterKePanel: function(){
      this.datePanel.panelPause = true;
    },  
    leaveKePanel: function(){
      this.datePanel.panelPause = false;
    },
    showOkDate: function(){
      var luanDate = this.appData.keDate;
      var okDate = {}, lastOkDate = [];
      for(var i=0;i<luanDate.length;i++){
        var ym = luanDate[i].substring(0, 7);
        if(!okDate[ym]){
          okDate[ym] = [];
          okDate[ym].push(luanDate[i]);
        }else{
          okDate[ym].push(luanDate[i]);
        }
      }
      for(var o in okDate){
        lastOkDate.push({"ny": o, "nyr": okDate[o]});
      }
      this.datePanel.okDate = lastOkDate;

      this.datePanel.okPause = true;
      setTimeout(function(){
        this.datePanel.okPause = false;
      }.bind(this), 5000);
    },
    panelMonthChange: function(){
      var year = this.OACommon.getOADate(new Date()).year, yJia = year+1;
      var month = new Date().getMonth()+1;
      //日期赋值
      var yearNum = Number(this.datePanel.yearVal);
      var dayNum = {
        "1": 31,
        "2": (yearNum%4==0&&yearNum%100!=0||yearNum%400==0)?29:28,
        "3": 31,
        "4": 30,
        "5": 31,
        "6": 30,
        "7": 31,
        "8": 31,
        "9": 30,
        "10": 31,
        "11": 30,
        "12": 31
      };
      this.datePanel.daysArr = [];
      var monthVal = Number(this.datePanel.monthVal);          //当前选定月份值，而不是这个月的月份值
      var day = new Date().getDate();                          //今天几号
      if(Number(this.datePanel.yearVal) == year){              //如果是今年
        if(monthVal == month){                                 //如果是这个月
          for(var d=day;d<=dayNum[monthVal];d++){
            this.datePanel.daysArr.push({"d": year+"-"+(Number(this.datePanel.monthVal)>9?this.datePanel.monthVal:"0"+this.datePanel.monthVal)+"-"+((d>9)?d:"0"+d), "dr": d+"日"});
          }
        }else{
          for(var d=1;d<=dayNum[monthVal];d++){
            this.datePanel.daysArr.push({"d": year+"-"+(Number(this.datePanel.monthVal)>9?this.datePanel.monthVal:"0"+this.datePanel.monthVal)+"-"+((d>9)?d:"0"+d), "dr": d+"日"});
          }
        }
      }else{
        for(var d=1;d<=dayNum[monthVal];d++){
          this.datePanel.daysArr.push({"d": yJia+"-"+(Number(this.datePanel.monthVal)>9?this.datePanel.monthVal:"0"+this.datePanel.monthVal)+"-"+((d>9)?d:"0"+d), "dr": d+"日"});
        }
      }
    },
    panelYearChange: function(){
      var year = this.OACommon.getOADate(new Date()).year, yJia = year+1;
      var month = new Date().getMonth()+1;
      //月份赋值
      this.datePanel.monthVal = month;
      this.datePanel.monthArr = [];
      var tm = (Number(this.datePanel.yearVal) == year)?month: 1;
      for(var m=tm;m<=12;m++){
        this.datePanel.monthArr.push({"m": m, "mx": m+"月"});
      }
      //日期赋值
      var yearNum = Number(this.datePanel.yearVal);
      var dayNum = {
        "1": 31,
        "2": (yearNum%4==0&&yearNum%100!=0||yearNum%400==0)?29:28,
        "3": 31,
        "4": 30,
        "5": 31,
        "6": 30,
        "7": 31,
        "8": 31,
        "9": 30,
        "10": 31,
        "11": 30,
        "12": 31
      };
      this.datePanel.daysArr = [];
      var day = new Date().getDate();                          //今天几号
      if(Number(this.datePanel.yearVal) == year){              //如果是今年
        if(Number(this.datePanel.monthVal) == month){          //如果是这个月
          for(var d=day;d<=dayNum[month];d++){
            this.datePanel.daysArr.push({"d": year+"-"+(Number(this.datePanel.monthVal)>9?this.datePanel.monthVal:"0"+this.datePanel.monthVal)+"-"+((d>9)?d:"0"+d), "dr": d+"日"});
          }
        }else{
          for(var d=1;d<=dayNum[month];d++){
            this.datePanel.daysArr.push({"d": year+"-"+(Number(this.datePanel.monthVal)>9?this.datePanel.monthVal:"0"+this.datePanel.monthVal)+"-"+((d>9)?d:"0"+d), "dr": d+"日"});
          }
        }
      }else{
        for(var d=1;d<=dayNum[month];d++){
          this.datePanel.daysArr.push({"d": yJia+"-"+(Number(this.datePanel.monthVal)>9?this.datePanel.monthVal:"0"+this.datePanel.monthVal)+"-"+((d>9)?d:"0"+d), "dr": d+"日"});
        }
      }
    },
    setDatePanel: function(){
      var year = this.OACommon.getOADate(new Date()).year, yJia = year+1;
      var month = new Date().getMonth()+1;
      this.datePanel.yearVal = year;
      this.datePanel.monthVal = month;
      //年份赋值
      this.datePanel.yearArr = [year, yJia];
      //月份赋值
      this.datePanel.monthArr = [];
      var tm = (Number(this.datePanel.yearVal) == year)?month: 1;
      for(var m=tm;m<=12;m++){
        this.datePanel.monthArr.push({"m": m, "mx": m+"月"});
      }
      //日期赋值
      var yearNum = Number(this.datePanel.yearVal);
      var dayNum = {
        "1": 31,
        "2": (yearNum%4==0&&yearNum%100!=0||yearNum%400==0)?29:28,
        "3": 31,
        "4": 30,
        "5": 31,
        "6": 30,
        "7": 31,
        "8": 31,
        "9": 30,
        "10": 31,
        "11": 30,
        "12": 31
      };
      this.datePanel.daysArr = [];
      var day = new Date().getDate();                          //今天几号
      if(Number(this.datePanel.yearVal) == year){              //如果是今年
        if(Number(this.datePanel.monthVal) == month){          //如果是这个月
          for(var d=day;d<=dayNum[month];d++){
            this.datePanel.daysArr.push({"d": year+"-"+(Number(this.datePanel.monthVal)>9?this.datePanel.monthVal:"0"+this.datePanel.monthVal)+"-"+((d>9)?d:"0"+d), "dr": d+"日"});
          }
        }else{
          for(var d=1;d<=dayNum[month];d++){
            this.datePanel.daysArr.push({"d": year+"-"+(Number(this.datePanel.monthVal)>9?this.datePanel.monthVal:"0"+this.datePanel.monthVal)+"-"+((d>9)?d:"0"+d), "dr": d+"日"});
          }
        }
      }else{
        for(var d=1;d<=dayNum[month];d++){
          this.datePanel.daysArr.push({"d": yJia+"-"+(Number(this.datePanel.monthVal)>9?this.datePanel.monthVal:"0"+this.datePanel.monthVal)+"-"+((d>9)?d:"0"+d), "dr": d+"日"});
        }
      }
    },
    moneyKey: function(){
      var reg = /(^[0-9]*$)|(^[0-9]*[\.]{1}[0-9]{1,2}$)/;
      var edvalNum = 0;
      if(!reg.test(this.appData.money)){
        if(!isNaN(this.appData.money) && this.appData.money.indexOf(".")!=-1 && this.appData.money.split(".")[1].length>2){
          edvalNum = this.appData.money.split(".")[0] + "." + this.appData.money.split(".")[1].substring(0, 2);
          this.appData.money = Number(edvalNum).toFixed(2);
        }else{
          this.appData.money = "0.00";
        }
      }else{
        if(this.appData.money){
          this.appData.money = Number(this.appData.money).toFixed(2);
        }else{
          this.appData.money = "0.00";
        }
      }
    },
    getFindExaminationTypeList: function(){
      var gkjData = [{"examinationTypeId": "", "examinationTypeName": "--请选择--"}];
      $.ajax({
        url: this.path + "findExaminationTypeList",
        type: "post",
        dataType: "json",
        async: false,
        data: {
          "jobNumber": localStorage.getItem("jobNumber"),
          "sessionIdOa": localStorage.getItem("sessionIdOa")
        },
        success: function(data){
          gkjData = gkjData.concat(data["data"]);
        }.bind(this),
        error: function(){
          console.log("获取高考卷类型请求异常");
        }
      });
      return gkjData;
    },
    showSubjectList: function(){
      this.subjectShow = true;
    },
    hideSubjectList: function(){
      this.subjectShow = false;
    },
    areaChange: function(){
      this.province = [{"areaId": "", "province": "--请选择--", "provinceCode": "", "provinceId": 0}];
      this.city = [{"cityCode": "", "cityId": 0, "cityName": "--请选择--", "provinceId": ""}];
      this.school = [{"customerId":0, "customerName":"--请选择--"}];
      this.linkMan = [{"customerContactsId": 0, "contactsName": "--请选择--"}];
      this.appData.provinceId = 0;
      this.appData.cityId = 0;
      this.appData.schoolId = 0;
      this.appData.linkManId = 0;

      this.province = this.OACommon.findProvinceList(this.appData.areaId);
    },
    provinceChange: function(){
      this.city = [{"cityCode": "", "cityId": 0, "cityName": "--请选择--", "provinceId": ""}];
      this.school = [{"customerId":0, "customerName":"--请选择--"}];
      this.linkMan = [{"customerContactsId": 0, "contactsName": "--请选择--"}];
      this.appData.cityId = 0;
      this.appData.schoolId = 0;
      this.appData.linkManId = 0;

      this.city = this.OACommon.findCitiesList(this.appData.provinceId);
    },
    cityChange: function(){
      this.school = [{"customerId":0, "customerName":"--请选择--"}];
      this.linkMan = [{"customerContactsId": 0, "contactsName": "--请选择--"}];
      this.appData.schoolId = 0;
      this.appData.linkManId = 0;

      $.ajax({
        url: this.path + "findAllCustomerBycitiesId",
        type: "post",
        dataType: "json",
        data: {"citiesId": this.appData.cityId},
        success: function(data){
          data = data["data"];
          if(data.length != 0){
            this.school = this.school.concat(data);
          }
        }.bind(this),
        error: function(){
          console.log("获取学校请求异常");
        }
      });
    },
    schoolChange: function(){
      this.linkMan = [{"customerContactsId": 0, "contactsName": "--请选择--"}];
      this.appData.linkManId = 0;

      $.ajax({
        url: this.path + "findCustomerContactsAllByCustomerId",
        type: "post",
        dataType: "json",
        data: {"customerId": this.appData.schoolId},
        success: function(data){
          data = data["data"];
          if(data.length > 0){
            this.linkMan = this.linkMan.concat(data);
          }
        }.bind(this),
        error: function(){
          console.log("获取联系人异常");
        }
      });
    }
  }
}
</script>
<style>
	
</style>

