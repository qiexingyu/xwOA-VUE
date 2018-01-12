<template>
  <div class="hello" v-on:click="hideSomePanel">
      <div class="gonggao_bread">
        <a href="#/mainIndex/index" class="fa">首页</a>
        &gt;
        <span>费用申请</span>
        &gt;
        <span>开课费用申请</span>
      </div>
      <div class="search_div yydo">
        <label>选择时间：</label>
        <el-date-picker
            v-model="searchData.searchDateVal"
            type="date"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
            placeholder="选择日期">
          </el-date-picker>
        <label>选择区域：</label>
        <select v-model="searchData.areaVal">
          <option v-for="a in searchData.areaList" v-bind:value="a.areaId">{{ a.areaName }}</option>
        </select>
      </div>

      <div class="gonggao_body">
        <div class="money_table" v-for="(v, k) in tableData">
          <table cellpadding="0" cellspacing="0" border="1" style="width:98%;">
            <thead>
              <tr>
                <td width="8%" align="center" style="cursor:pointer;" v-on:mouseenter="showProList(k)" v-on:mouseleave="hideProList(k)">
                  省份<Icon type="chevron-down" style="margin-left:3px;"></Icon>
                  <ul class="person_ul" v-if="dropData.provincePause[k].sp" style="width:200%;">
                    <li v-for="p in dropData.provinceList" v-bind:pid="p.provinceId" v-on:click="setSecProvinceId(k, p.provinceId, p.province)">{{ p.province }}</li>
                  </ul>
                </td>
                <td width="10%" align="center" style="cursor:pointer;" v-on:mouseenter="showCourseType(k)" v-on:mouseleave="hideCourseType(k)">
                  课程类型<Icon type="chevron-down" style="margin-left:3px;"></Icon>
                  <ul class="person_ul" v-if="dropData.courseTypePause[k].sp">
                    <li v-for="ct in dropData.courseTypeArr" v-on:click="setSecCourseType(k, ct.id, ct.name)">{{ ct.name }}</li>
                  </ul>
                </td>
                <td width="10%" align="center" style="cursor:pointer;" v-on:mouseenter="showMonTypeList(k)" v-on:mouseleave="hideMonTypeList(k)">
                  额度类别<Icon type="chevron-down" style="margin-left:3px;"></Icon>
                  <ul class="person_ul edu" v-if="dropData.monTypePause[k].mp" style="width:180%;">
                    <li v-for="(m, m1) in dropData.monTypeList">
                      <input type="checkbox" v-bind:value="m.costTypeId" v-bind:id="'edu'+m1" style="margin-left:20px;" v-on:click="insertTypeId(k, m.costTypeId)"/>
                      <label v-bind:for="'edu'+m1" style="margin-left:10px;width:60%;">{{ m.costTypeName }}</label>
                    </li>
                  </ul>
                </td>
                <td width="12%">学校</td>
                <td width="10%">客户</td>
                <td width="10%">额度</td>
                <td width="20%">额度用途</td>
                <td width="20%">目标</td>
              </tr>
            </thead>
            <tbody>
              <tr style="height:40px;" v-for="(t, i) in v.sun">
                <td align="center" v-if="i==0" v-bind:rowspan="v.sun.length">{{ dropData.selectedProvince[k].name }}</td>
                <td align="center" v-if="i==0" v-bind:rowspan="v.sun.length">{{ dropData.selectedCourseTypeName[k].name }}</td>
                <td align="center">{{ t["c2"] }}</td>
                <td>
                  {{ (dropData["courseTypeId"][k]["id"]==1)?'N/A':((t["c1"]==2)?(t["c13"].join(",")):t["c5"]) }}
                  <div class="xiaopen" v-if="dropData.penShow[k].ps&&dropData['courseTypeId'][k]['id']!=1" v-on:click.stop="spanShowSchool(i, k)">
                    <Icon type="compose"></Icon>
                  </div>
                  <ul class="person_ul edu" v-if="t.c3==true" style="width:200%;" id="schoolPanelDiv">
                    <li style="text-align:center;">
                      <select v-model="t.c12" v-on:change="getSchoolList(k, i)" style="width:80%;">
                        <option v-for="c in dropData.cityList" v-bind:value="c.cityId">{{ c.cityName }}</option>
                      </select>
                    </li>
                    <li v-if="(t.c1!=2)&&(dropData.schoolList.length>0)" v-for="(s, s1) in dropData.schoolList">
                      <input type="radio" name="sc" v-if="s.customerId!=''" v-model="t.c4" v-bind:value="s.customerId" v-bind:id="'sc'+s1"/>
                      <label v-bind:for="'sc'+s1" style="width:70%;">{{ s.customerName }}</label>
                    </li>
                    <li v-if="(t.c1==2)&&(dropData.schoolList.length>0)" v-for="(s, s1) in dropData.schoolList">
                      <input type="checkbox" v-if="s.customerId!=''" v-model="t.c14" v-bind:value="s.customerId" v-bind:id="'sc'+s1" v-on:click="pushCustId(s.customerId, s.customerName, i, k)"/>
                      <label v-bind:for="'sc'+s1" style="width:70%;">{{ s.customerName }}</label>
                    </li>
                    <li style="text-align:center;" v-if="dropData.schoolList.length>0">
                      <span class="btn-blue-s gx_btn" v-on:click="fuSchoolVal(i, k)">确认</span>
                    </li>
                  </ul>

                </td>
                <td>
                  {{ (t.c1==2||dropData["courseTypeId"][k]["id"]==1)?'N/A':t["c8"] }}
                  <div class="xiaopen" v-if="(t.c1!=2)&&dropData.penShow[k].ps&&dropData['courseTypeId'][k]['id']!=1" v-on:click.stop="spanLinkMan(i, k)">
                    <Icon type="compose"></Icon>
                  </div>
                  <ul class="person_ul edu" v-if="t.c6==true" style="width:200%;" v-on:mouseleave="fuLinkMan(i, k)">
                    <li v-for="(l, l1) in dropData.linkManList">
                      <input type="radio" name="kh" v-if="l.customerContactsId!=''" v-bind:value="l.customerContactsId" v-model="t.c7" v-bind:id="'kh'+l1"/>
                      <label v-bind:for="'kh'+l1" style="width:60%;">{{ l.contactsName }}</label>
                    </li>
                  </ul>
                </td>

                <td>

                  <input type="text" v-if="(t.c1!=2)&&dropData.penShow[k].ps" v-model="t.c9.edval" v-on:blur="valiEdu(t)" style="width:100px;"/>
                  <span v-if="t.c1==2">{{ Number(t.c9.edval).toFixed(2) }}</span>
                  <div class="xiaopen" v-if="(t.c1==2)" v-on:click.stop="spanChailv(i, k)">
                    <Icon type="compose"></Icon>
                  </div>

                </td>

                <td>
                  <textarea class="tt" v-model="t.c10" placeholder="最多输入500个字" maxlength="500"></textarea>
                </td>

                <td>
                  <textarea class="tt" v-model="t.c11" placeholder="最多输入500个字" maxlength="500"></textarea>
                  <div class="apply_del_tr" v-if="t.c1" v-on:click="deleteEveTr(i, k)">
                    <Icon type="ios-close"></Icon>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>

          <div style="text-align:right;margin-top:10px;width:98%;">
            <span class="btn-yellow-s" v-on:click="removeTableData(k)" v-if="(tableData.length>1) && k!=0">删除</span>
            <span class="btn-blue-s" v-on:click="addNewTableData(k)" style="margin-right:0;" v-if="k==(tableData.length-1)">省份新增</span>
          </div>

        </div>
        <div style="text-align:right;margin:0 20px;font-size:16px;">
          <div style="width:98%;">总计：{{ Number(subMoney).toFixed(2) }}元</div>
        </div>
        <div class="fbtong_btn_div" style="padding-bottom:30px;">
          <span class="btn-yellow" v-on:click="viewPersonApply">预览</span>
          <span class="btn-blue" v-on:click="subPersonApply">提交</span>
        </div>

      </div>

      <div v-for="(x, xe) in ed">
        <div class="bgpop" v-for="(e, ei) in x.sun" v-if="e.shCheck" v-on:click="closeCLF(ei, xe)"></div>
        <div class="view_area" v-for="(e, ei) in x.sun" style="width: 600px;height:261px;padding: 5px 20px;" v-if="e.shCheck">
          <span class="closexx" style="margin-right:10px;" v-on:click="closeCLF(ei, xe)"><Icon type="android-cancel"></Icon></span>
          <div style="font-size: 20px;font-weight: 700;text-align: center;margin-top: 10px;">差旅费额度</div>
          <div class="view_school yydo" style="margin-top: 10px;">
            <label style="display: inline-block;width:80px;text-align: right;">选择时间：</label>
            <el-date-picker
              v-model="e.startTime"
              type="date"
              format="yyyy-MM-dd"
              value-format="yyyy-MM-dd"
              :picker-options="pickerOptions"
              @change="countCLFWordMoney(ei, xe)"
              placeholder="选择日期">
            </el-date-picker>

            <label style="display:inline-block;margin:10px 5px;">至</label>
            
            <el-date-picker
              v-model="e.endTime"
              type="date"
              format="yyyy-MM-dd"
              value-format="yyyy-MM-dd"
              :picker-options="pickerOptions"
              @change="countCLFWordMoney(ei, xe)"
              placeholder="选择日期">
            </el-date-picker>
            
          </div>
          <div class="view_school" style="margin-top: 10px;">
            <label style="display: inline-block;width:80px;text-align:right;">过路费：</label>
            <input type="text" v-model="e.glf" v-on:blur="glfKeyup(ei, xe)"/>
            <label style="display: inline-block;width: 70px;text-align:right;">油费：</label>
            <input type="text" v-model="e.yf" v-on:blur="yfKeyup(ei, xe)"/>
          </div>
          <div style="text-align:center;color:red;margin-top:10px;height:20px;">{{ e.errorTip }}</div>
          <div style="color:red;margin-top:10px;margin-left:20px;">{{ e.clvWord }}</div>
          <div class="view_btn" style="margin-top:20px;">
            <span class="btn-blue-s" v-on:click="countEduFee(ei, xe)">确定</span>
            <span class="btn-yellow-s" v-on:click="closeCLF(ei, xe)">取消</span>
          </div>
        </div>
      </div>

      <div class="bgpop" v-bind:class="{'check': viewData.shCheck}" v-on:click="closeViewPop"></div>
      <div class="view_area" style="width:1024px;height:400px;overflow-y:auto;"
       v-bind:class="{'check': viewData.shCheck}">
        <span class="closexx" style="margin-right:10px;" v-on:click="closeViewPop"><Icon type="android-cancel"></Icon></span>
        <div style="margin:20px;border:1px solid #DDD;padding:5px;">
          <p>费用时间：{{ searchData.searchDateVal }}</p>
          <p>额度类型：开课费用</p>
          <p>申请人：{{ viewData.areaData }}-{{ viewData.userName }}</p>
        </div>
        <div class="view_eve_table_div">
          <table cellpadding="0" cellspacing="0" border="1">
            <thead>
              <tr>
                <td width="9%">省份</td>
                <td width="8%">课程类型</td>
                <td width="9%">额度类别</td>
                <td width="13%">学校</td>
                <td width="9%">客户</td>
                <td width="9%">额度</td>
                <td width="22%">额度用途</td>
                <td width="20%">目标</td>
              </tr>
            </thead>
            <tbody v-for="(vi, vk) in tableData">
              <tr v-for="(vr, vu) in vi.sun">
                <td v-bind:rowspan="vi.sun.length" v-if="vu==0">{{ dropData.selectedProvince[vk]["name"] }}</td>
                <td v-bind:rowspan="vi.sun.length" v-if="vu==0">{{ dropData.selectedCourseTypeName[vk]["name"] }}</td>
                <td>{{ vr.c2 }}</td>
                <td>{{ (dropData.courseTypeId[vk]["id"]==1)?'N/A':((vr.c1==2)?(vr.c13.join(",")):vr.c5) }}</td>
                <td>{{ (dropData.courseTypeId[vk]["id"]==1)?'N/A':((vr.c1!=2)?vr["c8"]:'N/A') }}</td>
                <td>{{ vr.c9.edval }}</td>
                <td>{{ vr.c10 }}</td>
                <td>{{ vr.c11 }}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div style="margin:20px;text-align:right;">
          <p>总计：{{ Number(subMoney).toFixed(2) }}元</p>
          <p>大写：{{ OACommon.lower2UpperNum(subMoney) }}</p>
        </div>
        <div class="view_btn" style="margin-top:20px;margin-bottom:20px;">
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
  name: 'PersonApply',
  components: {
      'oa-alert': oaAlert
    },
  data () {
    return {
      path: this.OACommon["publicDef"]["qpath"],
      pickerOptions: {
        firstDayOfWeek: 1,
        disabledDate(time) {
            return time.getTime() < Date.now();
        }
      },
      ccbz: 350,                    //每天的出差补助
      costId: '',
      searchData: {
        searchDate: [],
        searchDateVal: '',
        areaList: [],
        areaVal: 0
      },
      courseTypeObj: {
        1: "常规课",
        2: "合作课"
      },
      dropData: {
        provincePause: [{"sp":false}],
        provinceList: [],            //省份列表
        provinceId: [{"id": 0}],              //选中省份的id
        selectedProvince: [{"name": ''}],        //选中省份的name
        courseTypePause: [{"sp": false}],       //课程类型是否显示
        courseTypeArr: [
          {"id": 1, "name": "常规课"},
          {"id": 2, "name": "合作课"}
        ],
        courseTypeId: [{"id": ''}],
        selectedCourseTypeName: [{"name": ''}],
        monTypePause: [{"mp": false}],
        monTypeList: [],             //额度类别列表
        monTypeModel: [[]],             //被选中的额度类别的id的列表
        penShow: [{"ps": false}],
        schoolList: [],                //根据选择不同城市，获取学校列表
        //selectSchoolModel: [{"sm": [{"sg": ''}]}],         //选中的学校的双向绑定值
        selectSchoolModelDuo: [{"sm": []}],
        pushSchoolModel: [],           //push学校值
        cityList: [],                    //省份下面的城市
        cityId: 0,                       //选中的城市id
        linkManList: [{"customerContactsId": "", "contactsName": "暂无联系人"}],                 //查询到的联系人列表
        linkManModel: [{"link": [{"lk": ''}]}]
      },
      tableData: [{
                    sun: [
                      {
                        "c1": '',
                        "c2": '',
                        "c3": false,
                        "c4": '',
                        "c5": '',
                        "c6": false,
                        "c7": '',
                        "c8": '',
                        "c9": {"edval": "0.00", edObj: {}},
                        "c10": '',
                        "c11": '',
                        "c12": 0,
                        "c13": [],
                        "c14": []
                      }
                    ]             
                  }
                ],                //1：额度类别id　2：额度类别名字　3：是否显示学校弹框 4：选取学校的id 5：选取学校的名称 6:是否显示联系人列表 7联系人id 
                            //8：联系人name  9:额度数值  10:额度用途  11：目标  12:城市id  13:差旅费学校name的汇总  14:差旅费学校id汇总
      ed: [{
            sun: [{
                shCheck: false,
                startTime: '',
                endTime: '',
                glf: "0.00",
                yf: "0.00",
                errorTip: '',
                popd: '',
                popdK: '',
                clvWord: ''
              }]
          }],
      edShow: false,
      subPause: true,
      subMoney: "0.00",
      viewData: {             // 预览部分值赋值
        areaData: '',
        userName: localStorage.getItem("userName"),
        shCheck: true,
        personProvince: ''
      },
      tempCLF: {            //暂时存放差旅费的数据
        startTime: '',
        endTime: '',
        glf: "0.00",
        yf: "0.00"
      },
      eveMonTypeIdArr: []     //每次选完的额度类别
    }
  },
  created: function () {
    //this.costJudgementTime();    //每个月的25日-31日才能提交的时间限制
    this.costId = this.OACommon.getUrlPara("id");   //如果能获取到id值就是修改重提
    this.setSearchData();        //初始化顶部搜索时间搜索赋值
    this.getProvinceList();      //获取省份列表
    this.getSelectCostType();    //获取额度类别
    if(this.costId){
      this.getOldData();
    }

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
    setSecCourseType: function(k, id, name){
      this.dropData.courseTypePause[k]["sp"] = false;
      this.dropData.courseTypeId[k]["id"] = id;
      this.dropData.selectedCourseTypeName[k]["name"] = name;
    },
    showCourseType: function(k){
      this.dropData.courseTypePause[k]["sp"] = true;
    },
    hideCourseType: function(k){
      this.dropData.courseTypePause[k]["sp"] = false;
    },
    deleteEveTr: function(i, k){
      if(this.tableData[k]["sun"].length == 1){       //表格只剩一条数据就清空
        if(this.tableData[k]["sun"][i]["c1"] == 2){   //差旅费要清空弹框内容
          this.ed[k]["sun"][i].shCheck = false;
          this.ed[k]["sun"][i].startTime = "";
          this.ed[k]["sun"][i].endTime = "";
          this.ed[k]["sun"][i].glf = "0.00";
          this.ed[k]["sun"][i].yf = "0.00";
          this.ed[k]["sun"][i].popd = "";
          this.ed[k]["sun"][i].popdK = "";
          this.ed[k]["sun"][i].clvWord = "";
        }

        this.tableData[k]["sun"][i]["c1"] = "";
        this.tableData[k]["sun"][i]["c2"] = "";
        this.tableData[k]["sun"][i]["c3"] = false;
        this.tableData[k]["sun"][i]["c4"] = "";
        this.tableData[k]["sun"][i]["c5"] = "";
        this.tableData[k]["sun"][i]["c6"] = false;
        this.tableData[k]["sun"][i]["c7"] = "";
        this.tableData[k]["sun"][i]["c8"] = "";
        this.tableData[k]["sun"][i]["c9"] = {"edval": "0.00", edObj: {}};
        this.tableData[k]["sun"][i]["c10"] = "";
        this.tableData[k]["sun"][i]["c11"] = "";
        this.tableData[k]["sun"][i]["c12"] = 0;
        this.tableData[k]["sun"][i]["c13"] = [];
        this.tableData[k]["sun"][i]["c14"] = [];
      }else{                                        //不是只剩一条数据的删除当条
        if(this.tableData[k]["sun"][i]["c1"] == 2){
          this.ed[k]["sun"].splice(i, 1);
        }
        this.tableData[k]["sun"].splice(i, 1);
      }
      this.dropData.monTypeModel[k].splice(i, 1);

      //金额删减
      this.countMoney();
    },
    insertTypeId: function(k, id){
      if(this.eveMonTypeIdArr.indexOf(id) != -1){
        this.eveMonTypeIdArr.splice(this.eveMonTypeIdArr.indexOf(id), 1);
      }else{
        this.eveMonTypeIdArr.push(id);
      }
    },
    hideSomePanel: function(event){
      var sp = document.getElementById("schoolPanelDiv");
      if(sp){
        if(!sp.contains(event.target)){
          for(var i=0;i<this.tableData.length;i++){
            for(var j=0;j<this.tableData[i]["sun"].length;j++){
              this.tableData[i]["sun"][j]["c3"] = false;
            }
          }
        }
      }
    },
    getOldData: function(){        //修改重提获取原来的申请数据
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

          this.subMoney = data["money"];
          //顶部赋值
          this.searchData.searchDateVal = data["spendtimeString"].slice(0, -3);
          for(var q=0;q<this.searchData.areaList.length;q++){
            if(this.searchData.areaList[q]["areaName"] == data["areaName"]){
              this.searchData.areaVal = this.searchData.areaList[q]["areaId"];
            }
          }
          //条目数据赋值
          var newData = {}, oldData = data["costDetailVoList"], ol = oldData.length;
          for(var i=0;i<ol;i++){
            var esign = oldData[i]["sign"];
            if(!newData[esign]){
              newData[esign] = [];
            }
          }
          for(var j=0;j<ol;j++){
            var esign = oldData[j]["sign"];
            newData[esign].push(oldData[j]);
          }
          //数据组装
          this.dropData.provincePause = [];
          this.dropData.provinceId = [];
          this.dropData.selectedProvince = [];

          this.dropData.courseTypePause = [];
          this.dropData.courseTypeId = [];
          this.dropData.selectedCourseTypeName = [];

          this.dropData.monTypePause = [];
          this.dropData.monTypeModel = [];
          this.dropData.penShow = [];
          this.dropData.selectSchoolModelDuo = [];
          this.dropData.linkManModel = [];
          this.ed = [];
          this.tableData = [];
          for(var o in newData){
            var oo = Number(o);         //添加num类型索引
            //省份是否可点赋值
            this.dropData.provincePause.push({"sp": false});
            //省份id
            this.dropData.provinceId.push({"id": newData[o][0]["provinceId"]});
            //省份name赋值
            this.dropData.selectedProvince.push({"name": newData[o][0]["provinceName"]});

            this.dropData.courseTypePause.push({"sp": false});
            this.dropData.courseTypeId.push({"id": newData[o][0]["courseType"]});
            this.dropData.selectedCourseTypeName.push({"name": this.courseTypeObj[newData[o][0]["courseType"]]});
            //额度类别是否显示
            this.dropData.monTypePause.push({"mp": false});
            //额度类别被选中的id列表
            this.dropData.monTypeModel.push([]);
            //小铅笔是否展示
            this.dropData.penShow.push({"ps": true});
            //差旅费可选多个学校
            this.dropData.selectSchoolModelDuo.push({"sm": []});
            //联系人
            this.dropData.linkManModel.push({"link": []});
            //额度，油费等
            this.ed.push({
              "sun": [{
                  shCheck: false,
                  startTime: '',
                  endTime: '',
                  glf: "0.00",
                  yf: "0.00",
                  errorTip: '',
                  popd: '',
                  popdK: '',
                  clvWord: ''
              }]
            });
            this.tableData.push({
                    sun: []  
                  });
            for(var e=0;e<newData[o].length;e++){
              //额度类别被选中的id子列表
              this.dropData.monTypeModel[oo].push(newData[o][e]["costTypeId"]);
              //差旅费可选多个子学校
              var schoolListName = [], schoolListId = [];
              if(newData[o][e]["costTypeId"] == 2){  //差旅费
                for(var s=0;s<newData[o][e]["costDetailCustomerVos"].length;s++){
                  schoolListId.push(newData[o][e]["costDetailCustomerVos"][s]["customerId"]);
                  schoolListName.push(newData[o][e]["costDetailCustomerVos"][s]["customerName"]);
                }
                //客户
                this.dropData.linkManModel[oo]["link"].push({"lk": ""});
                //ed赋值
                this.ed[oo]["sun"][e].startTime = newData[o][e]["costSubsidySatrtDateString"];
                this.ed[oo]["sun"][e].endTime = newData[o][e]["costSubsidyEndDateString"];
                this.ed[oo]["sun"][e].glf = newData[o][e]["costTollMoney"];
                this.ed[oo]["sun"][e].yf = newData[o][e]["costOilMoney"];
                this.ed[oo]["sun"][e].popd = e;
                this.ed[oo]["sun"][e].popdK = oo;

                var schList = this.dropData.schoolList;
                
                //tableData赋值
              this.tableData[oo]["sun"].push({
                        "c1": newData[o][e]["costTypeId"],
                        "c2": newData[o][e]["costTypeName"],
                        "c3": false,
                        "c4": this.dropData.selectSchoolModelDuo[oo]["sm"],
                        "c5": '',
                        "c6": false,
                        "c7": '',
                        "c8": '',
                        "c9": {"edval": newData[o][e]["quota"], edObj: this.ed[oo]},
                        "c10": newData[o][e]["quotaPurpose"],
                        "c11": newData[o][e]["target"],
                        "c12": newData[o][e]["cityId"],
                        "c13": schoolListName,
                        "c14": schoolListId
                      });
              }else{
                //客户
                this.dropData.linkManModel[oo]["link"].push({"lk": newData[o][e]["costDetailCustomerVos"][0]["customerContactsId"]});

                //tableData赋值
              this.tableData[oo]["sun"].push({
                        "c1": newData[o][e]["costTypeId"],
                        "c2": newData[o][e]["costTypeName"],
                        "c3": false,
                        "c4": newData[o][e]["costDetailCustomerVos"][0]["customerId"],
                        "c5": newData[o][e]["costDetailCustomerVos"][0]["customerName"],
                        "c6": false,
                        "c7": newData[o][e]["costDetailCustomerVos"][0]["customerContactsId"],
                        "c8": newData[o][e]["costDetailCustomerVos"][0]["contactsName"],
                        "c9": {"edval": newData[o][e]["quota"], edObj: {}},
                        "c10": newData[o][e]["quotaPurpose"],
                        "c11": newData[o][e]["target"],
                        "c12": newData[o][e]["cityId"],
                        "c13": [],
                        "c14": []
                      });
              }
            }
          }
        }.bind(this),
        error: function(){
          console.log("获取详情数据异常");
        }
      });
    },
    costJudgementTime: function(){
      $.ajax({
        url: this.path + "costJudgementTime",
        type: "post",
        dataType: "json",
        data: {},
        success: function(data){
          if(data["code"] == -1){  //不可提交
            this.$refs.childAlert.show("每个月25~31日才能提交申请，今日不能提交", function(){
              this.$router.push('/mainIndex/index');
            });
          }
        }.bind(this),
        error: function(){
          console.log("获取时间限制异常");
        }
      });
    },
    closeViewPop: function(){
      this.viewData.shCheck = true;
    },
    viewPersonApply: function(){           //预览个人统筹费用
      var isCanSub = true;
      //提交数据判断
      var yData = this.tableData, yl = yData.length;
      //验证省份
      var p = this.dropData.provinceId, pl = p.length;
      for(var i=0;i<pl;i++){
        if(!p[i]["id"]){
          this.$refs.childAlert.show("请选择第" + (i+1) + "个表格的省份");
          isCanSub = false;
          break;
        }
      }
      //验证课程类型
      var cou = this.dropData.courseTypeId, couL = cou.length;
      for(var co=0;co<couL;co++){
        if(!cou[co]["id"]){
          this.$refs.childAlert.show("请选择第" + (co+1) + "个表格的课程类型");
          isCanSub = false;
          break;
        }
      }
      if(!isCanSub){
        return false;
      }
      for(var j=0;j<yl;j++){
        var eveSun = yData[j]["sun"];
        for(var v=0;v<eveSun.length;v++){
          //验证额度类别
          if(!eveSun[v].c1){
            this.$refs.childAlert.show("请选择第" + (j+1) + "个表格的额度类别");
            isCanSub = false;
            break;
          }

          if(this.dropData.courseTypeId[j]["id"]!=1){
            //验证学校
            if(eveSun[v].c1 == 2){   //差旅费
              if(eveSun[v].c13.length==0){
                this.$refs.childAlert.show("请选择第" + (j+1) + "个表格的第"+(v+1)+"个学校数据");
                isCanSub = false;
                break;
              }
            }else{
              if(!eveSun[v].c5){
                this.$refs.childAlert.show("请选择第" + (j+1) + "个表格的第"+(v+1)+"个学校数据");
                isCanSub = false;
                break;
              }
            }
            //验证客户联系人
            if(eveSun[v].c1!=2 && !eveSun[v].c7){
              this.$refs.childAlert.show("请选择第" + (j+1) + "个表格的第"+(v+1)+"个客户数据");
              isCanSub = false;
              break;
            }
          }
          //验证额度
          if(eveSun[v].c9.edval == 0){
            this.$refs.childAlert.show("请输入第" + (j+1) + "个表格的第"+(v+1)+"个额度数据");
            isCanSub = false;
            break;
          }
          //验证额度用途
          if(!eveSun[v].c10){
            this.$refs.childAlert.show("请输入第" + (j+1) + "个表格的第"+(v+1)+"个额度用途数据");
            isCanSub = false;
            break;
          }
        }
        if(!isCanSub){
          break;
        }
      }
      if(!isCanSub){
        return false;
      }
      //预览区域赋值
      var aList = this.searchData.areaList, aId = this.searchData.areaVal;
      for(var a=0;a<aList.length;a++){
        if(aList[a]["areaId"] == aId){
          this.viewData.areaData = aList[a]["areaName"];
        }
      }
      //个人省份获取
      $.ajax({
        url: this.path + "findUserProvinceList",
        type: "get",
        dataType: "json",
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

      this.viewData.shCheck = false;
    },
    subPersonApply: function(){            //提交
      var isCanSub = true;
      //提交数据判断
      var yData = this.tableData, yl = yData.length;
      //验证省份
      var p = this.dropData.provinceId, pl = this.dropData.provinceId.length;
      for(var i=0;i<pl;i++){
        if(!p[i]["id"]){
          this.$refs.childAlert.show("请选择第" + (i+1) + "个表格的省份");
          isCanSub = false;
          break;
        }
      }
      //验证课程类型
      var cou = this.dropData.courseTypeId, couL = cou.length;
      for(var co=0;co<couL;co++){
        if(!cou[co]["id"]){
          this.$refs.childAlert.show("请选择第" + (co+1) + "个表格的课程类型");
          isCanSub = false;
          break;
        }
      }
      if(!isCanSub){
        return false;
      }
      for(var j=0;j<yl;j++){
        var eveSun = yData[j]["sun"];
        for(var v=0;v<eveSun.length;v++){
          //验证额度类别
          if(!eveSun[v].c1){
            this.$refs.childAlert.show("请选择第" + (j+1) + "个表格的额度类别");
            isCanSub = false;
            break;
          }

          if(this.dropData.courseTypeId[j]["id"]!=1){
            //验证学校
            if(eveSun[v].c1 == 2){   //差旅费
              if(eveSun[v].c13.length==0){
                this.$refs.childAlert.show("请选择第" + (j+1) + "个表格的第"+(v+1)+"个学校数据");
                isCanSub = false;
                break;
              }
            }else{
              if(!eveSun[v].c5){
                this.$refs.childAlert.show("请选择第" + (j+1) + "个表格的第"+(v+1)+"个学校数据");
                isCanSub = false;
                break;
              }
            }
            //验证客户联系人
            if(eveSun[v].c1!=2 && !eveSun[v].c7){
              this.$refs.childAlert.show("请选择第" + (j+1) + "个表格的第"+(v+1)+"个客户数据");
              isCanSub = false;
              break;
            }
          }
          
          //验证额度
          if(eveSun[v].c9.edval == 0){
            this.$refs.childAlert.show("请输入第" + (j+1) + "个表格的第"+(v+1)+"个额度数据");
            isCanSub = false;
            break;
          }
          //验证额度用途
          if(!eveSun[v].c10){
            this.$refs.childAlert.show("请输入第" + (j+1) + "个表格的第"+(v+1)+"个额度用途数据");
            isCanSub = false;
            break;
          }
        }
        if(!isCanSub){
          break;
        }
      }
      if(!isCanSub){
        return false;
      }

      //组装数据
      var subDetailString = "[";
      for(var s=0;s<yl;s++){
        var eveSub = yData[s]["sun"];
        for(var e=0;e<eveSub.length;e++){
          subDetailString += "{";

          subDetailString += "\"costTypeId\":\""+ eveSub[e]["c1"] +"\",";
          subDetailString += "\"areaId\":\""+ this.searchData.areaVal +"\",";
          subDetailString += "\"provinceId\":\""+ this.dropData.provinceId[s]["id"] +"\",";
          subDetailString += "\"courseType\":\""+ this.dropData.courseTypeId[s]["id"] +"\",";
          subDetailString += "\"cityId\":\""+ eveSub[e]["c12"] +"\",";
          subDetailString += "\"quota\":\""+ eveSub[e]["c9"]["edval"] +"\",";
          subDetailString += "\"quotaPurpose\":\""+ eveSub[e]["c10"] +"\",";
          subDetailString += "\"targe\":\""+ eveSub[e]["c11"] +"\",";
          if(eveSub[e]["c1"] == 2){   //差旅费会有过路费和油费
            subDetailString += "\"costOilMoney\":\""+ this.ed[s]["sun"][e]["yf"] +"\",";
            subDetailString += "\"costTollMoney\":\""+ this.ed[s]["sun"][e]["glf"] +"\",";
            subDetailString += "\"costSubsidySatrtDateString\":\""+ this.ed[s]["sun"][e]["startTime"] +"\",";
            subDetailString += "\"costSubsidyEndDateString\":\""+ this.ed[s]["sun"][e]["endTime"] +"\",";

            
            subDetailString += "\"customerList\":";
            subDetailString += "[";
            for(var v=0;v<eveSub[e]["c14"].length;v++){
              subDetailString += "{";
              subDetailString += "\"customerId\":\""+ eveSub[e]["c14"][v] +"\"";
              subDetailString += "}";
              if(v!=(eveSub[e]["c14"].length-1)){
                subDetailString += ",";
              }
            }
            subDetailString += "],";
          }else{
            subDetailString += "\"customerList\":";
            subDetailString += "[{";
            subDetailString += "\"customerId\":\""+ eveSub[e]["c4"] +"\",";
            subDetailString += "\"customerContactsId\":\""+ eveSub[e]["c7"] +"\"";
            subDetailString += "}],";
          }
          subDetailString += "\"sign\":\""+ s +"\"";
          subDetailString += "}";

          if(s==(yl-1)){       //最后一个大的
            if(e != (eveSub.length-1)){
              subDetailString += ",";
            }
          }else{
            subDetailString += ",";
          }
        }
      }
      subDetailString += "]";

      var subApplyData = {};
      if(this.costId){                     //重新提交
        subApplyData = {
          "jobNumber": localStorage.getItem("jobNumber"),
          "sessionIdOa": localStorage.getItem("sessionIdOa"),
          "spendtime": this.searchData.searchDateVal+"-01",
          "money": this.subMoney,
          "detail": subDetailString,
          "costId": this.costId
        }
      }else{
        subApplyData = {
          "jobNumber": localStorage.getItem("jobNumber"),
          "sessionIdOa": localStorage.getItem("sessionIdOa"),
          "spendtime": this.searchData.searchDateVal+"-01",
          "money": this.subMoney,
          "detail": subDetailString
        }
      }

      //防止重复提交
      if(!this.subPause){
        return false;
      }
      this.subPause = false;

      $.ajax({
        url: this.path + "insertPersonalOverallPlanningCourse",
        type: "post",
        dataType: "json",
        data: subApplyData,
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
          }else{
            this.$refs.childAlert.show(data["msg"]);
            this.subPause = true;
          }
        }.bind(this),
        error: function(){
          this.subPause = true;
          console.log("个人统筹费用请求异常");
        }.bind(this)
      });
    },
    removeTableData: function(k){          //移除一个省数据
      this.tableData.splice(k, 1);
      this.dropData.provincePause.splice(k, 1);
      this.dropData.provinceId.splice(k, 1);
      this.dropData.selectedProvince.splice(k, 1);

      this.dropData.courseTypePause.splice(k, 1);
      this.dropData.courseTypeId.splice(k, 1);
      this.dropData.selectedCourseTypeName.splice(k, 1);

      this.dropData.monTypePause.splice(k, 1);
      this.dropData.monTypeModel.splice(k, 1);
      this.dropData.penShow.splice(k, 1);
      //this.dropData.selectSchoolModel.push({"sm": [{"sg":''}]});
      this.dropData.selectSchoolModelDuo.splice(k, 1);
      this.dropData.linkManModel.splice(k, 1);
      this.ed.splice(k, 1);

      //金额删减
      this.countMoney();
    },
    addNewTableData: function(){          //新增一个省数据

      this.tableData.push({
        "sun": [
                {
                  "c1": '',
                  "c2": '',
                  "c3": false,
                  "c4": '',
                  "c5": '',
                  "c6": false,
                  "c7": '',
                  "c8": '',
                  "c9": {"edval": "0.00", edObj: {}},
                  "c10": '',
                  "c11": '',
                  "c12": 0,
                  "c13": [],
                  "c14": []
                }
              ]
      });
      this.dropData.provincePause.push({"sp":false});
      this.dropData.provinceId.push({"id": ''});
      this.dropData.selectedProvince.push({"name": ''});

      this.dropData.courseTypePause.push({"sp":false});
      this.dropData.courseTypeId.push({"id": ''});
      this.dropData.selectedCourseTypeName.push({"name": ''});

      this.dropData.monTypePause.push({"mp": false});
      this.dropData.monTypeModel.push([]);
      this.dropData.penShow.push({"ps": false});
      //this.dropData.selectSchoolModel.push({"sm": [{"sg":''}]});
      this.dropData.selectSchoolModelDuo.push({"sm": []});
      this.dropData.linkManModel.push({"link": [{"lk": ''}]});

      this.ed.push({
        "sun": [{
          shCheck: false,
          startTime: '',
          endTime: '',
          glf: "0.00",
          yf: "0.00",
          errorTip: '',
          popd: '',
          popdK: '',
          clvWord: ''
        }]
      });
    },
    closeCLF: function(i, k){
      this.ed[k]["sun"][i].errorTip = "";
      this.ed[k]["sun"][i].shCheck = false;

      //如果关闭，把暂存的值再放回来
      this.ed[k]["sun"][i]["startTime"] = this.tempCLF.startTime;
      this.ed[k]["sun"][i]["endTime"] = this.tempCLF.endTime;
      this.ed[k]["sun"][i]["glf"] = this.tempCLF.glf;
      this.ed[k]["sun"][i]["yf"] = this.tempCLF.yf;
    },
    countEduFee: function(i, k){
      if(!this.ed[k]["sun"][i].startTime){
        this.ed[k]["sun"][i].errorTip = "请选择开始时间";
        return false;
      }
      if(!this.ed[k]["sun"][i].endTime){
        this.ed[k]["sun"][i].errorTip = "请选择结束时间";
        return false;
      }
      var st = this.ed[k]["sun"][i].startTime, et = this.ed[k]["sun"][i].endTime;
      st = st.split("-").join(""), et = et.split("-").join("");
      st = Number(st), et = Number(et);
      if(st > et){
        this.ed[k]["sun"][i].errorTip = "开始时间不能大于结束时间";
        return false;
      }
      if(Number(this.ed[k]["sun"][i].glf)<=0){
        this.ed[k]["sun"][i].errorTip = "请输入过路费";
        return false;
      }
      if(Number(this.ed[k]["sun"][i].yf)<=0){
        this.ed[k]["sun"][i].errorTip = "请输入油费";
        return false;
      }
      this.ed[k]["sun"][i].errorTip = "";

      this.ed[k]["sun"][i].shCheck = false;
      //计算出差几天,出差补助计算
      var stTime = new Date(this.ed[k]["sun"][i].startTime).getTime(), etTime = new Date(this.ed[k]["sun"][i].endTime).getTime();
      var days = ((etTime - stTime)/(1000*60*60*24));
      days += 1; //计算天数要加1
      //赋值
      var fuI = this.ed[k]["sun"][i].popd;
      var fuK = this.ed[k]["sun"][i].popdK;
      this.tableData[fuK]["sun"][fuI].c9.edval = Number(this.ed[k]["sun"][i].glf) + Number(this.ed[k]["sun"][i].yf) + days*this.ccbz;
      this.tableData[fuK]["sun"][fuI].c9.edObj = this.ed[k]["sun"][i];

      this.countMoney();
    },
    glfKeyup: function(i, k){
      var reg = /(^[0-9]*$)|(^[0-9]*[\.]{1}[0-9]{1,2}$)/;
      var edvalNum = 0;
      if(!reg.test(this.ed[k]["sun"][i].glf)){
        if(!isNaN(this.ed[k]["sun"][i].glf) && this.ed[k]["sun"][i].glf.indexOf(".")!=-1 && this.ed[k]["sun"][i].glf.split(".")[1].length>2){
          edvalNum = this.ed[i].glf.split(".")[0] + "." + this.ed[i].glf.split(".")[1].substring(0, 2);
          this.ed[k]["sun"][i].glf = Number(edvalNum).toFixed(2);
          if(this.ed[k]["sun"][i].errorTip.indexOf("过路费")!=-1){
            this.ed[k]["sun"][i].errorTip = "";
          }
        }else{
          this.ed[k]["sun"][i].glf = "0.00";
        }
      }else{
        if(this.ed[k]["sun"][i].glf){
          this.ed[k]["sun"][i].glf = Number(this.ed[k]["sun"][i].glf).toFixed(2);
          if(this.ed[k]["sun"][i].errorTip.indexOf("过路费")!=-1){
            this.ed[k]["sun"][i].errorTip = "";
          }
        }else{
          this.ed[k]["sun"][i].glf = "0.00";
        }
      }
      this.countCLFWordMoney(i, k);
    },
    yfKeyup: function(i, k){
      var reg = /(^[0-9]*$)|(^[0-9]*[\.]{1}[0-9]{1,2}$)/;
      var edvalNum = 0;
      if(!reg.test(this.ed[k]["sun"][i].yf)){
        if(!isNaN(this.ed[k]["sun"][i].yf) && this.ed[k]["sun"][i].yf.indexOf(".")!=-1 && this.ed[k]["sun"][i].yf.split(".")[1].length>2){
          edvalNum = this.ed[k]["sun"][i].yf.split(".")[0] + "." + this.ed[k]["sun"][i].yf.split(".")[1].substring(0, 2);
          this.ed[k]["sun"][i].yf = Number(edvalNum).toFixed(2);
          if(this.ed[k]["sun"][i].errorTip.indexOf("油费")!=-1){
            this.ed[k]["sun"][i].errorTip = "";
          }
        }else{
          this.ed[k]["sun"][i].yf = "0.00";
        }
      }else{
        if(this.ed[k]["sun"][i].yf){
          this.ed[k]["sun"][i].yf = Number(this.ed[k]["sun"][i].yf).toFixed(2);
          if(this.ed[k]["sun"][i].errorTip.indexOf("油费")!=-1){
            this.ed[k]["sun"][i].errorTip = "";
          }
        }else{
          this.ed[k]["sun"][i].yf = "0.00";
        }
      }

      this.countCLFWordMoney(i, k);
    },
    countCLFWordMoney: function(i, k){
      if(this.ed[k]["sun"][i]["startTime"] && this.ed[k]["sun"][i].errorTip.indexOf("开始时间")){
        this.ed[k]["sun"][i].errorTip = "";
      }
      if(this.ed[k]["sun"][i]["endTime"] && this.ed[k]["sun"][i].errorTip.indexOf("结束时间")){
        this.ed[k]["sun"][i].errorTip = "";
      }

      if(this.ed[k]["sun"][i]["startTime"] && this.ed[k]["sun"][i]["endTime"] && Number(this.ed[k]["sun"][i]["glf"])>0 && Number(this.ed[k]["sun"][i]["yf"])>0){
        //计算出差几天,出差补助计算
        var stTime = new Date(this.ed[k]["sun"][i].startTime).getTime(), etTime = new Date(this.ed[k]["sun"][i].endTime).getTime();
        var days = ((etTime - stTime)/(1000*60*60*24));
        days += 1; //计算天数要加1
        //赋值
        var bzAllNum = (Number(this.ed[k]["sun"][i].glf) + Number(this.ed[k]["sun"][i].yf) + days*this.ccbz).toFixed(2); 
               
        this.ed[k]["sun"][i]["clvWord"] = "出差补助"+days+"*350="+((350*days).toFixed(2))+"元，共计"+bzAllNum+"元";
      }else{
        this.ed[k]["sun"][i]["clvWord"] = "";
      }
    },
    spanChailv: function(i, k){
      this.ed[k]["sun"][i].shCheck = true;
      this.ed[k]["sun"][i].popd = i;
      this.ed[k]["sun"][i].popdK = k;

      this.countCLFWordMoney(i, k);
      //把差旅费上的值先都暂存起来
      this.tempCLF.startTime = this.ed[k]["sun"][i]["startTime"];     
      this.tempCLF.endTime = this.ed[k]["sun"][i]["endTime"];     
      this.tempCLF.glf = this.ed[k]["sun"][i]["glf"];     
      this.tempCLF.yf = this.ed[k]["sun"][i]["yf"];     
    },
    valiEdu: function(t){
      var reg = /(^[0-9]*$)|(^[0-9]*[\.]{1}[0-9]{1,2}$)/;
      var edvalNum = 0;
      if(!reg.test(t.c9.edval)){
        if(!isNaN(t.c9.edval) && t.c9.edval.indexOf(".")!=-1 && t.c9.edval.split(".")[1].length>2){
          edvalNum = t.c9.edval.split(".")[0] + "." + t.c9.edval.split(".")[1].substring(0, 2);
          t.c9.edval = Number(edvalNum).toFixed(2);
        }else{
          t.c9.edval = "0.00";
        }
      }else{
        if(t.c9.edval){
          t.c9.edval = Number(t.c9.edval).toFixed(2);
        }else{
          t.c9.edval = "0.00";
        }
      }
      this.countMoney();
    },
    spanShowSchool: function(i, k){
      //先把其他学校弹框关闭
      for(var c=0;c<this.tableData.length;c++){
        for(var r=0;r<this.tableData[c]["sun"].length;r++){
          this.tableData[c]["sun"][r]["c3"] = false;
        }
      }

      this.tableData[k]["sun"][i]["c3"] = true;
      //根据省份获取城市
      this.dropData.cityList = this.OACommon.findCitiesList(this.dropData.provinceId[k]["id"]);
      this.dropData.cityId = 0;

      //console.log(this.tableData[k]["sun"][i]["c12"]);
      if(this.tableData[k]["sun"][i]["c12"]){
        this.getSchoolList(k, i);
      }
    },
    spanLinkMan: function(i, k){
      //根据学校获取学校联系人
      var schId = this.tableData[k]["sun"][i]["c4"];
      $.ajax({
        url: this.path + "findCustomerContactsAllByCustomerId",
        type: "post",
        dataType: "json",
        data: {"customerId": schId},
        success: function(data){
          data = data["data"];
          if(data.length > 0){
            this.dropData.linkManList = data;
          }else{
            this.dropData.linkManList = [{"customerContactsId": "", "contactsName": "暂无联系人"}];
          }

          this.tableData[k]["sun"][i]["c6"] = true;
        }.bind(this),
        error: function(){
          console.log("获取联系人异常");
        }
      });
    },
    getSchoolList: function(k, i){             //根据选取城市获取学校
      var cityId = this.tableData[k]["sun"][i]["c12"];
      $.ajax({
        url: this.path + "findAllCustomerBycitiesId",
        type: "post",
        dataType: "json",
        data: {"citiesId": cityId},
        success: function(data){
          data = data["data"];
          if(data.length == 0){
            this.dropData.schoolList = [{"customerId":'', "customerName":"暂无学校"}];
          }else{
            this.dropData.schoolList = data;
          }
        }.bind(this),
        error: function(){
          console.log("获取学校请求异常");
        }
      });
    },
    pushCustId: function(id, name, i, k){
      var schoolName = this.tableData[k]["sun"][i].c13, schoolId = this.tableData[k]["sun"][i].c14;
      if(schoolName.indexOf(name)==-1){
        this.tableData[k]["sun"][i].c13.push(name);
      }else{
        this.tableData[k]["sun"][i].c13.splice(schoolName.indexOf(name), 1);
      }

      if(schoolId.indexOf(id)==-1){
        this.tableData[k]["sun"][i].c14.push(id);
      }else{
        this.tableData[k]["sun"][i].c14.splice(schoolId.indexOf(id), 1);
      }
    },
    fuSchoolVal: function(i, k){
      if(this.tableData[k]["sun"][i].c1 != 2){
        var schList = this.dropData.schoolList;
        for(var j=0;j<schList.length;j++){
          if(schList[j]["customerId"] == this.tableData[k]["sun"][i].c4){
            //如果学校做了改动，对应客户要清空
            if(this.tableData[k]["sun"][i].c5 != schList[j]["customerName"]){
              this.tableData[k]["sun"][i].c7 = "";
              this.tableData[k]["sun"][i].c8 = "";
            }
            this.tableData[k]["sun"][i].c5 = schList[j]["customerName"];
            break;
          }
        }


      }
      this.tableData[k]["sun"][i].c3 = false;
      this.dropData.cityList = [];
      this.dropData.schoolList = [];
    },
    fuLinkMan: function(i, k){          //为选取的联系人赋值
      //this.tableData[k]["sun"][i].c7 = this.dropData.linkManModel[k]["link"][i]["lk"];
      
      var linkMan = this.tableData[k]["sun"][i].c7;
      var linkList = this.dropData.linkManList;
      if(linkMan != ''){
        for(var j=0;j<linkList.length;j++){
          if(linkList[j]["customerContactsId"] == linkMan){
            this.tableData[k]["sun"][i].c8 = linkList[j]["contactsName"];
          }
        }
      }

      this.tableData[k]["sun"][i].c6 = false;
    },
    getSelectCostType: function(){
      this.dropData.monTypeList = this.OACommon.selectCostType("selectCostTypeCourse");
    },
    setSearchData: function(){
      var date = new Date();
      var year = date.getFullYear(), month = (date.getMonth()+1);
      var searchDate = [];
      searchDate.push(year + "-" + ((month<10)?("0"+month):month));
      if(month == 12){
        searchDate.push((year+1) + "-01");
      }else{
        month += 1;
        searchDate.push(year + "-" + ((month<10)?("0"+month):month));
      }
      this.searchData.searchDate = searchDate;
      this.searchData.searchDateVal = searchDate[0];
      //区域
      var areaList = this.OACommon.findAreaByCondition();
      areaList.shift();
      this.searchData.areaList = areaList;
      this.searchData.areaVal = areaList[0]["areaId"];
    },
    getProvinceList: function(){
      $.ajax({
        url: this.path + "findProvinceListByProvince",
        type: "get",
        dataType: "json",
        data: {
          "jobNumber": localStorage.getItem("jobNumber"),
          "sessionIdOa": localStorage.getItem("sessionIdOa"),
          "areaId": this.searchData.areaVal         
        },
        success: function(data){
          this.dropData.provinceList = data["data"];
        }.bind(this),
        error: function(){
          console.log("查询个人省份异常");
        }
      });
    },
    showProList: function(k){
      if(this.dropData.monTypeModel[k].length == 0){   //表示额度类型操作过，不能再换省份了
        this.dropData.provincePause[k].sp = true;
      }
    },
    hideProList: function(k){
      this.dropData.provincePause[k].sp = false;
    },
    showMonTypeList: function(k){
      //选中了省份才能选额度类别
      if(this.dropData.selectedProvince[k].name != ''){            
        this.dropData.monTypePause[k].mp = true;
      }
    },
    hideMonTypeList: function(k){
      this.dropData.monTypeModel[k] = this.dropData.monTypeModel[k].concat(this.eveMonTypeIdArr);
      //this.eveMonTypeIdArr = [];

      this.dropData.monTypePause[k].mp = false;
      //给 tableData 填充数据
      var typeList = this.dropData.monTypeList;

      if(this.dropData.monTypeModel[k].length > 0){
        var moneyTypeArr = this.dropData.monTypeModel[k];
        if(!this.tableData[k]["sun"][0]["c1"]){   //未选取过，第一次添加
          this.tableData[k]["sun"] = [];
          for(var i=0;i<moneyTypeArr.length;i++){
            this.tableData[k]["sun"].push({
                  "c1": moneyTypeArr[i],
                  "c2": getMoneyType(moneyTypeArr[i]),
                  "c3": false,
                  "c4": '',
                  "c5": '',
                  "c6": false,
                  "c7": '',
                  "c8": '',
                  "c9": {"edval": "0.00", edObj: {}},
                  "c10": '',
                  "c11": '',
                  "c12": 0,
                  "c13": [],
                  "c14": []
                });

            if(moneyTypeArr[i] == 2){
              this.ed[k]["sun"].push({
                  shCheck: false,
                  startTime: '',
                  endTime: '',
                  glf: "0.00",
                  yf: "0.00",
                  errorTip: '',
                  popd: '',
                  popdK: '',
                  clvWord: ''
                });
            }
          }
        }else{                               //选取过，进行修改
          for(var j=0;j<this.eveMonTypeIdArr.length;j++){
            this.tableData[k]["sun"].push({
                "c1": this.eveMonTypeIdArr[j],
                "c2": getMoneyType(this.eveMonTypeIdArr[j]),
                "c3": false,
                "c4": '',
                "c5": '',
                "c6": false,
                "c7": '',
                "c8": '',
                "c9": {"edval": "0.00", edObj: {}},
                "c10": '',
                "c11": '',
                "c12": 0,
                "c13": [],
                "c14": []
              });

            if(moneyTypeArr[i] == 2){
              this.ed[k]["sun"].push({
                  shCheck: false,
                  startTime: '',
                  endTime: '',
                  glf: "0.00",
                  yf: "0.00",
                  errorTip: '',
                  popd: '',
                  popdK: '',
                  clvWord: ''
                });
            }
          }
          /*var newTableData = {}, td = this.tableData[k]["sun"];
          for(var t=0;t<td.length;t++){
            var c1 = td[t]["c1"];
            if(!newTableData[c1]){
              newTableData[c1] = td[t];
            }
          }*/

          //将剩余的值再放入tableData
          /*this.tableData[k]["sun"] = [];
          for(var m=0;m<moneyTypeArr.length;m++){
            var eveData = moneyTypeArr[m];
            this.tableData[k]["sun"].push(newTableData[eveData]);
          }*/
        }
        this.dropData.penShow[k].ps = true;
      }else{
        this.tableData[k].sun = [{
            "c1": '',
            "c2": '',
            "c3": false,
            "c4": '',
            "c5": '',
            "c6": false,
            "c7": '',
            "c8": '',
            "c9": {"edval": "0.00", edObj: {}},
            "c10": '',
            "c11": '',
            "c12": 0,
            "c13": [],
            "c14": []
        }];

        this.dropData.penShow[k].ps = false;
      }

      //将每次添加的额度类别清空
      this.eveMonTypeIdArr = [];

      //通过费用类型id返回类型名称
      function getMoneyType(id){
        var typeName = '';
        for(var i=0;i<typeList.length;i++){
          if(typeList[i]["costTypeId"] == id){
            typeName = typeList[i]["costTypeName"];
            break;
          }
        }
        return typeName;
      }
    },
    setSecProvinceId: function(k, pid, province){
      this.dropData.provinceId[k] = [];
      this.dropData.selectedProvince[k] = [];
      this.dropData.provinceId[k] ={"id": pid};
      this.dropData.selectedProvince[k] = {"name": province};
      this.dropData.provincePause[k].sp = false;
    },
    countMoney: function(){
      var money = 0;
      var yData = this.tableData, yl = yData.length;
      for(var j=0;j<yl;j++){
        var eveSun = yData[j]["sun"];
        for(var v=0;v<eveSun.length;v++){
          //console.log(eveSun[v]["c9"]);
          money += Number(eveSun[v]["c9"]["edval"]);
        }
      }
      this.subMoney = money.toFixed(2);
    }
  }
}
</script>
<style>

  
</style>

