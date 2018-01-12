<template>
  <div class="hello">
    <div class="gonggao_bread">
        <a href="#/mainIndex/index" class="fa">首页</a>
        &gt;
        <span>课程安排管理</span>
        &gt;
        <span>场地申请查询</span>
      </div>
      <div class="search_div yydo">
        <label>时间：</label>
        <el-date-picker
            v-model="searchData.startDate"
            type="date"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
            placeholder="选择日期">
          </el-date-picker>

        <span class="zhi">至</span>

        <el-date-picker
            v-model="searchData.endDate"
            type="date"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
            placeholder="选择日期">
          </el-date-picker>

        <label>地点：</label>
        <input type="text" class="s_time" v-model="searchData.address"/>
        <span class="btn-blue-s sear_btn">查询</span>
      </div>
      <div class="gonggao_body table_body">
        <div class="data_table_head">
          <ul>
            <li class="td10 xh">序号</li>
            <li class="td14">申请日期</li>
            <li class="td22">时间</li>
            <li class="td14">地点</li>
            <li class="td13">人数</li>
            <li class="td13">状态</li>
            <li class="td13">操作</li>
          </ul>
        </div>
        <div class="data_table_body">
          <ul v-for="(l, i) in list" v-if="list.length>0">
            <li class="td10 xh">{{ i+1 }}</li>
            <li class="td14">{{ l.createTime }}</li>
            <li class="td22">{{ l.startDate }}  --  {{ l.endDate }}</li>
            <li class="td14">{{ l.location }}</li>
            <li class="td13">{{ l.peopleNumber }}</li>
            <li class="td13">{{ l.handleState==1?'待定':'已定' }}</li>
            <li class="td13">
              <a href="javascript:void(0);" class="table_pa" v-on:click="viewPop(l.placeApplyId)">查看</a>
            </li>
          </ul>
          <ul v-if="list.length==0">
            <li style="width:100%;text-align:center;color:red;">暂无数据</li>
          </ul>
        </div>
      </div>

      <oa-page ref="childPage"></oa-page>

      <div class="bgpop" v-if="viewData.isShow" v-on:click="closePop"></div>
      <div class="kecha_pop" style="width:800px;height:368px;" v-if="viewData.isShow">
        <span class="closexx" style="margin-right:10px;" v-on:click="closePop"><Icon type="android-cancel"></Icon></span>
        <table cellpadding="0" cellspacing="0" border="1">
          <tr>
            <td colspan="4" class="head">场地详情</td>
          </tr>
          <tr class="x">
            <td class="b" width="20%">时间</td>
            <td width="30%">{{ OACommon.getOADate(new Date(viewData.vdata.startTime)).todayDate }} -- {{ OACommon.getOADate(new Date(viewData.vdata.endTime)).todayDate }}</td>
            <td class="b" width="20%">地点</td>
            <td width="30%">{{ viewData.vdata.location }}</td>
          </tr>
          <tr class="x">
            <td class="b" width="20%">场地标准</td>
            <td width="30%">{{ viewData.vdata.placeStandard }}</td>
            <td class="b" width="20%">人数</td>
            <td width="30%">{{ viewData.vdata.peopleNumber }}</td>
          </tr>
          <tr class="x">
            <td class="b" width="20%">人均钱数标准</td>
            <td width="30%">{{ viewData.vdata.onePeopleStandard }}</td>
            <td class="b" width="20%">人均实际标准</td>
            <td width="30%">{{ viewData.vdata.onePeopleReality }}</td>
          </tr>
          <tr class="x">
            <td class="b" width="20%">要求</td>
            <td colspan="3">{{ viewData.vdata.placeRequire }}</td>
          </tr>
          <tr class="x">
            <td class="b" width="20%">酒店</td>
            <td colspan="3">{{ viewData.vdata.hotel }}</td>
          </tr>
          <tr class="x">
            <td class="b" width="20%">备注</td>
            <td colspan="3">{{ viewData.vdata.remark }}</td>
          </tr>
        </table>
        <div style="text-align:center;margin-top:20px;margin-bottom:20px;">
          <span class="btn-blue" v-on:click="closePop">关闭</span>
        </div>
      </div>
  </div>
</template>

<script>
import $ from 'jquery'
import oaPage from '@/components/commonVue/Page'

export default {
  name: 'coursePlanApply',
  components: {
      'oa-page': oaPage
    },
  data () {
    return {
      path: this.OACommon["publicDef"]["qpath"],
      searchData: {
        startDate: '',
        endDate: '',
        address: ''
      },
      pageNum: 1,
      pageSize: 10,
      list: [],
      viewData: {
        isShow: false,
        vdata: {}
      }
    }  
  },
  created: function () {
    this.setInitSearchData();          //设置搜索框内容
    this.getList();
  },
  methods: {
    closePop: function(){
      this.viewData.isShow = false;
    },
    viewPop: function(id){
      $.ajax({
        url: this.path + "findPlaceApplyById",
        type: "post",
        dataType: "json",
        data: {
          "jobNumber": localStorage.getItem("jobNumber"),
          "sessionIdOa": localStorage.getItem("sessionIdOa"),
          "placeApplyId": id
        },
        success: function(data){
          this.viewData.isShow = true;
          this.viewData.vdata = data["data"];
        }.bind(this),
        error: function(){
          console.log("获取场地详情异常");
        }
      });
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
        url: this.path + "findPlaceApplyListPage",
        type: "post",
        dataType: "json",
        data: {
          "jobNumber": localStorage.getItem("jobNumber"),
          "sessionIdOa": localStorage.getItem("sessionIdOa"),
          "startDate": this.searchData.startDate,
          "endDate": this.searchData.endDate,
          "location": this.searchData.address,
          "pageNum": this.pageNum,
          "pageSize": this.pageSize
        },
        success: function(data){
          this.list = data["data"]["list"];

          this.$refs.childPage.setArg(data["data"]["pages"], this.pageNum, this.pageSize, this.getList);
        }.bind(this),
        error: function(){
          console.log("获取个人代办列表异常");
        }
      });
    },
    setInitSearchData: function(){
      //设置时间
      //this.searchData.startDate = this.OACommon.getOADate(new Date()).prevMonthToday;
      //this.searchData.endDate = this.OACommon.getOADate(new Date()).todayDate;
    }
  }
}
</script>
<style>

</style>

