<template>
   
   <div class="roleManagement">
      <div class="gonggao_bread">
        <a href="#" class="fa">首页</a>
        &gt;
        <a href="#">财务</a>
        &gt;
        <span>额度调整</span>
      </div>
      
      <div class="gonggao_body table_body" style="padding-top: 20px">

        <div class="baoxiao" style="width: 100%;text-align: center" >
             <span class="tcqy" v-bind:class="check" v-on:click="grtc">个人统筹/区域</span><span  class="tcqy" v-bind:class="checked" v-on:click="grqy">开课费额度</span>
        </div>
        
        <div class="money_table data_table_body" style="width: 95%;margin: 20px auto">
          <table cellpadding="0" cellspacing="0" border="1" style="text-align: center">
              <thead>
              <tr>
                <td width="20%">区域</td>
                <td width="15%">省份</td>
                <td width="15%">员工</td>
                <td width="20%">额度修改</td>
                <td width="15%">当前可用额度</td>
                <td width="15%">修改记录</td>
              </tr>
              </thead>
              <tbody v-for="(l, i) in flowList">
                  <tr v-for="(v, k) in l">
                    <td v-bind:rowSpan="l.length" v-if="k==0">{{ i }}</td>
                    <td v-if="v.provinceNameList">
                       <span v-if="v.provinceNameList.length ==1 && !v.provinceNameList[0]">N/A</span>
                       <span v-for="(prov,n) in v.provinceNameList" v-if="n!=(v.provinceNameList.length-1) && prov">{{ prov}}、</span>
                       <span v-for="(prov,n) in v.provinceNameList" v-if="n==(v.provinceNameList.length-1)">{{ prov}}</span>
                    </td>               
                    <td v-if="!v.provinceNameList">N/A</td>               
                    <td>{{ v.userName }}</td>  
                    <td>
                        {{ v.modifyCreditMoney.toFixed(2) }}   
                        <span v-if="changeEd" style="float: right;cursor: pointer" v-on:click="changeAdjust(v.userId,v.quota,v.provinceNameList,v.modifyCreditMoney)"><Icon title="修改额度" style="color: #00a1e9;font-size: 15px;" type="compose"></Icon></span>                     
                    </td>             
                    <td>
                        {{ v.quota.toFixed(2) }}   
                    </td>
                    <td>
                      <span style="cursor: pointer" class="table_la" v-on:click="lookRecord(v.userId,v.provinceNameList)">查看</span>             
                    </td> 
                  </tr>
              </tbody>
            </table>
        </div>
      </div>

      <div class="bgpop" v-if="isShowCover"></div>

      <div class="view_area" style="width: 450px;height: 300px;padding: 5px 20px" v-if="isShowFlow">
            <div class="baoxiao" style="width: 100%;text-align: center;padding: 10px 10px" >
              <span style="font-size: 20px;font-weight: 700">额度修改</span>
            </div>

            <div class="peoMenEdit" style="margin-top: 10px">
                 <span class="prompt" style="display: inline-block;width: 100px;text-align: right;">当前可用额度：</span>
                 <span>{{ quota.toFixed(2) }}</span>
            </div>
           
            <div class="peoMenEdit" style="margin-top: 10px">
                 <span class="prompt" style="display: inline-block;width: 100px;text-align: right;">新增额度：</span>
                 <input class="textType" style="width: 250px;height: 30px;line-height: 30px" v-on:keyup="inputKey" placeholder="请输入额度"  type="text" v-model="creditMoney" />
            </div>

            <div class="peoMenEdit" style="margin-top: 10px">
                 <span class="prompt" style="display: inline-block;width: 100px;text-align: right;vertical-align: top" >修改原因：</span>
                 <textarea placeholder="修改原因" style="height: 80px;width: 250px;padding: 0 10px" v-model="changeReason" ></textarea>
            </div>

            <div class="view_btn" style="margin-top: 20px">
                 <span class="btn-blue-s" v-on:click="submitFlow">提交</span>
                 <span class="btn-yellow-s" v-on:click="closeFlow">取消</span>
            </div>
      </div>


      <div class="view_area" style="width: 500px;height: 300px;padding: 5px 20px" v-if="isShowRecord">
            <div class="baoxiao" style="width: 100%;text-align: center;" >
              <span style="font-size: 20px;font-weight: 700">修改记录</span>
              <span class="closexx"  v-on:click="closeReason"><Icon type="android-cancel"></Icon></span>
            </div>
            <div v-if="reasonList.length != 0" class="peoMenEdit" style="width: 100%;margin-top: 10px" v-for="(reason,k) in reasonList">
                 <div style="overflow: hidden;zoom: 1">
                    <div style="float: left;width: 20px">{{ k+1 }}、</div>
                    <div style="float: left;width: 420px">
                       {{ reason.updateDateSting }}，
                       <span style="color: #FC9037">{{ reason.userName }}</span>
                       修改金额，由 
                       <span style="color: #58DA27">{{ reason.beforeMoney.toFixed(2) }}</span>                 
                       元修改为
                       <span style="color: #FF6666">{{ reason.nowMoney.toFixed(2) }}</span>元
                    </div>
                 </div>
                 <div>
                    <span style="margin-left: 20px;color: #00a1e9">说明：</span>
                    <span>{{ reason.reason }}</span>
                 </div>
                 
            </div>

            <div v-if="reasonList.length == 0" class="peoMenEdit" style="margin-top: 10px;line-height: 100px;text-align: center;color: #FF6666" >
                暂无修改记录
            </div>

            <div class="view_btn" style="margin-top: 20px">
                 <span class="btn-yellow-s" v-on:click="closeReason">关闭</span>
            </div>
      </div>
     

     
      <oa-alert ref="childAlert"></oa-alert>
      <oa-confirm ref="childConfirm"></oa-confirm>

  </div>


</template>

<style>      
      
      .peoMenEdit .el-input__inner {
        width: 200px;
        height: 30px;
        line-height: 30px;
      }
      .peoMenEdit .el-input__icon {
        line-height: 30px;
      }

      .tcqy {
        display: inline-block;
        width: 100px;
        height: 30px;
        line-height: 30px;
        text-align: center;
        border: 1px solid #cecece;
        margin: 0;
        padding: 0;
        cursor: pointer;
      }
      .tcqy.check {
        border: 1px solid #00a1e9;
        color: #00a1e9;
      }
      .tcqy.checked {
        border: 1px solid #00a1e9;
        color: #00a1e9;
      }
    
</style>

<script>
  import $ from 'jquery'
  import oaAlert from '@/components/commonVue/Alert'
  import oaConfirm from '@/components/commonVue/Confirm'
    export default {
        name: 'PositionManagement',
        components: {
          'oa-alert': oaAlert,
          'oa-confirm': oaConfirm
        },
        data () {
            return {               
                path: this.OACommon["publicDef"]["qpath"],
                isShowCover: false,               
                isShowFlow: false,               
                isShowRecord: false, 
                changeEd: false, 
                check: 'check',
                checked: '',
                quota: '', //可用额度 
                areaId: '', 
                kkfy: false,
                modifyQuota: '', 
                creditMoney: '', //新增可用额度              
                allMoney: '', //可用额度              
                changeReason: '', //修改原因              
                userId: '', //id    
                state: '', //费用类型   
                reasonList: [],          
                flowList: {}     //额度调整遍历
                             
            }
        },
        created: function(){
           
            var buttonPermissionList = localStorage.getItem("buttonPermissionList");
            buttonPermissionList = JSON.parse(localStorage.getItem("buttonPermissionList"));
            for(var i=0;i<buttonPermissionList.length;i++){
              if(buttonPermissionList[i]["permissionCode"] == "hexiao_caiwu_learder"){
                 this.changeEd = true;
              }

            }

            this.getAdjust();
        },
        methods:{
            getAdjust: function(){  //个人统筹区域对比列表（前一个月）                                          
                $.ajax({
                    type : "post",
                    url : this.path + "findQuotaAll",
                    data : {
                      "jobNumber": localStorage.getItem("jobNumber"),
                      "sessionIdOa": localStorage.getItem("sessionIdOa")      
                    },
                    success : function(data) {

                      if(data.code == 200){
                        var data = data["data"];
                        var dataObj = {};         //预定义用来组装以区为key的数据对象

                        for(var i=0;i<data.length;i++){
                          var areaName = data[i]["areaName"];
                          if(areaName === null){
                             areaName = "N/A"
                           }
                          if(dataObj[areaName]){
                            dataObj[areaName].push(data[i]);
                          }else{
                            dataObj[areaName] = [];
                            dataObj[areaName].push(data[i]);
                          }
                        }
                        this.flowList = dataObj;
                      }else {
                        this.$refs.childAlert.show(data["msg"]);
                      }
                      
                    }.bind(this),
                    error : function() {
                    }
                });
            },
            getAdjustKk: function(){  //开课对比列表（前一个月）  
                $.ajax({
                    type : "post",
                    url : this.path + "findQuotaAllcourse",
                    data : {
                      "jobNumber": localStorage.getItem("jobNumber"),
                      "sessionIdOa": localStorage.getItem("sessionIdOa")      
                    },
                    success : function(data) {
                      if(data.code == 200){
                        var data = data["data"];
                        var dataObj = {};         //预定义用来组装以区为key的数据对象

                        for(var i=0;i<data.length;i++){
                          var areaName = data[i]["areaName"];
                          if(areaName === null){
                             areaName = "N/A"
                           }
                          if(dataObj[areaName]){
                            dataObj[areaName].push(data[i]);
                          }else{
                            dataObj[areaName] = [];
                            dataObj[areaName].push(data[i]);
                          }
                        }
                        this.flowList = dataObj;
                      }else {
                        this.$refs.childAlert.show(data["msg"]);
                      }
                      
                    }.bind(this),
                    error : function() {
                    }
                });
            },             
            changeAdjust: function(userId,quota,provinceNameList,modifyCreditMoney){ //修改额度弹窗            
                this.userId = userId;
                this.quota = quota;
                this.modifyCreditMoney = modifyCreditMoney;
                if(provinceNameList){
                   this.state = "1";
                }else {
                  this.state = "3";
                }
                this.creditMoney = "";
                this.changeReason = "";
                this.isShowCover = true;
                this.isShowFlow = true;
            },
            inputKey: function(){ //输入框数字校验
              var obj = this.creditMoney;
              obj = obj.replace(/[^\-\d.]/g,"");  //清除“数字”和“.”以外的字符
              obj = obj.replace(/\.{2,}/g,"."); //只保留第一个. 清除多余的
              obj = obj.replace(".","$#$").replace(/\./g,"").replace("$#$",".");
              obj = obj.replace(/^(\-)*(\d+)\.(\d\d).*$/,'$1$2.$3');//只能输入两个小数
           
              this.creditMoney = obj;
            },
            closeFlow: function(){ //关闭修改额度
              this.isShowCover = false;
              this.isShowFlow = false;
            },
            closeReason: function(){ //关闭修改记录
              this.isShowCover = false;
              this.isShowRecord = false;
            },
            submitFlow: function(){  //提交修改额度             
              if(!this.creditMoney){
                this.$refs.childAlert.show("请填写修改额度");
                return false;
              }
              if(!this.changeReason){
                this.$refs.childAlert.show("请填写修改原因");
                return false;
              } 
              this.allMoney = Number(this.creditMoney) + Number(this.quota);
              if(this.kkfy){
                $.ajax({
                    type : "post",
                    async : false,
                    url : this.path + "updateQuotaCourse",
                    data : {
                      "jobNumber": localStorage.getItem("jobNumber"),
                      "sessionIdOa": localStorage.getItem("sessionIdOa"),
                      "quota": this.allMoney,
                      "userId": this.userId,
                      "modifyQuota": this.creditMoney,
                      "state": this.state,
                      "reason": this.changeReason
                    },
                    success : function(data) {
                      this.isShowCover = false;
                      this.isShowFlow = false;
                      if(data.code == 200){
                          this.$refs.childAlert.show("修改成功",this.getAdjustKk);
                      }else {
                          this.$refs.childAlert.show(data.msg);
                      }
                    
                    }.bind(this),
                    error : function() {
                    }
              });

              }else {
                $.ajax({
                    type : "post",
                    async : false,
                    url : this.path + "updateQuota",
                    data : {
                      "jobNumber": localStorage.getItem("jobNumber"),
                      "sessionIdOa": localStorage.getItem("sessionIdOa"),
                      "quota": this.allMoney,
                      "userId": this.userId,
                      "modifyQuota": this.creditMoney,
                      "state": this.state,
                      "reason": this.changeReason
                    },
                    success : function(data) {
                      this.isShowCover = false;
                      this.isShowFlow = false;
                      if(data.code == 200){
                          this.$refs.childAlert.show("修改成功",this.getAdjust);
                      }else {
                          this.$refs.childAlert.show(data.msg);
                      }
                    
                    }.bind(this),
                    error : function() {
                    }
              });
              }
              return false;
              
            },
            lookRecord: function(userId,provinceNameList){  //查看修改记录 
              this.userId = userId;
              if(provinceNameList){
                 this.state = "1";
              }else {
                this.state = "3";
              } 
              if(this.kkfy){
                this.state = "4";
              } 
              $.ajax({
                    type : "post",
                    async : false,
                    url : this.path + "selectByQuotaRecord",
                    data : {
                      "jobNumber": localStorage.getItem("jobNumber"),
                      "sessionIdOa": localStorage.getItem("sessionIdOa"),
                      "userId": this.userId,
                      "state": this.state
                    },
                    success : function(data) {
                      if(data.code == 200){
                          this.isShowCover = true;
                          this.isShowRecord = true;
                          this.reasonList = data["data"]
                          
                          
                      }else {
                          this.$refs.childAlert.show(data.msg);
                      }
                    
                    }.bind(this),
                    error : function() {
                    }
                });
            },
            grtc: function(){   
                if(this.check = "check"){
                  this.checked = "";
                }else{
                  this.check = "check";
                  this.checked = "";
                }
                this.kkfy = false;
                this.getAdjust();
                
            },
            grqy: function(){   
                if(this.checked = "checked"){
                  this.check = "";
                }else{
                  this.check = "";
                  this.checked = "checked";
                }
                this.kkfy = true;
                this.getAdjustKk();
            },


        }
        
    }
</script>