<template>
  <div class="hello">
      <div class="gonggao_bread">
    <a href="/#/mainIndex/index" class="fa">首页</a>
    &gt;
    <span>行政管理</span>
    &gt;
    <span>审核记录</span>
  </div>
  <div class="search_div">
    <div class="yydo160">
      <label style="margin-left:10px;">开始时间：</label>
      <el-date-picker
          v-model="searchData.searchStartDate"
          type="date"
          format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
          placeholder="选择日期">
        </el-date-picker>

      <label style="margin-left:5px;">结束时间：</label>
      <el-date-picker
          v-model="searchData.searchEndDate"
          type="date"
          format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
          placeholder="选择日期">
        </el-date-picker>
      <label style="margin-left:5px;">资产名称：</label>
      <input type="text" style="width:160px;" v-model="searchData.assetsName"/>
      <span class="btn-blue-s sear_btn" v-on:click="search2AllList">查询</span>
    </div>
  </div>
  <div class="gonggao_body table_body">
    <div class="data_table_head">
      <ul>
        <li class="td10 xh">申请日期</li>
        <li class="td10" style="margin-left:1%;">申请部门</li>
        <li class="td10">资产名称</li>
        <li class="td10">资产类型</li>
        <li class="td10">资产型号</li>
        <li class="td10">资产数量</li>
        <li class="td10">资产单价</li>
        <li class="td10" style="margin-left:1%;">备注</li>
        <li class="td16">状态</li>
      </ul>
    </div>
    <div class="data_table_body">
      <ul v-for="l in cList" v-if="cList.length>0">
        <li class="td10 xh">{{ OACommon.getOADate(new Date(l.createTime)).todayDate }}</li>
        <li class="td10" style="margin-left:1%;">{{ l.deptName }}</li>
        <li class="td10">{{ l.assetName }}</li>
        <li class="td10">{{ l.assetTypeName }}</li>
        <li class="td10">{{ l.assetModel }}</li>
        <li class="td10">{{ l.assetNumber }}</li>
        <li class="td10">{{ l.assetOnePrice?l.assetOnePrice.toFixed(2):'0.00' }}</li>
        <li class="td10" style="margin-left:1%;">
          <a class="table_pa" v-on:click="viewRemark(l.remark)">查看</a>
        </li>
        <li class="td16">
          {{showStatus[l.status] }}
          <a href="javascript:void(0);" class="table_del" v-if="l.status==2" v-on:click="viewReason(l.reason)">查看原因</a>
        </li>
      </ul>
      <ul v-if="cList.length==0">
        <li style="width:100%;text-align:center;color:red;">暂无数据</li>
      </ul>
    </div>
  </div>
  <oa-page ref="childPage"></oa-page>

  <div class="bgpop" v-if="isShowCover"></div>
  <div class="bgpop" v-if="viewData.viewPause" v-on:click="closeView"></div>
  <div class="view_area" v-if="viewData.viewPause" style="width:500px;height:260px;padding:5px 20px">
    <span class="closexx" style="margin-right:10px;" v-on:click="closeView"><Icon type="android-cancel"></Icon></span>
    <div style="font-size: 20px;font-weight: 700;text-align: center;margin-top: 10px">资产备注</div>
    <div style="margin-top:10px;line-height:22px;">{{ viewData.remark }}</div>
    <div class="view_btn" style="margin-top:5px;position:absolute;bottom:16px;width:460px;">
      <span class="btn-blue-s" v-on:click="closeView">关闭</span>
    </div>
  </div>

  <div class="view_area" style="width: 500px;height: 250px;padding: 5px 20px" v-if="isShowReject">

      <div class="content" style="font-size: 20px;font-weight: 700;text-align: center" >拒绝原因</div>
      <div class="menEdit" style="widtH: 100%;height: 120px;margin-top: 30px">
            <label class="label_tit-1" style="width: 70px;height: 40px;line-height: 40px">拒绝原因：</label>
            <textarea readonly style="width: 370px;margin-left: 10px"  class="form_input-5" v-model="reason" ></textarea>
    
      </div>

      
      <div class="view_btn" style="margin-top: 20px">
           <span class="btn-yellow-s" v-on:click="closeReject">取消</span>
      </div>

  </div>



  <oa-alert ref="childAlert"></oa-alert>
  <oa-confirm ref="childConfirm"></oa-confirm>
  <oa-load ref="childLoading"></oa-load>
  </div>
</template>

<script>
import $ from 'jquery'
import oaPage from '@/components/commonVue/Page'
import oaAlert from '@/components/commonVue/Alert'
import oaConfirm from '@/components/commonVue/Confirm'
import Loading from '@/components/commonVue/Loading'

export default {
  name: 'CustomerList',
  components: {
      'oa-page': oaPage,
      'oa-alert': oaAlert,
      'oa-confirm': oaConfirm,
      'oa-load': Loading
    },
  data () {
    return {
      path: this.OACommon["publicDef"]["qpath"],
      isShowCover: false,
      isShowReject: false,
      searchData: {
        searchStartDate: '',
        searchEndDate: '',
        assetsName: ''
      },
      cList: [],
      pageNum: 1,
      pageSize: 10,
      assetApplyId: '',
      showStatus: {
        "1": "待审批",
        "2": "审核拒绝",
        "3": "审核通过",
        "4": "已修改成功"
      },
      action: '',
      viewData: {
        viewPause: false,
        remark: ''
      }
    }
  },
  created: function () {
    //初始化查询日期赋值
    //this.searchData.searchStartDate = this.OACommon.getOADate(new Date()).prevMonthToday;
    //this.searchData.searchEndDate = this.OACommon.getOADate(new Date()).todayDate;
  this.getAllCustomer();
  },
  methods: {
    closeView: function(){
      this.viewData.viewPause = false;
      this.viewData.remark = "";
    },
    viewRemark: function(remark){
      this.viewData.viewPause = true;
      this.viewData.remark = remark?remark:'无';
    },
    search2AllList: function(){
      var st = this.searchData.searchStartDate, et = this.searchData.searchEndDate;
      if(!st){
        st = "";
      }
      st = st.split("-");
      st = Number(st.join(""));
      if(!et){
        et = "";
      }
      et = et.split("-");
      et = Number(et.join(""));
      if(et < st){
        this.$refs.childAlert.show("开始时间不能大于结束时间");
        return false;
      }
      this.getAllCustomer();
    },
    getAllCustomer: function(pn, ps){
      //pn: 当前页数  ps：每页条数
        if(pn && typeof(pn)!='object'){
          this.pageNum = pn;
        }
        if(ps && typeof(ps)!='object'){
          this.pageSize = ps;
        }

      $.ajax({
        url: this.path + "Asset/findHistoryAssetApplyListPage",
        type: 'get',
        dataType: 'json',
        data: {
          "jobNumber": localStorage.getItem("jobNumber"),
          "sessionIdOa": localStorage.getItem("sessionIdOa"),
          "pageNum": this.pageNum,
          "pageSize": this.pageSize,
          "assetName": this.searchData.assetsName,
          "startDate": this.searchData.searchStartDate,
          "endDate": this.searchData.searchEndDate
        },
        success: function(data){
          if(data["code"] == 200){
            this.cList = data["data"]["list"];

            this.$refs.childPage.setArg(data["data"]["pages"], this.pageNum, this.pageSize, this.getAllCustomer);
          }else{
            console.log("服务器异常，请稍后重试");
          }
        }.bind(this),
        error: function (err) {
          console.log('获取列表内容异常')
        }
      })
    },
    Pass: function(assetApplyId){
       this.assetApplyId = assetApplyId;
       this.action = '1';
       this.$refs.childConfirm.show("确定同意本条申请吗？",this.PassSq);       
    },
    PassSq: function(){  
       this.$refs.childLoading.show(); 
       $.ajax({
         url: this.path + "Asset/handlerAssetApply",
         type: "post",
         dataType: "json",
         data: {
           "jobNumber": localStorage.getItem("jobNumber"),
           "sessionIdOa": localStorage.getItem("sessionIdOa"),
           "assetApplyId": this.assetApplyId,
           "action": this.action
         },
         success: function(data){
          this.$refs.childLoading.hide();
          if(data.code == 200){
            this.$refs.childAlert.show("审核通过");
            this.getAllCustomer();
          }else {
            this.$refs.childAlert.show(data["msg"]);
          }
                     
         }.bind(this),
         error: function(){
           console.log("后台异常");
         }
       });
    },
    reject: function(assetApplyId){
      this.isShowCover = true;
      this.isShowReject = true;
      this.assetApplyId = assetApplyId;
    },
    closeReject: function(){
      this.isShowCover = false;
      this.isShowReject = false;
    },
    viewReason: function(reason){
      this.isShowCover = true;
      this.isShowReject = true;
      this.reason = reason;
    }






  }
}
</script>
<style>
  
</style>

