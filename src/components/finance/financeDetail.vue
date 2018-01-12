<template>
   
   <div class="roleManagement">
      <div class="gonggao_bread">
        <a href="#" class="fa">首页</a>
        &gt;
        <a href="#">财务</a>
        &gt;
        <span>流水详情</span>
      </div>
      
      <div class="gonggao_body table_body" style="padding-top: 20px">

        <div class="baoxiao" style="width: 100%;text-align: center;padding: 20px 10px" >
             <span style="font-size: 25px;font-weight: 700">{{ dateTime }}{{ provinceName }}流水详情</span>
        </div>

        <div class="money_table data_table_body" style="width: 100%;margin: 0;padding: 0px 20px 50px;">
          <table cellpadding="0" cellspacing="0" border="1" style="text-align: center">
              <thead>
              <tr>
                <td width="15%">编号</td>
                <td width="15%">入账时间</td>
                <td width="15%">金额</td>
                <td width="15%">添加人</td>
                <td width="15%">操作</td>
                <td width="15%">修改记录</td>
              </tr>
              </thead>
              <tbody>
                  
                  <tr v-for="(flow,v) in flowList">
                    <td>{{ v+1 }}</td>
                    <td>{{ flow.timeOfEntryString }}</td>
                    <td>{{ flow.accountAmount }}</td>
                    <td>{{ flow.userName }}</td>
                    <td>
                        <span style="cursor: pointer" class="table_edit" v-on:click="addFlow(flow.timeOfEntryString,flow.accountAmount,flow.id)">修改</span>

                    </td>                
                    <td>
                        <a class="table_pa" v-on:click="changeRecord(flow.id)">查看</a>
                    </td>
                                  
                  </tr>

                 
                                      
              </tbody>
              



            </table>
        </div>
      </div>

      <div class="bgpop" v-if="isShowCover"></div>
    
      <div class="view_area" style="width: 400px;height: 300px;padding: 5px 20px" v-if="isShowFlow">
            <div class="baoxiao" style="width: 100%;text-align: center;padding: 10px 10px" >
              <span style="font-size: 20px;font-weight: 700">流水修改</span>
            </div>
            <div class="peoMenEdit">
                 <span class="prompt">入账时间：</span>
                 <el-date-picker
                   v-model="changeTime"
                   type="date"
                   format="yyyy-MM-dd"
                   value-format="yyyy-MM-dd"
                   placeholder="选择日期">
                 </el-date-picker>              
            </div>
            <div class="peoMenEdit" style="margin-top: 20px">
                 <span class="prompt">入账金额：</span>
                 <input class="textType" style="width: 250px;height: 30px;line-height: 30px" v-on:keyup="inputKey" placeholder="入账金额"  type="text" v-model="changeMoney" />
            </div>

            <div class="peoMenEdit" style="margin-top: 20px">
                 <label style="vertical-align: top" >修改原因：</label>
                 <textarea placeholder="修改原因" style="height: 80px;width: 250px;padding: 0 10px" v-model="changeReason" ></textarea>
            </div>

            <div class="view_btn" style="margin-top: 20px">
                 <span class="btn-blue-s" v-on:click="submitFlow">提交</span>
                 <span class="btn-yellow-s" v-on:click="closeFlow">取消</span>
            </div>
      </div>


      <div class="view_area" style="width: 500px;height: 300px;padding: 5px 20px" v-if="isShowRecord">
            <div class="baoxiao" style="width: 100%;text-align: center;padding: 10px 10px" >
              <span style="font-size: 20px;font-weight: 700">修改记录</span>
            </div>
            
            <div class="peoMenEdit" style="margin-top: 10px" v-for="(reason,k) in reasonList">
                 <div>
                    <span class="prompt">{{ k+1 }}、</span>
                    <span class="prompt">{{ reason.updateDateString }}，{{ reason.userName }}修改金额，由{{ reason.updateModify }}元修改为{{ reason.modify }}元</span>
                 </div>
                 <div>
                    <span class="prompt">修改原因：</span>
                    <span class="prompt">{{ reason.reason }}</span>
                 </div>
                 
            </div>

            <div class="view_btn" style="margin-top: 20px">
                 <span class="btn-yellow-s" v-on:click="closeReason">关闭</span>
            </div>
      </div>
   
      <oa-alert ref="childAlert"></oa-alert>

  </div>


</template>

<style>      
     
      .peoMenEdit .el-input__inner {
        width: 250px;
        height: 30px;
        line-height: 30px;
      }
      .peoMenEdit .el-input__icon {
        line-height: 30px;
      }
    
</style>

<script>
  import $ from 'jquery'
  import oaAlert from '@/components/commonVue/Alert'
    export default {
        name: 'PositionManagement',
        components: {
          'oa-alert': oaAlert
        },
        data () {
            return {               
                path: this.OACommon["publicDef"]["qpath"],
                isShowCover: false,
                isShowFlow: false,
                isShowRecord: false,
                dateTime: '',
                provinceName: '',
                id: '',
                changeTime: '',
                changeMoney: '',
                changeReason: '',
                provinceId: '',
                flowList: [],    //流水遍历
                reasonList: []    //修改原因遍历
                    
            }
        },
        created: function(){
            this.provinceId = this.OACommon.getUrlPara("provinceId");
            this.getFlow();
        },
        methods:{
            getFlow: function(){  //流水列表
                $.ajax({
                    type : "post",
                    async : false,
                    url : this.path + "selectFinanceWater",
                    data : {
                      "jobNumber": localStorage.getItem("jobNumber"),
                      "sessionIdOa": localStorage.getItem("sessionIdOa"),
                      "provinceId": this.provinceId
                    },
                    success : function(data) {
                      if(data.code == 200){
                         this.flowList = data.data;
                         var time = data.data[0].timeOfEntryString;

                         this.dateTime = this.formatDate(new Date(time));
                         this.provinceName = data.data[0].provinceNmae;

                      }else {
                        this.$refs.childAlert.show(data.msg);
                      }

                     
                           
                    }.bind(this),
                    error : function() {
                    }
                });
            },
            addFlow: function(timeOfEntryString,accountAmount,id){ //修改流水
                this.changeTime = timeOfEntryString;
                this.changeMoney = accountAmount;
                this.id = id;
                this.isShowCover = true;
                this.isShowFlow = true;
            },
            inputKey: function(){ //输入框数字校验
              if(isNaN(this.changeMoney) || Number(this.changeMoney) <= 0){
                  this.changeMoney = '';
              }
              var obj = this.changeMoney;

              obj = obj.replace(/[^\d.]/g,"");  //清除“数字”和“.”以外的字符
              obj = obj.replace(/\.{2,}/g,"."); //只保留第一个. 清除多余的
              obj = obj.replace(".","$#$").replace(/\./g,"").replace("$#$",".");
              obj = obj.replace(/^(\-)*(\d+)\.(\d\d).*$/,'$1$2.$3');//只能输入两个小数
              if(obj.indexOf(".")< 0 && obj !=""){//以上已经过滤，此处控制的是如果没有小数点，首位不能为类似于 01、02的金额
                obj= parseFloat(obj);
              }
              this.changeMoney = obj;
            },
            closeFlow: function(){ //关闭修改流水
              this.isShowCover = false;
              this.isShowFlow = false;
            },
            closeReason: function(){ //关闭修改详情
              this.isShowCover = false;
              this.isShowRecord = false;
            },   
            formatDate: function(date){
               var y = date.getFullYear();  
               var m = date.getMonth() + 1;  
               m = m < 10 ? '0' + m : m;  
               var d = date.getDate();  
               d = d < 10 ? ('0' + d) : d;  
               //return y + '-' + m + '-' + d;
               return y + '年' + m + '月';
            },         
            submitFlow: function(){  //提交修改流水
              if(!this.changeTime){
                this.$refs.childAlert.show("请选择修改时间");
                return false;
              }
              if(!this.changeMoney){
                this.$refs.childAlert.show("请填写修改金额");
                return false;
              }
              if(!this.changeReason){
                this.$refs.childAlert.show("请描述修改原因");
                return false;
              }
              $.ajax({
                    type : "post",
                    async : false,
                    url : this.path + "insertOrUpdateFinanceWater",
                    data : {
                      "jobNumber": localStorage.getItem("jobNumber"),
                      "sessionIdOa": localStorage.getItem("sessionIdOa"),
                      "areaId": this.areaId,
                      "provinceId": this.provinceId,
                      "accountAmount": this.changeMoney,
                      "timeString": this.changeTime,
                      "reason": this.changeReason,
                      "id": this.id
                    },
                    success : function(data) {
                      this.isShowCover = false;
                      this.isShowFlow = false;
                      if(data.code == 200){
                          this.$refs.childAlert.show("修改成功",this.getFlow);
                      }else {
                          this.$refs.childAlert.show(data.msg);
                      }
                    
                    }.bind(this),
                    error : function() {
                    }
                });
            },                     
            changeRecord: function(id){  //修改记录
              this.id = id;
              $.ajax({
                    type : "post",
                    async : false,
                    url : this.path + "selectListByFinanceWaterId",
                    data : {
                      "jobNumber": localStorage.getItem("jobNumber"),
                      "sessionIdOa": localStorage.getItem("sessionIdOa"),                    
                      "id": this.id
                    },
                    success : function(data) {
                      if(data.code == 200){
                         this.isShowCover = true;
                         this.isShowRecord = true;
                         this.reasonList = data.data;
                      }else {
                          this.$refs.childAlert.show(data.msg);
                      }
                    
                    }.bind(this),
                    error : function() {
                    }
                });
            },





        }
        
    }
</script>