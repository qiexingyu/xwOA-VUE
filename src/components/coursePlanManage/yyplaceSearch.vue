<template>
  <div class="hello">
    <div class="gonggao_bread">
        <a href="#/mainIndex/index" class="fa">首页</a>
        &gt;
        <span>课程安排管理</span>
        &gt;
        <span>场地申请查询</span>
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
          <select v-model="searchData.provinceId">
            <option v-for="p in searchData.province" v-bind:value="p.provinceId">{{ p.province }}</option>
          </select>
        </div>
        <div class="et">
          <label>地点：</label>
          <input type="text" v-model="searchData.location">
          <span class="btn-blue-s" v-on:click="getList">查询</span>
        </div>
      </div>
      <div class="gonggao_body table_body">
        <div class="data_table_head">
          <ul>
            <li class="td7 xh">序号</li>
            <li class="td12">申请日期</li>
            <li class="td12">区域</li>
            <li class="td8">省份</li>
            <li class="td12">申请人</li>
            <li class="td16">时间</li>
            <li class="td14">地点</li>
            <li class="td8">人数</li>
            <li class="td11">操作</li>
          </ul>
        </div>
        <div class="data_table_body">
          <ul v-for="(l, i) in list">
            <li class="td7 xh">{{ i+1 }}</li>
            <li class="td12">{{ l.createTime }}</li>
            <li class="td12">{{ l.areaName }}</li>
            <li class="td8">{{ l.province }}</li>
            <li class="td12">{{ l.userName }}</li>
            <li class="td16">{{ l.startDate }}  --  {{ l.endDate }}</li>
            <li class="td14">{{ l.location }}</li>
            <li class="td8">{{ l.peopleNumber }}</li>
            <li class="td11">
              <a href="javascript:void(0);" class="table_pa" v-on:click="viewPop(l.placeApplyId)">查看</a>
              <a href="javascript:void(0);" class="table_la" v-if="l.handleState==2" v-on:click="updatePlace(l.placeApplyId)">修改</a>
              <a href="javascript:void(0);" class="table_del" v-if="l.handleState==1" v-on:click="apPlace(l.placeApplyId)">安排</a>
            </li>
          </ul>
        </div>
      </div>

      <oa-page ref="childPage"></oa-page>

      <div class="bgpop" v-if="viewData.isShow" v-on:click="closePop"></div>
      <div class="kecha_pop" style="width:800px;height:420px;" v-if="viewData.isShow">
        <span class="closexx" style="margin-right:10px;" v-on:click="closePop"><Icon type="android-cancel"></Icon></span>
        <table cellpadding="0" cellspacing="0" border="1">
          <tr>
            <td colspan="4" class="head">场地详情</td>
          </tr>
          <tr class="x">
            <td class="b" width="20%">时间</td>
            <td width="30%">{{ OACommon.getOADate(new Date(viewData.vdata.startTime)).todayDate }} -- {{ OACommon.getOADate(new Date(viewData.vdata.endTime)).todayDate }}</td>
            <td class="b" width="20%">地点</td>
            <td width="30%">{{ viewData.vdata.location }}</td>
          </tr>
          <tr class="x">
            <td class="b" width="20%">场地标准</td>
            <td width="30%">{{ viewData.vdata.placeStandard }}</td>
            <td class="b" width="20%">人数</td>
            <td width="30%">{{ viewData.vdata.peopleNumber }}</td>
          </tr>
          <tr class="x">
            <td class="b" width="20%">人均钱数标准</td>
            <td width="30%">{{ viewData.vdata.onePeopleStandard?viewData.vdata.onePeopleStandard.toFixed(2):'0.00' }}</td>
            <td class="b" width="20%">人均实际标准</td>
            <td width="30%">{{ viewData.vdata.onePeopleReality?viewData.vdata.onePeopleReality.toFixed(2):'0.00' }}</td>
          </tr>
          <tr class="x">
            <td class="b" width="20%">要求</td>
            <td colspan="3">{{ viewData.vdata.placeRequire }}</td>
          </tr>
          <tr class="x">
            <td class="b" width="20%">酒店</td>
            <td colspan="3">{{ viewData.vdata.hotel }}</td>
          </tr>
          <tr class="x">
            <td class="b" width="20%">备注</td>
            <td colspan="3">{{ viewData.vdata.remark }}</td>
          </tr>
          <tr class="x">
            <td class="b" width="20%">修改记录</td>
            <td colspan="3">
              <div v-for="r in viewData.vdata.placeApplyHistoryList" v-if="viewData.vdata.placeApplyHistoryList.length>0">
                {{ r.editUserName }}&nbsp;&nbsp;{{ r.editDate }}&nbsp;&nbsp;修改
                <a href="javascript:void(0);" style="color:#00A1E9;" v-on:click="showOldUpdateData(r.editPlaceApplyId)">原记录查看</a>
              </div>
            </td>
          </tr>
        </table>
        <div style="text-align:center;margin-top:20px;margin-bottom:20px;">
          <span class="btn-blue" v-on:click="closePop">关闭</span>
        </div>

        <table cellpadding="0" cellspacing="0" border="1" v-if="oldData.isShow">
          <tr>
            <td colspan="4" class="head">修改记录</td>
          </tr>
          <tr class="x">
            <td class="b" width="20%">时间</td>
            <td width="30%">{{ oldData.odata.startTime }} -- {{ oldData.odata.endTime }}</td>
            <td class="b" width="20%">地点</td>
            <td width="30%">{{ oldData.odata.location }}</td>
          </tr>
          <tr class="x">
            <td class="b" width="20%">场地标准</td>
            <td width="30%">{{ oldData.odata.placeStandard }}</td>
            <td class="b" width="20%">人数</td>
            <td width="30%">{{ oldData.odata.peopleNumber }}</td>
          </tr>
          <tr class="x">
            <td class="b" width="20%">人均钱数标准</td>
            <td width="30%">{{ oldData.odata.onePeopleStandard }}</td>
            <td class="b" width="20%">人均实际标准</td>
            <td width="30%">{{ oldData.odata.onePeopleReality }}</td>
          </tr>
          <tr class="x">
            <td class="b" width="20%">要求</td>
            <td colspan="3">{{ oldData.odata.placeRequire }}</td>
          </tr>
          <tr class="x">
            <td class="b" width="20%">酒店</td>
            <td colspan="3">{{ oldData.odata.hotel }}</td>
          </tr>
          <tr class="x">
            <td class="b" width="20%">备注</td>
            <td colspan="3">{{ oldData.odata.remark }}</td>
          </tr>
          <tr class="x">
            <td class="b" width="20%">修改原因</td>
            <td colspan="3">{{ oldData.odata.editReason }}</td>
          </tr>
        </table>
        <div style="text-align:center;margin-top:20px;margin-bottom:20px;" v-if="oldData.isShow">
          <span class="btn-blue" v-on:click="closeOldPop">关闭</span>
        </div>
      </div>

      <div class="bgpop" v-if="updateData.isShow" v-on:click="canelUpdate"></div>
      <div class="kecha_pop" style="width:800px;height:480px;" v-if="updateData.isShow">
        <span class="closexx" style="margin-right:10px;" v-on:click="canelUpdate"><Icon type="android-cancel"></Icon></span>
        <p class="pop_tit">场地安排</p>
        <div class="pop_form_div">
          <div class="form_eve place yydo3">
            <label class="label_tit-3">时&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;间：</label>
            <el-date-picker
              v-bind:disabled="updateData.apPuase"
              v-model="updateData.applyTime"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期">
            </el-date-picker>
            <label class="label_tit-3">地&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;点：</label>
            <input type="text" class="form_input-6" v-model="updateData.location" v-bind:disabled="updateData.apPuase">
          </div>
          <div class="form_eve">
            <label class="label_tit-3">场地标准：</label>
            <input type="text" class="form_input-6" v-model="updateData.placeStandard" v-bind:disabled="updateData.apPuase">
            <label class="label_tit-3">人&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;数：</label>
            <input type="text" class="form_input-6" v-model="updateData.peopleNumber" v-bind:disabled="updateData.apPuase" v-on:blur="moneyKey1">
          </div>
          <div class="form_eve">
            <label class="label_tit-3">人均钱数标准：</label>
            <input type="text" class="form_input-6" v-model="updateData.onePeopleStandard" v-bind:disabled="updateData.apPuase" v-on:blur="moneyKey2">
            <label class="label_tit-3">人均实收标准：</label>
            <input type="text" class="form_input-6" v-model="updateData.onePeopleReality" v-on:blur="moneyKey3">
          </div>
          <div class="form_eve">
            <label class="label_tit-3">要&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;求：</label>
            <textarea class="form_input-7" v-model="updateData.placeRequire" v-bind:disabled="updateData.apPuase" maxlength="500" placeholder="最多输入500个字"></textarea>
          </div>
          <div class="form_eve">
            <label class="label_tit-3">酒&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;店：</label>
            <input type="text" class="form_input-8" v-model="updateData.hotel" maxlength="30"  placeholder="最多输入30个字">
          </div>
          <div class="form_eve">
            <label class="label_tit-3">备&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;注：</label>
            <textarea class="form_input-7" maxlength="500" v-model="updateData.remark" placeholder="最多输入500个字"></textarea>
          </div>
          <div class="form_eve" v-if="apOrUPdate==2">
            <label class="label_tit-3">修改原因：</label>
            <textarea class="form_input-7" maxlength="500" v-model="updateData.editReason" placeholder="最多输入500个字"></textarea>
          </div>
          <div style="height:20px;text-align:center;color:red;margin-top:10px;">{{ updateData.errTip }}</div>
          <div class="fbtong_btn_div" style="margin-top:20px;">
            <span class="btn-blue-s" v-if="updateData.apPuase" v-on:click="go2Ap">提交</span>
            <span class="btn-blue-s" v-if="!updateData.apPuase" v-on:click="go2Update">提交</span>
            <span class="btn-yellow-s" v-on:click="canelUpdate">取消</span>
          </div>
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
  name: 'coursePlanApply',
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
        location: '',
        area: [],
        areaId: 0,
        province: [{"areaId": "", "province": "--请选择--", "provinceCode": "", "provinceId": 0}],
        provinceId: 0
      },
      pageNum: 1,
      pageSize: 10,
      list: [],
      placeApplyId: '',
      viewData: {
        isShow: false,
        vdata: {}
      },
      updateData: {
        isShow: false,
        canUpdate: false,    //安排不能修改
        applyDate: '',
        apPuase: true,        //true 安排  false 修改
        applyTime: [],
        location: '',
        placeStandard: '',
        peopleNumber: 0,
        onePeopleStandard: 0,
        onePeopleReality: 0,
        placeRequire: '',
        hotel: '',
        remark: '',
        editReason: '',
        errTip: ''
      },
      apOrUPdate: 1,    //安排还是修改  1：安排2：修改
      oldData: {
        isShow: false,
        odata: {}
      }
    }  
  },
  created: function () {
    this.setInitSearchData();          //设置搜索框内容
    this.getList();
  },
  methods: {
    closeOldPop: function(){            //关闭修改记录
      this.oldData.odata = {};
      this.oldData.isShow = false;
    },
    showOldUpdateData: function(id){    //展示修改记录
      this.oldData.isShow = true;
      $.ajax({
        url: this.path + "findEditPlaceApplyById",
        type: "post",
        dataType: "json",
        data: {
          "jobNumber": localStorage.getItem("jobNumber"),
          "sessionIdOa": localStorage.getItem("sessionIdOa"),
          "editPlaceApplyId": id
        },
        success: function(data){
          this.oldData.odata = data["data"];
        }.bind(this),
        error: function(){
          console.log("查看修改记录异常");
        }
      });
    },
    updatePlace: function(id){
      this.apOrUPdate = 2;       //2：修改
      this.placeApplyId = id;
      this.updateData.apPuase = false;
      this.updateData.isShow = true;

      $.ajax({
        url: this.path + "selectPlaceApplyAndHistoryById",
        type: "post",
        dataType: "json",
        data: {
          "jobNumber": localStorage.getItem("jobNumber"),
          "sessionIdOa": localStorage.getItem("sessionIdOa"),
          "placeApplyId": id
        },
        success: function(data){
          data = data["data"];
          var applyTime = [];
          applyTime.push(new Date(data["startTime"]));
          applyTime.push(new Date(data["endTime"]));
          this.updateData.applyTime = applyTime;

          this.updateData.location = data["location"];
          this.updateData.placeStandard = data["placeStandard"];
          this.updateData.peopleNumber = data["peopleNumber"];
          this.updateData.onePeopleStandard = data["onePeopleStandard"].toFixed(2);
          this.updateData.onePeopleReality = data["onePeopleReality"].toFixed(2);
          this.updateData.placeRequire = data["placeRequire"];
          this.updateData.hotel = data["hotel"];
          this.updateData.remark = data["remark"];
          this.updateData.editReason = "";

        }.bind(this),
        error: function(){
          console.log("查详情异常");
        }
      });
    },
    go2Update: function(){             //修改
      if(!this.updateData.applyTime){
        this.updateData.errTip = "请选择时间";
        return false;
      }
      if(!this.updateData.location){
        this.updateData.errTip = "请输入地点";
        return false;
      }
      if(!this.updateData.placeStandard){
        this.updateData.errTip = "请输入场地标准";
        return false;
      }
      if(!this.updateData.peopleNumber){
        this.updateData.errTip = "请输入人数";
        return false;
      }
      if(!this.updateData.onePeopleStandard){
        this.updateData.errTip = "请输入人均钱数标准";
        return false;
      }
      if(!this.updateData.onePeopleReality){
        this.updateData.errTip = "请输入人均实收标准";
        return false;
      }
      if(!this.updateData.placeRequire){
        this.updateData.errTip = "请输入要求";
        return false;
      }
      if(!this.updateData.hotel){
        this.updateData.errTip = "请输入酒店";
        return false;
      }
      if(!this.updateData.remark){
        this.updateData.errTip = "请输入备注";
        return false;
      }
      if(!this.updateData.editReason){
        this.updateData.errTip = "请输入修改原因";
        return false;
      }
      this.updateData.errTip = "";

      var stime = this.OACommon.getOADate(new Date(this.updateData.applyTime[0])).todayDate;
      var etime = this.OACommon.getOADate(new Date(this.updateData.applyTime[1])).todayDate;
      $.ajax({
        url: this.path + "updatePlaceApply",
        type: "post",
        dataType: "json",
        data: {
          "jobNumber": localStorage.getItem("jobNumber"),
          "sessionIdOa": localStorage.getItem("sessionIdOa"),
          "placeApplyId": this.placeApplyId,
          "startDate": stime,
          "endDate": etime,
          "placeStandard": this.updateData.placeStandard,
          "peopleNumber": this.updateData.peopleNumber,
          "onePeopleStandard": this.updateData.onePeopleStandard,
          "onePeopleReality": this.updateData.onePeopleReality,
          "placeRequire": this.updateData.placeRequire,
          "hotel": this.updateData.hotel,
          "remark": this.updateData.remark,
          "editReason": this.updateData.editReason
        },
        success: function(data){
          if(data["code"] == 200){
            this.canelUpdate();
            this.getList();
            this.$refs.childAlert.show("修改场地成功");
          }else{
            this.updateData.errTip = data["msg"];
          }
        }.bind(this),
        error: function(){
          console.log("修改异常");
        }
      })
    },
    go2Ap: function(){                 //安排
      if(!this.updateData.hotel){
        this.updateData.errTip = "请输入安排酒店";
        return false;
      }
      if(!this.updateData.remark){
        this.updateData.errTip = "请输入安排备注";
        return false;
      }
      this.updateData.errTip = "";

      $.ajax({
        url: this.path + "updatePlaceApplyHotelAndRemark",
        type: "post",
        dataType: "json",
        data: {
          "jobNumber": localStorage.getItem("jobNumber"),
          "sessionIdOa": localStorage.getItem("sessionIdOa"),
          "placeApplyId": this.placeApplyId,
          "hotel": this.updateData.hotel,
          "remark": this.updateData.remark
        },
        success: function(data){
          if(data["code"] == 200){
            this.canelUpdate();
            this.getList();
            this.$refs.childAlert.show("安排场地成功");
          }else{
            this.updateData.errTip = data["msg"];
          }
        }.bind(this),
        error: function(){
          console.log("安排异常");
        }
      });
    },
    canelUpdate: function(){
      this.placeApplyId = "";
      this.updateData.apPuase = false;
      this.updateData.isShow = false;
      this.updateData.errTip = "";
    },
    apPlace: function(id){
      this.apOrUPdate = 1;     //1：安排
      this.placeApplyId = id;
      this.updateData.apPuase = true;
      this.updateData.isShow = true;

      $.ajax({
        url: this.path + "selectPlaceApplyAndHistoryById",
        type: "post",
        dataType: "json",
        data: {
          "jobNumber": localStorage.getItem("jobNumber"),
          "sessionIdOa": localStorage.getItem("sessionIdOa"),
          "placeApplyId": id
        },
        success: function(data){
          data = data["data"];
          var applyTime = [];
          applyTime.push(new Date(data["startTime"]));
          applyTime.push(new Date(data["endTime"]));
          this.updateData.applyTime = applyTime;

          this.updateData.location = data["location"];
          this.updateData.placeStandard = data["placeStandard"];
          this.updateData.peopleNumber = data["peopleNumber"];
          this.updateData.onePeopleStandard = data["onePeopleStandard"].toFixed(2);
          this.updateData.onePeopleReality = data["onePeopleReality"].toFixed(2);
          this.updateData.placeRequire = data["placeRequire"];
          this.updateData.hotel = "";
          this.updateData.remark = "";
          //this.updateData.editReason = "";
        }.bind(this),
        error: function(){
          console.log("查详情异常");
        }
      });
    },
    areaChange: function(){
      this.searchData.province = this.OACommon.findProvinceList(this.searchData.areaId);
      this.searchData.provinceId = 0;
    },
    closePop: function(){
      this.viewData.isShow = false;
    },
    viewPop: function(id){
      $.ajax({
        url: this.path + "selectPlaceApplyAndHistoryById",
        type: "post",
        dataType: "json",
        data: {
          "jobNumber": localStorage.getItem("jobNumber"),
          "sessionIdOa": localStorage.getItem("sessionIdOa"),
          "placeApplyId": id
        },
        success: function(data){
          this.viewData.isShow = true;
          this.viewData.vdata = data["data"];
        }.bind(this),
        error: function(){
          console.log("获取场地详情异常");
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
        url: this.path + "findPlaceListPage",
        type: "post",
        dataType: "json",
        data: {
          "jobNumber": localStorage.getItem("jobNumber"),
          "sessionIdOa": localStorage.getItem("sessionIdOa"),
          "startDate": this.searchData.startDate,
          "endDate": this.searchData.endDate,
          "location": this.searchData.location,
          "pageNum": this.pageNum,
          "pageSize": this.pageSize,
          "areaId": this.searchData.areaId,
          "provinceId": this.searchData.provinceId
        },
        success: function(data){
          this.list = data["data"]["list"];

          this.$refs.childPage.setArg(data["data"]["pages"], this.pageNum, this.pageSize, this.getList);
        }.bind(this),
        error: function(){
          console.log("获取个人代办列表异常");
        }
      });
    },
    setInitSearchData: function(){
      //设置时间
      //this.searchData.startDate = this.OACommon.getOADate(new Date()).prevMonthToday;
      //this.searchData.endDate = this.OACommon.getOADate(new Date()).todayDate;
      this.searchData.area = this.OACommon.findAreaByCondition();
    },
    moneyKey1: function(){
      if(isNaN(this.updateData.peopleNumber) || Number(this.updateData.peopleNumber)%1!=0 || Number(this.updateData.peopleNumber)<=0 || this.updateData.peopleNumber.indexOf(".")!=-1){
        this.updateData.peopleNumber = 1;
      }
    },
    moneyKey2: function(){
      var reg = /(^[0-9]*$)|(^[0-9]*[\.]{1}[0-9]{1,2}$)/;
      var edvalNum = 0;
      if(!reg.test(this.updateData.onePeopleStandard)){
        if(!isNaN(this.updateData.onePeopleStandard) && this.updateData.onePeopleStandard.indexOf(".")!=-1 && this.updateData.onePeopleStandard.split(".")[1].length>2){
          edvalNum = this.updateData.onePeopleStandard.split(".")[0] + "." + this.updateData.onePeopleStandard.split(".")[1].substring(0, 2);
          this.updateData.onePeopleStandard = Number(edvalNum).toFixed(2);
        }else{
          this.updateData.onePeopleStandard = "0.00";
        }
      }else{
        if(this.updateData.onePeopleStandard){
          this.updateData.onePeopleStandard = Number(this.updateData.onePeopleStandard).toFixed(2);
        }else{
          this.updateData.onePeopleStandard = "0.00";
        }
      }
    },
    moneyKey3: function(){
      var reg = /(^[0-9]*$)|(^[0-9]*[\.]{1}[0-9]{1,2}$)/;
      var edvalNum = 0;
      if(!reg.test(this.updateData.onePeopleReality)){
        if(!isNaN(this.updateData.onePeopleReality) && this.updateData.onePeopleReality.indexOf(".")!=-1 && this.updateData.onePeopleReality.split(".")[1].length>2){
          edvalNum = this.updateData.onePeopleReality.split(".")[0] + "." + this.updateData.onePeopleReality.split(".")[1].substring(0, 2);
          this.updateData.onePeopleReality = Number(edvalNum).toFixed(2);
        }else{
          this.updateData.onePeopleReality = "0.00";
        }
      }else{
        if(this.updateData.onePeopleReality){
          this.updateData.onePeopleReality = Number(this.updateData.onePeopleReality).toFixed(2);
        }else{
          this.updateData.onePeopleReality = "0.00";
        }
      }
    }
  }
}
</script>
<style>

  
</style>

