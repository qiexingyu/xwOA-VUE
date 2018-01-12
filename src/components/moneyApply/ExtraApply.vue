<template>
  <div class="hello">
      <div class="gonggao_bread">
        <a href="#/mainIndex/index" class="fa">首页</a>
        &gt;
        <span>费用申请</span>
        &gt;
        <span>Extra费用申请</span>
      </div>
      <div class="gonggao_body">
        <div class="fbtong_div" style="padding-bottom:15px;">
          <div class="form_eve">
            <label class="label_tit-1">选择日期：</label>
            <el-date-picker
              v-model="applyDate"
              type="month"
              value-format="yyyy-MM"
              placeholder="选择月">
            </el-date-picker>
          </div>
          <div class="form_eve">
            <label class="label_tit-1">课程类型：</label>
            <select class="form_select-1" v-model="keType.keTypeVal" v-on:change="keTypeChange">
              <option v-for="k in keType.keTypeArr" v-bind:value="k.id">{{ k.type }}</option>
            </select>
            <label class="label_tit-1" v-if="keType.keTypeVal==1">科&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;目：</label>
            <select class="form_select-1" v-if="keType.keTypeVal==1" v-model="keType.subjectVal">
              <option v-for="s in keType.subject" v-bind:value="s.id">{{ s.name }}</option>
            </select>
          </div>
          <div style="padding-left:10%;margin-top:10px;font-size:12px;color:red;">
            <Icon type="information-circled" style="margin-right:5px;"></Icon>课程类型选择后将不能修改，若需要修改请刷新页面
          </div>
        </div>


        <div class="fbtong_div new_eve_mk" v-for="(eve, k) in type1" v-if="keType.keTypeVal==1">
          <div class="form_eve">
            <label class="label_tit-1">选择区域：</label>
            <select class="form_select-1" v-model="eve.areaVal" v-on:change="typeAreaChange(k)">
              <option v-for="a in eve.areaArr" v-bind:value="a.areaId">{{ a.areaName }}</option>
            </select>
            <label class="label_tit-1">省&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;份：</label>
            <select class="form_select-1" v-model="eve.provinceVal" v-on:change="typeProChange(k)">
              <option v-for="p in eve.provinceArr" v-bind:value="p.provinceId">{{ p.province }}</option>
            </select>
          </div>
          <div class="form_eve">
            <label class="label_tit-1">市/区：</label>
            <select class="form_select-1" v-model="eve.cityVal" v-on:change="typeCityChange(k)">
              <option v-for="c in eve.cityArr" v-bind:value="c.cityId">{{ c.cityName }}</option>
            </select>
            <label class="label_tit-1">学&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;校：</label>
            <select class="form_select-1" v-model="eve.schoolVal">
              <option v-for="h in eve.schoolArr" v-bind:value="h.customerId">{{ h.customerName }}</option>
            </select>
          </div>
          <div class="form_eve">
            <label class="label_tit-1">交费标准：</label>
            <div style="width:18%;position:relative;">
              <input type="text" class="form_input-2" style="width:100%;" v-model="eve.jfbz" v-on:blur="numKey1(k, 'b')">
              <span class="lei_icon">元/天</span>
            </div>
           
            <label class="label_tit-1">材&nbsp;&nbsp;料&nbsp;&nbsp;费：</label>
            <div style="width:18%;position:relative;">
              <input type="text" class="form_input-2" style="width:100%;" v-model="eve.clf" v-on:blur="numKey1(k, 'c')">
              <span class="lei_icon">元/人</span>
            </div>

          </div>
          <div class="form_eve">
            
            <label class="label_tit-1">招生人数：</label>
            <input type="text" class="form_input-2" v-model="eve.zsNubs" v-on:blur="numKey2(k)">
            <span class="area_after_word">材料费共计：{{ eve.sumClf }}元</span>
          </div>
          <div class="form_eve">
            <label class="label_tit-1">额度用途：</label>
            <textarea class="form_input-4" v-model="eve.eduyt" maxlength="500" placeholder="最多输入500个字"></textarea>
          </div>
          <div class="form_eve">
            <label class="label_tit-1">目&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;标：</label>
            <textarea class="form_input-4" v-model="eve.target" maxlength="500" placeholder="最多输入500个字"></textarea>
            <span class="btn-blue-s add_opition_btn" v-on:click="addNewModel" v-if="k==(type1.length-1)">新增</span>
            <span class="btn-yellow-s add_opition_btn" v-if="k!=0" v-on:click="removeModel(k)">删除</span>
          </div>
        </div>


        <div class="fbtong_div new_eve_mk" v-for="(eve, k) in type1" v-if="(keType.keTypeVal==2)||(keType.keTypeVal==3)">
          <div class="form_eve">
            <label class="label_tit-1">选择区域：</label>
            <select class="form_select-1" v-model="eve.areaVal" v-on:change="typeAreaChange(k)">
              <option v-for="a in eve.areaArr" v-bind:value="a.areaId">{{ a.areaName }}</option>
            </select>
            <label class="label_tit-1">省&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;份：</label>
            <select class="form_select-1" v-model="eve.provinceVal" v-on:change="typeProChange(k)">
              <option v-for="p in eve.provinceArr" v-bind:value="p.provinceId">{{ p.province }}</option>
            </select>
          </div>
          <div class="form_eve">
            <label class="label_tit-1">市/区：</label>
            <select class="form_select-1" v-model="eve.cityVal" v-on:change="typeCityChange(k)">
              <option v-for="c in eve.cityArr" v-bind:value="c.cityId">{{ c.cityName }}</option>
            </select>
            <label class="label_tit-1">学&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;校：</label>
            <select class="form_select-1" v-model="eve.schoolVal" v-on:change="typeSchoolChange(k)">
              <option v-for="h in eve.schoolArr" v-bind:value="h.customerId">{{ h.customerName }}</option>
            </select>
          </div>
          <div class="form_eve">
            <label class="label_tit-1">客&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;户：</label>
            <select class="form_select-1" v-model="eve.linkManVal">
              <option v-for="l in eve.linkManList" v-bind:value="l.customerContactsId">{{ l.contactsName }}</option>
            </select>
            <label class="label_tit-1">交费标准：</label>
            <div style="width:18%;position:relative;">
              <input type="text" class="form_input-2" style="width:100%;" v-model="eve.jfbz" v-on:blur="numKey1(k, 'b')">
              <span class="lei_icon">元/天</span>
            </div>
          </div>
          <div class="form_eve">
            <label class="label_tit-1">材&nbsp;&nbsp;料&nbsp;&nbsp;费：</label>
            <div style="width:18%;position:relative;">
              <input type="text" class="form_input-2" style="width:100%;" v-model="eve.clf" v-on:blur="numKey1(k, 'c')">
              <span class="lei_icon">元/天</span>  
            </div>
            <label class="label_tit-1">天&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;数：</label>
           
            <input class="form_select-1" v-on:blur="daysChange(k, 'c')" v-on:keyup="inputKey(k)" placeholder="天数" type="text" v-model="eve.days" style="width:18%;" /> 

            <span class="area_after_word">材料费共计：{{ eve.sumClf }}元</span>
          </div>
          <div class="form_eve">
            <label class="label_tit-1">额度用途：</label>
            <textarea class="form_input-4" v-model="eve.eduyt" maxlength="500" placeholder="最多输入500个字"></textarea>
          </div>
          <div class="form_eve">
            <label class="label_tit-1">目&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;标：</label>
            <textarea class="form_input-4" v-model="eve.target" maxlength="500" placeholder="最多输入500个字"></textarea>
            <span class="btn-blue-s add_opition_btn" v-on:click="addNewModel" v-if="k==(type1.length-1)">新增</span>
            <span class="btn-yellow-s add_opition_btn" v-if="k!=0" v-on:click="removeModel(k)">删除</span>
          </div>
        </div>

        <div style="padding-left:10%;font-size:16px;margin:0 20px;" v-if="keType.keTypeVal!=''">总计：{{ allSumMoney.toFixed(2) }}元</div>
        <div class="fbtong_btn_div" style="padding-bottom:30px;" v-if="keType.keTypeVal!=''">
          <span class="btn-green" v-on:click="viewPop">预览</span>
          <span class="btn-blue" v-on:click="subExtraApply">提交</span>
        </div>
      </div>


      <div class="bgpop" v-bind:class="{'check': viewData.shCheck}" v-on:click="closeViewPop"></div>
      <div class="view_area" style="width:1024px;height:auto;max-height:400px;overflow-y:auto;"
       v-bind:class="{'check': viewData.shCheck}" ref="viewK">
        <span class="closexx" style="margin-right:10px;" v-on:click="closeViewPop"><Icon type="android-cancel"></Icon></span>
        <div style="margin:20px;border:1px solid #DDD;padding:5px;">
          <p>费用时间：{{ applyDate }}</p>
          <p>额度类型：Extra--{{ keType.keTypeArr[0].type }}</p>
          <p>申请人：{{ viewData.ereaName }}-{{ viewData.userName }}</p>
        </div>
        <div class="view_eve_table_div">
          <table cellpadding="0" cellspacing="0" border="1">
            <thead>
              <tr>
                <td width="7%">时间</td>
                <td width="8%">省份</td>
                <td width="7%">科目</td>
                <td width="13%">学校</td>
                <td width="9%">客户</td>
                <td width="15%">额度</td>
                <td width="22%">额度用途</td>
                <td width="19%">目标</td>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(v, vi) in type1">
                <td v-bind:rowspan="type1.length" v-if="vi==0">{{ applyDate }}</td>
                <td>{{ viewData.provinceName[vi] }}</td>
                <td>{{ (keType.keTypeVal==1)?viewData.subjectName:'N/A' }}</td>
                <td>{{ viewData.schoolName[vi] }}</td>
                <td>{{ (keType.keTypeVal==1)?'N/A':viewData.linkManName[vi] }}</td>
                <td>{{ v.sumClf }}</td>
                <td class="tleft">
                  材料费：{{ v.clf }} <br/>
                  <span v-if="keType.keTypeVal==1">招生人数：{{ v.zsNubs }}</span>
                  <span v-if="keType.keTypeVal!=1">天数：{{ v.days }}</span>
                  <br/>
                  用途：{{ v.eduyt }}
                </td>
                <td>{{ v.target }}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div style="margin:20px;text-align:right;">
          <p>总计：{{ allSumMoney.toFixed(2) }}元</p>
          <p>大写：{{ OACommon.lower2UpperNum(allSumMoney) }}</p>
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
import oaAlert from '@/components/commonVue/Alert'

export default {
  name: 'ExtraApply',
  components: {
      'oa-alert': oaAlert
  },
  data () {
    return {
      path: this.OACommon["publicDef"]["qpath"],
      applyDate: '',
      keType: {
        keTypeArr: [],  //课程类型
        keTypeVal: 1,
        subject: [],
        subjectVal: 0
      },
      type1: [{
              areaArr: [],
              areaVal: 0,
              provinceArr: [{"areaId": "", "province": "--请选择--", "provinceCode": "", "provinceId": 0}],
              provinceVal: 0,
              cityArr: [{"cityCode": "", "cityId": 0, "cityName": "--请选择--", "provinceId": ""}],
              cityVal: 0,
              schoolArr: [{"customerName": "--请选择--", "customerId": 0}],
              schoolVal: 0,
              linkManList: [{"customerContactsId": 0, "contactsName": "--请选择--"}],
              linkManVal: 0,
              jfbz: '0.00',
              days: 0,
              clf: '0.00',
              zsNubs: '',
              eduyt: '',
              target: '',
              sumClf: 0
          }],
      allSumMoney: 0,               //计算总额       
      isCanSub: true,                //避免重复提交
      viewData: {
        shCheck: true,
        userName: localStorage.getItem("userName"),
        personProvince: '',
        ereaName: '',
        provinceName: [],
        subjectName: '',
        schoolName: [],
        linkManName: []
      },
      costId: ''
    }
  },
  created: function () {
    this.setNowMonth();            //当前月份赋值
    this.setKeType();              //获取课程类型
    this.getSubject();             //获取科目

    this.type1[0].areaArr = this.OACommon.findAreaByCondition();

    this.costId = this.OACommon.getUrlPara("id");   //如果能获取到id值就是修改重提
    if(this.costId){
      this.getOldData();
    }
  },
  methods: {
    findProvinceListByProvince: function(areaId){
      var proArr = [{"areaId": "", "province": "--请选择--", "provinceCode": "", "provinceId": 0}];
      $.ajax({
        url: this.path + "findProvinceListByProvince",
        type: "get",
        dataType: "json",
        async: false,
        data: {
          "jobNumber": localStorage.getItem("jobNumber"),
          "sessionIdOa": localStorage.getItem("sessionIdOa"),
          "areaId": areaId        
        },
        success: function(data){
          proArr = proArr.concat(data["data"]);
        }.bind(this),
        error: function(){
          console.log("查询个人省份异常");
        }
      });
      return proArr;
    },
    getOldData: function(){
      $.ajax({
        url: this.path + "selectFeeApplicationDetail",
        type: "post",
        dataType: "json",
        data: {
          "jobNumber": localStorage.getItem("jobNumber"),
          "sessionIdOa": localStorage.getItem("sessionIdOa"),
          "id": this.costId           
        },
        success: function(data){
          data = data["data"][0];

          //顶部赋值
          this.applyDate = data["spendtimeString"].slice(0, -3);
          this.keType.keTypeVal = data["costTypeExtra"];
          var newTypeArr = [];
          for(var i=0;i<this.keType.keTypeArr.length;i++){
            if(this.keType.keTypeArr[i]["id"] == this.keType.keTypeVal){
              newTypeArr.push({
                "id": this.keType.keTypeArr[i]["id"], "type": this.keType.keTypeArr[i]["type"]
              });
              break;
            }
          }
          this.keType.keTypeArr = newTypeArr;
          if(data["costTypeExtra"] == 1){
            this.keType.subjectVal = data["subjectId"];
          }
          //总计金额
          this.allSumMoney = data["money"];
          //大data赋值
          var dd = data["costDetailVoList"], dl = dd.length;
          this.type1 = [];
          for(var k=0;k<dl;k++){
              this.type1.push({
                areaArr: this.OACommon.findAreaByCondition(),
                areaVal: dd[k]["areaId"],
                provinceArr: this.findProvinceListByProvince(dd[k]["areaId"]),
                provinceVal: dd[k]["provinceId"],
                cityArr: this.OACommon.findCitiesList(dd[k]["provinceId"]),
                cityVal: dd[k]["cityId"],
                schoolArr: this.OACommon.findAllCustomerBycitiesId(dd[k]["cityId"]),
                schoolVal: dd[k]["costDetailCustomerVos"][0]["customerId"],
                linkManList: (this.keType.keTypeVal==1)?[]:this.updateSchoolOk(k, dd[k]["costDetailCustomerVos"][0]["customerId"]),
                linkManVal: (this.keType.keTypeVal==1)?'':dd[k]["costDetailCustomerVos"][0]["customerContactsId"],
                jfbz: dd[k]["paymentStandard"],
                days: dd[k]["days"],
                clf: dd[k]["materialCost"],
                zsNubs: (this.keType.keTypeVal==1)?dd[k]["enrollment"]:'',
                eduyt: dd[k]["quotaPurpose"],
                target: dd[k]["target"],
                sumClf: dd[k]["quota"]
            });
          }
        }.bind(this),
        error: function(){
          console.log("获取详情异常");
        }
      })
    },
    closeViewPop: function(){
      this.viewData.shCheck = true;
    },
    viewPop: function(){
      var subPause = true;
      var eData = this.type1, el = eData.length;
      if(!this.applyDate){
        this.$refs.childAlert.show("请选择日期");
        return false;
      }
      if(this.keType.keTypeVal == 1){
        if(!this.keType.subjectVal){
          this.$refs.childAlert.show("请选择科目");
          return false;
        }
      }

      for(var i=0;i<el;i++){
        if(!eData[i]["areaVal"]){
          this.$refs.childAlert.show("请选择第" + (i+1) + "个表的区域");
          subPause = false;
          break;
        }
        if(!eData[i]["provinceVal"]){
          this.$refs.childAlert.show("请选择第" + (i+1) + "个表的省份");
          subPause = false;
          break;
        }
        if(!eData[i]["cityVal"]){
          this.$refs.childAlert.show("请选择第" + (i+1) + "个表的市/区");
          subPause = false;
          break;
        }
        if(!eData[i]["schoolVal"]){
          this.$refs.childAlert.show("请选择第" + (i+1) + "个表的学校");
          subPause = false;
          break;
        }
        if(!eData[i]["jfbz"]){
          this.$refs.childAlert.show("请输入第" + (i+1) + "个表的交费标准");
          subPause = false;
          break;
        }
        if(!eData[i]["clf"]){
          this.$refs.childAlert.show("请输入第" + (i+1) + "个表的材料费");
          subPause = false;
          break;
        }
        if(this.keType.keTypeVal == 1){      //常规课
          if(!eData[i]["zsNubs"]){
            this.$refs.childAlert.show("请输入第" + (i+1) + "个表的招生人数");
            subPause = false;
            break;
          }
        }else{
          if(!eData[i]["linkManVal"]){
            this.$refs.childAlert.show("请选择第" + (i+1) + "个表的客户");
            subPause = false;
            break;
          }
        }
        if(!eData[i]["eduyt"]){
          this.$refs.childAlert.show("请输入第" + (i+1) + "个表的额度用途");
          subPause = false;
          break;
        }
      }
      if(!subPause){
        return false;
      }
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

      for(var j=0;j<eData[0]["areaArr"].length;j++){
        if(eData[0]["areaArr"][j]["areaId"] == eData[0]["areaVal"]){
          this.viewData.ereaName = eData[0]["areaArr"][j]["areaName"];
          break;
        }
      }

      this.viewData.provinceName = [];
      for(var k=0;k<el;k++){
        for(var m=0;m<eData[k]["provinceArr"].length;m++){
          if(eData[k]["provinceArr"][m]["provinceId"] == eData[k]["provinceVal"]){
            this.viewData.provinceName.push(eData[k]["provinceArr"][m]["province"]);
            break;
          }
        }
      }

      for(var n=0;n<this.keType.subject.length;n++){
        if(this.keType.subject[n]["id"] == this.keType["subjectVal"]){
          this.viewData.subjectName = this.keType.subject[n]["name"];
          break;
        }
      }

      this.viewData.schoolName = [];
      for(var k=0;k<el;k++){
        for(var m=0;m<eData[k]["schoolArr"].length;m++){
          if(eData[k]["schoolArr"][m]["customerId"] == eData[k]["schoolVal"]){
            this.viewData.schoolName.push(eData[k]["schoolArr"][m]["customerName"]);
            break;
          }
        }
      }

      this.viewData.linkManName = [];
      for(var k=0;k<el;k++){
        for(var m=0;m<eData[k]["linkManList"].length;m++){
          if(eData[k]["linkManList"][m]["customerContactsId"] == eData[k]["linkManVal"]){
            this.viewData.linkManName.push(eData[k]["linkManList"][m]["contactsName"]);
            break;
          }
        }
      }

      this.viewData.shCheck = false;
    },
    subExtraApply: function(){
      //提交数据验证
      var subPause = true;
      var eData = this.type1, el = eData.length;

      if(!this.applyDate){
        this.$refs.childAlert.show("请选择日期");
        return false;
      }
      if(this.keType.keTypeVal == 1){
        if(!this.keType.subjectVal){
          this.$refs.childAlert.show("请选择科目");
          return false;
        }
      }

      for(var i=0;i<el;i++){
        if(!eData[i]["areaVal"]){
          this.$refs.childAlert.show("请选择第" + (i+1) + "个表的区域");
          subPause = false;
          break;
        }
        if(!eData[i]["provinceVal"]){
          this.$refs.childAlert.show("请选择第" + (i+1) + "个表的省份");
          subPause = false;
          break;
        }
        if(!eData[i]["cityVal"]){
          this.$refs.childAlert.show("请选择第" + (i+1) + "个表的市/区");
          subPause = false;
          break;
        }
        if(!eData[i]["schoolVal"]){
          this.$refs.childAlert.show("请选择第" + (i+1) + "个表的学校");
          subPause = false;
          break;
        }
        if(!eData[i]["jfbz"]){
          this.$refs.childAlert.show("请输入第" + (i+1) + "个表的交费标准");
          subPause = false;
          break;
        }
        if(!eData[i]["clf"]){
          this.$refs.childAlert.show("请输入第" + (i+1) + "个表的材料费");
          subPause = false;
          break;
        }
        if(this.keType.keTypeVal == 1){      //常规课
          if(!eData[i]["zsNubs"]){
            this.$refs.childAlert.show("请输入第" + (i+1) + "个表的招生人数");
            subPause = false;
            break;
          }
        }else{
          if(!eData[i]["linkManVal"]){
            this.$refs.childAlert.show("请选择第" + (i+1) + "个表的客户");
            subPause = false;
            break;
          }
        }
        if(!eData[i]["eduyt"]){
          this.$refs.childAlert.show("请输入第" + (i+1) + "个表的额度用途");
          subPause = false;
          break;
        }
      }
      if(!subPause){
        return false;
      }
      //避免重复提交
      if(!this.isCanSub){
        return false;
      }
      this.isCanSub = false;

      var subData = {}, subDetail = '';
      if(this.keType.keTypeVal == 1){           //常规课
        for(var i=0;i<el;i++){
          subDetail += eData[i]["areaVal"] + "--";
          subDetail += eData[i]["provinceVal"] + "--";
          subDetail += eData[i]["cityVal"] + "--";
          subDetail += eData[i]["schoolVal"] + "--";
          subDetail += eData[i]["jfbz"] + "--";
          subDetail += 0 + "--";
          subDetail += eData[i]["clf"] + "--";
          subDetail += eData[i]["zsNubs"] + "--";
          subDetail += eData[i]["eduyt"] + "--";
          subDetail += eData[i]["target"] + "--";
          subDetail += eData[i]["sumClf"];
          if(i != (el-1)){
            subDetail += "@@";
          }
        }
        if(this.costId){    //修改
          subData = {
            "jobNumber": localStorage.getItem("jobNumber"),
            "sessionIdOa": localStorage.getItem("sessionIdOa"),
            "spendtime":  this.applyDate + "-01",
            "money": this.allSumMoney,
            "costTypeTxtra": this.keType.keTypeVal,
            "subjects": this.keType.subjectVal,
            "detail": subDetail,
            "costId": this.costId
          }
        }else{
          subData = {
            "jobNumber": localStorage.getItem("jobNumber"),
            "sessionIdOa": localStorage.getItem("sessionIdOa"),
            "spendtime":  this.applyDate + "-01",
            "money": this.allSumMoney,
            "costTypeTxtra": this.keType.keTypeVal,
            "subjects": this.keType.subjectVal,
            "detail": subDetail
          }
        }
      }else{
        for(var i=0;i<el;i++){
          subDetail += eData[i]["areaVal"] + "--";
          subDetail += eData[i]["provinceVal"] + "--";
          subDetail += eData[i]["cityVal"] + "--";
          subDetail += eData[i]["schoolVal"] + "--";
          subDetail += eData[i]["linkManVal"] + "--";
          subDetail += eData[i]["jfbz"] + "--";
          subDetail += eData[i]["clf"] + "--";
          subDetail += eData[i]["days"] + "--";
          subDetail += eData[i]["eduyt"] + "--";
          subDetail += eData[i]["target"] + "--";
          subDetail += eData[i]["sumClf"];
          if(i != (el-1)){
            subDetail += "@@";
          }
        }
        if(this.costId){    //修改
          subData = {
            "jobNumber": localStorage.getItem("jobNumber"),
            "sessionIdOa": localStorage.getItem("sessionIdOa"),
            "spendtime":  this.applyDate + "-01",
            "money": this.allSumMoney,
            "costTypeTxtra": this.keType.keTypeVal,
            "detail": subDetail,
            "costId": this.costId
          }
        }else{
          subData = {
            "jobNumber": localStorage.getItem("jobNumber"),
            "sessionIdOa": localStorage.getItem("sessionIdOa"),
            "spendtime":  this.applyDate + "-01",
            "money": this.allSumMoney,
            "costTypeTxtra": this.keType.keTypeVal,
            "detail": subDetail
          }
        }
      }

      $.ajax({
        url: this.path + "insertExtra",
        type: "post",
        dataType: "json",
        data: subData,
        success: function(data){
          if(data["code"] == 200){
            if(this.costId){
              this.$refs.childAlert.show("修改成功", function(){
                this.$router.push('/mainIndex/moneyApply/ProgressSearch');
              });
            }else{
              this.$refs.childAlert.show("申请成功", function(){
                this.$router.push('/mainIndex/moneyApply/ProgressSearch');
              });
            }
          }else{
            this.$refs.childAlert.show(data["msg"]);
            this.isCanSub = true;
          }
        }.bind(this),
        error: function(){
          console.log("提交extra费用异常");
        }
      });
    },
    keTypeChange: function(){           //课程类型选一次就不让选了
      var keTypeData = [
        {"id": '', "type": "--请选择--"},
        {"id": 1, "type": "常规课"},
        {"id": 2, "type": "合作课"},
        {"id": 3, "type": "直播课"}
        ];
      var newTypeArr = [];
      for(var i=0;i<keTypeData.length;i++){
        if(keTypeData[i]["id"] == this.keType.keTypeVal){
          newTypeArr.push({
            "id": keTypeData[i]["id"], "type": keTypeData[i]["type"]
          });
          break;
        }
      }
      this.keType.keTypeArr = newTypeArr;      
    },
    addNewModel: function(){
      this.type1.push({
              areaArr: [],
              areaVal: 0,
              provinceArr: [{"areaId": "", "province": "--请选择--", "provinceCode": "", "provinceId": 0}],
              provinceVal: 0,
              cityArr: [{"cityCode": "", "cityId": 0, "cityName": "--请选择--", "provinceId": ""}],
              cityVal: 0,
              schoolArr: [{"customerName": "--请选择--", "customerId": 0}],
              schoolVal: 0,
              linkManList: [{"customerContactsId": 0, "contactsName": "--请选择--"}],
              linkManVal: 0,
              jfbz: '0.00',
              days: '5',
              clf: '0.00',
              zsNubs: '',
              eduyt: '',
              target: '',
              sumClf: 0         //材料费共计
          });
      var ml = this.type1.length - 1;
      this.type1[ml].areaArr = this.OACommon.findAreaByCondition();
    },
    daysChange: function(k,v){
      //如果材料费还未输入
      var clf = this.type1[k].clf;
      if(!clf){
        this.type1[k].sumClf = 0;
      }else{
        this.type1[k].sumClf = (Number(clf) * Number(this.type1[k].days)).toFixed(2);
      }
      this.numKey1(k,v)

    },
    numKey1: function(k, type){

      var jfbz = this.type1[k].jfbz, clf = this.type1[k].clf;
      var reg = /(^[0-9]*$)|(^[0-9]*[\.]{1}[0-9]{1,2}$)/;
      var edvalNumjfbz = 0, edvalNumclf = 0;
      if(!reg.test(jfbz)){
        if(!isNaN(jfbz) && jfbz.indexOf(".")!=-1 && jfbz.split(".")[1].length>2){
          edvalNumjfbz = jfbz.split(".")[0] + "." + jfbz.split(".")[1].substring(0, 2);
          this.type1[k].jfbz = edvalNumjfbz;
        }else{
          this.type1[k].jfbz = "0.00";
        }
      }else{
        if(this.type1[k].jfbz){
          this.type1[k].jfbz = Number(this.type1[k].jfbz).toFixed(2);
        }else{
          this.type1[k].jfbz = "0.00";
        }
      }

      if(!reg.test(clf)){
        if(!isNaN(clf) && clf.indexOf(".")!=-1 && clf.split(".")[1].length>2){
          edvalNumclf = clf.split(".")[0] + "." + clf.split(".")[1].substring(0, 2);
          this.type1[k].clf = edvalNumclf;
        }else{
          this.type1[k].clf = "0.00";
        }
      }else{
        if(this.type1[k].clf){
          this.type1[k].clf = Number(this.type1[k].clf).toFixed(2);
        }else{
          this.type1[k].clf = "0.00";
        }
      }

      //this.type1[k].sumClf = 0;
      //计算材料费
      if(type == "c"){
        if(this.keType.keTypeVal == 1){        // 常规课 乘以人数
          var zsrs = this.type1[k].zsNubs;
          if(!zsrs){   //招生人数还未输入
            this.type1[k].sumClf = 0;
          }else{
            this.type1[k].sumClf = (Number(clf) * Number(zsrs)).toFixed(2);
            this.countSumMoney();
          }
        }else{       // 其他两种乘以天数
          var days = Number(this.type1[k].days);
          this.type1[k].sumClf = (Number(clf) * days).toFixed(2);
          this.countSumMoney();
        }
      }
    },
    numKey2: function(k){
      var zsNubs = Number(this.type1[k].zsNubs);
      if(isNaN(zsNubs) || Number(zsNubs)<=0 || zsNubs%1!=0 || this.type1[k].zsNubs.indexOf(".")!=-1){
        this.type1[k].zsNubs = 0;

        this.type1[k].sumClf = 0;
        return false;
      }
      var clf = clf = this.type1[k].clf;
      if(!clf){       //材料费还未输入
        this.type1[k].sumClf = 0;
      }else{
        this.type1[k].sumClf = (zsNubs*clf).toFixed(2);
        this.countSumMoney();
      }
    },
    updateSchoolOk: function(k, cusId){
      var linkManList = [{"customerContactsId": "", "contactsName": "--请选择--"}];
      $.ajax({
        url: this.path + "findCustomerContactsAllByCustomerId",
        type: "post",
        dataType: "json",
        data: {"customerId": cusId},
        async: false,
        success: function(data){
          data = data["data"];
          linkManList = linkManList.concat(data);
        }.bind(this),
        error: function(){
          console.log("获取联系人异常");
        }
      });
      return linkManList;
    },
    typeSchoolChange: function(k){
      if(this.keType.keTypeVal != 1){
        var linkManList = [{"customerContactsId": "", "contactsName": "--请选择--"}];

        $.ajax({
          url: this.path + "findCustomerContactsAllByCustomerId",
          type: "post",
          dataType: "json",
          data: {"customerId": this.type1[k]["schoolVal"]},
          async: false,
          success: function(data){
            data = data["data"];
            this.type1[k].linkManList = linkManList.concat(data);
            this.type1[k].linkManVal = '';
          }.bind(this),
          error: function(){
            console.log("获取联系人异常");
          }
        });
      }
    },
    typeCityChange: function(k){
      this.type1[k].schoolArr = this.OACommon.findAllCustomerBycitiesId(this.type1[k].cityVal);
      this.type1[k].schoolVal = 0;
      this.type1[k].linkManList = [{"customerContactsId": 0, "contactsName": "--请选择--"}];
      this.type1[k].linkManVal = 0;
    },
    typeProChange: function(k){
      this.type1[k].cityArr = this.OACommon.findCitiesList(this.type1[k].provinceVal);
      this.type1[k].cityVal = 0;
      this.type1[k].schoolArr = [{"customerName": "--请选择--", "customerId": 0}];
      this.type1[k].schoolVal = 0;
      this.type1[k].linkManList = [{"customerContactsId": 0, "contactsName": "--请选择--"}];
      this.type1[k].linkManVal = 0;
    },
    typeAreaChange: function(k){
      this.type1[k].provinceArr = this.findProvinceListByProvince(this.type1[k].areaVal);
      this.type1[k].provinceVal = 0;
      this.type1[k].cityArr = [{"cityCode": "", "cityId": 0, "cityName": "--请选择--", "provinceId": ""}];
      this.type1[k].cityVal = 0;
      this.type1[k].schoolArr = [{"customerName": "--请选择--", "customerId": 0}];
      this.type1[k].schoolVal = 0;
      this.type1[k].linkManList = [{"customerContactsId": 0, "contactsName": "--请选择--"}];
      this.type1[k].linkManVal = 0;
    },
    setNowMonth: function(){
      var todayDate = this.OACommon.getOADate(new Date()).todayDate;
      todayDate = todayDate.substring(0, 7);
      this.applyDate = todayDate;
    },
    setKeType: function(){
      var keTypeData = [
        {"id": 1, "type": "常规课"},
        {"id": 2, "type": "合作课"},
        {"id": 3, "type": "直播课"},
        ];
      this.keType.keTypeArr = keTypeData;
    },
    getSubject: function(){
      var sArr = [{"id": 0, "name": "--请选择--"}];
      $.ajax({
        url: this.path + "showCostSubjectList",
        type: "post",
        dataType: "json",
        async: false,
        data: {
          "jobNumber": localStorage.getItem("jobNumber"),
          "sessionIdOa": localStorage.getItem("sessionIdOa")
        },
        success: function(data){
          sArr = sArr.concat(data["data"]);
          this.keType.subject = sArr;
        }.bind(this),
        error: function(){
          console.log("获取科目异常");
        }
      });
    },
    countSumMoney: function(){
      var mData = this.type1, ml = mData.length;
      var sum = 0;
      for(var i=0;i<ml;i++){
        sum += Number(mData[i]["sumClf"]);
      }
      this.allSumMoney = sum;
    },
    removeModel: function(k){
      this.type1.splice(k, 1);
      //金额删减
      this.countSumMoney();
    },
    inputKey: function(k){ //输入框数字校验
      if(isNaN(this.type1[k].days) || Number(this.type1[k].days) <= 0){
        this.type1[k].days = '';
      }
      var obj = this.type1[k].days;
      obj = obj.replace(/[^\d]/g,"");  //清除“数字”和“.”以外的字符
      this.type1[k].days = obj     
    }


  }
}
</script>
<style>
  .el-date-editor.el-input, .el-date-editor.el-input__inner{width:18%;cursor:pointer;}
  .el-input__inner{height:30px;line-height:30px;cursor:pointer;border:1px solid #C9C9C9;}
  .el-input__icon{line-height:30px;}
  .new_eve_mk{padding-top:20px;border-top:1px solid #DDD;}
  .lei_icon{
    display:inline-block;height:30px;width:40px;position:absolute;right:0;
    line-height: 30px;background:#DDD;text-align:center;font-size:12px;border-radius:0 4px 4px 0;
  }
  .view_eve_table_div{margin:10px 20px 0;}
  .view_eve_table_div table{width:100%;border-collapse:collapse;border:1px solid #d9d9d9;}
  .view_eve_table_div table thead{background:#00A1E9;color:#FFF;}
  .view_eve_table_div table td{text-align:center;vertical-align:middle;padding:3px 0;}
  .view_eve_table_div table td.tleft{text-align:left;padding-left:5px;}
  .view_eve_table_div tbody td, .view_eve_table_div tbody td span{font-size:12px;}
</style>

