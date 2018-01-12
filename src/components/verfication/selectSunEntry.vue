<template>
  <div class="hello">
    <div class="gonggao_bread">
        <a href="#/mainIndex/index" class="fa">首页</a>
        &gt;
        <span>费用核销</span>
        &gt;
        <span>选择核销款项</span>
      </div>
      <div class="gonggao_body table_body">
        <div class="money_progress">
          <table cellpadding="0" cellspacing="0">
            <tr class="pro">
              <td align="left" class="cur">
                <i></i>
              </td>
              <td align="right" class="big_cur">
                <i>2</i>
              </td>
              <td>&nbsp;</td>
              <td align="right">
                <i></i>
              </td>
              <td>&nbsp;</td>
              <td align="right">
                <i></i>
              </td>
            </tr>
            <tr class="pro_word">
              <td align="left" class="cur">选择核销条目</td>
              <td align="center" colspan="2" class="cur">选择核销款项</td>
              <td align="center" colspan="2">填写核销具体款项</td>
              <td align="right">提交</td>
            </tr>
          </table>
        </div>

        <div class="money_table">
          <table cellpadding="0" cellspacing="0" border="1">
            <thead>
              <tr>
                <td width="4%" style="text-align:center;">
                  <input type="checkbox" name="allCheck" v-on:click="seclectBox" v-bind:checked="allIdFlag"/>
                </td>
                <td width="12%">费用类型</td>
                <td width="8%">省份</td>
                <td width="12%">额度类型</td>
                <td width="18%">学校</td>
                <td width="10%">客户姓名</td>
                <td width="10%">额度</td>
                <td width="11%">额度用途</td>
                <td width="10%">目标</td>
              </tr>
            </thead>
            <tbody>
              <tr v-for="l in listData">
                <td style="text-align:center;">
                  <input type="checkbox" name="oCheck" v-on:click="pushSonId(l.costDetailId)" v-model="sonIdArr" v-bind:value="l.costDetailId" v-if="l.verificationStatus==1"/>
                </td>
                <td>{{ createDate }}-{{ costategory[costategoryId] }}</td>
                <td>{{ l.provinceName }}</td>
                <td>{{ (l.costTypeName)?l.costTypeName:'N/A' }}</td>
                <td v-if="l.costDetailCustomerVos.length>0"><span v-for="(s, si) in l.costDetailCustomerVos">{{ s.customerName?s.customerName:'N/A' }}<span v-if="si!=l.costDetailCustomerVos.length-1">,</span></span></td>
                <td v-if="l.costDetailCustomerVos.length==0">N/A</td>
                <td>{{ (l.costDetailCustomerVos.length>0)?(l.costDetailCustomerVos[0]["contactsName"]?l.costDetailCustomerVos[0]["contactsName"]:'N/A'):'N/A' }}</td>
                <td>{{ l.quota.toFixed(2) }}</td>
                <td v-if="costategoryId==2&&costTypeExtra==1">
                  材料费：{{ l.materialCost }} <br/>
                  <span>招生人数：{{ l.enrollment }}</span>
                  <br/>
                  用途：{{ l.quotaPurpose }}
                </td>
                <td v-if="costategoryId==2&&costTypeExtra!=1">
                  材料费：{{ l.materialCost }} <br/>
                  <span>天数：{{ l.days }}</span>
                  <br/>
                  用途：{{ l.quotaPurpose }}
                </td>
                <td v-if="l.verificationStatus!=1" colspan="2" align="center" style="color:red;">已于{{ l.verificationDate }}提交核销申请</td>
                <td v-if="costategoryId!=2&&l.verificationStatus==1">{{ l.quotaPurpose }}</td>
                <td width="10%" v-if="l.verificationStatus==1">{{ l.target }}</td>
              </tr>
            </tbody>
          </table>

          <div class="fbtong_btn_div">
            <span class="btn-blue" v-on:click="go2prevList">上一步</span>
            <span class="btn-blue" v-on:click="go2NextList">下一步</span>
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
      costategory: {
        1: "个人统筹费用",
        2: "Extra费用",
        3: "区域费用",
        4: "开课费用"
      },
      listData: [],
      sonIdInitArr: [],      //先把所有子列表id预备起来
      allIdFlag: false,     // false checkbox未点中  true checkbox已点中
      sonIdArr: [],          //提交到下一步的子id集合
      costategoryId: 1,
      createDate: '',
      costTypeExtra: 0      //Extra的课程类型
    }
  },
  created: function () {
    this.getList();
  },
  methods: {
    go2NextList: function(){
      if(this.sonIdArr.length == 0){
        this.$refs.childAlert.show("请勾选需要核销的具体款项");
        return false;
      }
      var sonIds = this.sonIdArr.join(",");
      window.localStorage.setItem("hexiaoids", sonIds);
      this.$router.push('/mainIndex/verfication/confirmMoney?id='+this.costId);
    },
    pushSonId: function(sonId){
      var sonIndex = this.sonIdArr.indexOf(sonId);
      if(sonIndex != -1){    //这个子id已经被放进来了
        this.sonIdArr.splice(sonIndex, 1);
      }else{
        this.sonIdArr.push(sonId);
      }
      this.allIdFlag = (this.sonIdArr.length == this.sonIdInitArr.length)?true:false;
    },
    go2prevList: function(){
      this.$router.push('/mainIndex/verfication/selectEntry');
    },
    seclectBox: function(){
      this.allIdFlag = !this.allIdFlag;
      if(this.allIdFlag){    //顶部checkbox被点中了
        this.sonIdArr = this.sonIdInitArr;
      }else{
        this.sonIdArr = [];
      }
    },
    getList: function(){
      this.costId = this.OACommon.getUrlPara("id");
      $.ajax({
        url: this.path + "verification/findVerificationCostDetails",
        type: "post",
        dataType: "json",
        data: {
          "jobNumber": localStorage.getItem("jobNumber"),
          "sessionIdOa": localStorage.getItem("sessionIdOa"),
          "costId": this.costId
        },
        success: function(data){
          this.costategoryId = data["data"]["costategory"];
          this.createDate = data["data"]["createDate"];
          this.costTypeExtra = data["data"]["costTypeExtra"];

          this.listData = data["data"]["costDetailsList"];
          for(var i=0;i<data["data"]["costDetailsList"].length;i++){
            if(data["data"]["costDetailsList"][i]["verificationStatus"] == 1){
              this.sonIdInitArr.push(data["data"]["costDetailsList"][i]["costDetailId"]);
            }
          }
        }.bind(this),
        error: function(){
          console.log("获取需要核销的款项异常");
        }
      });
    }
  }
}
</script>
<style>
	
</style>

