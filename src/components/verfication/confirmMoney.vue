<template>
  <div class="hello">
    <div class="gonggao_bread">
        <a href="#/mainIndex/index" class="fa">首页</a>
        &gt;
        <span>费用核销</span>
        &gt;
        <span>确认核销具体款项</span>
      </div>
      <div class="gonggao_body table_body">
        <div class="money_progress">
          <table cellpadding="0" cellspacing="0">
            <tr class="pro">
              <td align="left" class="cur">
                <i></i>
              </td>
              <td align="right" class="cur">
                <i></i>
              </td>
              <td class="cur">&nbsp;</td>
              <td align="right" class="big_cur">
                <i>3</i>
              </td>
              <td class="cur">&nbsp;</td>
              <td align="right">
                <i></i>
              </td>
            </tr>
            <tr class="pro_word">
              <td align="left" class="cur">选择核销条目</td>
              <td align="center" colspan="2" class="cur">选择核销款项</td>
              <td align="center" colspan="2" class="cur">填写核销具体款项</td>
              <td align="right">提交</td>
            </tr>
          </table>
        </div>

        <div class="money_table">
          <table cellpadding="0" cellspacing="0" border="1">
            <thead>
              <tr>
                <td width="9%" align="center">费用类型</td>
                <td width="8%">省份</td>
                <td width="9%">额度类型</td>
                <td width="11%">学校</td>
                <td width="9%">客户姓名</td>
                <td width="8%">额度</td>
                <td width="15%">额度用途</td>
                <td width="12%">目标</td>
                <td width="9%">实际花费</td>
                <td width="10%">备注</td>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(l, i) in listData">
                <td v-bind:rowspan="listData.length" v-if="i==0" align="center">{{ createDate }}<br/>{{ costategory[costategoryId] }}</td>
                <td>{{ l.provinceName }}</td>
                <td>{{ (l.costTypeName)?l.costTypeName:'N/A' }}</td>
                <td v-if="l.costDetailCustomerVos.length>0"><span v-for="(s, si) in l.costDetailCustomerVos">{{ s.customerName?s.customerName:'N/A' }}<span v-if="si!=l.costDetailCustomerVos.length-1">,</span></span></td>
                <td v-if="l.costDetailCustomerVos.length==0">N/A</td>
                <td>{{ (l.costDetailCustomerVos.length>0)?(l.costDetailCustomerVos[0]["contactsName"]?l.costDetailCustomerVos[0]["contactsName"]:'N/A'):'N/A' }}</td>
                <td>{{ l.quota.toFixed(2) }}</td>
                <td v-if="costategoryId==2&&costTypeExtra==1">
                  材料费：{{ l.materialCost.toFixed(2) }} <br/>
                  <span>招生人数：{{ l.enrollment }}</span>
                  <br/>
                  用途：{{ l.quotaPurpose }}
                </td>
                <td v-if="costategoryId==2&&costTypeExtra!=1">
                  材料费：{{ l.materialCost.toFixed(2) }} <br/>
                  <span>天数：{{ l.days }}</span>
                  <br/>
                  用途：{{ l.quotaPurpose }}
                </td>
                <td v-if="costategoryId!=2">{{ l.quotaPurpose }}</td>
                <td>{{ l.target }}</td>
                <td style="text-align:center;">
                  <div class="ftip_div">
                    <input type="text" style="width:68px;" v-model="remarkAndMoney[i]['actualCostSalesMoney']" v-on:blur="moneyBlur(i)"/>
                    <div class="smalltip" v-if="remarkAndMoney[i]['moneyErrShow']">
                      <i>◆</i>
                      {{ remarkAndMoney[i]["moneyErrTip"] }}
                    </div>
                  </div>
                </td>
                <td>
                  <div class="ftip_div">
                    <div class="smalltip" v-if="remarkAndMoney[i]['remarkShow']">
                      <i>◆</i>
                      {{ remarkAndMoney[i]["remarkTip"] }}
                    </div>
                    <textarea maxlength="200" v-model="remarkAndMoney[i]['remark']" style="height:70px;" placeholder="最多输入200个字"></textarea>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>

          <div class="fbtong_btn_div">
            <span class="btn-blue" v-on:click="go2prevList" v-if="!urlVerificationId">上一步</span>
            <span class="btn-blue" v-on:click="go2Sub">提交</span>
          </div>
        </div>
      </div>

      <oa-alert ref="childAlert"></oa-alert>
  </div>
</template>

<script>
import $ from 'jquery'
import oaAlert from '@/components/commonVue/Alert'

export default {
  name: 'selectSunEnrty',
  components: {
      'oa-alert': oaAlert
    },
  data () {
    return {
      path: this.OACommon["publicDef"]["qpath"],
      costId: '',           //主id
      sonIds: '',            //子id
      costategory: {
        1: "个人统筹费用",
        2: "Extra费用",
        3: "区域费用",
        4: "开课费用"
      },
      listData: [],
      costategoryId: 1,
      createDate: '',
      costTypeExtra: 0,      //Extra的课程类型
      urlVerificationId: 0,      //修改重提id
      remarkAndMoney: [],     //花费和备注集合
      subPause: true          //避免重复提交
    }
  },
  created: function () {
    this.costId = this.OACommon.getUrlPara("id");
    var nurlVerificationId = this.OACommon.getUrlPara("verificationId");     //修改重提id
    this.urlVerificationId = nurlVerificationId?nurlVerificationId:0;    
    this.sonIds = window.localStorage.getItem("hexiaoids");

    if(!this.urlVerificationId){    
      this.getList();
    }else{                              //修改重提
      this.getResubList();    
    }
  },
  methods: {
    getResubList: function(){
      $.ajax({
        url: this.path + "verification/findVerificationCostDetailsThree",
        type: "post",
        dataType: "json",
        data: {
          "jobNumber": localStorage.getItem("jobNumber"),
          "sessionIdOa": localStorage.getItem("sessionIdOa"),
          "verificationId": this.urlVerificationId
        },
        success: function(data){
          this.costId = data["data"]["costId"];
          this.costategoryId = data["data"]["costategory"];
          this.createDate = data["data"]["createDate"];
          this.costTypeExtra = data["data"]["costTypeExtra"];

          this.listData = data["data"]["costDetailsList"];

          //花费和备注集合
          for(var i=0;i<data["data"]["costDetailsList"].length;i++){
            this.remarkAndMoney.push({
              "costDetailsId": data["data"]["costDetailsList"][i]["costDetailId"],         
              "quota": data["data"]["costDetailsList"][i]["quota"],                                            //额度
              "actualCostSalesMoney": data["data"]["costDetailsList"][i]["actualCostSalesMoney"],              //填写嘚实际花费,最后要计算，不能大于"额度"
              "remark": data["data"]["costDetailsList"][i]["remark"],
              "moneyErrTip": '',
              "moneyErrShow": false,
              "remarkTip": '',
              "remarkShow": false
            });
          }
        }.bind(this),
        error: function(){
          console.log("获取修改重提列表异常");
        }
      });
    },
    remarkBlur: function(i){
      if(!this.remarkAndMoney[i]["remark"]){
        this.remarkAndMoney[i]["remarkTip"] = "请输入备注信息"
        this.remarkAndMoney[i]["remarkShow"] = true;
      }else{
        this.remarkAndMoney[i]["remarkTip"] = "";
        this.remarkAndMoney[i]["remarkShow"] = false;
      }
    },
    go2Sub: function(){
      for(var j=0;j<this.remarkAndMoney.length;j++){
        this.remarkAndMoney[j]["moneyErrTip"] = "";
        this.remarkAndMoney[j]["moneyErrShow"] = false;
        this.remarkAndMoney[j]["remarkTip"] = "";
        this.remarkAndMoney[j]["remarkShow"] = false;
      }

      var subFlag = true;
      for(var i=0;i<this.remarkAndMoney.length;i++){
        if(!this.remarkAndMoney[i]["actualCostSalesMoney"]){
          subFlag = false;
          this.remarkAndMoney[i]["moneyErrTip"] = "实际花费金额不正确"
          this.remarkAndMoney[i]["moneyErrShow"] = true;
          break;
        }
        if(Number(this.remarkAndMoney[i]["actualCostSalesMoney"]) > Number(this.remarkAndMoney[i]["quota"])){
          subFlag = false;
          this.remarkAndMoney[i]["moneyErrTip"] = "不允许大于费用申请额度"
          this.remarkAndMoney[i]["moneyErrShow"] = true;
          break;
        }
        /*if(!this.remarkAndMoney[i]["remark"]){
          subFlag = false;
          this.remarkAndMoney[i]["remarkTip"] = "请输入备注信息"
          this.remarkAndMoney[i]["remarkShow"] = true;
          break;
        }*/
      }

      if(!subFlag){
        return false;
      }

      //组装提交数据
      var verificationString = "[", verificationTotalMoney = 0, ml = this.remarkAndMoney.length;
      for(var m=0;m<ml;m++){
        verificationTotalMoney += Number(this.remarkAndMoney[m]["actualCostSalesMoney"]);

        verificationString += "{";
        verificationString += "\"costDetailsId\":\""+ this.remarkAndMoney[m]["costDetailsId"] +"\",";
        verificationString += "\"actualCostSalesMoney\":\""+ this.remarkAndMoney[m]["actualCostSalesMoney"] +"\",";
        verificationString += "\"remark\":\""+ this.remarkAndMoney[m]["remark"] +"\"";
        verificationString += "}";
        if(m != ml-1){
          verificationString += ",";
        }
      }
      verificationString += "]";

      verificationTotalMoney = verificationTotalMoney.toFixed(2);

      if(!this.subPause){
        return false;
      }
      this.subPause = false;

      $.ajax({
        url: this.path + "verification/insertVerification",
        type: "post",
        dataType: "json",
        data: {
          "jobNumber": localStorage.getItem("jobNumber"),
          "sessionIdOa": localStorage.getItem("sessionIdOa"),
          "costId": this.costId,
          "verificationString": verificationString,
          "verificationId": this.urlVerificationId,
          "verificationTotalMoney": verificationTotalMoney
        },
        success: function(data){
          if(data["code"] == 200){
            this.$refs.childAlert.show("提交成功", function(){
              this.$router.push('/mainIndex/verfication/verProgressSearch');
            });
          }else{
            this.subPause = true;
            this.$refs.childAlert.show(data["msg"]);
          }
        }.bind(this),
        error: function(){
          this.subPause = true;
          console.log("提交数据异常");
        }
      });
    },
    moneyBlur: function(i){
      var money = this.remarkAndMoney[i]["actualCostSalesMoney"];
      var reg = /(^[0-9]*$)|(^[0-9]*[\.]{1}[0-9]{1,2}$)/;
      var edvalNum = 0;
      if(!reg.test(money)){
        if(isNaN(money)){
          this.remarkAndMoney[i]["actualCostSalesMoney"] = "";
          return false;
        }
        if(Number(money) <= 0){
          this.remarkAndMoney[i]["actualCostSalesMoney"] = "";
          return false;
        }
        if(!isNaN(money) || money.indexOf(".")!=-1 || money.split(".")[1].length>2){
          edvalNum = money.split(".")[0] + "." + money.split(".")[1].substring(0, 2);
          this.remarkAndMoney[i]["actualCostSalesMoney"] = Number(edvalNum).toFixed(2);
        }else{
          this.remarkAndMoney[i]["actualCostSalesMoney"] = "";
        }
      }else{
        if(Number(money) > Number(this.remarkAndMoney[i]["quota"])){
          this.remarkAndMoney[i]["actualCostSalesMoney"] = "";
          this.remarkAndMoney[i]["moneyErrTip"] = "不允许大于费用申请额度"
          this.remarkAndMoney[i]["moneyErrShow"] = true;
        }else{
          if(!money){
            this.remarkAndMoney[i]["actualCostSalesMoney"] = "";
            return false;
          }
          this.remarkAndMoney[i]["actualCostSalesMoney"] = Number(money).toFixed(2);
          this.remarkAndMoney[i]["moneyErrTip"] = ""
          this.remarkAndMoney[i]["moneyErrShow"] = false;
        }
      }
    },
    go2prevList: function(){
      this.$router.push('/mainIndex/verfication/selectSunEntry?id='+this.costId);
      window.localStorage.removeItem("hexiaoids");
    },
    getList: function(){
      $.ajax({
        url: this.path + "verification/findVerificationCostDetailsTwo",
        type: "post",
        dataType: "json",
        data: {
          "jobNumber": localStorage.getItem("jobNumber"),
          "sessionIdOa": localStorage.getItem("sessionIdOa"),
          "costId": this.costId,
          "costDetailIds": this.sonIds
        },
        success: function(data){
          this.costategoryId = data["data"]["costategory"];
          this.createDate = data["data"]["createDate"];
          this.costTypeExtra = data["data"]["costTypeExtra"];

          this.listData = data["data"]["costDetailsList"];

          //花费和备注集合
          for(var i=0;i<data["data"]["costDetailsList"].length;i++){
            this.remarkAndMoney.push({
              "costDetailsId": data["data"]["costDetailsList"][i]["costDetailId"],         
              "quota": data["data"]["costDetailsList"][i]["quota"],                             //额度
              "actualCostSalesMoney": "",                                                          //填写嘚实际花费,最后要计算，不能大于"额度"
              "remark": '',
              "moneyErrTip": '',
              "moneyErrShow": false,
              "remarkTip": '',
              "remarkShow": false
            });
          }
        }.bind(this),
        error: function(){
          console.log("获取款项列表异常");
        }
      });
    }
  }
}
</script>
<style>
	
</style>

