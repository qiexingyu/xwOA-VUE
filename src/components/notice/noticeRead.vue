<template>
  <div class="hello">
      <div class="gonggao_bread">
        <a href="#/mainIndex/index" class="fa">首页</a>
        &gt;
        <span>通知</span>
        &gt;
        <span>通知公告</span>
      </div>
      <div class="gonggao_body">
        <div class="gonggao_list">
          <div v-for="l in dataList" v-if="dataList.length>0">
            <p class="g_tit"><a v-bind:href="'#/mainIndex/notice/noticeDetail?id='+l.noticeId">{{ l.noticeTheme }}</a></p>
            <p class="g_con tishi">{{ l.thumbContent }}</p>
            <p class="g_time">{{ OACommon.getOADate(new Date(l.createDate)).todayDate }}&nbsp;&nbsp;&nbsp;&nbsp;{{ l.deptName }}</p>
          </div>
          <div v-if="dataList.length==0">
            <p class="g_tit" style="text-align:center;color:red;padding-bottom:20px;">暂无公告数据</p>
          </div>
        </div>
      </div>
      <oa-page ref="childPage"></oa-page>

      <oa-confirm ref="childConfirm"></oa-confirm>
  </div>
</template>

<script>
import $ from 'jquery'
import oaPage from '@/components/commonVue/Page'
import oaConfirm from '@/components/commonVue/Confirm'

export default {
  name: 'enterNotice',
  components: {
      'oa-page': oaPage,
      'oa-confirm': oaConfirm
    },
  data () {
    return {
      path: this.OACommon["publicDef"]["qpath"],
      pageNum: 1,
      pageSize: 10,
      dataList: []
    }
  },
  created: function(){
    this.getList();
  },
  methods: {
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
          "startTimeString": "",
          "endTimeString": "",
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


