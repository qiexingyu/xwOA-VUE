<template>
  <div class="hello">
      <div class="index_left" style="bottom:0;top:0;width:48%;">
        <div class="index_dt" v-if="indexShowObj.index_top_show">
          <div v-if="indexShowObj.index_kaikesq">
            <a href="javascript:void(0);" class="kksq">开课费用申请</a>
          </div>
          <div v-if="indexShowObj.index_gerentcfysq">
            <a href="#/mainIndex/moneyApply/PersonApply" class="grsq">个人统筹费用申请</a>
          </div>
          <div v-if="indexShowObj.index_Extrasq">
            <a href="#/mainIndex/moneyApply/ExtraApply" class="extrasq">Extra费用申请</a>
          </div>
          <div v-if="indexShowObj.index_hexiao">
            <a href="#/mainIndex/verfication/selectEntry" class="hxsq">核销申请</a>
          </div>
          <div v-if="indexShowObj.index_baoxiao">
            <a href="#/mainIndex/reimbursement/expenseClaim" class="baoxiaosq">报销费用申请</a>
          </div>
          <div v-if="indexShowObj.index_quyusq">
            <a href="#/mainIndex/moneyApply/AreaApply" class="quyusq">区域费用申请</a>
          </div>
          <div v-if="indexShowObj.index_edudb">
            <a href="#/mainIndex/moneyApply/QuotaApply" class="edudb">额度调拨费用申请</a>
          </div>
          <div v-if="indexShowObj.index_kechengap">
            <a href="#/mainIndex/coursePlanApply/coursePlanApply" class="kechengap">课程安排申请</a>
          </div>
        </div>

        <div class="grdb_div" v-bind:style="{'margin-top': indexShowObj.index_top_show?'20px':'0'}" v-if="indexShowObj.index_daib_show">
          <div class="index_n_div" v-bind:style="{'margin-top': indexShowObj.index_top_show?'20px':'0'}">
            <p class="index_mo_tit">
              <span>个人待办</span>
            </p>
            <ul class="index_n_ul">
              <li v-if="indexShowObj.index_daib_feiyongsq">
                <a href="#/mainIndex/moneyApply/PersonToDo">
                  <div></div>
                  <span class="bt">
                    <i></i>费用申请
                  </span>
                  <span class="tm">{{ personTodoFYSQ }}条</span>
                </a>
              </li>
              <li v-if="indexShowObj.index_daib_hexiao">
                <a href="#/mainIndex/verfication/personToDo">
                  <div></div>
                  <span class="bt">
                    <i></i>费用核销
                  </span>
                  <span class="tm">{{ personTodoFYHX }}条</span>
                </a>
              </li>
              <li v-if="indexShowObj.index_daib_baoxiao">
                <a href="#/mainIndex/reimbursement/personalDo">
                  <div></div>
                  <span class="bt">
                    <i></i>报销申请
                  </span>
                  <span class="tm">{{ personTodoBXSQ }}条</span>
                </a>
              </li>
              <li v-if="indexShowObj.index_daib_xingzheng">
                <a href="#/mainIndex/assets/assetsPersonalDo">
                  <div></div>
                  <span class="bt">
                    <i></i>资产申请
                  </span>
                  <span class="tm">{{ personTodoZCSQ }}条</span>
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div class="grdb_div" style="position:absolute;bottom:0;height:auto;overflow-y:auto;" v-bind:style="{'top': noticeTop}">
          <div class="index_n_div" style="padding-top:0;">
            <p class="index_mo_tit">
              <span>通知公告</span>
              <router-link to="/mainIndex/notice/noticeRead">More+</router-link>
            </p>
            <ul class="index_n_ul">
              <li v-for="n in noticeList" v-if="noticeList.length>0">
                <a v-bind:href="'#/mainIndex/notice/noticeDetail?id='+n.noticeId">
                  <div></div>
                  <span class="bt">
                    <i></i>{{ n.noticeTheme }}
                  </span>
                  <span class="tm">{{ OACommon.getOADate(new Date(n.createDate)).todayDate }}</span>
                </a>
              </li>
              <li v-if="noticeList.length==0" style="text-align:center;color:red;line-height:30px;">
                暂无公告数据
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div class="index_right" style="top:0;" v-bind:style="{'bottom':indexShowObj.index_jiashic?'20px':'40px'}">
        <div class="grdb_div" v-if="indexShowObj.index_jiashic">
          <div class="index_n_div">
            <p class="index_mo_tit">
              <span>数据驾驶舱</span>
            </p>
            <div class="jsc_div">
              <div class="dqkh_mo">
                <p class="mo_tit">当前客户统计</p>
                <p class="mo_num">{{ allUser }}</p>
                <p class="mo_tb">
                  <span class="mo_up" v-if="upDownUser==1"></span>
                  <span class="mo_down" v-if="upDownUser!=1"></span>
                  <span class="mo_tbbl" v-if="upDownUser!=1">{{ percentUser?Number(percentUser).toFixed(2):'0.00' }}%</span>
                  <span class="mo_tbx" v-if="upDownUser==1">{{ percentUser?Number(percentUser).toFixed(2):'0.00' }}%</span>
                  <span class="mo_tbpz" style="font-size:12px;">同比上月</span>
                </p>
              </div>
              <div class="syfy_mo">
                <p class="mo_tit">上月费用申请</p>
                <p class="mo_num">{{ OACommon.formatCurrency(expenses) }}</p>
                <p class="mo_tb">
                  <span class="mo_up" v-if="upDownExpenses==1"></span>
                  <span class="mo_down" v-if="upDownExpenses!=1"></span>
                  <span class="mo_tbbl" v-if="upDownExpenses!=1">{{ percentExpenses?Number(percentExpenses).toFixed(2):'0.00' }}%</span>
                  <span class="mo_tbx" v-if="upDownExpenses==1">{{ percentExpenses?Number(percentExpenses).toFixed(2):'0.00' }}%</span>
                  <span class="mo_tbpz" style="font-size:12px;">同比上月</span>
                </p>
              </div>
              <div class="syhx_mo">
                <p class="mo_tit">上月核销</p>
                <p class="mo_num">{{ OACommon.formatCurrency(expensesHx) }}</p>
                <p class="mo_tb">
                  <span class="mo_up" v-if="upDownHx==1"></span>
                  <span class="mo_down" v-if="upDownHx!=1"></span>
                  <span class="mo_tbbl" v-if="upDownHx!=1">{{ percentHx?Number(percentHx).toFixed(2):'0.00' }}%</span>
                  <span class="mo_tbx" v-if="upDownHx==1">{{ percentHx?Number(percentHx).toFixed(2):'0.00' }}%</span>
                  <span class="mo_tbpz" style="font-size:12px;">同比上月</span>
                </p>
              </div>
            </div>
          </div>
        </div>

        <div class="grdb_div" style="position:absolute;bottom:0;left:0;right:0;overflow-y:auto;" v-bind:style="{'height':indexShowObj.index_jiashic?'auto':'100%', 'top':indexShowObj.index_jiashic?'286px':'0'}">
          <div class="index_n_div" style="padding-top:0;">
            <div class="index_mo_tit">
              <span>通讯录</span>
              <div class="txl_mo_sear_div">
                <input type="text" placeholder="请输入姓名" v-model="userAddress.userName"/>
                <a href="javascript:void(0);" v-on:click="findUserPageList(userAddress.userName)"></a>
              </div>
            </div>
            <ul class="index_txl_ul" v-bind:style="{'height':indexShowObj.index_jiashic?'230px':'auto'}" style="height:auto;overflow:visible;">
              <li v-for="u in userAddress.userList">
                <span class="txl_s1">{{ u.userName }}</span>
                <span class="txl_s2">{{ (u.positionList.length>0)?u.positionList[0]["positionName"]:'' }}</span>
                <span class="txl_s3">{{ u.userPhone.substring(0, 3) }}&nbsp;&nbsp;{{ u.userPhone.substring(3, 7) }}&nbsp;&nbsp;{{ u.userPhone.substring(7, 11) }}</span>
              </li>
            </ul>
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
  name: 'Login',
  components: {
          'oa-alert': oaAlert
  },
  data () {
    return {
      path: this.OACommon["publicDef"]["qpath"],
      userAddress: {
        userList: [],                //通讯录
        userName: ''
      },
      areaId: '',
      allUser: '', //当前客户统计
      percentUser: '', //当前客户统计较上月百分比
      upDownUser: '1', //增长或者减少
      expenses: '', //费用申请统计
      percentExpenses: '', //费用申请统计较上月百分比
      upDownExpenses: '1', //费用申请增长或者减少
      expensesHx: '', //核销申请统计
      percentHx: '', //核销申请统计较上月百分比
      upDownHx: '1', //核销申请增长或者减少
      personTodoFYSQ: 0,            //个人待办-费用申请=个数
      personTodoFYHX: 0,             //个人待办-费用申请=个数
      personTodoBXSQ: 0,             //个人待办-费用报销=个数
      personTodoZCSQ: 0,             //个人待办-资产申请=个数
      noticeList: [],                //公告列表
      indexShowObj: {
        index_top_show: false,      //首页顶部是否显示
        index_gerentcfysq: false,   //个人统筹费用申请
        index_Extrasq: false,       //Extra费用申请
        index_hexiao: false,         //核销申请
        index_quyusq: false,         //区域费用申请
        index_edudb: false,           //额度调拨
        index_baoxiao: false,          //报销申请
        index_kaikesq: false,         //开课费用申请
        index_kechengap: false,        //课程安排申请
        index_daib_show: false,       //个人待办是否显示
        index_daib_feiyongsq: false,  //个人待办-费用申请
        index_daib_hexiao: false,     //个人待办-费用核销
        index_daib_baoxiao: false,    //个人待办-报销申请
        index_daib_xingzheng: false,   //个人待办-行政申请
        index_jiashic: false          //数据驾驶舱
      },
      noticeTop: 0
    }
  },
  created: function(){
    this.initButtonPermission();       //首页功能权限赋值
    this.findUserPageList("");
    this.getPersonTodoFYSQ();
    this.getPersonTodoFYHX();
    this.getPersonTodoBXSQ();
    this.getPersonTodoZCSQ();
    this.getNoticeList();
    this.userArea();
  },
  methods: {
    initButtonPermission: function(){
      var buttonPermissionList = localStorage.getItem("buttonPermissionList");
      buttonPermissionList = JSON.parse(localStorage.getItem("buttonPermissionList"));

      for(var i=0;i<buttonPermissionList.length;i++){
        this.indexShowObj[buttonPermissionList[i]["permissionCode"]] = true;
      }

      //设置首页通知公告的top值
      if(this.indexShowObj.index_top_show&&this.indexShowObj.index_daib_show){
        this.noticeTop = "362px";
      }else if(!this.indexShowObj.index_top_show&&this.indexShowObj.index_daib_show){
        this.noticeTop = "195px";
      }else if(this.indexShowObj.index_top_show&&!this.indexShowObj.index_daib_show){
        this.noticeTop = "147px";
      }else if(!this.indexShowObj.index_top_show&&!this.indexShowObj.index_daib_show){
        this.noticeTop = "-20px";
      }
    },
    getNoticeList: function(){
      $.ajax({
        url: this.path + "showNanicList",
        type: "post",
        dataType: "json",
        data: {
          "jobNumber": localStorage.getItem("jobNumber"),
          "sessionIdOa": localStorage.getItem("sessionIdOa"),
          "startTimeString": "",
          "endTimeString": "",
          "pageNum": 1,
          "pageSize": 8,
        },
        success: function(data){
          this.noticeList = data["data"]["list"];
        }.bind(this),
        error: function(){
          console.log("获取通知列表异常");
        }
      });
    },
    findUserPageList: function(userName){
      $.ajax({
        url: this.path + "findUserPageListByUserName",
        type: "get",
        dataType: "json",
        data: {
          "jobNumber": localStorage.getItem("jobNumber"),
          "sessionIdOa": localStorage.getItem("sessionIdOa"),
          "userName": userName
        },
        success: function(data){
          this.userAddress.userList = data["data"]["list"];
        }.bind(this),
        error: function(){
          console.log("获取通讯录异常");
        }
      });
    },
    getPersonTodoFYSQ: function(){
      $.ajax({
        url: this.path + "selectFeeApplication",
        type: "post",
        dataType: "json",
        data: {
          "jobNumber": localStorage.getItem("jobNumber"),
          "sessionIdOa": localStorage.getItem("sessionIdOa"),
          "startTime": "",
          "endTime": "",
          "costCategory": 0,
          "pageNum": 1,
          "pageSize": 2,
          "status": 2
        },
        success: function(data){
          this.personTodoFYSQ = data["data"]["total"];
        }.bind(this),
        error: function(){
          console.log("获取费用申请-个人待办异常");
        }
      });
    },
    getPersonTodoFYHX: function(){
      $.ajax({
        url: this.path + "verification/findPersonTaskListPage",
        type: "post",
        dataType: "json",
        data: {
          "jobNumber": localStorage.getItem("jobNumber"),
          "sessionIdOa": localStorage.getItem("sessionIdOa"),
          "startDate": "",
          "endDate": "",
          "pageNum": 1,
          "pageSize": 2
        },
        success: function(data){
          this.personTodoFYHX = data["data"]["total"];
        }.bind(this),
        error: function(){
          console.log("获取费用核销-个人待办异常");
        }
      });
    },
    getPersonTodoBXSQ: function(){
      $.ajax({
        url: this.path + "reimbursement/findPersonTaskListPage",
        type: "post",
        dataType: "json",
        data: {
          "jobNumber": localStorage.getItem("jobNumber"),
          "sessionIdOa": localStorage.getItem("sessionIdOa"),
          "startDate": "",
          "endDate": ""
        },
        success: function(data){
          this.personTodoBXSQ = data["data"]["total"];
        }.bind(this),
        error: function(){
          console.log("获取报销费用-个人待办异常");
        }
      });
    },
    getPersonTodoZCSQ: function(){
      $.ajax({
        url: this.path + "Asset/findPersonTaskListPage",
        type: "post",
        dataType: "json",
        data: {
          "jobNumber": localStorage.getItem("jobNumber"),
          "sessionIdOa": localStorage.getItem("sessionIdOa"),
          "startDate": "",
          "endDate": ""
        },
        success: function(data){
          this.personTodoZCSQ = data["data"]["total"];
        }.bind(this),
        error: function(){
          console.log("获取资产申请-个人待办异常");
        }
      });
    },
    userArea: function(){  //判断全国还是区域
      $.ajax({
         type : "get",
         url : this.path + "findCurrentUserAreaList",
         data : {
           "jobNumber": localStorage.getItem("jobNumber"),
           "sessionIdOa": localStorage.getItem("sessionIdOa")         
         },
         success : function(data) {
           if(data.code == 200){ 
               if(data.code == 200){ 
                   this.areaList = data["data"];
                   if(data["data"].length == 1){
                       this.areaId = data.data[0].areaId;                      
                       this.getEchartZxArea();
                       this.getEchartPieAllqy();
                       this.getHxArea();
                   }else {
                       this.getEchartZx();
                       this.getEchartPieAll();
                       this.getHx();
                   }               
               }             
           }
    
         }.bind(this),
         error : function() {
         }
      });
    }, 
    getEchartZx: function(){  //客户数量（全国）          
        this.startTimeString = this.formatDate2(new Date()) +"01";
        this.endTimeString = this.formatDate1(new Date()) +"01";  
        $.ajax({
            type : "post",
            url : this.path + "findAllCustomerNumIncrease",
            data : {
              "jobNumber": localStorage.getItem("jobNumber"),
              "sessionIdOa": localStorage.getItem("sessionIdOa"),
              "startTimeString": this.startTimeString,
              "endTimeString": this.endTimeString
            },
            success : function(data) {
              if(data.code == 200){
                 var thisMonth = data["data"][1].number;
                 this.allUser = data["data"][1].number + data["data"][0].number + data["data"][0].numIncrease;
                 var lastMonth = data["data"][0].number;
                 if(lastMonth == "0"){
                   this.percentUser = 0;
                 }else {
                    var per = (Number(thisMonth) - Number(lastMonth))/Number(lastMonth)
                    if(per >= 0){
                       this.upDownUser = "1";
                    }else {
                      this.upDownUser = "0";
                    }
                    this.percentUser = (per*100).toFixed(2);
                 }

              }else {
                this.$refs.childAlert.show(data.msg);
              }

              }.bind(this),
            error : function() {
            }
        });
    }, 
    getEchartZxArea: function(){  //客户数量（区域）          
        this.startTimeString = this.formatDate2(new Date()) +"01";
        this.endTimeString = this.formatDate1(new Date()) +"01";  
        $.ajax({
            type : "post",
            url : this.path + "findAllCustomerNumIncrease",
            data : {
              "jobNumber": localStorage.getItem("jobNumber"),
              "sessionIdOa": localStorage.getItem("sessionIdOa"),
              "startTimeString": this.startTimeString,
              "endTimeString": this.endTimeString,
              "areaId": this.areaId
            },
            success : function(data) {
              if(data.code == 200){
                 var thisMonth = data["data"][1].number;

                 this.allUser = data["data"][1].number + data["data"][0].numIncrease;
   
                 var lastMonth = data["data"][0].number;
                 if(lastMonth == "0"){
                   this.percentUser = 0;
                 }else {
                    var per = (Number(thisMonth) - Number(lastMonth))/Number(lastMonth)
                    if(per >= 0){
                       this.upDownUser = "1";
                    }else {
                      this.upDownUser = "0";
                    }
                    this.percentUser = (per*100).toFixed(2);
                 }

              }else {
                 this.$refs.childAlert.show(data.msg);
              }
              

              
            }.bind(this),
            error : function() {
            }
        });
    }, 
    formatDate1: function(date){ //时间转化上一个月
       var y = date.getFullYear();  
       var m = date.getMonth();  
       //var m = date.getMonth() + 1; 
       if(m > 12){
         y = Number(y) + Number(1);
         m = m - 12;
       } 
       if(m <= 0){
         y = Number(y) - Number(1);
         m = 12 + m;
       }       
       m = m < 10 ? '0' + m : m;  
       var d = date.getDate();  
       d = d < 10 ? ('0' + d) : d;  
       return y + '-' + m + '-';
    },
    formatDate2: function(date){ //时间转化上上个月
       var y = date.getFullYear();  
       var m = date.getMonth() - 1;  
       //var m = date.getMonth();
       if(m > 12){
         y = Number(y) + Number(1);
         m = m - 12;
       }
       if(m <= 0){
         y = Number(y) - Number(1);
         m = 12 + m;
       }
       m = m < 10 ? '0' + m : m;  
       var d = date.getDate();  
       d = d < 10 ? ('0' + d) : d;  
       return y + '-' + m + '-';
    },
    getEchartPieLast: function(){  //上上月费用申请（全国）
        this.startTimeString = this.formatDate2(new Date()) +"01"; 
        $.ajax({
            type : "post",
            url : this.path + "selectCostStaticTrendSum",
            data : {
              "jobNumber": localStorage.getItem("jobNumber"),
              "sessionIdOa": localStorage.getItem("sessionIdOa"),
              "timeString": this.startTimeString
            },
            success : function(data) {
              if(data.code == 200){
                var lastMoney = 0;
                for(var i=0;i<data.data.length;i++){
                   if(data["data"][i].money == null){
                      data["data"][i].money = 0;
                   }
                   lastMoney += data["data"][i].money
                }
                 if(lastMoney == "0"){
                   this.percentExpenses = 0;
                 }else {
                    var per = (Number(this.expenses) - Number(lastMoney))/Number(lastMoney)
                    if(per >= 0){
                       this.upDownExpenses = "1";
                    }else {
                      this.upDownExpenses = "0";
                    }
                    this.percentExpenses = (per*100).toFixed(2);
                 }
             
              }else {
                 this.$refs.childAlert.show(data.msg);
              }
                         
            }.bind(this),
            error : function() {
            }
            
        });
    },
    getEchartPieAll: function(){  //上月费用申请（全国）
        this.endTimeString = this.formatDate1(new Date()) +"01"; 
        $.ajax({
            type : "post",
            url : this.path + "selectCostStaticTrendSum",
            data : {
              "jobNumber": localStorage.getItem("jobNumber"),
              "sessionIdOa": localStorage.getItem("sessionIdOa"),
              "timeString": this.endTimeString
            },
            success : function(data) {
              if(data.code == 200){
                var thismoney = 0;
                for(var i=0;i<data.data.length;i++){
                   if(data["data"][i].money == null){
                      data["data"][i].money = 0;
                   }
                   thismoney += data["data"][i].money
                }
                this.expenses = thismoney;
                this.getEchartPieLast();
              }else {
                 this.$refs.childAlert.show(data.msg);
              }

                          
            }.bind(this),
            error : function() {
            }
            
        });
    },
    getEchartPieLastqy: function(){  //上上月费用申请（区域）
        this.startTimeString = this.formatDate2(new Date()) +"01"; 
        $.ajax({
            type : "post",
            url : this.path + "selectCostStaticTrendSum",
            data : {
              "jobNumber": localStorage.getItem("jobNumber"),
              "sessionIdOa": localStorage.getItem("sessionIdOa"),
              "timeString": this.startTimeString,
              "areaId": this.areaId
            },
            success : function(data) {
              if(data.code == 200){
                var lastMoney = 0;
                for(var i=0;i<data.data.length;i++){
                   if(data["data"][i].money == null){
                      data["data"][i].money = 0;
                   }
                   lastMoney += data["data"][i].money
                }
                 if(lastMoney == "0"){
                   this.percentExpenses = 0;
                 }else {
                    var per = (Number(this.expenses) - Number(lastMoney))/Number(lastMoney)
                    if(per >= 0){
                       this.upDownExpenses = "1";
                    }else {
                      this.upDownExpenses = "0";
                    }
                    this.percentExpenses = (per*100).toFixed(2);
                 }

              }else {
                 this.$refs.childAlert.show(data.msg);
              }
                         
            }.bind(this),
            error : function() {
            }
            
        });
    },
    getEchartPieAllqy: function(){  //上月费用申请（区域）
        this.endTimeString = this.formatDate1(new Date()) +"01"; 
        $.ajax({
            type : "post",
            url : this.path + "selectCostStaticTrendSum",
            data : {
              "jobNumber": localStorage.getItem("jobNumber"),
              "sessionIdOa": localStorage.getItem("sessionIdOa"),
              "timeString": this.endTimeString,
              "areaId": this.areaId
            },
            success : function(data) {
              if(data.code == 200){
                var thismoney = 0;
                for(var i=0;i<data.data.length;i++){
                   if(data["data"][i].money == null){
                      data["data"][i].money = 0;
                   }
                   thismoney += data["data"][i].money
                }
                this.expenses = thismoney;
                this.getEchartPieLastqy();
              }else {
                 this.$refs.childAlert.show(data.msg);
              }

                          
            }.bind(this),
            error : function() {
            }
            
        });
    },
    getHxLast: function(){  //上上月核销申请（全国）
        this.startTimeString = this.formatDate2(new Date()) +"01"; 
        $.ajax({
            type : "post",
            url : this.path + "selectCheckStaticTrendSum",
            data : {
              "jobNumber": localStorage.getItem("jobNumber"),
              "sessionIdOa": localStorage.getItem("sessionIdOa"),
              "timeString": this.startTimeString
            },
            success : function(data) {
              if(data.code == 200){
                var lastMoney = 0;
                for(var i=0;i<data.data.length;i++){
                   if(data["data"][i].money == null){
                      data["data"][i].money = 0;
                   }
                   lastMoney += data["data"][i].money
                }
                if(lastMoney == "0"){
                   this.percentHx = 0;
                }else {
                    var per = (Number(this.expensesHx) - Number(lastMoney))/Number(lastMoney)
                    if(per >= 0){
                       this.upDownHx = "1";
                    }else {
                      this.upDownHx = "0";
                    }
                    this.percentHx = (per*100).toFixed(2);
                 }
             
              }else {
                 this.$refs.childAlert.show(data.msg);
              }
                         
            }.bind(this),
            error : function() {
            }
            
        });
    },
    getHx: function(){  //上月核销申请（全国）
        this.endTimeString = this.formatDate1(new Date()) +"01"; 
        $.ajax({
            type : "post",
            url : this.path + "selectCheckStaticTrendSum",
            data : {
              "jobNumber": localStorage.getItem("jobNumber"),
              "sessionIdOa": localStorage.getItem("sessionIdOa"),
              "timeString": this.endTimeString
            },
            success : function(data) {
              if(data.code == 200){
                var thismoney = 0;
                for(var i=0;i<data.data.length;i++){
                   if(data["data"][i].money == null){
                      data["data"][i].money = 0;
                   }
                   thismoney += data["data"][i].money
                }
                this.expensesHx = thismoney;
                this.getHxLast();
              }else {
                 this.$refs.childAlert.show(data.msg);
              }



                          
            }.bind(this),
            error : function() {
            }
            
        });
    },
    getHxLastArea: function(){  //上上月核销申请（区域）
        this.startTimeString = this.formatDate2(new Date()) +"01"; 
        $.ajax({
            type : "post",
            url : this.path + "selectCheckStaticTrendSum",
            data : {
              "jobNumber": localStorage.getItem("jobNumber"),
              "sessionIdOa": localStorage.getItem("sessionIdOa"),
              "timeString": this.startTimeString,
              "areaId": this.areaId
            },
            success : function(data) {
              if(data.code == 200){
                var lastMoney = 0;
                for(var i=0;i<data.data.length;i++){
                   if(data["data"][i].money == null){
                      data["data"][i].money = 0;
                   }
                   lastMoney += data["data"][i].money
                }
                if(lastMoney == "0"){
                   this.percentHx = 0;
                }else {
                    var per = (Number(this.expensesHx) - Number(lastMoney))/Number(lastMoney)
                    if(per >= 0){
                       this.upDownHx = "1";
                    }else {
                      this.upDownHx = "0";
                    }
                    this.percentHx = (per*100).toFixed(2);
                 }
             
              }else {
                 this.$refs.childAlert.show(data.msg);
              }
                         
            }.bind(this),
            error : function() {
            }
            
        });
    },
    getHxArea: function(){  //上月核销申请（全国）
        this.endTimeString = this.formatDate1(new Date()) +"01"; 
        $.ajax({
            type : "post",
            url : this.path + "selectCheckStaticTrendSum",
            data : {
              "jobNumber": localStorage.getItem("jobNumber"),
              "sessionIdOa": localStorage.getItem("sessionIdOa"),
              "timeString": this.endTimeString,
              "areaId": this.areaId
            },
            success : function(data) {
              if(data.code == 200){
                var thismoney = 0;
                for(var i=0;i<data.data.length;i++){
                   if(data["data"][i].money == null){
                      data["data"][i].money = 0;
                   }
                   thismoney += data["data"][i].money
                }
                this.expensesHx = thismoney;
                this.getHxLastArea();
              }else {
                 this.$refs.childAlert.show(data.msg);
              }



                          
            }.bind(this),
            error : function() {
            }
            
        });
    }
    
   

  }
}
</script>


