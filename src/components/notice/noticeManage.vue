<template>
  <div class="hello">
      <div class="gonggao_bread">
        <a href="#/mainIndex/index" class="fa">首页</a>
        &gt;
        <span>通知</span>
        &gt;
        <span>通知查询</span>
      </div>
      <div class="search_div">
        <label>开始时间：</label>
        <el-date-picker
          v-model="searchData.startTimeString"
          type="date"
          format="yyyy-MM-dd"
          value-format="yyyy-MM-dd"
          placeholder="选择日期">
        </el-date-picker>
        <label>结束时间：</label>
        <el-date-picker
          v-model="searchData.endTimeString"
          type="date"
          format="yyyy-MM-dd"
          value-format="yyyy-MM-dd"
          placeholder="选择日期">
        </el-date-picker>
        <span class="btn-blue-s sear_btn">查询</span>
      </div>
      <div class="gonggao_body table_body">
        <div class="data_table_head">
          <ul>
            <li class="td7 xh">序号</li>
            <li class="td10">发布人</li>
            <li class="td22">通知标题</li>
            <li class="td35">通知内容</li>
            <li class="td12" style="margin-left:3%;">通知时间</li>
            <li class="td11">操作</li>
          </ul>
        </div>
        <div class="data_table_body">
          <ul v-for="(l, i) in dataList" v-if="dataList.length>0">
            <li class="td7 xh">{{ i+1 }}</li>
            <li class="td10">{{ l.userName }}</li>
            <li class="td22">{{ l.noticeTheme }}</li>
            <li class="td35">{{ l.thumbContent }}</li>
            <li class="td12" style="margin-left:3%;">{{ OACommon.getOADate(new Date(l.createDate)).todayDate }}</li>
            <li class="td11">
              <a v-bind:href="'#/mainIndex/notice/enterNotice?id='+l.noticeId" class="table_edit">修改</a>
              <a href="javascript:void(0);" class="table_del" v-on:click="delNotice(l.noticeId)">删除</a>
            </li>
          </ul>
          <ul v-if="dataList.length==0">
            <li class="td7 xh" style="width:100%;color:red;">暂无公告数据</li>
          </ul>
        </div>
      </div>
      <oa-page ref="childPage"></oa-page>

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
  name: 'enterNotice',
  components: {
      'oa-page': oaPage,
      'oa-alert': oaAlert,
      'oa-confirm': oaConfirm
    },
  data () {
    return {
      path: this.OACommon["publicDef"]["qpath"],
      searchData: {
        startTimeString: '',
        endTimeString: ''
      },
      pageNum: 1,
      pageSize: 10,
      dataList: []
    }
  },
  created: function(){
    //设置时间
    this.searchData.startTimeString = this.OACommon.getOADate(new Date()).prevMonthToday;
    this.searchData.endTimeString = this.OACommon.getOADate(new Date()).todayDate;

    this.getList();
  },
  methods: {
    delNotice: function(id){
      this.$refs.childConfirm.show("您确定要删除吗？", function(){
        $.ajax({
          url: this.path + "deleteNanicById",
          type: "post",
          dataType: "json",
          data: {
            "jobNumber": localStorage.getItem("jobNumber"),
            "sessionIdOa": localStorage.getItem("sessionIdOa"),
            "noticeId": id
          },
          success: function(data){
            if(data["code"] == 200){
              this.getList();
              this.$refs.childAlert.show("删除成功");
            }else{
              this.$refs.childAlert.show(data["msg"]);
            }
          }.bind(this),
          error: function(){
            console.log("删除异常");
          }
        });
      }.bind(this));
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
        url: this.path + "showNanicList",
        type: "post",
        dataType: "json",
        data: {
          "jobNumber": localStorage.getItem("jobNumber"),
          "sessionIdOa": localStorage.getItem("sessionIdOa"),
          "startTimeString": this.searchData.startTimeString,
          "endTimeString": this.searchData.endTimeString,
          "pageNum": this.pageNum,
          "pageSize": this.pageSize,
        },
        success: function(data){
          this.dataList = data["data"]["list"];

          this.$refs.childPage.setArg(data["data"]["pages"], this.pageNum, this.pageSize, this.getList);
        }.bind(this),
        error: function(){
          console.log("获取通知列表异常");
        }
      });
    }
  }
}
</script>
<style type="text/css">
  .el-date-editor.el-input, .el-date-editor.el-input__inner{width:170px;cursor:pointer;}
  .el-input__inner{height:30px;line-height:30px;cursor:pointer;border:1px solid #C9C9C9;}
  .el-input__icon{line-height:30px;}
</style>


