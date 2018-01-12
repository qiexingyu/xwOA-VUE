<template>
  <div class="hello">
      <div class="gonggao_bread">
        <a href="#/mainIndex/index" class="fa">首页</a>
        &gt;
        <a href="#/mainIndex/notice/noticeRead">通知</a>
        &gt;
        <span>公告详情</span>
      </div>
      <div class="gonggao_body">
        <div class="g_detail_body">
          <p class="g_detail_tit">{{ detail.noticeTheme }}</p>
          <p class="g_detail_yt">
            <label>来源部门：</label><span>{{ detail.deptName }}</span>
            <label class="l">时间：</label><span>{{ OACommon.getOADate(new Date(detail.createDate)).todayDate }}</span>
          </p>
          <div class="g_detail_con" v-html="detail.content"></div>
        </div>
      </div>

  </div>
</template>

<script>
import $ from 'jquery'

export default {
  name: 'enterNotice',
  data () {
    return {
      path: this.OACommon["publicDef"]["qpath"],
      noticeId: 0,
      detail: {}
    }
  },
  created: function(){
    this.noticeId = this.OACommon.getUrlPara("id");
    this.getDetail();
  },
  methods: {
    getDetail: function(){
      $.ajax({
        url: this.path + "showNanicById",
        type: "post",
        dataType: "json",
        data: {
          "jobNumber": localStorage.getItem("jobNumber"),
          "sessionIdOa": localStorage.getItem("sessionIdOa"),
          "noticeId": this.noticeId
        },
        success: function(data){
          this.detail = data["data"];
        }.bind(this),
        error: function(){
          console.log("获得详情信息异常");
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

  .ql-align-center{text-align:center;}
</style>


