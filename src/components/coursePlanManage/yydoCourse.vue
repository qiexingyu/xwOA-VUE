<template>
  <div class="hello">
      <div class="gonggao_bread">
        <a href="#/mainIndex/index" class="fa">首页</a>
        &gt;
        <span>排课管理</span>
        &gt;
        <span>课程安排</span>
      </div>
      
      <div class="gonggao_body">
        <div class="money_table" v-for="(v, k) in appData">
          <table cellpadding="0" cellspacing="0" border="1">
            <thead>
              <tr>
                <td width="10%" align="center" style="cursor:pointer;" v-on:mouseenter="showProvinceList(k)" v-on:mouseleave="hideProvinceList(k)">
                  省份<Icon type="chevron-down" style="margin-left:3px;"></Icon>
                  <ul class="person_ul" v-if="v.provinceShow" style="width:200%;">
                    <li v-for="p in province" v-bind:pid="p.provinceId" v-on:click="fuProvince(k, p.provinceId, p.province)">{{ p.province }}</li>
                  </ul>
                </td>
                <td width="34%" style="cursor:pointer;" v-on:click="showSchoolPanel(k)">
                  学校<Icon type="chevron-down" style="margin-left:3px;"></Icon>
                  <ul class="person_ul edu" style="width:100%;" v-if="v.schoolPanelShow">
                    <li style="text-align:center;">
                      <select v-model="v.cityId" v-on:change="cityChange(k)" style="width:80%;">
                        <option v-for="c in v.city" v-bind:value="c.cityId">{{ c.cityName }}</option>
                      </select>
                    </li>
                    <li v-for="(s, s1) in v.schoolArr" v-on:click.stop="fuSchoolVal(k, s.customerId, s.customerName)" style="text-align:center;">{{ s.customerName }}</li>
                  </ul>
                </td>
                <td width="9%" v-on:mouseenter="showSubject(k)" v-on:mouseleave="hideSubject(k)">
                  科目<Icon type="chevron-down" style="margin-left:3px;"></Icon>
                  <ul class="person_ul" v-if="v.subjectShow">
                    <li v-for="s in subject" v-on:click="fuSubject(k, s.subjectId, s.subjectName)">{{ s.subjectName }}</li>
                  </ul>
                </td>
                <td width="9%" v-on:mouseenter="showGrade(k)" v-on:mouseleave="hideGrade(k)">
                  年级<Icon type="chevron-down" style="margin-left:3px;"></Icon>
                  <ul class="person_ul" v-if="v.gradeShow">
                    <li v-for="g in grade" v-on:click="fuGrade(k, g)">{{ g }}</li>
                  </ul>
                </td>
                <td width="11%">上课日期</td>
                <td width="9%" v-on:mouseenter="showSchool(k)" v-on:mouseleave="hideSchool(k)">
                  老师<Icon type="chevron-down" style="margin-left:3px;"></Icon>
                  <ul class="person_ul" v-if="v.teacherShow">
                    <li v-for="t in v.teacherArr" v-on:click="fuTeacher(k, t.teacherId, t.teacherName, t.oneHourMoney)">{{ t.teacherName }}</li>
                  </ul>
                </td>
                <td width="9%">小时</td>
                <td width="9%">老师课时费</td>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td align="center">{{ v.provinceName }}</td>
                <td>
                  <span v-if="v.keTypeId==2">{{ v.schoolName }}</span>
                  <input type="text" placeholder="请输入上课地点" v-if="v.keTypeId==1" v-model="v.keAddress" style="width:60%;"/>
                  <span class="cgkbtn" v-on:click="keTypeChange(k)">{{ v.keTypeWord }}</span>
                </td>
                <td>{{ v.subjectName }}</td>
                <td>{{ v.gradeId }}</td>
                <td class="yydo140">
                  <el-date-picker
                    v-model="v.keDate"
                    type="date"
                    format="yyyy-MM-dd"
                    value-format="yyyy-MM-dd"
                    :picker-options="pickerOptions"
                    @change="keDateChange(k)"
                    placeholder="选择日期">
                  </el-date-picker>
                </td>
                <td>{{ v.teacherName }}</td>
                <td>
                  <select v-if="v.teacherId" style="width:80px;" v-on:change="countMoney(k)" v-model="v.hour">
                    <option v-for="h in hourArr" v-bind:value="h">{{ h }}</option>
                  </select>
                </td>
                <td>{{ v.conuntMoney }}</td>
              </tr>
            </tbody>
          </table>

          <div style="text-align:right;margin-top:10px;">
            <span class="btn-yellow-s" v-if="(appData.length>1) && k!=0" v-on:click="removeTableData(k)">删除</span>
            <span class="btn-blue-s" v-if="k==(appData.length-1)" v-on:click="addNewData">新增</span>
          </div>

        </div>

        <div class="fbtong_btn_div" style="padding-bottom:30px;">
          <span class="btn-blue" v-on:click="subPersonApply">提交</span>
        </div>
      </div>

      <oa-alert ref="childAlert"></oa-alert>
  </div>
</template>

<script>
import $ from 'jquery'
import oaAlert from '@/components/commonVue/Alert'

export default {
  name: 'teacher',
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
      province: [],
      subject: [],
      grade: [],
      hourArr: [1, 2, 3, 4, 5, 6, 7, 8, 9],
      appData: [
        {
          provinceName: '',
          provinceId: '',
          provinceShow: false,
          keTypeWord: '转为常规课',
          keTypeId: 2,
          schoolPanelShow: false,
          city: [],
          cityId: 0,
          schoolArr: [],
          schoolName: '',
          schoolId: '',
          keAddress: '',
          subjectShow: false,
          subjectId: '',
          subjectName: '',
          gradeShow: false,
          gradeId: '',
          keDate: '',
          teacherShow: false,
          teacherArr: [],
          teacherId: '',
          teacherName: '',
          teacherMoneyhour: '',
          hour: 1,
          conuntMoney: ''
        }
      ],
      subPause: true             //防止重复提交
    }  
  },
  created: function () {
    this.getUserProvince();
    this.getSubject();
    this.getGrade();
  },
  methods: {
    keDateChange: function(k){
      if(this.appData[k]["teacherId"]){   //如果已经选取了老师
        //判断某个时间段老师有课就不能选
        //先进行前台验证，批量添加不能重复
        var comparePause = true;
        var oneTeaId = this.appData[k]["teacherId"], oneDate = this.appData[k]["keDate"];
        if(this.appData.length>1){
          var newAppData = [];
          for(var a=0;a<this.appData.length;a++){
            newAppData.push(this.appData[a]);
          }
          newAppData.splice(k, 1);
          for(var i=0;i<newAppData.length;i++){
            if(newAppData[i]["teacherId"]==oneTeaId && newAppData[i]["keDate"]==oneDate){
              this.$refs.childAlert.show("该时间段这个老师有课");
              this.appData[k]["keDate"] = "";
              comparePause = false;
              break;
            }
          }
        }
        
        if(!comparePause){
          return false;
        }
        //判断某个时间段老师有课就不能选
        $.ajax({
          url: this.path + "findIsHavingLessonByLearnDateAndTeacherId",
          type: "post",
          dataType: "json",
          data: {
            "jobNumber": localStorage.getItem("jobNumber"),
            "sessionIdOa": localStorage.getItem("sessionIdOa"),
            "learnDate": this.appData[k]["keDate"],
            "teacherId": this.appData[k]["teacherId"]
          },
          success: function(data){
            if(data["msg"] && data["msg"]=="该老师有课"){
              this.$refs.childAlert.show("该时间段这个老师有课");
              this.appData[k]["keDate"] = "";
            }
          }.bind(this),
          error: function(){
            console.log("查询老师是否有课异常");
          }
        });        
      }      
    },
    addNewData: function(){
      var addData = this.appData[0];   //第一条数据
      var endData = {};                //要新增的数据
      for(var key in addData){
        endData[key] = addData[key];
      }
      endData["keDate"] = "";
      endData["teacherArr"] = [];
      endData["teacherId"] = "";
      endData["teacherName"] = "";
      endData["hour"] = 1;
      endData["conuntMoney"] = "";
      
      this.appData.push(endData);
    },
    removeTableData: function(k){
      this.appData.splice(k, 1);
    },
    subPersonApply: function(){     //提交数据
      var isSub = true;
      for(var i=0;i<this.appData.length;i++){
        if(!this.appData[i]["provinceId"]){
          this.$refs.childAlert.show("请选择第"+(i+1)+"个表格的省份");
          isSub = false;
          break;
        }

        if(this.appData[i]["keTypeId"] == 2){  //合作课
          if(!this.appData[i]["schoolId"]){
            this.$refs.childAlert.show("请选择第"+(i+1)+"个表格的学校");
            isSub = false;
            break;
          }
        }else if(this.appData[i]["keTypeId"] == 1){  //常规课
          if(!this.appData[i]["keAddress"]){
            this.$refs.childAlert.show("请输入第"+(i+1)+"个表格的上课地点");
            isSub = false;
            break;
          }
        }

        if(!this.appData[i]["subjectId"]){
          this.$refs.childAlert.show("请选择第"+(i+1)+"个表格的课目");
          isSub = false;
          break;
        }

        if(!this.appData[i]["gradeId"]){
          this.$refs.childAlert.show("请选择第"+(i+1)+"个表格的年级");
          isSub = false;
          break;
        }

        if(!this.appData[i]["keDate"]){
          this.$refs.childAlert.show("请选择第"+(i+1)+"个表格的上课日期");
          isSub = false;
          break;
        }

        if(!this.appData[i]["teacherId"]){
          this.$refs.childAlert.show("请选择第"+(i+1)+"个表格的老师");
          isSub = false;
          break;
        }
      }
      if(!isSub){
        return false;
      }

      //数据按照课程类型组合
      var courseScheduleListOneArr = [];      //常规课
      var courseScheduleListTwoArr = [];      //合作课
      for(var j=0;j<this.appData.length;j++){
        if(this.appData[j]["keTypeId"] == 1){
          courseScheduleListOneArr.push(this.appData[j]);
        }else{
          courseScheduleListTwoArr.push(this.appData[j]);
        }
      }

      var courseScheduleListOne = "";
      if(courseScheduleListOneArr.length>0){
        courseScheduleListOne += "[";
        for(var o=0;o<courseScheduleListOneArr.length;o++){
          courseScheduleListOne += "{";
          courseScheduleListOne += "\"provinceId\":\""+ courseScheduleListOneArr[o]["provinceId"] +"\",";
          courseScheduleListOne += "\"courseTypeId\":\"1\",";
          courseScheduleListOne += "\"learnLocation\":\""+ courseScheduleListOneArr[o]["keAddress"] +"\",";
          courseScheduleListOne += "\"subjectId\":\""+ courseScheduleListOneArr[o]["subjectId"] +"\",";
          courseScheduleListOne += "\"grade\":\""+ courseScheduleListOneArr[o]["gradeId"] +"\",";
          courseScheduleListOne += "\"learnDate\":\""+ courseScheduleListOneArr[o]["keDate"] +"\",";
          courseScheduleListOne += "\"teacherId\":\""+ courseScheduleListOneArr[o]["teacherId"] +"\",";
          courseScheduleListOne += "\"courseHour\":\""+ courseScheduleListOneArr[o]["hour"] +"\",";
          courseScheduleListOne += "\"courseTeacherMoney\":\""+ courseScheduleListOneArr[o]["conuntMoney"] +"\"";
          courseScheduleListOne += "}";
          if(o != courseScheduleListOneArr.length-1){
            courseScheduleListOne += ",";
          }
        }
        courseScheduleListOne += "]";
      }

      var courseScheduleListTwo = "";
      if(courseScheduleListTwoArr.length>0){
        courseScheduleListTwo += "[";
        for(var o=0;o<courseScheduleListTwoArr.length;o++){
          courseScheduleListTwo += "{";
          courseScheduleListTwo += "\"provinceId\":\""+ courseScheduleListTwoArr[o]["provinceId"] +"\",";
          courseScheduleListTwo += "\"courseTypeId\":\"2\",";
          courseScheduleListTwo += "\"schoolId\":\""+ courseScheduleListTwoArr[o]["schoolId"] +"\",";
          courseScheduleListTwo += "\"subjectId\":\""+ courseScheduleListTwoArr[o]["subjectId"] +"\",";
          courseScheduleListTwo += "\"grade\":\""+ courseScheduleListTwoArr[o]["gradeId"] +"\",";
          courseScheduleListTwo += "\"learnDate\":\""+ courseScheduleListTwoArr[o]["keDate"] +"\",";
          courseScheduleListTwo += "\"teacherId\":\""+ courseScheduleListTwoArr[o]["teacherId"] +"\",";
          courseScheduleListTwo += "\"courseHour\":\""+ courseScheduleListTwoArr[o]["hour"] +"\",";
          courseScheduleListTwo += "\"courseTeacherMoney\":\""+ courseScheduleListTwoArr[o]["conuntMoney"] +"\"";
          courseScheduleListTwo += "}";
          if(o != courseScheduleListTwoArr.length-1){
            courseScheduleListTwo += ",";
          }
        }
        courseScheduleListTwo += "]";
      }

      if(!this.subPause){
        return false;
      }      
      this.subPause = false;

      $.ajax({
        url: this.path + "insertBatchCourseSchedule",
        type: "post",
        dataType: "json",
        data: {
          "jobNumber": localStorage.getItem("jobNumber"),
          "sessionIdOa": localStorage.getItem("sessionIdOa"),
          "courseScheduleListOne": courseScheduleListOne,
          "courseScheduleListTwo": courseScheduleListTwo
        },
        success: function(data){
          if(data["code"] == 200){
            this.$refs.childAlert.show("提交成功", function(){
              this.$router.push('/mainIndex/coursePlanManage/yydoCourseSearch');
            });
          }else{
            this.subPause = true;
            this.$refs.childAlert.show(data["msg"]);
          }
        }.bind(this),
        error: function(){
          this.subPause = true;
          console.log("提交排课异常");
        }
      });
    },
    countMoney: function(k){
      var money = Number(this.appData[k]["teacherMoneyhour"]) * Number(this.appData[k]["hour"]);
      this.appData[k]["conuntMoney"] = money.toFixed(2);
    },
    fuTeacher: function(k, id, name, money){
      if(!this.appData[k]["keDate"]){
        //如果已经选择小时，直接计算老师课时费
        if(this.appData[k]["teacherId"]){
          this.appData[k]["conuntMoney"] = (Number(this.appData[k]["hour"])*Number(money)).toFixed(2);
        }else{
          this.appData[k]["conuntMoney"] = Number(money).toFixed(2);
        }
        this.appData[k]["teacherShow"] = false;
        this.appData[k]["teacherId"] = id;
        this.appData[k]["teacherName"] = name;
        this.appData[k]["teacherMoneyhour"] = money;
      }else{
        //判断某个时间段老师有课就不能选
        //先进行前台验证，批量添加不能重复
        var comparePause = true;
        var oneTeaId = id, oneDate = this.appData[k]["keDate"];
        if(this.appData.length>1){
          var newAppData = [];
          for(var a=0;a<this.appData.length;a++){
            newAppData.push(this.appData[a]);
          }
          newAppData.splice(k, 1);
          for(var i=0;i<newAppData.length;i++){
            if(newAppData[i]["teacherId"]==id && newAppData[i]["keDate"]==oneDate){
              this.$refs.childAlert.show("该时间段这个老师有课");
              comparePause = false;
              break;
            }
          }
        }
        
        if(!comparePause){
          return false;
        }

        $.ajax({
          url: this.path + "findIsHavingLessonByLearnDateAndTeacherId",
          type: "post",
          dataType: "json",
          data: {
            "jobNumber": localStorage.getItem("jobNumber"),
            "sessionIdOa": localStorage.getItem("sessionIdOa"),
            "learnDate": this.appData[k]["keDate"],
            "teacherId": id
          },
          success: function(data){
            if(data["msg"] && data["msg"]=="该老师有课"){
              this.$refs.childAlert.show("该时间段这个老师有课");
            }else{
              //如果已经选择小时，直接计算老师课时费
              if(this.appData[k]["teacherId"]){
                this.appData[k]["conuntMoney"] = (Number(this.appData[k]["hour"])*Number(money)).toFixed(2);
              }else{
                this.appData[k]["conuntMoney"] = Number(money).toFixed(2);
              }
              this.appData[k]["teacherShow"] = false;
              this.appData[k]["teacherId"] = id;
              this.appData[k]["teacherName"] = name;
              this.appData[k]["teacherMoneyhour"] = money;
            }
          }.bind(this),
          error: function(){
            console.log("查询老师是否有课异常");
          }
        });
      }
    },
    showSchool: function(k){
      if(this.appData[k]["subjectId"]){
        this.appData[k]["teacherShow"] = true;
        $.ajax({
          url: this.path + "findTeacherListBySubjectId",
          type: "post",
          dataType: "json",
          data: {
            "jobNumber": localStorage.getItem("jobNumber"),
            "sessionIdOa": localStorage.getItem("sessionIdOa"),
            "subjectId": this.appData[k]["subjectId"]
          },
          success: function(data){
            this.appData[k]["teacherArr"] = data["data"];
          }.bind(this),
          error: function(){
            console.log("查询老师异常");
          }
        });
      }
    },
    hideSchool: function(k){
      this.appData[k]["teacherShow"] = false;
    },
    fuGrade: function(k, g){
      this.appData[k]["gradeId"] = g;
      this.appData[k]["gradeShow"] = false;
    },
    showGrade: function(k){
      this.appData[k]["gradeShow"] = true;
    },
    hideGrade: function(k){
      this.appData[k]["gradeShow"] = false;
    },
    getGrade: function(){
      this.grade = this.OACommon.findGradeList();
    },
    fuSubject: function(k, id, name){
      this.appData[k]["subjectShow"] = false;
      //科目是否改变
      if(id != this.appData[k]["subjectId"]){
        this.appData[k]["subjectId"] = id;
        this.appData[k]["subjectName"] = name;

        this.appData[k]["teacherShow"] = false;
        this.appData[k]["teacherArr"] = [];
        this.appData[k]["teacherId"] = "";
        this.appData[k]["teacherName"] = "";
        this.appData[k]["teacherMoneyhour"] = "";
        this.appData[k]["hour"] = 1;
        this.appData[k]["conuntMoney"] = "";
      }
    },
    getSubject: function(){
      var subject = this.OACommon.findSubjectAll();
      subject.splice(0, 1);
      this.subject = subject;
    },
    hideSubject: function(k){
      this.appData[k]["subjectShow"] = false;
    },
    showSubject: function(k){
      this.appData[k]["subjectShow"] = true;
    },
    keTypeChange: function(k){
      this.appData[k]["keTypeId"] = (this.appData[k]["keTypeId"]==2)?1:2;
      this.appData[k]["schoolPanelShow"] = false;
      this.appData[k]["keTypeWord"] = (this.appData[k]["keTypeWord"]=="转为常规课")?"转为合作课":"转为常规课";
    },
    showSchoolPanel: function(k){
      if(this.appData[k]["keTypeId"]==2 && this.appData[k]["provinceId"]){  //合作课的时候才会显示
        this.appData[k]["city"] = this.OACommon.findCitiesList(this.appData[k]["provinceId"]);

        this.appData[k]["schoolPanelShow"] = true;
      }
    },
    fuSchoolVal: function(k, id, name){
      this.appData[k]["schoolPanelShow"] = false;
      this.appData[k]["schoolId"] = id;
      this.appData[k]["schoolName"] = name;
      this.appData[k]["schoolPanelShow"] = false;
    },
    cityChange: function(k){
      $.ajax({
        url: this.path + "findAllCustomerBycitiesId",
        type: "post",
        dataType: "json",
        data: {"citiesId": this.appData[k]["cityId"]},
        success: function(data){
          data = data["data"];
          if(data.length == 0){
            this.appData[k]["schoolArr"] = [{"customerId":'0', "customerName":"暂无学校"}];
          }else{
            this.appData[k]["schoolArr"] = data;
          }
        }.bind(this),
        error: function(){
          console.log("获取学校请求异常");
        }
      });
    },
    showProvinceList: function(k){
      this.appData[k]["provinceShow"] = true;
    },
    hideProvinceList: function(k){
      this.appData[k]["provinceShow"] = false;
    },
    fuProvince: function(k, id, name){              //省份赋值
      this.appData[k]["provinceShow"] = false;

      //判断省份有没有改变
      if(id != this.appData[k]["provinceId"]){     //省份未改变
        this.appData[k]["provinceId"] = id;
        this.appData[k]["provinceName"] = name;
        
        //后面其他值都要改变
        this.appData[k]["keTypeWord"] = "转为常规课";
        this.appData[k]["keTypeId"] = 2;
        this.appData[k]["schoolPanelShow"] = false;
        this.appData[k]["city"] = [];
        this.appData[k]["cityId"] = 0;
        this.appData[k]["schoolArr"] = [];
        this.appData[k]["schoolName"] = "";
        this.appData[k]["schoolId"] = "";
        this.appData[k]["keAddress"] = "";
        this.appData[k]["subjectShow"] = false;
        this.appData[k]["subjectId"] = "";
        this.appData[k]["subjectName"] = "";
        this.appData[k]["gradeShow"] = false;
        this.appData[k]["gradeId"] = "";
        this.appData[k]["keDate"] = "";
        this.appData[k]["teacherShow"] = false;
        this.appData[k]["teacherArr"] = [];
        this.appData[k]["teacherId"] = "";
        this.appData[k]["teacherName"] = "";
        this.appData[k]["teacherMoneyhour"] = "";
        this.appData[k]["hour"] = 1;
        this.appData[k]["conuntMoney"] = "";
      }
    },
    getUserProvince: function(){
      $.ajax({
        url: this.path + "findProvinceListByUserId",
        type: "get",
        dataType: "json",
        data: {
          "jobNumber": localStorage.getItem("jobNumber"),
          "sessionIdOa": localStorage.getItem("sessionIdOa")
        },
        success: function(data){
          this.province = data["data"];
        }.bind(this),
        error: function(){
          console.log("获取个人省份异常");
        }
      });
    }
  }
}
</script>
<style>
  


</style>

