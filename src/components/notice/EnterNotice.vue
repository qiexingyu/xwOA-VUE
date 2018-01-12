<template>
  <div class="hello">
      <div class="gonggao_bread">
        <a href="#/mainIndex/index" class="fa">首页</a>
        &gt;
        <span>通知</span>
        &gt;
        <span>发布通知</span>
      </div>
      <div class="gonggao_body">
        <div class="fbtong_div">
          <div class="form_eve">
            <label class="label_tit-1">通知标题：</label>
            <input type="text" placeholder="请输入通知标题" class="form_input-1" maxlength="50" v-model="title"/>
          </div>
          <div class="form_eve">
            <label class="label_tit-1">通知摘要：</label>
            <input type="text" placeholder="请输入通知摘要" class="form_input-1" maxlength="150" v-model="desc"/>
          </div>
          <div class="form_eve">
            <label class="label_tit-1">通知内容：</label>
            <div class="form_input-1 fbtong_con" style="border:none;">
              <vue-editor id="editor"
                useCustomImageHandler
                @imageAdded="handleImageAdded" v-model="htmlForEditor">
              </vue-editor>
            </div>
          </div>
          <div style="height:20px;color:red;text-align:center;margin-top:20px;">{{ errTip }}</div>
          <div class="fbtong_btn_div">
            <span class="btn-blue" v-on:click="subNotice">提交</span>
          </div>
        </div>
      </div>

      <oa-alert ref="childAlert"></oa-alert>
  </div>
</template>

<script>
import $ from 'jquery'
import oaAlert from '@/components/commonVue/Alert'
import { VueEditor } from 'vue2-editor'
import axios from 'axios'

export default {
  name: 'enterNotice',
  components: {
      'oa-alert': oaAlert,
      VueEditor
    },
  data () {
    return {
      path: this.OACommon["publicDef"]["qpath"],
      title: '',
      desc: '',
      htmlForEditor: '',
      noticeId: 0,
      subPause: true,
      errTip: ''
    }
  },
  created: function(){
    this.noticeId = this.OACommon.getUrlPara("id");
    if(this.noticeId){
      this.setInitDetailData();
    }
  },
  methods: {
    setInitDetailData: function(){
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
          this.title = data["data"]["noticeTheme"];
          this.desc = data["data"]["thumbContent"];
          this.htmlForEditor = data["data"]["content"];
        }.bind(this),
        error: function(){
          console.log("获得详情信息异常");
        }
      });
    },
    handleImageAdded: function(file, Editor, cursorLocation) {
      var formData = new FormData();
      formData.append('upfile', file)

      axios({
        url: this.path + 'imageUpload',
        method: 'post',
        data: formData
      })
      .then((result) => {
        let url = result.data.data // Get url from response
        console.log(url);
        Editor.insertEmbed(cursorLocation, 'image', url);
      })
      .catch((err) => {
        console.log(err);
      })
    },
    subNotice: function(){
      if(!this.title){
        this.errTip = "请输入通知标题";
        return false;
      }
      if(!this.desc){
        this.errTip = "请输入通知摘要";
        return false;
      }
      if(!this.htmlForEditor){
        this.errTip = "请输入通知内容";
        return false;
      }
      this.errTip = "";

      //防止重复提交
      if(!this.subPause){
        return false;
      }
      this.subPause = false;

      $.ajax({
        url: this.path + "addOrUpdateNanic",
        type: "post",
        dataType: "json",
        data: {
          "jobNumber": localStorage.getItem("jobNumber"),
          "sessionIdOa": localStorage.getItem("sessionIdOa"),
          "noticeTheme": this.title,
          "thumbContent": this.desc,
          "content": this.htmlForEditor,
          "noticeId": this.noticeId
        },
        success: function(data){
          if(data["code"] == 200){
            this.$refs.childAlert.show("提交成功", function(){
              this.$router.push('/mainIndex/notice/noticeManage');
            });
          }else{
            this.errTip = data["msg"];
            this.subPause = true;
          }
        }.bind(this),
        error: function(){
          this.subPause = true;
          console.log("新增通知异常");
        }
      });
    }
  }
}
</script>
<style type="text/css">
  #editor{height:340px;}
</style>


