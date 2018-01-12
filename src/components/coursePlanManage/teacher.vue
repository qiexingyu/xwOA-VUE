<template>
  <div class="hello">
    <div class="gonggao_bread">
        <a href="#/mainIndex/index" class="fa">首页</a>
        &gt;
        <span>排课管理</span>
        &gt;
        <span>老师管理</span>
      </div>
      <div class="search_div yydo">
        <div>
          <label style="width:80px;">时间：</label>
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
          <label>主讲科目：</label>
          <select v-model="searchData.subjectId">
            <option v-for="s in searchData.subject" v-bind:value="s.subjectId">{{ s.subjectName }}</option>
          </select>
        </div>
        <div class="et">
          <label>老师姓名：</label>
          <input type="text" v-model="searchData.teacherName"/>
          <span class="btn-blue-s" v-on:click="getTeacherList">查询</span>
          <span class="btn-yellow-s" v-on:click="showAddView" style="margin-left:0;">新增</span>
        </div>
      </div>
      <div class="gonggao_body table_body">
        <div class="data_table_head">
          <ul>
            <li class="td10 xh">序号</li>
            <li class="td14">添加时间</li>
            <li class="td14">老师姓名</li>
            <li class="td14">主讲科目</li>
            <li class="td14">课时费</li>
            <li class="td16">备注</li>
            <li class="td16">操作</li>
          </ul>
        </div>
        <div class="data_table_body">
          <ul v-for="(l, i) in list" v-if="list.length>0">
            <li class="td10 xh">{{ i+1 }}</li>
            <li class="td14">{{ l.createTime }}</li>
            <li class="td14">{{ l.teacherName }}</li>
            <li class="td14">{{ l.subjectName }}</li>
            <li class="td14">{{ l.oneHourMoney }}</li>
            <li class="td16">
              <a href="javascript:void(0);" class="table_pa" v-on:click="showRemark(l.remark)">查看</a>
            </li>
            <li class="td16">
              <a href="javascript:void(0);" class="table_pa" v-on:click="updateTeacher(l.teacherId)">修改</a>
              <a href="javascript:void(0);" class="table_la" v-on:click="deleteTeacher(l.teacherId)">删除</a>
            </li>
          </ul>
          <ul v-if="list.length==0">
            <li style="width:100%;text-align:center;color:red;">暂无数据</li>
          </ul>
        </div>
      </div>

      <oa-page ref="childPage"></oa-page>

      <div class="bgpop" v-if="viewData.isShow" v-on:click="closeView"></div>
      <div class="kecha_pop" style="width:450px;height:405px;" v-if="viewData.isShow">
        <span class="closexx" style="margin-right:10px;" v-on:click="closeView"><Icon type="android-cancel"></Icon></span>
        <p class="pop_tit">新增老师</p>
        <div class="pop_form_div">
          <div class="form_eve">
            <label class="label_tit-4">老师姓名：</label>
            <input type="text" class="form_input-9" v-model="viewData.teacherName" maxlength="5" placeholder="最多输入5个字">
          </div>
          <div class="form_eve">
            <label class="label_tit-4">课时费：</label>
            <input type="text" class="form_input-9" v-model="viewData.money" v-on:blur="moneyBlur" placeholder="数值保留2位小数">
          </div>
          <div class="form_eve">
            <label class="label_tit-4">主讲科目：</label>
            <select v-model="viewData.subjectId" class="form_input-9">
              <option v-for="s in searchData.subject" v-bind:value="s.subjectId">{{ s.subjectName }}</option>
            </select>
          </div>
          <div class="form_eve">
            <label class="label_tit-4">备&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;注：</label>
            <textarea class="form_input-10" maxlength="200" v-model="viewData.remark" placeholder="最多输入200个字"></textarea>
          </div>
          <div class="err_tip" style="text-align:center;color:red;height:15px;">{{ viewData.errTip }}</div>
          <div class="fbtong_btn_div" style="margin-top:20px;">
            <span class="btn-blue-s" v-on:click="subView">提交</span>
            <span class="btn-yellow-s" v-on:click="closeView">取消</span>
          </div>
        </div>
      </div>

      <div class="bgpop" v-if="remark.isShow"></div>
      <div class="kecha_pop" style="width:500px;height:210px;" v-if="remark.isShow">
        <table cellpadding="0" cellspacing="0" style="border:0;">
          <tr>
            <td class="head">备注</td>
          </tr>
          <tr class="x">
            <td style="height:70px;padding:0 20px;">{{ remark.remark }}</td>
          </tr>
        </table>
        <div style="text-align:center;margin-top:20px;">
          <span class="btn-blue-s" v-on:click="closeRemark">关闭</span>
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
  name: 'teacher',
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
        subject: [],
        subjectId: 0,
        teacherName: ''
      },
      list: [],
      pageNum: 1,
      pageSize: 10,
      viewData: {
        isShow: false,
        errTip: '',
        subjectId: 0,
        teacherName: '',
        money: '',
        remark: '',
        teacherId: '',
        subPause: true
      },
      remark: {
        isShow: false,
        remark: ''
      }
    }  
  },
  created: function () {
    this.setInitSearchData(); 
    this.getTeacherList();
  },
  methods: {
    deleteTeacher: function(id){
      this.$refs.childConfirm.show("您确定要删除吗？", function(){
        $.ajax({
          url: this.path + "deleteTeacherByTeacherId",
          type: "post",
          dataType: "json",
          data: {
            "jobNumber": localStorage.getItem("jobNumber"),
            "sessionIdOa": localStorage.getItem("sessionIdOa"),
            "teacherId": id
          },
          success: function(data){
            if(data["code"] == 200){
              this.$refs.childAlert.show("删除成功");
              this.getTeacherList();
            }else{
              this.$refs.childAlert.show(data["msg"]);
            }
          }.bind(this),
          error: function(){
            console.log("删除老师异常");
          }
        });
      }.bind(this));
    },
    updateTeacher: function(id){
      this.viewData.teacherId = id;
      $.ajax({
        url: this.path + "findTeacherByTeacherId",
        type: "post",
        dataType: "json",
        data: {
          "jobNumber": localStorage.getItem("jobNumber"),
          "sessionIdOa": localStorage.getItem("sessionIdOa"),
          "teacherId": this.viewData.teacherId
        },
        success: function(data){
          data = data["data"];
          this.viewData.teacherName = data["teacherName"];
          this.viewData.money = data["oneHourMoney"];
          this.viewData.subjectId = data["subjectId"];
          this.viewData.remark = data["remark"];
        }.bind(this),
        error: function(){
          console.log("查询老师详情异常");
        }
      });
      this.viewData.isShow = true;
    },
    showRemark: function(rk){
      this.remark.remark = rk;
      this.remark.isShow = true;
    },
    closeRemark: function(){
      this.remark.isShow = false;
    },
    moneyBlur: function(){
      var reg = /(^[0-9]*$)|(^[0-9]*[\.]{1}[0-9]{1,2}$)/;
      var edvalNum = 0;
      if(!reg.test(this.viewData.money)){
        if(!isNaN(this.viewData.money) && this.viewData.money.indexOf(".")!=-1 && this.viewData.money.split(".")[1].length>2){
          edvalNum = this.viewData.money.split(".")[0] + "." + this.viewData.money.split(".")[1].substring(0, 2);
          this.viewData.money = Number(edvalNum).toFixed(2);
        }else{
          this.viewData.money = "0.00";
        }
      }else{
        if(this.viewData.money){
          this.viewData.money = Number(this.viewData.money).toFixed(2);
        }else{
          this.viewData.money = "0.00";
        }
      }
    },
    subView: function(){
      if(!this.viewData.teacherName){
        this.viewData.errTip = "请输入老师姓名";
        return false;
      }
      if(Number(this.viewData.money)<=0){
        this.viewData.errTip = "请输入课时费";
        return false;
      }
      if(!this.viewData.subjectId){
        this.viewData.errTip = "请选择主讲科目";
        return false;
      }
      if(!this.viewData.remark){
        this.viewData.errTip = "请输入备注";
        return false;
      }
      this.viewData.errTip = "";

      var subData = {};
      if(this.viewData.teacherId){           //修改
        subData = {
          "jobNumber": localStorage.getItem("jobNumber"),
          "sessionIdOa": localStorage.getItem("sessionIdOa"),
          "teacherName": this.viewData.teacherName,
          "oneHourMoney": this.viewData.money,
          "subjectId": this.viewData.subjectId,
          "remark": this.viewData.remark,
          "teacherId": this.viewData.teacherId
        };
      }else{
        subData = {
          "jobNumber": localStorage.getItem("jobNumber"),
          "sessionIdOa": localStorage.getItem("sessionIdOa"),
          "teacherName": this.viewData.teacherName,
          "oneHourMoney": this.viewData.money,
          "subjectId": this.viewData.subjectId,
          "remark": this.viewData.remark
        };
      }

      if(!this.viewData.subPause){
        return false;
      }
      this.viewData.subPause = false;

      $.ajax({
        url: this.path + "insertOrUpdateTeacher",
        type: "post",
        dataType: "json",
        data: subData,
        success: function(data){
          if(data["code"] == 200){
            if(this.viewData.teacherId){   //修改
              this.$refs.childAlert.show("修改成功");
            }else{
              this.$refs.childAlert.show("提交成功");
            }

            this.closeView();
            this.getTeacherList();
            this.viewData.subPause = true;
          }else{
            this.viewData.subPause = true;
            this.viewData.errTip = "网络异常，请稍后重试";
          }
        }.bind(this),
        error: function(){
          this.viewData.subPause = true;
          console.log("提交老师请求异常");
        }
      });
    },
    closeView: function(){
      this.viewData.isShow = false;
      this.viewData.errTip = "";
      this.viewData.subjectId = 0;
      this.viewData.teacherName = "";
      this.viewData.money = "";
      this.viewData.remark = "";
      this.viewData.teacherId = "";
    },
    showAddView: function(){
      this.viewData.isShow = true;
    },
    getTeacherList: function(pn, ps){
      //pn: 当前页数  ps：每页条数
      if(pn && typeof(pn)!='object'){
        this.pageNum = pn;
      }
      if(ps && typeof(ps)!='object'){
        this.pageSize = ps;
      }

      $.ajax({
        url: this.path + "findTeacherListPage",
        type: "post",
        dataType: "json",
        data: {
          "jobNumber": localStorage.getItem("jobNumber"),
          "sessionIdOa": localStorage.getItem("sessionIdOa"),
          "teacherName": this.searchData.teacherName,
          "subjectId": this.searchData.subjectId,
          "startDate": this.searchData.startDate,
          "endDate": this.searchData.endDate,
          "pageNum": this.pageNum,
          "pageSize": this.pageSize
        },
        success: function(data){
          this.list = data["data"]["list"];

          this.$refs.childPage.setArg(data["data"]["pages"], this.pageNum, this.pageSize, this.getTeacherList);
        }.bind(this),
        error: function(){
          console.log("查询老师列表异常");
        }
      });
    },
    setInitSearchData: function(){
      //设置时间
      //this.searchData.startDate = this.OACommon.getOADate(new Date()).prevMonthToday;
      //this.searchData.endDate = this.OACommon.getOADate(new Date()).todayDate;
      this.searchData.subject = this.OACommon.findSubjectAll();
    }
  }
}
</script>
<style>

</style>

